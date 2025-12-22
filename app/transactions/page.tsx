"use client";
import { useEffect, useState } from "react";
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
import { formatValue } from "@/utils/useValueFormat";
import { TX_HEAD } from "@/constants";
import CopytoClipboard from "@/components/CopyToClipboard";

export default function BlockTransactions() {
  const isDark = useIsDark();
  const [page, setPage] = useState(1);
  const [copy, setCopy] = useState(false);
  const [transactions, setTransaction] = useState([]);
  const PAGE_SIZE = 15;

  const { data: latestBlockNumber } = useQuery({
    queryKey: ["latestBlockNumber"],
    queryFn: fetchLatestBlockNumber,
  });

  const hex = "0x" + latestBlockNumber?.toString(16);

  const { data, isLoading } = useQuery({
    queryKey: ["blockTransactions", latestBlockNumber],
    queryFn: () => fetchBlockByNumber2(hex),
  });

  useEffect(() => {
    if (!isLoading) {
      setTransaction(data.transactions);
    }
  }, [data]);

  // Pagination
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedTxs = transactions.slice(start, end);
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

  return (
    <div className="w-full px-2 sm:px-4">
      {/* Table Header */}
      <TableHead columns={TX_HEAD} />

      {isLoading && (
        <div className="flex flex-col items-center px-2">
          {new Array(PAGE_SIZE).fill(0).map((_, index) => (
            <div
              key={index}
              className={clsx(
                "h-10 bg-gray-200 animate-pulse mb-2 rounded w-full max-w-6xl",
                isDark ? "bg-gray-600" : "bg-gray-300"
              )}
            ></div>
          ))}
        </div>
      )}

      {/* Transactions */}
      {paginatedTxs.map((tx: any, index: number) => (
        <div key={tx.hash || index} className="transition hover:scale-[1.005]">
          <TransactionRow
            txRow={{
              Tx: tx.hash,
              from: tx.from,
              to: tx.to,
              value: formatValue(BigInt(tx.value ?? "0x0")),
            }}
            onCopy={() => {
              setCopy(true);
              setTimeout(() => setCopy(false), 3000);
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
      {copy && <CopytoClipboard />}
    </div>
  );
}
