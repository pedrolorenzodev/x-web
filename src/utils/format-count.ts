const units = [
  { value: 1_000_000, suffix: "M" },
  { value: 1_000, suffix: "K" },
];

export function formatCount(count: number) {
  const unit = units.find((entry) => count >= entry.value);
  if (!unit) return String(count);

  const scaled = count / unit.value;
  const digits = scaled < 10 ? 1 : 0;
  const truncated = Math.trunc(scaled * 10 ** digits) / 10 ** digits;

  return `${truncated}${unit.suffix}`;
}
