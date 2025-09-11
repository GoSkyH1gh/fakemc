import InfoCard from "./infoCard";
import { formatValue } from "./utils";
import * as Dialog from "@radix-ui/react-dialog";
import "./dialog.css";
import { toProperCase } from "./utils";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function HypixelTabbedData({ hypixelData, hypixelGuildData }) {
  return (
    <>
      <h3>Global Stats</h3>
      <ul className="info-card-list">
        <InfoCard
          label="Level"
          value={formatValue(hypixelData.player.network_level)}
        />
        <InfoCard label="Karma" value={formatValue(hypixelData.player.karma)} />
        <InfoCard
          label="Achievement Points"
          value={formatValue(hypixelData.player.achievement_points)}
        />
      </ul>
      <h3>Game Stats</h3>
      <HypixelBedwarsPopup bedwarsData={hypixelData.player.bedwars} />
      {hypixelData?.guild && (
        <HypixelGuild
          hypixelData={hypixelData}
          hypixelGuildData={hypixelGuildData}
        />
      )}
    </>
  );
}

function HypixelBedwarsPopup({ bedwarsData }) {
  const stats_to_map = [
    "games_played",
    "winstreak",
    "wins",
    "losses",
    "winn_loss_ratio",
    "kills",
    "deaths",
    "kill_death_ratio",
    "final_kills",
    "final_deaths",
    "final_kill_death_ratio",
    "beds_broken",
    "beds_lost",
    "bed_broken_lost_ratio",
    "items_purchased",
    "resources_collected",
    "iron_collected",
    "gold_collected",
    "diamonds_collected",
    "emeralds_collected",
  ];
  const winrate =
    (
      (bedwarsData.overall_stats.wins /
        bedwarsData.overall_stats.games_played) *
      100
    ).toFixed(1) + "%";
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bedwars-showcase">
          <span className="em-text">Bedwars</span>
          <br />
          {formatValue(bedwarsData.overall_stats.games_played)} games played •{" "}
          {winrate} winrate
          <br />
          <span className="secondary-text">Click to see more</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="BedwarsOverlay">
          <Dialog.Title>Bedwars Stats</Dialog.Title>
          <ul className="info-card-list">
            <InfoCard label="Level" value={bedwarsData.level} />
            <InfoCard label="Tokens" value={formatValue(bedwarsData.tokens)} />
            <InfoCard label="Winrate" value={winrate} />
          </ul>
          <table className="bedwars-table">
            <thead>
              <tr>
                <th></th>
                <th>Overall</th>
                <th>Solo</th>
                <th>Duo</th>
                <th>Trio</th>
                <th>Quad</th>
              </tr>
            </thead>
            <tbody>
              {stats_to_map.map((stat) => (
                <tr>
                  <td className="bedwars-stat-name">
                    {toProperCase(stat.replaceAll("_", " "))}
                  </td>
                  <td className="bedwars-stat-value">
                    {formatValue(bedwarsData.overall_stats[stat])}
                  </td>
                  <td className="bedwars-stat-value">
                    {formatValue(bedwarsData.solo_stats[stat])}
                  </td>
                  <td className="bedwars-stat-value">
                    {formatValue(bedwarsData.duo_stats[stat])}
                  </td>
                  <td className="bedwars-stat-value">
                    {formatValue(bedwarsData.trio_stats[stat])}
                  </td>
                  <td className="bedwars-stat-value">
                    {formatValue(bedwarsData.quad_stats[stat])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Dialog.Close asChild>
            <div className="dialog-close">
              <button>Close</button>
            </div>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function HypixelGuild({ hypixelData, hypixelGuildData }) {
  let navigate = useNavigate();

  if (!hypixelGuildData) {
    return <p>No guild members to show</p>;
  }
  const handleGuildMemberClick = (username) => {
    console.log("searching for " + username);
    navigate(`/player/${username}`);
  };

  // IMPLEMENT LOAD MORE
  const hypixelMemberElements = hypixelGuildData.map((member) => (
    <li key={member.uuid}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        key={member.name}
        className="guild-list-item"
        onClick={() => handleGuildMemberClick(member.username)}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1 },
        }}
      >
        <div className="guild-member-flex-container">
          <img
            src={"data:image/png;base64," + member.skin_showcase_b64}
            className="guild-member-image"
            alt={"head of " + member.username + "'s skin"}
          />
          <div>
            <p className="list-username">{member.username}</p>
            <p className="list-uuid">Click for more info</p>
          </div>
        </div>
      </motion.button>
    </li>
  ));

  return (
    <>
      <h3>{hypixelData?.guild?.name}</h3>
      <ul className="guild-list">{hypixelMemberElements}</ul>
    </>
  );
}

export default HypixelTabbedData;
