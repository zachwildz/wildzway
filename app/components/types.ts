export const PAGES = {
  home: "home",
  worldz: "worldz",
  wonderz: "wonderz",
  wayz: "wayz",
  wayfinder: "wayfinder",
  wondervision: "wondervision",
  about: "about",
  contact: "contact",
} as const;

export type PageKey = (typeof PAGES)[keyof typeof PAGES];

export interface Star {
  x: number;
  y: number;
  peakOpacity: number;
  duration: number;
  delay: number;
}

export interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface GenerationItem {
  id: number;
  type: string;
  prompt: string;
  description: string;
  style: string;
  resolution: string;
  timestamp: Date;
  error?: boolean;
}
