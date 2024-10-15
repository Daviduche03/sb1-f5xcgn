import { create } from 'zustand';
import { produce } from 'immer';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  source: string;
  duration: number;
  overlayText?: string;
}

export interface TextOverlay {
  id: string;
  text: string;
  position: { x: number; y: number };
  style: React.CSSProperties;
}

export interface VideoProject {
  id: string;
  name: string;
  mediaItems: MediaItem[];
  backgroundAudio: string | null;
  textOverlays: TextOverlay[];
  transition: string;
}

interface VideoState {
  projects: VideoProject[];
  currentProjectId: string | null;
  currentTime: number;
  playing: boolean;
  addProject: (project: VideoProject) => void;
  setCurrentProject: (id: string) => void;
  addMediaItem: (projectId: string, item: MediaItem) => void;
  removeMediaItem: (projectId: string, itemId: string) => void;
  reorderMediaItems: (projectId: string, oldIndex: number, newIndex: number) => void;
  setBackgroundAudio: (projectId: string, audioUrl: string | null) => void;
  addTextOverlay: (projectId: string, textOverlay: TextOverlay) => void;
  updateTextOverlay: (projectId: string, overlayId: string, updates: Partial<TextOverlay>) => void;
  removeTextOverlay: (projectId: string, overlayId: string) => void;
  updateMediaItemText: (projectId: string, itemId: string, text: string) => void;
  setTransition: (projectId: string, transition: string) => void;
  setCurrentTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;
}

const useVideoStore = create<VideoState>((set) => ({
  projects: [],
  currentProjectId: null,
  currentTime: 0,
  playing: false,

  addProject: (project) => set(produce((state) => {
    state.projects.push(project);
    state.currentProjectId = project.id;
  })),

  setCurrentProject: (id) => set({ currentProjectId: id }),

  addMediaItem: (projectId, item) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      project.mediaItems.push(item);
    }
  })),

  removeMediaItem: (projectId, itemId) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      project.mediaItems = project.mediaItems.filter((item) => item.id !== itemId);
    }
  })),

  reorderMediaItems: (projectId, oldIndex, newIndex) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      const [removed] = project.mediaItems.splice(oldIndex, 1);
      project.mediaItems.splice(newIndex, 0, removed);
    }
  })),

  setBackgroundAudio: (projectId, audioUrl) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      project.backgroundAudio = audioUrl;
    }
  })),

  addTextOverlay: (projectId, textOverlay) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      project.textOverlays.push(textOverlay);
    }
  })),

  updateTextOverlay: (projectId, overlayId, updates) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      const overlay = project.textOverlays.find((o) => o.id === overlayId);
      if (overlay) {
        Object.assign(overlay, updates);
      }
    }
  })),

  removeTextOverlay: (projectId, overlayId) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      project.textOverlays = project.textOverlays.filter((o) => o.id !== overlayId);
    }
  })),

  updateMediaItemText: (projectId, itemId, text) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      const mediaItem = project.mediaItems.find((item) => item.id === itemId);
      if (mediaItem) {
        mediaItem.overlayText = text;
      }
    }
  })),

  setTransition: (projectId, transition) => set(produce((state) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      project.transition = transition;
    }
  })),

  setCurrentTime: (time) => set({ currentTime: time }),
  setPlaying: (playing) => set({ playing }),
}));

export default useVideoStore;