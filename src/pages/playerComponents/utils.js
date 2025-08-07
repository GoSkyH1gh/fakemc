import { format, formatDistanceToNow, parseISO } from 'date-fns'

function formatISOTimestamp(timestamp) {
   // Convert string to Date object
  let readableDate;
  let date;
  let relativeTime;
  try {
    date = parseISO(timestamp);
    readableDate = format(date, "d MMM yyyy");
    relativeTime = formatDistanceToNow(date, { addSuffix: true }); // e.g. "2 days ago"
  }
  catch {
    readableDate = "Unknown"
  }
  
  return readableDate;
}

const formatValue = (value) => {
  if (value == null) {
    return "Unknown";
  } else {
    return value.toLocaleString("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    });
  }
};

export {formatISOTimestamp, formatValue}