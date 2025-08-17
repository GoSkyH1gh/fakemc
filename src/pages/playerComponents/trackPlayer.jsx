import { useEffect, useState } from "react";
import { formatDistanceToNowStrict, format } from "date-fns";
import stopIcon from "/src/assets/stop_circle_icon.svg";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion } from "motion/react";

function TrackPlayer({ mojangData, setTrackStatus }) {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;
  const trackerUrl = `${baseUrl}/v1/tracker/${mojangData.uuid}/status`;
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [tick, setTick] = useState(0);

  const formatSinceLastUpdate = (date) => {
    if (!date) {
      return "unknown";
    }
    return "last updated " + formatDistanceToNowStrict(date) + " ago";
  };

  const formatLogTime = (date) => {
    if (!date) {
      return "unknown";
    }
    return format(date, "KK:mm a");
  };

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
      console.log(data);
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
    onlineText = "Online on Wynncraft";
    descriptionText = "on server " + status?.wynncraft_server;
  }

  if (status?.hypixel_online === true) {
    onlineText = "Online on Hypixel";
  }

  let historyElements;
  historyElements = history.map((event) => {
    const time = formatLogTime(event?.timestamp);
    let wynncraftMessage = "Offline";
    if (event?.data?.wynncraft_online) {
      wynncraftMessage = `Online on Wynncraft - ${event?.data?.wynncraft_server}`;
    }

    const logString = `[${time}] ${wynncraftMessage}`;
    return <motion.li initial={{x: -30}} animate={{x: 0}}>{logString}</motion.li>;
  });

  if (history.length === 0) {
    historyElements = <li>There's nothing here yet</li>;
  }

  return (
    <div className="player-tracker">
      <div className="track-header">
        <h2 className="compact-paragraph">Tracking {mojangData.username}</h2>
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <button onClick={() => setTrackStatus("search")}>
                <img src={stopIcon} alt="Stop Tracking"/>
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
      <h3>History</h3>
      <ul className="tracker-history">{historyElements}</ul>
    </div>
  );
}

export default TrackPlayer;
