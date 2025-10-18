import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatValue } from "../../utils/utils";
import { useState } from "react";
import helpIcon from "/src/assets/help-icon.svg";
import { motion, stagger } from "motion/react";
import { MdAutoGraph } from "react-icons/md";
import { MdPercent } from "react-icons/md";
import { MdStackedBarChart } from "react-icons/md";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const animationVariants = {
    hidden: { y: -30, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

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
    <div className="distribution-graph">
      <div className="distribution-chart">
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
      <div>
        <div className="text-icon flex">
          <p style={{ textAlign: "center" }}>
            Better than {percentile.toFixed(1)}% of {formatValue(sampleSize)}{" "}
            recorded players
          </p>
          <button
            className="icon-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <img src={helpIcon} />
          </button>
        </div>

        {isExpanded && (
          <div>
            <motion.ul
              className="help-ul"
              initial={"hidden"}
              animate={"show"}
              transition={{
                delayChildren: stagger(0.35, {
                  ease: "easeInOut",
                }),
              }}
            >
              <motion.li variants={animationVariants}>
                <MdAutoGraph />
                Each bar represents a range of values — taller bars mean more
                players in that range.
              </motion.li>
              <motion.li variants={animationVariants}>
                <MdStackedBarChart />
                The highlighted bar marks where your current value falls.
              </motion.li>
              <motion.li variants={animationVariants}>
                <MdPercent />
                The summary above compares your position with all recorded
                players (shown as a percentile).
              </motion.li>
            </motion.ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default DistributionChart;
