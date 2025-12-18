"use client";

import { useState } from "react";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { fetchBlockByNumber2 } from "@/lib/queries/queries";
import { useQuery } from "@tanstack/react-query";
import Row from "@/components/Row";

export default function Block({ chainId }: { chainId: number }) {
  const { blockNo } = useParams<{ blockNo: string }>();
  const [showMore, setShowMore] = useState(false);
  const isDark = useIsDark();

  if (!blockNo) return <div>Invalid block number</div>;

  const blockNumberDecimal = parseInt(blockNo, 10);
  const hex = "0x" + blockNumberDecimal.toString(16);

  const {
    data: block,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blockno", blockNo],
    queryFn: () => fetchBlockByNumber2(hex),
  });

  if (isLoading)
    return <div className="min-h-screen text-center">Loading…</div>;
  if (isError) return <div>Error loading block </div>;

  const blockNumber = parseInt(block.number ?? "0x0", 16);
  const timestampMs = parseInt(block.timestamp ?? "0x0", 16) * 1000;
  const date = new Date(timestampMs);
  const timeAgoMins = Math.floor((Date.now() - timestampMs) / 60000);

  return (
    <div className="w-full h-full min-h-screen">
      <div
        className={clsx(
          "max-w-6xl mx-auto p-6 space-y-2",
          isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
        )}
      >
        <p className="text-lg font-semibold w-full max-w-6xl">Block Details</p>
        <div
          className={clsx(
            "border rounded-lg p-4 space-y-3",
            isDark
              ? "border-slate-800 bg-slate-800"
              : "border-slate-200 bg-gray-50"
          )}
        >
          <Row label="Block Height" value={blockNumber} />
          <Row label="Status" value="Finalized" />
          <Row
            label="Timestamp"
            value={`${timeAgoMins} mins ago (${date.toUTCString()})`}
          />
          <Row
            label="Transactions"
            value={`${block.transactions.length} txns`}
          />
          <Row label="Withdrawals" value={block.withdrawals?.length ?? 0} />
          <Row label="Fee Recipient" value={block.miner} />
          <Row
            label="Block Reward"
            value={`${(parseInt(block.reward ?? "0x0", 16) / 1e18).toFixed(
              6
            )} ETH`}
          />
          <Row
            label="Size"
            value={`${parseInt(
              block.size ?? "0x0",
              16
            ).toLocaleString()} bytes`}
          />
          <Row
            label="Gas Used"
            value={`${parseInt(
              block.gasUsed ?? "0x0",
              16
            ).toLocaleString()} (${(
              (parseInt(block.gasUsed ?? "0x0", 16) /
                parseInt(block.gasLimit ?? "0x1", 16)) *
              100
            ).toFixed(2)}%)`}
          />
          <Row
            label="Gas Limit"
            value={parseInt(block.gasLimit ?? "0x0", 16).toLocaleString()}
          />
          <Row
            label="Base Fee Per Gas"
            value={`${parseInt(block.baseFeePerGas ?? "0x0", 16)} wei`}
          />
          <Row label="Burnt Fees" value={`🔥 0 ETH`} />
          <Row label="Extra Data" value={block.extraData} />
        </div>

        <div className="mt-1">
          <button
            onClick={() => setShowMore(!showMore)}
            className={clsx(
              "px-4 py-2 border rounded",
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
              <Row label="Hash" value={block.hash} />
              <Row label="Parent Hash" value={block.parentHash} />
              <Row label="State Root" value={block.stateRoot} />
              <Row label="Withdrawals Root" value={block.withdrawalsRoot} />
              <Row label="Nonce" value={block.nonce} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
