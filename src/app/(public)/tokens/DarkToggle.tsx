"use client";

import { useEffect, useState } from "react";

export default function DarkToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const next = !isDark;
    setIsDark(next);
    html.classList.toggle("dark", next);
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
      aria-pressed={isDark}
      title="Toggle dark mode"
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: isDark ? "#0EA5E9" : "#111827" }} />
      {isDark ? "Dark" : "Light"}
    </button>
  );
}


