import React, { useState } from 'react';
import { createApi } from 'unsplash-js';
import useVideoStore from '../store/videoStore';
import { X } from 'lucide-react';

const unsplash = createApi({
  accessKey: 'hlOhvVipAu8GfJic04Zy9QgKOP1ImiKWyUZn8aHEhVw',
});

interface UnsplashSearchProps {
  darkMode: boolean;
  onClose: () => void;
}

const UnsplashSearch: React.FC<UnsplashSearchProps> = ({ darkMode, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { currentProjectId, addMediaItem } = useVideoStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await unsplash.search.getPhotos({ query, perPage: 20 });
    if (response.response) {
      setResults(response.response.results);
    }
  };

  const handleImageSelect = (image: any) => {
    if (currentProjectId) {
      const newItem = {
        id: Date.now().toString(),
        type: 'image' as const,
        source: image.urls.regular,
        duration: 5,
      };
      addMediaItem(currentProjectId, newItem);
      onClose();
    }
  };

  return (
    <div className={`${darkMode ? 'bg-[#111111]' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Unsplash Search</h2>
        <button onClick={onClose} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Unsplash..."
          className={`flex-grow p-2 rounded-l-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
        />
        <button type="submit" className={`px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-r-md`}>Search</button>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="w-full h-40 object-cover cursor-pointer rounded"
            onClick={() => handleImageSelect(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default UnsplashSearch;