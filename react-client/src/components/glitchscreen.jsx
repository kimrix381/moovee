import React, { useEffect, useState } from "react";

const GlitchScreen = ({ show }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => setVisible(false), 900);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black z-[999] flex items-center justify-center overflow-hidden">
      <div className="text-green-400 text-3xl font-bold glitch">
        ACCESS GRANTED
      </div>
    </div>
  );
};

export default GlitchScreen;
