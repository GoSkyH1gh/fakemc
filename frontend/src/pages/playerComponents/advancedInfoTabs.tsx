import { motion } from "motion/react";
import { useState } from "react";
import WynncraftTabbedData from "./wynncraftTabbedData";
import LoadingIndicator from "./loadingIndicator";
import DonutTabbedData from "./donutTabbedData";
import McciTabbedData from "./mcciTabbedData";
import HypixelTabbedData from "./hypixelTabbedData";
import {
  HypixelFullData,
  HypixelGuildMemberFull,
  PlayerSummary,
  GuildInfo,
  DonutPlayerStats,
  McciPlayer,
} from "../../client";

type AdvancedInfoProps = {
  hypixelResponse:
    | HypixelFullData
    | null
    | "not found"
    | "not found (server error)";
  hypixelGuildResponse: HypixelGuildMemberFull[] | "no guild" | null;
  fetchHypixelGuildMembers: (
    hypixelResponse: HypixelFullData,
    setHypixelGuildData: React.Dispatch<React.SetStateAction<HypixelGuildMemberFull[] | "no guild" | null>>,
    offset: number
  ) => void;
  setHypixelGuildData: React.Dispatch<
    React.SetStateAction<HypixelGuildMemberFull[] | null | "no guild">
  >;
  hypixelStatus: null | "loading" | "playerLoaded" | "loaded";
  wynncraftData:
    | PlayerSummary
    | "not found"
    | "not found (server error)"
    | null;
  wynncraftStatus: null | "loading" | "playerLoaded" | "loaded";
  wynncraftGuildData: GuildInfo | "no guild" | null;
  donutData: DonutPlayerStats | "not found" | null | "error";
  donutStatus: null | "loading" | "loaded";
  mcciData: McciPlayer | null | "not found" | "error";
  mcciStatus: null | "loading" | "loaded";
  loadedTabs: string[];
  uuid: string;
};

function AdvancedInfoTabs({
  hypixelResponse,
  hypixelGuildResponse,
  fetchHypixelGuildMembers,
  setHypixelGuildData,
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
}: AdvancedInfoProps) {
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  if (selectedTab === undefined && loadedTabs.length > 0) {
    setSelectedTab(loadedTabs[0]);
  }

  let tabContents;
  if (selectedTab === "hypixel") {
    if (hypixelStatus === "playerLoaded") {
      tabContents = (
        <>
          <br />
          <LoadingIndicator />
        </>
      );
    }
    if (hypixelStatus === "loaded") {
      if (
        hypixelResponse &&
        hypixelResponse !== "not found" &&
        hypixelResponse !== "not found (server error)"
      ) {
        tabContents = (
          <HypixelTabbedData
            hypixelData={hypixelResponse}
            hypixelGuildData={hypixelGuildResponse}
            setHypixelGuildData={setHypixelGuildData}
            fetchHypixelGuildMembers={fetchHypixelGuildMembers}
          />
        );
      }
    }
  } else if (selectedTab === "wynncraft") {
    if (wynncraftStatus === "loaded") {
      if (wynncraftData === "not found") {
        tabContents = <p>Wynncraft data not found for player</p>;
      } else if (wynncraftData === null) {
        tabContents = <p>No data to show</p>;
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
      tabContents = <p>loading donut data...</p>;
    } else if (donutStatus === "loaded") {
      tabContents = <DonutTabbedData donutData={donutData} uuid={uuid} />;
    }
  } else if (selectedTab === "mcci") {
    if (mcciStatus === "loading") {
      tabContents = <p>loading MCC Island data...</p>;
    } else if (mcciStatus === "loaded") {
      tabContents = <McciTabbedData mcciData={mcciData} />;
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut", delay: 0.4 }}
      className="advanced-info-tabs"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.6 }}
        className="advanced-tabs"
      >
        {loadedTabs.includes("hypixel") && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setSelectedTab("hypixel")}
            className={"hypixel" === selectedTab ? "selected-tab" : ""}
          >
            Hypixel
          </motion.button>
        )}
        {loadedTabs.includes("wynncraft") && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setSelectedTab("wynncraft")}
            className={"wynncraft" === selectedTab ? "selected-tab" : ""}
          >
            Wynncraft
          </motion.button>
        )}
        {loadedTabs.includes("donut") && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setSelectedTab("donut")}
            className={"donut" === selectedTab ? "selected-tab" : ""}
          >
            Donut SMP
          </motion.button>
        )}
        {loadedTabs.includes("mcci") && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setSelectedTab("mcci")}
            className={"mcci" === selectedTab ? "selected-tab" : ""}
          >
            MCC Island
          </motion.button>
        )}
      </motion.div>
      <div>{tabContents}</div>
    </motion.div>
  );
}

export default AdvancedInfoTabs;
