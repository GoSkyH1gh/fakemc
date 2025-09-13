import { Link } from "react-router-dom";
import homeIcon from "/src/assets/home-icon.svg";
import searchIcon from "/src/assets/search-icon.svg";
import footprintIcon from "/src/assets/footprint_icon.svg";
import { motion } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <motion.li
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ ease: "easeInOut", duration: 0.2 }}
                tabIndex={-1}
              >
                <Link to="/">
                  <img src={homeIcon} alt="Home" className="icon" />
                </Link>
              </motion.li>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">Home</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <motion.li
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ ease: "easeInOut", duration: 0.2 }}
                tabIndex={-1}
              >
                <Link to="/player">
                  <img
                    src={searchIcon}
                    alt="Search for a player"
                    className="icon"
                  />
                </Link>
              </motion.li>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">
                Search for a player
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <motion.li
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ ease: "easeInOut", duration: 0.2 }}
                tabIndex={-1}
              >
                <Link to="/track/player">
                  <img
                    src={footprintIcon}
                    alt="Track a player"
                    className="icon"
                  />
                </Link>
              </motion.li>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">
                Track a player
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </ul>
    </aside>
  );
}

export default Sidebar;