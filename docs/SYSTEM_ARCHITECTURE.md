# System Architecture Specification
## AI-Powered Sign Language Communication Platform (SignBridge AI)

### 1. System Overview
SignBridge AI is designed with clean architectural boundaries separating the high-performance public marketing frontend, the conversational workspace, and the multimodal backend processing pipelines.

```
                           +-------------------------------------------------+
                           |                  Browser Client                 |
                           |  +--------------------+  +-------------------+  |
                           |  |  Public Marketing  |  |  Chat Workspace   |  |
                           |  |  (Three.js/Canvas) |  |  (/chat reactive) |  |
                           |  +--------------------+  +-------------------+  |
                           +------------------------|------------------------+
                                                    | HTTPS / WSS / API
                                                    v
                           +-------------------------------------------------+
                           |             Next.js 15+ Server Layer            |
                           |  +-------------------------------------------+  |
                           |  | API Gateway & Server Actions (/api/v1/*)  |  |
                           |  | - Auth & Session Guard (JWT / Cookies)    |  |
                           |  | - Rate Limiting & Input Validation (Zod)  |  |
                           |  | - Security Headers & CORS Enforcement     |  |
                           |  +-------------------------------------------+  |
                           +--------|--------------|----------------|--------+
                                    |              |                |
             +----------------------+              |                +-----------------------+
             v                                     v                                        v
+------------------------+      +---------------------+      +-----------------------------------+
| Multi-Modal Ingestion  |      |   Data Persistence  |      |         AI Model Adapters         |
| - Audio Stream/Upload  |      | - Supabase/Postgres |      |  +-----------------------------+  |
| - Video Frame Validator|      |   (Profiles, Conv,  |      |  | SignLanguageRecognizer      |  |
| - Private Media Buffer |      |    Messages, Jobs)  |      |  +-----------------------------+  |
| - Auto-Expiry Worker   |      | - Row-Level Security|      |  | AudioTranscriptionProvider  |  |
+------------------------+      | - Private S3/Storage|      |  +-----------------------------+  |
                                +---------------------+      |  | LLMProvider (Streaming)     |  |
                                                             |  +-----------------------------+  |
                                                             |  | AvatarProvider (Future Spec)|  |
                                                             |  +-----------------------------+  |
                                                             +-----------------------------------+
```

---

### 2. Trust Boundaries & Security Architecture
* **Untrusted Zone**: Browser client, public internet, incoming file uploads (WebM, MP4, WAV, MP3).
* **DMZ / Gateway Zone**: Next.js App Router API Routes (`/api/v1/*`). All payloads validated with Zod, sanitized against injection attacks, rate-limited by IP/user token.
* **Trusted Zone**: Server-side execution environment with protected environment variables (Supabase Service Role, OpenAI/Anthropic/Gemini API keys, Model Worker tokens).
* **Media Storage Isolation**: Media files are stored in private, unguessable storage buckets with short-lived signed URLs. Media is purged after the recognition job lifecycle or retention window.

---

### 3. Multimodal Pipeline Architecture

#### A. Video -> Sign Recognition Pipeline
```
[User Camera / Upload]
         │ (WebM/MP4)
         ▼
[Client Pre-flight Check: Duration < 60s, Size < 50MB, MIME Check]
         │ POST /api/v1/media/uploads
         ▼
[Server-side Validation & Job Creation: Status = 'queued']
         │ Job ID: rec_xxx
         ▼
[SignLanguageRecognizer Adapter Pipeline]
  ├── Frame Extraction / Landmark Detection
  ├── Temporal Pose Sequence Analysis
  └── Gesture Classification & Confidence Scoring
         │
         ▼
[Database Persistence: Status = 'completed', recognized_text, confidence]
         │ GET /api/v1/recognition/jobs/:id (or SSE stream)
         ▼
[UI Recognition Card: Display Transcript + Confidence + Warnings]
         │ (User reviews / modifies text)
         ▼
[User Clicks "Send to AI"] ──► Dispatches to LLM Pipeline
```

#### B. Audio -> Speech Transcription Pipeline
```
[Browser MediaRecorder (WAV/WebM)]
         │
         ▼
[POST /api/v1/audio/transcriptions]
         │
         ▼
[AudioTranscriptionProvider Adapter (Whisper / Cloud / Local)]
         │
         ▼
[Transcription Displayed in Composer for Review/Edit]
```

#### C. LLM Orchestration Pipeline
```
[Consolidated Context: History (Windowed) + User Input / Recognized Sign]
         │
         ▼
[LLMProvider.generateResponse(request)]
         │
         ├── Server-side System Prompt: Accessible communication assistant
         ├── Stream progressive tokens via Server-Sent Events (SSE) / ReadableStream
         └── On completion: Persist assistant message in PostgreSQL
```

#### D. Future AI Avatar Architecture
```
[Assistant Response in UI] ──► User clicks "Show in Sign Language"
         │
         ▼
[POST /api/v1/avatar/jobs]
         │ Payload: { message_id, text, target_language: 'ASL' | 'BSL' | 'ISL' }
         ▼
[AvatarProvider.generateFromText(request)]
         ├── Job Status: queued ──► processing ──► completed
         ├── Output Reference: Secure URL / WebGL rig keyframes / Video stream
         └── UI displays Avatar Preview Container with state machine & fallback
```
