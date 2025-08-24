import { z } from "zod";
import { ReactNode } from "react";

export type PageSlots = Record<string, Array<{ type: string; props: unknown }>>;

export interface PageDocument {
  id: string;
  title: string;
  path: string;
  locale: string;
  layoutKey: string;
  slots: PageSlots;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
}

export interface LayoutProps {
  /**
   * A mapping of slot name to list of rendered blocks for that slot.
   */
  slots: Record<string, ReactNode[]>;
  page: Pick<PageDocument, "id" | "title" | "path" | "locale">;
}

export interface LayoutDefinition {
  key: string;
  slots: string[];
  Component: (props: LayoutProps) => ReactNode | Promise<ReactNode>;
}

export interface BlockDefinition<TSchema extends z.ZodTypeAny> {
  /** Unique type id, typically `${themeId}.${blockKey}` */
  type: string;
  schema: TSchema;
  /**
   * Prefer RSC; add "use client" inside implementation only if necessary.
   */
  Component: (
    props: z.infer<TSchema> & { locale: string }
  ) => ReactNode | Promise<ReactNode>;
}

export interface ThemeManifest {
  id: string;
  name: string;
  version: string;
  /** Optional public assets base under /public */
  assetsBasePath?: string;
  /** i18n messages per-locale (optional) */
  messages?: Record<string, Record<string, string>>;
  defaultLayout: string;
  layouts: Record<string, LayoutDefinition>;
  blocks: Record<string, BlockDefinition<z.ZodTypeAny>>;
  /**
   * Optional dynamic resolver for virtual pages.
   * Allows themes to render content types (e.g., posts, products) without hardcoded routes.
   */
  resolveDynamic?: (ctx: { path: string; locale: string; searchParams?: Record<string, string | string[]> }) => Promise<PageDocument | null>;
}

export type Direction = "rtl" | "ltr";

export interface SiteSettingsDoc {
  id: string;
  activeTheme: string;
  defaultLocale: string;
  supportedLocales: string[];
  directionByLocale: Record<string, Direction>;
  baseUrl?: string | null;
  themeSettings?: unknown;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
}


