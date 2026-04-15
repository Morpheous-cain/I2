/**
 * Testimonials — masonry card grid.
 *
 * 3D↔UI integration:
 *  - Each card parallaxes at unique depth (useTestimonialAnimation)
 *  - Star colour tracks active variant accent + light facing
 *  - Avatar ring glows with atmosphere pulse
 *  - Section header skews with scroll
 */
"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePlanet } from "@/context/PlanetContext";
import { useTestimonialAnimation, useSectionHeaderAnimation } from "@/hooks/useSceneAnimations";

const testimonials = [
  { quote: "ImmersiCloud cut our 3D asset delivery latency by 78%. Our clients now experience showroom-quality product visualization on mobile—something we thought was years away.",                                          author: "Priya Menon",    role: "CTO, Luxe Commerce",             initials: "PM" },
  { quote: "The spatial API is the first I've used that actually feels designed by engineers who ship 3D products. The DX is extraordinary—our team went from POC to production in three weeks.",                             author: "James Okonkwo",  role: "Lead Engineer, Architech Studio", initials: "JO" },
  { quote: "We scaled from 10K to 2M concurrent spatial sessions during a product launch with zero intervention. That kind of confidence changes how you think about go-to-market.",                                         author: "Sarah Lin",       role: "VP Engineering, Metaverse Retail",initials: "SL" },
  { quote: "Security and compliance were our biggest blockers for enterprise deals. ImmersiCloud's SOC 2 posture and audit logging removed every objection in the room.",                                                     author: "Marcus Weber",    role: "Head of Platform, FinTech XR",    initials: "MW" },
  { quote: "Real-time multiplayer spatial collab was something we prototyped for six months internally. ImmersiCloud shipped it in our stack in a day. Genuinely remarkable.",                                               author: "Amara Diallo",   role: "Product Director, Collab.io",     initials: "AD" },
  { quote: "The edge delivery is legitimately global. We have users in sub-Saharan Africa reporting better load times than we had with our previous CDN in Western Europe.",                                                  author: "Thiago Costa",   role: "Platform Architect, WorldWide XR",initials: "TC" },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const { cardStyle, starStyle } = useTestimonialAnimation(index);
  const { signals } = usePlanet();
  const { h, s, l } = signals.accentColorRaw;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="break-inside-avoid mb-5"
      style={cardStyle}
    >
      <Card
        className="glass transition-all duration-500 group overflow-hidden relative"
        style={{
          borderColor: `hsl(${h} ${s}% ${l}% / ${(0.12 + signals.pulse * 0.08).toFixed(3)})`,
          transition: "border-color 0.4s ease",
        }}
      >
        {/* Shimmer on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
          style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${h} ${s}% ${l}% / 0.04) 0%, transparent 70%)` }}
        />

        <CardContent className="p-6">
          {/* Stars — colour tracks variant */}
          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className="w-3.5 h-3.5" style={starStyle} />
            ))}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          <div className="flex items-center gap-3">
            <Avatar
              className="w-9 h-9"
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: `hsl(${h} ${s}% ${l}% / ${(0.15 + signals.pulse * 0.15).toFixed(2)})`,
                transition: "border-color 0.4s ease",
              }}
            >
              <AvatarFallback
                className="text-xs font-bold font-mono"
                style={{
                  background: `hsl(${h} ${s}% ${l}% / 0.1)`,
                  color: `hsl(${h} ${s}% ${Math.round(l + 10)}%)`,
                }}
              >
                {testimonial.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Testimonials() {
  const { signals } = usePlanet();
  const { skewStyle } = useSectionHeaderAnimation();
  const { h, s, l } = signals.accentColorRaw;

  return (
    <section id="testimonials" className="py-28 section-fade relative overflow-hidden">
      {/* Ambient glow — tracks pulse */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, hsl(${h} ${s}% ${l}% / ${(0.04 + signals.pulse * 0.03).toFixed(3)}) 0%, transparent 70%)`,
          filter: "blur(60px)",
          transition: "background 0.4s ease",
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
            style={{ color: `hsl(${h} ${s}% ${l}% / 0.7)` }}
          >
            WHAT TEAMS SAY
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-5">
            Trusted by teams building{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, hsl(${h} ${s}% ${Math.round(l + signals.lightFacing * 15)}%), hsl(${h} ${s}% ${l}%))` }}
            >
              what&apos;s next
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            From seed-stage startups to Fortune 500 engineering orgs—already shipping with ImmersiCloud.
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.author} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
