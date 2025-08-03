import { motion } from "motion/react";
import loadingIndicator from "/src/assets/3-dots-scale.svg";

function LoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="loading-container"
    >
      <img src={loadingIndicator} />
    </motion.div>
  );
}

export default LoadingIndicator;