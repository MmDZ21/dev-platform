"use client";

import { useEffect, useState } from "react";

export default function DarkToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Force light mode - dark mode temporarily disabled
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.classList.remove("dark");
    setIsDark(false);
  }, []);

  const toggle = () => {
    // Dark mode is temporarily disabled
    console.log("Dark mode is temporarily disabled");
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
      aria-pressed={isDark}
      title="Toggle dark mode"
    >
      <span 
        className="inline-block h-2 w-2 rounded-full" 
        style={{ 
          background: isDark 
            ? `hsl(var(--theme-toggle-dark))` 
            : `hsl(var(--theme-toggle-light))` 
        }} 
      />
      {isDark ? "Dark" : "Light"}
    </button>
  );
}


