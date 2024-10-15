import React from 'react';

const Preview: React.FC = () => {
  return (
    <div className="bg-surface p-4 mt-4">
      <div className="aspect-video bg-black rounded-md flex items-center justify-center">
        <p className="text-gray-400">Video Preview</p>
      </div>
    </div>
  );
};

export default Preview;