import React, { useState } from "react";
import axios from "axios";

export default function Sidebar({ setVideoSrc, setTranscription, onAddAsset = () => {} }) {
  const [uploading, setUploading] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setVideoSrc(URL.createObjectURL(file));
    setTranscription("");

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTranscription(response.data.transcription);
      alert("Video uploaded and transcribed successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading video!");
    } finally {
      setUploading(false);
    }
  };

  // Integrate with the Pexels API
  const handleSearch = async () => {
    try {
      const response = await axios.get("https://api.pexels.com/v1/search", {
        headers: {
          Authorization: "LOeXqW52vxEZT3olaMbuabMFUjzG8ezrR3ennkhYgCFYQwyyW2NCMXJI",
        },
        params: {
          query: searchQuery,
          per_page: 3,
        },
      });
      setSearchResults(response.data.photos);
    } catch (error) {
      console.error("Pexels API error:", error);
      alert("Error fetching photos from Pexels!");
    }
  };

  // Toggle photo selection
  const toggleSelectPhoto = (photo) => {
    setSelectedPhotos((prev) =>
      prev.find((p) => p.id === photo.id)
        ? prev.filter((p) => p.id !== photo.id)
        : [...prev, photo]
    );
  };

  // Add selected photos to the media asset list
  const handleAddMedia = () => {
    selectedPhotos.forEach((photo) => {
      // Create an asset object from the photo data.
      // Here we assume type 'image' and use the 'medium' source.
      onAddAsset({ type: "image", url: photo.src.medium });
    });
    // Optionally, clear selections and close the popup
    setSelectedPhotos([]);
    setShowSearchPopup(false);
  };

  return (
    <div className="h-screen w-32 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-l font-bold text-center">Menu</h2>
      <hr className="my-3 border-gray-700" />

      <input type="file" accept="video/*" className="hidden" id="fileUpload" onChange={handleFileChange} />
      <button
        className={`w-full font-bold py-2 my-2 rounded-lg ${uploading ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
        onClick={() => document.getElementById("fileUpload").click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "+"}
      </button>

      <button className="w-full font-bold py-2 my-2 rounded-lg bg-gray-600">Cut</button>
      <button className="w-full font-bold py-2 my-2 rounded-lg bg-gray-600" onClick={() => setShowSearchPopup(true)}>
        Search
      </button>

      {showSearchPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-300  max-w-lg">
            <h2 className="text-xl font-bold">Search Assets</h2>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mt-2 bg-gray-700 text-white"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg" onClick={handleSearch}>
              Search
            </button>
            <div className="mt-4 max-h-40 overflow-y-auto bg-gray-700 p-2 rounded">
              {searchResults.length > 0 ? (
                searchResults.map((photo) => (
                  <div key={photo.id} className="flex items-center justify-between p-2 border-b border-gray-600">
                    <img
                      src={photo.src.tiny}
                      alt={photo.photographer}
                      className="w-32 h-32 rounded"  // Increased size for better visibility
                    />
                    <button
                      className={`p-2 rounded ${selectedPhotos.find((p) => p.id === photo.id) ? "bg-green-500" : "bg-blue-500"}`}
                      onClick={() => toggleSelectPhoto(photo)}
                    >
                      {selectedPhotos.find((p) => p.id === photo.id) ? "Selected" : "Select"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center">No results</p>
              )}
            </div>
            <button className="w-full mt-2 p-2 bg-green-600 text-white rounded-lg" onClick={handleAddMedia}>
              Add Media
            </button>
            <button className="w-full mt-2 p-2 bg-red-500 text-white rounded-lg" onClick={() => setShowSearchPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
