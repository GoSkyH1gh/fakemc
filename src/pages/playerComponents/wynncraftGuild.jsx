import { motion, scale } from "motion/react";
import InfoCard from "./infoCard";
import { formatISOTimestamp, formatValue } from "./utils";
import { useNavigate } from "react-router-dom";

function WynncraftGuild({ wynncraftGuildData }) {
  let navigator = useNavigate();
  const guildMemberElements = wynncraftGuildData.members.map((member) => {
    return (
      <motion.li
        className="wynn-guild-member-item"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigator(`/player/${member.username}`)}
      >
        <p className="em-text">{member.username}</p>
        <p className="secondary-text">
          {member.rank}
          <br />
          joined {formatISOTimestamp(member.joined)}
        </p>
      </motion.li>
    );
  });
  return (
    <>
      <ul className="info-card-list">
        <InfoCard label="Level" value={wynncraftGuildData.level} />
        <InfoCard
          label="Wars"
          value={formatValue(wynncraftGuildData.wars)}
        />
        <InfoCard
          label="Territories held"
          value={formatValue(wynncraftGuildData.territories)}
        />
        <InfoCard
          label="Created on"
          value={formatISOTimestamp(wynncraftGuildData.created)}
        />
        <InfoCard
          label="Member count"
          value={formatValue(wynncraftGuildData.member_count)}
        />
      </ul>
      <p>{wynncraftGuildData.name}'s members</p>
      <ul className="wynn-guild-member-list">{guildMemberElements}</ul>
    </>
  );
}

export default WynncraftGuild;
