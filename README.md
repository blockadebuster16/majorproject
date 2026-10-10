# SignBridge AI
> **AI-Powered Sign Language Communication Platform**

SignBridge AI is an enterprise-grade multimodal web platform designed to eliminate communication barriers between Deaf and hard-of-hearing sign language users and hearing/non-signing individuals.

---

## 🌟 Key Features

### 1. Immersive Public Marketing Website (`/`)
* **Interactive Three.js 3D Experience**: Kinetic particle constellations depicting hand gesture geometries and neural signal fields, responsive to cursor movement and scroll position (inspired by high-end WebGL showcases like Shopify Editions Winter '26 - RenAIssance).
* **Graceful Fallbacks**: Seamless CSS/SVG fallback for non-WebGL environments and native support for `prefers-reduced-motion`.
* **Prominent Call to Action**: The primary **"Let's Get Started"** button dynamically checks user session state and routes to `/chat` or `/login`.
* **Comprehensive Storytelling**: Scrollytelling sections covering the problem statement, 5-stage architecture pipeline, multimodal breakdown, WCAG 2.2 AA accessibility, interactive live sandbox demo, future 3D avatar roadmap, and draft legal policies.

### 2. Authenticated Communication Workspace (`/chat`)
* **ChatGPT-Inspired Conversational UI**: Familiar, distraction-free interface with collapsible sidebar, conversation history, pinning, search, and session recovery.
* **Multimodal Composer**:
  - **Sign Language Video Ingestion**: Camera webcam stream or drag-and-drop video upload with duration and file-size validation (<50MB, <60s).
  - **PoseNet Landmark & Neural Recognition**: Analyzes 3D spatial keypoints across hands, face, and posture.
  - **Transparent Review & Edit Card**: Displays recognized glosses, calibrated confidence scores, and warnings, giving users total control to edit text before dispatching to the LLM.
  - **Spoken Audio Ingestion**: Browser Web Audio `MediaRecorder` stream with waveform visualizer and Whisper speech transcription.
  - **Direct Text**: Low-latency typing with auto-expanding composer, Enter-to-send, and Shift+Enter newline.
* **Conversational AI Orchestration**: Contextual LLM assistant with progressive token streaming, copy, and regenerate actions.
* **Future AI Avatar Action**: Dedicated **"Show in Sign Language"** button on assistant responses triggering a standard integration preview drawer and job lifecycle (`queued` -> `processing` -> `completed`).

### 3. Enterprise Security & Accessibility
* **WCAG 2.2 Level AA**: Full keyboard navigation, high-contrast themes, visible focus indicators, and screen reader semantic trees.
* **Ephemeral Media Retention**: Raw video assets are scheduled for automatic purge within 48 hours to protect sensitive visual biometric data.
* **Zero Client-Side Secret Leaks**: Provider API keys and database credentials reside exclusively on the server.
* **PostgreSQL Row Level Security (RLS)**: Enforces strict user-scoped data isolation.

---

## 🚀 Quick Start & Setup

### Prerequisites
* Node.js v20+ or v22+
* npm v10+
* (Optional) Docker & Docker Compose

### 1. Installation
```bash
# Clone the repository and navigate to root
cd "major project trial"

# Install dependencies
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```
*(The platform operates with high-fidelity dev sandboxes out-of-the-box even without external API keys).*

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Automated Tests
```bash
npm test
```
Executes unit and integration tests covering model adapters, audio transcription, conversational LLMs, avatar contracts, and database isolation.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🐳 Docker Deployment

Run the complete multi-container stack with Next.js and PostgreSQL:

```bash
docker compose up --build -d
```
Access the application at [http://localhost:3000](http://localhost:3000) and verify health at [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health).

---

## 🚀 Cloud Deployment (Vercel & Render)

SignBridge AI is configured for dynamic multi-host deployment:

* **Frontend (Vercel)**:
  * Deploy from GitHub repository with Next.js preset.
  * Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (auto-detected from `VERCEL_URL` if omitted).
  * Set `NEXT_PUBLIC_BACKEND_URL` to your hosted Render backend (e.g. `https://your-backend.onrender.com`).
* **Backend / ML Inference (Render)**:
  * Deploy as a Web Service on [Render](https://render.com).
  * Port binds dynamically via the platform's `$PORT` environment variable.
  * Set `SIGN_MODEL_ENDPOINT` to your inference cluster URL or backend service URL.
  * In local dev, backend points to `http://localhost:5000` when configured.

---

## 📚 Complete Project Documentation

| Document | Purpose |
|---|---|
| [Product Requirements](docs/PRODUCT_REQUIREMENTS.md) | Personas, scope, functional and non-functional requirements |
| [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Component diagrams, trust boundaries, multimodal data flows |
| [Database Schema](docs/DATABASE_SCHEMA.md) | Tables, relationships, indexes, migrations, and RLS policies |
| [API Specification](docs/API_SPECIFICATION.md) | Versioned REST endpoints, schemas, request/response examples |
| [AI Model Integration](docs/AI_INTEGRATION.md) | Sign recognition, Whisper transcription, LLM, and Avatar adapters |
| [Security & Threat Model](docs/SECURITY.md) | Threat modeling, OWASP controls, and media safety |
| [Privacy & Retention](docs/PRIVACY_AND_RETENTION.md) | Biometric data protection and 48-hour ephemeral purge policy |
| [Testing Strategy](docs/TESTING.md) | Test suite breakdown, coverage, and CI configuration |
| [Deployment & DevOps](docs/DEPLOYMENT.md) | Staging/Production environments, containerization, rollbacks |
| [Observability & Monitoring](docs/OBSERVABILITY.md) | Health probes, telemetry metrics, and log scrubbing |
| [Known Limitations](docs/KNOWN_LIMITATIONS.md) | Supported languages, physical constraints, and regulatory notices |
| [Future Avatar Integration](docs/AVATAR_INTEGRATION.md) | External 3D avatar microservice connection guide & API contract |
| [Operations Runbook](docs/OPERATIONS_RUNBOOK.md) | Incident response procedures and troubleshooting scenarios |
| [Architectural Decisions (ADR)](docs/DECISIONS.md) | Key engineering decisions and architectural rationale |

---

## ⚖️ License & Ethical AI Commitment
SignBridge AI is developed with accessibility, privacy, and linguistic integrity at its foundation. Sign languages are respected as complete, independent natural languages.
