const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const JUST_NOW = 5_000;

export function formatRelativeTime(iso: string, now = Date.now()) {
  const date = new Date(iso);
  const elapsed = now - date.getTime();

  if (elapsed < JUST_NOW) return "Now";
  if (elapsed < MINUTE) return `${Math.max(0, Math.floor(elapsed / 1000))}s`;
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`;

  const sameYear = date.getFullYear() === new Date(now).getFullYear();

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
}
