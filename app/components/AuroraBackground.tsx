"use client";

import { useState, useEffect } from "react";
import type { Star } from "./types";

export default function AuroraBackground() {
  const starCount = 50;
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: starCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        peakOpacity: Math.random() * 0.8,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 80%), radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 80%)", backgroundSize: "100% 100%", animation: "auroraPulse 10s infinite" }} />
      <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", animation: "fadeIn 1s ease-in-out forwards" }}>
        <div style={{ position: "absolute", top: "-25%", left: "-25%", width: "50%", height: "50%", background: "rgba(147,51,234,1)", borderRadius: "50%", filter: "blur(80px)", opacity: 0.4, animation: "blobA 30s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", bottom: "-25%", right: "-25%", width: "50%", height: "50%", background: "rgba(192,38,211,1)", borderRadius: "50%", filter: "blur(80px)", opacity: 0.4, animation: "blobB 40s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", top: "33%", left: "33%", width: "33%", height: "33%", background: "rgba(67,56,202,1)", borderRadius: "50%", filter: "blur(80px)", opacity: 0.3, animation: "blobC 50s ease-in-out infinite alternate" }} />
      </div>
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: star.x + "%",
            top: star.y + "%",
            width: 2,
            height: 2,
            background: "#fff",
            borderRadius: "50%",
            opacity: 0,
            animation: `twinkle ${star.duration}s ${star.delay}s infinite`,
            ["--peak-opacity" as string]: star.peakOpacity,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes auroraPulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.05); opacity: 0.7; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes blobA { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(50px,20px) scale(1.2); } 100% { transform: translate(-50px,-20px) scale(1); } }
        @keyframes blobB { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,-20px) scale(1.3); } 100% { transform: translate(50px,20px) scale(1); } }
        @keyframes blobC { 0% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(-20px,30px) rotate(180deg); } 100% { transform: translate(20px,-30px) rotate(360deg); } }
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: var(--peak-opacity, 0.6); } }
      `}</style>
    </div>
  );
}
