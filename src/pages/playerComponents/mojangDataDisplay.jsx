import SkinShowcase from "./skinShowcase.jsx"
import CapeShowcase from "./capeShowcase.jsx"
import CopyIcon from "./copyIcon.jsx"
import { motion } from "motion/react"

function MojangDataDisplay({ mojang_response: mojangResponse, reloadAnimations }) {
  return (
    <motion.div
      className='mojang-data'
      variants={{ hidden: { opacity: 0, y: 20 }, notHidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } }}}
      initial={reloadAnimations ? "hidden" : "notHidden"}
      animate="show">
      <div>
        <p className='username'>{mojangResponse.username}</p>
        <p className='uuid'>
          uuid: {mojangResponse.uuid}
          <CopyIcon textToCopy={mojangResponse.uuid} />
        </p>
      </div>
      <div className='mojang-img'>
        <SkinShowcase skin_showcase_b64={mojangResponse.skin_showcase_b64} reloadAnimations={reloadAnimations}/>
        <CapeShowcase 
          cape_showcase_b64={mojangResponse.cape_showcase_b64}
          cape_back_b64={mojangResponse.cape_back_b64}
          has_cape={mojangResponse.has_cape}
          cape_name={mojangResponse.cape_name}
          reloadAnimations={reloadAnimations} />
      </div>
    </motion.div>
  )
}

export default MojangDataDisplay