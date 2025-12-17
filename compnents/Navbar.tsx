"use client";

import Link from "next/link";
import ThemeButton from "./ThemeButton";
import clsx from "clsx";
import useIsDark from "@/utils/useIsDark";

export default function Navbar() {
  const isDark = useIsDark();
  return (
    <nav
      className={
        clsx("flex items-center justify-between px-6 py-4 border-b",
        isDark ? "bg-gray-800 text-slate-200" : "bg-gray-200 text-slate-800")
      }
    >
      <div className="text-lg font-semibold">
        <Link href="/">ETH Explorer</Link>
      </div>

      <div className="flex gap-6 text-sm">
        <Link href="/blocks" className="hover:text-blue-500">
          Blocks
        </Link>

        <Link href="/transactions" className="hover:text-blue-500">
          Transactions
        </Link>
      </div>
      <ThemeButton />
    </nav>
  );
}
