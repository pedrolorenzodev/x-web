const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function plural(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}

export function formatNewsTime(iso: string, isTrendingNow: boolean, now = Date.now()) {
  if (isTrendingNow) return "Trending now";
  const elapsed = Math.max(0, now - new Date(iso).getTime());
  if (elapsed < HOUR) return plural(Math.max(1, Math.floor(elapsed / MINUTE)), "minute");
  if (elapsed < DAY) return plural(Math.floor(elapsed / HOUR), "hour");
  return plural(Math.floor(elapsed / DAY), "day");
}
