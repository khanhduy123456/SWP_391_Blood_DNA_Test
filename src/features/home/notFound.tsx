import { Button } from "@/shared/ui/button";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;
        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.size <= 0.2) {
          particles.splice(index, 1);
          particles.push(new Particle());
        }
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Animated404 = () => (
    <svg
      className="w-24 h-24 md:w-32 md:h-32 text-teal-500"
      viewBox="0 0 100 100"
    >
      <style>
        {`
          .number {
            animation: bounce 2s ease-in-out infinite;
            transform-origin: center;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="60"
        fontWeight="bold"
        className="number"
        fill="currentColor"
      >
        404
      </text>
    </svg>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-900 text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 text-center px-4">
        <div className="flex justify-center mb-6">
          <Animated404 />
        </div>
        <h1 className="mb-4 text-4xl md:text-6xl font-extrabold tracking-tight">
          Trang Không Tìm Thấy
        </h1>
        <p className="mb-8 text-lg md:text-xl text-gray-300 max-w-md mx-auto">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          Hãy quay lại trang chủ.
        </p>
        <Link to="/">
          <Button
            size="lg"
            className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Quay lại Trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;