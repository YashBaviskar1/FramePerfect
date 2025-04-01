// Media.jsx
import React, { useState } from 'react';

export default function Media({ onAddAsset }) {
  const [assets, setAssets] = useState([]);

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

  return (
    <div className="h-[420px] w-[180px] bg-slate-900 flex flex-col items-center p-4 ml-4 
                    border-2 border-gray-400 border-dotted rounded-lg m-5">
      <h2 className="text-white font-bold text-center mb-4">Media Assets</h2>
      
      <label className="cursor-pointer mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        Upload Media
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      <div className="flex flex-col gap-2 w-full overflow-y-auto">
        {assets.map((asset) => (
          <AssetThumbnail
            key={asset.id}
            asset={asset}
            onClick={() => onAddAsset(asset)}
          />
        ))}
      </div>
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
      <button 
  onClick={() => onAddAsset({ type: 'text' })}
  className="px-4 py-2 bg-green-600 text-white rounded mb-2"
>
  Add Text
</button>
    </div>

  );
}