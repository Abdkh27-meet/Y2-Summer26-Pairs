/*
# Create chats and messages tables (single-tenant, no auth)

MEET Guide is a multi-agent AI chatbot with three guides (Entropo, CS, Kazuha).
No sign-in is required, so the app runs as the anon role for its whole lifetime.
Chat history is separated per guide via the `guide` column on chats.

1. New Tables
- `chats`
  - id (uuid, primary key)
  - guide (text, not null) — one of 'entropo' | 'cs' | 'kazuha'
  - title (text, not null) — auto-derived from first user message
  - created_at (timestamptz, default now())
  - updated_at (timestamptz, default now())
- `messages`
  - id (uuid, primary key)
  - chat_id (uuid, foreign key -> chats.id ON DELETE CASCADE)
  - role (text, not null) — 'user' | 'assistant'
  - content (text, not null)
  - created_at (timestamptz, default now())

2. Indexes
- index on chats(guide) for filtering the sidebar per guide
- index on messages(chat_id, created_at) for ordered message retrieval

3. Security
- RLS enabled on both tables.
- All CRUD open to anon + authenticated because the app is intentionally
  single-tenant / public (no sign-in screen). USING (true) is documented
  here as the intended public-sharing policy, not as a shortcut.
*/
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide text NOT NULL CHECK (guide IN ('entropo', 'cs', 'kazuha')),
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chats_guide ON chats(guide);
CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON messages(chat_id, created_at);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chats" ON chats;
CREATE POLICY "anon_select_chats" ON chats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chats" ON chats;
CREATE POLICY "anon_insert_chats" ON chats FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chats" ON chats;
CREATE POLICY "anon_update_chats" ON chats FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chats" ON chats;
CREATE POLICY "anon_delete_chats" ON chats FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_messages" ON messages;
CREATE POLICY "anon_select_messages" ON messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_messages" ON messages;
CREATE POLICY "anon_update_messages" ON messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_messages" ON messages;
CREATE POLICY "anon_delete_messages" ON messages FOR DELETE
  TO anon, authenticated USING (true);
