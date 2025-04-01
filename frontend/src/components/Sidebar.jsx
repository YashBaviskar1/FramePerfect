import React, { useState } from "react";
import axios from "axios";

export default function Sidebar({ setVideoSrc, setTranscription }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setVideoSrc(URL.createObjectURL(file)); // Show preview
    setTranscription(""); // Clear old transcription

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTranscription(response.data.transcription); // Set new subtitles
      alert("Video uploaded and transcribed successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading video!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-screen w-32 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-l font-bold text-center">Menu</h2>
      <hr className="my-3 border-gray-700" />

      {/* Hidden File Input */}
      <input type="file" accept="video/*" className="hidden" id="fileUpload" onChange={handleFileChange} />

      {/* Upload Button */}
      <button
        className={`w-full font-bold py-2 my-2 rounded-lg ${uploading ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
        onClick={() => document.getElementById("fileUpload").click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "+"}
      </button>

      <button className="w-full font-bold py-2 my-2 rounded-lg bg-gray-600">Cut</button>      
    </div>
  );
}
