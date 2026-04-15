"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "ImmersiCloud cut our 3D asset delivery latency by 78%. Our clients now experience showroom-quality product visualization on mobile—something we thought was years away.",
    author: "Priya Menon",
    role: "CTO, Luxe Commerce",
    initials: "PM",
    stars: 5,
    accent: "border-cyan-500/20",
  },
  {
    quote:
      "The spatial API is the first I've used that actually feels designed by engineers who ship 3D products. The DX is extraordinary—our team went from POC to production in three weeks.",
    author: "James Okonkwo",
    role: "Lead Engineer, Architech Studio",
    initials: "JO",
    stars: 5,
    accent: "border-blue-500/20",
  },
  {
    quote:
      "We scaled from 10K to 2M concurrent spatial sessions during a product launch with zero intervention. That kind of confidence changes how you think about go-to-market.",
    author: "Sarah Lin",
    role: "VP Engineering, Metaverse Retail Co.",
    initials: "SL",
    stars: 5,
    accent: "border-violet-500/20",
  },
  {
    quote:
      "Security and compliance were our biggest blockers for enterprise deals. ImmersiCloud's SOC 2 posture and audit logging removed every objection in the room.",
    author: "Marcus Weber",
    role: "Head of Platform, FinTech Immersive",
    initials: "MW",
    stars: 5,
    accent: "border-emerald-500/20",
  },
  {
    quote:
      "Real-time multiplayer spatial collab was something we prototyped for six months internally. ImmersiCloud shipped it in our stack in a day. Genuinely remarkable.",
    author: "Amara Diallo",
    role: "Product Director, Collab.io",
    initials: "AD",
    stars: 5,
    accent: "border-amber-500/20",
  },
  {
    quote:
      "The edge delivery is legitimately global. We have users in sub-Saharan Africa reporting better load times than we had with our previous CDN in Western Europe.",
    author: "Thiago Costa",
    role: "Platform Architect, WorldWide XR",
    initials: "TC",
    stars: 5,
    accent: "border-cyan-500/20",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 section-fade relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs tracking-[0.25em] text-cyan-400/70 uppercase mb-4">
            WHAT TEAMS SAY
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-5">
            Trusted by teams building{" "}
            <span className="text-gradient">what's next</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            From seed-stage startups to Fortune 500 engineering orgs—these are the teams
            already shipping with ImmersiCloud.
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="break-inside-avoid"
            >
              <Card
                className={`glass border ${t.accent} hover:border-opacity-50 transition-all duration-500 group`}
              >
                <CardContent className="p-6">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-white/10">
                      <AvatarFallback className="bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
