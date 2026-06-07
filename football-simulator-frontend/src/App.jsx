import { useState } from 'react'
import SelectScreen from './components/SelectScreen'
import MatchScreen from './components/MatchScreen'

function App() {
  const [screen, setScreen] = useState('select')
  const [matchData, setMatchData] = useState(null)

  function handleMatchStart(data) {
    setMatchData(data)
    setScreen('match')
  }

  function handleReset() {
    setMatchData(null)
    setScreen('select')
  }

  return (
    <div className="app-wrapper">
      {screen === 'select' && (
        <SelectScreen onMatchStart={handleMatchStart} />
      )}
      {screen === 'match' && (
        <MatchScreen matchData={matchData} onReset={handleReset} />
      )}
    </div>
  )
}

export default App