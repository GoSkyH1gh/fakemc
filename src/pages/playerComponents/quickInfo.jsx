import InfoCard from "./infoCard.jsx"
import GuildMembers from "./guildMembers.jsx"
import { motion } from "motion/react"
import formatISOTimestamp from './formatISOTimestamp'

function QuickInfo({ hypixel_response: hypixelResponse, playerStatus }) {
  return (
    <motion.div
      className='hypixel-data'
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } }}}
      initial="hidden"
      animate="show">
      <p className="username">Quick Info</p>
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
        <InfoCard label="First seen on" value={formatISOTimestamp(hypixelResponse.first_login)} />
        <InfoCard label="Last seen" value={formatISOTimestamp(hypixelResponse.last_login)} />
        <InfoCard label="Hypixel rank" value={hypixelResponse.player_rank} />
        <InfoCard label="Hypixel guild" value={hypixelResponse.guild_name || "No guild"} />
      </motion.ul>
      
    </motion.div>
  )
}

export default QuickInfo

//{hypixelResponse.guild_name && (
//      <><p>{hypixelResponse.guild_name}'s members: </p><GuildMembers guild_members={hypixelResponse.guild_members} onGuildMemberClick={onGuildMemberClick} /></>
//      )}