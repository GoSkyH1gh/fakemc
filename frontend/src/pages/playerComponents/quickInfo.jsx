import InfoCard from "./infoCard.jsx";
import GuildMembers from "./guildMembers.jsx";
import { motion } from "motion/react";
import { formatISOTimestamp, formatISOToDistance } from "./utils.js";

function QuickInfo({ hypixel_response: hypixelResponse, playerStatus }) {
  return (
    <motion.div
      className="hypixel-data"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.25, ease: "easeInOut" },
        },
      }}
      initial="hidden"
      animate="show"
    >
      <p className="username">Quick Info</p>
      <motion.ul
        className="info-card-list"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              duration: 0.5,
              ease: "easeInOut",
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <InfoCard label="Status" value={playerStatus.status} />
        <InfoCard
          label="First seen on"
          value={formatISOTimestamp(hypixelResponse.player?.first_login)}
        />
        <InfoCard
          label="Last seen"
          value={formatISOToDistance(hypixelResponse.player?.last_login)}
        />
        <InfoCard label="Hypixel rank" value={hypixelResponse.player?.rank || "No Rank"} />
        <InfoCard
          label="Hypixel guild"
          value={hypixelResponse?.guild?.name || "No guild"}
        />
      </motion.ul>
    </motion.div>
  );
}

export default QuickInfo;