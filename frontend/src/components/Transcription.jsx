export default function Transcription({ transcription, setKeywords }) { // Add setKeywords prop
  const handleGetAssets = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/keyword/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcription })
      });

      const data = await response.json();
      console.log('API Response:', data);
      if (data.keywords) {
        setKeywords(data.keywords); // Update keywords in App
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  return (
    <div className="h-[420px] w-[480px] bg-gray-900 flex flex-col p-4 ml-4 
                    border-2 border-gray-400 border rounded-lg m-5">
      <h2 className="text-white font-bold text-center mb-4">Transcription</h2>

      {transcription ? (
        <div>
          <p className="text-left text-white whitespace-pre-line mb-4">{transcription}</p>
          <button 
            onClick={handleGetAssets}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold 
                      py-2 px-4 rounded transition-colors duration-200"
          >
            Get Assets
          </button>
        </div>
      ) : (
        <p className="text-gray-400 text-center">Upload a video to generate subtitles.</p>
      )}
    </div>
  );
}