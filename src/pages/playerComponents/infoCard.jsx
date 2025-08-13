import { motion } from "motion/react";
import ArrowOutward from "/src/assets/arrow-outward.svg";
import * as Popover from "@radix-ui/react-popover";

function InfoCard({ label, value, onClick, hasStats = false, children }) {
  if (hasStats) {
    return (
      <motion.li
        className="info-card"
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
      >
        <div className="info-card-row">
          <div>
            <span className="info-card-label">{label}</span>
            <br />
            <span className="info-card-value">{value}</span>
          </div>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="icon-button" onClick={onClick}>
                <img src={ArrowOutward} alt="View Stats" className="icon" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content sideOffset={-500} align="start">
                <motion.div
                  initial={{ scale: 0, y: 40, x: -40 }}
                  animate={{ scale: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  layout
                >
                  {children}
                </motion.div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </motion.li>
    );
  }
  return (
    <motion.li
      className="info-card"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <span className="info-card-label">{label}</span>
      <br />
      <span className="info-card-value">{value}</span>
    </motion.li>
  );
}

export default InfoCard;
