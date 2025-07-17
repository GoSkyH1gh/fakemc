import { useState } from 'react'
import './wynncraftCharacters.css'

function WynncraftCharacters({ characterList }) {
  const mappedCharacters = characterList.map(character => {
    return (
      <li className='wynncraft-character-item'>
        {character.character_class}<br />
        {character.level} - {character.playtime}
      </li>
    )
  })
  return (
    <ul className='wynncraft-character-list'>{mappedCharacters}</ul>
  )
}

export default WynncraftCharacters