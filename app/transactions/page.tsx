"use client";
import { useState } from "react";
import useIsDark from "@/utils/useIsDark";
import TransactionRow from "./TransactionRow";
import { useQuery } from "@tanstack/react-query";
import { fetchBlockByNumber2 } from "@/lib/queries/getLatestBlock";
import { fetchLatestBlockNumber } from "@/lib/queries/getLatestBlock";
import TableHead from "../common/TableHead";
import clsx from "clsx";



export default function BlockTransactions() {
  const isDark = useIsDark();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

    const { data: latestBlockNumber } = useQuery({
      queryKey: ["latestBlockNumber"],
      queryFn: fetchLatestBlockNumber,
      // refetchInterval: page === 1 ? 5000 : false,       //uncomment this line to start the live fetch
    });
  const hex = "0x" + latestBlockNumber?.toString(16);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blockTransactions", latestBlockNumber],
    queryFn: () => fetchBlockByNumber2(hex),
  });

  if (isLoading)
    return <div className="text-center min-h-screen">Loading…</div>;
  if (isError) return <div>Error loading block transactions</div>;

  const transactions = data.transactions; 
  console.log(transactions)// array of full transactions

  // Pagination
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedTxs = transactions.slice(start, end);
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

  return (
    <div className="w-full">
      {/* Table Header */}
      <TableHead
        columns={[
          { title: "Transactions", className: "w-4/12" },
          { title: "From", className: "w-4/12" },
          { title: "To", className: "w-3/12" },
          { title: "Value", className: "w-1/12" },
        ]}
      />
      {/* Transactions */}
      {paginatedTxs.map((tx: any, index: number) => (
        <TransactionRow
          key={tx.hash || index}
          txRow={{
            Tx: tx.hash,
            from: tx.from,
            to: tx.to,
            value: parseInt(tx.value ?? "0x0", 16) / 1e18,
          }}
        />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            className={clsx(
              "px-4 py-2 border rounded",
              isDark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-gray-100 border-gray-300 text-black"
            )}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className={clsx(isDark ? "text-white" : "text-black")}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            className={clsx(
              "px-4 py-2 border rounded",
              isDark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-gray-100 border-gray-300 text-black"
            )}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
