import { useState } from "react"
import { motion } from "motion/react"

function Searchbar({ handleInputChange, inputValue, handleKeyPress, suggestions }) {
  return (
    <div className="searchbar-wrapper">
      <motion.input
        placeholder="search by guild name"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="searchbar"
      />
      {inputValue && suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((suggestion, id) => (
            <li key={id} onClick={() => handleInputChange({ target: { value: suggestion.name } })}>
              {suggestion.name} <span className="prefix">({suggestion.prefix})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


function SearchButton({ onClick, disabled }) {
  return (
  <motion.button
    className='search-button'
    onClick={onClick}
    disabled={disabled}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}>Search</motion.button>
)
}

function GuildSearchRow({ onSearch, disabled, guildList }) {
  const [inputValue, setInputValue] = useState("")
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleSearchClick = () => {
    if (!disabled) {
      onSearch(inputValue.trim());
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick()
    }
  }

  // get the autosuggest options
  let filteredSuggestions;
  if (inputValue.length > 0) {
    filteredSuggestions = guildList.filter(guild => guild.name.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 10)
  }

  
  return (
  <div className='search-row'>
    <Searchbar handleInputChange={handleInputChange} inputValue={inputValue} handleKeyPress={handleKeyPress} suggestions={filteredSuggestions} />
    <SearchButton onClick={handleSearchClick} disabled={disabled} />
  </div>
  )
}

export default GuildSearchRow