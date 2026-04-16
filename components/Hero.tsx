/**
 * Hero — full-viewport hero section.
 *
 * 3D↔UI integration points:
 *  - Text layers parallax with planet rotation + mouse (useHeroTextAnimation)
 *  - Gradient headline tracks planet light facing (useHeroTextAnimation)
 *  - CTA buttons glow with planet atmosphere (useButtonAnimation)
 *  - Background grid opacity breathes with pulse phase
 *  - Ambient glow behind planet shifts with rotationNorm (usePlanetGlowAnimation)
 *  - Variant tabs map directly to planet state (usePlanet)
 */
"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlanet, type HeroVariant } from "@/context/PlanetContext";
import { useHeroTextAnimation, useButtonAnimation, usePlanetGlowAnimation } from "@/hooks/useSceneAnimations";
import { cn } from "@/lib/utils";

const PlanetCanvas = dynamic(() => import("@/components/three/PlanetCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
    </div>
  ),
});

const VARIANT_CONTENT: Record<
  HeroVariant,
  { eyebrow: string; headline: string[]; sub: string; cta: string; badge: string }
> = {
  explore: {
    eyebrow: "Premium Web Studio",
    headline: ["Make Your Brand Stand Out Online"],
    sub: "We build websites that look premium, feel intentional, and earn trust crediblity",
    cta: "See Work",
    badge: "Start Project",
  },

  build: {
    eyebrow: "Engineering Team",
    headline: ["From Idea To Live Product"],
    sub: "We create high-performance digital products designed to grow with your business.",
    cta: "Start Building",
    badge: "How We Work",
  },

  deploy: {
    eyebrow: "Revenue Engine",
    headline: ["Turn Your Website Into a Sales System"],
    sub: "We turn your website into a consistent source of leads, clients, and measurable growth.",
    cta: "Start Growing",
    badge: "View Proof",
  },
};

const VARIANT_TABS: { id: HeroVariant; label: string }[] = [
  { id: "explore", label: "attract" },
  { id: "build",   label:"build"},
  { id: "deploy",  label: "grow"  },
];

export default function Hero() {
  const { variant, setVariant, signals } = usePlanet();
  const content = VARIANT_CONTENT[variant];
  const { eyebrowStyle, headlineStyle, subStyle, gradientStyle } = useHeroTextAnimation();
  const { primaryStyle, outlineStyle } = useButtonAnimation(variant);
  const { glowStyle, ringStyle } = usePlanetGlowAnimation();
  const { h, s, l } = signals.accentColorRaw;

  return (
    <section
      id="hero-section"
      className="relative min-h-screen hero-radial overflow-hidden flex flex-col"
    >
      {/* Background grid — opacity breathes with pulse */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(${h} ${s}% ${l}% / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(${h} ${s}% ${l}% / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.015 + signals.pulse * 0.02,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(222_47%_6%)_100%)] pointer-events-none" />

      {/* Main content */}
      <div className="relative flex-1 flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-6 pt-24 pb-16 w-full gap-8">

        {/* ── LEFT: Text ── */}
        <div className="flex-1 flex flex-col justify-center z-10 lg:pr-8">

          {/* Variant tabs */}
          <div className="flex items-center gap-1 mb-8 p-1 glass rounded-xl w-fit">
            {VARIANT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setVariant(tab.id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300",
                  variant === tab.id
                    ? "text-background shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={
                  variant === tab.id
                    ? {
                        background: `hsl(${h} ${s}% ${l}%)`,
                        boxShadow: `0 4px 16px hsl(${h} ${s}% ${l}% / 0.4)`,
                        transition: "background 0.8s ease, box-shadow 0.3s ease",
                      }
                    : undefined
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Eyebrow — shallowest parallax layer */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`eyebrow-${variant}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-xs tracking-[0.25em] uppercase mb-4"
              style={{
                ...eyebrowStyle,
                color: `hsl(${h} ${s}% ${l}% / 0.7)`,
                transition: `${eyebrowStyle.transition}, color 0.8s ease`,
              }}
            >
              {content.eyebrow}
            </motion.p>
          </AnimatePresence>

          {/* Headline — deepest parallax layer */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`headline-${variant}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6"
              style={headlineStyle}
            >
              {content.headline.map((line, i) => (
                <span
                  key={i}
                  className={cn("block", i === 1 ? "bg-clip-text text-transparent" : "text-foreground")}
                  style={i === 1 ? gradientStyle : undefined}
                >
                  {line}
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>

          {/* Sub — mid parallax layer */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${variant}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mb-8"
              style={subStyle}
            >
              {content.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${variant}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-wrap items-center gap-4"
            >
              {/* Primary — glows with planet light */}
              <Button
                size="lg"
                className="text-background font-bold px-8 h-12 text-sm rounded-xl group"
                style={primaryStyle}
              >
                {content.cta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Outline — border tracks variant accent */}
              <Button
                variant="outline"
                size="lg"
                className="bg-white/5 hover:bg-white/8 h-12 px-8 text-sm rounded-xl font-semibold"
                style={outlineStyle}
              >
                Watch Demo
              </Button>

              <Badge
                variant="secondary"
                className="glass font-mono text-xs px-3 py-1.5"
                style={{
                  borderColor: `hsl(${h} ${s}% ${l}% / 0.25)`,
                  color: `hsl(${h} ${s}% ${Math.round(l + 10)}%)`,
                  transition: "border-color 0.8s ease, color 0.8s ease",
                }}
              >
                ✦ {content.badge}
              </Badge>
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-8 mt-12 pt-8 border-t border-white/5"
          >
            {[
              { value: "200+",   label: "Global PoPs" },
              { value: "99.99%", label: "Uptime SLA"  },
              { value: "10ms",   label: "P99 Latency" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className="font-display text-2xl font-black bg-clip-text text-transparent"
                  style={gradientStyle}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: 3D Planet ── */}
        <div className="flex-1 relative flex items-center justify-center w-full lg:w-auto">
          {/* Ambient glow — position shifts with planet rotation */}
          <div
            className="absolute inset-0 rounded-full blur-[80px] pointer-events-none"
            style={glowStyle}
          />

          {/* Outer ring decoration — pulses with atmosphere */}
          <div
            className="absolute inset-[-10%] rounded-full border pointer-events-none"
            style={{
              ...ringStyle,
              borderColor: `hsl(${h} ${s}% ${l}% / 0.08)`,
            }}
          />

          {/* Click hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute top-4 right-4 z-10 glass rounded-full px-3 py-1.5 flex items-center gap-1.5"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: `hsl(${h} ${s}% ${l}%)` }}
            />
            <span className="text-xs font-mono text-muted-foreground">Click to cycle</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-full aspect-square max-w-[500px] lg:max-w-[620px]"
          >
            <PlanetCanvas />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center pb-8"
      >
        <a
          href="#services"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
