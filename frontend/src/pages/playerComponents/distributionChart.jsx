import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatValue } from "./utils";
import DistributionHelpDialog from "./distributionHelpDialog";

function DistributionChart({
  buckets,
  counts,
  playerValue,
  percentile,
  unit,
  sampleSize,
}) {
  const data = counts.map((count, i) => ({
    range: `${Math.round(buckets[i]).toLocaleString("en-US", {
      notation: "compact",
      maximumFractionDigits: 0,
    })}-${Math.round(buckets[i + 1]).toLocaleString("en-US", {
      notation: "compact",
      maximumFractionDigits: 0,
    })}`,
    count,
    bucketStart: buckets[i],
    bucketEnd: buckets[i + 1],
  }));

  const playerBucketIndex = data.findIndex(
    (d) => playerValue >= d.bucketStart && playerValue < d.bucketEnd
  );

  // If the player is exactly the max value, put them in the last bucket
  const safeIndex =
    playerBucketIndex === -1 ? data.length - 1 : playerBucketIndex;

  return (
    <>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="range" tick={{ fill: "#f3f3f7", fontSize: 13 }} />
            <Tooltip />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === safeIndex ? "#e61fb4ff" : "#8884d8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p style={{ textAlign: "center" }}>
        Better than {percentile.toFixed(1)}% of {formatValue(sampleSize)}{" "}
        recorded players
        <DistributionHelpDialog />
      </p>
    </>
  );
}

export default DistributionChart;
