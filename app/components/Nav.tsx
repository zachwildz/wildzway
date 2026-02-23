"use client";

import { useState, useEffect } from "react";
import { PAGES, PageKey } from "./types";

interface NavProps {
  currentPage: PageKey;
  setPage: (page: PageKey) => void;
}

interface NavLinkProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavLink({ label, active, onClick }: NavLinkProps) {
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

export default function Nav({ currentPage, setPage }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links: { label: string; page: PageKey }[] = [
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
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 clamp(20px, 4vw, 60px)", height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
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
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #22d3ee, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#0b0f1a", fontFamily: "'Outfit', sans-serif" }}>W</div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "0.04em", color: "#fff" }}>WILDZWAY</span>
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
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, bottom: 0, background: "rgba(11,15,26,0.96)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, zIndex: 99 }}>
          {links.map((l) => (
            <div
              key={l.page}
              onClick={() => { setPage(l.page); setMobileOpen(false); }}
              style={{ fontSize: 24, fontWeight: 600, color: currentPage === l.page ? "#22d3ee" : "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em" }}
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
