import InfoCard from "./infoCard";
import { formatValue, formatISOTimestamp } from "./utils";

function McciTabbedData({ mcciData }) {
  if (mcciData === "not found") {
    return <p>MCC Island data not found for player</p>;
  }
  if (mcciData === "error") {
    return <p>An error happened while fetching MCC Island data</p>;
  }
  return (
    <>
      <ul className="info-card-list">
        <InfoCard
          label="Status"
          value={mcciData.online ? "Online" : "Offline"}
        />
        <InfoCard
          label="First Login"
          value={formatISOTimestamp(mcciData.first_join)}
        />
        <InfoCard
          label="Last Login"
          value={formatISOTimestamp(mcciData.last_join)}
        />
        <InfoCard label="Rank" value={mcciData.rank ?? "No Rank"} />
        <InfoCard
          label="Subscribed to Plus"
          value={mcciData.plus_subscribed ? "True" : "False"}
        />
      </ul>
      <h3>Stats</h3>
      <ul className="info-card-list">
        <InfoCard label="Level" value={mcciData.stats.level} />
        <InfoCard
          label="Trophies"
          value={
            formatValue(mcciData.stats.trophies) +
            "/" +
            formatValue(mcciData.stats.max_trophies)
          }
        />
      </ul>
      <ul className="info-card-list">
        <InfoCard label="Coins" value={formatValue(mcciData.stats.coins)} />
        <InfoCard
          label="ANGLR Tokens"
          value={formatValue(mcciData.stats.anglr_token)}
        />
        <InfoCard
          label="Royal Reputation"
          value={formatValue(mcciData.stats.royal_reputation)}
        />
      </ul>
    </>
  );
}

export default McciTabbedData;
