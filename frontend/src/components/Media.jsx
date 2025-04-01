// Media.jsx
import React, { useState, useEffect } from 'react'; // Add useEffect
import axios from 'axios';

export default function Media({ onAddAsset, keywords }) {
  const [assets, setAssets] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  useEffect(() => {
    const fetchKeywordAssets = async () => {
      if (!keywords?.length) return;

      for (const keyword of keywords) {
        try {
          const response = await axios.get("https://api.pexels.com/v1/search", {
            headers: {
              Authorization: "",
            },
            params: { query: keyword, per_page: 1 },
          });

          const photo = response.data.photos[0];
          if (photo) {
            const isExisting = assets.some(asset => asset.id === photo.id);
            if (!isExisting) {
              setAssets(prev => [...prev, {
                id: photo.id,
                type: 'image',
                url: photo.src.medium,
                preview: photo.src.tiny,
                file: { name: `Pexels-${photo.id}` }
              }]);
            }
          }
        } catch (error) {
          console.error("Pexels API error:", error);
        }
      }
    };

    fetchKeywordAssets();
  }, [keywords]);
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setAssets(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: file.type.startsWith('image') ? 'image' : 'video',
        url,
        preview: url,
        file
      }]);
    });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("https://api.pexels.com/v1/search", {
        headers: {
          Authorization: "",
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

  const toggleSelectPhoto = (photo) => {
    setSelectedPhotos((prev) =>
      prev.find((p) => p.id === photo.id)
        ? prev.filter((p) => p.id !== photo.id)
        : [...prev, photo]
    );
  };

  const handleAddMedia = () => {
    selectedPhotos.forEach((photo) => {
      setAssets(prev => [...prev, {
        id: photo.id,
        type: 'image',
        url: photo.src.medium,
        preview: photo.src.tiny,
        file: { name: `Pexels-${photo.id}` }
      }]);
    });
    setSelectedPhotos([]);
    setShowSearchPopup(false);
  };

  return (
    <div className="h-[420px] w-[180px] bg-slate-900 flex flex-col items-center p-4 ml-4 
                    border-2 border-gray-400 border-dotted rounded-lg m-5">
      <h2 className="text-white font-bold text-center mb-4">Media Assets</h2>
      
      <div className="flex flex-col gap-2 w-full">
        <label className="cursor-pointer mb-2 px-4 py-2 bg-blue-600 text-white rounded text-center">
          Upload Media
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        <button 
          className="cursor-pointer mb-2 px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setShowSearchPopup(true)}
        >
          Search Media
        </button>
      </div>

      <div className="flex flex-col gap-2 w-full overflow-y-auto">
        {assets.map((asset) => (
          <AssetThumbnail
            key={asset.id}
            asset={asset}
            onClick={() => onAddAsset(asset)}
          />
        ))}
      </div>

      {showSearchPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-300 max-w-lg">
            <h2 className="text-xl font-bold">Search Assets</h2>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mt-2 bg-gray-700 text-white"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg" 
              onClick={handleSearch}
            >
              Search
            </button>
            <div className="mt-4 max-h-40 overflow-y-auto bg-gray-700 p-2 rounded">
              {searchResults.length > 0 ? (
                searchResults.map((photo) => (
                  <div key={photo.id} className="flex items-center justify-between p-2 border-b border-gray-600">
                    <img
                      src={photo.src.tiny}
                      alt={photo.photographer}
                      className="w-32 h-32 rounded"
                    />
                    <button
                      className={`p-2 rounded ${
                        selectedPhotos.find((p) => p.id === photo.id) 
                          ? "bg-green-500" 
                          : "bg-blue-500"
                      }`}
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
            <button 
              className="w-full mt-2 p-2 bg-green-600 text-white rounded-lg" 
              onClick={handleAddMedia}
            >
              Add to Media
            </button>
            <button 
              className="w-full mt-2 p-2 bg-red-500 text-white rounded-lg" 
              onClick={() => setShowSearchPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AssetThumbnail({ asset, onClick }) {
  return (
    <div
      className="relative cursor-pointer hover:opacity-80"
      onClick={onClick}
    >
      {asset.type === 'image' ? (
        <img
          src={asset.preview}
          alt="Preview"
          className="w-full h-20 object-cover rounded"
        />
      ) : (
        <video
          src={asset.url}
          className="w-full h-20 object-cover rounded"
          muted
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
        {asset.file.name}
      </div>
    </div>
  );
}