import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';

interface TextElementProps {
  text: string;
  position: { x: number; y: number };
  style: React.CSSProperties;
  animation: string;
  startFrame: number;
  duration: number;
}

export const TextElement: React.FC<TextElementProps> = ({ text, position, style, animation, startFrame, duration }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;
  const progress = interpolate(relativeFrame, [0, duration], [0, 1], { extrapolateRight: 'clamp' });
  const springProgress = spring({ frame: relativeFrame, fps: 30, config: { damping: 100 } });

  let animationStyle = {};
  switch (animation) {
    case 'fadeIn':
      animationStyle = { opacity: springProgress };
      break;
    case 'slideIn':
      animationStyle = { transform: `translateY(${(1 - springProgress) * 100}px)` };
      break;
    case 'zoomIn':
      animationStyle = { transform: `scale(${springProgress})` };
      break;
    case 'rotateIn':
      animationStyle = { transform: `rotate(${(1 - springProgress) * 360}deg)` };
      break;
    default:
      break;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        ...style,
        ...animationStyle,
      }}
    >
      {text}
    </div>
  );
};