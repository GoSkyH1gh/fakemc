import { PlayerPage } from './pages/playerPage'
import { HomePage } from './pages/homePage'
import { Route, Routes } from 'react-router-dom'
import WynncraftGuilds from './pages/wynnGuilds'
import Layout from './pages/layout'
import TrackerPage from './pages/trackerPage'
import FavoritesPage from './pages/favoritesPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/player/' element={<PlayerPage />}/>
        <Route path='/player/:username' element={<PlayerPage />}/>
        <Route path='/wynncraft/guilds' element={<WynncraftGuilds />} />
        <Route path='/track/player' element={<TrackerPage />} />
        <Route path='/track/player/:username' element={<TrackerPage />} />
        <Route path='/favorites' element={<FavoritesPage />} />
      </Route>
    </Routes>
  )
}

export default App