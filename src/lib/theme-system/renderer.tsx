import React from 'react';
import { getActiveTheme, getLayout, getBlock } from './registry';
import { PageData, LayoutProps } from './types';

/**
 * Render a page using the active theme
 */
export async function renderPageWithTheme(pageData: PageData): Promise<React.ReactNode> {
  const theme = getActiveTheme();
  if (!theme) {
    console.error('No active theme set');
    return null;
  }

  const layout = getLayout(pageData.layout);
  if (!layout) {
    console.error(`Layout '${pageData.layout}' not found in active theme`);
    return null;
  }

  // Render all slots
  const renderedSlots: Record<string, React.ReactNode[]> = {};
  
  for (const [slotName, blocks] of Object.entries(pageData.slots)) {
    renderedSlots[slotName] = await Promise.all(
      blocks.map(async (block, index) => {
        const blockDef = getBlock(block.type);
        if (!blockDef) {
          console.warn(`Block '${block.type}' not found in active theme`);
          return null;
        }

        // Validate props if schema exists
        if (blockDef.schema) {
          const result = blockDef.schema.safeParse(block.props);
          if (!result.success) {
            console.warn(`Invalid props for block '${block.type}':`, result.error);
            return null;
          }
        }

        return React.createElement(blockDef.Component, {
          key: `${slotName}-${index}`,
          ...block.props
        });
      })
    );
  }

  // Filter out null blocks
  for (const [slotName, blocks] of Object.entries(renderedSlots)) {
    renderedSlots[slotName] = blocks.filter(Boolean);
  }

  const layoutProps: LayoutProps = {
    slots: renderedSlots,
    page: {
      id: pageData.id,
      title: pageData.title,
      locale: 'fa', // TODO: Get from context
    }
  };

  return React.createElement(layout.Component, layoutProps);
}

/**
 * Try to render a dynamic route using theme resolvers
 */
export async function tryRenderDynamicRoute(ctx: {
  path: string;
  locale: string;
  searchParams?: Record<string, string | string[]>;
}): Promise<React.ReactNode | null> {
  const theme = getActiveTheme();
  if (!theme) return null;

  for (const [pattern, resolver] of theme.resolvers) {
    if (matchRoute(ctx.path, pattern)) {
      const pageData = await resolver(ctx);
      if (pageData) {
        return await renderPageWithTheme(pageData);
      }
    }
  }

  return null;
}

/**
 * Component for rendering individual blocks
 */
export function BlockRenderer({ 
  type, 
  props = {}, 
  locale = 'fa' 
}: { 
  type: string; 
  props?: any; 
  locale?: string; 
}) {
  const block = getBlock(type);
  
  if (!block) {
    console.warn(`Block '${type}' not found`);
    return null;
  }

  // Validate props if schema exists
  if (block.schema) {
    const result = block.schema.safeParse(props);
    if (!result.success) {
      console.warn(`Invalid props for block '${type}':`, result.error);
      return null;
    }
  }

  return React.createElement(block.Component, { locale, ...props });
}

/**
 * Component for rendering layouts
 */
export function LayoutRenderer({ 
  name, 
  slots = {}, 
  page 
}: { 
  name: string; 
  slots?: Record<string, React.ReactNode[]>; 
  page: any; 
}) {
  const layout = getLayout(name);
  
  if (!layout) {
    console.warn(`Layout '${name}' not found`);
    return null;
  }

  const layoutProps: LayoutProps = { slots, page };
  return React.createElement(layout.Component, layoutProps);
}

/**
 * Component for rendering slot content
 */
export function SlotRenderer({ 
  name, 
  content = [] 
}: { 
  name: string; 
  content?: React.ReactNode[]; 
}) {
  return (
    <div data-slot={name}>
      {content.map((node, index) => (
        <React.Fragment key={`${name}-${index}`}>
          {node}
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Simple route pattern matching
 */
function matchRoute(path: string, pattern: string): boolean {
  if (pattern === path) return true;
  if (pattern.endsWith('/*')) {
    const basePath = pattern.slice(0, -2);
    return path.startsWith(basePath);
  }
  return false;
}
