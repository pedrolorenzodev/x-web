const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatScheduleDate(value: string | Date) {
  const date = new Date(value);
  return `${dateFormat.format(date)} at ${timeFormat.format(date)}`;
}

export function formatTimeZoneName(date: Date) {
  return (
    new Intl.DateTimeFormat("en-US", { timeZoneName: "long" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? ""
  );
}
