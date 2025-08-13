import { motion } from "motion/react";
import InfoCard from "./infoCard";
import WynncraftCharacters from "./wynncraftCharacters";
import { formatISOTimestamp, formatValue } from "./utils";
import WynncraftGuild from "./wynncraftGuild";
import { useState } from "react";
import DistributionChartWrapper from "./distributionChartWrapper";

function WynncraftTabbedData({ wynncraftData, wynncraftGuildData }) {
  const [metricData, setMetricData] = useState(null);

  const fetchMetric = async (metric_key, player_uuid) => {
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

  const handleStatClick = (metric_key, uuid) => {
    setMetricData(null);
    fetchMetric(metric_key, uuid);
  };

  let wynnGuildElements;
  if (wynncraftGuildData != "no guild") {
    wynnGuildElements = (
      <>
        <h3>{wynncraftData.guild_name}</h3>
        <WynncraftGuild wynncraftGuildData={wynncraftGuildData} />
      </>
    );
  } else {
    wynnGuildElements = <></>;
  }
  return (
    <>
      {wynncraftData.restrictions.main_access && (
        <p>Warning: this player has disabled API access to main stats</p>
      )}
      {wynncraftData.restrictions.character_data_access && (
        <p>Warning: this player has disabled API access to their characters</p>
      )}
      {wynncraftData.restrictions.build_access && (
        <p>
          Warning: this player has disabled API access to their build
          information
        </p>
      )}
      {wynncraftData.restrictions.build_access && (
        <p>
          Warning: this player has disabled API access to their online status
        </p>
      )}
      <h2 className="wynn-nametag">
        {wynncraftData.guild_prefix && "[" + wynncraftData.guild_prefix + "]"}
        <span className="wynn-username">{wynncraftData.username}</span>
      </h2>
      <ul className="info-card-list">
        <InfoCard
          onClick={() =>
            handleStatClick("wynncraft_hours_played", wynncraftData.uuid)
          }
          hasStats={true}
          label="Total playtime"
          value={
            formatValue(wynncraftData.player_stats?.playtime_hours, false) +
            " hours"
          }
        >
          <DistributionChartWrapper metricData={metricData} />
        </InfoCard>
        <InfoCard
          label="Rank"
          value={
            wynncraftData.rank_badge ? (
              <img
                src={`https://cdn.wynncraft.com/${wynncraftData.rank_badge}`}
                className="wynn-rank"
                alt={wynncraftData.rank}
              />
            ) : (
              wynncraftData.rank
            )
          }
        />
        <InfoCard
          label="First Login"
          value={formatISOTimestamp(wynncraftData.first_login)}
        />
        <InfoCard
          label="Last Login"
          value={formatISOTimestamp(wynncraftData.last_login)}
        />
      </ul>
      <ul className="info-card-list">
        <InfoCard label="Guild" value={wynncraftData.guild_name} />
      </ul>
      <h3>Global Stats</h3>
      <ul className="info-card-list">
        <InfoCard
          onClick={() => handleStatClick("wynncraft_wars", wynncraftData.uuid)}
          hasStats={true}
          label="Wars"
          value={formatValue(wynncraftData.player_stats?.wars)}
        >
          <DistributionChartWrapper metricData={metricData} />
        </InfoCard>
        <InfoCard
          onClick={() =>
            handleStatClick("wynncraft_mobs_killed", wynncraftData.uuid)
          }
          hasStats={true}
          label="Mobs killed"
          value={formatValue(wynncraftData.player_stats?.mobs_killed)}
        >
          <DistributionChartWrapper metricData={metricData} />
        </InfoCard>
        <InfoCard
          onClick={() =>
            handleStatClick("wynncraft_chests_opened", wynncraftData.uuid)
          }
          hasStats={true}
          label="Chests opened"
          value={formatValue(wynncraftData.player_stats?.chests_opened)}
        >
          <DistributionChartWrapper metricData={metricData} />
        </InfoCard>
        <InfoCard
          onClick={() =>
            handleStatClick("wynncraft_dungeons_completed", wynncraftData.uuid)
          }
          hasStats={true}
          label="Dungeons completed"
          value={formatValue(wynncraftData.player_stats?.dungeons_completed)}
        >
          <DistributionChartWrapper metricData={metricData} />
        </InfoCard>
        <InfoCard
          onClick={() =>
            handleStatClick("wynncraft_raids_completed", wynncraftData.uuid)
          }
          hasStats={true}
          label="Raids completed"
          value={formatValue(wynncraftData.player_stats?.raids_completed)}
        >
          <DistributionChartWrapper metricData={metricData} />
        </InfoCard>
      </ul>
      <h3>Characters</h3>
      {!wynncraftData.restrictions.character_data_access && (
        <>
          <p>
            {wynncraftData.username} has {wynncraftData.characters.length}{" "}
            characters.
            <br />
            Click on a character to expand
          </p>
          <WynncraftCharacters characterList={wynncraftData.characters} />
        </>
      )}
      {wynncraftData?.characters?.length === 0 &&
        wynncraftData.restrictions.character_data_access && (
          <p>{wynncraftData.username}'s characters are not available</p>
        )}

      {wynnGuildElements}
    </>
  );
}

export default WynncraftTabbedData;
