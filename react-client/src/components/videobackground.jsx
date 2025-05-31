import React from "react";
import neon from "../assets/neon.mp4"; // Adjust path as needed

const VideoBackground = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        title="Background Video"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        src={neon}
        type="video/mp4"
      />
      Foreground Content
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <h1 className="text-4xl font-bold">Welcome to My Movie App</h1>
      </div>
      {/* Optional overlay for better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-5" />
    </div>
  );
};

export default VideoBackground;
