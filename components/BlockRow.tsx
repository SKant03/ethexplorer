"use client";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type BlockRowType = {
  blockRow: { blockNo: number; time: any; miner: string; tx: number };
};
export default function BlockRow({ blockRow }: BlockRowType) {
  const isDark = useIsDark();
  const [copy, setCopy] = useState(false);
  const handleCopy =async()=>{
    await navigator.clipboard.writeText(blockRow.miner)
    setCopy(true);

    setTimeout(()=>setCopy(false), 5000)
  }
  return (
    <div className="w-full flex justify-center">
      <div
        className={clsx(
          "w-full max-w-6xl flex justify-between gap-2 mt-2 rounded py-2 px-3 text-sm text-left bg-gray-200 ",
          isDark
            ? "border-slate-800 bg-slate-900 hover:bg-slate-800/50"
            : "border-slate-200 bg-white hover:bg-slate-50"
        )}
      >
        <div className="w-3/12 ">
          <Link href={`/blocks/${blockRow.blockNo}`}>{blockRow.blockNo}</Link>
        </div>
        <div className="w-2/12 truncate">{blockRow.time}</div>
        <div className="w-6/12 flex group relative">
    
        <span className={clsx("absolute bottom-6 left-0 opacity-0  group-hover:opacity-100 transition-opacity px-1 rounded ", isDark?"bg-slate-700":"bg-slate-500")}>{blockRow.miner}</span>
        <span className="truncate w-[80%]">
          <Link href={`/account/${blockRow.miner}`}>{blockRow.miner}</Link></span>
          <span className="absolute right-0 sm:left-30 md:left-80 opacity-0 group-hover:opacity-100"><button onClick={handleCopy}><Copy/></button></span>
        </div>

        <div className="w-1/12">{blockRow.tx}</div>
      </div>
    </div>
  );
}
