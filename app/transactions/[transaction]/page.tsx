"use client";

import { useState } from "react";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  fetchTransactionByHash,
  fetchTransactionReceipt,
} from "@/lib/queries/queries";

export default function Transaction() {
  const { transaction } = useParams<{ transaction: string }>();
  const [showMore, setShowMore] = useState(false);
  const isDark = useIsDark();

  if (!transaction) return <div>Invalid transaction</div>;

  const {
    data: tx,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blockno", transaction],
    queryFn: () => fetchTransactionByHash(transaction),
  });

  const {
    data: receipt,
    isLoading: rxLoading,
    isError: rxError,
  } = useQuery({
    queryKey: ["blockno", "rx", transaction],
    queryFn: () => fetchTransactionReceipt(transaction),
  });
  if (isLoading || rxLoading) return <div>Loading…</div>;
  if (isError || rxError) return <div>Error loading transaction</div>;

  const valueEth = parseInt(tx.value ?? "0x0", 16) / 1e18;
  const gasUsed = parseInt(receipt.gasUsed ?? "0x0", 16);
  const gasPrice = parseInt(tx.gasPrice ?? "0x0", 16);

  return (
    <div className="w-full h-full min-h-screen">
      <div
        className={clsx(
          "max-w-5xl mx-auto p-6 space-y-2",
          isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
        )}
      >
        <h1 className="text-2xl font-semibold mb-4">Transaction</h1>

        <div
          className={clsx(
            "border rounded-lg p-4 space-y-3",
            isDark
              ? "border-slate-800 bg-slate-800"
              : "border-slate-200 bg-gray-50"
          )}
        >
          <Row
            label="Status"
            value={receipt.status === "0x1" ? "Success" : "Failed"}
            isDark={isDark}
          />
          <Row
            label="Block"
            value={
              <Link
                className="font-mono underline"
                href={`/blocks/${tx.blockNumber}`}
              >
                {parseInt(tx.blockNumber ?? "0x0", 16)}
              </Link>
            }
            isDark={isDark}
          />
          <Row
            label="From"
            value={<span className="font-mono">{tx.from}</span>}
            isDark={isDark}
          />
          <Row
            label="To"
            value={<span className="font-mono">{tx.to}</span>}
            isDark={isDark}
          />
          <Row label="Value" value={`${valueEth} ETH`} isDark={isDark} />
          <Row
            label="Gas Used"
            value={gasUsed.toLocaleString()}
            isDark={isDark}
          />
          <Row label="Gas Price" value={`${gasPrice} wei`} isDark={isDark} />
          <Row
            label="Nonce"
            value={parseInt(tx.nonce ?? "0x0", 16)}
            isDark={isDark}
          />
        </div>

        {/* Show More / Extra Details */}
        <div>
          <button
            onClick={() => setShowMore(!showMore)}
            className={clsx(
              "px-4 py-2 border rounded mt-2",
              isDark
                ? "border-slate-700 bg-slate-700 hover:bg-slate-600 text-white"
                : "border-slate-300 bg-gray-100 hover:bg-gray-200 text-black"
            )}
          >
            {showMore ? "Hide More Details" : "Show More Details"}
          </button>

          {showMore && (
            <div
              className={clsx(
                "mt-2 border rounded-lg p-4 space-y-2",
                isDark
                  ? "border-slate-800 bg-slate-800"
                  : "border-slate-200 bg-gray-50"
              )}
            >
              <Row
                label="Transaction Hash"
                value={<span className="font-mono break-all">{tx.hash}</span>}
                isDark={isDark}
              />
              <Row
                label="Input Data"
                value={<span className="font-mono break-all">{tx.input}</span>}
                isDark={isDark}
              />
              <Row
                label="Transaction Index"
                value={parseInt(tx.transactionIndex ?? "0x0", 16)}
                isDark={isDark}
              />
              <Row
                label="Cumulative Gas Used"
                value={parseInt(receipt.cumulativeGasUsed ?? "0x0", 16)}
                isDark={isDark}
              />
              <Row
                label="Contract Address"
                value={
                  <span className="font-mono">
                    {receipt.contractAddress ?? "-"}
                  </span>
                }
                isDark={isDark}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Key-value row
function Row({
  label,
  value,
  isDark,
}: {
  label: string;
  value: React.ReactNode;
  isDark?: boolean;
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-2 gap-4 py-1 text-sm",
        isDark ? "border-b border-slate-700" : "border-b border-slate-200"
      )}
    >
      <div className={clsx(isDark ? "text-slate-300" : "text-slate-800")}>
        {label}
      </div>
      <div
        className={clsx(
          isDark ? "text-slate-300" : "text-slate-800",
          "text-right"
        )}
      >
        {value}
      </div>
    </div>
  );
}
