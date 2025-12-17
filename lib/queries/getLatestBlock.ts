// import { rpc } from "@/app/api/rpc/client";

// export async function fetchLatestBlock() {
//   const latestHex = await rpc<string>("eth_blockNumber");
//    const block = await rpc<any>("eth_getBlockByNumber", [latestHex, true]);

//   return {
//     block
//   };
// }

import { rpc } from "@/app/api/rpc/client";

// Fetch a single block by hex number
export async function fetchBlockByNumber(blockHex: string) {
  const block = await rpc<any>("eth_getBlockByNumber", [blockHex, true]);

  return {
    number: parseInt(block.number, 16),
    miner: block.miner,
    txCount: block.transactions.length,
    timestamp: parseInt(block.timestamp, 16) * 1000,
  };
}

// Fetch latest block number
export async function fetchLatestBlockNumber(): Promise<number> {
  const hex = await rpc<string>("eth_blockNumber");
  return parseInt(hex, 16);
}

// Optional: Fetch latest block full details
export async function fetchLatestBlock() {
  const latestBlockNumber = await fetchLatestBlockNumber();
  const hex = "0x" + latestBlockNumber.toString(16);
  return fetchBlockByNumber(hex);
}
