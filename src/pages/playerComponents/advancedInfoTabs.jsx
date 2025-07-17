import { motion } from 'motion/react'
import { useState } from 'react'
import GuildMembers from './guildMembers';
import WynncraftTabbedData from './wynncraftTabbedData';

function AdvancedInfoTabs({ onGuildMemberClick, hypixelResponse, wynncraftData }) {
  const [selectedTab, setSelectedTab] = useState('hypixel');
  let tabContents;
  if (selectedTab === 'hypixel') {
    tabContents = hypixelResponse.guild_name && (
    <>
      <p>{hypixelResponse.guild_name}'s members: </p>
      <GuildMembers guild_members={hypixelResponse.guild_members} onGuildMemberClick={onGuildMemberClick}/>
    </>
  )
  }
  else if (selectedTab === 'wynncraft') {
    if (wynncraftData === 'not found') {
      tabContents = (<p>Wynncraft data not found for player</p>)
    }
    else if (wynncraftData === 'not found (server error)') {
      tabContents = (<p>Wynncraft data unavailable due to server error</p>)
    }
    else {
      tabContents = <WynncraftTabbedData wynncraftData={wynncraftData}/>
    }
  }
  return (
    <div className='advanced-info-tabs'>
      <div className='advanced-tabs'>
        <button onClick={(e) => setSelectedTab('hypixel')}>Hypixel</button>
        <button onClick={(e) => setSelectedTab('wynncraft')}>Wynncraft</button>
      </div>
      <div>
        {tabContents}
      </div>
    </div>
  )
}

export default AdvancedInfoTabs