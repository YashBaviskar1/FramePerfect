import React from "react";

export default function Sidebar({ setVideoSrc }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL); // Update state in App.jsx
    }
  };

  return (
    <div className="h-screen w-32 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-l font-bold text-center">Menu</h2>
      <hr className="my-3 border-gray-700" />

      {/* Hidden File Input */}
      <input type="file" accept="video/*" className="hidden" id="fileUpload" onChange={handleFileChange} />

      {/* Upload Button Triggers File Input */}
      <button
        className="w-full font-bold py-2 my-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
        onClick={() => document.getElementById("fileUpload").click()}
      >
        +
      </button>
    </div>
  );
}
