"use client";

import { useState, useEffect } from "react";
import { PAGES, PageKey } from "./types";
import { GlassCard, GradientText, Button, Section } from "./ui";

interface HomePageProps {
  setPage: (page: PageKey) => void;
}

export default function HomePage({ setPage }: HomePageProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const projects = [
    { title: "Brinkline", desc: "Digital infrastructure and execution systems designed to modernize businesses and communities.", page: PAGES.wayz, accent: "#22d3ee" },
    { title: "Polaroid Fever", desc: "A cultural artifact exploring sound, aesthetic, and narrative identity.", page: PAGES.wonderz, accent: "#d946ef" },
    { title: "Field Guide", desc: "A personal operating system designed to structure growth, belief, and strategic life mapping.", page: PAGES.worldz, accent: "#34d399" },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px clamp(24px, 5vw, 80px) 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, maxWidth: 1280, margin: "0 auto", width: "100%", alignItems: "center" }} className="hero-grid">
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <h1 style={{ fontSize: "clamp(40px, 5.5vw, 76px)", fontWeight: 800, lineHeight: 1.05, margin: 0, color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
              Building <GradientText>Worldz</GradientText>. <br />
              <span style={{ color: "rgba(255,255,255,0.85)" }}>Wonderz</span>.{" "}
              <span style={{ color: "rgba(255,255,255,0.65)" }}>Wayz</span>.
            </h1>
            <p style={{ fontSize: "clamp(16px, 1.2vw, 19px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginTop: 28, maxWidth: 520, fontFamily: "'Outfit', sans-serif" }}>
              WildzWay is a creative studio building digital systems, cultural artifacts, and scalable infrastructure for the modern era.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap" }}>
              <Button onClick={() => setPage(PAGES.about)}>Explore the Studio</Button>
              <Button variant="ghost" onClick={() => setPage(PAGES.worldz)}>View Projects →</Button>
            </div>
          </div>

          <div className="hero-panel" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
            <div style={{ aspectRatio: "1 / 0.85", borderRadius: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(30px)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "conic-gradient(from 180deg at 50% 50%, rgba(52,211,153,0.12) 0deg, rgba(34,211,238,0.10) 90deg, rgba(168,85,247,0.12) 180deg, rgba(217,70,239,0.08) 270deg, rgba(52,211,153,0.12) 360deg)", animation: "auroraDrift 12s ease-in-out infinite alternate", filter: "blur(40px)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #22d3ee, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#0b0f1a", fontFamily: "'Outfit', sans-serif" }}>W</div>
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "'Outfit', sans-serif" }}>Studio · Lab · Vault</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <Section style={{ padding: "40px clamp(24px, 5vw, 80px) 100px", maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Featured Projects</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {projects.map((p, i) => (
            <GlassCard key={i} onClick={() => setPage(p.page)}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.accent, marginBottom: 20, boxShadow: `0 0 12px ${p.accent}40` }} />
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>{p.title}</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{p.desc}</p>
              <div style={{ marginTop: 24, fontSize: 13, fontWeight: 600, color: p.accent, letterSpacing: "0.04em", fontFamily: "'Outfit', sans-serif" }}>Learn More →</div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* What We Build */}
      <Section style={{ padding: "80px clamp(24px, 5vw, 80px)", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>What We Build</p>
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: "0 0 24px", fontFamily: "'Outfit', sans-serif" }}>
          Where Imagination Meets <GradientText>Infrastructure</GradientText>
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontFamily: "'Outfit', sans-serif" }}>
          We build scalable systems, creative artifacts, and execution frameworks that bridge imagination and infrastructure. WildzWay operates as a studio, lab, and vault — where ideas are structured, refined, and released into the world.
        </p>
      </Section>

      {/* CTA */}
      <Section style={{ padding: "60px clamp(24px, 5vw, 80px) 120px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ borderRadius: 28, padding: "80px 48px", textAlign: "center", background: "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(168,85,247,0.06) 50%, rgba(217,70,239,0.04) 100%)", border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-50%", left: "20%", width: "60%", height: "100%", background: "radial-gradient(ellipse, rgba(34,211,238,0.06), transparent 70%)", filter: "blur(60px)" }} />
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "#fff", margin: "0 0 16px", position: "relative", fontFamily: "'Outfit', sans-serif" }}>Ready to Build Something Real?</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginBottom: 36, position: "relative", fontFamily: "'Outfit', sans-serif" }}>Let's create systems that last and artifacts that matter.</p>
          <Button onClick={() => setPage(PAGES.contact)} style={{ position: "relative" }}>Start a Conversation</Button>
        </div>
      </Section>
    </div>
  );
}
