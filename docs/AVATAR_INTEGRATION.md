# Future AI Avatar Integration Guide
## Connecting an Independent 3D Signing Avatar Service

### 1. Overview
SignBridge AI provides complete architectural support for a bidirectional translation bridge. While the main platform translates sign gestures into text and conversational responses, this document specifies how an external 3D signing avatar microservice connects to SignBridge.

---

### 2. Integration Architecture
```
 [User clicks "Show in Sign Language"]
                   │
                   ▼
  POST /api/v1/avatar/jobs
                   │
                   ▼
  [SignBridge AvatarProvider] ──(HTTPS Webhook)──► [Independent Avatar Service]
                   │                                          │
                   │                                          ▼
                   │                              [3D Bone Animation Synthesis]
                   │                                          │
                   ◄────(Callback / Webhook / Poll)───────────┘
                   │
                   ▼
  [Client UI Displays 3D WebGL Avatar or Video Reference]
```

---

### 3. API Contract

#### Step 1: SignBridge Dispatches Request
* **Endpoint on External Avatar Provider**: `POST ${AVATAR_SERVICE_ENDPOINT}/v1/synthesize`
* **Headers**:
  - `Authorization: Bearer ${AVATAR_SERVICE_API_KEY}`
  - `Content-Type: application/json`
* **Request Payload**:
```json
{
  "jobId": "av_1710000000_abcde",
  "messageId": "msg_xxx",
  "conversationId": "conv_xxx",
  "text": "Hello, how can I help you?",
  "targetSignLanguage": "ASL",
  "speedMultiplier": 1.0,
  "outputFormat": "webgl_bones",
  "callbackUrl": "https://signbridge.ai/api/v1/avatar/callback"
}
```

#### Step 2: Avatar Service Processes Job
The external service immediately returns:
```json
{
  "status": "processing",
  "estimatedDurationSeconds": 3.2
}
```

#### Step 3: Callback or Polling
Once animation rigging is calculated, the avatar service posts back to `callbackUrl`:
```json
{
  "jobId": "av_1710000000_abcde",
  "status": "completed",
  "outputReference": "https://cdn.avatar-provider.com/animations/abcde.json",
  "durationSeconds": 4.1,
  "signLanguage": "ASL"
}
```

---

### 4. Replacing the Placeholder Implementation
To connect the live service:
1. Set `AVATAR_SERVICE_ENDPOINT` and `AVATAR_SERVICE_API_KEY` in `.env`.
2. In `src/lib/adapters/avatar-provider.ts`, instantiate `HttpAvatarProvider` pointing to the external endpoint.
3. The UI automatically displays the generated animation link in `AvatarPreviewModal`.
