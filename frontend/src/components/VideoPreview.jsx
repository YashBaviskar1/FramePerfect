// VideoPreview.jsx
import React, { useEffect, useRef } from 'react';

const VideoPreview = ({ videoSrc, overlays, width = 640, height = 480 }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRefs = useRef({});

  useEffect(() => {
    if (!videoSrc || !canvasRef.current) return;

    const mainVideo = document.createElement('video');
    mainVideo.src = videoSrc;
    mainVideo.crossOrigin = 'anonymous';
    mainVideo.loop = true;
    mainVideo.muted = true;
    mainVideo.play();

    videoRef.current = mainVideo;

    // Create overlay videos
    overlays.forEach(overlay => {
      if (overlay.type === 'video') {
        const video = document.createElement('video');
        video.src = overlay.url;
        video.loop = true;
        video.muted = true;
        video.play();
        overlayRefs.current[overlay.id] = video;
      }
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawFrame = () => {
      if (mainVideo.paused || mainVideo.ended) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw main video
      ctx.drawImage(mainVideo, 0, 0, width, height);

      // Draw overlays
      overlays.forEach(overlay => {
        if (overlay.type === 'image') {
          const img = new Image();
          img.src = overlay.url;
          ctx.drawImage(
            img,
            overlay.position.x,
            overlay.position.y,
            overlay.size.width,
            overlay.size.height
          );
        } else if (overlay.type === 'video') {
          const video = overlayRefs.current[overlay.id];
          if (video) {
            ctx.drawImage(
              video,
              overlay.position.x,
              overlay.position.y,
              overlay.size.width,
              overlay.size.height
            );
          }
        }
      });

      requestAnimationFrame(drawFrame);
    };

    mainVideo.addEventListener('play', drawFrame);
    return () => {
      mainVideo.pause();
      mainVideo.removeEventListener('play', drawFrame);
      Object.values(overlayRefs.current).forEach(video => video.pause());
    };
  }, [videoSrc, overlays, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default VideoPreview;