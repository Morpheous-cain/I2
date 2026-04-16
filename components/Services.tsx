/**
 * Services — redesigned premium cards with white/snow accents.
 */
"use client";

import { motion } from "framer-motion";
import { Cloud, Layers, Globe, Cpu, Shield, Zap, ArrowUpRight } from "lucide-react";
import { usePlanet } from "@/context/PlanetContext";
import { useCardAnimation, useSectionHeaderAnimation } from "@/hooks/useSceneAnimations";

const services = [
  {
    icon: Globe,
    title: "High-Performance Websites",
    description: "We design and build premium websites that look exceptional, perform flawlessly, and convert visitors into real clients.",
    badge: "Core",
    tag: "Web",
    stat: "100%",
    statLabel: "Custom Built",
  },
  {
    icon: Layers,
    title: "UI/UX Systems",
    description: "We craft clean, intuitive interfaces that guide users naturally and turn interactions into meaningful conversions.",
    badge: "Design",
    tag: "UX",
    stat: "< 2s",
    statLabel: "Load Time",
  },
  {
    icon: Cpu,
    title: "Performance Optimization",
    description: "We optimize speed, structure, and experience to ensure your website runs fast and converts at every touchpoint.",
    badge: "Optimize",
    tag: "Performance",
    stat: "2x+",
    statLabel: "Speed Boost",
  },
  {
    icon: Cloud,
    title: "Scalable Infrastructure",
    description: "We build fast, reliable systems designed to scale with your business—from launch to high-traffic growth.",
    badge: "Scale",
    tag: "Infrastructure",
    stat: "99.9%",
    statLabel: "Uptime",
  },
  {
    icon: Shield,
    title: "ERP & Business Systems",
    description: "We design and develop custom ERP systems that streamline operations, centralize data, and support your business as it scales.",
    badge: "Systems",
    tag: "ERP",
    stat: "Custom",
    statLabel: "Built",
  },
  {
    icon: Zap,
    title: "Conversion Systems",
    description: "We turn your website into a system that attracts the right audience and converts them into consistent clients.",
    badge: "Growth",
    tag: "Conversion",
    stat: "+30%",
    statLabel: "Avg Lift",
  },
];
function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { cardStyle, iconStyle } = useCardAnimation(index);
  const { signals } = usePlanet();
  const Icon = service.icon;
  const { h, s, l } = signals.accentColorRaw;

  return (
    <div style={cardStyle} className="h-full">
      <div className="group relative h-full rounded-2xl overflow-hidden cursor-default transition-all duration-500 hover:-translate-y-1">

        {/* Card background layers */}
        <div className="absolute inset-0 bg-[hsl(222_47%_8%/0.9)] rounded-2xl" />

        {/* Snow-white top edge highlight */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* Accent border — tracks variant colour */}
        <div
          className="absolute inset-0 rounded-2xl transition-all duration-700"
          style={{
            background: `linear-gradient(135deg,
              hsl(${h} ${s}% ${l}% / ${(0.06 + signals.pulse * 0.04).toFixed(3)}) 0%,
              transparent 50%)`,
            boxShadow: `inset 0 0 0 1px hsl(${h} ${s}% ${l}% / ${(0.1 + signals.lightFacing * 0.15).toFixed(2)})`,
          }}
        />

        {/* Hover glow fill */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 30% 0%,
              hsl(${h} ${s}% ${l}% / 0.07) 0%,
              transparent 65%)`,
          }}
        />

        {/* Content */}
        <div className="relative p-6 flex flex-col h-full">

          {/* Top row — icon + tag */}
          <div className="flex items-start justify-between mb-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{
                ...iconStyle,
                boxShadow: `0 0 0 1px hsl(${h} ${s}% ${l}% / 0.2), 0 4px 16px hsl(${h} ${s}% ${l}% / 0.15)`,
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: `hsl(${h} ${s}% ${Math.round(l + 12)}%)` }}
              />
            </div>

            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border"
              style={{
                color: `hsl(${h} ${s}% ${Math.round(l + 8)}% / 0.9)`,
                borderColor: `hsl(${h} ${s}% ${l}% / 0.18)`,
                background: `hsl(${h} ${s}% ${l}% / 0.06)`,
              }}
            >
              {service.tag}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-[1.05rem] font-bold text-white/95 mb-2.5 leading-snug">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/45 leading-relaxed flex-1">
            {service.description}
          </p>

          {/* Bottom — stat + link */}
          <div className="flex items-end justify-between mt-6 pt-5 border-t border-white/6">
            <div>
              <div
                className="font-display text-2xl font-black"
                style={{
                  color: `hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 10)}%)`,
                  transition: "color 0.8s ease",
                }}
              >
                {service.stat}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/35 mt-0.5">
                {service.statLabel}
              </div>
            </div>

            {/* Arrow link — appears on hover */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
              style={{
                background: `hsl(${h} ${s}% ${l}% / 0.15)`,
                border: `1px solid hsl(${h} ${s}% ${l}% / 0.3)`,
              }}
            >
              <ArrowUpRight
                className="w-3.5 h-3.5"
                style={{ color: `hsl(${h} ${s}% ${Math.round(l + 10)}%)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const { signals } = usePlanet();
  const { skewStyle, blurStyle } = useSectionHeaderAnimation();
  const { h, s, l } = signals.accentColorRaw;

  return (
    <section id="services" className="py-28 section-fade relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
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
            style={{ color: `hsl(${h} ${s}% ${l}% / 0.75)` }}
          >
            PLATFORM CAPABILITIES
          </p>
          <h2
            className="font-display text-4xl md:text-5xl font-black tracking-tight mb-5"
            style={blurStyle}
          >
            {/* White headline */}
            <span className="text-white/90">Everything you need to </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg,
                  hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 15)}%),
                  hsl(${h} ${s}% ${l}%))`,
                transition: "background-image 0.8s ease",
              }}
            >
              go immersive
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            One platform. Every layer of the stack—from cloud compute to client SDK—engineered to work together seamlessly.
          </p>
        </motion.div>

        {/* Card grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="h-full"
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
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