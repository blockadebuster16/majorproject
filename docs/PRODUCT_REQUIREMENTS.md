# Product Requirements Document (PRD)
## AI-Powered Sign Language Communication Platform (SignBridge AI)

### 1. Vision & Purpose
SignBridge AI is an enterprise-grade multimodal web platform designed to eliminate communication barriers between Deaf and hard-of-hearing sign language users and hearing/non-signing individuals. 

The platform offers two interconnected, distinct experiences:
1. **Public Marketing Experience (`/`)**: An immersive, interactive 3D web experience inspired by cutting-edge WebGL/Three.js digital showcases (such as Shopify Editions Winter '26 - RenAIssance). It visually demonstrates the transition of kinetic gesture signals into unified semantic language and conversational AI understanding.
2. **Authenticated AI Communication Application (`/chat`)**: A focused, distraction-free, ChatGPT-inspired conversational workspace that seamlessly supports video, audio, and text input, translating sign gestures, transcribing speech, and generating contextual conversational intelligence.

---

### 2. Core Personas
* **Sign Language Communicator (Deaf / Hard-of-Hearing)**: Expresses thoughts via sign language gestures recorded or uploaded via webcam/mobile video. Needs accurate gesture recognition, transparent transcription review/editing, and the ability to bridge conversations with hearing peers or AI.
* **Hearing/Non-Signing Communicator**: Communicates via speech (audio input) or typed text. Receives instant transcriptions of sign language and generates spoken or textual responses.
* **Accessibility Coordinator / Enterprise Admin**: Requires strict data protection, audit logs, verifiable accessibility (WCAG 2.2 AA), and compliance with privacy standards for biometric gesture video.

---

### 3. Scope & Boundaries

#### A. Implemented Now (Production Baseline)
* **Interactive 3D Marketing Landing Page**: 
  - Kinetic Three.js spatial canvas with interactive particles, gesture nodes, and light fields responsive to cursor.
  - Prominent "Let's Get Started" CTA routing authenticated users to `/chat` and unauthenticated users to `/login`.
  - Comprehensive scrollytelling sections: Product Introduction, How It Works, Multimodal Pipeline, Accessibility & Inclusion, Interactive Live Preview, Future AI Avatar Vision, and Final CTA.
  - High-performance graceful fallbacks for WebGL failure and `prefers-reduced-motion`.
* **Authenticated Chat Workspace (`/chat`)**:
  - Collapsible sidebar with conversation history, search, new chat, and user preferences.
  - Multiline expandable composer with desktop Enter-to-send and Shift+Enter newline.
  - Live Audio Recording via Web Audio / MediaRecorder API with audio waveform, duration timer, playback preview, and transcription pipeline.
  - Video Recording & File Upload with camera capture, drag-and-drop file upload, MIME/size validation, and client-side preview.
  - Dedicated Sign Language Recognition pipeline with an asynchronous job state machine (`queued` -> `processing` -> `completed` / `failed`).
  - Transparent Recognition Review card: Recognized gestures displayed distinctly from LLM output, with user review, editing, and explicit "Send to AI" action.
  - Provider-agnostic LLM orchestration layer supporting progressive text streaming, markdown formatting, copy/regenerate actions, and error handling.
  - Future AI Avatar Action: "Show in Sign Language" button on assistant responses with standard integration contracts, job lifecycles, and a clear preview modal.
  - Google OAuth and secure session management via Supabase Auth.
  - PostgreSQL schema migrations, Row Level Security (RLS) policies, and private media storage architecture.

#### B. Future AI Avatar Integration Contract (Architecture Ready)
* The actual 3D signing avatar model/rigging is hosted and managed independently.
* Full API contracts (`POST /api/v1/avatar/jobs`, `GET /api/v1/avatar/jobs/:id`), provider adapter (`AvatarProvider`), lifecycle states, and client UI are implemented.
* Clearly labeled demonstration / integration status is presented without falsely claiming working avatar generation.

#### C. Out-of-Scope (Boundaries)
* Proprietary avatar rigging / animation training.
* Training new raw deep learning model weights from scratch.
* Making unverified claims of 100% universal translation accuracy across all sign languages.

---

### 4. Non-Functional Requirements
* **Accessibility**: Compliant with WCAG 2.2 Level AA guidelines. Full keyboard navigation, ARIA live announcements for async recognition states, visible focus states, high-contrast support, screen reader compatibility.
* **Security & Privacy**: Zero client-side exposure of secret keys. Strict server-side authorization for all conversations and media. Temporary video retention with automatic expiry. Content Security Policy, OWASP compliance, and rate limiting.
* **Performance**: First Contentful Paint < 1.2s, Three.js frame rate capped with dynamic DPR (max 2.0) and throttling off-screen.
