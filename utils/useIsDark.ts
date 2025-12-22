"use client";
import { useTheme } from "@/context/ThemeContext";

export default function useIsDark() {
  const { theme } = useTheme();
  return theme === "dark";
}
