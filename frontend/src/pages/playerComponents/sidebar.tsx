import { Link, useLocation } from "react-router-dom";
import footprintIcon from "/src/assets/footprint_icon.svg";
import { motion } from "motion/react";
import { Tooltip } from "radix-ui";
import { Icon } from "@iconify/react";
import { MaterialSymbolsSearchFilled } from "../../assets/filledSearchIcon";

function Sidebar() {
  const location = useLocation();
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
                  {location.pathname === "/" ? (
                    <Icon icon="material-symbols:home-rounded" />
                  ) : (
                    <Icon icon="material-symbols:home-outline-rounded" />
                  )}
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
                  {location.pathname.startsWith("/player") ? (
                    <MaterialSymbolsSearchFilled />
                  ) : (
                    <Icon icon="material-symbols:search-rounded" />
                  )}
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
                  {location.pathname.startsWith("/track/player") ? (
                    <Icon icon="material-symbols:footprint" />
                  ) : (
                    <Icon icon="material-symbols:footprint-outline" />
                  )}
                </Link>
              </motion.li>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">
                Track a player
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
                className="sidebar-icon"
              >
                <Link to="/favorites">
                  {location.pathname === "/favorites" ? (
                    <Icon icon="material-symbols:favorite-rounded" />
                  ) : (
                    <Icon icon="material-symbols:favorite-outline-rounded" />
                  )}
                </Link>
              </motion.li>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">
                Favorites
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </ul>
    </aside>
  );
}

export default Sidebar;
