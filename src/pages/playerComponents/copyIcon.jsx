import { motion } from "motion/react"
import copyIcon from '/src/assets/copy-icon.svg'

function CopyIcon({ textToCopy }) {
  return (
  <motion.img
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.7, duration: 0.5 }}
    src={copyIcon}
    onClick={() => { navigator.clipboard.writeText(textToCopy)}}
    alt='copy uuid to clipboard'
    className="copy-icon"/>
  )
}

export default CopyIcon