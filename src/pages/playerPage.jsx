import { useState } from 'react'
import './playerPage.css'
import { easeInOut, motion, transform, AnimatePresence, spring, scale } from "motion/react"
import MojangDataDisplay from "./playerComponents/mojangDataDisplay.jsx"
import HypixelDataDisplay from "./playerComponents/hypixelDataDisplay.jsx"
import SearchRow from "./playerComponents/searchRow.jsx"


export function PlayerPage() {
  const [mojangData, setMojangData] = useState(null);
  const [hypixelData, setHypixelData] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null)

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null)
  

  const fetchDataForPlayer = async (search_term) => {
    setMojangData(null);
    setHypixelData(null);
    setStatus("loading");
    setError(null);

    const mojangUrl = "http://127.0.0.1:8000/player/";
    const hypixelUrl = "http://127.0.0.1:8000/hypixel/";
    const statusUrl = "http://127.0.0.1:8000/status/";

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
      console.log("got status response: ", statusResponse)
      setPlayerStatus(statusJSON)
      
      // hypixel api
      let response2 = await fetch(hypixelUrl + mojangResponse.uuid);
      const hypixelResponse = await response2.json();
      console.log("got hypixel response: ", hypixelResponse);
      setHypixelData(hypixelResponse);
      setStatus("success")
    }
    catch (error) {
      console.error("An error occurred:", error);
      setError(error);
      setStatus("error")
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
      <div><MojangDataDisplay mojang_response={mojangData} reloadAnimations={false}/>
    <HypixelDataDisplay hypixel_response={hypixelData} onGuildMemberClick={fetchDataForPlayer} playerStatus={playerStatus} /></div>
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

