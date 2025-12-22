"use client";

import Link from "next/link";
import ThemeButton from "./ThemeButton";
import clsx from "clsx";
import useIsDark from "@/utils/useIsDark";
import Search from "./Search";

export default function Navbar() {
  const isDark = useIsDark();

  return (
    <nav
      className={clsx(
        "border-b px-4 py-3 mb-8",
        isDark
          ? "bg-gray-800 text-slate-200 border-slate-700"
          : "bg-gray-200 text-slate-800 border-slate-200"
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-lg font-semibold text-center md:text-left">
          <Link href="/">ETH Explorer</Link>
        </div>

        <div className="w-full md:max-w-xl md:flex-1">
          <Search />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 text-sm">
          <div className="flex gap-3 md:gap-6">
            <Link href="/blocks" className="hover:text-blue-500">
              Blocks
            </Link>
            <Link href="/transactions" className="hover:text-blue-500">
              Transactions
            </Link>
          </div>
          <ThemeButton />
        </div>
      </div>
    </nav>
  );
}
