"use client";

import { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";

// ─── Glass Card ──────────────────────────────────────────────────
interface GlassCardProps {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  hoverGlow?: boolean;
  className?: string;
}

export function GlassCard({ children, onClick, style = {}, hoverGlow = true, className = "" }: GlassCardProps) {
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
interface GradientTextProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function GradientText({ children, style = {} }: GradientTextProps) {
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
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
}

export function Button({ children, variant = "primary", onClick, style = {}, disabled = false }: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
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
        cursor: disabled ? "not-allowed" : "pointer",
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

// ─── Section (scroll-reveal wrapper) ────────────────────────────
interface SectionProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function Section({ children, style = {} }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
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
