export default function Media() {
    return (
        <div className="h-[420px] w-[180px] bg-slate-900 flex flex-col items-center p-4 ml-4 
                        border-2 border-gray-400 border-dotted rounded-lg m-5">
            <h2 className="text-white font-bold text-center mb-4">Media Preview</h2>
            <VideoContent></VideoContent>
        </div>
    );
}


function VideoContent({video}) {
    return (
        <>
        <div className="text-white w-[140px] text-center box-border py-2 border-2 
                            border-gray-300 rounded-lg mb-2">
                Video #1 
            </div>
        </>
    )
}