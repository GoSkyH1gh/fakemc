import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import "./homePage.css";
import MojangDataDisplay from "./playerComponents/mojangDataDisplay.js";
import PurpleOrangeGradient from "/src/assets/purple_to_orange_gradient.svg";
import YellowGradient from "/src/assets/yellow_gradient.svg";
import { MdSearch } from "react-icons/md";
import { useState, useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import QuickInfo from "./playerComponents/quickInfo.js";
import AdvancedInfoTabs from "./playerComponents/advancedInfoTabs.js";
import {
  sampleHypixelResponse,
  sampleHypixelGuildResponse,
  sampleMCCIResponse,
  sampleMojangResponse,
  sampleWynncraftGuildResponse,
  sampleWynncraftResponse,
} from "./sampleData";

function HeroSearchbar() {
  const [searchbarValue, setSerchbarValue] = useState("");
  const navigate = useNavigate();
  return (
    <div className="hero-searchbar">
      <MdSearch />
      <input
        placeholder="jeb_"
        value={searchbarValue}
        onChange={(e) => {
          setSerchbarValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`/player/${searchbarValue.trim()}`);
          }
        }}
      ></input>
    </div>
  );
}

export function HomePage() {
  const [sampleState, setSampleState] = useState<object[]>([]);
  const targetScroll = useRef<HTMLHeadingElement>(null);
  return (
    <>
      <div className="hero-background" />
      <img
        src={PurpleOrangeGradient}
        className="purple-orange-gradient"
        alt=""
      />
      <img src={YellowGradient} className="yellow-gradient" alt="" />
      <div className="hero-section">
        <div className="hero-headings">
          <h1 className="hero-h1">Search for any Minecraft player</h1>
          <h2 className="hero-h2">All the info you need, in one place</h2>
        </div>
        <HeroSearchbar />
        <div className="hero-card-container">
          <motion.div className="hero-card" whileHover={{ y: -10 }}>
            <h3 className="hero-card-heading">All Stats, One Place</h3>
            <p className="hero-card-paragraph">
              Stop juggling tabs. Data from Mojang, Hypixel, Wynncraft & more,
              in one place.
            </p>
          </motion.div>
          <motion.div className="hero-card" whileHover={{ y: -10 }}>
            <h3 className="hero-card-heading">Built for Speed</h3>
            <p className="hero-card-paragraph">
              An optimized backend with intelligent caching means you get player
              data instantly.
            </p>
          </motion.div>
          <motion.div className="hero-card" whileHover={{ y: -10 }}>
            <h3 className="hero-card-heading">Live Tracking</h3>
            <p className="hero-card-paragraph">
              Get a live look at player activity. See the server they're on and
              which game they're playing, as it happens.
            </p>
          </motion.div>
        </div>
        <motion.button
          className="arrow-button"
          initial={{ scale: 1, backgroundColor: "#F4F077" }}
          whileHover={{ scale: 1.3, backgroundColor: "#f8d563ff" }}
          whileTap={{scale: 0.9}}
          onClick={() => {
            if (targetScroll.current != null) {
              targetScroll.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <MdKeyboardArrowDown color="#101e10" />
        </motion.button>
      </div>

      {/* Features start here */}

      <div className="features-container">
        <h2 ref={targetScroll} className="features-h2">
          One search, every stat
        </h2>
        <div className="showcases-container">
          <div className="mojang-data-showcase">
            <div className="mojang-data-text">
              <h3 className="vertical-text">Get the core info you need</h3>
            </div>
            <MojangDataDisplay mojangResponse={sampleMojangResponse} />
          </div>
          <div className="info-card-showcase">
            <QuickInfo
              hypixelResponse={sampleHypixelResponse}
              playerStatus={{ status: "Offline" }}
            />
            <div className="hypixel-data-text">
              <h3 className="vertical-text">Get insights at a glance</h3>
            </div>
          </div>
          <h2 className="features-h2">Go in depth, for every server</h2>
          <AdvancedInfoTabs
            hypixelResponse={sampleHypixelResponse}
            hypixelGuildResponse={sampleHypixelGuildResponse}
            hypixelStatus={"loaded"}
            wynncraftData={sampleWynncraftResponse}
            wynncraftStatus={"loaded"}
            wynncraftGuildData={sampleWynncraftGuildResponse}
            donutData={"not found"}
            donutStatus={"loaded"}
            mcciData={sampleMCCIResponse}
            mcciStatus={"loaded"}
            loadedTabs={["hypixel", "wynncraft", "mcci"]}
            uuid={"5f8eb73b25be4c5aa50fd27d65e30ca0"}
            fetchHypixelGuildMembers={() => {}}
            setHypixelGuildData={setSampleState}
          />
        </div>
      </div>
      <footer className="hero-footer">
        Not associated with Mojang, Hypixel, Wynncraft, Donut SMP, nor MCC
        Island. <br />
        &lt;3 to <a href="https://vzge.me">VGZE</a>, which renders some player
        heads <br />
        Check it out on <a href="https://github.com/GoSkyH1gh/fakemc">GitHub</a>
      </footer>
    </>
  );
}
