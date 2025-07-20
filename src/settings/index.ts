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


