"use client";

import { useState, useEffect, useRef } from "react";

const PAGES = {
  home: "home",
  worldz: "worldz",
  wonderz: "wonderz",
  wayz: "wayz",
  wayfinder: "wayfinder",
  wondervision: "wondervision",
  about: "about",
  contact: "contact",
};


// ─── Aurora Background (blobs + stars) ───────────────────────────
function AuroraBackground() {
  const starCount = 50;
  const [stars, setStars] = useState<{ x: number; y: number; peakOpacity: number; duration: number; delay: number }[]>([]);

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
        <div key={i} style={{ position: "absolute", left: star.x + "%", top: star.y + "%", width: 2, height: 2, background: "#fff", borderRadius: "50%", opacity: 0, animation: "twinkle " + star.duration + "s " + star.delay + "s infinite", ["--peak-opacity" as string]: star.peakOpacity } as React.CSSProperties} />
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

// ─── Particle Network Overlay (for Wayfinder page) ──────────────
function ParticleNetwork() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const count = 70;
    const colors = ["rgba(34,211,238,", "rgba(168,85,247,", "rgba(217,70,239,", "rgba(52,211,153,"];
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.6, color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    const connectionDistance = 140;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      particles.forEach((p) => {
        if (Math.random() > 0.97) { p.vx += (Math.random() - 0.5) * 0.15; p.vy += (Math.random() - 0.5) * 0.15; }
        const dxm = p.x - mx, dym = p.y - my, distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < 120 && distM > 0) { p.vx += (dxm / distM) * 0.3; p.vy += (dym / distM) * 0.3; }
        const maxV = 1.2, vSq = p.vx * p.vx + p.vy * p.vy;
        if (vSq > maxV * maxV) { const r = maxV / Math.sqrt(vSq); p.vx *= r; p.vy *= r; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ")"; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(168,85,247," + ((1 - dist / connectionDistance) * 0.12) + ")"; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
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

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} />;
}

// ─── Glass Card ──────────────────────────────────────────────────
function GlassCard({ children, onClick, style = {}, hoverGlow = true, className = "" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid rgba(255,255,255,${hovered ? 0.2 : 0.07})`,
        borderRadius: 24,
        padding: "36px 32px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered && hoverGlow
          ? "0 20px 60px -10px rgba(34,211,238,0.08), 0 8px 24px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(0,0,0,0.2)",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={className}
    >
      {hovered && hoverGlow && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), rgba(168,85,247,0.3), transparent)",
          }}
        />
      )}
      {children}
    </div>
  );
}

// ─── Gradient Text ───────────────────────────────────────────────
function GradientText({ children, style = {} }) {
  return (
    <span
      style={{
        background: "linear-gradient(135deg, #34d399, #22d3ee, #a855f7, #d946ef)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── Button ──────────────────────────────────────────────────────
function Button({ children, variant = "primary", onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "14px 32px",
        borderRadius: 14,
        border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.15)",
        background: isPrimary
          ? hovered
            ? "linear-gradient(135deg, #34d399, #22d3ee, #a855f7)"
            : "linear-gradient(135deg, #22d3ee, #a855f7, #d946ef)"
          : hovered
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.03)",
        color: isPrimary ? "#0b0f1a" : "rgba(255,255,255,0.85)",
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: "0.02em",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-1px)" : "none",
        boxShadow: isPrimary && hovered ? "0 8px 30px rgba(34,211,238,0.2)" : "none",
        fontFamily: "'Outfit', sans-serif",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Section Wrapper ─────────────────────────────────────────────
function Section({ children, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────
function Nav({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Worldz", page: PAGES.worldz },
    { label: "Wonderz", page: PAGES.wonderz },
    { label: "Wayz", page: PAGES.wayz },
    { label: "Wayfinder", page: PAGES.wayfinder },
    { label: "Wondervision", page: PAGES.wondervision },
    { label: "About", page: PAGES.about },
    { label: "Contact", page: PAGES.contact },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 clamp(20px, 4vw, 60px)",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(11,15,26,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        onClick={() => { setPage(PAGES.home); setMobileOpen(false); }}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
      >
        <div
          style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #22d3ee, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#0b0f1a", fontFamily: "'Outfit', sans-serif",
          }}
        >
          W
        </div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "0.04em", color: "#fff" }}>
          WILDZWAY
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="nav-desktop">
        {links.map((l) => (
          <NavLink key={l.page} label={l.label} active={currentPage === l.page} onClick={() => setPage(l.page)} />
        ))}
      </div>

      <div
        className="nav-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ display: "none", cursor: "pointer", padding: 8, color: "#fff" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </div>

      {mobileOpen && (
        <div style={{
          position: "fixed", top: 72, left: 0, right: 0, bottom: 0,
          background: "rgba(11,15,26,0.96)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 24, zIndex: 99,
        }}>
          {links.map((l) => (
            <div
              key={l.page}
              onClick={() => { setPage(l.page); setMobileOpen(false); }}
              style={{
                fontSize: 24, fontWeight: 600,
                color: currentPage === l.page ? "#22d3ee" : "rgba(255,255,255,0.7)",
                cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em",
              }}
            >
              {l.label}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "8px 16px", borderRadius: 10, fontSize: 14, fontWeight: 500,
        letterSpacing: "0.06em", textTransform: "uppercase",
        color: active ? "#22d3ee" : hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
        background: active ? "rgba(34,211,238,0.08)" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'Outfit', sans-serif",
      }}
    >
      {label}
    </div>
  );
}

// ─── Home ────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const projects = [
    { title: "Brinkline", desc: "Digital infrastructure and execution systems designed to modernize businesses and communities.", page: PAGES.wayz, accent: "#22d3ee" },
    { title: "Polaroid Fever", desc: "A cultural artifact exploring sound, aesthetic, and narrative identity.", page: PAGES.wonderz, accent: "#d946ef" },
    { title: "Field Guide", desc: "A personal operating system designed to structure growth, belief, and strategic life mapping.", page: PAGES.worldz, accent: "#34d399" },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
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

      <Section style={{ padding: "80px clamp(24px, 5vw, 80px)", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>What We Build</p>
        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: "0 0 24px", fontFamily: "'Outfit', sans-serif" }}>
          Where Imagination Meets <GradientText>Infrastructure</GradientText>
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontFamily: "'Outfit', sans-serif" }}>
          We build scalable systems, creative artifacts, and execution frameworks that bridge imagination and infrastructure. WildzWay operates as a studio, lab, and vault — where ideas are structured, refined, and released into the world.
        </p>
      </Section>

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

// ─── Inner Page Template ─────────────────────────────────────────
function InnerPage({ title, subtitle, accentColor, sections }) {
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

function WorldzPage() {
  return <InnerPage title="Worldz" subtitle="Scalable systems, digital frameworks, and structured thinking environments designed for long-term impact." accentColor="#34d399" sections={[{ label: "Framework", title: "Field Guide", desc: "A personal operating system for structuring growth, belief systems, and strategic life mapping. Built for clarity in complexity." }, { label: "System", title: "LoopStack", desc: "Modular system architecture for building feedback loops, decision engines, and structured iteration cycles at scale." }, { label: "Philosophy", title: "Infrastructure Thinking", desc: "Every great output needs a backbone. We design invisible systems that make visible results inevitable." }, { label: "Vision", title: "Long-Term Horizon", desc: "WildzWay builds for decades, not quarters. Our systems are designed to compound, evolve, and endure." }]} />;
}

function WonderzPage() {
  return <InnerPage title="Wonderz" subtitle="Cultural artifacts and creative works emerging from the studio — music, media, narrative worlds, and experimental projects." accentColor="#d946ef" sections={[{ label: "Artifact", title: "Polaroid Fever", desc: "An exploration of sound, aesthetic, and narrative identity. A cultural artifact that blends music, visuals, and storytelling." }, { label: "Pipeline", title: "Future Drops", desc: "Upcoming creative releases across music, media, and digital experiences. Every drop is engineered with intention." }, { label: "Lab", title: "Media & Concepts", desc: "Experimental creative work spanning video, design, generative art, and narrative world-building." }, { label: "Archive", title: "Creative Vault", desc: "A living archive of works in progress, research material, and creative prototypes from the studio." }]} />;
}

function WayzPage() {
  return <InnerPage title="Wayz" subtitle="Execution — real-world systems, implementation, and infrastructure modernization." accentColor="#22d3ee" sections={[{ label: "Platform", title: "Brinkline", desc: "Digital infrastructure and execution systems designed to modernize businesses, communities, and service delivery." }, { label: "Services", title: "Studio Services", desc: "End-to-end digital strategy, design, and development. From concept to deployed, production-grade systems." }, { label: "Capabilities", title: "Technical Stack", desc: "Full-stack engineering, systems design, product architecture, and scalable deployment across modern platforms." }, { label: "Process", title: "Strategy & Build", desc: "Our process: discover, define, design, build, ship, iterate. Every engagement follows a structured execution path." }]} />;
}

// ─── Wayfinder Page (AI Chat) ────────────────────────────────────
function WayfinderPage() {
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasMessages = messages.length > 0;

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are Wayfinder, the AI assistant for WildzWay — a creative cosmic studio building digital systems, cultural artifacts, and scalable infrastructure. You help visitors explore the studio's work, answer questions about projects (Brinkline, Polaroid Fever, Field Guide, LoopStack), and assist with ideas. Be confident, vision-forward, modern. Not corporate, not chaotic. Keep responses concise and helpful.",
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const assistantText = data.content?.map(item => (item.type === "text" ? item.text : "")).filter(Boolean).join("\n") || "I couldn't generate a response. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: assistantText }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong connecting to Wayfinder. Please try again." }]);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const suggestions = ["Tell me about WildzWay", "What is Brinkline?", "Explain the Field Guide", "What services do you offer?"];

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <ParticleNetwork />
      {!hasMessages && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "140px 24px 40px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg, #22d3ee, #a855f7, #d946ef)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#0b0f1a", fontFamily: "'Outfit', sans-serif", marginBottom: 28, boxShadow: "0 0 60px rgba(34,211,238,0.15), 0 0 120px rgba(168,85,247,0.1)" }}>W</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.1 }}>What will you <GradientText>discover</GradientText>?</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif", maxWidth: 460, marginBottom: 32 }}>Wayfinder is your guide to the WildzWay studio — ask about projects, systems, or ideas.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 520, marginBottom: 40 }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => setInput(s)} style={{ padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.2s ease", fontFamily: "'Outfit', sans-serif" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
              >{s}</button>
            ))}
          </div>
        </div>
      )}
      {hasMessages && (
        <div style={{ flex: 1, overflowY: "auto", padding: "100px clamp(16px, 4vw, 60px) 24px", maxWidth: 760, margin: "0 auto", width: "100%" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 20 }}>
              <div style={{ maxWidth: "85%", padding: msg.role === "user" ? "12px 18px" : "16px 20px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(168,85,247,0.12))" : "rgba(255,255,255,0.04)", border: `1px solid ${msg.role === "user" ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.06)"}`, backdropFilter: "blur(20px)" }}>
                {msg.role === "assistant" && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a855f7", marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>Wayfinder</div>}
                <div style={{ fontSize: 15, lineHeight: 1.7, color: msg.role === "user" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)", fontFamily: "'Outfit', sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}>
              <div style={{ padding: "16px 20px", borderRadius: "18px 18px 18px 4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a855f7", marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>Wayfinder</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {[0, 1, 2].map((d) => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(168,85,247,0.5)", animation: `dotPulse 1.4s ${d * 0.2}s ease-in-out infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      <div style={{ position: hasMessages ? "sticky" : "relative", bottom: 0, padding: "16px clamp(16px, 4vw, 60px) 32px", maxWidth: 760, margin: "0 auto", width: "100%" }}>
        <div style={{ position: "relative", borderRadius: 20, background: "rgba(30,30,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 4px 30px rgba(0,0,0,0.4)" }}>
          <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask Wayfinder anything..." style={{ width: "100%", resize: "none", background: "transparent", color: "#fff", fontSize: 15, fontFamily: "'Outfit', sans-serif", padding: "20px 20px 12px", border: "none", outline: "none", minHeight: 56, maxHeight: 200, boxSizing: "border-box", lineHeight: 1.5 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px 12px" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "'Outfit', sans-serif", paddingLeft: 8 }}>Powered by Claude</div>
            <button onClick={sendMessage} disabled={!input.trim() || isLoading} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 100, fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif", background: input.trim() && !isLoading ? "linear-gradient(135deg, #22d3ee, #a855f7)" : "rgba(255,255,255,0.06)", color: input.trim() && !isLoading ? "#0b0f1a" : "rgba(255,255,255,0.25)", border: "none", cursor: input.trim() && !isLoading ? "pointer" : "not-allowed", transition: "all 0.25s ease" }}>
              Send
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes dotPulse { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } } textarea::placeholder { color: rgba(255,255,255,0.2); }`}</style>
    </div>
  );
}

// ─── Wondervision Page ────────────────────────────────────────────
function WondervisionPage() {
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("artistic");
  const [resolution, setResolution] = useState("1024x1024");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  useEffect(() => {
    if (!isGenerating) { setProgress(0); return; }
    const texts = mode === "image" ? ["Interpreting your vision...", "Composing elements...", "Rendering final output..."] : mode === "video" ? ["Generating frames...", "Applying motion...", "Rendering video..."] : ["Building 3D mesh...", "Applying textures...", "Finalizing avatar..."];
    let textIdx = 0;
    setLoadingText(texts[0]);
    const textInt = setInterval(() => { textIdx = (textIdx + 1) % texts.length; setLoadingText(texts[textIdx]); }, 1500);
    const progInt = setInterval(() => { setProgress(p => { if (p >= 100) return 100; return p + (mode === "image" ? 1.5 : 0.8); }); }, 30);
    return () => { clearInterval(textInt); clearInterval(progInt); };
  }, [isGenerating, mode]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedUrl(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are Wondervision, the AI art engine for WildzWay studio. When given a prompt, describe in vivid detail what the generated " + mode + " would look like. Be poetic and visual. Format as a short creative brief (3-4 sentences). Include details about composition, colors, mood, and style. Style preference: " + style,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const desc = data.content?.map(i => i.type === "text" ? i.text : "").filter(Boolean).join("\n") || "Generation complete.";
      await new Promise(r => setTimeout(r, 2000));
      const item = { id: Date.now(), type: mode, prompt, description: desc, style, resolution, timestamp: new Date() };
      setHistory(prev => [item, ...prev]);
      setGeneratedUrl(item);
    } catch (err) {
      setGeneratedUrl({ error: true, description: "Generation failed. Please try again." });
    }
    setIsGenerating(false);
  };

  const modes = [{ id: "image", label: "Image", icon: "🖼️" }, { id: "video", label: "Video", icon: "🎬" }, { id: "avatar", label: "3D Avatar", icon: "🧊" }];
  const styles = ["artistic", "professional", "cinematic", "vintage", "anime", "photorealistic"];
  const resolutions = mode === "video" ? ["512x512", "1024x576", "1280x720"] : ["512x512", "768x768", "1024x1024", "1536x1536"];
  const suggestions = mode === "image" ? ["Cosmic cityscape at sunset with aurora skies", "Abstract neural network visualization", "Futuristic studio workspace floating in space"] : mode === "video" ? ["Camera orbiting a glowing crystal structure", "Timelapse of a digital city being built", "Flowing aurora particles in slow motion"] : ["Cyberpunk character with holographic visor", "Stylized robot companion with glowing eyes", "Professional avatar with cosmic backdrop"];
  const selectStyle = { width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none", appearance: "none" as const, cursor: "pointer" };

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div style={{ padding: "120px clamp(16px, 4vw, 60px) 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 16px", borderRadius: 100, background: "rgba(217,70,239,0.08)", border: "1px solid rgba(217,70,239,0.15)", marginBottom: 20 }}>
            <span style={{ fontSize: 14 }}>✦</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#d946ef", fontFamily: "'Outfit', sans-serif" }}>AI-Powered Creation</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>Wonder<GradientText>vision</GradientText></h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" }}>Generate images, videos, and 3D avatars with AI</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {modes.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: "10px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif", border: "1px solid", borderColor: mode === m.id ? "rgba(217,70,239,0.3)" : "rgba(255,255,255,0.08)", background: mode === m.id ? "rgba(217,70,239,0.1)" : "rgba(255,255,255,0.03)", color: mode === m.id ? "#d946ef" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.25s ease", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
        <GlassCard hoverGlow={false} style={{ padding: "32px 28px" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.06em", fontFamily: "'Outfit', sans-serif" }}>Describe your vision</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={suggestions[0]} style={{ width: "100%", minHeight: 80, resize: "vertical", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: "none", boxSizing: "border-box", lineHeight: 1.5 }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => setPrompt(s)} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
              >{s}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="wv-settings">
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}>{styles.map(s => <option key={s} value={s} style={{ background: "#1a1a1e" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>Resolution</label>
              <select value={resolution} onChange={e => setResolution(e.target.value)} style={selectStyle}>{resolutions.map(r => <option key={r} value={r} style={{ background: "#1a1a1e" }}>{r}</option>)}</select>
            </div>
          </div>
          <Button onClick={handleGenerate} style={{ width: "100%", background: isGenerating ? "rgba(255,255,255,0.06)" : undefined, cursor: isGenerating ? "not-allowed" : undefined }}>
            {isGenerating ? "Generating..." : "✦ Generate " + modes.find(m => m.id === mode)?.label}
          </Button>
          {isGenerating && (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>{loadingText}</p>
              <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #d946ef, #a855f7)", width: progress + "%", transition: "width 0.1s linear" }} />
              </div>
            </div>
          )}
          {generatedUrl && !isGenerating && (
            <div style={{ marginTop: 28 }}>
              <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: generatedUrl.error ? "#ef4444" : "#34d399" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: generatedUrl.error ? "#ef4444" : "#34d399", fontFamily: "'Outfit', sans-serif" }}>{generatedUrl.error ? "Error" : "Generation Complete"}</span>
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif" }}>{generatedUrl.description}</p>
              </div>
            </div>
          )}
        </GlassCard>
        {history.length > 0 && (
          <Section style={{ marginTop: 40 }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Recent Generations</p>
            <div style={{ display: "grid", gap: 12 }}>
              {history.slice(0, 5).map(item => (
                <GlassCard key={item.id} style={{ padding: "16px 20px" }} hoverGlow={false}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: "'Outfit', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.prompt}</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'Outfit', sans-serif" }}>{item.type}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>·</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'Outfit', sans-serif" }}>{item.style}</span>
                      </div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d946ef", flexShrink: 0, marginTop: 6 }} />
                  </div>
                </GlassCard>
              ))}
            </div>
          </Section>
        )}
      </div>
      <style>{`@media (max-width: 600px) { .wv-settings { grid-template-columns: 1fr !important; } } select { -webkit-appearance: none; } textarea::placeholder { color: rgba(255,255,255,0.2); }`}</style>
    </div>
  );
}

// ─── About Page ──────────────────────────────────────────────────
function AboutPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  const values = ["Clarity", "Structure", "Expansion", "Execution"];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ padding: "160px clamp(24px, 5vw, 80px) 80px", maxWidth: 900, margin: "0 auto", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ width: 48, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #22d3ee, #a855f7)", marginBottom: 28 }} />
        <h1 style={{ fontSize: "clamp(44px, 5vw, 68px)", fontWeight: 800, color: "#fff", margin: "0 0 32px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.05 }}>About <GradientText>WildzWay</GradientText></h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontFamily: "'Outfit', sans-serif", marginBottom: 48 }}>WildzWay is a creative studio focused on building meaningful digital ecosystems. Operating at the intersection of systems thinking, creative expression, and practical execution, the studio develops scalable frameworks, cultural artifacts, and real-world infrastructure solutions.</p>
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

// ─── Contact Page ────────────────────────────────────────────────
function ContactPage() {
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", message: "" });
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: "none", transition: "border 0.25s ease", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.05em", fontFamily: "'Outfit', sans-serif" };

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ padding: "160px clamp(24px, 5vw, 80px) 120px", maxWidth: 640, margin: "0 auto", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ width: 48, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #22d3ee, #d946ef)", marginBottom: 28 }} />
        <h1 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>Start a Conversation</h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 48, fontFamily: "'Outfit', sans-serif" }}>Tell us about your project or idea.</p>
        <GlassCard hoverGlow={false} style={{ padding: "40px 36px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(34,211,238,0.3)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} placeholder="you@example.com" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(34,211,238,0.3)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
            </div>
            <div>
              <label style={labelStyle}>Project Type</label>
              <input style={inputStyle} placeholder="e.g. Brand, Platform, Creative, Infrastructure" value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(34,211,238,0.3)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" }} placeholder="Tell us about your project..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(34,211,238,0.3)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
            </div>
            <Button style={{ width: "100%", marginTop: 8 }}>Send Message</Button>
          </div>
        </GlassCard>
        <p style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "rgba(255,255,255,0.25)", fontFamily: "'Outfit', sans-serif" }}>
          Or reach us directly at <span style={{ color: "#22d3ee" }}>hello@wildzway.com</span>
        </p>
      </div>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px clamp(24px, 5vw, 80px)", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontFamily: "'Outfit', sans-serif" }}>© 2026 WildzWay Studio</div>
      <div style={{ display: "flex", gap: 24 }}>
        {["Worldz", "Wonderz", "Wayz"].map((l) => (
          <span key={l} onClick={() => setPage(l.toLowerCase())} style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
          >{l}</span>
        ))}
      </div>
    </footer>
  );
}

// ─── Main App ────────────────────────────────────────────────────
export default function WildzWay() {
  const [page, setPage] = useState(PAGES.home);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case PAGES.worldz: return <WorldzPage />;
      case PAGES.wonderz: return <WonderzPage />;
      case PAGES.wayz: return <WayzPage />;
      case PAGES.wayfinder: return <WayfinderPage />;
      case PAGES.wondervision: return <WondervisionPage />;
      case PAGES.about: return <AboutPage />;
      case PAGES.contact: return <ContactPage />;
      default: return <HomePage setPage={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", color: "#fff", fontFamily: "'Outfit', sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <AuroraBackground />
      <Nav currentPage={page} setPage={navigate} />
      <main key={page} style={{ animation: "pageIn 0.6s ease forwards" }}>
        {renderPage()}
      </main>
      <Footer setPage={navigate} />
      <style>{`
        @keyframes pageIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        ::placeholder { color: rgba(255,255,255,0.2); }
        input:focus, textarea:focus { outline: none; }
        .hero-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 860px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-panel { display: none; } }
      `}</style>
    </div>
  );
}
