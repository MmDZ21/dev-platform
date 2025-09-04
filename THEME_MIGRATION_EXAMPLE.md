# 🔄 Theme System Migration Example

## Before (Old System)

### Complex Manifest Setup
```typescript
// src/themes/ranin/manifest.tsx
import { registerTheme } from "@/cms";
import type { ThemeManifest, PageDocument } from "@/cms/types";
import HomeLayout from "./layouts/HomeLayout";
import ProductsLayout from "./layouts/ProductsLayout";
import MainLayout from "./layouts/MainLayout";
import { Hero, heroSchema } from "./blocks/Hero";
import { HighlightCards, highlightCardsSchema } from "./blocks/HighlightCards";
// ... 20+ more imports

const manifest: ThemeManifest = {
  id: "ranin",
  name: "Ranin",
  version: "0.1.0",
  assetsBasePath: "/themes/ranin",
  defaultLayout: "main",
  layouts: {
    main: { key: "main", slots: ["topbar", "nav", "content", "footer"], Component: MainLayout },
    home: { key: "home", slots: ["topbar", "nav", "hero", "highlights", "stats", "parallax", "sections", "newsletter", "content", "footer"], Component: HomeLayout },
    products: { key: "products", slots: ["topbar", "nav", "filters", "content", "footer"], Component: ProductsLayout },
  },
  blocks: {
    "ranin.hero": { type: "ranin.hero", schema: heroSchema, Component: Hero },
    "ranin.highlightCards": { type: "ranin.highlightCards", schema: highlightCardsSchema, Component: HighlightCards },
    // ... 20+ more manual registrations
  },
  resolveDynamic: async ({ path, locale, searchParams }) => {
    // 100+ lines of routing logic mixed with theme definition
  },
};

registerTheme(manifest);
```

## After (New System)

### Simple Config-Based Setup
```typescript
// src/themes/ranin-v2/theme.config.ts
import { ThemeConfig } from '@/lib/theme-system/types';

const config: ThemeConfig = {
  id: 'ranin-v2',
  name: 'Ranin v2',
  version: '2.0.0',
  description: 'A modern, flexible theme for business websites',
  
  // Auto-discovery - no manual imports needed!
  paths: {
    layouts: 'layouts',
    blocks: 'blocks', 
    components: 'components',
    assets: 'assets'
  },

  // Design tokens - properly organized
  tokens: {
    colors: {
      primary: '136, 95%, 26%',
      background: '0 0% 100%',
      foreground: '224 71% 4%'
    },
    spacing: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem'
    },
    typography: {
      'font-outfit': 'IranSans, sans-serif'
    }
  },

  // Clean i18n support
  i18n: {
    fa: {
      'nav.home': 'خانه',
      'nav.products': 'محصولات'
    },
    en: {
      'nav.home': 'Home',
      'nav.products': 'Products'
    }
  }
};

export default config;
```

### Simple Registration
```typescript
// src/themes/ranin-v2/index.ts
import { registerTheme } from '@/lib/theme-system';
import config from './theme.config';
import './tokens.css';

// That's it! Auto-discovery handles the rest
registerTheme(config);
```

### Clean Component Structure
```typescript
// src/themes/ranin-v2/blocks/Hero.tsx
import React from 'react';
import { z } from 'zod';

export const schema = z.object({
  title: z.string(),
  subtitle: z.string().optional()
});

type HeroProps = z.infer<typeof schema>;

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="hero">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </section>
  );
}

export const config = {
  category: 'hero',
  preview: '/previews/hero.png'
};

// No manual registration needed - auto-discovered!
```

## Benefits

### ✅ 90% Less Boilerplate
- Old system: ~200 lines of manifest setup
- New system: ~50 lines of config

### ✅ Auto-Discovery
- No manual component imports
- No manual registration
- File-based conventions

### ✅ Better Organization
- Design tokens separated from logic
- Clean folder structure
- Type-safe configurations

### ✅ Theme Inheritance
```typescript
const config: ThemeConfig = {
  id: 'my-custom-theme',
  extends: 'ranin-v2', // Inherit everything from ranin-v2
  tokens: {
    colors: {
      primary: 'hsl(300, 100%, 50%)' // Just override what you need
    }
  }
};
```

### ✅ Developer Experience
```bash
# Create new theme in seconds
npm run theme:create

# List all themes
npm run theme:list

# Start dev server with hot-reloading
npm run theme dev my-theme
```

## Migration Steps

1. **Create new theme structure**:
   ```bash
   npm run theme:create --name my-theme-v2 --base ranin-v2
   ```

2. **Copy existing components**:
   - Move layouts to `layouts/`
   - Move blocks to `blocks/`
   - Move components to `components/`

3. **Update component exports**:
   ```typescript
   // Add export config to existing components
   export const config = {
     category: 'content',
     preview: '/previews/component.png'
   };
   ```

4. **Create theme config**:
   - Extract design tokens from CSS
   - Set up i18n messages
   - Configure auto-discovery paths

5. **Register and test**:
   ```typescript
   import './themes/my-theme-v2';
   setActiveTheme('my-theme-v2');
   ```

## Result

- **Faster development**: Create themes in minutes, not hours
- **Better maintainability**: Clean separation of concerns
- **Easier customization**: Token-based design system
- **Type safety**: Full TypeScript support
- **Developer tools**: CLI, hot-reloading, validation

The new theme system transforms a complex, manual process into a simple, declarative experience! 🚀
