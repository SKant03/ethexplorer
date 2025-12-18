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

const PAGE_SIZE = 10;

export default function Block() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: latestBlockNumber } = useQuery({
    queryKey: ["latestBlockNumber"],
    queryFn: fetchLatestBlockNumber,
    // refetchInterval: page === 1 ? 10000 : false, //uncomment this line to start the live fetch
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
    <div>
      <TableHead
        columns={[
          { title: "Block", className: "w-3/12" },
          { title: "Time", className: "w-2/12" },
          { title: "Miner", className: "w-6/12" },
          { title: "Total Tx", className: "w-1/12" },
        ]}
      />

      {/* Skeleton / Loader */}
      {isListReady && (
        <div className="flex justify-center">
          <div className="h-10 bg-gray-200 animate-pulse mb-2 rounded w-full max-w-6xl"></div>
        </div>
      )}

      {/* Render only when full list is ready */}
      {!isListReady &&
        blocks.map((block, index) => (
          <BlockRow
            key={index}
            blockRow={{
              blockNo: block.number,
              time: `${Math.floor((Date.now() - block.timestamp) / 1000)}s ago`,
              miner: block.miner,
              tx: block.txCount,
            }}
          />
        ))}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          <ArrowLeft size={25} />
        </button>
        <p className="text-lg">{page}</p>
        <button onClick={() => setPage((p) => p + 1)}>
          <ArrowRight size={25} />
        </button>
      </div>
    </div>
  );
}
