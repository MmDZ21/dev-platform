// Core theme system exports (browser-safe)
export * from './types';
export * from './registry';
export * from './renderer';

// Convenience exports for common use cases
export {
  registerTheme,
  setActiveTheme,
  getActiveTheme,
  getTheme,
  getAllThemes,
  getComponent,
  getLayout,
  getBlock,
  getBlocksByCategory,
  resolveRoute,
  registerComponent,
  registerLayout,
  registerBlock,
  registerResolver
} from './registry';

export {
  renderPageWithTheme,
  tryRenderDynamicRoute,
  BlockRenderer,
  LayoutRenderer,
  SlotRenderer
} from './renderer';
