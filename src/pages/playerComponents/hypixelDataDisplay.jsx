import InfoCard from "./infoCard.jsx"
import GuildMembers from "./guildMembers.jsx"
import { motion } from "motion/react"

function HypixelDataDisplay({ hypixel_response: hypixelResponse, onGuildMemberClick, playerStatus }) {
  return (
  <motion.div
    className='hypixel-data'
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } }}}
    initial="hidden"
    animate="show">
    <motion.ul
      className='info-card-list'
      variants={{ hidden: { opacity: 0 }, show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          duration: 0.5,
          ease: "easeInOut"
        }
        }
      }}
      initial="hidden"
      animate="show">
      <InfoCard label="Status" value={playerStatus.status} />
      <InfoCard label="First seen on" value={hypixelResponse.first_login} />
      <InfoCard label="Last seen" value={hypixelResponse.last_login} />
      <InfoCard label="Rank" value={hypixelResponse.player_rank} />
      <InfoCard label="Guild" value={hypixelResponse.guild_name || "No guild"} />
    </motion.ul>
    {hypixelResponse.guild_name && (
      <><p>{hypixelResponse.guild_name}'s members: </p><GuildMembers guild_members={hypixelResponse.guild_members} onGuildMemberClick={onGuildMemberClick} /></>
      )}
  </motion.div>
)
}

export default HypixelDataDisplay