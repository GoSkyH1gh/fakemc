import InfoCard from "./infoCard";
import { formatValue, formatISOTimestamp, formatISOToDistance } from "./utils";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function McciTabbedData({ mcciData }) {
  let navigator = useNavigate();
  if (mcciData === "not found") {
    return <p>MCC Island data not found for player</p>;
  }
  if (mcciData === "error") {
    return <p>An error happened while fetching MCC Island data</p>;
  }
  const friendElements = mcciData?.friends.map((friend) => (
    <motion.li
      className="wynn-guild-member-item"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigator(`/player/${friend.username}`)}
      key={friend.uuid}
    >
      <div className="guild-member-flex-container">
        <img
          src={`https://vzge.me/face/128/${friend.uuid}.png`}
          className="guild-member-image"
          height="80"
          width="80"
          loading="lazy"
        />
        <div>
          <p className="em-text">{friend.username}</p>
          <p className="secondary-text">{friend.rank || "No Rank"}</p>
        </div>
      </div>
    </motion.li>
  ));

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
          value={formatISOToDistance(mcciData.last_join)}
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
      {mcciData?.friends.length != 0 && (
        <>
          <h3>{mcciData?.username}'s friends</h3>
          <ul className="wynn-guild-member-list">{friendElements}</ul>
        </>
      )}
    </>
  );
}

export default McciTabbedData;
