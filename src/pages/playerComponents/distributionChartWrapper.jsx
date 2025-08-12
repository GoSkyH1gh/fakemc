import DistributionChart from "./distributionChart";
import LoadingIndicator from "./loadingIndicator";

function DistributionChartWrapper({ metricData }) {
  if (metricData === null) {
    return <p className="distribution-graph">There's no data to show</p>;
  }
  if (metricData === "loading") {
    return (
      <div className="distribution-graph center">
        <LoadingIndicator />
      </div>
    );
  }
  return (
    <div className="distribution-graph">
      <DistributionChart
        buckets={metricData.buckets}
        counts={metricData.counts}
        playerValue={metricData.player_value}
        percentile={metricData.percentile}
        sampleSize={metricData.sample_size}
      />
      
    </div>
  );
}

export default DistributionChartWrapper;
