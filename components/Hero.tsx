"use client";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlanetState, type HeroVariant } from "@/hooks/usePlanetState";
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
    eyebrow: "SPATIAL COMPUTING PLATFORM",
    headline: ["Build Beyond", "Reality"],
    sub: "ImmersiCloud fuses cloud-native infrastructure with immersive spatial computing—so your teams can design, simulate, and ship digital experiences that transcend the screen.",
    cta: "Start Exploring",
    badge: "Now in Open Beta",
  },
  build: {
    eyebrow: "DEVELOPER PLATFORM",
    headline: ["Infinite Scale,", "Zero Limits"],
    sub: "A unified API surface for 3D asset streaming, real-time collaboration, and spatial analytics—engineered for teams that refuse to compromise between performance and creativity.",
    cta: "Start Building",
    badge: "10× Faster Deploys",
  },
  deploy: {
    eyebrow: "GLOBAL EDGE NETWORK",
    headline: ["Ship at the", "Speed of Light"],
    sub: "From prototype to production in minutes. Our edge-first deployment pipeline pushes your immersive experiences to 200+ PoPs worldwide with zero configuration required.",
    cta: "Deploy Now",
    badge: "200+ Global PoPs",
  },
};

const VARIANT_ACCENT: Record<HeroVariant, string> = {
  explore: "hsl(189 94% 43%)",
  build: "hsl(217 91% 60%)",
  deploy: "hsl(189 94% 43%)",
};

const VARIANT_TABS: { id: HeroVariant; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "build", label: "Build" },
  { id: "deploy", label: "Deploy" },
];

export default function Hero() {
  const { state, variant, setVariant, setIsHovered, cycleVariant } = usePlanetState();
  const content = VARIANT_CONTENT[variant];

  return (
    <section className="relative min-h-screen hero-radial overflow-hidden flex flex-col">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(189 94% 43% / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(189 94% 43% / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(222_47%_6%)_100%)] pointer-events-none" />

      {/* Main content */}
      <div className="relative flex-1 flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-6 pt-24 pb-16 w-full gap-8">

        {/* LEFT — Text content */}
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
                    ? "bg-cyan-500 text-background shadow-lg shadow-cyan-500/30"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Eyebrow */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`eyebrow-${variant}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-xs tracking-[0.25em] text-cyan-400/70 mb-4 uppercase"
            >
              {content.eyebrow}
            </motion.p>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`headline-${variant}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              {content.headline.map((line, i) => (
                <span key={i} className={cn("block", i === 1 ? "text-gradient" : "text-foreground")}>
                  {line}
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>

          {/* Subheading */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${variant}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mb-8"
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
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-400 text-background font-bold glow-cyan px-8 h-12 text-sm rounded-xl transition-all duration-300 group"
              >
                {content.cta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-white/8 h-12 px-8 text-sm rounded-xl font-semibold"
              >
                Watch Demo
              </Button>
              <Badge
                variant="secondary"
                className="glass border border-cyan-500/20 text-cyan-400 font-mono text-xs px-3 py-1.5"
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
              { value: "200+", label: "Global PoPs" },
              { value: "99.99%", label: "Uptime SLA" },
              { value: "10ms", label: "P99 Latency" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display text-2xl font-black text-gradient">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mt-0.5">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — 3D Planet */}
        <div className="flex-1 relative flex items-center justify-center w-full lg:w-auto">
          {/* Ambient glow behind planet */}
          <div
            className="absolute inset-0 rounded-full blur-[80px] opacity-25 transition-all duration-700"
            style={{
              background: `radial-gradient(ellipse at center, ${VARIANT_ACCENT[variant]}, transparent 70%)`,
            }}
          />

          {/* Click hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute top-4 right-4 z-10 glass rounded-full px-3 py-1.5 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">Click to cycle</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-full aspect-square max-w-[500px] lg:max-w-[620px]"
          >
            <PlanetCanvas
              state={state}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={cycleVariant}
            />
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
