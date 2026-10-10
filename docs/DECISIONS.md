# Architectural Decision Records (ADR)
## SignBridge AI Engineering Log

### ADR 001: Next.js App Router for Unified Frontend & API Boundary
* **Status**: Accepted
* **Context**: The platform requires an immersive public marketing landing page (Three.js) alongside an authenticated conversational workspace (`/chat`) and secure server-side API endpoints (`/api/v1/*`).
* **Decision**: Adopt Next.js 16 (App Router) with React 19. It provides server components for fast public SEO rendering, client components for high-framerate WebGL rendering, and zero-leak server-side API routes for private keys and database operations.

---

### ADR 002: Decoupled Multimodal Processing Pipelines
* **Status**: Accepted
* **Context**: Video recognition models, speech transcription models, and conversational LLMs have different throughputs, latency profiles, and failure modes.
* **Decision**: Audio and text must NEVER depend on the video recognition pipeline. Each modality has an isolated adapter (`SignLanguageRecognizer`, `AudioTranscriptionProvider`, `LLMProvider`) converging on a unified conversation and message data model.

---

### ADR 003: Human-in-the-Loop Review for Recognized Sign Language
* **Status**: Accepted
* **Context**: Sign language translation models can produce ambiguity under poor lighting, rapid signing, or dialectal variation. Directly feeding raw recognition into an LLM can misrepresent user intent.
* **Decision**: All recognized gestures are rendered in an editable review card with confidence score and warnings before user confirmation and LLM dispatch (with an optional auto-forward toggle for expert users).

---

### ADR 004: Clean Separation for Future 3D AI Signing Avatar
* **Status**: Accepted
* **Context**: The project owner manages the 3D avatar independently. Building fake or hardcoded avatar animations would be misleading and architecturally fragile.
* **Decision**: Implement a full provider abstraction (`AvatarProvider`), job lifecycle (`queued` -> `processing` -> `completed`), API contracts, and an action button "Show in Sign Language" with an integration preview modal and complete integration guide.
