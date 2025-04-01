import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Text } from "react-konva";
import Konva from "konva";

const CanvasEditor = ({ videoSrc, width = 640, height = 480, overlays, updateOverlay }) => {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const animationRef = useRef(null);
  const [videoElement, setVideoElement] = useState(null);

  // Create and configure the video element when videoSrc changes
  useEffect(() => {
    if (!videoSrc) return;

    const video = document.createElement("video");
    video.src = videoSrc;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.play();

    setVideoElement(video);
  }, [videoSrc]);

  // Animation setup
  useEffect(() => {
    if (videoElement && layerRef.current) {
      const anim = new Konva.Animation(() => {
        layerRef.current.draw();
      }, layerRef.current);

      animationRef.current = anim;
      anim.start();

      return () => anim.stop();
    }
  }, [videoElement]);

  const exportCanvas = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      console.log("Exported canvas image:", dataURL);
    }
  };

  return (
    <div>
      <button onClick={exportCanvas} className="...">
        Export Frame
      </button>
      <Stage width={width} height={height} ref={stageRef}>
        <Layer ref={layerRef}>
          {videoElement && (
            <KonvaImage
              image={videoElement}
              x={0}
              y={0}
              width={width}
              height={height}
            />
          )}

          {overlays.map((overlay) => {
            if (overlay.type === 'image') {
              return (
                <KonvaImage
                  key={overlay.id}
                  image={overlay.imageElement}
                  x={overlay.position.x}
                  y={overlay.position.y}
                  width={overlay.size.width}
                  height={overlay.size.height}
                  draggable
                  onDragEnd={(e) => updateOverlay(overlay.id, {
                    position: { x: e.target.x(), y: e.target.y() }
                  })}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    updateOverlay(overlay.id, {
                      position: { x: node.x(), y: node.y() },
                      size: { width: node.width(), height: node.height() }
                    });
                  }}
                />
              );
            }
            
            if (overlay.type === 'video') {
              return (
                <VideoOverlay 
                  key={overlay.id}
                  overlay={overlay}
                  updateOverlay={updateOverlay}
                />
              );
            }

            if (overlay.type === 'text') {
              return (
                <Text
                  key={overlay.id}
                  text={overlay.content}
                  x={overlay.position.x}
                  y={overlay.position.y}
                  fontSize={overlay.styles.fontSize}
                  fill={overlay.styles.fill}
                  draggable
                  onDragEnd={(e) => updateOverlay(overlay.id, {
                    position: { x: e.target.x(), y: e.target.y() }
                  })}
                  onDblClick={() => {
                    const newText = prompt("Edit text:", overlay.content);
                    if (newText !== null) updateOverlay(overlay.id, {
                      content: newText
                    });
                  }}
                />
              );
            }
            
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
};


// Helper component for video overlays
const VideoOverlay = ({ overlay, updateOverlay }) => {
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = overlay.url;
    video.loop = true;
    video.muted = true;
    video.play();
    setVideoElement(video);

    return () => video.pause();
  }, [overlay.url]);

  return videoElement ? (
    <KonvaImage
      image={videoElement}
      x={overlay.position.x}
      y={overlay.position.y}
      width={overlay.size.width}
      height={overlay.size.height}
      draggable
      onDragEnd={(e) => updateOverlay(overlay.id, {
        position: { x: e.target.x(), y: e.target.y() }
      })}
      onTransformEnd={(e) => {
        const node = e.target;
        updateOverlay(overlay.id, {
          position: { x: node.x(), y: node.y() },
          size: { width: node.width(), height: node.height() }
        });
      }}
    />
  ) : null;
};



export default CanvasEditor;