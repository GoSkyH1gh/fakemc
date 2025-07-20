import { useState } from "react"
import { motion } from "motion/react"

function Searchbar({ handleInputChange, inputValue, handleKeyPress }) {
  return (
    <>
      <label className='visually-hidden' htmlFor='search'>Search by username or UUID</label>
      <motion.input
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        type='text'
        placeholder='search by username or UUID'
        className='searchbar'
        name='search'
        onChange={handleInputChange}
        value={inputValue}
        onKeyDown={handleKeyPress} />
    </>
)
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

function SearchRow({ onSearch, disabled }) {
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
  return (
  <div className='search-row'>
    <Searchbar handleInputChange={handleInputChange} inputValue={inputValue} handleKeyPress={handleKeyPress} />
    <SearchButton onClick={handleSearchClick} disabled={disabled} />
  </div>
  )
}

export default SearchRow