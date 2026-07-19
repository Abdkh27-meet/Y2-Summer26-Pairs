import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { GuideConfig } from "../types";
import { GUIDES } from "../config/guides";
import { GuideAvatar } from "./GuideAvatar";

export function LandingPage({
  onSelect,
}: {
  onSelect: (id: GuideConfig["id"]) => void;
}) {
  return (
    <div className="landing-root">
      <motion.div
        className="landing-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero-eyebrow">MEET · AI Companion</div>
        <h1 className="hero-title">MEET Guide</h1>
        <p className="hero-subtitle">Your AI companion throughout your MEET journey.</p>
        <p className="hero-desc">
          Choose the guide that best matches what you need today. Each assistant
          specializes in a different area and provides personalized guidance to
          help you learn, build, and create.
        </p>
      </motion.div>

      <div className="guide-cards">
        {Object.values(GUIDES).map((g, i) => (
          <motion.button
            key={g.id}
            className="guide-card"
            onClick={() => onSelect(g.id)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -10 }}
            style={
              {
                "--card-bg": g.colors.surface,
                "--card-border": g.colors.border,
                "--card-accent": g.colors.accent,
                "--card-glow": g.colors.glow,
                "--card-display": g.fontDisplay,
              } as React.CSSProperties
            }
          >
            <span className="card-glow" />
            <div className="card-emoji" style={{ fontSize: 0 }}>
              <GuideAvatar guide={g.id} size={56} />
            </div>
            <div className="card-name">{g.name}</div>
            <div className="card-title">{g.title}</div>
            <div className="card-desc">{g.description}</div>
            <div className="card-cta">
              Enter {g.shortName} <ArrowRight size={15} />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="landing-foot">
        MEET Guide · Crafted for your MEET journey
      </div>
    </div>
  );
}
