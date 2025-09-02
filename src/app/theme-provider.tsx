"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ThemeProvider() {
  const pathname = usePathname();
  
  useEffect(() => {
    const isAdminRoute = pathname.startsWith('/admin');
    const html = document.documentElement;

    // Determine active theme from meta set in RootLayout
    const activeTheme = document
      .querySelector('meta[name="active-theme"]')
      ?.getAttribute('content') || '';

    const themeClassPrefix = 'theme-';
    // Remove any previous theme-* classes
    html.classList.forEach((cls) => {
      if (cls.startsWith(themeClassPrefix)) html.classList.remove(cls);
    });

    if (isAdminRoute) {
      // No theme classes applied to admin to avoid style changes
      return;
    }

    // Apply theme class to public site
    if (activeTheme) {
      html.classList.add(`${themeClassPrefix}${activeTheme}`);
    }
  }, [pathname]);
  
  return null;
}
