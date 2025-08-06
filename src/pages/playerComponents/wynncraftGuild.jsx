import { motion, scale } from 'motion/react'
import InfoCard from './infoCard'
import formatISOTimestamp from './formatISOTimestamp'

function WynncraftGuild({ wynncraftGuildData, onGuildMemberClick }) {
  const guildMemberElements = wynncraftGuildData.members.map((member) => {
    return (
      <motion.li
        className='wynn-guild-member-item'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onGuildMemberClick(member.username)}>
        <p className='em-text'>{member.username}</p>
        <p className='secondary-text'>
          {member.rank}<br/>
          joined {formatISOTimestamp(member.joined)}
        </p>
      </motion.li>
    )
  })
  return (
    <>
      <ul className='info-card-list'>
        <InfoCard label='Level' value={wynncraftGuildData.level}/>
        <InfoCard label='Wars' value={wynncraftGuildData.wars.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}/>
        <InfoCard label='Territories held' value={wynncraftGuildData.territories.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}/>
        <InfoCard label='Created on' value={formatISOTimestamp(wynncraftGuildData.created)}/>
        <InfoCard label='Member count' value={wynncraftGuildData.member_count.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}/>
      </ul>
      <p>{wynncraftGuildData.name}'s members</p>
      <ul className='wynn-guild-member-list'>
        {guildMemberElements}
      </ul>
    </>
  )
}

export default WynncraftGuild