import React from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import useVideoStore, { VideoProject, MediaItem } from '../store/videoStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TimelineProps {
  project: VideoProject;
  darkMode: boolean;
}

const TimelineItem: React.FC<{ item: MediaItem; index: number; darkMode: boolean }> = ({ item, index, darkMode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex-shrink-0 w-32 mr-2">
      <div className="aspect-video bg-gray-200 rounded-lg mb-1">
        {item.type === 'image' ? (
          <img src={item.source} alt={`Media ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <video src={item.source} className="w-full h-full object-cover rounded-lg" />
        )}
      </div>
      <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>{`Media ${index + 1}`}</div>
      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{`${item.duration.toFixed(1)}s`}</div>
    </div>
  );
};

const Timeline: React.FC<TimelineProps> = ({ project, darkMode }) => {
  const { setCurrentTime, currentTime, setPlaying, playing, reorderMediaItems } = useVideoStore();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const totalDuration = project.mediaItems.reduce((sum, item) => sum + item.duration, 0);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = project.mediaItems.findIndex((item) => item.id === active.id);
      const newIndex = project.mediaItems.findIndex((item) => item.id === over.id);
      reorderMediaItems(project.id, oldIndex, newIndex);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button className={`p-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`} onClick={handlePlayPause}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{`${formatTime(currentTime)} / ${formatTime(totalDuration)}`}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
            <Volume2 size={20} />
          </button>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={project.mediaItems.map(item => item.id)} strategy={horizontalListSortingStrategy}>
          <div className="overflow-x-auto pb-4">
            <div className="flex">
              {project.mediaItems.map((item, index) => (
                <TimelineItem key={item.id} item={item} index={index} darkMode={darkMode} />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Timeline;