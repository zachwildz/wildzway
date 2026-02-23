"use client";

import { useState, useEffect, CSSProperties } from "react";
import { GlassCard, Button } from "./ui";

export default function ContactPage() {
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", message: "" });
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const inputStyle: CSSProperties = { width: "100%", padding: "14px 18px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: "none", transition: "border 0.25s ease", boxSizing: "border-box" };
  const labelStyle: CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.05em", fontFamily: "'Outfit', sans-serif" };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "rgba(34,211,238,0.3)");
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

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
              <input style={inputStyle} placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} placeholder="you@example.com" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>Project Type</label>
              <input style={inputStyle} placeholder="e.g. Brand, Platform, Creative, Infrastructure" value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" }} placeholder="Tell us about your project..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} onFocus={focusStyle} onBlur={blurStyle} />
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
