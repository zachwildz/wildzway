"use client";

import { useState, useEffect } from "react";
import { GlassCard, GradientText, Section } from "./ui";

export default function AboutPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  const values = ["Clarity", "Structure", "Expansion", "Execution"];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ padding: "160px clamp(24px, 5vw, 80px) 80px", maxWidth: 900, margin: "0 auto", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ width: 48, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #22d3ee, #a855f7)", marginBottom: 28 }} />
        <h1 style={{ fontSize: "clamp(44px, 5vw, 68px)", fontWeight: 800, color: "#fff", margin: "0 0 32px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.05 }}>
          About <GradientText>WildzWay</GradientText>
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontFamily: "'Outfit', sans-serif", marginBottom: 48 }}>
          WildzWay is a creative studio focused on building meaningful digital ecosystems. Operating at the intersection of systems thinking, creative expression, and practical execution, the studio develops scalable frameworks, cultural artifacts, and real-world infrastructure solutions.
        </p>
        <Section>
          <GlassCard hoverGlow={false}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a855f7", marginBottom: 14, fontFamily: "'Outfit', sans-serif" }}>Founder</p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontFamily: "'Outfit', sans-serif" }}>Mission-driven builder operating at the intersection of creative vision and technical execution. Focused on building systems, artifacts, and frameworks that compound over time.</p>
          </GlassCard>
        </Section>
        <Section style={{ marginTop: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>Core Values</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {values.map((v, i) => (
              <GlassCard key={v} style={{ padding: "24px 28px", textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.2)", fontFamily: "'Outfit', sans-serif" }}>0{i + 1}</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 8, fontFamily: "'Outfit', sans-serif" }}>{v}</div>
              </GlassCard>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
