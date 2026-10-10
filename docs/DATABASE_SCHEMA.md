# Database Schema & RLS Security Specification
## SignBridge AI Data Architecture (PostgreSQL / Supabase)

### 1. Schema Entity Relationship

```
 +-------------------------------------------------------------------+
 |                              profiles                             |
 |-------------------------------------------------------------------|
 | id: uuid (PK, references auth.users.id)                           |
 | display_name: text                                                |
 | avatar_url: text                                                  |
 | preferred_sign_language: text (default: 'ASL')                    |
 | reduced_motion: boolean (default: false)                          |
 | high_contrast: boolean (default: false)                           |
 | created_at: timestamptz                                           |
 | updated_at: timestamptz                                           |
 +---------------------------------+---------------------------------+
                                   | 1
                                   |
                                   | N
 +---------------------------------v---------------------------------+
 |                           conversations                           |
 |-------------------------------------------------------------------|
 | id: uuid (PK)                                                     |
 | user_id: uuid (FK -> profiles.id)                                 |
 | title: text                                                       |
 | is_pinned: boolean (default: false)                               |
 | last_message_at: timestamptz                                      |
 | created_at: timestamptz                                           |
 | updated_at: timestamptz                                           |
 | deleted_at: timestamptz (nullable, soft-delete)                   |
 +---------------------------------+---------------------------------+
                                   | 1
                                   |
                                   | N
 +---------------------------------v---------------------------------+
 |                             messages                              |
 |-------------------------------------------------------------------|
 | id: uuid (PK)                                                     |
 | conversation_id: uuid (FK -> conversations.id)                   |
 | user_id: uuid (FK -> profiles.id)                                 |
 | role: text ('user' | 'assistant' | 'system')                      |
 | content: text                                                     |
 | input_modality: text ('text' | 'audio' | 'video')                 |
 | status: text ('pending' | 'streaming' | 'completed' | 'failed')   |
 | parent_message_id: uuid (nullable, FK -> messages.id)             |
 | metadata: jsonb (e.g., token usage, model version)                |
 | created_at: timestamptz                                           |
 | updated_at: timestamptz                                           |
 +--------------+----------------------------------+----------------+
                | 1                                | 1
                |                                  |
                v N                                v N
 +------------------------------+   +------------------------------+
 |         media_assets         |   |       recognition_jobs       |
 |------------------------------|   |------------------------------|
 | id: uuid (PK)                |   | id: uuid (PK)                |
 | user_id: uuid (FK)           |   | user_id: uuid (FK)           |
 | conversation_id: uuid (FK)   |   | conversation_id: uuid (FK)   |
 | message_id: uuid (FK)        |   | message_id: uuid (FK)        |
 | storage_key: text            |   | model_version: text          |
 | media_type: text             |   | status: text                 |
 | size_bytes: bigint           |   | recognized_text: text        |
 | duration_seconds: numeric    |   | confidence_score: numeric    |
 | processing_status: text      |   | result_metadata: jsonb       |
 | expires_at: timestamptz      |   | error_code: text             |
 | created_at: timestamptz      |   | created_at: timestamptz      |
 +------------------------------+   | completed_at: timestamptz    |
                                    +------------------------------+
                                                   | 1
                                                   | 1
                                    +--------------v---------------+
                                    |         avatar_jobs          |
                                    |------------------------------|
                                    | id: uuid (PK)                |
                                    | user_id: uuid (FK)           |
                                    | conversation_id: uuid (FK)   |
                                    | message_id: uuid (FK)        |
                                    | provider: text               |
                                    | status: text                 |
                                    | target_sign_language: text   |
                                    | output_reference: text       |
                                    | error_code: text             |
                                    | created_at: timestamptz      |
                                    | completed_at: timestamptz    |
                                    +------------------------------+
```

---

### 2. Indexes for High-Concurrency Performance
```sql
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at ASC);
CREATE INDEX idx_media_assets_user_expires ON media_assets(user_id, expires_at);
CREATE INDEX idx_recognition_jobs_user_status ON recognition_jobs(user_id, status);
CREATE INDEX idx_avatar_jobs_user_status ON avatar_jobs(user_id, status);
```

---

### 3. Row-Level Security (RLS) Policies
Every table is secured with `ENABLE ROW LEVEL SECURITY;`. Users can only select, insert, update, or delete rows where `user_id = auth.uid()`.

```sql
-- Conversations RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can soft-delete own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);
```
