import { format, formatDistanceToNow, parseISO, formatDistanceToNowStrict } from 'date-fns'

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

const formatValue = (value, compact = true) => {
  if (value == null) {
    return "Unknown";
  } else {
    if (compact) {
      return value.toLocaleString("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    });
    }
    else {
      return value
    }
  }
};

const formatISOToDistance = (isoDate) => {
  if (!isoDate) {
    return "Unknown";
  }
  try {
    const date = parseISO(isoDate);
    return formatDistanceToNow(date, { addSuffix: true });
  }
  catch (error) {
    console.error("Error parsing ISO date:", error);
    return "Unknown";
  }
}

const formatSinceLastUpdate = (date) => {
    if (!date) {
      return "unknown";
    }
    return "updated " + formatDistanceToNowStrict(date) + " ago";
  };

const formatLogTime = (date) => {
  if (!date) {
    return "unknown";
  }
  return format(date, "KK:mm a");
};

const fetchMetric = async (metric_key, player_uuid, setMetricData) => {
    setMetricData("loading");
    const baseUrl =
      import.meta.env.VITE_API_URL ?? "https://fastapi-fakemc.onrender.com";
    let metricResponseRaw = await fetch(
      `${baseUrl}/v1/metrics/${metric_key}/distribution/${player_uuid}`
    );
    if (metricResponseRaw.status === 404) {
      setMetricData("notFound");
      return;
    } else if (!metricResponseRaw.ok) {
      setMetricData("error");
      return;
    }

    let metricResponse = await metricResponseRaw.json();
    setMetricData(metricResponse);
    console.log("Got metric response: ", metricResponse);
  };

  const handleStatClick = (metric_key, uuid, setMetricData) => {
    setMetricData(null);
    fetchMetric(metric_key, uuid, setMetricData);
  };

function toProperCase(str) {
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export {formatISOTimestamp, formatValue, handleStatClick, formatSinceLastUpdate, formatLogTime, formatISOToDistance, toProperCase}