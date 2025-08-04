import { motion } from "motion/react";
import { useState } from "react";
import GuildMembers from "./guildMembers";
import WynncraftTabbedData from "./wynncraftTabbedData";
import LoadingIndicator from "./loadingIndicator";

function AdvancedInfoTabs({
  onGuildMemberClick,
  hypixelResponse,
  hypixelGuildResponse,
  hypixelStatus,
  wynncraftData,
  wynncraftStatus,
  wynncraftGuildData,
}) {
  const [selectedTab, setSelectedTab] = useState("hypixel");
  let tabContents;
  if (selectedTab === "hypixel") {
    if (hypixelStatus === "playerloaded") {
      tabContents = <><br /><LoadingIndicator /></>;
    }
    if (hypixelStatus === "loaded") {
      if (hypixelResponse.guild_name) {
        tabContents = (
          <>
            <p>{hypixelResponse.guild_name}'s members: </p>
            <GuildMembers
              guild_members={hypixelGuildResponse.guild_members}
              onGuildMemberClick={onGuildMemberClick}
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
            onGuildMemberClick={onGuildMemberClick}
          />
        );
      }
    } else if (wynncraftStatus === "loading") {
      tabContents = <p>Loading Wynncraft data...</p>;
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
        <motion.button onClick={() => setSelectedTab("hypixel")}>
          Hypixel
        </motion.button>
        <motion.button onClick={() => setSelectedTab("wynncraft")}>
          Wynncraft
        </motion.button>
      </motion.div>
      <div>{tabContents}</div>
    </motion.div>
  );
}

export default AdvancedInfoTabs;
