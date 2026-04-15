"use client";
import { motion } from "framer-motion";
import { Telescope, Hammer, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Telescope,
    title: "Discovery & Architecture",
    description:
      "We audit your existing stack, define spatial computing requirements, and produce a detailed technical architecture tailored to your use case and scale targets.",
    duration: "Week 1–2",
  },
  {
    number: "02",
    icon: Hammer,
    title: "Platform Configuration",
    description:
      "Your ImmersiCloud environment is provisioned, CDN rules configured, SDK integrated into your codebase, and CI/CD pipelines established with automated quality gates.",
    duration: "Week 3–4",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Launch & Optimize",
    description:
      "Go live with confidence. Our team monitors your first production deployment, fine-tunes edge caching rules, and optimizes rendering budgets for peak performance.",
    duration: "Week 5–6",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Scale & Iterate",
    description:
      "Continuous performance analytics, monthly architecture reviews, and priority access to new platform capabilities keep your experience ahead of the curve.",
    duration: "Ongoing",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-28 relative">
      {/* Accent line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs tracking-[0.25em] text-cyan-400/70 uppercase mb-4">
            HOW IT WORKS
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-5">
            From zero to{" "}
            <span className="text-gradient">immersive</span>
            <br />in six weeks
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            A battle-tested onboarding process refined across 200+ enterprise deployments.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="glass border border-white/5 hover:border-cyan-500/15 rounded-2xl p-7 h-full transition-all duration-500 group relative overflow-hidden">
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/4 transition-all duration-500 rounded-2xl" />

                  <div className="relative flex items-start gap-5">
                    {/* Step number + icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/15 group-hover:border-cyan-500/35 transition-all duration-300">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs font-bold text-cyan-400/50 tracking-widest">
                          {step.number}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground/60 border border-white/8 px-2 py-0.5 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold mb-2 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
