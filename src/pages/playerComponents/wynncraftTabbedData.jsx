import { motion } from 'motion/react'
import InfoCard from './infoCard'
import WynncraftCharacters from './wynncraftCharacters'

function WynncraftTabbedData({ wynncraftData }) {
  return (
  <>
    <h2>{wynncraftData.guild_prefix && ('[' + wynncraftData.guild_prefix + '] ')}{wynncraftData.username}</h2>
    <ul className='info-card-list'>
      <InfoCard label='Total playtime' value={wynncraftData.playtime_hours + ' hours'}/>
      <InfoCard label='Rank' value={wynncraftData.rank} />
      <InfoCard label='First Login' value={wynncraftData.first_login} />
      <InfoCard label='Last Login' value={wynncraftData.last_login}/>
    </ul>
    <ul className='info-card-list'>
      <InfoCard label='Guild' value={wynncraftData.guild_name}/>
    </ul>
    <h3>Global Stats</h3>
    <ul className='info-card-list'>
      <InfoCard label='Wars' value={wynncraftData.wars}/>
      <InfoCard label='Mobs killed' value={wynncraftData.mobs_killed}/>
      <InfoCard label='Chests opened' value={wynncraftData.chests_opened}/>
      <InfoCard label='Dungeons completed' value={wynncraftData.dungeons_completed}/>
      <InfoCard label='Raids completed' value={wynncraftData.raids_completed}/>
    </ul>
    <h3>Characters</h3>
    <WynncraftCharacters characterList={wynncraftData.characters}/>
  </>
)
}

export default WynncraftTabbedData