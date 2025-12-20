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
import useResizeWidth from "@/utils/useResizeWidth";
import Address from "@/components/Address";

const PAGE_SIZE = 10;

export default function Block() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

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

  const {ref: minerRef, width:minerWidth} = useResizeWidth<HTMLDivElement>()

  return (
    <div className="px-2 sm:px-4">
      <div className="w-full" ref={minerRef}>{minerWidth}</div>
      <TableHead
        columns={[
          { title: "Block", className: "w-3/12" },
          { title: "Time", className: "w-2/12" },
          { title: "Miner", className: "w-6/12"},
          { title: "Total Tx", className: "w-1/12" },
        ]}
      />

      {/* Skeleton */}
      {isListReady && (
        <div className="flex justify-center px-2">
          <div className="h-10 bg-gray-200 animate-pulse mb-2 rounded w-full max-w-6xl"></div>
        </div>
      )}

      {/* Rows */}
      {!isListReady &&
        blocks.map((block, index) => (
          <div key={index} className="transition hover:scale-[1.005]">
            <BlockRow
              blockRow={{
                blockNo: block.number,
                time: `${Math.floor(
                  (Date.now() - block.timestamp) / 1000
                )}s ago`,
                miner: block.miner,
                tx: block.txCount,
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
    </div>
  );
}
