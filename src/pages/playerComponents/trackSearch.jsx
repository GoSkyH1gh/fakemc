import { motion } from "motion/react";
import SearchRow from "./searchRow";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingIndicator from "./loadingIndicator";

function TrackSearch({ handleStartTrack, mojangData, setMojangData }) {
  
  const { username } = useParams();

  const baseUrl = import.meta.env.VITE_API_URL;

  async function fetchMojangData() {
    setMojangData("loading")
    if (username) {
      const mojangResponseRaw = await fetch(
        `${baseUrl}/v1/players/mojang/${username}`
      );
      if (!mojangResponseRaw.ok) {
        setMojangData("error");
      } else {
        const mojangResponse = await mojangResponseRaw.json();
        setMojangData(mojangResponse);
      }
    }
  }

  useEffect(() => {
    fetchMojangData();
  }, [username]);
  return (
    <div className="player-tracker">
      <h2>Choose a player to track</h2>
      <SearchRow urlToNavigate="/track/player" />
      {mojangData === "loading" && (<LoadingIndicator />)}
      {mojangData === "error" && (
        <p>
          Something went wrong
          <br />
          Double check spelling or try again later
        </p>
      )}
      {mojangData != "error" && mojangData != null && mojangData != "loading" && (
        <motion.div
          className="track-player"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <h2 className="username">{mojangData?.username}</h2>
          <p className="uuid">uuid: {mojangData?.uuid}</p>
          <div className="track-flex">
            <motion.img
              whileHover={{ scale: 0.9 }}
              src={"data:image/png;base64," + mojangData?.skin_showcase_b64}
              className="skin-showcase"
              alt={mojangData?.username + "'s head"}
            />
            <motion.button
              whileHover={{
                borderColor: "#7d5df1ff",
                backgroundColor: "#7355E355",
              }}
              className="motion-button"
              onClick={handleStartTrack}
            >
              Start Tracking
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default TrackSearch