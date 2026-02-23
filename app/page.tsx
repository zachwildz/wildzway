"use client";

import { useState } from "react";
import { PAGES, PageKey } from "./components/types";
import AuroraBackground from "./components/AuroraBackground";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import { WorldzPage, WonderzPage, WayzPage } from "./components/InnerPages";
import WayfinderPage from "./components/WayfinderPage";
import WondervisionPage from "./components/WondervisionPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";

export default function WildzWay() {
  const [page, setPage] = useState<PageKey>(PAGES.home);

  const navigate = (p: PageKey) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case PAGES.worldz:      return <WorldzPage />;
      case PAGES.wonderz:     return <WonderzPage />;
      case PAGES.wayz:        return <WayzPage />;
      case PAGES.wayfinder:   return <WayfinderPage />;
      case PAGES.wondervision: return <WondervisionPage />;
      case PAGES.about:       return <AboutPage />;
      case PAGES.contact:     return <ContactPage />;
      default:                return <HomePage setPage={navigate} />;
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
