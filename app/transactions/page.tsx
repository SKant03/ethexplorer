"use client";
import { useState } from "react";
import useIsDark from "@/utils/useIsDark";
import TransactionRow from "../../components/TransactionRow";
import { useQuery } from "@tanstack/react-query";
import {
  fetchBlockByNumber2,
  fetchLatestBlockNumber,
} from "@/lib/queries/queries";
import TableHead from "../../components/TableHead";
import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function BlockTransactions() {
  const isDark = useIsDark();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: latestBlockNumber } = useQuery({
    queryKey: ["latestBlockNumber"],
    queryFn: fetchLatestBlockNumber,
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

  // Pagination
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedTxs = transactions.slice(start, end);
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

  return (
    <div className="w-full px-2 sm:px-4">
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
        <div key={tx.hash || index} className="transition hover:scale-[1.005]">
          <TransactionRow
            txRow={{
              Tx: tx.hash,
              from: tx.from,
              to: tx.to,
              value: parseInt(tx.value ?? "0x0", 16) / 1e18,
            }}
          />
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded-full transition hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={22} />
          </button>

          <span
            className={clsx(
              "text-lg font-medium",
              isDark ? "text-white" : "text-black"
            )}
          >
            {page}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-full transition hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
