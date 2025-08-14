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

export {formatISOTimestamp, formatValue, handleStatClick}