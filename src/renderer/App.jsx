import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Border Sync Pro - Electron Desktop App')

  useEffect(() => {
    // Listen for menu events from Electron
    if (window.electronAPI) {
      window.electronAPI.onMenuAction((event) => {
        console.log('Menu action:', event)
      })
    }
  }, [])

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[var(--accent-cyan)] glow-cyan">
          {message}
        </h1>
        <p className="text-[var(--text-secondary)]">
          Professional LRC lyrics synchronization tool
        </p>
        <div className="flex gap-2 justify-center mt-6">
          <button className="tap-btn">Get Started</button>
        </div>
      </div>
    </div>
  )
}

export default App
