import { motion } from 'motion/react'
import GuildSearchRow from './playerComponents/guildSearchRow';
import { useState, useEffect } from 'react';
import WynncraftGuild from './playerComponents/wynncraftGuild';

function WynncraftGuilds() {
  const [guildData, setGuildData] = useState(null)
  const [status, setStatus] = useState('idle')
  const [guildList, setGuildList] = useState([]);

  useEffect(() => {
    const fetchGuildList = async () => {
      const guildListResponseRaw = await fetch('http://127.0.0.1:8000/v1/wynncraft/guild-list')
      const guildList = await guildListResponseRaw.json()
      setGuildList(guildList)
    };
    fetchGuildList();
  }, []);

  const fetchGuildData = async (searchTerm) => {
    setStatus('loading')
    const guildDataUrl = 'http://127.0.0.1:8000/v1/wynncraft/guilds/'
    setGuildData(null)
    let guildResponseRaw = await fetch(guildDataUrl + searchTerm);
    let guildResponse = await guildResponseRaw.json();
    console.log(guildResponse)
    setGuildData(guildResponse)
    setStatus('success')
  }

  return (
    <>
      <GuildSearchRow disabled={false} onSearch={fetchGuildData} guildList={guildList}/>
      {status === 'success' && <WynncraftGuild wynncraftGuildData={guildData} onGuildMemberClick={() => true}/>}
    </>
  )
}

export default WynncraftGuilds;