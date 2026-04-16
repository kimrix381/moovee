import React, { useEffect, useRef } from "react";

const CyberCitySkyline = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const buildings = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      w: Math.random() * 40 + 10,
      h: Math.random() * (height * 0.5) + 50,
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // night sky fade
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#02010a");
      gradient.addColorStop(1, "#000000");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // skyline base position (bottom half)
      const baseY = height * 0.75;

      buildings.forEach((b) => {
        // building body
        ctx.fillStyle = "#05060a";
        ctx.fillRect(b.x, baseY - b.h, b.w, b.h);

        // neon edge glow
        ctx.strokeStyle = "rgba(0, 255, 255, 0.25)";
        ctx.strokeRect(b.x, baseY - b.h, b.w, b.h);

        // window lights
        for (let y = baseY - b.h; y < baseY; y += 10) {
          for (let x = b.x; x < b.x + b.w; x += 8) {
            if (Math.random() > 0.85) {
              ctx.fillStyle = "rgba(255, 0, 255, 0.4)";
              ctx.fillRect(x, y, 2, 4);
            }
          }
        }
      });

      requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
};

export default CyberCitySkyline;
