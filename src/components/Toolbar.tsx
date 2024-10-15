import React, { useState } from 'react';
import { Music, Type, Sliders, Download } from 'lucide-react';
import useVideoStore from '../store/videoStore';
import MediaUploader from './MediaUploader';
import UnsplashSearch from './UnsplashSearch';

const Toolbar: React.FC = () => {
  const { projects, currentProjectId, setBackgroundAudio, addTextOverlay, setTransition } = useVideoStore();
  const [showUnsplash, setShowUnsplash] = useState(false);

  const currentProject = projects.find(p => p.id === currentProjectId);

  const handleBackgroundAudio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentProjectId) {
      setBackgroundAudio(currentProjectId, URL.createObjectURL(file));
    }
  };

  const handleAddText = () => {
    if (currentProjectId) {
      const newTextOverlay = {
        id: Date.now().toString(),
        text: 'New Text',
        position: { x: 0.5, y: 0.5 },
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '24px',
          color: 'white',
          textShadow: '2px 2px 2px rgba(0,0,0,0.5)',
        },
      };
      addTextOverlay(currentProjectId, newTextOverlay);
    }
  };

  const handleTransitionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (currentProjectId) {
      setTransition(currentProjectId, event.target.value);
    }
  };

  const handleExport = () => {
    if (!currentProject || currentProject.mediaItems.length === 0) {
      alert('No media items to export');
      return;
    }
    alert('Export functionality would start here. This would trigger Remotion rendering.');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Editing Tools</h2>
      <MediaUploader />
      <button 
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        onClick={() => setShowUnsplash(!showUnsplash)}
      >
        {showUnsplash ? 'Hide Unsplash Search' : 'Search Unsplash'}
      </button>
      {showUnsplash && <UnsplashSearch />}
      <div>
        <label htmlFor="audioInput" className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-300 flex items-center justify-center cursor-pointer">
          <Music size={18} className="mr-2" />
          Add Background Audio
        </label>
        <input id="audioInput" type="file" className="hidden" onChange={handleBackgroundAudio} accept="audio/*" />
      </div>
      <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-300 flex items-center justify-center" onClick={handleAddText}>
        <Type size={18} className="mr-2" />
        Add Text Overlay
      </button>
      <div>
        <label htmlFor="transitionSelect" className="block text-sm font-medium text-gray-700 mb-1">Transition</label>
        <select
          id="transitionSelect"
          className="w-full p-2 rounded-md bg-gray-100 text-gray-700 border border-gray-300"
          onChange={handleTransitionChange}
          value={currentProject?.transition || ''}
        >
          <option value="">None</option>
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
          <option value="zoom">Zoom</option>
          <option value="rotate">Rotate</option>
          <option value="wipe">Wipe</option>
        </select>
      </div>
      <button className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center" onClick={handleExport}>
        <Download size={18} className="mr-2" />
        Export Video
      </button>
    </div>
  );
};

export default Toolbar;