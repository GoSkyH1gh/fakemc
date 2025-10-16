import { useEffect, useState } from "react";
import {
  getFavorites,
  Favorite,
  deleteFavorite,
  favoritesKey,
} from "../utils/favorites";
import { MojangData } from "../client";
import { MdDeleteOutline, MdOutlineSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { loadingSkin } from "./sampleData";
import { formatISOToDistance } from "../utils/utils";

function loadMojangData(uuid: string, setMojangData: Function) {
  const baseUrl = import.meta.env.VITE_API_URL;

  async function fetchMojangData() {
    if (uuid) {
      const mojangResponseRaw = await fetch(
        `${baseUrl}/v1/players/mojang/${uuid}`
      );
      if (!mojangResponseRaw.ok) {
        setMojangData("error");
      } else {
        const mojangResponse = await mojangResponseRaw.json();
        setMojangData(mojangResponse);
      }
    }
  }
  fetchMojangData();
}

function FavoriteElement({
  uuid,
  username,
  addedOn,
  setFavorites,
}: {
  uuid: string;
  username: string;
  addedOn: string;
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
}) {
  const navigator = useNavigate();
  const [mojangData, setMojangData] = useState<MojangData | null | "error">(
    null
  );
  useEffect(() => {
    loadMojangData(uuid, setMojangData);
  }, []);
  if (mojangData === "error") {
    return <li key={uuid}>Coudn't load {username}</li>;
  }
  return (
    <motion.li
      key={uuid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img
        src={
          mojangData?.skin_showcase_b64
            ? "data:image/png;base64," + mojangData.skin_showcase_b64
            : loadingSkin
        }
      />
      <div className="favorite-content">
        <h2 className="username">{mojangData?.username || username}</h2>
        <p className="info-card-label">added {formatISOToDistance(addedOn)}</p>
        <div className="favorite-action-container">
          <motion.button
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            className="icon-button favorite-action"
            onClick={() => {
              deleteFavorite(uuid);
              setFavorites(getFavorites());
            }}
          >
            <MdDeleteOutline display={"flex"} />
          </motion.button>
          <motion.button
            initial={{ scale: 1, backgroundColor: "#F4F077" }}
            whileHover={{ scale: 1.3, backgroundColor: "#f8d563ff" }}
            whileTap={{ scale: 0.9 }}
            className="icon-button favorite-action"
            onClick={() => navigator(`/player/${uuid}`)}
          >
            <MdOutlineSearch color="#101e10" />
          </motion.button>
        </div>
      </div>
    </motion.li>
  );
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);
  if (favorites.length === 0) {
    return <p>You don't have any favorites yet!</p>;
  }
  const favoriteElements = favorites.map((favorite) => (
    <>
      <FavoriteElement
        key={favorite.uuid}
        uuid={favorite.uuid}
        username={favorite.username}
        setFavorites={setFavorites}
        addedOn={favorite.addedOn}
      />
    </>
  ));

  return (
    <motion.ul layout className="favorites-list">
      {favoriteElements}
    </motion.ul>
  );
}
export default FavoritesPage;
