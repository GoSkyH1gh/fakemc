import { useEffect, useState } from "react";
import { formatLogTime, formatSinceLastUpdate } from "./utils";
import stopIcon from "/src/assets/stop_circle_icon.svg";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion } from "motion/react";
import TrackTimeline from "./trackTimeline";
import CodeIcon from "/src/assets/code_icon.svg";
import TimelineIcon from "/src/assets/timeline_icon.svg";

function TrackPlayer({ mojangData, setTrackStatus }) {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;
  const trackerUrl = `${baseUrl}/v1/tracker/${mojangData.uuid}/status`;
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [tick, setTick] = useState(0);
  const [historyMode, setHistoryMode] = useState("timeline");

  useEffect(() => {
    const eventSource = new EventSource(trackerUrl);

    eventSource.addEventListener("data", (event) => {
      setLastUpdate(new Date());
      const data = JSON.parse(event.data);
      setHistory((prevHistory) => {
        const last = prevHistory[prevHistory.length - 1];
        if (JSON.stringify(last?.data) === JSON.stringify(data)) {
          return prevHistory;
        } else {
          return [...prevHistory, { data: data, timestamp: new Date() }];
        }
      });
      setStatus(data);
    });
    return () => {
      eventSource.close();
    };
  }, [mojangData.uuid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 1000);
  }, []);

  let onlineText = "Offline";
  let descriptionText = "";

  if (status?.wynncraft_online === true) {
    onlineText = "Online • Wynncraft";
    descriptionText = "on server " + status?.wynncraft_server;
  }

  if (status?.hypixel_online === true) {
    onlineText = "Online • Hypixel";
    descriptionText = `on ${status?.hypixel_game_type} • ${status?.hypixel_mode}`;
  }

  let historyElements;
  historyElements = history.map((event) => {
    const time = formatLogTime(event?.timestamp);
    let logInformation = "Offline";
    if (event?.data?.wynncraft_online) {
      logInformation = `Online • Wynncraft - ${event?.data?.wynncraft_server}`;
    }
    if (event?.data?.hypixel_online) {
      logInformation = `Online • Hypixel - ${event?.data?.hypixel_game_type} - ${event?.data?.hypixel_mode}`;
    }

    const logString = `[${time}] ${logInformation}`;
    return <li key={event?.timestamp}>{logString}</li>;
  });

  if (history.length === 0) {
    historyElements = <li>There's no events yet</li>;
  }

  return (
    <div className="player-tracker">
      <div className="track-header">
        <h2 className="compact-paragraph">Tracking {mojangData.username}</h2>
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => setTrackStatus("search")}
                className="track-stop-button"
              >
                <img src={stopIcon} alt="Stop Tracking" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">
                Stop Tracking {mojangData.username}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
      <p className="compact-paragraph">{formatSinceLastUpdate(lastUpdate)}</p>
      <div className="tracker-live-data">
        <h3>{onlineText}</h3>
        <p>{descriptionText}</p>
      </div>
      <div className="track-history-header">
        <h3>History</h3>
        <div className="select-container">
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <button
                  className="select-button-left select-button"
                  onClick={() => setHistoryMode("timeline")}
                >
                  <img src={TimelineIcon} alt="View history as a Timeline" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent">
                  View history as a Timeline
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <button
                  className="select-button-right select-button"
                  onClick={() => setHistoryMode("log")}
                >
                  <img src={CodeIcon} alt="View history as a Log" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent">
                  View history as a Log
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
      {historyMode === "timeline" && <TrackTimeline history={history} />}
      {historyMode === "log" && (
        <motion.ul
          className="tracker-history"
          initial={{ x: 60 }}
          animate={{ x: 0 }}
        >
          {historyElements}
        </motion.ul>
      )}
    </div>
  );
}

export default TrackPlayer;
