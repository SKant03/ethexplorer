"use client";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
export default function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  const isDark = useIsDark();
  return (
    <div
      className={clsx(
        "grid grid-cols-2 gap-4 py-1 text-sm",
        isDark ? "border-b border-slate-700" : "border-b border-slate-200"
      )}
    >
      <div className={clsx(isDark ? "text-slate-300" : "text-slate-800")}>
        {label}
      </div>
      <div
        className={clsx(
          isDark ? "text-slate-300" : "text-slate-800",
          "text-right truncate"
        )}
      >
        {value}
      </div>
    </div>
  );
}
