import { ReactNode } from "react";
import { z } from "zod";
import { getTheme } from "./registry";
import { BlockDefinition, LayoutDefinition, PageDocument, PageSlots } from "./types";

function renderBlocksForSlot(
  slotBlocks: Array<{ type: string; props: unknown }> | undefined,
  blocks: Record<string, BlockDefinition<z.ZodTypeAny>>,
  locale: string
): Promise<ReactNode[]> | ReactNode[] {
  if (!slotBlocks || slotBlocks.length === 0) return [];
  return Promise.all(
    slotBlocks.map(async (b) => {
      // Support referencing block types as either 'local' or 'themeId.local'
      const def =
        blocks[b.type] ||
        // If type is namespaced, try local alias
        (b.type.includes(".") ? blocks[b.type.split(".", 2)[1]] : undefined);
      if (!def) return null;
      const parsed = def.schema.safeParse(b.props ?? {});
      if (!parsed.success) return null;
      return await def.Component({ ...(parsed.data as any), locale });
    })
  );
}

export async function renderPageWithTheme(
  themeId: string,
  page: PageDocument
): Promise<ReactNode> {
  const theme = getTheme(themeId);
  if (!theme) {
    return null;
  }

  const layoutKey = page.layoutKey || theme.defaultLayout;
  const layout: LayoutDefinition | undefined = theme.layouts[layoutKey];
  if (!layout) {
    return null;
  }

  const renderedSlots: Record<string, ReactNode[]> = {};
  const slotNames = layout.slots.length ? layout.slots : Object.keys(page.slots || {} as PageSlots);
  for (const slotName of slotNames) {
    const content = await renderBlocksForSlot(page.slots?.[slotName], theme.blocks, page.locale);
    renderedSlots[slotName] = (content as ReactNode[])
      .filter(Boolean)
      .map((node, index) => {
        // Wrap with keyed fragment to avoid key warnings
        return <div key={`${slotName}-${index}`}>{node}</div>;
      });
  }

  return await layout.Component({
    slots: renderedSlots,
    page: { id: page.id, title: page.title, path: page.path, locale: page.locale },
  });
}

export async function tryRenderDynamicWithTheme(
  themeId: string,
  ctx: { path: string; locale: string; searchParams?: Record<string, string | string[]> }
): Promise<ReactNode | null> {
  const theme = getTheme(themeId);
  if (!theme || !theme.resolveDynamic) return null;
  const virtualPage = await theme.resolveDynamic(ctx);
  if (!virtualPage) return null;
  return renderPageWithTheme(themeId, virtualPage);
}


