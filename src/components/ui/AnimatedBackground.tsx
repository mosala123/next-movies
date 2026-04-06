"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type AnimatedBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
  particleCount?: number;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
};

export function AnimatedBackground({ children, className, particleCount = 18 }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const resolvedCount = useMemo(() => (isMobile ? Math.max(8, Math.floor(particleCount / 2)) : particleCount), [isMobile, particleCount]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    if (reduceMotion.matches) {
      return () => mediaQuery.removeEventListener("change", updateViewport);
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return () => mediaQuery.removeEventListener("change", updateViewport);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return () => mediaQuery.removeEventListener("change", updateViewport);
    }

    let animationFrameId = 0;
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = Array.from({ length: resolvedCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.35 + 0.08,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(255, 120, 55, 0.05)");
      gradient.addColorStop(0.45, "rgba(255, 205, 120, 0.035)");
      gradient.addColorStop(1, "rgba(64, 150, 255, 0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 140, 80, ${particle.alpha})`;
        ctx.fill();

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
      });

      animationFrameId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedCount]);

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 opacity-80" aria-hidden="true" />
      <motion.div className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {children}
      </motion.div>
    </div>
  );
}
