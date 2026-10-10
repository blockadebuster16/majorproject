// ============================================================================
// SignBridge AI - Comprehensive TypeScript Domain & API Contracts
// ============================================================================

export type UserRole = 'user' | 'assistant' | 'system';

export type InputModality = 'text' | 'audio' | 'video';

export type MessageStatus = 'pending' | 'streaming' | 'completed' | 'failed';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type SupportedSignLanguage = 'ASL' | 'BSL' | 'ISL' | 'Auslan' | 'LSF' | 'DGS';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  preferredSignLanguage: SupportedSignLanguage;
  reducedMotion: boolean;
  highContrast: boolean;
  autoSendRecognizedText: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  messageCount?: number;
}

export interface MessageMetadata {
  tokenCount?: number;
  modelVersion?: string;
  latencyMs?: number;
  recognitionJobId?: string;
  audioDurationSeconds?: number;
  videoDurationSeconds?: number;
  avatarJobId?: string;
  [key: string]: unknown;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: UserRole;
  content: string;
  inputModality: InputModality;
  status: MessageStatus;
  parentMessageId?: string;
  metadata?: MessageMetadata;
  createdAt: string;
  updatedAt: string;
  // Attached recognized gesture review state (if derived from video)
  recognitionResult?: RecognitionJobResult;
  // Attached audio transcript state (if derived from audio)
  audioTranscript?: string;
}

export interface RecognitionSegment {
  startTime: number;
  endTime: number;
  gloss: string;
  confidence: number;
}

export interface RecognitionJobResult {
  jobId: string;
  recognizedText: string;
  confidenceScore: number; // 0.0 to 1.0 calibrated score
  signLanguage: SupportedSignLanguage;
  modelVersion: string;
  processingDurationMs: number;
  segments: RecognitionSegment[];
  warnings: string[];
  keypointsDetected: {
    hands: boolean;
    face: boolean;
    pose: boolean;
  };
}

export interface RecognitionJob {
  id: string;
  userId: string;
  conversationId?: string;
  messageId?: string;
  status: JobStatus;
  modelVersion: string;
  result?: RecognitionJobResult;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AudioTranscriptionResult {
  transcript: string;
  durationSeconds: number;
  confidence: number;
  language: string;
}

export interface AvatarJobRequest {
  messageId: string;
  conversationId: string;
  responseText: string;
  targetSignLanguage: SupportedSignLanguage;
  speedMultiplier?: number;
}

export interface AvatarJob {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  provider: string;
  status: JobStatus;
  targetSignLanguage: SupportedSignLanguage;
  outputReference?: string; // Video URL or WebGL 3D keyframe spec
  previewAnimationType?: 'webgl_bones' | 'video_mp4';
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface UploadedMediaAsset {
  id: string;
  userId: string;
  fileName: string;
  mediaType: 'video' | 'audio';
  mimeType: string;
  sizeBytes: number;
  durationSeconds?: number;
  storageUrl: string;
  expiresAt: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
