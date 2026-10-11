"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("pahami-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const current = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
      if (current) {
        setTheme(current);
      } else {
        const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        const initial = prefersLight ? "light" : "dark";
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pahami-theme", next);
  };

  if (!mounted) {
    return <div className={`w-9 h-9 rounded-full ${className}`} />;
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === "dark" ? "Ganti ke mode terang (Light mode)" : "Ganti ke mode gelap (Dark mode)"}
      aria-label="Ganti tema"
      className={`w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant transition cursor-pointer shrink-0 ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-primary transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-primary transition-transform duration-200" />
      )}
    </button>
  );
}
