import { motion } from 'motion/react'
import { state, useState } from 'react'
import GuildMembers from './guildMembers';

function AdvancedInfoTabs({ onGuildMemberClick, hypixelResponse }) {
    const [selectedTab, setSelectedTab] = useState('hypixel');
    let tabContents;
    if (selectedTab === 'hypixel') {
        tabContents = <><p>{hypixelResponse.guild_name}'s members: </p><GuildMembers guild_members={hypixelResponse.guild_members} onGuildMemberClick={onGuildMemberClick}/></>
    }
    else if (selectedTab === 'wynncraft') {
        tabContents = 'wynncraft'
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