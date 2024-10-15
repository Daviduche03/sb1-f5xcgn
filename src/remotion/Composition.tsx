import React from 'react';
import {
  Sequence,
  useVideoConfig,
  Video,
  Img,
  interpolate,
  useCurrentFrame,
  spring,
  AbsoluteFill,
} from 'remotion';
import { VideoProject, MediaItem, TextOverlay } from '../store/videoStore';

const MediaElement: React.FC<{ item: MediaItem; startFrame: number }> = ({
  item,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 100 },
  });

  if (item.type === 'video') {
    return <Video src={item.source} />;
  } else {
    return (
      <AbsoluteFill>
        <Img
          src={item.source}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>
    );
  }
};

const TextOverlayElement: React.FC<{ overlay: TextOverlay }> = ({
  overlay,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${overlay.position.x * 100}%`,
        top: `${overlay.position.y * 100}%`,
        ...overlay.style,
      }}
    >
      {overlay.text}
    </div>
  );
};

export const Composition: React.FC<{ project: VideoProject }> = ({
  project,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {project.mediaItems.map((item, index) => {
        const startFrame = currentFrame;
        const duration = Math.round(item.duration * fps);
        currentFrame += duration;

        return (
          <Sequence from={startFrame} durationInFrames={duration} key={item.id}>
            <MediaElement item={item} startFrame={startFrame} />
          </Sequence>
        );
      })}
      {project.textOverlays.map((overlay) => (
        <TextOverlayElement key={overlay.id} overlay={overlay} />
      ))}
    </AbsoluteFill>
  );
};
