import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, PanelLeftOpen, Send, Settings as SettingsIcon, Square } from "lucide-react";
import type { Chat, GuideConfig, Message } from "../types";
import {
  addMessage,
  createChat,
  deleteChat,
  fetchMessages,
  listChats,
  renameChat,
} from "../lib/chat-store";
import { getAssistantReply, streamAssistantReply } from "../lib/anthropic-chat";
import { Sidebar } from "./Sidebar";
import { MessageBubble } from "./MessageBubble";
import { SettingsModal, type Settings, loadSettings, saveSettings } from "./SettingsModal";
import { GuideAvatar } from "./GuideAvatar";
import { exportChat } from "../lib/export";

interface ChatPageProps {
  guide: GuideConfig;
  onBack: () => void;
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
}

export function ChatPage({ guide, onBack, settings, onSettingsChange }: ChatPageProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const themeVars = useMemo(
    () =>
      ({
        "--guide-primary": guide.colors.primary,
        "--guide-secondary": guide.colors.secondary,
        "--guide-accent": guide.colors.accent,
        "--guide-glow": guide.colors.glow,
        "--guide-border": guide.colors.border,
        "--side-bg": guide.colors.surface,
        "--side-border": guide.colors.border,
        "--topbar-bg": guide.colors.surface,
        "--topbar-border": guide.colors.border,
        "--composer-bg": guide.colors.surface,
        "--composer-border": guide.colors.border,
        "--glass-bg": guide.colors.surface,
        "--glass-border": guide.colors.border,
        fontFamily: guide.font,
      }) as React.CSSProperties,
    [guide]
  );

  // Load chat list for this guide on mount and when guide changes.
  const refreshChats = useCallback(async () => {
    try {
      const list = await listChats(guide.id);
      setChats(list);
      return list;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [guide.id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingHistory(true);
      const list = await refreshChats();
      if (cancelled) return;
      if (list.length > 0) {
        const first = list[0];
        setActiveChat(first);
        const msgs = await fetchMessages(first.id);
        if (!cancelled) setMessages(msgs);
      } else {
        setActiveChat(null);
        setMessages([]);
      }
      setLoadingHistory(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [guide.id, refreshChats]);

  // Auto-scroll to bottom on new messages / streaming.
  useEffect(() => {
    if (!settings.autoScroll) return;
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, streaming, settings.autoScroll]);

  // Auto-grow textarea.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  // Global keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (meta && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleNewChat();
      } else if (meta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarOpen((o) => !o);
      } else if (meta && e.key === ",") {
        e.preventDefault();
        setShowSettings(true);
      } else if (meta && e.key.toLowerCase() === "e") {
        e.preventDefault();
        if (activeChat) exportChat(activeChat, messages, guide);
      } else if (e.key === "Escape" && streaming) {
        handleStop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat, messages, guide, streaming]);

  const handleNewChat = useCallback(() => {
    setActiveChat(null);
    setMessages([]);
    setInput("");
    setError(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  const handleSelectChat = useCallback(async (id: string) => {
    setError(null);
    const chat = chats.find((c) => c.id === id);
    if (chat) setActiveChat(chat);
    const msgs = await fetchMessages(id);
    setMessages(msgs);
  }, [chats]);

  const handleDeleteChat = useCallback(async (id: string) => {
    try {
      await deleteChat(id);
      const list = await refreshChats();
      if (activeChat?.id === id) {
        if (list.length > 0) {
          setActiveChat(list[0]);
          setMessages(await fetchMessages(list[0].id));
        } else {
          setActiveChat(null);
          setMessages([]);
        }
      }
    } catch (e) {
      console.error(e);
      setError("Could not delete chat.");
    }
  }, [activeChat, refreshChats]);

  const runAssistant = useCallback(
    async (chat: Chat, history: Message[], userText: string) => {
      setStreaming(true);
      setError(null);
      const tempId = "stream-" + Date.now();
      setStreamingId(tempId);
      const startedAt = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        { id: tempId, chat_id: chat.id, role: "assistant", content: "", created_at: startedAt },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const full = await streamAssistantReply({
          guide,
          history,
          userText,
          signal: controller.signal,
          onDelta: (delta) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempId ? { ...m, content: m.content + delta } : m
              )
            );
          },
        });
        // Persist the final assistant message.
        const saved = await addMessage(chat.id, "assistant", full);
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? saved : m))
        );
      } catch (err: any) {
        if (err?.name === "AbortError") {
          // Keep whatever streamed so far; persist partial if any.
          setMessages((prev) => {
            const partial = prev.find((m) => m.id === tempId);
            if (partial && partial.content.trim()) {
              addMessage(chat.id, "assistant", partial.content).catch(() => {});
              return prev.map((m) => (m.id === tempId ? { ...m, id: "aborted-" + tempId } : m));
            }
            return prev.filter((m) => m.id !== tempId);
          });
        } else {
          console.error(err);
          setError(err?.message || "Something went wrong reaching the assistant.");
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
        }
      } finally {
        setStreaming(false);
        setStreamingId(null);
        abortRef.current = null;
      }
    },
    [guide]
  );

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");

    let chat = activeChat;
    let history = messages;
    try {
      if (!chat) {
        chat = await createChat(guide.id, text);
        setActiveChat(chat);
        setChats((prev) => [chat!, ...prev]);
        history = [];
      } else if (messages.length === 0) {
        // First message in an existing empty chat — set its title.
        await renameChat(chat.id, text.slice(0, 42));
        setChats((prev) =>
          prev.map((c) => (c.id === chat!.id ? { ...c, title: text.slice(0, 42) } : c))
        );
      }

      const savedUser = await addMessage(chat.id, "user", text);
      setMessages((prev) => [...prev, savedUser]);
      await runAssistant(chat, history, text);
      refreshChats();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Could not send message.");
    }
  }, [input, streaming, activeChat, messages, guide.id, runAssistant, refreshChats]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleRegenerate = useCallback(async () => {
    if (streaming || messages.length < 2) return;
    // Find last user message.
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const idx = messages.length - 1 - lastUserIdx;
    const userMsg = messages[idx];
    const history = messages.slice(0, idx);
    if (!activeChat) return;

    // Remove the last assistant message.
    const lastAssistant = messages[messages.length - 1];
    if (lastAssistant.role === "assistant") {
      // soft remove from UI; keep persisted (history will rebuild)
    }
    setMessages(history.concat([userMsg]));
    try {
      const full = await getAssistantReply(guide, history.concat([userMsg]));
      const saved = await addMessage(activeChat.id, "assistant", full);
      setMessages((prev) => [...prev, saved]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Could not regenerate response.");
    }
  }, [streaming, messages, activeChat, guide]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && settings.sendOnEnter) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = SUGGESTIONS[guide.id];

  return (
    <div className={`chat-layout ${sidebarOpen ? "" : "sidebar-collapsed"}`} style={themeVars}>
      <Sidebar
        guide={guide}
        chats={chats}
        activeChatId={activeChat?.id ?? null}
        search={search}
        onSearch={setSearch}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenSettings={() => setShowSettings(true)}
        onExport={() => activeChat && exportChat(activeChat, messages, guide)}
        canExport={Boolean(activeChat) && messages.length > 0}
        onClose={() => setSidebarOpen(false)}
        collapsed={!sidebarOpen}
      />

      <main className="chat-main">
        <div className="topbar">
          {!sidebarOpen && (
            <button
              className="icon-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
          )}
          <button className="change-guide-btn" onClick={onBack}>
            <ArrowLeft size={15} /> Change Guide
          </button>
          <div className="topbar-guide">
            <GuideAvatar guide={guide.id} size={32} />
            <div style={{ minWidth: 0 }}>
              <div className="tg-name">{guide.name}</div>
              <div className="tg-title">{guide.title}</div>
            </div>
          </div>
          <button
            className="icon-btn"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <SettingsIcon size={16} />
          </button>
        </div>

        <div className="messages-scroll" ref={scrollRef}>
          {messages.length === 0 && !loadingHistory ? (
            <div className="empty-state">
              <div className="es-avatar">
                <GuideAvatar guide={guide.id} size={76} />
              </div>
              <div className="es-welcome">{guide.welcome}</div>
              <div className="es-sub">{guide.description}</div>
              <div className="suggestion-chips">
                {suggestions.map((s) => (
                  <button key={s} className="chip" onClick={() => setInput(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-inner">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "contents" }}
                  >
                    <MessageBubble
                      message={m}
                      guide={guide}
                      isStreaming={streaming && m.id === streamingId}
                      onRegenerate={
                        i === messages.length - 1 && m.role === "assistant" && !streaming
                          ? handleRegenerate
                          : undefined
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {error && (
                <div
                  style={{
                    maxWidth: 820,
                    margin: "0 auto",
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "rgba(192,71,59,0.18)",
                    border: "1px solid rgba(192,71,59,0.4)",
                    color: "#ff8a8a",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="composer">
          <div className="composer-inner">
            <textarea
              ref={textareaRef}
              placeholder={`Message ${guide.shortName}…`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              aria-label={`Message ${guide.name}`}
            />
            <div className="composer-actions">
              {streaming ? (
                <button className="send-btn stop-btn" onClick={handleStop} aria-label="Stop">
                  <Square size={15} />
                </button>
              ) : (
                <button
                  className="send-btn"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="composer-hint">
            Press <span className="kbd" style={{ fontSize: 10 }}>Enter</span> to send ·{" "}
            <span className="kbd" style={{ fontSize: 10 }}>Shift+Enter</span> for a new line
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            settings={settings}
            onChange={(s) => {
              onSettingsChange(s);
              saveSettings(s);
            }}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const SUGGESTIONS: Record<GuideConfig["id"], string[]> = {
  entropo: [
    "Help me define my value proposition",
    "How do I run customer discovery interviews?",
    "What makes a strong MVP?",
    "Tips for pitching my idea?",
  ],
  cs: [
    "Debug my Python function",
    "Explain recursion simply",
    "How do linked lists work?",
    "Review my code for bugs",
  ],
  kazuha: [
    "Write me a haiku about rain",
    "Color palette for a cozy café",
    "Ideas for a character design",
    "Help me overcome creative block",
  ],
};
