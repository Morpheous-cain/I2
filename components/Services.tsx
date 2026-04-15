"use client";
import { motion } from "framer-motion";
import { Cloud, Layers, Globe, Cpu, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Elastic, auto-scaling compute designed for high-fidelity 3D workloads—from simulation to real-time rendering at global scale.",
    badge: "Core",
    color: "text-cyan-400",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: Layers,
    title: "Spatial APIs",
    description: "Unified SDK for asset streaming, scene management, and spatial queries—built on open standards with zero vendor lock-in.",
    badge: "SDK",
    color: "text-blue-400",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    icon: Globe,
    title: "Edge Delivery",
    description: "200+ points of presence ensure sub-10ms delivery of your 3D assets and experiences to any device, anywhere on Earth.",
    badge: "Edge",
    color: "text-cyan-400",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: Cpu,
    title: "AI Rendering",
    description: "GPU-accelerated AI upscaling and neural radiance field rendering reduce bandwidth by 60% without sacrificing visual fidelity.",
    badge: "AI",
    color: "text-violet-400",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified. Zero-trust access controls, end-to-end encryption, and granular audit logging built in from day one.",
    badge: "Secure",
    color: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Real-Time Collab",
    description: "Multiplayer spatial sessions with <50ms sync latency. Co-design, co-review, and co-present immersive environments as a team.",
    badge: "Live",
    color: "text-amber-400",
    glow: "group-hover:shadow-amber-500/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Services() {
  return (
    <section id="services" className="py-28 section-fade relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs tracking-[0.25em] text-cyan-400/70 uppercase mb-4">
            PLATFORM CAPABILITIES
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-5">
            Everything you need to{" "}
            <span className="text-gradient">go immersive</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            One platform. Every layer of the stack—from cloud compute to client SDK—
            engineered to work together seamlessly.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} variants={itemVariants}>
                <Card
                  className={`group h-full glass border-white/5 hover:border-white/12 transition-all duration-500 hover:shadow-xl ${service.glow} cursor-default`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:border-white/15 transition-colors duration-300">
                        <Icon className={`w-5 h-5 ${service.color}`} />
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
