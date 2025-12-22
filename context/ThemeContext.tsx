"use client";

import { createContext } from "react";
import { useState, useContext } from "react";
import clsx from "clsx";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={clsx(
          theme === "dark"
            ? "bg-slate-950 text-slate-100 border-slate-800 h-full min-h-screen"
            : "bg-slate-50 text-slate-900 border-slate-200",
          "min-h-screen h-max"
        )}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
