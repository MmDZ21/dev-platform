// --- Direction ---
/**
 * پروژه به‌صورت پیش‌فرض راست‌چین (RTL) است. برای پروژه‌های انگلیسی یا بین‌المللی مقدار "ltr" قرار بده.
 */
export const DIRECTION: "rtl" | "ltr" = "rtl";

// --- Language ---
/**
 * زبان پیش‌فرض پروژه (fa: فارسی، en: انگلیسی)
 */
export const DEFAULT_LOCALE = "fa";

/**
 * لیست زبان‌های پشتیبانی‌شده (برای آینده یا چندزبانه شدن پروژه)
 */
export const SUPPORTED_LANGUAGES = ["fa", "en"] as const;

// --- App Branding & Theme ---
export const APP_NAME = "Canvas Dev Platform";
export const APP_DESCRIPTION = "Developer-First Modular CMS (Next.js + tRPC + Tailwind)";
export const THEME_COLOR = "#6366f1"; // violet-500 یا accent اصلی پروژه

/**
 * نمایش لوگو و برند (برای کاستومایز راحت در محیط پروداکشن)
 */
export const SHOW_BRAND = true;

// --- Layout/Navigation ---
/**
 * موقعیت سایدبار (start = چپ در LTR، راست در RTL)؛ برای پشتیبانی دو طرفه
 */
export const SIDEBAR_POSITION: "start" | "end" = DIRECTION === "rtl" ? "end" : "start";

/**
 * مسیر صفحه اصلی ادمین
 */
export const ADMIN_HOME_PATH = "/admin";

// --- Demo یا تنظیمات توسعه ---
/**
 * فعال‌سازی مود دموی توسعه (true = بعضی featureها فقط برای dev)
 */
export const DEV_MODE = process.env.NODE_ENV !== "production";

/**
 * فعال‌سازی نمایش مثال یا دمو
 */
export const SHOW_DEMO = DEV_MODE;

// --- API & Feature Flags ---
/**
 * فعال‌سازی ماژول فرم‌ساز (برای فعال/غیرفعال کردن feature در آینده)
 */
export const ENABLE_FORM_BUILDER = true;
/**
 * فعال‌سازی چندنویسندگی یا multi-tenant
 */
export const ENABLE_MULTI_TENANT = false;



// Theme ----


// Centralized UI theme configuration
// Change these values to rebrand the entire UI.
export type BrandShadeKey =
  | "25"
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";

export type BrandScale = Record<BrandShadeKey, string>;

export type GrayShadeKey = BrandShadeKey;
export type GrayScale = Record<GrayShadeKey, string>;

// Default brand palette (light). Tailwind tokens like bg-brand-500 map to these.
export const BRAND_LIGHT: BrandScale = {
  // Warm orange brand inspired by the provided mockups
  25: "#FFF7F0",
  50: "#FFEFE3",
  100: "#FFDCC2",
  200: "#FFC499",
  300: "#FFA66B",
  400: "#FF8A45",
  500: "#FF6A1A",
  600: "#E95C12",
  700: "#C94A0E",
  800: "#A03B0C",
  900: "#7C2F0A",
  950: "#431807",
};

// Optional dark brand palette. If not customized, light will be used in dark theme too.
export const BRAND_DARK: Partial<BrandScale> = {
  // Slightly brighter oranges for dark UI contrast
  50: "#FFF2E6",
  100: "#FFD8B8",
  400: "#FF9A57",
  500: "#FF7A33",
  600: "#FF6A1A",
};

// Neutral/Gray palette used across the UI (bg-gray-*, text-gray-*, border-gray-*)
export const GRAY_LIGHT: GrayScale = {
  // Warm neutrals close to the light mockup background
  25: "#FAF9F7",
  50: "#F6F4F1",
  100: "#EEECEA",
  200: "#E5E1DC",
  300: "#D3CEC7",
  400: "#A29E97",
  500: "#76726B",
  600: "#5C5851",
  700: "#3F3B34",
  800: "#2F2B25",
  900: "#1F1B16",
  950: "#14110D",
};

export const GRAY_DARK: Partial<GrayScale> = {
  // Keep numeric semantics: 50 is light, 900 is darkest
  25: "#F9FAFB",
  50: "#F3F4F6",
  100: "#E5E7EB",
  200: "#D1D5DB",
  300: "#9CA3AF",
  400: "#6B7280",
  500: "#4B5563",
  600: "#374151",
  700: "#1F2937",
  800: "#111827",
  900: "#0B0F14",
  950: "#06080C",
};

// Primary tokens used by shadcn/ui style components (bg-primary, text-primary-foreground, ring, etc)
export const PRIMARY_TOKENS = {
  base: "var(--color-brand-500)",
  foreground: "#ffffff",
  ring: "var(--color-brand-500)",
  // Secondary and accent can be adjusted here if you want global impact
  secondary: "var(--color-gray-100)",
  secondaryForeground: "var(--color-gray-900)",
  accent: "var(--color-brand-50)",
  accentForeground: "var(--color-brand-700)",
};

export const THEME = {
  light: {
    brand: BRAND_LIGHT,
    gray: GRAY_LIGHT,
    panel: {
      bg: "#ffffff",
      border: "rgba(0,0,0,0.06)",
      glass: "rgba(0,0,0,0.04)",
    },
    overlayTint: "rgba(0,0,0,0.02)",
    chart: [
      "#FF7A33", // orange
      "#F4CE3A", // warm yellow
      "#4ADE80", // green
      "#60A5FA", // blue
      "#A78BFA", // violet
    ],
  },
  dark: {
    // falls back to light where not specified
    brand: { ...BRAND_LIGHT, ...BRAND_DARK }, 
    gray: { ...GRAY_LIGHT, ...GRAY_DARK },
    panel: {
      bg: "#151821",
      border: "rgba(255,255,255,0.06)",
      glass: "rgba(255,255,255,0.06)",
    },
    overlayTint: "rgba(255,255,255,0.06)",
    chart: [
      "#FF9A57",
      "#F4CE3A",
      "#22D3EE",
      "#A3E635",
      "#F472B6",
    ],
  },
};

// Shadows and radii can be tuned globally
export const SHADOWS = {
  xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  sm: "0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)",
  md: "0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
  lg: "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
  xl: "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
  focusRing: "0px 0px 0px 4px rgba(70, 95, 255, 0.12)",
};

export const RADII = {
  sm: "6px",
  md: "10px",
  lg: "12px",
  xl: "16px",
};

// Glass blur intensity used in surfaces with glassmorphism
export const GLASS_BLUR = "10px";

// Typography
export const TYPOGRAPHY = {
  fontSans: 'var(--font-iran-sans), system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  baseSize: '14px',
  headingScale: {
    h1: '2.25rem',
    h2: '1.875rem',
    h3: '1.5rem',
    h4: '1.25rem',
    h5: '1.125rem',
    h6: '1rem',
  },
};

// Layout and sizing
export const LAYOUT = {
  sidebarExpandedWidth: '290px',
  sidebarCollapsedWidth: '90px',
  headerHeight: '64px',
  containerPaddingX: '1.5rem',
  containerPaddingY: '1rem',
  contentMaxWidth: '1280px',
};

// Controls sizing
export const CONTROLS = {
  button: {
    heightSm: '2.25rem',
    heightMd: '2.75rem',
    heightLg: '3rem',
    pxSm: '1rem',
    pxMd: '1.25rem',
    pxLg: '1.5rem',
    radius: 'var(--radius-lg)',
    fontSize: '0.875rem',
  },
  input: {
    height: '2.75rem',
    radius: 'var(--radius-lg)',
    fontSize: '0.9375rem',
    px: '0.875rem',
  },
};

// Z-index mapping
export const Z_INDICES = {
  header: 99999,
  overlay: 9999,
  modal: 10000,
  dropdown: 1000,
};

// Assets (logos, favicons)
export const ASSETS = {
  logo: {
    light: '/images/logo/logo.svg',
    dark: '/images/logo/logo-dark.svg',
    icon: '/images/logo/logo-icon.svg',
  },
};

// Common component sizes
export const SIZES = {
  dropdown: {
    width: '350px',
    widthSm: '361px',
    height: '480px',
    offsetY: '17px',
    offsetX: '240px',
    padding: '12px',
    radius: '16px',
  },
  avatar: {
    md: '50px',
    sm: '40px',
  },
  map: {
    height: '212px',
    width: '634px',
    widthMd: '668px',
    widthXl: '393px',
    width2xl: '554px',
  },
};

