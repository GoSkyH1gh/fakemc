import { useState } from 'react'
import './playerPage.css'
import { easeInOut, motion, transform, AnimatePresence, spring, scale } from "motion/react"
import MojangDataDisplay from "./playerComponents/mojangDataDisplay.jsx"
import QuickInfo from "./playerComponents/quickInfo.jsx"
import SearchRow from "./playerComponents/searchRow.jsx"
import LoadingIndicator from './playerComponents/loadingIndicator.jsx'
import AdvancedInfoTabs from './playerComponents/advancedInfoTabs.jsx'

export function PlayerPage() {
  const [mojangData, setMojangData] = useState(null);
  const [hypixelData, setHypixelData] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null);

  const [wynncraftData, setWynncraftData] = useState(null);
  const [wynncraftStatus, setWynncraftStatus] = useState(null)
  const [wynncraftGuildData, setWynncraftGuildData] = useState(null)

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null)
  

  const fetchDataForPlayer = async (search_term) => {
    setMojangData(null);
    setHypixelData(null);
    setWynncraftData(null);
    setWynncraftGuildData(null);
    setStatus("loading");
    setError(null);
    

    setWynncraftStatus('loading')

    const baseUrl = import.meta.env.VITE_API_URL;

    const mojangUrl = `${baseUrl}/v1/players/mojang/`;
    const hypixelUrl = `${baseUrl}/v1/players/hypixel/`;
    const statusUrl = `${baseUrl}/v1/players/status/`;
    const wynncraftUrl = `${baseUrl}/v1/players/wynncraft/`;
    const wynncraftGuildUrl = `${baseUrl}/v1/wynncraft/guilds/`;

    try {
      let response = await fetch(mojangUrl + search_term);
      if (!response.ok) {
        throw new Error("server error")
      }
      const mojangResponse = await response.json();
      if (mojangResponse.status == "lookup_failed") {
        throw new Error("player not found!")
      }
      console.log('got mojang response:', mojangResponse);
      setStatus("loadedMojang")
      setMojangData(mojangResponse);

      // status response
      let statusResponse = await fetch(statusUrl + mojangResponse.uuid);
      const statusJSON = await statusResponse.json();
      console.log("got status response: ", statusJSON)
      setPlayerStatus(statusJSON)
      
      // hypixel api
      let response2 = await fetch(hypixelUrl + mojangResponse.uuid);
      const hypixelResponse = await response2.json();
      console.log("got hypixel response: ", hypixelResponse);
      setHypixelData(hypixelResponse);
      setStatus("success")

      // wynncraft
      let wynnResponseRaw = await fetch(wynncraftUrl + mojangResponse.uuid);
      const wynnResponse = await wynnResponseRaw.json();
      console.log("got wynncraft response: ", wynnResponse);
      if (wynnResponseRaw.ok) {
        setWynncraftData(wynnResponse)
        setWynncraftStatus("playerloaded")
        if (wynnResponse.guild_name != null) {
          let wynnGuildResponseRaw = await fetch(wynncraftGuildUrl + wynnResponse.guild_name);
          const wynnGuildResponse = await wynnGuildResponseRaw.json();
          console.log("got wynncraft guild response: ", wynnGuildResponse);
          setWynncraftGuildData(wynnGuildResponse);
          setWynncraftStatus("loaded")
        }
        else {
          setWynncraftStatus("loaded")
          setWynncraftGuildData("no guild")
          console.log("no guild for searched player")
        }
        
      }
      else if (wynnResponseRaw.status === 404) {
        setWynncraftData('not found')
        setWynncraftStatus("loaded")
      }
      else {
        setWynncraftData('not found (server error)');
        setWynncraftStatus("loaded")
        throw new Error('error for Wynncraft data')
      }
      
      
    }
    catch (error) {
      console.error("An error occurred:", error);
      setError(error);
      setStatus("error")
      setWynncraftStatus(null)
    }
  }
  
  return (
  <>
    <SearchRow onSearch={fetchDataForPlayer} disabled={status === 'loading'} /><br />

    {status === 'loading' && (<div />)}
    {status === 'idle' && (<p>Enter a player to search</p>)}
    {status === 'error' && (<div><h3>An error occured</h3><p>{error.message}</p></div>)}

    {status === 'loadedMojang' && (<div><MojangDataDisplay mojang_response={mojangData} reloadAnimations={true}/></div>)}
    {status === 'success' && (
      <div>
        <MojangDataDisplay mojang_response={mojangData} reloadAnimations={false}/>
        <QuickInfo hypixel_response={hypixelData} onGuildMemberClick={fetchDataForPlayer} playerStatus={playerStatus} />
        <AdvancedInfoTabs
          hypixelResponse={hypixelData}
          onGuildMemberClick={fetchDataForPlayer}
          wynncraftData={wynncraftData}
          wynncraftStatus={wynncraftStatus}
          wynncraftGuildData={wynncraftGuildData}/>
      </div>
    )}
  </>
  )
}


// not used for now
function LoadingSkeleton() {
  return (
    <div className='loading-skeleton'></div>
  )
}

