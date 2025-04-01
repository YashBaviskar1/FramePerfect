// App.jsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Media from "./components/Media";
import VideoPreview from "./components/VideoPreview";
import Transcription from "./components/Transcription";
import Timeline from "./components/Timeline";
import CanvasEditor from "./components/CanvasEditor";

export default function App() {
  const [overlays, setOverlays] = useState([]);
  const [videoSrc, setVideoSrc] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [cutVideoSrc, setCutVideoSrc] = useState(null);
  // A simple toggle to switch between preview and editing mode
  const [editingMode, setEditingMode] = useState(false);
  const [overlayText, setOverlayText] = useState(null);
  const [keywords, setKeywords] = useState([]); // Add keywords state
  const handleAddAsset = (asset) => {
    if (asset.type === 'text') {
      setOverlays(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'text',
        content: 'New Text',
        position: { x: 50, y: 50 },
        styles: { fontSize: 24, fill: 'white' }
      }]);
    } else {
      setOverlays(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: asset.type,
        url: asset.url,
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 }
      }]);
    }
  };

  const updateOverlay = (id, updates) => {
    setOverlays(prev => 
      prev.map(ov => ov.id === id ? { ...ov, ...updates } : ov)
    );
  };
  return (
    <div className="flex h-screen bg-slate-800">
      <Sidebar setVideoSrc={setVideoSrc} setTranscription={setTranscription} />
      
      <div className="flex flex-col flex-grow">
        <div className="flex">
        <Media onAddAsset={handleAddAsset} keywords={keywords} />
          
          {editingMode ? (
            <CanvasEditor
              videoSrc={cutVideoSrc || videoSrc}
              overlays={overlays}
              updateOverlay={updateOverlay}
            />
          ) : (
            <VideoPreview
              videoSrc={cutVideoSrc || videoSrc}
              overlays={overlays}
            />
          )}
          
          <Transcription 
            transcription={transcription} 
            setKeywords={setKeywords} // Pass setKeywords as prop
          />
        </div>

        <Timeline videoFile={videoSrc} setCutVideoSrc={setCutVideoSrc} />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded ml-4"
          onClick={() => setEditingMode((prev) => !prev)}
        >
          {editingMode ? "Exit Edit Mode" : "Edit Video"}
        </button>
      </div>
    </div>
  );
}