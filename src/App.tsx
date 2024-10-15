import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Timeline from './components/Timeline'
import VideoPlayer from './components/VideoPlayer'
import FrameEditor from './components/FrameEditor'
import useVideoStore from './store/videoStore'
import UnsplashSearch from './components/UnsplashSearch'
import ExportModal from './components/ExportModal'

function App() {
  const { projects, currentProjectId, addProject } = useVideoStore()
  const [darkMode, setDarkMode] = useState(false)
  const [showUnsplash, setShowUnsplash] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  React.useEffect(() => {
    if (projects.length === 0) {
      addProject({
        id: 'default-project',
        name: 'My Video Project',
        mediaItems: [],
        backgroundAudio: null,
        textOverlays: [],
        transition: ''
      })
    }
  }, [projects, addProject])

  const currentProject = projects.find(p => p.id === currentProjectId)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleUnsplash = () => {
    setShowUnsplash(!showUnsplash)
  }

  const toggleExportModal = () => {
    setShowExportModal(!showExportModal)
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-[#111111] text-white' : 'bg-gray-100'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleUnsplash={toggleUnsplash} toggleExportModal={toggleExportModal} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar darkMode={darkMode} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex">
            <FrameEditor darkMode={darkMode} />
            <VideoPlayer darkMode={darkMode} />
          </div>
          {currentProject && <Timeline project={currentProject} darkMode={darkMode} />}
        </main>
      </div>
      {showUnsplash && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-[#111111]' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-auto`}>
            <UnsplashSearch darkMode={darkMode} onClose={toggleUnsplash} />
          </div>
        </div>
      )}
      {showExportModal && <ExportModal darkMode={darkMode} onClose={toggleExportModal} />}
    </div>
  )
}

export default App