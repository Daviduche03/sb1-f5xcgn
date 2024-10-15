import React from 'react';
import { Plus } from 'lucide-react';

interface MediaUploaderProps {
  onFileSelect: (file: File) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:text-blue-600 flex items-center">
        <Plus size={16} className="mr-1" />
        Add New
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default MediaUploader;