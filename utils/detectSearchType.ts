export default function detectSearchType(input: string) {
  const value = input.trim();

  if (/^\d+$/.test(value)) {
    return "block";
  }

  if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
    return "address";
  }
  if (/^0x[a-fA-F0-9]{64}/.test(value)) {
    return "tx";
  }

  return "unknown";
}
