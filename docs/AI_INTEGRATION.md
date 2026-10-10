# AI Model & Service Integration Architecture
## SignBridge AI Multimodal Integration Layer

### 1. Architectural Principles
1. **Decoupled Adapters**: No vendor-locking or direct SDK binding in UI components.
2. **Deterministic Fallbacks**: If external API credentials are not set, the platform transitions gracefully into local sandboxed providers without throwing uncaught exceptions.
3. **Calibrated Confidence**: Confidence scores are reported transparently without fabricating false accuracy.
4. **Human-in-the-Loop Review**: Derived gesture transcripts must always be editable by the user before conversational LLM processing.

---

### 2. Sign Language Recognition Adapter (`ISignLanguageRecognizer`)
* **Interface**:
```typescript
export interface ISignLanguageRecognizer {
  readonly version: string;
  readonly supportedLanguages: SupportedSignLanguage[];
  recognize(input: SignRecognitionInput): Promise<RecognitionJobResult>;
}
```
* **Supported Languages**: American Sign Language (`ASL`), British Sign Language (`BSL`), Irish Sign Language (`ISL`), Australian Sign Language (`Auslan`), French Sign Language (`LSF`), German Sign Language (`DGS`).
* **Output Payload Structure**:
  - `recognizedText`: Grammatically smoothed translation sentence.
  - `confidenceScore`: Calibrated probability (0.0 to 1.0).
  - `segments`: Time-coded individual sign glosses (`[startTime, endTime, gloss, confidence]`).
  - `keypointsDetected`: Flags verifying 3D tracking of hands, face, and posture.
  - `warnings`: Environmental feedback (e.g. poor lighting, motion blur).
* **Pluggable Providers**:
  - `DevSignLanguageRecognizer`: High-fidelity sandbox emulator for local offline testing.
  - `HttpSignLanguageRecognizer`: Microservice client connecting to Python PyTorch/TensorFlow inference clusters via `SIGN_MODEL_ENDPOINT`.

---

### 3. Audio Transcription Provider (`IAudioTranscriptionProvider`)
* **Interface**:
```typescript
export interface IAudioTranscriptionProvider {
  readonly providerName: string;
  transcribe(input: AudioTranscriptionInput): Promise<AudioTranscriptionResult>;
}
```
* **Pluggable Providers**:
  - `DevAudioTranscriptionProvider`: Local dev sandbox.
  - `WhisperAudioTranscriptionProvider`: OpenAI Whisper-v3 integration via HTTP multipart endpoint.

---

### 4. Conversational LLM Engine (`ILLMProvider`)
* **Interface**:
```typescript
export interface ILLMProvider {
  readonly providerName: string;
  generateResponse(options: LLMRequestOptions): Promise<LLMResponse>;
  streamResponse(options: LLMRequestOptions, onChunk: (chunk: string) => void): Promise<LLMResponse>;
}
```
* **Context Assembly Rules**:
  - Injects system prompt ensuring empathetic, accessible, plain-language formatting.
  - Passes recognized sign language gloss distinctly from conversational prompt history.
  - Bounds previous message context to the last 8 messages to prevent context overflow.

---

### 5. Future AI Avatar Service Contract (`IAvatarProvider`)
* **Interface**:
```typescript
export interface IAvatarProvider {
  readonly providerName: string;
  readonly isServiceConfigured: boolean;
  generateFromText(request: AvatarJobRequest): Promise<AvatarJob>;
  getJobStatus(jobId: string): Promise<AvatarJob | null>;
}
```
* **Status Lifecycle**: `queued` ➔ `processing` ➔ `completed` | `failed`.
* Detailed integration guide available in `docs/AVATAR_INTEGRATION.md`.
