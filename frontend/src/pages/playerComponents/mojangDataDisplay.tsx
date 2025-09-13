import SkinShowcase from "./skinShowcase.js";
import CapeShowcase from "./capeShowcase.js";
import CopyIcon from "./copyIcon.js";
import { motion } from "motion/react";
import SkinView from "./skinViewer.js";
import { MojangData } from "../../client/types.gen.js";

function MojangDataDisplay({ mojangResponse }: { mojangResponse: MojangData}) {
  return (
    <motion.div
      className="mojang-data"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div>
        <p className="username">{mojangResponse.username}</p>
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
