"use client";

import { useState } from "react";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Row from "@/components/Row";
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
  if (isLoading || rxLoading)
    return (
      <div className="w-full h-screen flex justify-center">
        <div
          className={clsx(
            "h-10 bg-gray-200 animate-pulse mb-2 rounded w-full max-w-6xl",
            isDark ? "bg-gray-600" : "bg-gray-300"
          )}
        >
          Loading…
        </div>
      </div>
    );
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
          />
          <Row
            label="From"
            value={<span className="font-mono">{tx.from}</span>}
          />
          <Row label="To" value={<span className="font-mono">{tx.to}</span>} />
          <Row label="Value" value={`${valueEth} ETH`} />
          <Row label="Gas Used" value={gasUsed.toLocaleString()} />
          <Row label="Gas Price" value={`${gasPrice} wei`} />
          <Row label="Nonce" value={parseInt(tx.nonce ?? "0x0", 16)} />
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
              />
              <Row
                label="Input Data"
                value={<span className="font-mono break-all">{tx.input}</span>}
              />
              <Row
                label="Transaction Index"
                value={parseInt(tx.transactionIndex ?? "0x0", 16)}
              />
              <Row
                label="Cumulative Gas Used"
                value={parseInt(receipt.cumulativeGasUsed ?? "0x0", 16)}
              />
              <Row
                label="Contract Address"
                value={
                  <span className="font-mono">
                    {receipt.contractAddress ?? "-"}
                  </span>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
