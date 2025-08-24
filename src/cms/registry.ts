import { ThemeManifest } from "./types";

const themeRegistry = new Map<string, ThemeManifest>();

function normalizeThemeManifest(theme: ThemeManifest): ThemeManifest {
  const layouts: ThemeManifest["layouts"] = { ...theme.layouts };
  // Add absolute aliases for layouts: `${theme.id}.${key}` → same layout
  for (const key of Object.keys(theme.layouts)) {
    const absKey = `${theme.id}.${key}`;
    if (!layouts[absKey]) layouts[absKey] = theme.layouts[key];
  }

  const blocks: ThemeManifest["blocks"] = { ...theme.blocks };
  for (const key of Object.keys(theme.blocks)) {
    const def = theme.blocks[key];
    if (key.includes(".")) {
      const [ns, local] = key.split(".", 2);
      if (ns === theme.id && local && !blocks[local]) {
        // Add local alias: 'hero' for 'themeId.hero'
        blocks[local] = def;
      }
    } else {
      // Add absolute alias: 'themeId.hero' for 'hero'
      const absKey = `${theme.id}.${key}`;
      if (!blocks[absKey]) blocks[absKey] = def;
    }
  }

  return { ...theme, layouts, blocks };
}

export function registerTheme(theme: ThemeManifest) {
  const normalized = normalizeThemeManifest(theme);
  themeRegistry.set(normalized.id, normalized);
}

export function getTheme(themeId: string): ThemeManifest | undefined {
  return themeRegistry.get(themeId);
}

export function getAllThemes(): ThemeManifest[] {
  return Array.from(themeRegistry.values());
}


