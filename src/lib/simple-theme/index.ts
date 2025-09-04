import React from "react";
import dynamic from "next/dynamic";

// VERY SIMPLE, DEV-FRIENDLY THEME SYSTEM
// - Auto-discovers layouts and blocks by scanning the theme folder with webpack's require.context (server-side)
// - No manual registration per component
// - Optional resolvers.ts for dynamic routes
// - Keys are derived from filenames (e.g., HomeLayout.tsx → 'HomeLayout', with aliases: 'home')

// Allow require.context in TypeScript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;

export type SimplePageData = {
  id: string;
  title: string;
  layout: string; // e.g., 'HomeLayout' or 'home'
  slots: Record<string, Array<{ type: string; props: any }>>;
  meta?: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonical?: string;
  };
};

type ResolverFn = (ctx: {
  path: string;
  locale: string;
  searchParams?: Record<string, string | string[]>;
}) => Promise<SimplePageData | React.ReactNode | null>;

type RouteMatcher = { regex: RegExp; paramNames: string[]; importPath: string };

type ThemeRegistry = {
  layouts: Map<string, React.ComponentType<any>>;
  blocks: Map<string, { Component: React.ComponentType<any>; schema?: any }>;
  resolvers: ResolverFn[];
  layoutDefaults?: Record<string, Record<string, Array<{ type: string; props: any }>>>;
  routeMatchers?: RouteMatcher[];
};

const themeCache = new Map<string, ThemeRegistry>();

// Server-side helpers only; no React context in Server Components

function toKeyVariants(base: string): string[] {
  const nameWithExt = base.replace(/^\.\//, "");
  const file = nameWithExt.split("/").pop() || base;
  const name = file.replace(/\.(t|j)sx?$/i, "");
  const lower = name.toLowerCase();
  const alias = lower.replace(/layout$/, "");
  return Array.from(new Set([name, lower, alias]));
}

function pickComponent(mod: any, fallbackName: string): React.ComponentType<any> | null {
  if (!mod) return null;
  if (mod.default && typeof mod.default === "function") return mod.default;
  if (mod[fallbackName] && typeof mod[fallbackName] === "function") return mod[fallbackName];
  for (const key of Object.keys(mod)) {
    if (typeof mod[key] === "function") return mod[key] as React.ComponentType<any>;
  }
  return null;
}

function wrapResolver(fn: any): ResolverFn | null {
  if (typeof fn !== "function") return null;
  return async (ctx) => {
    try {
      return await fn(ctx);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("resolver error:", err);
      return null;
    }
  };
}

// Pure auto-discovery theme system using direct dynamic imports
async function getThemeSources(themeId: string): Promise<{
  layoutsMap?: Record<string, () => Promise<any>>;
  blocksMap?: Record<string, () => Promise<any>>;
  generatedResolvers?: ResolverFn[];
  importLayoutDefaults?: () => Promise<any>;
  routeMatchers?: RouteMatcher[];
} | null> {
  try {
    console.log(`🔍 Auto-discovering theme '${themeId}'...`);
    // Use direct imports for known components since require.context path flattening is causing issues
    const layoutsMap: Record<string, () => Promise<any>> = {};
    const blocksMap: Record<string, () => Promise<any>> = {};

    console.log(`Scanning file system for theme '${themeId}'...`);
    
    // Use Node.js fs to scan the actual file system
    const fs = require('fs');
    const path = require('path');
    
    // Resolve theme directory from project root to avoid bundler-specific __dirname paths
    const themePath = path.join(process.cwd(), 'src', 'themes', themeId);
    console.log(`Looking for theme at: ${themePath}`);
    
    if (!fs.existsSync(themePath)) {
      console.warn(`Theme directory not found: ${themePath}`);
      return null;
    }

    // Scan layouts directory
    const layoutsPath = path.join(themePath, 'layouts');
    if (fs.existsSync(layoutsPath)) {
      const layoutFiles = fs.readdirSync(layoutsPath).filter((file: string) => 
        file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')
      );
      
      console.log(`Found layout files: ${layoutFiles}`);
      
      for (const file of layoutFiles) {
        const componentName = file.replace(/\.(tsx?|jsx?)$/, '');
        try {
          const importer = () => import(`../../themes/${themeId}/layouts/${componentName}`);
          layoutsMap[componentName] = importer;
          console.log(`✅ Auto-discovered layout: ${componentName}`);
        } catch (error) {
          console.warn(`Failed to import layout ${componentName}:`, error);
        }
      }
    }

    // Scan blocks directory
    const blocksPath = path.join(themePath, 'blocks');
    if (fs.existsSync(blocksPath)) {
      const blockFiles = fs.readdirSync(blocksPath).filter((file: string) => 
        file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')
      );
      
      console.log(`Found block files: ${blockFiles}`);
      
      for (const file of blockFiles) {
        const componentName = file.replace(/\.(tsx?|jsx?)$/, '');
        try {
          const importer = () => import(`../../themes/${themeId}/blocks/${componentName}`);
          blocksMap[componentName] = importer;
          console.log(`✅ Auto-discovered block: ${componentName}`);
        } catch (error) {
          console.warn(`Failed to import block ${componentName}:`, error);
        }
      }
    }

    // Auto-generate resolvers from routes directory (file-based routing)
    const generatedResolvers: ResolverFn[] = [];
    const routeMatchers: RouteMatcher[] = [];
    const routesPath = path.join(themePath, 'routes');
    if (fs.existsSync(routesPath)) {
      const routeFiles: string[] = [];
      const walk = (dir: string, base = '') => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          if (entry.isDirectory()) walk(path.join(dir, entry.name), path.join(base, entry.name));
          else if (
            /^(page|index)\.(t|j)sx?$/i.test(entry.name) ||
            /^\[.*\]\.(t|j)sx?$/i.test(entry.name) // support flat dynamic files like [slug].ts
          ) routeFiles.push(path.join(base, entry.name));
        }
      };
      walk(routesPath);

      const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const buildMatcher = (relFile: string) => {
        const rel = relFile.replace(/\\/g, '/').replace(/\.(t|j)sx?$/, '');
        // Treat .../page as the directory path (Next-like), drop trailing /page or /index
        const normalized = rel.replace(/\/(page|index)$/i, '');
        const segments = normalized.split('/').filter(Boolean);
        const paramNames: string[] = [];
        const out = segments.map(seg => {
          if (seg === 'index') return '';
          const m = seg.match(/^\[(\.\.\.)?(.+)\]$/);
          if (m) {
            const isCatchAll = Boolean(m[1]);
            const name = m[2];
            paramNames.push(name);
            return isCatchAll ? '(.*)' : '([^/]+)';
          }
          return escapeRegex(seg);
        }).filter(Boolean);
        const pattern = '^/' + out.join('/') + '$';
        return { regex: new RegExp(pattern), paramNames, importPath: rel };
      };

      for (const relFile of routeFiles) {
        const { regex, paramNames, importPath } = buildMatcher(relFile);
        routeMatchers.push({ regex, paramNames, importPath });
        const resolver: ResolverFn = async (ctx) => {
          const m = ctx.path.match(regex);
          if (!m) return null;
          const params: Record<string, string> = {};
          paramNames.forEach((n, i) => { params[n] = m[i + 1]; });
          try {
            const mod = await import(`../../themes/${themeId}/routes/${importPath}`);
            // Next-like options: default({ params, searchParams }) returns ReactNode OR PageData
            const handler = (mod && (mod.default || (mod as any).GET || (mod as any).resolve)) as undefined | ((args: any) => Promise<any>);
            if (typeof handler === 'function') return await handler({ params, searchParams: ctx.searchParams });
            if ((mod as any).page) return (mod as any).page;
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('route import error:', err);
          }
          return null;
        };
        generatedResolvers.push(resolver);
      }
    }

    // Try to import optional layout defaults module
    let importLayoutDefaults: (() => Promise<any>) | undefined;
    try {
      importLayoutDefaults = () => import(`../../themes/${themeId}/defaults`);
      console.log(`✅ Found layout defaults for ${themeId}`);
    } catch {
      // optional
    }

    console.log(`📦 Theme '${themeId}' discovery complete:`);
    console.log('📁 Layouts:', Object.keys(layoutsMap));
    console.log('🧩 Blocks:', Object.keys(blocksMap));

    if (Object.keys(layoutsMap).length === 0 && Object.keys(blocksMap).length === 0) {
      console.warn(`❌ No components found for theme '${themeId}'`);
      return null;
    }

    return {
      layoutsMap: Object.keys(layoutsMap).length > 0 ? layoutsMap : undefined,
      blocksMap: Object.keys(blocksMap).length > 0 ? blocksMap : undefined,
      generatedResolvers: generatedResolvers.length ? generatedResolvers : undefined,
      importLayoutDefaults,
      routeMatchers: routeMatchers.length ? routeMatchers : undefined
    };

  } catch (error) {
    console.error(`❌ Failed to discover theme '${themeId}':`, error);
    return null;
  }
}

export async function loadTheme(themeId: string) {
  if (themeCache.has(themeId)) return;

  const layouts = new Map<string, React.ComponentType<any>>();
  const blocks = new Map<string, { Component: React.ComponentType<any>; schema?: any }>();
  const resolvers: ResolverFn[] = [];
  let layoutDefaults: ThemeRegistry['layoutDefaults'];
  let routeMatchers: ThemeRegistry['routeMatchers'];

  const sources = await getThemeSources(themeId);
  if (!sources) {
    // eslint-disable-next-line no-console
    console.warn(`No theme sources mapped for themeId='${themeId}'`);
  }

  // Discover layouts from static map (safe with Turbopack)
  if (sources?.layoutsMap) {
    for (const [name, importer] of Object.entries(sources.layoutsMap)) {
      try {
        const mod = await importer();
        const comp = pickComponent(mod, name);
        if (comp) {
          for (const key of toKeyVariants(name)) layouts.set(key, comp);
        }
      } catch (_e) {}
    }
  }

  // Discover blocks from static map (safe with Turbopack)
  if (sources?.blocksMap) {
    for (const [typeKey, importer] of Object.entries(sources.blocksMap)) {
      try {
        // Preload once to detect schema exports
        const pre = await importer();

        // Try common schema export names or detect first zod-like object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let schema: any | undefined = pre?.schema;
        if (!schema) schema = (pre as any)?.navBarSchema;
        if (!schema) {
          for (const v of Object.values(pre || {})) {
            if (v && typeof v === "object" && typeof (v as any).safeParse === "function") { schema = v; break; }
          }
        }

        // Hydrate client blocks with dynamic(): ensures interactivity for "use client" components
        const DynamicComp = dynamic(async () => {
          const mod = await importer();
          const picked = pickComponent(mod, typeKey) as React.ComponentType<any> | null;
          return picked || (() => null);
        }, { ssr: true });

        const variants = new Set<string>([typeKey, typeKey.toLowerCase()]);
        for (const key of variants) blocks.set(key, { Component: DynamicComp, schema });
      } catch (_e) {}
    }
  }

  // Auto-generated file-based resolvers
  if (sources?.generatedResolvers && sources.generatedResolvers.length) {
    for (const r of sources.generatedResolvers) resolvers.push(r);
  }

  // Attach optional defaults if present
  if (sources?.importLayoutDefaults) {
    try {
      const mod = await sources.importLayoutDefaults();
      layoutDefaults = (mod && (mod.default || (mod as any).layoutDefaults)) as ThemeRegistry['layoutDefaults'];
    } catch (_e) {}
  }

  // Attach route matchers for SEO metadata extraction
  if (sources?.routeMatchers && sources.routeMatchers.length) {
    routeMatchers = sources.routeMatchers;
  }

  themeCache.set(themeId, { layouts, blocks, resolvers, layoutDefaults, routeMatchers });
}

export async function tryResolveDynamic(ctx: {
  themeId: string;
  path: string;
  locale: string;
  searchParams?: Record<string, string | string[]>;
}): Promise<React.ReactNode | null> {
  await loadTheme(ctx.themeId);
  const reg = themeCache.get(ctx.themeId);
  if (!reg) return null;
  for (const r of reg.resolvers) {
    const result = await r({ path: ctx.path, locale: ctx.locale, searchParams: ctx.searchParams });
    if (!result) continue;
    if (React.isValidElement(result)) return result;
    return renderPage(ctx.themeId, result as SimplePageData);
  }
  return null;
}

export async function tryResolveDynamicPageData(ctx: {
  themeId: string;
  path: string;
  locale: string;
  searchParams?: Record<string, string | string[]>;
}): Promise<SimplePageData | null> {
  await loadTheme(ctx.themeId);
  const reg = themeCache.get(ctx.themeId);
  if (!reg || !reg.routeMatchers) return null;
  for (const rm of reg.routeMatchers) {
    const m = ctx.path.match(rm.regex);
    if (!m) continue;
    const params: Record<string, string> = {};
    rm.paramNames.forEach((n, i) => { params[n] = m[i + 1]; });
    try {
      const mod = await import(`../../themes/${ctx.themeId}/routes/${rm.importPath}`);
      const handler = (mod && (mod.default || (mod as any).GET || (mod as any).resolve)) as undefined | ((args: any) => Promise<any>);
      if (typeof handler !== 'function') continue;
      const result = await handler({ params, searchParams: ctx.searchParams });
      if (result && typeof result === 'object' && (result as any).layout && (result as any).slots) {
        return result as SimplePageData;
      }
    } catch (_err) {
      // ignore and continue
    }
  }
  return null;
}

export function renderPage(themeId: string, page: SimplePageData): React.ReactNode {
  const reg = themeCache.get(themeId);
  if (!reg) return null;

  // Resolve layout
  const layoutCandidates = toKeyVariants(page.layout);
  let Layout: React.ComponentType<any> | undefined;
  for (const k of layoutCandidates) {
    const found = reg.layouts.get(k) || reg.layouts.get(k.toLowerCase());
    if (found) { Layout = found; break; }
  }
  if (!Layout) {
    // eslint-disable-next-line no-console
    console.error(`Layout '${page.layout}' not found in active theme`);
    return null;
  }

  // Render slots with optional layout defaults (auto-inject common chrome)
  const renderedSlots: Record<string, React.ReactNode[]> = {};
  const mergedSlots: Record<string, Array<{ type: string; props: any }>> = { ...(reg.layoutDefaults?.[page.layout] || {}), ...page.slots } as any;
  for (const [slot, items] of Object.entries(mergedSlots)) {
    renderedSlots[slot] = items.map((b, i) => {
      const typeKey = (b.type.includes(".")) ? b.type.split(".").pop()! : b.type;
      const lower = typeKey.toLowerCase();
      const def = reg.blocks.get(typeKey) || reg.blocks.get(lower);
      if (!def) {
        // eslint-disable-next-line no-console
        console.warn(`Block '${b.type}' not found`);
        return null;
      }
      let finalProps = b.props || {};
      if (def.schema && typeof def.schema.safeParse === "function") {
        const r = def.schema.safeParse(b.props);
        if (!r.success) {
          // eslint-disable-next-line no-console
          console.warn(`Invalid props for block '${b.type}':`, r.error?.message ?? r.error);
          return null;
        }
        // Use parsed data so defaults apply
        finalProps = r.data as Record<string, unknown>;
      }
      return React.createElement(def.Component, { key: `${slot}-${i}`, ...finalProps, locale: "fa" });
    }).filter(Boolean) as React.ReactNode[];
  }

  return React.createElement(Layout, {
    slots: renderedSlots,
    page: { id: page.id, title: page.title, locale: "fa" }
  });
}


// Lightweight React helpers to render slots in layouts with a Next-like component API
export function Slot(props: { slots: Record<string, React.ReactNode[]>; name: string; className?: string }) {
  const content = props.slots?.[props.name]?.[0] ?? null;
  if (!content) return null;
  return React.createElement(React.Fragment, null, content);
}

export function Slots(props: { slots: Record<string, React.ReactNode[]>; name: string; className?: string }) {
  const items = props.slots?.[props.name] ?? [];
  if (!items.length) return null;
  return React.createElement(React.Fragment, null, items);
}

// Render by component name: <Block name="NavBar" props={{...}} />
// Lightweight server-side Block renderer: resolved at renderPage time via closure
export function Block(_props: { name: string; props?: Record<string, unknown> }) {
  console.error('Block can only be used inside layouts rendered by the simple-theme system.');
  return null;
}

