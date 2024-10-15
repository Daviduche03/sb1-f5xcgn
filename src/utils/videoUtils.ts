export const getVideoMetadata = (videoSrc: string): Promise<{ duration: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({ duration: video.duration });
    };
    video.onerror = (error) => {
      reject(error);
    };
    video.src = videoSrc;
  });
};