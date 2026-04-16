import React, { useEffect, useRef } from "react";

const CyberGridFloor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    let offset = 0;

    const gridSize = 50;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // dark base
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(0, 255, 255, 0.12)";
      ctx.lineWidth = 1;

      offset += 0.4;

      // vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // horizontal moving lines
      for (let y = 0; y < height; y += gridSize) {
        const yy = (y + offset * 20) % height;

        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(width, yy);
        ctx.stroke();
      }

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
        opacity: 0.35,
      }}
    />
  );
};

export default CyberGridFloor;
