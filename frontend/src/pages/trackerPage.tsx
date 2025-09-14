import { useState } from "react";
import "./playerPage.css";
import TrackSearch from "./playerComponents/trackSearch";
import TrackPlayer from "./playerComponents/trackPlayer";
import { MojangData } from "../client";

function TrackerPage() {
  const [trackStatus, setTrackStatus] = useState<"search" | "track">("search") // can be "search" or "track"
  const [mojangData, setMojangData] = useState<MojangData | null>(null);

  if (trackStatus === "search") {
    return <TrackSearch handleStartTrack={() => setTrackStatus("track")} mojangData={mojangData} setMojangData={setMojangData} />
  }
  if (trackStatus === "track" && mojangData) {
    return <TrackPlayer mojangData={mojangData} setTrackStatus={setTrackStatus} />
  }
}

export default TrackerPage;
