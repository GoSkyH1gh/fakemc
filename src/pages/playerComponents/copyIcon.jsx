import { motion } from "motion/react"

function CopyIcon({ textToCopy }) {
  return (
  <motion.img
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.7, duration: 0.5 }}
    src='/src/assets/content_copy_24dp_RGB(240, 240, 245)_FILL0_wght400_GRAD0_opsz24.svg'
    onClick={() => { navigator.clipboard.writeText(textToCopy)}}
    alt='copy uuid to clipboard'
    className="copy-icon"/>
  )
}

export default CopyIcon