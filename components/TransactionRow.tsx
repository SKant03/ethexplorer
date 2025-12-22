"use client";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import Link from "next/link";
import { Copy } from "lucide-react";
import useTruncate from "@/utils/Truncate";
import useResizeWidth from "@/utils/useResizeWidth";

type TransactionRowType = {
  txRow: { Tx: string; from: any; to: string; value: number };
  onCopy: () => void;
};

export default function TransactionRow({ txRow, onCopy }: TransactionRowType) {
  const isDark = useIsDark();
  const { ref: txRef, width: txWidth } = useResizeWidth<HTMLDivElement>();
  const { ref: fromRef, width: fromWidth } = useResizeWidth<HTMLDivElement>();
  const { ref: toRef, width: toWidth } = useResizeWidth<HTMLDivElement>();
  const txTruncate = useTruncate(txWidth, txRow.Tx);
  const fromTruncate = useTruncate(fromWidth, txRow.from);
  const toTruncate = useTruncate(toWidth, txRow.to);

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    onCopy();
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className={clsx(
          "w-full max-w-6xl flex items-center justify-between gap-2 mt-2 rounded px-3 py-2 text-sm transition-colors",
          isDark
            ? "bg-slate-900 hover:bg-slate-800/60"
            : "bg-white hover:bg-slate-50 border border-slate-200"
        )}
      >
        {/* Tx */}
        <div
          className="w-3/7 md:w-3/12 truncate hover:text-blue-600 hover:underline"
          ref={txRef}
        >
          <Link href={`/transactions/${txRow.Tx}`}>{txTruncate}</Link>
        </div>

        {/* From */}
        <div
          className="w-3/7 md:w-4/12 relative group flex items-center gap-2"
          ref={fromRef}
        >
          {/* Tooltip */}
          <span
            className={clsx(
              "absolute -top-7 left-0 z-10 whitespace-nowrap px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-all",
              isDark ? "bg-slate-700 text-white" : "bg-slate-600 text-white"
            )}
          >
            {txRow.from}
          </span>

          <span className="w-[80%] text-slate-500">{fromTruncate}</span>

          <button
            onClick={() => handleCopy(txRow.from)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* To */}
        <div
          className="w-4/12 relative group hidden md:flex items-center gap-2"
          ref={toRef}
        >
          {/* Tooltip */}
          <span
            className={clsx(
              "absolute -top-7 left-0 z-10 whitespace-nowrap px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-all",
              isDark ? "bg-slate-700 text-white" : "bg-slate-600 text-white"
            )}
          >
            {txRow.to}
          </span>

          <span className="w-[80%] text-slate-500">{toTruncate}</span>

          <button
            onClick={() => handleCopy(txRow.to)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Value */}
        <div className="w-1/7 md:w-1/12 text-right font-medium">
          {txRow.value}
        </div>
      </div>
    </div>
  );
}
