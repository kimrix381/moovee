import React, { useEffect, useRef } from "react";

const GalaxyRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 🔥 smaller + denser particles
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.2, // SMALL AF
      speed: Math.random() * 0.3 + 0.1, // slow float
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // dark space base
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // stars
      ctx.fillStyle = "rgba(0, 255, 255, 0.7)";

      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // slow drift down
        s.y += s.speed;

        // reset
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-40"
    />
  );
};

export default GalaxyRain;
