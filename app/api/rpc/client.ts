export async function rpc<T>(method: string, params: any[] = []): Promise<T> {
  const res = await fetch("/api/rpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, params }),
  });

  if (!res.ok) {
    throw new Error("RPC request failed");
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result as T;
}
