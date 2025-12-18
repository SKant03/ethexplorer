"use client";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import Link from "next/link";

type BlockRowType = {
  blockRow: { blockNo: number; time: any; miner: string; tx: number };
};
export default function BlockRow({ blockRow }: BlockRowType) {
  const isDark = useIsDark();
  return (
    <div className="w-full flex justify-center">
      <div
        className={clsx(
          "w-full max-w-6xl flex justify-between gap-2 mt-2 rounded py-2 px-3 text-lg text-left bg-gray-200 ",
          isDark
            ? "border-slate-800 bg-slate-900 hover:bg-slate-800/50"
            : "border-slate-200 bg-white hover:bg-slate-50"
        )}
      >
        <div className="w-3/12 ">
          <Link href={`/blocks/${blockRow.blockNo}`}>{blockRow.blockNo}</Link>
        </div>
        <div className="w-2/12 truncate">{blockRow.time}</div>
        <div className="truncate w-6/12">
          <Link href={`/account/${blockRow.miner}`}>{blockRow.miner}</Link>
        </div>
        <div className="w-1/12">{blockRow.tx}</div>
      </div>
    </div>
  );
}
