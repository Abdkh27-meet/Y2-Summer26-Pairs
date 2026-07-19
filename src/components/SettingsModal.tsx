import { useEffect } from "react";
import { Keyboard, X, Zap } from "lucide-react";

export interface Settings {
  autoScroll: boolean;
  typingAnimation: boolean;
  sendOnEnter: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  autoScroll: true,
  typingAnimation: true,
  sendOnEnter: true,
};

const STORAGE_KEY = "meet-guide-settings";

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

const SHORTCUTS: { keys: string; label: string }[] = [
  { keys: "Enter", label: "Send message" },
  { keys: "Shift + Enter", label: "New line" },
  { keys: "Ctrl/Cmd + K", label: "Focus search" },
  { keys: "Ctrl/Cmd + N", label: "New chat" },
  { keys: "Ctrl/Cmd + B", label: "Toggle sidebar" },
  { keys: "Esc", label: "Close modal / stop" },
  { keys: "Ctrl/Cmd + E", label: "Export chat" },
  { keys: "Ctrl/Cmd + ,", label: "Open settings" },
];

export function SettingsModal({
  settings,
  onChange,
  onClose,
}: {
  settings: Settings;
  onChange: (s: Settings) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (patch: Partial<Settings>) => onChange({ ...settings, ...patch });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="modal-title">Settings</div>
            <div className="modal-sub">Personalize your MEET Guide experience</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            <X size={16} />
          </button>
        </div>

        <div className="settings-row">
          <div>
            <div className="sr-label">Auto-scroll</div>
            <div className="sr-desc">Automatically scroll to new messages</div>
          </div>
          <button
            className={`toggle ${settings.autoScroll ? "on" : ""}`}
            onClick={() => set({ autoScroll: !settings.autoScroll })}
            aria-label="Toggle auto-scroll"
            aria-pressed={settings.autoScroll}
          />
        </div>

        <div className="settings-row">
          <div>
            <div className="sr-label">Typing animation</div>
            <div className="sr-desc">Show the typing dots while the assistant thinks</div>
          </div>
          <button
            className={`toggle ${settings.typingAnimation ? "on" : ""}`}
            onClick={() => set({ typingAnimation: !settings.typingAnimation })}
            aria-label="Toggle typing animation"
            aria-pressed={settings.typingAnimation}
          />
        </div>

        <div className="settings-row">
          <div>
            <div className="sr-label">Send on Enter</div>
            <div className="sr-desc">Press Enter to send, Shift+Enter for a new line</div>
          </div>
          <button
            className={`toggle ${settings.sendOnEnter ? "on" : ""}`}
            onClick={() => set({ sendOnEnter: !settings.sendOnEnter })}
            aria-label="Toggle send on enter"
            aria-pressed={settings.sendOnEnter}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Keyboard size={15} /> <strong style={{ fontSize: 14 }}>Keyboard shortcuts</strong>
          </div>
          <div className="shortcuts-grid">
            {SHORTCUTS.map((s) => (
              <div className="shortcut-item" key={s.label}>
                <span style={{ opacity: 0.7 }}>{s.label}</span>
                <span className="kbd">{s.keys}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          <Zap size={14} /> Tip: chats are saved per guide and persist across reloads.
        </div>
      </div>
    </div>
  );
}
