"use client";

import { useState } from "react";
import clsx from "clsx";
import useIsDark from "@/utils/useIsDark";
import { Search as SearchIcon } from "lucide-react";
import detectSearchType from "@/utils/detectSearchType";
import { useRouter } from "next/navigation";

export default function Search() {
  const [input, setInput] = useState("");
  const isDark = useIsDark();
  const router = useRouter();

  const handleSearch = (value: string) => {
    const type = detectSearchType(value);

    switch (type) {
      case "block":
        router.push(`/blocks/${value}`);
        break;
      case "address":
        router.push(`/account/${value}`);
        break;
      case "tx":
        router.push(`/transactions/${value}`);
        break;
      default:
        alert("Invalid Search Input");
    }
    setInput("");
  };

  return (
    <div className="w-full flex justify-center px-2 sm:px-0">
      <div
        className={clsx(
          "flex items-center w-full max-w-xs sm:max-w-md md:max-w-lg rounded-full border overflow-hidden",
          isDark ? "border-slate-700 bg-slate-900" : "border-slate-300 bg-white"
        )}
      >
        <input
          type="text"
          placeholder="Search by block / tx / address"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={clsx(
            "flex-1 px-3 sm:px-4 py-2 text-sm outline-none bg-transparent",
            isDark ? "text-white placeholder-slate-400" : "text-black"
          )}
        />

        <button
          onClick={() => handleSearch(input)}
          className={clsx(
            "px-3 sm:px-4 py-2 transition",
            isDark
              ? "hover:bg-slate-800 text-slate-300"
              : "hover:bg-slate-100 text-slate-700"
          )}
        >
          <SearchIcon size={18} />
        </button>
      </div>
    </div>
  );
}
