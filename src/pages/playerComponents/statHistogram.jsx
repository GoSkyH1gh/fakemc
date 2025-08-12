import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function DistributionChart({ buckets, counts, playerValue, percentile, unit }) {
  const data = counts.map((count, i) => ({
    range: `${Math.round(buckets[i])}-${Math.round(buckets[i + 1])}`,
    count,
    bucketStart: buckets[i],
    bucketEnd: buckets[i + 1],
  }));

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="range" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
          {/* Marker for player's value */}
          <ReferenceLine
            x={data.findIndex(
              (d) => playerValue >= d.bucketStart && playerValue < d.bucketEnd
            )}
            stroke="red"
            label={{ value: "You", position: "top" }}
          />
        </BarChart>
      </ResponsiveContainer>
      <p style={{ textAlign: "center", marginTop: 8 }}>
        Better than {percentile.toFixed(1)}% of players
      </p>
    </div>
  );
}

export default DistributionChart;
