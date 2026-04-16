import React, { useEffect, useState } from "react";

const CyberOverlay = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-200 ${
        glitch ? "opacity-100" : "opacity-60"
      }`}
    >
      {/* scanlines */}
      <div className="absolute inset-0 cyber-scanlines" />

      {/* glitch flash */}
      {glitch && <div className="absolute inset-0 bg-cyan-400 opacity-10" />}
    </div>
  );
};

export default CyberOverlay;
