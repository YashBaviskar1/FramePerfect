export default function VideoPreview({ videoSrc }) {
    return (
      <div className="h-[420px] w-[640px] bg-slate-900 flex flex-col items-center p-4 ml-3
                      border-2 border-gray-400 border-box rounded-lg m-5">
        {videoSrc ? (
          <video className="w-[600px] h-[400px] rounded-lg border-2 border-gray-500" controls>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-gray-500 text-center mt-20">Upload a video to preview</div>
        )}
      </div>
    );
  }
  