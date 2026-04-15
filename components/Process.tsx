/**
 * Process — 4-step onboarding grid.
 *
 * 3D↔UI integration:
 *  - Step number badges glow brighter when planet lit side faces camera
 *  - Connector accent line brightness follows scroll + lightFacing
 *  - Icon containers pulse with variant atmosphere colour
 *  - Section header skews with scroll velocity (useSectionHeaderAnimation)
 */
"use client";

import { motion } from "framer-motion";
import { Telescope, Hammer, Rocket, BarChart3 } from "lucide-react";
import { usePlanet } from "@/context/PlanetContext";
import { useStepAnimation, useSectionHeaderAnimation } from "@/hooks/useSceneAnimations";

const steps = [
  { number: "01", icon: Telescope, title: "Discovery & Architecture",   description: "We audit your existing stack, define spatial computing requirements, and produce a detailed technical architecture tailored to your use case and scale targets.",                                                                       duration: "Week 1–2" },
  { number: "02", icon: Hammer,    title: "Platform Configuration",      description: "Your ImmersiCloud environment is provisioned, CDN rules configured, SDK integrated into your codebase, and CI/CD pipelines established with automated quality gates.",                                                                     duration: "Week 3–4" },
  { number: "03", icon: Rocket,    title: "Launch & Optimize",           description: "Go live with confidence. Our team monitors your first production deployment, fine-tunes edge caching rules, and optimizes rendering budgets for peak performance.",                                                                         duration: "Week 5–6" },
  { number: "04", icon: BarChart3, title: "Scale & Iterate",             description: "Continuous performance analytics, monthly architecture reviews, and priority access to new platform capabilities keep your experience ahead of the curve.",                                                                                  duration: "Ongoing"  },
];

function ProcessStep({ step, index }: { step: typeof steps[0]; index: number }) {
  const { numberStyle, connectorStyle } = useStepAnimation(index);
  const { signals } = usePlanet();
  const Icon = step.icon;
  const { h, s, l } = signals.accentColorRaw;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="glass border border-white/5 hover:border-white/12 rounded-2xl p-7 h-full transition-all duration-500 group relative overflow-hidden">
        {/* Hover fill — traces planet glow colour */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
          style={{ background: `linear-gradient(135deg, hsl(${h} ${s}% ${l}% / 0.04) 0%, transparent 70%)` }}
        />

        {/* Left connector line (visible only on lg) */}
        {index < steps.length - 1 && (
          <div
            className="absolute bottom-0 left-[2.75rem] w-px h-6 hidden lg:block"
            style={connectorStyle}
          />
        )}

        <div className="relative flex items-start gap-5">
          <div className="flex-shrink-0">
            <div
              className="w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{
                background: `hsl(${h} ${s}% ${l}% / ${(0.08 + signals.pulse * 0.08).toFixed(3)})`,
                borderColor: `hsl(${h} ${s}% ${l}% / ${(0.18 + signals.lightFacing * 0.25).toFixed(2)})`,
                transition: "background 0.4s ease, border-color 0.6s ease, transform 0.3s ease",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: `hsl(${h} ${s}% ${Math.round(l + 10)}%)` }} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold tracking-widest" style={numberStyle}>
                {step.number}
              </span>
              <span className="text-xs font-mono text-muted-foreground/60 border border-white/8 px-2 py-0.5 rounded-full">
                {step.duration}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold mb-2 text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const { signals } = usePlanet();
  const { skewStyle } = useSectionHeaderAnimation();

  return (
    <section id="process" className="py-28 relative">
      {/* Vertical accent line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block"
        style={{
          background: `linear-gradient(to bottom,
            transparent,
            hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${signals.accentColorRaw.l}% / ${(0.1 + signals.lightFacing * 0.25).toFixed(2)}),
            transparent)`,
          transition: "background 0.8s ease",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
          style={skewStyle}
        >
          <p
            className="font-mono text-xs tracking-[0.25em] uppercase mb-4"
            style={{ color: `hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${signals.accentColorRaw.l}% / 0.7)` }}
          >
            HOW IT WORKS
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-5">
            From zero to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg,
                  hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${Math.round(signals.accentColorRaw.l + signals.lightFacing * 15)}%),
                  hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${signals.accentColorRaw.l}%))`,
              }}
            >
              immersive
            </span>
            <br />in six weeks
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            A battle-tested onboarding process refined across 200+ enterprise deployments.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <ProcessStep key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
