import { useMemo } from "react";

export default function useTruncate(containerWidth: number, address: string) {
  const truncated = useMemo(() => {
    if (!address || containerWidth <= 0) return "";

    const CHAR_WIDTH = 10;
    const maxChars = Math.floor(containerWidth / CHAR_WIDTH);

    if (maxChars <= 0) return "";
    if (address.length <= maxChars) return address;

    const keep = Math.floor((maxChars - 2) / 2);

    return `${address.slice(0, keep)}…${address.slice(address.length - keep)}`;
  }, [containerWidth, address]);

  return truncated;
}
