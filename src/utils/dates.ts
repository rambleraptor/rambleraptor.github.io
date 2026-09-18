const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats a post date consistently everywhere it appears, e.g. "Aug 28, 2026". */
export function formatDate(date: Date): string {
  return formatter.format(date);
}
