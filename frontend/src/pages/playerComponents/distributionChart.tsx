import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatValue } from "../../utils/utils";
import DistributionHelpDialog from "./distributionHelpDialog";

type DistributionChartProps = {
  buckets: number[];
  counts: number[];
  playerValue: number;
  percentile: number;
  sampleSize: number;
};

function DistributionChart({
  buckets,
  counts,
  playerValue,
  percentile,
  sampleSize,
}: DistributionChartProps) {
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
            <Tooltip
              contentStyle={{
                borderRadius: "15px",
                color: "#F4EAE3",
                backdropFilter: "blur(20px)",
                backgroundColor: "#bbb4",
                border: "var(--color-surfact-layer-2) 2px solid",
              }}
              cursor={{ fill: "#A130F645", radius: 5 }}
              labelStyle={{ fontWeight: 600, color: "#F4EAE3" }}
              itemStyle={{ color: "#F4EAE3" }}
              offset={0}
            />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === safeIndex ? "#F4F077" : "#A130F6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex">
        <p style={{ textAlign: "center" }}>
          Better than {percentile.toFixed(1)}% of {formatValue(sampleSize)}{" "}
          recorded players
        </p>
        <DistributionHelpDialog />
      </div>
    </>
  );
}

export default DistributionChart;
