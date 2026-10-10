# API Specification (v1)
## SignBridge AI REST API Reference

All requests and responses use JSON format (`application/json`) except file uploads (`multipart/form-data`).

### Base URL
`/api/v1`

---

### Standard Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {}
  }
}
```

---

### Endpoints

#### 1. System Health
* **Endpoint**: `GET /api/v1/health`
* **Auth**: Public
* **Description**: Verifies liveness and readiness of API gateway, persistence, and model adapters.
* **Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-03-01T12:00:00Z",
    "version": "1.0.0",
    "services": {
      "api": { "status": "up" },
      "database": { "status": "up" },
      "signRecognizer": { "status": "ready" },
      "audioTranscription": { "status": "ready" },
      "llmEngine": { "status": "ready" },
      "avatarBridge": { "status": "contract_ready" }
    }
  }
}
```

#### 2. Conversations
* **List Conversations**: `GET /api/v1/conversations`
  - **Headers**: `x-user-id` (or session cookie)
  - **Returns**: Array of `Conversation` objects owned by user.
* **Create Conversation**: `POST /api/v1/conversations`
  - **Body**: `{ "title": "Optional Title" }`
  - **Status**: 201 Created
* **Get Conversation Detail**: `GET /api/v1/conversations/:id`
  - **Returns**: `{ conversation: Conversation, messages: ChatMessage[] }`
* **Rename Conversation**: `PATCH /api/v1/conversations/:id`
  - **Body**: `{ "title": "Updated Title", "isPinned": true }`
* **Delete Conversation**: `DELETE /api/v1/conversations/:id`
  - **Status**: 200 OK (soft/hard deleted)

#### 3. Messages & LLM Generation
* **Submit Message**: `POST /api/v1/conversations/:id/messages`
  - **Body**:
```json
{
  "content": "Hello, how can I use this tool?",
  "inputModality": "text",
  "recognizedSignText": "HELLO USE HOW",
  "audioTranscript": null,
  "preferredSignLanguage": "ASL"
}
```
  - **Returns**: `{ userMessage: ChatMessage, assistantMessage: ChatMessage }`

#### 4. Sign Language Recognition
* **Create Recognition Job**: `POST /api/v1/recognition/jobs`
  - **Body**:
```json
{
  "videoUrl": "blob:http://...",
  "signLanguage": "ASL",
  "mimeType": "video/webm"
}
```
  - **Returns**: `RecognitionJob` with populated `result` (gloss segments, confidence score, warnings).
* **Get Job Status**: `GET /api/v1/recognition/jobs/:id`

#### 5. Audio Transcription
* **Transcribe Audio**: `POST /api/v1/audio/transcriptions`
  - **Body**: `{ "durationSeconds": 4.5, "language": "en" }`
  - **Returns**: `{ transcript: string, confidence: number, durationSeconds: number }`

#### 6. Future AI Avatar Jobs
* **Create Avatar Job**: `POST /api/v1/avatar/jobs`
  - **Body**:
```json
{
  "messageId": "msg_xxx",
  "conversationId": "conv_xxx",
  "responseText": "Thank you for communicating.",
  "targetSignLanguage": "ASL"
}
```
  - **Status**: 202 Accepted
  - **Returns**: `AvatarJob` with `status: 'queued'`
* **Get Avatar Job Status**: `GET /api/v1/avatar/jobs/:id`
  - **Returns**: `AvatarJob` with current lifecycle state (`queued` -> `processing` -> `completed`).

#### 7. Media Ingestion
* **Upload Media**: `POST /api/v1/media/uploads`
  - **Content-Type**: `multipart/form-data`
  - **Form Fields**: `file` (binary), `mediaType` ('video' | 'audio')
  - **Validation**: Rejects files > 50MB or unlisted MIME types.
