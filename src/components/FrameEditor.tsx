import React from 'react';
import { Trash2 } from 'lucide-react';
import useVideoStore from '../store/videoStore';
import MediaUploader from './MediaUploader';

interface FrameEditorProps {
  darkMode: boolean;
}

const FrameEditor: React.FC<FrameEditorProps> = ({ darkMode }) => {
  const { projects, currentProjectId, addMediaItem, removeMediaItem } = useVideoStore();
  const currentProject = projects.find(p => p.id === currentProjectId);

  const handleAddMedia = async (file: File) => {
    if (currentProjectId) {
      let duration = 5; // Default duration for images
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      if (type === 'video') {
        duration = await getVideoDuration(file);
      }

      const newItem = {
        id: Date.now().toString(),
        type,
        source: URL.createObjectURL(file),
        duration: Math.max(0.1, duration), // Ensure positive duration
      };
      addMediaItem(currentProjectId, newItem);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleRemoveMedia = (id: string) => {
    if (currentProjectId) {
      removeMediaItem(currentProjectId, id);
    }
  };

  const renderMediaItem = (item: any) => {
    return (
      <div key={item.id} className="relative group">
        {item.type === 'video' ? (
          <video
            src={item.source}
            className="w-full h-16 object-cover rounded-lg"
            onLoadedData={(e) => {
              e.currentTarget.currentTime = 0; // Set the video to the first frame
            }}
            autoPlay
            muted
            loop
          />
        ) : (
          <img src={item.source} alt="Media" className="w-full h-16 object-cover rounded-lg" />
        )}
        {/* Delete button overlay */}
        <button
          onClick={() => handleRemoveMedia(item.id)}
          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-4`}>
      <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Media</h2>
      <MediaUploader onFileSelect={handleAddMedia} darkMode={darkMode} />
      <div className="mt-4 max-h-64 overflow-auto">
        <h3 className={`text-md font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Project Media</h3>
        <div className="space-y-2">
          {currentProject?.mediaItems.map(renderMediaItem)}
        </div>
      </div>
    </div>
  );
};

export default FrameEditor;