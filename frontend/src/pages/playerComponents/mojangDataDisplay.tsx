import SkinShowcase from "./skinShowcase.js";
import CapeShowcase from "./capeShowcase.js";
import CopyIcon from "./copyIcon.js";
import { motion } from "motion/react";
import SkinView from "./skinViewer.js";
import { MojangData } from "../../client/types.gen.js";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import {
  addFavorite,
  checkFavorite,
  deleteFavorite,
} from "../../utils/favorites.js";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

function MojangDataDisplay({ mojangResponse }: { mojangResponse: MojangData }) {
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    if (checkFavorite(mojangResponse.uuid)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [mojangResponse.uuid]);
  return (
    <motion.div
      className="mojang-data"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div>
        <div className="text-icon">
          <p className="username">{mojangResponse.username}</p>

          <Tooltip.Provider>
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <motion.button
                  className="icon-button flex"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (isFavorite) {
                      deleteFavorite(mojangResponse.uuid);
                      setIsFavorite(false);
                    } else {
                      const now = new Date();
                      addFavorite({
                        username: mojangResponse.username,
                        uuid: mojangResponse.uuid,
                        addedOn: now.toISOString(),
                      });
                      setIsFavorite(true);
                    }
                  }}
                > 
                  {isFavorite && <MdFavorite />}
                  {!isFavorite && <MdFavoriteBorder />}
                </motion.button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent">
                  Favorite {mojangResponse.username}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <p className="uuid">
          uuid: {mojangResponse.uuid}
          <CopyIcon textToCopy={mojangResponse.uuid} />
        </p>
      </div>
      <div className="mojang-img">
        <SkinShowcase skin_showcase_b64={mojangResponse.skin_showcase_b64} />
        <CapeShowcase
          cape_showcase_b64={mojangResponse.cape_front_b64}
          cape_back_b64={mojangResponse.cape_back_b64}
          has_cape={mojangResponse.has_cape}
          cape_name={mojangResponse.cape_name}
        />
        <SkinView
          skinUrl={mojangResponse.skin_url}
          capeUrl={mojangResponse.cape_url}
          username={mojangResponse.username}
        />
      </div>
    </motion.div>
  );
}

export default MojangDataDisplay;
