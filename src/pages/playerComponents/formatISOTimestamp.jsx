import { format, formatDistanceToNow, parseISO } from 'date-fns'

function formatISOTimestamp(timestamp) {
  const date = parseISO(timestamp); // Convert string to Date object

  const readableDate = format(date, "d MMM yyyy");
  const relativeTime = formatDistanceToNow(date, { addSuffix: true }); // e.g. "2 days ago"

  return readableDate;
}

export default formatISOTimestamp