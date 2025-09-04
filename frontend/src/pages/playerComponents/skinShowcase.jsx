import { motion } from "motion/react"

function SkinShowcase({ skin_showcase_b64 }) {
  return (
    <motion.img
      initial={{scale: 0}}
      animate={{scale: 1}}
      transition={{ duration: 0.4, type: "spring" }}
      src={'data:image/png;base64,' + skin_showcase_b64} className='skin-showcase'
      alt="skin of searched player" />
  )
}

export default SkinShowcase