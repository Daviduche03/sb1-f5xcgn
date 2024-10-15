import React from 'react';
import { useVideoConfig, interpolate, spring } from 'remotion';

export const AdvancedTransition: React.FC<{ type: string; progress: number }> = ({ type, progress }) => {
  const { width, height } = useVideoConfig();
  const springProgress = spring({ frame: progress * 100, fps: 30, config: { damping: 100 } });

  switch (type) {
    case 'fade':
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height,
            backgroundColor: 'black',
            opacity: 1 - springProgress,
          }}
        />
      );
    case 'slide':
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height,
            backgroundColor: 'black',
            transform: `translateX(${springProgress * 100}%)`,
          }}
        />
      );
    case 'zoom':
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height,
            backgroundColor: 'black',
            transform: `scale(${1 - springProgress})`,
            transformOrigin: 'center',
          }}
        />
      );
    case 'rotate':
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height,
            backgroundColor: 'black',
            transform: `rotate(${springProgress * 360}deg)`,
            transformOrigin: 'center',
          }}
        />
      );
    case 'wipe':
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${(1 - springProgress) * 100}%`,
            height,
            backgroundColor: 'black',
          }}
        />
      );
    default:
      return null;
  }
};