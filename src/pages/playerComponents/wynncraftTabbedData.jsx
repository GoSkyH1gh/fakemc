import { motion } from "motion/react";
import InfoCard from "./infoCard";
import WynncraftCharacters from "./wynncraftCharacters";
import { formatISOTimestamp, formatValue } from "./utils";
import WynncraftGuild from "./wynncraftGuild";

function WynncraftTabbedData({
  wynncraftData,
  wynncraftGuildData,
}) {
  let wynnGuildElements;
  if (wynncraftGuildData != "no guild") {
    wynnGuildElements = (
      <>
        <h3>{wynncraftData.guild_name}</h3>
        <WynncraftGuild
          wynncraftGuildData={wynncraftGuildData}
        />
      </>
    );
  } else {
    wynnGuildElements = <></>;
  }
  return (
    <>
      <h2 className="wynn-nametag">
        {wynncraftData.guild_prefix && "[" + wynncraftData.guild_prefix + "]"}
        <span className="wynn-username">{wynncraftData.username}</span>
      </h2>
      <ul className="info-card-list">
        <InfoCard
          label="Total playtime"
          value={wynncraftData.playtime_hours + " hours"}
        />
        <InfoCard label="Rank" value={wynncraftData.rank} />
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
          label="Wars"
          value={formatValue(wynncraftData.wars)}
        />
        <InfoCard
          label="Mobs killed"
          value={formatValue(wynncraftData.mobs_killed)}
        />
        <InfoCard
          label="Chests opened"
          value={formatValue(wynncraftData.chests_opened)}
        />
        <InfoCard
          label="Dungeons completed"
          value={formatValue(wynncraftData.dungeons_completed)}
        />
        <InfoCard
          label="Raids completed"
          value={formatValue(wynncraftData.raids_completed)}
        />
      </ul>
      <h3>Characters</h3>
      <p>
        {wynncraftData.username} has {wynncraftData.characters.length}{" "}
        characters.
        <br />
        Click on a character to expand
      </p>
      <WynncraftCharacters characterList={wynncraftData.characters} />
      {wynnGuildElements}
    </>
  );
}

export default WynncraftTabbedData;
