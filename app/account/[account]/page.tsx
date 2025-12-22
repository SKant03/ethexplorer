"use client";

import { fetchAddressInfo } from "@/lib/queries/queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import clsx from "clsx";
import useIsDark from "@/utils/useIsDark";
import Row from "@/components/Row";

export default function AccountDetails() {
  const { account } = useParams<{ account: string }>();
  const isDark = useIsDark();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["account", account],
    queryFn: () => fetchAddressInfo(account),
  });

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center">
        <div className="h-50 flex justify-center items-center bg-gray-200 animate-pulse mb-2 rounded w-full max-w-6xl">
          Loading…
        </div>
      </div>
    );
  if (isError) return <div>Error fetching Account </div>;

  return (
    <div className="w-full h-full min-h-screen">
      <div
        className={clsx(
          "max-w-6xl mx-auto p-6 space-y-2",
          isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
        )}
      >
        <p className="text-lg font-semibold w-full max-w-6xl">
          Account Details
        </p>
        <div
          className={clsx(
            "border rounded-lg p-4 space-y-3",
            isDark
              ? "border-slate-800 bg-slate-800"
              : "border-slate-200 bg-gray-50"
          )}
        >
          <Row label="Account" value={data?.address} />
          <Row label="Status" value="Finalized" />
          <Row label="Balance" value={data?.balance} />
          <Row label="nonce" value={data?.nonce} />
          <Row label="isContract" value={data?.isContract ? "true" : "false"} />

          {data?.isContract && <Row label="Code" value={data.isContract} />}
        </div>
      </div>
    </div>
  );
}
