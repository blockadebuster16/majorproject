# Security & Threat Model Specification
## SignBridge AI Security Architecture & OWASP Controls

### 1. Threat Modeling Overview
SignBridge AI handles sensitive visual gesture data, speech audio, and conversational interactions. Our threat modeling categorizes potential risks across:

| Threat Category | Potential Attack Vector | Applied Mitigation |
|---|---|---|
| **Biometric Exposure** | Video gesture intercept / persistent breach | Ephemeral retention (48h max), memory-only processing when possible, private non-public object storage. |
| **Insecure Direct Object Reference (IDOR)** | User queries another user's conversation ID | Server-side user identity verification on all `/api/v1/conversations/:id/*` endpoints + PostgreSQL Row-Level Security (`auth.uid() = user_id`). |
| **Prompt Injection** | User embeds malicious system override in recognized text | Strict separation between system prompts and user payloads; model outputs rendered as escaped markdown. |
| **Malicious File Upload** | Attacker uploads executable or malicious script disguised as video | Strict MIME type validation, file extension checks, 50MB size enforcement, isolated storage domains. |
| **API Abuse / DoS** | Automated scraping of expensive AI endpoints | Rate limiting on API routes, token limits on LLM completions, max duration caps on video/audio. |
| **Secret Exposure** | Leaking OpenAI or Supabase service keys to frontend | Zero server keys bundled in client code. Only `NEXT_PUBLIC_*` client credentials exposed. |

---

### 2. Authorization & Identity Enforcement
* **Authentication Boundary**: Managed via Supabase Auth / Google OAuth.
* **Server Verification**: In all Next.js API route handlers, authorization headers are extracted and verified before database interaction.
* **Database RLS Policies**: Even if an API route had a flaw, the PostgreSQL database rejects queries targeting conversations or media where `user_id != auth.uid()`.

---

### 3. Media Ingestion Security
* **Allowed MIME Formats**: `video/mp4`, `video/webm`, `video/quicktime`, `audio/webm`, `audio/wav`, `audio/mpeg`.
* **Max Payload Sizes**:
  - Video: 50 MB (capped at 60 seconds)
  - Audio: 20 MB (capped at 120 seconds)
* **Access Control**: Uploaded media links are served via short-lived signed URLs, preventing link enumeration.

---

### 4. Content Security Policy (CSP)
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' blob: data: https:; connect-src 'self' https://*.supabase.co https://api.openai.com; font-src 'self' data:;
```
