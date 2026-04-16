import React from "react";
import CyberGrid3D from "./cybergrid3d";
import GalaxyRain from "./galaxyrain";
import CyberOverlay from "./CyberOverlay";
import CyberCitySkyline from "./cybercityskyline";

const CyberSystem = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* 🌆 BACKGROUND LAYERS (ORDER MATTERS) */}
      <CyberCitySkyline />
      <CyberGrid3D />
      <GalaxyRain />

      {/* ⚡ UI EFFECT LAYER */}
      <CyberOverlay />

      {/* 🧠 APP UI */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CyberSystem;
