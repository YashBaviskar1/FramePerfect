export default function Transcription({ transcription }) {
    return (
      <div className="h-[420px] w-[480px] bg-gray-900 flex flex-col p-4 ml-4 
                      border-2 border-gray-400 border rounded-lg m-5">
        <h2 className="text-white font-bold text-center mb-4">Transcription</h2>
  
        {transcription ? (
          <p className="text-left text-white whitespace-pre-line">{transcription}</p>
        ) : (
          <p className="text-gray-400 text-center">Upload a video to generate subtitles.</p>
        )}
      </div>
    );
  }
  