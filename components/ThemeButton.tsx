"use client";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";
import useIsDark from "@/utils/useIsDark";
import { MoonStar, Sun } from "lucide-react";
export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = useIsDark();
  return (
    <div
      className={clsx(
        "p-1 m-1 rounded-full",
        isDark ? "dark:bg-slate-800" : "bg-slate-200"
      )}
    >
      <button
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className={clsx(
          "rounded-full p-2",
          "transition-all duration-200",
          "hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-blue-500"
        )}
      >
        {isDark ? (
          <MoonStar className="text-yellow-400" size={22} />
        ) : (
          <Sun className="text-orange-400" size={22} />
        )}
      </button>
    </div>
  );
}
