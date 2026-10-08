const units = [
  { from: 1_000_000_000, value: 1_000_000_000, suffix: "B" },
  { from: 1_000_000, value: 1_000_000, suffix: "M" },
  { from: 10_000, value: 1_000, suffix: "K" },
];

export function formatDetailCount(count: number) {
  const unit = units.find((entry) => count >= entry.from);
  if (!unit) return count.toLocaleString("en-US");
  const truncated = Math.trunc((count / unit.value) * 10) / 10;
  return `${truncated}${unit.suffix}`;
}
