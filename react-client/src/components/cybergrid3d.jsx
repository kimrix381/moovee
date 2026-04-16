import React, { useEffect, useRef } from "react";

const CyberGrid3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const centerX = width / 2;
    const horizon = height * 0.35; // vanishing point

    const gridSize = 40;
    let offset = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // black cyber base
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      offset += 1;

      // glow grid color
      ctx.strokeStyle = "rgba(0, 255, 255, 0.25)";
      ctx.lineWidth = 1;

      const maxDepth = 30;

      // 🔥 perspective grid (horizontal lines)
      for (let i = 1; i < maxDepth; i++) {
        const depth = i / maxDepth;

        const y = horizon + depth * (height - horizon);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 🔥 perspective grid (vertical lines converging)
      const verticalLines = 20;

      for (let i = -verticalLines; i <= verticalLines; i++) {
        const t = i / verticalLines;

        const xBottom = centerX + t * width;
        const xTop = centerX + t * 50; // converge to vanishing point

        ctx.beginPath();
        ctx.moveTo(xTop, horizon);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // 🔥 moving scan glow line
      const scanY = horizon + ((offset * 2) % (height - horizon));

      ctx.strokeStyle = "rgba(0, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    resize();
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
        opacity: 0.45,
      }}
    />
  );
};

export default CyberGrid3D;
