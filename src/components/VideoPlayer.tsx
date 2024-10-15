import React, { useState, useRef, useEffect } from 'react';
import { Player } from '@remotion/player';
import { Composition } from '../remotion/Composition';
import useVideoStore from '../store/videoStore';
import { Music } from 'lucide-react';

interface VideoPlayerProps {
  darkMode: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ darkMode }) => {
  const { projects, currentProjectId, updateMediaItemText, setBackgroundAudio } = useVideoStore();
  const currentProject = projects.find(p => p.id === currentProjectId);
  const [overlayText, setOverlayText] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentProject?.backgroundAudio && audioRef.current) {
      audioRef.current.src = currentProject.backgroundAudio;
      audioRef.current.load();
    }
  }, [currentProject?.backgroundAudio]);

  if (!currentProject) {
    return (
      <div className={`flex-1 p-4 flex items-center justify-center ${darkMode ? 'bg-[#111111] text-white' : 'bg-gray-100 text-gray-800'}`}>
        No project selected
      </div>
    );
  }

  const totalDuration = currentProject.mediaItems.reduce((sum, item) => sum + item.duration, 0);
  const durationInFrames = Math.max(1, Math.round(totalDuration * 30)); // Ensure at least 1 frame

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const text = e.target.value;
    setOverlayText(text);
    updateMediaItemText(currentProjectId, itemId, text);
  };

  const handleBackgroundAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentProjectId) {
      const audioUrl = URL.createObjectURL(file);
      setBackgroundAudio(currentProjectId, audioUrl);
    }
  };

  return (
    <div className={`flex-1 p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-[#111111]' : 'bg-gray-100'}`}>
      <div className="aspect-video w-full max-w-3xl bg-black rounded-lg shadow-lg overflow-hidden relative">
        {durationInFrames > 0 ? (
          <Player
            component={Composition}
            inputProps={{ project: currentProject }}
            durationInFrames={durationInFrames}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            No media items added. Add some media to start editing.
          </div>
        )}
        
        {/* Display Overlay Text */}
        {currentProject.mediaItems.map((item) => (
          <div key={item.id} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white text-3xl">{item.overlayText || ''}</p>
          </div>
        ))}
      </div>

      {/* Text Input for Overlay */}
      {currentProject.mediaItems.map((item) => (
        <div key={item.id} className="mt-4 w-full max-w-3xl">
          <input
            type="text"
            value={item.overlayText || ''}
            onChange={(e) => handleTextChange(e, item.id)}
            placeholder={`Add text overlay for ${item.type === 'video' ? 'Video' : 'Image'}`}
            className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-lg`}
          />
        </div>
      ))}

      {/* Background Audio Upload and Player */}
      <div className="mt-4 w-full max-w-3xl">
        <label htmlFor="backgroundAudio" className={`flex items-center justify-center w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-lg cursor-pointer`}>
          <Music size={20} className="mr-2" />
          {currentProject.backgroundAudio ? 'Change Background Music' : 'Upload Background Music'}
        </label>
        <input
          id="backgroundAudio"
          type="file"
          accept="audio/*"
          onChange={handleBackgroundAudioUpload}
          className="hidden"
        />
      </div>
      {currentProject.backgroundAudio && (
        <audio ref={audioRef} controls className="mt-4 w-full max-w-3xl">
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default VideoPlayer;