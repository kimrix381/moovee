import React from "react";

const MoviePlayer = ({ embedUrl }) => {
  if (!embedUrl) return null;

  return (
    <div
      className="video-player"
      style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
    >
      <iframe
        src={embedUrl}
        title="Player"
        allowFullScreen
        frameBorder="0"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default MoviePlayer;
