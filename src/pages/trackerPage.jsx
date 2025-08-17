import { useState } from "react";
import "./playerPage.css";
import TrackSearch from "./playerComponents/trackSearch";
import TrackPlayer from "./playerComponents/trackPlayer";

function TrackerPage() {
  const [trackStatus, setTrackStatus] = useState("search") // can be "search" or "track"
  const [mojangData, setMojangData] = useState(null);

  if (trackStatus === "search") {
    return <TrackSearch handleStartTrack={() => setTrackStatus("track")} mojangData={mojangData} setMojangData={setMojangData} />
  }
  if (trackStatus === "track") {
    return <TrackPlayer mojangData={mojangData} setTrackStatus={setTrackStatus} />
  }
}

export default TrackerPage;
