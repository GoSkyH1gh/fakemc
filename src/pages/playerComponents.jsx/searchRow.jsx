function Searchbar({ handleInputChange, inputValue, handleKeyPress }) {
  return (
    <>
      <label className='visually-hidden' htmlFor='search'>searchbar</label>
      <input type='text' placeholder='search by username or UUID' className='searchbar' name='search' onChange={handleInputChange} value={inputValue} onKeyDown={handleKeyPress} />
    </>
)
}

function SearchButton({ onClick, disabled }) {
  return <button className='search-button' onClick={onClick} disabled={disabled}>Search</button>
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

export default Searchbar