"use client";

import { useState, useEffect, useRef } from "react";
import ParticleNetwork from "./ParticleNetwork";
import { GradientText } from "./ui";
import type { Message } from "./types";

export default function WayfinderPage() {
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    const userMsg: Message = { role: "user", content: input.trim() };
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
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const assistantText =
        data.content
          ?.map((item: { type: string; text?: string }) => (item.type === "text" ? item.text : ""))
          .filter(Boolean)
          .join("\n") || "I couldn't generate a response. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: assistantText }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong connecting to Wayfinder. Please try again." }]);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

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
              <button
                key={s}
                onClick={() => setInput(s)}
                style={{ padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.2s ease", fontFamily: "'Outfit', sans-serif" }}
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

      {/* Input */}
      <div style={{ position: hasMessages ? "sticky" : "relative", bottom: 0, padding: "16px clamp(16px, 4vw, 60px) 32px", maxWidth: 760, margin: "0 auto", width: "100%" }}>
        <div style={{ position: "relative", borderRadius: 20, background: "rgba(30,30,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 4px 30px rgba(0,0,0,0.4)" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Wayfinder anything..."
            style={{ width: "100%", resize: "none", background: "transparent", color: "#fff", fontSize: 15, fontFamily: "'Outfit', sans-serif", padding: "20px 20px 12px", border: "none", outline: "none", minHeight: 56, maxHeight: 200, boxSizing: "border-box", lineHeight: 1.5 }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px 12px" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "'Outfit', sans-serif", paddingLeft: 8 }}>Powered by Claude</div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 100, fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif", background: input.trim() && !isLoading ? "linear-gradient(135deg, #22d3ee, #a855f7)" : "rgba(255,255,255,0.06)", color: input.trim() && !isLoading ? "#0b0f1a" : "rgba(255,255,255,0.25)", border: "none", cursor: input.trim() && !isLoading ? "pointer" : "not-allowed", transition: "all 0.25s ease" }}
            >
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
