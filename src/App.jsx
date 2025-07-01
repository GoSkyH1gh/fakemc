import { useState } from 'react'
import { PlayerPage } from './pages/playerPage.jsx'
import { HomePage } from './pages/homePage.jsx'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/player/' element={<PlayerPage />}/>
    </Routes>
  )
}

export default App