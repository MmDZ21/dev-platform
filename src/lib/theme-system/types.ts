import { ReactNode } from 'react';
import { z } from 'zod';

// Theme Configuration
export interface ThemeConfig {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  extends?: string; // Base theme to extend from
  
  // Auto-discovery paths
  paths?: {
    components?: string;
    layouts?: string;
    blocks?: string;
    assets?: string;
  };

  // Design tokens
  tokens?: {
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    spacing?: Record<string, string>;
    shadows?: Record<string, string>;
    borders?: Record<string, string>;
    animations?: Record<string, string>;
    breakpoints?: Record<string, string>;
    [key: string]: Record<string, string> | undefined;
  };

  // Internationalization
  i18n?: Record<string, Record<string, string>>;

  // Custom settings
  settings?: Record<string, any>;
}

// Component Definition
export interface ComponentDefinition {
  name: string;
  Component: React.ComponentType<any>;
  category?: string;
  description?: string;
  schema?: z.ZodSchema;
}

// Layout Definition
export interface LayoutDefinition {
  name: string;
  Component: React.ComponentType<any>;
  slots?: string[];
  description?: string;
}

// Block Definition  
export interface BlockDefinition {
  name: string;
  Component: React.ComponentType<any>;
  category?: string;
  description?: string;
  schema?: z.ZodSchema;
}

// Route Resolver
export interface RouteResolver {
  (ctx: {
    path: string;
    locale: string;
    searchParams?: Record<string, string | string[]>;
  }): Promise<PageData | null>;
}

// Component Export
export interface ComponentExport {
  default?: React.ComponentType<any>;
  schema?: z.ZodSchema;
  [key: string]: any;
}

// Theme Registry
export interface ThemeRegistry {
  config: ThemeConfig;
  components: Map<string, ComponentDefinition>;
  layouts: Map<string, LayoutDefinition>;
  blocks: Map<string, BlockDefinition>;
  resolvers: Map<string, RouteResolver>;
}

// Page Data for rendering
export interface PageData {
  id: string;
  title: string;
  layout: string;
  slots: Record<string, Array<{ type: string; props: unknown }>>;
  meta?: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonical?: string;
  };
}

// Layout Props
export interface LayoutProps {
  slots: Record<string, ReactNode[]>;
  page: {
    id: string;
    title: string;
    path?: string;
    locale: string;
  };
}

// Block Props
export interface BlockProps {
  locale: string;
  [key: string]: any;
}
