import React, { useState } from 'react';
import { X } from 'lucide-react';
import useVideoStore from '../store/videoStore';
import { Player } from '@remotion/player';
import { Composition } from '../remotion/Composition';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';

interface ExportModalProps {
  darkMode: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ darkMode, onClose }) => {
  const { projects, currentProjectId } = useVideoStore();
  const currentProject = projects.find(p => p.id === currentProjectId);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportSettings, setExportSettings] = useState({
    resolution: '1920x1080',
    fps: 30,
    format: 'mp4',
  });

  if (!currentProject) {
    return null;
  }

  const totalDuration = currentProject.mediaItems.reduce((sum, item) => sum + item.duration, 0);
  const durationInFrames = Math.max(1, Math.round(totalDuration * exportSettings.fps));

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);

    try {
      // Bundle the video
      const bundled = await bundle({
        entryPoint: require.resolve('../remotion/index.ts'),
        // If you have a webpack override, add it here
        // webpackOverride: (config) => config,
      });

      // Select the composition
      const composition = await selectComposition({
        serveUrl: bundled,
        id: 'MyComp',
        inputProps: {
          project: currentProject,
        },
      });

      // Render the video
      await renderMedia({
        composition,
        serveUrl: bundled,
        codec: 'h264',
        outputLocation: `out/${currentProject.name}.${exportSettings.format}`,
        inputProps: {
          project: currentProject,
        },
        onProgress: ({ progress }) => {
          setProgress(progress * 100);
        },
      });

      alert('Video exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  const handleSettingChange = (setting: string, value: string | number) => {
    setExportSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`${darkMode ? 'bg-[#111111] text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-xl max-w-3xl w-full`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Export Video</h2>
          <button onClick={onClose} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <Player
              component={Composition}
              inputProps={{ project: currentProject }}
              durationInFrames={durationInFrames}
              compositionWidth={parseInt(exportSettings.resolution.split('x')[0])}
              compositionHeight={parseInt(exportSettings.resolution.split('x')[1])}
              fps={exportSettings.fps}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Export Settings</h3>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Resolution</label>
              <select
                value={exportSettings.resolution}
                onChange={(e) => handleSettingChange('resolution', e.target.value)}
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              >
                <option value="1920x1080">1920x1080 (Full HD)</option>
                <option value="3840x2160">3840x2160 (4K)</option>
                <option value="1280x720">1280x720 (HD)</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">FPS</label>
              <select
                value={exportSettings.fps}
                onChange={(e) => handleSettingChange('fps', parseInt(e.target.value))}
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              >
                <option value="24">24</option>
                <option value="30">30</option>
                <option value="60">60</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select
                value={exportSettings.format}
                onChange={(e) => handleSettingChange('format', e.target.value)}
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              >
                <option value="mp4">MP4</option>
                <option value="webm">WebM</option>
              </select>
            </div>
          </div>
        </div>

        {exporting ? (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p>Exporting: {progress.toFixed(2)}%</p>
          </div>
        ) : (
          <button
            onClick={handleExport}
            className={`w-full py-2 px-4 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md transition duration-300`}
          >
            Start Export
          </button>
        )}
      </div>
    </div>
  );
};

export default ExportModal;