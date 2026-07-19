export type GuideId = "entropo" | "cs" | "kazuha";

export type Role = "user" | "assistant";

export interface Chat {
  id: string;
  guide: GuideId;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: Role;
  content: string;
  created_at: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export interface GuideConfig {
  id: GuideId;
  key: string;
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  welcome: string;
  systemPrompt: string;
  model: string;
  font: string;
  fontDisplay: string;
  monoFont: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    bgDeep: string;
    surface: string;
    text: string;
    textMuted: string;
    userBubble: string;
    userBubbleText: string;
    assistantBubble: string;
    assistantBubbleText: string;
    border: string;
    glow: string;
  };
  avatar: string;
}
