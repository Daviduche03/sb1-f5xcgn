import React from 'react';
import { Layers, Square, Type, Image, Music, Play } from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode }) => {
  return (
    <aside className={`w-20 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col items-center py-4 space-y-6`}>
      <button className={`p-2 rounded-lg ${darkMode ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-600'}`}>
        <Layers size={24} />
      </button>
      <button className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>
        <Square size={24} />
      </button>
      <button className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>
        <Type size={24} />
      </button>
      <button className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>
        <Image size={24} />
      </button>
      <button className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>
        <Music size={24} />
      </button>
      <button className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>
        <Play size={24} />
      </button>
    </aside>
  );
};

export default Sidebar;