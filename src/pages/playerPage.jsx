import { useEffect, useState } from "react";
import "./playerPage.css";
import { useParams } from "react-router-dom";
import MojangDataDisplay from "./playerComponents/mojangDataDisplay.jsx";
import QuickInfo from "./playerComponents/quickInfo.jsx";
import SearchRow from "./playerComponents/searchRow.jsx";
import LoadingIndicator from "./playerComponents/loadingIndicator.jsx";
import AdvancedInfoTabs from "./playerComponents/advancedInfoTabs.jsx";

export function PlayerPage() {
  const { username } = useParams(); 
  console.log(username);
  useEffect(() => {
    if (username) {
      fetchDataForPlayer(username);
    }
  }, [username])

  const [mojangData, setMojangData] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null);

  const [hypixelData, setHypixelData] = useState(null);
  const [hypixelStatus, setHypixelStatus] = useState(null);
  const [hypixelGuildData, setHypixelGuildData] = useState(null);

  const [wynncraftData, setWynncraftData] = useState(null);
  const [wynncraftStatus, setWynncraftStatus] = useState(null);
  const [wynncraftGuildData, setWynncraftGuildData] = useState(null);

  const [donutData, setDonutData] = useState(null);
  const [donutStatus, setDonutStatus] = useState(null);

  const [mcciData, setMcciData] = useState(null);
  const [mcciStatus, setMcciStatus] = useState(null);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const [loadedTabs, setLoadedTabs] = useState([])

  const addLoadedTab = (tabToAdd) => {setLoadedTabs(prev => [...prev, tabToAdd])}

  const fetchDataForPlayer = async (search_term) => {
    setMojangData(null);
    setHypixelData(null);
    setHypixelGuildData(null);
    setWynncraftData(null);
    setWynncraftGuildData(null);
    setStatus("loading");
    setError(null);

    setDonutData(null);
    setMcciData(null);

    setWynncraftStatus("loading");
    setHypixelStatus("loading");
    setDonutStatus("loading");
    setMcciStatus("loading");

    setLoadedTabs([])

    const baseUrl =
      import.meta.env.VITE_API_URL ?? "https://fastapi-fakemc.onrender.com";

    const mojangUrl = `${baseUrl}/v1/players/mojang/`;
    const hypixelUrl = `${baseUrl}/v1/players/hypixel/`;
    const hypixelGuildUrl = `${baseUrl}/v1/hypixel/guilds/`;
    const statusUrl = `${baseUrl}/v1/players/status/`;
    const wynncraftUrl = `${baseUrl}/v1/players/wynncraft/`;
    const wynncraftGuildUrl = `${baseUrl}/v1/wynncraft/guilds/`;
    const donutUrl = `${baseUrl}/v1/players/donutsmp/`;
    const mcciUrl = `${baseUrl}/v1/players/mccisland/`;

    try {
      let mojangResponseRaw = await fetch(mojangUrl + search_term);
      if (mojangResponseRaw.status == 404) {
        throw new Error("Player not found");
      } else if (!mojangResponseRaw.ok) {
        throw new Error("server error");
      }
      const mojangResponse = await mojangResponseRaw.json();
      if (mojangResponse.status == "lookup_failed") {
        throw new Error("player not found!");
      }
      console.log("got mojang response:", mojangResponse);
      setStatus("loadedMojang");
      setMojangData(mojangResponse);

      // status response
      let statusResponseRaw = await fetch(statusUrl + mojangResponse.uuid);
      const statusResponse = await statusResponseRaw.json();
      console.log("got status response: ", statusResponse);
      setPlayerStatus(statusResponse);

      // hypixel
      let hypixelResponseRaw = await fetch(hypixelUrl + mojangResponse.uuid);
      if (hypixelResponseRaw.ok) {
        const hypixelResponse = await hypixelResponseRaw.json();
        console.log("got hypixel response: ", hypixelResponse);
        setHypixelData(hypixelResponse);
        setHypixelStatus("playerloaded");
        addLoadedTab("hypixel");
        if (hypixelResponse.guild_name) {
          let hypixelGuildResponseRaw = await fetch(
            hypixelGuildUrl + mojangResponse.uuid
          );
          const hypixelGuildResponse = await hypixelGuildResponseRaw.json();
          setHypixelStatus("loaded");
          setHypixelGuildData(hypixelGuildResponse);
          console.log(hypixelGuildResponse);
        } else {
          setHypixelStatus("loaded");
          setHypixelGuildData("no guild");
        }
      } else if (hypixelResponseRaw.status === 404) {
        setHypixelData("not found");
        setHypixelStatus("loaded");
      } else {
        setHypixelData("not found (server error)");
        setHypixelStatus("loaded")
        throw new Error("error for Hypixel data")
      }

      // wynncraft
      let wynnResponseRaw = await fetch(wynncraftUrl + mojangResponse.uuid);
      const wynnResponse = await wynnResponseRaw.json();
      console.log("got wynncraft response: ", wynnResponse);
      if (wynnResponseRaw.ok) {
        setWynncraftData(wynnResponse);
        setWynncraftStatus("playerloaded");
        addLoadedTab("wynncraft");
        if (wynnResponse.guild_name != null) {
          let wynnGuildResponseRaw = await fetch(
            wynncraftGuildUrl + wynnResponse.guild_name
          );
          const wynnGuildResponse = await wynnGuildResponseRaw.json();
          console.log("got wynncraft guild response: ", wynnGuildResponse);
          setWynncraftGuildData(wynnGuildResponse);
          setWynncraftStatus("loaded");
        } else {
          setWynncraftStatus("loaded");
          setWynncraftGuildData("no guild");
          console.log("no guild for searched wynncraft player");
        }
      } else if (wynnResponseRaw.status === 404) {
        setWynncraftData("not found");
        setWynncraftStatus("loaded");
      } else {
        setWynncraftData("not found (server error)");
        setWynncraftStatus("loaded");
        throw new Error("error for Wynncraft data");
      }

      // donut
      let donutResponseRaw = await fetch(donutUrl + mojangResponse.username);
      if (!donutResponseRaw.ok) {
        if (donutResponseRaw.status === 404) {
          setDonutData("not found");
        } else {
          setDonutData("error");
          throw new Error("error for donut data");
        }
        setDonutStatus("loaded");
      } else {
        const donutResponse = await donutResponseRaw.json();
        console.log("got donut response: ", donutResponse);
        setDonutData(donutResponse);
        setDonutStatus("loaded");
        addLoadedTab("donut");
      }

      // mcc island
      let mcciResponseRaw = await fetch(mcciUrl + mojangResponse.uuid);
      if (!mcciResponseRaw.ok) {
        if (mcciResponseRaw.status === 404) {
          setMcciData("not found");
        } else {
          setMcciData("error");
          throw new Error("error for mcc island data");
        }
        setMcciStatus("loaded");
      } else {
        const mcciResponse = await mcciResponseRaw.json();
        console.log("got mcc island response: ", mcciResponse);
        setMcciData(mcciResponse);
        setMcciStatus("loaded");
        addLoadedTab("mcci");
      }

    } catch (error) {
      console.error("An error occurred:", error);
      setError(error);
      setStatus("error");
      setWynncraftStatus(null);
    }
  };

  return (
    <>
      <SearchRow
        disabled={status === "loading"}
      />
      <br />

      {status === "loading" && <LoadingIndicator />}
      {status === "idle" && <p>Enter a player to search</p>}
      {status === "error" && (
        <div>
          <h3>An error occured</h3>
          <p>{error.message}</p>
        </div>
      )}

      {status === "loadedMojang" && (
        <div>
          <MojangDataDisplay mojang_response={mojangData} />
        </div>
      )}

      {hypixelStatus === "loading" && status === "loadedMojang" && (
        <LoadingIndicator />
      )}

      {(hypixelStatus === "playerloaded" || hypixelStatus === "loaded") && (
        <div>
          <QuickInfo
            hypixel_response={hypixelData}
            playerStatus={playerStatus}
          />
          <AdvancedInfoTabs
            hypixelResponse={hypixelData}
            hypixelGuildResponse={hypixelGuildData}
            hypixelStatus={hypixelStatus}
            wynncraftData={wynncraftData}
            wynncraftStatus={wynncraftStatus}
            wynncraftGuildData={wynncraftGuildData}
            donutData={donutData}
            donutStatus={donutStatus}
            mcciData={mcciData}
            mcciStatus={mcciStatus}
            loadedTabs={loadedTabs}
          />
        </div>
      )}
    </>
  );
}
