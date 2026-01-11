"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1) récupère depuis localStorage
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "light";
    setTheme(saved);

    // 2) applique immédiatement
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return { theme, toggle, mounted };
}