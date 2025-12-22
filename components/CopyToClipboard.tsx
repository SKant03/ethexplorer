import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function CopytoClipboard() {
  const isDark = useIsDark();
  return (
    <div
      className={clsx(
        "fixed bottom-4 right-6 p-2 rounded-xl",
        isDark ? "bg-slate-700" : "bg-slate-300"
      )}
    >
      Copied to clipboard
    </div>
  );
}
