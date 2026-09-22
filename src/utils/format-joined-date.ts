export function formatJoinedDate(iso: string) {
  const date = new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return `Joined ${date}`;
}
