import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import type { Message, GuideConfig } from "../types";
import { Markdown } from "./Markdown";
import { GuideAvatar } from "./GuideAvatar";

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function MessageBubble({
  message,
  guide,
  isStreaming,
  onRegenerate,
}: {
  message: Message;
  guide: GuideConfig;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={`msg-row ${isUser ? "msg-row-user" : "msg-row-assistant"}`}
      style={{ animation: "fadeInUp 0.4s var(--ease) both" }}
    >
      {!isUser && (
        <div className="msg-avatar">
          <GuideAvatar guide={guide.id} size={38} />
        </div>
      )}
      <div className={`msg-bubble-wrap ${isUser ? "wrap-user" : "wrap-assistant"}`}>
        <div
          className={`msg-bubble ${isUser ? "bubble-user" : "bubble-assistant"}`}
          style={
            isUser
              ? {
                  background: guide.colors.userBubble,
                  color: guide.colors.userBubbleText,
                  borderRadius: "var(--r-lg) var(--r-lg) 6px var(--r-lg)",
                }
              : {
                  background: guide.colors.assistantBubble,
                  color: guide.colors.assistantBubbleText,
                  border: `1px solid ${guide.colors.border}`,
                  borderRadius: "var(--r-lg) var(--r-lg) var(--r-lg) 6px",
                }
          }
        >
          {isStreaming && !message.content ? (
            <TypingDots accent={guide.colors.accent} />
          ) : isUser ? (
            <div className="msg-text-plain">{message.content}</div>
          ) : (
            <Markdown content={message.content} accent={guide.colors.accent} />
          )}
          {isStreaming && message.content && (
            <span className="stream-cursor" style={{ color: guide.colors.accent }}>
              ▍
            </span>
          )}
        </div>
        <div className="msg-meta">
          <span className="msg-time">{formatTime(message.created_at)}</span>
          {!isStreaming && (
            <div className="msg-actions">
              <button className="msg-action-btn" onClick={copy} aria-label="Copy message">
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              {!isUser && onRegenerate && (
                <button
                  className="msg-action-btn"
                  onClick={onRegenerate}
                  aria-label="Regenerate response"
                >
                  <RefreshCw size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingDots({ accent }: { accent: string }) {
  return (
    <div className="typing-dots" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            background: accent,
            animation: `pulseDot 1.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
