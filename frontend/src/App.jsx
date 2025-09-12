import { PlayerPage } from './pages/playerPage.jsx'
import { HomePage } from './pages/homePage.jsx'
import { Route, Routes } from 'react-router-dom'
import WynncraftGuilds from './pages/wynnGuilds.jsx'
import Layout from './pages/layout.jsx'
import TrackerPage from './pages/trackerPage.jsx'

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
      </Route>
    </Routes>
  )
}

export default App