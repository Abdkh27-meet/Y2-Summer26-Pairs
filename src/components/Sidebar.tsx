import { useState } from "react";
import {
  Search,
  Plus,
  MessageSquare,
  Trash2,
  Settings as SettingsIcon,
  PanelLeftClose,
  X,
  Download,
} from "lucide-react";
import type { Chat, GuideConfig } from "../types";
import { GuideAvatar } from "./GuideAvatar";

export function Sidebar({
  guide,
  chats,
  activeChatId,
  search,
  onSearch,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  onExport,
  canExport,
  onClose,
  collapsed,
}: {
  guide: GuideConfig;
  chats: Chat[];
  activeChatId: string | null;
  search: string;
  onSearch: (s: string) => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
  onExport: () => void;
  canExport: boolean;
  onClose?: () => void;
  collapsed: boolean;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = search.trim()
    ? chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : chats;

  return (
    <aside
      className="sidebar"
      style={
        {
          "--side-bg": guide.colors.surface,
          "--side-border": guide.colors.border,
          "--guide-accent": guide.colors.accent,
          "--guide-primary": guide.colors.primary,
          "--guide-secondary": guide.colors.secondary,
          "--guide-glow": guide.colors.glow,
          "--guide-border": guide.colors.border,
        } as React.CSSProperties
      }
      aria-hidden={collapsed}
    >
      <div className="sidebar-head">
        <div className="sidebar-brand">
          <GuideAvatar guide={guide.id} size={34} />
          <div className="brand-text">
            <span className="brand-title">{guide.shortName}</span>
            <span className="brand-sub">MEET Guide</span>
          </div>
        </div>
        {onClose && (
          <button className="icon-btn" onClick={onClose} aria-label="Close sidebar">
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <Plus size={16} /> New chat
      </button>

      <div className="search-wrap">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Search chats…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search chats"
        />
      </div>

      <div className="chat-list" role="list">
        <div className="chat-list-label">History</div>
        {filtered.length === 0 && (
          <div style={{ padding: "14px 10px", fontSize: 12.5, opacity: 0.5 }}>
            {search ? "No chats match your search." : "No chats yet. Start a new one above."}
          </div>
        )}
        {filtered.map((c) => (
          <div
            key={c.id}
            role="listitem"
            className={`chat-item ${c.id === activeChatId ? "active" : ""}`}
            onClick={() => onSelectChat(c.id)}
          >
            <MessageSquare size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
            <span className="ci-title">{c.title}</span>
            {confirmId === c.id ? (
              <span
                className="ci-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(c.id);
                  setConfirmId(null);
                }}
                title="Confirm delete"
              >
                <X size={14} />
              </span>
            ) : (
              <button
                className="ci-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmId(c.id);
                }}
                aria-label={`Delete chat ${c.title}`}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-foot">
        <button
          className="foot-btn"
          onClick={onExport}
          disabled={!canExport}
          style={{ opacity: canExport ? 1 : 0.4, cursor: canExport ? "pointer" : "not-allowed" }}
          title="Export conversation as Markdown"
        >
          <Download size={15} /> Export chat
        </button>
        <button className="foot-btn" onClick={onOpenSettings}>
          <SettingsIcon size={15} /> Settings
        </button>
      </div>
    </aside>
  );
}
