"use client";

import { useRef, useEffect } from "react";
import type { Particle } from "./types";

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 70;
    const colors = ["rgba(34,211,238,", "rgba(168,85,247,", "rgba(217,70,239,", "rgba(52,211,153,"];
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    const connectionDistance = 140;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        if (Math.random() > 0.97) {
          p.vx += (Math.random() - 0.5) * 0.15;
          p.vy += (Math.random() - 0.5) * 0.15;
        }
        const dxm = p.x - mx;
        const dym = p.y - my;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < 120 && distM > 0) {
          p.vx += (dxm / distM) * 0.3;
          p.vy += (dym / distM) * 0.3;
        }
        const maxV = 1.2;
        const vSq = p.vx * p.vx + p.vy * p.vy;
        if (vSq > maxV * maxV) {
          const r = maxV / Math.sqrt(vSq);
          p.vx *= r;
          p.vy *= r;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(168,85,247," + (1 - dist / connectionDistance) * 0.12 + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const handleLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
    />
  );
}
