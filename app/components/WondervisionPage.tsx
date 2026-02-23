"use client";

import { useState, useEffect, CSSProperties } from "react";
import { GlassCard, GradientText, Button, Section } from "./ui";
import type { GenerationItem } from "./types";

type GenerationResult = GenerationItem | { error: true; description: string } | null;

export default function WondervisionPage() {
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [styleChoice, setStyleChoice] = useState("artistic");
  const [resolution, setResolution] = useState("1024x1024");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [generatedResult, setGeneratedResult] = useState<GenerationResult>(null);
  const [history, setHistory] = useState<GenerationItem[]>([]);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  useEffect(() => {
    if (!isGenerating) { setProgress(0); return; }
    const texts =
      mode === "image" ? ["Interpreting your vision...", "Composing elements...", "Rendering final output..."]
      : mode === "video" ? ["Generating frames...", "Applying motion...", "Rendering video..."]
      : ["Building 3D mesh...", "Applying textures...", "Finalizing avatar..."];
    let textIdx = 0;
    setLoadingText(texts[0]);
    const textInt = setInterval(() => { textIdx = (textIdx + 1) % texts.length; setLoadingText(texts[textIdx]); }, 1500);
    const progInt = setInterval(() => { setProgress((p) => { if (p >= 100) return 100; return p + (mode === "image" ? 1.5 : 0.8); }); }, 30);
    return () => { clearInterval(textInt); clearInterval(progInt); };
  }, [isGenerating, mode]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedResult(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Wondervision, the AI art engine for WildzWay studio. When given a prompt, describe in vivid detail what the generated ${mode} would look like. Be poetic and visual. Format as a short creative brief (3-4 sentences). Include details about composition, colors, mood, and style. Style preference: ${styleChoice}`,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const desc =
        data.content
          ?.map((i: { type: string; text?: string }) => (i.type === "text" ? i.text : ""))
          .filter(Boolean)
          .join("\n") || "Generation complete.";
      await new Promise((r) => setTimeout(r, 2000));
      const item: GenerationItem = { id: Date.now(), type: mode, prompt, description: desc, style: styleChoice, resolution, timestamp: new Date() };
      setHistory((prev) => [item, ...prev]);
      setGeneratedResult(item);
    } catch {
      setGeneratedResult({ error: true, description: "Generation failed. Please try again." });
    }
    setIsGenerating(false);
  };

  const modes = [{ id: "image", label: "Image", icon: "🖼️" }, { id: "video", label: "Video", icon: "🎬" }, { id: "avatar", label: "3D Avatar", icon: "🧊" }];
  const styles = ["artistic", "professional", "cinematic", "vintage", "anime", "photorealistic"];
  const resolutions = mode === "video" ? ["512x512", "1024x576", "1280x720"] : ["512x512", "768x768", "1024x1024", "1536x1536"];
  const suggestions =
    mode === "image" ? ["Cosmic cityscape at sunset with aurora skies", "Abstract neural network visualization", "Futuristic studio workspace floating in space"]
    : mode === "video" ? ["Camera orbiting a glowing crystal structure", "Timelapse of a digital city being built", "Flowing aurora particles in slow motion"]
    : ["Cyberpunk character with holographic visor", "Stylized robot companion with glowing eyes", "Professional avatar with cosmic backdrop"];

  const selectStyle: CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none", appearance: "none", cursor: "pointer" };

  const isError = generatedResult && "error" in generatedResult && generatedResult.error;

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div style={{ padding: "120px clamp(16px, 4vw, 60px) 60px", maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 16px", borderRadius: 100, background: "rgba(217,70,239,0.08)", border: "1px solid rgba(217,70,239,0.15)", marginBottom: 20 }}>
            <span style={{ fontSize: 14 }}>✦</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#d946ef", fontFamily: "'Outfit', sans-serif" }}>AI-Powered Creation</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", fontFamily: "'Outfit', sans-serif" }}>Wonder<GradientText>vision</GradientText></h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" }}>Generate images, videos, and 3D avatars with AI</p>
        </div>

        {/* Mode Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {modes.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: "10px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif", border: "1px solid", borderColor: mode === m.id ? "rgba(217,70,239,0.3)" : "rgba(255,255,255,0.08)", background: mode === m.id ? "rgba(217,70,239,0.1)" : "rgba(255,255,255,0.03)", color: mode === m.id ? "#d946ef" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.25s ease", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <GlassCard hoverGlow={false} style={{ padding: "32px 28px" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.06em", fontFamily: "'Outfit', sans-serif" }}>Describe your vision</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={suggestions[0]}
              style={{ width: "100%", minHeight: 80, resize: "vertical", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: "none", boxSizing: "border-box", lineHeight: 1.5 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => setPrompt(s)} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
              >{s}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="wv-settings">
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>Style</label>
              <select value={styleChoice} onChange={(e) => setStyleChoice(e.target.value)} style={selectStyle}>
                {styles.map((s) => <option key={s} value={s} style={{ background: "#1a1a1e" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>Resolution</label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)} style={selectStyle}>
                {resolutions.map((r) => <option key={r} value={r} style={{ background: "#1a1a1e" }}>{r}</option>)}
              </select>
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} style={{ width: "100%", background: isGenerating ? "rgba(255,255,255,0.06)" : undefined, cursor: isGenerating ? "not-allowed" : undefined }}>
            {isGenerating ? "Generating..." : `✦ Generate ${modes.find((m) => m.id === mode)?.label}`}
          </Button>

          {isGenerating && (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>{loadingText}</p>
              <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #d946ef, #a855f7)", width: progress + "%", transition: "width 0.1s linear" }} />
              </div>
            </div>
          )}

          {generatedResult && !isGenerating && (
            <div style={{ marginTop: 28 }}>
              <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isError ? "#ef4444" : "#34d399" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: isError ? "#ef4444" : "#34d399", fontFamily: "'Outfit', sans-serif" }}>{isError ? "Error" : "Generation Complete"}</span>
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif" }}>{generatedResult.description}</p>
              </div>
            </div>
          )}
        </GlassCard>

        {history.length > 0 && (
          <Section style={{ marginTop: 40 }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Recent Generations</p>
            <div style={{ display: "grid", gap: 12 }}>
              {history.slice(0, 5).map((item) => (
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
