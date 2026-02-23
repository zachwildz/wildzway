"use client";

import { useState, useEffect, CSSProperties, ReactNode } from "react";
import { GlassCard, Section } from "./ui";

interface SectionData {
  label: string;
  title: string;
  desc: string;
}

interface InnerPageProps {
  title: string;
  subtitle: string;
  accentColor: string;
  sections: SectionData[];
}

export function InnerPage({ title, subtitle, accentColor, sections }: InnerPageProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "140px clamp(24px, 5vw, 80px) 60px", maxWidth: 1280, margin: "0 auto", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ width: 48, height: 4, borderRadius: 2, background: accentColor || "linear-gradient(90deg, #22d3ee, #a855f7)", marginBottom: 28 }} />
        <h1 style={{ fontSize: "clamp(44px, 6vw, 80px)", fontWeight: 800, color: "#fff", margin: "0 0 20px", fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{title}</h1>
        <p style={{ fontSize: "clamp(16px, 1.3vw, 20px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 640, fontFamily: "'Outfit', sans-serif" }}>{subtitle}</p>
      </div>
      <div style={{ padding: "0 clamp(24px, 5vw, 80px) 120px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {sections.map((s, i) => (
            <Section key={i}>
              <GlassCard>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor || "#22d3ee", marginBottom: 14, fontFamily: "'Outfit', sans-serif" }}>{s.label}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{s.desc}</p>
              </GlassCard>
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorldzPage() {
  return (
    <InnerPage
      title="Worldz"
      subtitle="Scalable systems, digital frameworks, and structured thinking environments designed for long-term impact."
      accentColor="#34d399"
      sections={[
        { label: "Framework", title: "Field Guide", desc: "A personal operating system for structuring growth, belief systems, and strategic life mapping. Built for clarity in complexity." },
        { label: "System", title: "LoopStack", desc: "Modular system architecture for building feedback loops, decision engines, and structured iteration cycles at scale." },
        { label: "Philosophy", title: "Infrastructure Thinking", desc: "Every great output needs a backbone. We design invisible systems that make visible results inevitable." },
        { label: "Vision", title: "Long-Term Horizon", desc: "WildzWay builds for decades, not quarters. Our systems are designed to compound, evolve, and endure." },
      ]}
    />
  );
}

export function WonderzPage() {
  return (
    <InnerPage
      title="Wonderz"
      subtitle="Cultural artifacts and creative works emerging from the studio — music, media, narrative worlds, and experimental projects."
      accentColor="#d946ef"
      sections={[
        { label: "Artifact", title: "Polaroid Fever", desc: "An exploration of sound, aesthetic, and narrative identity. A cultural artifact that blends music, visuals, and storytelling." },
        { label: "Pipeline", title: "Future Drops", desc: "Upcoming creative releases across music, media, and digital experiences. Every drop is engineered with intention." },
        { label: "Lab", title: "Media & Concepts", desc: "Experimental creative work spanning video, design, generative art, and narrative world-building." },
        { label: "Archive", title: "Creative Vault", desc: "A living archive of works in progress, research material, and creative prototypes from the studio." },
      ]}
    />
  );
}

export function WayzPage() {
  return (
    <InnerPage
      title="Wayz"
      subtitle="Execution — real-world systems, implementation, and infrastructure modernization."
      accentColor="#22d3ee"
      sections={[
        { label: "Platform", title: "Brinkline", desc: "Digital infrastructure and execution systems designed to modernize businesses, communities, and service delivery." },
        { label: "Services", title: "Studio Services", desc: "End-to-end digital strategy, design, and development. From concept to deployed, production-grade systems." },
        { label: "Capabilities", title: "Technical Stack", desc: "Full-stack engineering, systems design, product architecture, and scalable deployment across modern platforms." },
        { label: "Process", title: "Strategy & Build", desc: "Our process: discover, define, design, build, ship, iterate. Every engagement follows a structured execution path." },
      ]}
    />
  );
}
