"use client";

import { PageKey } from "./types";

interface FooterProps {
  setPage: (page: PageKey) => void;
}

export default function Footer({ setPage }: FooterProps) {
  return (
    <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px clamp(24px, 5vw, 80px)", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontFamily: "'Outfit', sans-serif" }}>© 2026 WildzWay Studio</div>
      <div style={{ display: "flex", gap: 24 }}>
        {(["worldz", "wonderz", "wayz"] as PageKey[]).map((l) => (
          <span
            key={l}
            onClick={() => setPage(l)}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
          >
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </span>
        ))}
      </div>
    </footer>
  );
}
