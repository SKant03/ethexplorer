"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TableHead from "../../components/TableHead";
import {
  fetchLatestBlockNumber,
  fetchBlockByNumber,
} from "@/lib/queries/queries";
import BlockRow from "../../components/BlockRow";
import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";
import useIsDark from "@/utils/useIsDark";

const PAGE_SIZE = 15;

export default function Block() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [copy, setCopy] = useState(false);
  const isDark = useIsDark();
  const { data: latestBlockNumber } = useQuery({
    queryKey: ["latestBlockNumber"],
    queryFn: fetchLatestBlockNumber,
  });

  const { data: blocks = [], isLoading: isListReady } = useQuery({
    queryKey: ["blocks", page],
    queryFn: async () => {
      if (!latestBlockNumber) return [];

      const startBlock = latestBlockNumber - (page - 1) * PAGE_SIZE;
      const results = [];

      for (let i = 0; i < PAGE_SIZE; i++) {
        const blockNo = startBlock - i;
        if (blockNo < 0) break;

        const hex = "0x" + blockNo.toString(16);
        const block = await fetchBlockByNumber(hex);
        results.push(block);
      }

      return results;
    },
    enabled: !!latestBlockNumber,
  });

  useEffect(() => {
    if (page !== 1 || !latestBlockNumber) return;

    const hex = "0x" + latestBlockNumber.toString(16);

    fetchBlockByNumber(hex).then((newBlock) => {
      queryClient.setQueryData(["blocks", 1], (old: any[] | undefined) => {
        if (!old) return old;
        if (old[0]?.number === newBlock.number) return old;
        return [newBlock, ...old.slice(0, PAGE_SIZE - 1)];
      });
    });
  }, [latestBlockNumber, page, queryClient]);

  return (
    <div className="px-2 sm:px-4">
      <TableHead
        columns={[
          { title: "Block", className: "w-3/12" },
          { title: "Time", className: "w-2/12" },
          { title: "Miner", className: "w-5/12 lg:w-6/12" },
          { title: "Total Tx", className: "w-2/12 lg:w-1/12 text-right " },
        ]}
      />

      {/* Skeleton */}
      {isListReady && (
        <div className="flex flex-col items-center px-2">
          {new Array(PAGE_SIZE).fill(0).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 animate-pulse mb-2 rounded w-full max-w-6xl"
            ></div>
          ))}
        </div>
      )}

      {/* Rows */}
      {!isListReady &&
        blocks.map((block, index) => (
          <div key={index} className="transition hover:scale-[1.005]">
            <BlockRow
              blockRow={{
                blockNo: block.number,
                time: block.timestamp,
                miner: block.miner,
                tx: block.txCount,
              }}
              onCopy={() => {
                setCopy(true);
                setTimeout(() => setCopy(false), 3000);
              }}
            />
          </div>
        ))}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="p-2 rounded-full transition hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={22} />
        </button>

        <p className="text-lg font-medium">{page}</p>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="p-2 rounded-full transition hover:bg-gray-200"
        >
          <ArrowRight size={22} />
        </button>
      </div>
      {copy && (
        <div
          className={clsx(
            "fixed bottom-4 right-6 p-2 rounded-xl",
            isDark ? "bg-slate-700" : "bg-slate-300"
          )}
        >
          copied to clipboard
        </div>
      )}

      <div className="flex justify-center">timetest 1766391348000</div>
    </div>
  );
}
