import { useState } from 'react'
import './wynncraftCharacters.css'
import { motion, AnimatePresence } from 'motion/react'
import Modal from './modal'
import InfoCard from './infoCard';


function CharacterDetails({ character }) {
  const professionList = ["fishing", "woodcutting", "mining", "farming", "scribing",
    "jeweling", "alchemism", "cooking", "weaponsmithing",
    "tailoring", "woodworking", "armouring"];
  const professionElements = professionList.map((profession) => {
    return (
      <InfoCard key={profession} label={profession} value={character.professions[profession]} />
    )
  })
  return (
    <>
      <p>
        Logged in {character.logins} times<br/>
        Died {character.deaths} times<br/>
        Killed {character.mobs_killed} mobs<br/>
        Opened {character.chests_opened} chests<br/>
        Completed {character.quests_completed} quests
      </p>
      <h3>Professions</h3>
      <ul className='profession-list'>
        {professionElements}
      </ul>
    </>
  )
}

function WynncraftCharacters({ characterList }) {
  const [expandedId, setExpandedId] = useState(null)
  const handleToggle = (characterUuid) => {
    setExpandedId(expandedId === characterUuid ? null : characterUuid);
  };

  const mappedCharacters = characterList.map(character => {
    const isExpanded = character.character_uuid === expandedId;
    return (
      <motion.li
        className={`wynncraft-character-item ${isExpanded ? 'expanded' : ''}`}
        layout
        transition={{ type: 'spring', damping: 60, stiffness: 500, duration: 0.5 }}
        onClick={(e) => handleToggle(character.character_uuid)}
        key={character.character_uuid}>
        <div>
          <p className='em-text'>{character.character_class}</p>
          <p className='secondary-text'>level {character.level} <br />
          played for {character.playtime} hours</p>
          <p className='no-padding'>{character.gamemodes.join(', ')}</p>
        </div>
        <AnimatePresence>
          {isExpanded && <CharacterDetails character={character}/>}
        </AnimatePresence>
      </motion.li>
    )
  })

  return (
    <ul className='wynncraft-character-list'>{mappedCharacters}</ul>
  )  
}

export default WynncraftCharacters