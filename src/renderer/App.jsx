import { useState, useEffect, useRef, useCallback } from 'react'
import { useImmer } from 'use-immer'

function App() {
  const [project, updateProject] = useImmer({
    title: '',
    artist: '',
    album: '',
    lines: [{ time: null, text: '' }],
    offset: 0,
    metadata: {}
  })
  
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [audioFile, setAudioFile] = useState(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [showKaraoke, setShowKaraoke] = useState(false)
  const [qaIssues, setQaIssues] = useState([])
  
  const audioRef = useRef(null)
  const playerRef = useRef(null)
  
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(project)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex, project])
  
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      updateProject(draft => Object.assign(draft, history[historyIndex - 1]))
    }
  }, [historyIndex, history, updateProject])
  
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      updateProject(draft => Object.assign(draft, history[historyIndex + 1]))
    }
  }, [historyIndex, history, updateProject])

  // Audio file handling
  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      saveToHistory()
    }
  }

  // Simplified placeholder for remaining handlers
  const handleYoutubeLoad = () => {
    alert('YouTube integration - to be implemented')
  }

  const handleGenerateAI = async () => {
    alert('AI generation - to be implemented')
  }

  const addLine = () => {
    updateProject(draft => {
      draft.lines.push({ time: null, text: '' })
    })
    saveToHistory()
  }

  const updateLine = (index, field, value) => {
    updateProject(draft => {
      draft.lines[index][field] = value
    })
  }

  const deleteLine = (index) => {
    updateProject(draft => {
      draft.lines.splice(index, 1)
    })
    saveToHistory()
  }

  const handleExport = () => {
    const lrc = project.lines
      .map(line => {
        const time = line.time || 0
        const min = Math.floor(time / 60)
        const sec = (time % 60).toFixed(2)
        return `[${String(min).padStart(2, '0')}:${String(sec).padStart(5, '0')}]${line.text}`
      })
      .join('\n')
    
    const blob = new Blob([lrc], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.title || 'lyrics'}.lrc`
    a.click()
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const content = evt.target.result
        // Parse LRC format
        const lines = content.split('\n').map(line => {
          const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)$/)
          if (match) {
            const time = parseInt(match[1]) * 60 + parseFloat(match[2])
            return { time, text: match[3] }
          }
          return { time: null, text: line }
        })
        updateProject(draft => {
          draft.lines = lines
        })
        saveToHistory()
      }
      reader.readAsText(file)
    }
  }

  // Audio sync
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      
      // Find current line
      for (let i = project.lines.length - 1; i >= 0; i--) {
        if (project.lines[i].time && audio.currentTime >= project.lines[i].time) {
          setCurrentLineIndex(i)
          break
        }
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [project.lines])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (time) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
    }
  }

  const setLineTime = (index) => {
    const audio = audioRef.current
    if (audio) {
      updateLine(index, 'time', audio.currentTime)
      saveToHistory()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            BorderSync Pro
          </h1>
          <p className="text-gray-400">Professional Lyrics Synchronization Studio</p>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-700 shadow-xl">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer transition-colors">
              <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
              📁 Load Audio
            </label>
            <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded cursor-pointer transition-colors">
              <input type="file" accept=".lrc" onChange={handleImport} className="hidden" />
              📥 Import LRC
            </label>
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors">
              💾 Export LRC
            </button>
            <button onClick={undo} disabled={historyIndex <= 0} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors disabled:opacity-50">
              ↶ Undo
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors disabled:opacity-50">
              ↷ Redo
            </button>
            <button onClick={handleGenerateAI} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors">
              ✨ AI Generate
            </button>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Song Title"
              value={project.title}
              onChange={(e) => updateProject(draft => { draft.title = e.target.value })}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Artist"
              value={project.artist}
              onChange={(e) => updateProject(draft => { draft.artist = e.target.value })}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Album"
              value={project.album}
              onChange={(e) => updateProject(draft => { draft.album = e.target.value })}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <button onClick={togglePlayPause} className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                {isPlaying ? '⏸' : '▶'}
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 mt-1">
                  {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                </div>
              </div>
            </div>
            <audio ref={audioRef} src={audioUrl} />
          </div>
        )}

        {/* Lyrics Editor */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Lyrics</h2>
            <button onClick={addLine} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
              + Add Line
            </button>
          </div>
          <div className="space-y-2">
            {project.lines.map((line, index) => (
              <div key={index} className={`flex gap-2 items-center p-2 rounded ${
                index === currentLineIndex ? 'bg-blue-900/30 border-l-4 border-blue-500' : ''
              }`}>
                <span className="text-gray-500 w-8">{index + 1}</span>
                <input
                  type="text"
                  value={line.text}
                  onChange={(e) => updateLine(index, 'text', e.target.value)}
                  onBlur={() => saveToHistory()}
                  className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="Enter lyrics..."
                />
                <button
                  onClick={() => setLineTime(index)}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-sm"
                  title="Set timestamp"
                >
                  ⏱
                </button>
                <div className="text-sm text-gray-400 w-20 text-center">
                  {line.time !== null ? `${Math.floor(line.time / 60)}:${String((line.time % 60).toFixed(2)).padStart(5, '0')}` : '--:--'}
                </div>
                <button
                  onClick={() => deleteLine(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-sm"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
