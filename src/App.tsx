import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GuideId } from "./types";
import { GUIDES } from "./config/guides";
import { LandingPage } from "./components/LandingPage";
import { ChatPage } from "./components/ChatPage";
import { LandingScene } from "./components/scenes/LandingScene";
import { EntropoScene } from "./components/scenes/EntropoScene";
import { CSScene } from "./components/scenes/CSScene";
import { KazuhaScene } from "./components/scenes/KazuhaScene";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  type Settings,
} from "./components/SettingsModal";
import "./styles/chat.css";
import "./styles/landing.css";

type View = { kind: "landing" } | { kind: "chat"; guide: GuideId };

export default function App() {
  const [view, setView] = useState<View>({ kind: "landing" });
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // Parallax follows the mouse for depth.
  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setParallax({ x: x * 18, y: y * 12 });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scene = useMemo(() => {
    if (view.kind === "landing") return <LandingScene parallax={parallax} />;
    if (view.kind === "chat") {
      if (view.guide === "entropo") return <EntropoScene parallax={parallax} />;
      if (view.guide === "cs") return <CSScene parallax={parallax} />;
      if (view.guide === "kazuha") return <KazuhaScene parallax={parallax} />;
    }
    return null;
  }, [view, parallax]);

  const handleSelect = (id: GuideId) => setView({ kind: "chat", guide: id });
  const handleBack = () => setView({ kind: "landing" });

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        <motion.div
          key={view.kind + (view.kind === "chat" ? view.guide : "")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        >
          {scene}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view.kind === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, zIndex: 2 }}
          >
            <LandingPage onSelect={handleSelect} />
          </motion.div>
        ) : (
          <motion.div
            key={"chat-" + view.guide}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, zIndex: 2 }}
          >
            <ChatPage
              guide={GUIDES[view.guide]}
              onBack={handleBack}
              settings={settings}
              onSettingsChange={setSettings}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
