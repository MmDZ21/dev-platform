import { 
  ThemeConfig, 
  ThemeRegistry, 
  ComponentDefinition, 
  LayoutDefinition, 
  BlockDefinition,
  RouteResolver,
  PageData
} from './types';

class ThemeRegistryManager {
  private themes = new Map<string, ThemeRegistry>();
  private activeThemeId: string | null = null;

  /**
   * Register a theme with auto-discovery of components
   */
  async registerTheme(config: ThemeConfig): Promise<void> {
    const registry: ThemeRegistry = {
      config,
      components: new Map(),
      layouts: new Map(), 
      blocks: new Map(),
      resolvers: new Map()
    };

    // If extending another theme, inherit from it
    if (config.extends) {
      await this.inheritFromTheme(registry, config.extends);
    }

    this.themes.set(config.id, registry);
  }

  /**
   * Get active theme registry
   */
  getActiveTheme(): ThemeRegistry | null {
    if (!this.activeThemeId) return null;
    return this.themes.get(this.activeThemeId) || null;
  }

  /**
   * Set active theme
   */
  setActiveTheme(themeId: string): void {
    if (!this.themes.has(themeId)) {
      throw new Error(`Theme '${themeId}' not found`);
    }
    this.activeThemeId = themeId;
  }

  /**
   * Get theme by ID
   */
  getTheme(themeId: string): ThemeRegistry | null {
    return this.themes.get(themeId) || null;
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): ThemeRegistry[] {
    return Array.from(this.themes.values());
  }

  /**
   * Get component by name from active theme
   */
  getComponent(name: string): ComponentDefinition | null {
    const theme = this.getActiveTheme();
    return theme?.components.get(name) || null;
  }

  /**
   * Get layout by name from active theme
   */
  getLayout(name: string): LayoutDefinition | null {
    const theme = this.getActiveTheme();
    return theme?.layouts.get(name) || null;
  }

  /**
   * Get block by name from active theme
   */
  getBlock(name: string): BlockDefinition | null {
    const theme = this.getActiveTheme();
    return theme?.blocks.get(name) || null;
  }

  /**
   * Get blocks by category from active theme
   */
  getBlocksByCategory(category: string): BlockDefinition[] {
    const theme = this.getActiveTheme();
    if (!theme) return [];
    
    return Array.from(theme.blocks.values()).filter(
      block => block.category === category
    );
  }

  /**
   * Resolve route using active theme's resolvers
   */
  async resolveRoute(ctx: {
    path: string;
    locale: string;
    searchParams?: Record<string, string | string[]>;
  }): Promise<PageData | null> {
    const theme = this.getActiveTheme();
    if (!theme) return null;

    for (const [pattern, resolver] of theme.resolvers) {
      if (this.matchRoute(ctx.path, pattern)) {
        const result = await resolver(ctx);
        if (result) return result;
      }
    }

    return null;
  }

  /**
   * Register a component with the active theme
   */
  registerComponent(name: string, definition: ComponentDefinition): void {
    const theme = this.getActiveTheme();
    if (!theme) throw new Error('No active theme set');
    theme.components.set(name, definition);
  }

  /**
   * Register a layout with the active theme
   */
  registerLayout(name: string, definition: LayoutDefinition): void {
    const theme = this.getActiveTheme();
    if (!theme) throw new Error('No active theme set');
    theme.layouts.set(name, definition);
  }

  /**
   * Register a block with the active theme
   */
  registerBlock(name: string, definition: BlockDefinition): void {
    const theme = this.getActiveTheme();
    if (!theme) throw new Error('No active theme set');
    theme.blocks.set(name, definition);
  }

  /**
   * Register a route resolver with the active theme
   */
  registerResolver(pattern: string, resolver: RouteResolver): void {
    const theme = this.getActiveTheme();
    if (!theme) throw new Error('No active theme set');
    theme.resolvers.set(pattern, resolver);
  }

  /**
   * Simple route pattern matching
   */
  private matchRoute(path: string, pattern: string): boolean {
    if (pattern === path) return true;
    if (pattern.endsWith('/*')) {
      const basePath = pattern.slice(0, -2);
      return path.startsWith(basePath);
    }
    return false;
  }

  /**
   * Inherit components from base theme
   */
  private async inheritFromTheme(registry: ThemeRegistry, baseThemeId: string): Promise<void> {
    const baseTheme = this.themes.get(baseThemeId);
    if (!baseTheme) {
      throw new Error(`Base theme '${baseThemeId}' not found`);
    }

    // Copy all components
    for (const [name, component] of baseTheme.components) {
      registry.components.set(name, { ...component });
    }
    
    for (const [name, layout] of baseTheme.layouts) {
      registry.layouts.set(name, { ...layout });
    }
    
    for (const [name, block] of baseTheme.blocks) {
      registry.blocks.set(name, { ...block });
    }

    for (const [pattern, resolver] of baseTheme.resolvers) {
      registry.resolvers.set(pattern, resolver);
    }
  }
}

// Global instance
const themeRegistry = new ThemeRegistryManager();

// Convenience exports
export const registerTheme = (config: ThemeConfig) => themeRegistry.registerTheme(config);
export const setActiveTheme = (themeId: string) => themeRegistry.setActiveTheme(themeId);
export const getActiveTheme = () => themeRegistry.getActiveTheme();
export const getTheme = (themeId: string) => themeRegistry.getTheme(themeId);
export const getAllThemes = () => themeRegistry.getAllThemes();
export const getComponent = (name: string) => themeRegistry.getComponent(name);
export const getLayout = (name: string) => themeRegistry.getLayout(name);
export const getBlock = (name: string) => themeRegistry.getBlock(name);
export const getBlocksByCategory = (category: string) => themeRegistry.getBlocksByCategory(category);
export const resolveRoute = (ctx: any) => themeRegistry.resolveRoute(ctx);
export const registerComponent = (name: string, definition: ComponentDefinition) => themeRegistry.registerComponent(name, definition);
export const registerLayout = (name: string, definition: LayoutDefinition) => themeRegistry.registerLayout(name, definition);
export const registerBlock = (name: string, definition: BlockDefinition) => themeRegistry.registerBlock(name, definition);
export const registerResolver = (pattern: string, resolver: RouteResolver) => themeRegistry.registerResolver(pattern, resolver);

export default themeRegistry;
