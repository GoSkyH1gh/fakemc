import { motion } from "motion/react";
import copyIcon from "/src/assets/copy-icon.svg";

function CopyIcon({ textToCopy }) {
  return (
    <motion.button
      className="icon-button"
      onClick={() => {
        navigator.clipboard.writeText(textToCopy);
      }}
      whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.7, duration: 0.5 }}
    >
      <motion.img
        src={copyIcon}
        alt="copy uuid to clipboard"
        className="copy-icon"
      />
    </motion.button>
  );
}

export default CopyIcon;
