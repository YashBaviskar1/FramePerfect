import React, { useState, useRef } from "react";
import Moveable from "react-moveable";

export default function Timeline() {
    const totalDuration = 30; // Total timeline length (seconds)
    const [currentTime, setCurrentTime] = useState(0);
    const playheadRef = useRef(null);

    // Hardcoded timestamps for every 2 seconds
    const timestamps = Array.from({ length: totalDuration / 2 + 1 }, (_, i) => i * 2);

    return (
        <div className="relative w-full h-[260px] bg-gray-900 border-t border-gray-800 p-4 mt-2 rounded-lg ml-3">
            <h3 className="text-white text-lg font-bold mb-2">Timeline</h3>

            {/* Timestamps */}
            <div className="relative w-full flex justify-between text-gray-400 text-sm mb-2">
                {timestamps.map((time) => (
                    <div
                        key={time}
                        className="absolute text-xs"
                        style={{
                            left: `${(time / totalDuration) * 100}%`,
                            transform: "translateX(-50%)",
                        }}
                    >
                        {time}s
                    </div>
                ))}
            </div>

            {/* Timeline Track */}
            <div className="relative w-full h-10 bg-gray-700 rounded-lg mt-4"></div>

            {/* Playhead (draggable) */}
            <div
                ref={playheadRef}
                className="absolute top-9 h-16 w-1 bg-red-500 mt-9 cursor-pointer"
                style={{ left: `${(currentTime / totalDuration) * 100}%` }}
            ></div>

            {/* Moveable Component for Draggable Playhead */}
            <Moveable
                target={playheadRef.current}
                draggable={true}
                throttleDrag={0}
                onDrag={({ left }) => {
                    // Convert pixel position to time
                    const newTime = (left / playheadRef.current.parentElement.clientWidth) * totalDuration;
                    setCurrentTime(Math.min(Math.max(newTime, 0), totalDuration)); // Clamp between 0 and totalDuration
                }}
            />
        </div>
    );
}
