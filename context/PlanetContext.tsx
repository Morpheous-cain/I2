/**
 * PlanetContext — single source of truth for all 3D↔UI shared state.
 *
 * Architecture:
 *   PlanetProvider (wraps the whole page)
 *     ├── usePlanetStore()   → read/write 3D scene state
 *     ├── useSceneSignals()  → subscribe to derived animation values
 *     └── usePlanetEmitter() → push raw 3D frame data from inside R3F Canvas
 *
 * Data flows in two directions:
 *   UI  → 3D : variant, isHovered (user intent)
 *   3D  → UI : rotation angle, light intensity, pulse phase, mouse parallax
 *
 * All values that drive CSS animations are stored as plain numbers so
 * React can batch them efficiently. Expensive derivations happen once
 * inside PlanetProvider, not in every consuming component.
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type HeroVariant = "explore" | "build" | "deploy";

/** Raw frame data pushed by the R3F render loop every animation frame. */
export interface SceneFrame {
  /** Planet Y-rotation in radians (0 → 2π, wraps). */
  rotationY: number;
  /** Normalised ambient light level driven by variant (0–1). */
  lightIntensity: number;
  /** Slow sine wave 0–1 used for atmosphere pulse / glow breathing. */
  pulsePhase: number;
  /** Time elapsed since scene mount in seconds. */
  elapsed: number;
}

/** Normalised mouse position across the full viewport (–1 to +1 each axis). */
export interface MouseNDC {
  x: number;
  y: number;
  /** Smoothed version updated via lerp at 60fps — safe to use directly in CSS. */
  smoothX: number;
  smoothY: number;
}

/** Scroll telemetry updated on every scroll event. */
export interface ScrollState {
  /** Raw scroll offset in px. */
  y: number;
  /** Normalised 0–1 across full document height. */
  progress: number;
  /** Instantaneous px/frame velocity (capped ±200). */
  velocity: number;
  /** Direction of most recent scroll. */
  direction: "up" | "down" | "idle";
}

/** Values derived from SceneFrame for direct CSS consumption. */
export interface SceneSignals {
  /**
   * Accent colour for the active variant as an HSL string.
   * Update on every variant change — NOT every frame.
   */
  accentColor: string;
  accentColorRaw: { h: number; s: number; l: number };
  /**
   * 0–1 value: how strongly the current "day side" of the planet faces
   * the camera. Drives button glow, card brightness.
   */
  lightFacing: number;
  /** Atmosphere pulse 0–1, suitable for CSS opacity / scale drivers. */
  pulse: number;
  /** Planet rotation mapped to –1…+1 for parallax offsets. */
  rotationNorm: number;
  /** Combined mouse + rotation parallax for text layers (px values). */
  parallaxX: number;
  parallaxY: number;
  /** Scroll-driven blur amount 0–8px for depth effects. */
  scrollBlur: number;
  /** Scroll velocity mapped to skew (°) for kinetic UI feedback. */
  scrollSkew: number;
  /** Whether hero is in viewport. */
  heroVisible: boolean;
}

export interface PlanetCtxValue {
  // ── State the UI writes ──────────────────────────────────────────────────
  variant: HeroVariant;
  setVariant: (v: HeroVariant) => void;
  cycleVariant: () => void;
  isHovered: boolean;
  setIsHovered: (h: boolean) => void;

  // ── Raw telemetry the 3D scene writes ────────────────────────────────────
  /** Called each R3F frame — must be non-reactive (ref-based) for perf. */
  emitFrame: (frame: SceneFrame) => void;
  mouse: MouseNDC;
  scroll: ScrollState;

  // ── Derived signals for UI consumption ───────────────────────────────────
  signals: SceneSignals;

  // ── Variant config ───────────────────────────────────────────────────────
  variantConfig: typeof VARIANT_CONFIG;
}

// ─── Config ──────────────────────────────────────────────────────────────────

export const VARIANT_CONFIG = {
  explore: {
    rotationSpeed: 0.3,
    atmosphereIntensity: 0.6,
    glowColor: "#0ecbdb",
    accentHSL: { h: 189, s: 94, l: 43 },
    label: "Explore",
  },
  build: {
    rotationSpeed: 0.8,
    atmosphereIntensity: 1.0,
    glowColor: "#3b82f6",
    accentHSL: { h: 217, s: 91, l: 60 },
    label: "Build",
  },
  deploy: {
    rotationSpeed: 1.4,
    atmosphereIntensity: 1.4,
    glowColor: "#06b6d4",
    accentHSL: { h: 189, s: 94, l: 43 },
    label: "Deploy",
  },
} as const;

// ─── Default signals (SSR-safe) ───────────────────────────────────────────────

const DEFAULT_SIGNALS: SceneSignals = {
  accentColor: "hsl(189 94% 43%)",
  accentColorRaw: { h: 189, s: 94, l: 43 },
  lightFacing: 0.5,
  pulse: 0.5,
  rotationNorm: 0,
  parallaxX: 0,
  parallaxY: 0,
  scrollBlur: 0,
  scrollSkew: 0,
  heroVisible: true,
};

// ─── Context ──────────────────────────────────────────────────────────────────

const PlanetContext = createContext<PlanetCtxValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function PlanetProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<HeroVariant>("explore");
  const [isHovered, setIsHovered] = useState(false);
  const [signals, setSignals] = useState<SceneSignals>(DEFAULT_SIGNALS);

  // Non-reactive refs for high-frequency data (avoids re-renders on every frame)
  const frameRef = useRef<SceneFrame>({
    rotationY: 0,
    lightIntensity: 0.6,
    pulsePhase: 0.5,
    elapsed: 0,
  });
  const mouseRef = useRef<MouseNDC>({ x: 0, y: 0, smoothX: 0, smoothY: 0 });
  const scrollRef = useRef<ScrollState>({ y: 0, progress: 0, velocity: 0, direction: "idle" });
  const heroVisibleRef = useRef(true);
  const rafRef = useRef<number>(0);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  // Reactive copies for consumers that need re-renders
  const [mouse, setMouse] = useState<MouseNDC>({ x: 0, y: 0, smoothX: 0, smoothY: 0 });
  const [scroll, setScroll] = useState<ScrollState>({ y: 0, progress: 0, velocity: 0, direction: "idle" });

  // ── Variant management ────────────────────────────────────────────────────

  const setVariant = useCallback((v: HeroVariant) => {
    setVariantState(v);
  }, []);

  const cycleVariant = useCallback(() => {
    setVariantState((v) => (v === "explore" ? "build" : v === "build" ? "deploy" : "explore"));
  }, []);

  // ── Frame emitter (called from inside R3F Canvas every frame) ─────────────

  const emitFrame = useCallback((frame: SceneFrame) => {
    frameRef.current = frame;
  }, []);

  // ── Signal derivation loop (runs on rAF, outside React render) ───────────

  useEffect(() => {
    let variantSnapshot = variant;

    const derive = () => {
      const f = frameRef.current;
      const m = mouseRef.current;
      const s = scrollRef.current;
      const cfg = VARIANT_CONFIG[variantSnapshot];
      const hsl = cfg.accentHSL;

      // Smooth mouse (lerp at ~60fps)
      m.smoothX += (m.x - m.smoothX) * 0.08;
      m.smoothY += (m.y - m.smoothY) * 0.08;

      // Light facing: how much the planet's "lit hemisphere" faces forward
      // We map rotationY mod π to a 0–1 cosine value
      const rotMod = ((f.rotationY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const lightFacing = (Math.cos(rotMod) * 0.5 + 0.5) * f.lightIntensity;

      // Rotation normalised –1…+1
      const rotationNorm = Math.sin(f.rotationY);

      // Parallax: blend mouse NDC + rotation + slight scroll
      const parallaxX = m.smoothX * 12 + rotationNorm * 6;
      const parallaxY = m.smoothY * 8 - (s.progress * 20);

      // Scroll-driven effects
      const absVel = Math.abs(s.velocity);
      const scrollBlur = Math.min(absVel * 0.04, 8);
      const scrollSkew = Math.max(-3, Math.min(3, s.velocity * 0.015));

      setSignals({
        accentColor: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`,
        accentColorRaw: hsl,
        lightFacing,
        pulse: f.pulsePhase,
        rotationNorm,
        parallaxX,
        parallaxY,
        scrollBlur,
        scrollSkew,
        heroVisible: heroVisibleRef.current,
      });

      rafRef.current = requestAnimationFrame(derive);
    };

    rafRef.current = requestAnimationFrame(derive);

    // Keep local snapshot in sync with React state
    const unsub = () => { variantSnapshot = variant; };
    unsub();

    return () => cancelAnimationFrame(rafRef.current);
  }, [variant]);

  // ── Mouse tracking ────────────────────────────────────────────────────────

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
      // Only trigger React re-render occasionally (not every mousemove)
    };

    // Low-frequency React state sync — every 100ms is plenty for consuming components
    const syncMouse = setInterval(() => {
      const m = mouseRef.current;
      setMouse({ x: m.x, y: m.y, smoothX: m.smoothX, smoothY: m.smoothY });
    }, 100);

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearInterval(syncMouse);
    };
  }, []);

  // ── Scroll tracking ───────────────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const maxY = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTimeRef.current);
      const rawVel = ((y - lastScrollYRef.current) / dt) * 16; // px/frame @ 60fps
      const velocity = Math.max(-200, Math.min(200, rawVel));

      scrollRef.current = {
        y,
        progress: y / maxY,
        velocity,
        direction: velocity > 0.5 ? "down" : velocity < -0.5 ? "up" : "idle",
      };

      lastScrollYRef.current = y;
      lastScrollTimeRef.current = now;
    };

    // Low-frequency React state sync for scroll
    const syncScroll = setInterval(() => {
      setScroll({ ...scrollRef.current });
    }, 50);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(syncScroll);
    };
  }, []);

  // ── Hero visibility (IntersectionObserver) ────────────────────────────────

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => { heroVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <PlanetContext.Provider
      value={{
        variant,
        setVariant,
        cycleVariant,
        isHovered,
        setIsHovered,
        emitFrame,
        mouse,
        scroll,
        signals,
        variantConfig: VARIANT_CONFIG,
      }}
    >
      {children}
    </PlanetContext.Provider>
  );
}

// ─── Consumer hooks ───────────────────────────────────────────────────────────

/** Full context — use when you need both state and signals. */
export function usePlanet(): PlanetCtxValue {
  const ctx = useContext(PlanetContext);
  if (!ctx) throw new Error("usePlanet must be used inside <PlanetProvider>");
  return ctx;
}

/** Cheap signal-only hook — no state writes, only reads derived values. */
export function useSceneSignals(): SceneSignals {
  return usePlanet().signals;
}

/** Variant + mutation only — for tabs and cycle buttons. */
export function useVariant() {
  const { variant, setVariant, cycleVariant, variantConfig } = usePlanet();
  return { variant, setVariant, cycleVariant, variantConfig };
}
