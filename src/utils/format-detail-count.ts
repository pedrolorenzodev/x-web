const units = [
  { value: 1_000_000_000, suffix: "B" },
  { value: 1_000_000, suffix: "M" },
  { value: 1_000, suffix: "K" },
];

export function formatDetailCount(count: number) {
  const unit = units.find((entry) => count >= entry.value);
  if (!unit) return String(count);
  const truncated = Math.trunc((count / unit.value) * 10) / 10;
  return `${truncated}${unit.suffix}`;
}
