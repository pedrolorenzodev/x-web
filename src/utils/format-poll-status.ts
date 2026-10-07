const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function plural(count: number, unit: string) {
  return `${count} ${unit}${count === 1 ? "" : "s"} left`;
}

export function formatPollTimeLeft(endsAt: string, now = Date.now()) {
  const remaining = new Date(endsAt).getTime() - now;
  if (remaining <= 0) return "Final results";
  if (remaining >= DAY) return plural(Math.floor(remaining / DAY), "day");
  if (remaining >= HOUR) return plural(Math.floor(remaining / HOUR), "hour");
  return plural(Math.max(1, Math.floor(remaining / MINUTE)), "minute");
}

export function formatPollPercentage(votes: number, total: number) {
  if (total === 0) return "0%";
  const value = Math.round((votes / total) * 1000) / 10;
  return `${value}%`;
}

export function isPollClosed(endsAt: string, now = Date.now()) {
  return new Date(endsAt).getTime() <= now;
}
