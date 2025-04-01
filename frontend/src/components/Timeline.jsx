// Timeline.jsx
import React, { useState, useEffect } from "react";

export default function Timeline({ videoFile, setCutVideoSrc }) {
  const [totalDuration, setTotalDuration] = useState(0);
  const [cutRange, setCutRange] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);

  // Load video metadata when the videoFile changes
  useEffect(() => {
    if (!videoFile) return;

    setIsLoading(true);
    // Determine if videoFile is a URL string or a Blob
    const videoUrl = typeof videoFile === "string" ? videoFile : URL.createObjectURL(videoFile);
    const video = document.createElement("video");

    video.onloadedmetadata = () => {
      setTotalDuration(video.duration);
      setCutRange([0, video.duration]);
      setIsLoading(false);
      // Revoke the object URL if necessary
      if (typeof videoFile !== "string") {
        URL.revokeObjectURL(videoUrl);
      }
    };

    video.onerror = () => {
      console.error("Error loading video metadata.");
      setIsLoading(false);
      if (typeof videoFile !== "string") {
        URL.revokeObjectURL(videoUrl);
      }
    };

    video.src = videoUrl;
  }, [videoFile]);

  const handleStartChange = (e) => {
    const newStart = parseFloat(e.target.value);
    // Ensure the start time is less than the current end time
    if (newStart < cutRange[1]) setCutRange([newStart, cutRange[1]]);
  };

  const handleEndChange = (e) => {
    const newEnd = parseFloat(e.target.value);
    // Ensure the end time is greater than the current start time
    if (newEnd > cutRange[0]) setCutRange([cutRange[0], newEnd]);
  };

  // Helper to format seconds as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Trigger the API call to cut the video segment
  const handleCutVideo = async () => {
    if (!videoFile || isLoading) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("start_time", cutRange[0]);
    formData.append("end_time", cutRange[1]);

    try {
      const response = await fetch("http://localhost:8000/api/cut-video/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.cut_video) {
        // Update the cut video source (assumes the server returns the video filename)
        setCutVideoSrc(`http://localhost:8000/media/videos/${data.cut_video}`);
      } else {
        console.error("Error cutting video:", data.error);
      }
    } catch (error) {
      console.error("Failed to cut video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-gray-900 border-t border-gray-800 p-4 mt-2 rounded-lg">
      <h3 className="text-white text-lg font-bold mb-2">Video Timeline</h3>

      {isLoading ? (
        <div className="text-white">Loading video metadata...</div>
      ) : (
        <>
          <div className="text-white text-sm mb-2">
            Duration: {formatTime(totalDuration)} | Selected: {formatTime(cutRange[0])} - {formatTime(cutRange[1])}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white block mb-1">
                Start Time: {formatTime(cutRange[0])}
              </label>
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.1"
                value={cutRange[0]}
                onChange={handleStartChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white block mb-1">
                End Time: {formatTime(cutRange[1])}
              </label>
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.1"
                value={cutRange[1]}
                onChange={handleEndChange}
                className="w-full"
              />
            </div>

            <button
              onClick={handleCutVideo}
              className={`px-4 py-2 rounded-lg text-white ${
                videoFile && !isLoading ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!videoFile || isLoading}
            >
              {isLoading ? "Processing..." : "Cut Video Segment"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
