import React from 'react';
import { ArrowLeft, Link, Undo, Redo, Monitor, ChevronDown, Moon, Sun, Image, Download } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleUnsplash: () => void;
  toggleExportModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, toggleUnsplash, toggleExportModal }) => {
  return (
    <header className={`${darkMode ? 'bg-[#111111] border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-2 flex items-center justify-between`}>
      <div className="flex items-center space-x-4">
        <button className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Editor</h1>
        <button className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
          <Link size={20} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
          <Undo size={20} />
        </button>
        <button className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
          <Redo size={20} />
        </button>
        <div className={`flex items-center space-x-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <Monitor size={20} />
          <span>16:9</span>
          <ChevronDown size={16} />
        </div>
        <button
          onClick={toggleUnsplash}
          className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} px-4 py-1 rounded-full text-sm font-medium flex items-center`}
        >
          <Image size={16} className="mr-2" />
          Unsplash
        </button>
        <button
          onClick={toggleExportModal}
          className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-black text-white'} px-4 py-1 rounded-full text-sm font-medium flex items-center`}
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
        <button onClick={toggleDarkMode} className={`${darkMode ? 'text-yellow-300' : 'text-gray-600'}`}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;