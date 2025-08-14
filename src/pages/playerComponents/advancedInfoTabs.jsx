import { motion } from "motion/react";
import { useState } from "react";
import GuildMembers from "./guildMembers";
import WynncraftTabbedData from "./wynncraftTabbedData";
import LoadingIndicator from "./loadingIndicator";
import DonutTabbedData from "./donutTabbedData";
import McciTabbedData from "./mcciTabbedData";

function AdvancedInfoTabs({
  hypixelResponse,
  hypixelGuildResponse,
  hypixelStatus,
  wynncraftData,
  wynncraftStatus,
  wynncraftGuildData,
  donutData,
  donutStatus,
  mcciData,
  mcciStatus,
  loadedTabs,
  uuid,
}) {
  const [selectedTab, setSelectedTab] = useState("");
  if (selectedTab === "" && loadedTabs.length > 0) {
    setSelectedTab(loadedTabs[0])
  }
  
  let tabContents;
  if (selectedTab === "hypixel") {
    if (hypixelStatus === "playerloaded") {
      tabContents = (
        <>
          <br />
          <LoadingIndicator />
        </>
      );
    }
    if (hypixelStatus === "loaded") {
      if (hypixelResponse.guild_name) {
        tabContents = (
          <>
            <p>{hypixelResponse.guild_name}'s members: </p>
            <GuildMembers
              guild_members={hypixelGuildResponse.guild_members}
            />
          </>
        );
      }
      if (!hypixelGuildResponse.guild_name) {
        tabContents = <p>No more information to show for player</p>;
      }
    }
  } else if (selectedTab === "wynncraft") {
    if (wynncraftStatus === "loaded") {
      if (wynncraftData === "not found") {
        tabContents = <p>Wynncraft data not found for player</p>;
      } else if (wynncraftData === "not found (server error)") {
        tabContents = <p>Wynncraft data unavailable due to server error</p>;
      } else {
        tabContents = (
          <WynncraftTabbedData
            wynncraftData={wynncraftData}
            wynncraftGuildData={wynncraftGuildData}
          />
        );
      }
    } else if (wynncraftStatus === "loading") {
      tabContents = <p>Loading Wynncraft data...</p>;
    }
  } else if (selectedTab === "donut") {
    if (donutStatus === "loading") {
      tabContents = <p>loading donut data...</p>
    }
    else if (donutStatus === "loaded") {
      tabContents = (
        <DonutTabbedData donutData={donutData} uuid={uuid}/>
      )
    }
  } else if (selectedTab === "mcci") {
    if (mcciStatus === "loading") {
      tabContents = <p>loading MCC Island data...</p>
    }  else if (mcciStatus === "loaded") {
      tabContents = <McciTabbedData mcciData={mcciData}/>
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.4 }}
      className="advanced-info-tabs"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.6 }}
        className="advanced-tabs"
      >
        {loadedTabs.includes('hypixel') && <motion.button initial={{scale: 0}} animate={{scale: 1}} onClick={() => setSelectedTab("hypixel")}>
          Hypixel
        </motion.button>}
        {loadedTabs.includes('wynncraft') && <motion.button initial={{scale: 0}} animate={{scale: 1}} onClick={() => setSelectedTab("wynncraft")}>
          Wynncraft
        </motion.button>}
        {loadedTabs.includes('donut') && <motion.button initial={{scale: 0}} animate={{scale: 1}} onClick={() => setSelectedTab("donut")}>
          Donut SMP
        </motion.button>}
        {loadedTabs.includes('mcci') && <motion.button initial={{scale: 0}} animate={{scale: 1}} onClick={() => setSelectedTab("mcci")}>
          MCC Island
        </motion.button>}
      </motion.div>
      <div>{tabContents}</div>
    </motion.div>
  );
}

export default AdvancedInfoTabs;
