import React, { useState } from 'react';
import useVideoStore from '../store/videoStore';
import { SketchPicker } from 'react-color';

const TextOverlayEditor: React.FC = () => {
  const { projects, currentProjectId, addTextOverlay, updateTextOverlay, removeTextOverlay } = useVideoStore();
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const currentProject = projects.find(p => p.id === currentProjectId);

  const handleAddText = () => {
    if (currentProjectId && text) {
      addTextOverlay(currentProjectId, {
        text,
        position: { x: 0.5, y: 0.5 },
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: `${fontSize}px`,
          color,
          textShadow: '2px 2px 2px rgba(0,0,0,0.5)',
        },
        animation: 'fadeIn',
      });
      setText('');
    }
  };

  const handleUpdateText = (index: number, newText: string) => {
    if (currentProjectId) {
      updateTextOverlay(currentProjectId, index, { text: newText });
    }
  };

  const handleUpdateStyle = (index: number, style: Partial<React.CSSProperties>) => {
    if (currentProjectId) {
      updateTextOverlay(currentProjectId, index, { style });
    }
  };

  const handleRemoveText = (index: number) => {
    if (currentProjectId) {
      removeTextOverlay(currentProjectId, index);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Text Overlays</h3>
      <div className="space-y-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          className="w-full p-2 rounded-md bg-gray-100 text-gray-700 border border-gray-300"
        />
        <div className="flex space-x-2">
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min="8"
            max="72"
            className="w-20 p-2 rounded-md bg-gray-100 text-gray-700 border border-gray-300"
          />
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-md bg-gray-100 border border-gray-300"
            style={{ backgroundColor: color }}
          >
            Color
          </button>
          {showColorPicker && (
            <div className="absolute z-10">
              <SketchPicker
                color={color}
                onChangeComplete={(color) => setColor(color.hex)}
              />
            </div>
          )}
        </div>
        <button onClick={handleAddText} className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
          Add Text Overlay
        </button>
      </div>
      <div className="space-y-2">
        {currentProject?.textOverlays.map((overlay, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={overlay.text}
              onChange={(e) => handleUpdateText(index, e.target.value)}
              className="flex-grow p-2 rounded-md bg-gray-100 text-gray-700 border border-gray-300"
            />
            <button
              onClick={() => handleRemoveText(index)}
              className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextOverlayEditor;