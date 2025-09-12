import { useState } from "react";
import "./wynncraftCharacters.css";
import { motion, AnimatePresence } from "motion/react";
import InfoCard from "./infoCard";
import * as Tooltip from "@radix-ui/react-tooltip";

const modesMap = {
  ironman: "https://cdn.wynncraft.com/nextgen/badges/ironman.svg",
  ultimate_ironman:
    "https://cdn.wynncraft.com/nextgen/badges/ultimate_ironman.svg",
  hardcore: "https://cdn.wynncraft.com/nextgen/badges/hardcore.svg",
  defeated_hardcore: "https://cdn.wynncraft.com/nextgen/badges/dd_hardcore.svg",
  craftsman: "https://cdn.wynncraft.com/nextgen/badges/craftsman.svg",
  hunted: "https://cdn.wynncraft.com/nextgen/badges/hunted.svg",
};

const modeAttributeMap = {
  ironman: "Ironman",
  ultimate_ironman: "Ultimate Ironman",
  hardcore: "Hardcore",
  defeated_hardcore: "Defeated Hardcode",
  craftsman: "Craftsman",
  hunted: "Hunted",
};

const classImageUrl =
  "https://cdn.wynncraft.com/nextgen/themes/journey/assets/classes/";

function CharacterDetails({ character }) {
  const professionList = [
    "fishing",
    "woodcutting",
    "mining",
    "farming",
    "scribing",
    "jeweling",
    "alchemism",
    "cooking",
    "weaponsmithing",
    "tailoring",
    "woodworking",
    "armouring",
  ];
  const professionElements = professionList.map((profession) => {
    return (
      <InfoCard
        key={profession}
        label={profession}
        value={character.professions[profession]}
      />
    );
  });
  return (
    <>
      <p>
        Logged in {character.logins} times
        <br />
        Died {character.deaths} times
        <br />
        Killed {character.mobs_killed} mobs
        <br />
        Opened {character.chests_opened} chests
        <br />
        Completed {character.quests_completed} quests
      </p>
      <h3>Professions</h3>
      <ul className="profession-list">{professionElements}</ul>
    </>
  );
}

function WynncraftCharacters({ characterList }) {
  if (characterList.length === 0) {
    return <p>This player has no characters.</p>;
  }
  const [expandedId, setExpandedId] = useState(null);
  const handleToggle = (characterUuid) => {
    setExpandedId(expandedId === characterUuid ? null : characterUuid);
  };

  const mappedCharacters = characterList.map((character) => {
    const isExpanded = character.character_uuid === expandedId;

    const parentVariants = {
      initial: { backgroundColor: "#ccca" },
      hover: { backgroundColor: "#ddda" },
    };

    const classIconVariants = {
      initial: { scale: 1, y: 0 },
      hover: { scale: 1.05, y: -10 },
    };

    return (
      <motion.li
        className={`wynncraft-character-item ${isExpanded ? "expanded" : ""}`}
        layout
        initial="initial"
        whileHover="hover"
        transition={{
          type: "spring",
          damping: 60,
          stiffness: 500,
          duration: 0.5,
        }}
        onClick={(e) => handleToggle(character.character_uuid)}
        key={character.character_uuid}
      >
        <div>
          <div className="wynn-character-row">
            <motion.img
              variants={classIconVariants}
              src={
                classImageUrl +
                character.character_class.toLowerCase() +
                ".webp"
              }
              alt={character.character_class}
              className="wynn-character-icon"
            />
            <div className="wynn-classname-c">
              <p className="em-text">{character.character_class}</p>
              <div className="wynn-modes">
                {character.gamemodes.map((gamemode) => (
                  <Tooltip.Provider>
                    <Tooltip.Root delayDuration={100}>
                      <Tooltip.Trigger asChild>
                        <motion.img
                          whileHover={{ scale: 1.3 }}
                          src={modesMap[gamemode]}
                          className="wynn-mode"
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="TooltipContent">
                          {modeAttributeMap[gamemode]}
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                ))}
              </div>
            </div>
          </div>

          <p className="secondary-text">
            level {character.level} <br />
            played for {character.playtime} hours
          </p>
        </div>
        <AnimatePresence>
          {isExpanded && <CharacterDetails character={character} />}
        </AnimatePresence>
      </motion.li>
    );
  });

  return <ul className="wynncraft-character-list">{mappedCharacters}</ul>;
}

export default WynncraftCharacters;
