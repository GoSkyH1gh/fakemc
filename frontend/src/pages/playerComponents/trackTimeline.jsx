import TimelinePart from "/src/assets/timeline_part.svg";
import TimelineEnd from "/src/assets/timeline_end.svg";
import { formatLogTime } from "./utils";
import { motion } from "motion/react";

function TrackTimeline({ history }) {
  if (history.length === 0) {
    return (
      <ul className="tracker-timeline">
        <li className="timeline-item">There's no events yet</li>
      </ul>
    );
  }
  const reversedHistory = [...history].reverse();
  const historyElements = reversedHistory.map((event, index) => {
    const lastElement = reversedHistory.length === index + 1;
    let headerText = "Offline";
    let descriptionText = "";
    if (event?.data?.wynncraft_online === true) {
      headerText = "Online • Wynncraft";
      descriptionText = `on ${event?.data?.wynncraft_server}`;
    }
    if (event?.data?.hypixel_online === true) {
      headerText = "Online • Hypixel";
      descriptionText = `playing ${event?.data?.hypixel_game_type} • ${event?.data?.hypixel_mode}`;
    }
    return (
      <motion.li
        layout
        key={event?.timestamp}
        className={`timeline-item ${
          lastElement === true ? "last-timeline-item" : ""
        }`}
      >
        <span className="timeline-time">{formatLogTime(event?.timestamp)}</span>
        <img
          src={lastElement ? TimelineEnd : TimelinePart}
          className="timeline-part"
          alt=""
          aria-hidden="true"
        />
        <div>
          <span className="timeline-header">{headerText}</span>
          <br />
          <span className="timeline-description">{descriptionText}</span>
        </div>
      </motion.li>
    );
  });
  return (
    <motion.ul
      className="tracker-timeline"
      initial={{ x: -60 }}
      animate={{ x: 0 }}
    >
      {historyElements}
    </motion.ul>
  );
}

export default TrackTimeline;
