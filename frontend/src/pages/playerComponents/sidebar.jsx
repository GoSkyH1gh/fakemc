import { Link } from "react-router-dom";
import homeIcon from "/src/assets/home-icon.svg";
import searchIcon from "/src/assets/search-icon.svg";
import groupIcon from "/src/assets/group-icon.svg";
import footprintIcon from "/src/assets/footprint_icon.svg";
import { easeInOut, motion, scale } from "motion/react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <motion.li
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          tabIndex={-1}
        >
          <Link to="/" data-tooltip="Home" className="tooltip">
            <img src={homeIcon} alt="Home" className="icon" />
          </Link>
        </motion.li>
        <motion.li
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          tabIndex={-1}
        >
          <Link
            to="/player"
            data-tooltip="Search for a player"
            className="tooltip"
          >
            <img src={searchIcon} alt="Search for a player" className="icon" />
          </Link>
        </motion.li>
        <motion.li
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          tabIndex={-1}
        >
          <Link
            to="/track/player"
            data-tooltip="Track a player"
            className="tooltip"
          >
            <img src={footprintIcon} alt="Track a player" className="icon" />
          </Link>
        </motion.li>
      </ul>
    </aside>
  );
}

export default Sidebar;

/*
                <motion.li whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} transition={{ ease: "easeInOut", duration: 0.2}} tabIndex={-1}>
                    <Link to='/wynncraft/guilds' data-tooltip="Search for a Wynncraft guild" className="tooltip">
                        <img src={groupIcon} alt="Search for a Wynncraft guild" className="icon"/>
                    </Link>
                </motion.li>
*/
