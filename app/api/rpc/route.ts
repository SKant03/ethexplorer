import { NextRequest, NextResponse } from "next/server";

const RPC_URL = process.env.NEXT_RPC!;

export async function POST(req: NextRequest) {
  const { method, params } = await req.json();

  if (!method) {
    return NextResponse.json({ error: "RPC method required" }, { status: 400 });
  }

  try {
    const rpcRes = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params: params || [],
      }),
      cache: "no-store",
    });

    const data = await rpcRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "RPC request failed" }, { status: 500 });
  }
}
