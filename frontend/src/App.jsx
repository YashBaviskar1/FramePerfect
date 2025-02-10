import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Media from "./components/Media";
import VideoPreview from "./components/VideoPreview";
import Transcription from "./components/Transcription";
import Timeline from "./components/Timeline";

export default function App() {
  const [videoSrc, setVideoSrc] = useState(null); // Store uploaded video

  return (
    <div className="flex h-screen bg-slate-800">
      {/* Sidebar - Upload Video */}
      <Sidebar setVideoSrc={setVideoSrc} />

      {/* Main Content: Media + VideoPreview + Transcription + Timeline */}
      <div className="flex flex-col flex-grow">
        <div className="flex">
          <Media />
          <VideoPreview videoSrc={videoSrc} />
          <Transcription />
        </div>
        <div className="flex">
          <Timeline />
        </div>
      </div>
    </div>
  );
}
