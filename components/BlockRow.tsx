"use client";

import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import { Copy } from "lucide-react";
import Link from "next/link";
import useTruncate from "@/utils/truncate";
import useResizeWidth from "@/utils/useResizeWidth";
import { formatTimestamp } from "@/utils/useTimeFormat";

type BlockRowType = {
  blockRow: {
    blockNo: number;
    time: number;
    miner: string;
    tx: number;
  };
  onCopy: () => void;
};

export default function BlockRow({ blockRow, onCopy }: BlockRowType) {
  const isDark = useIsDark();
  const { ref: minerRef, width: minerWidth } = useResizeWidth<HTMLDivElement>();
  const minerTruncate = useTruncate(minerWidth, blockRow.miner);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(blockRow.miner);
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
        {/* Block number */}
        <div className="w-3/12 font-medium hover:text-blue-600 hover:underline">
          <Link href={`/blocks/${blockRow.blockNo}`}>{blockRow.blockNo}</Link>
        </div>

        {/* Time */}
        <div className="w-2/12 truncate text-slate-500">
          {formatTimestamp(blockRow.time)}
        </div>

        {/* Miner */}
        <div
          className="w-5/12 lg:w-6/12 flex items-center justify-start  relative group"
          ref={minerRef}
        >
          {/* Tooltip */}
          <span
            className={clsx(
              "absolute -top-7 left-0 z-10 whitespace-nowrap px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-all",
              isDark ? "bg-slate-700 text-white" : "bg-slate-600 text-white"
            )}
          >
            {blockRow.miner}
          </span>

          {/* Address */}
          <Link
            href={`/account/${blockRow.miner}`}
            className=" hover:text-blue-600 hover:underline"
          >
            {minerTruncate}
          </Link>

          {/* Copy icon */}
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 ml-2"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Tx count */}
        <div className="w-2/12 lg:w-1/12 text-right font-medium">
          {blockRow.tx}
        </div>
      </div>
    </div>
  );
}
