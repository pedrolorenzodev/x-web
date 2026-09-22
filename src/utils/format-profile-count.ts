const units = [
  { value: 1_000_000, suffix: "M" },
  { value: 10_000, suffix: "K", divisor: 1_000 },
];

export function formatProfileCount(count: number) {
  const unit = units.find((entry) => count >= entry.value);
  if (!unit) return count.toLocaleString("en-US");

  const scaled = count / (unit.divisor ?? unit.value);
  const truncated = Math.trunc(scaled * 10) / 10;

  return `${truncated}${unit.suffix}`;
}
