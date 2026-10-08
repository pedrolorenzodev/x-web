const createdFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function formatCreatedDate(value: string) {
  return createdFormat.format(new Date(value));
}
