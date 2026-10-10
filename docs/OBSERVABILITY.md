# Observability, Monitoring & Health
## SignBridge AI Operational Metrics & Telemetry

### 1. Health & Readiness Probes
* **Endpoint**: `GET /api/v1/health`
* **Checks Conducted**:
  - API Gateway uptime & memory usage.
  - Database connectivity.
  - Sign language recognition adapter readiness.
  - Audio transcription provider status.
  - LLM provider status.
  - Avatar integration contract status.

---

### 2. Operational Metrics
Production telemetry tracks:
* **API Error Rate**: 4xx / 5xx error distributions.
* **Recognition Latency**: Time elapsed from video submission to gloss translation completion.
* **LLM Streaming Cadence**: Time to first token (TTFT) and total generation latency.
* **Upload Ingestion Rate**: Frequency and size distributions of incoming video assets.
* **Avatar Job Throughput**: State distribution of queued vs completed avatar jobs.

---

### 3. Log Scrubbing & Privacy Protection
* **No Biometric Data in Logs**: Video file buffers, frames, and audio waveforms are strictly excluded from application logs.
* **Token Redaction**: Authorization headers, Bearer tokens, and OAuth code parameters are scrubbed before writing to stdout.
* **Structured JSON Logging**: All server events output machine-parseable JSON logs formatted with ISO-8601 timestamps, request IDs, and error stack traces.
