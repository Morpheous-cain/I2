/**
 * Services — grid of capability cards.
 *
 * 3D↔UI integration:
 *  - Each card parallaxes at unique depth based on index (useCardAnimation)
 *  - Card borders pulse in a staggered wave driven by planet atmosphere
 *  - Icon backgrounds breathe with phase-offset pulse
 *  - Section header tilts slightly against scroll direction (useSectionHeaderAnimation)
 *  - Accent colours track active variant
 */
"use client";

import { motion } from "framer-motion";
import { Cloud, Layers, Globe, Cpu, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlanet } from "@/context/PlanetContext";
import { useCardAnimation, useSectionHeaderAnimation } from "@/hooks/useSceneAnimations";

const services = [
  {
    icon: Globe,
    title: "Attract — Web Design",
    description:
      "We design and build premium websites that capture attention, build trust, and turn visitors into clients.",
    badge: "Attract",
    baseColor: "text-cyan-400",
  },
  {
    icon: Layers,
    title: "Build — Web & App Development",
    description:
      "Custom websites and web applications built with modern technologies—fast, scalable, and tailored to your business.",
    badge: "Build",
    baseColor: "text-blue-400",
  },
  {
    icon: Cpu,
    title: "UI/UX Design",
    description:
      "Clean, intuitive interfaces designed to create seamless user experiences and keep users engaged.",
    badge: "Design",
    baseColor: "text-violet-400",
  },
  {
    icon: Zap,
    title: "Grow — Conversion & Optimization",
    description:
      "Optimize website or product to improve speed, performance, and conversion turning traffic into results.",
    badge: "Grow",
    baseColor: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Performance & Reliability",
    description:
      "Built for speed, stability, and scalability—ensuring your product performs under real-world conditions.",
    badge: "Core",
    baseColor: "text-emerald-400",
  },
  {
    icon: Cloud,
    title: "Ongoing Support",
    description:
      "We help you maintain, improve, and evolve your digital presence as your business grows.",
    badge: "Support",
    baseColor: "text-cyan-400",
  },
];
function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { cardStyle, iconStyle } = useCardAnimation(index);
  const { signals } = usePlanet();
  const Icon = service.icon;

  return (
    <div style={cardStyle}>
      <Card className="group h-full glass cursor-default overflow-hidden relative transition-all duration-500 hover:shadow-xl">
        {/* Hover shimmer — traces rotation direction */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
          style={{
            background: `linear-gradient(${135 + signals.rotationNorm * 20}deg,
              hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${signals.accentColorRaw.l}% / 0.04) 0%,
              transparent 60%)`,
          }}
        />

        <CardHeader>
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-10 h-10 rounded-xl border border-white/8 flex items-center justify-center group-hover:border-white/15 transition-colors duration-300"
              style={iconStyle}
            >
              <Icon className={`w-5 h-5 ${service.baseColor}`} />
            </div>
            <Badge
              variant="secondary"
              className="glass border border-white/10 text-muted-foreground font-mono text-[10px] tracking-widest uppercase"
            >
              {service.badge}
            </Badge>
          </div>
          <CardTitle className="font-display text-base font-bold text-foreground">
            {service.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-muted-foreground leading-relaxed text-sm">
            {service.description}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Services() {
  const { signals } = usePlanet();
  const { skewStyle, blurStyle } = useSectionHeaderAnimation();

  return (
    <section id="services" className="py-28 section-fade relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header — skews against scroll velocity */}
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
            PLATFORM CAPABILITIES
          </p>
          <h2
            className="font-display text-4xl md:text-5xl font-black tracking-tight mb-5"
            style={blurStyle}
          >
            Everything you need to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg,
                  hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${Math.round(signals.accentColorRaw.l + signals.lightFacing * 15)}%),
                  hsl(${signals.accentColorRaw.h} ${signals.accentColorRaw.s}% ${signals.accentColorRaw.l}%))`,
                transition: "background-image 0.8s ease",
              }}
            >
              go immersive
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            One platform. Every layer of the stack—from cloud compute to client SDK—engineered to work together seamlessly.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <ServiceCard service={service} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
