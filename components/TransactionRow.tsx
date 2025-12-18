"use client";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import Link from "next/link";

type TransactionRowType = {
  txRow: { Tx: number; from: any; to: string; value: number };
};
export default function TransactionRow({ txRow }: TransactionRowType) {
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
        <div className="w-4/12 truncate ">
          <Link href={`/transactions/${txRow.Tx}`}>{txRow.Tx}</Link>
        </div>
        <div className="w-4/12 truncate">{txRow.from}</div>
        <div className="truncate w-3/12 hidden md:table-cell">{txRow.to}</div>
        <div className="w-2/12 text-right">{txRow.value}</div>
      </div>
    </div>
  );
}
