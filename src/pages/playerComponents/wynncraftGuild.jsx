import { motion, scale } from 'motion/react'
import InfoCard from './infoCard'
import formatISOTimestamp from './formatISOTimestamp'

function WynncraftGuild({ wynncraftGuildData, onGuildMemberClick }) {
  const guildMemberElements = wynncraftGuildData.members.map((member) => {
    return (
      <motion.li
        className='wynn-guild-member-item'
        whileHover={{ scale: 1.2 }}
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
        <InfoCard label='Wars' value={wynncraftGuildData.wars}/>
        <InfoCard label='Territories held' value={wynncraftGuildData.territories}/>
        <InfoCard label='Created on' value={formatISOTimestamp(wynncraftGuildData.created)}/>
        <InfoCard label='Member count' value={wynncraftGuildData.member_count}/>
      </ul>
      <p>{wynncraftGuildData.name}'s members</p>
      <ul className='wynn-guild-member-list'>
        {guildMemberElements}
      </ul>
    </>
  )
}

export default WynncraftGuild