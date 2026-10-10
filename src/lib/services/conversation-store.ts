import type {
  ChatMessage,
  Conversation,
  UserProfile,
  RecognitionJob,
  AvatarJob,
  SupportedSignLanguage,
} from '../types/index.ts';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_demo_882',
  email: 'alex.chen@signbridge.ai',
  displayName: 'Alex Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  preferredSignLanguage: 'ASL',
  reducedMotion: false,
  highContrast: false,
  autoSendRecognizedText: false,
  createdAt: '2026-01-15T08:00:00Z',
  updatedAt: '2026-03-01T12:00:00Z',
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_intro_1',
    userId: DEFAULT_USER_PROFILE.id,
    title: 'Sign Language Introduction & Live Test',
    isPinned: true,
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:05:00.000Z',
    lastMessageAt: '2026-03-01T08:05:00.000Z',
    messageCount: 4,
  },
  {
    id: 'conv_multimodal_2',
    userId: DEFAULT_USER_PROFILE.id,
    title: 'Multimodal Workplace Meeting Notes',
    isPinned: false,
    createdAt: '2026-02-28T14:00:00.000Z',
    updatedAt: '2026-02-28T14:10:00.000Z',
    lastMessageAt: '2026-02-28T14:10:00.000Z',
    messageCount: 2,
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  conv_intro_1: [
    {
      id: 'msg_1',
      conversationId: 'conv_intro_1',
      userId: DEFAULT_USER_PROFILE.id,
      role: 'user',
      content: 'Hello! I am testing this platform with American Sign Language video.',
      inputModality: 'video',
      status: 'completed',
      createdAt: '2026-03-01T08:00:00.000Z',
      updatedAt: '2026-03-01T08:00:00.000Z',
      recognitionResult: {
        jobId: 'rec_init_9182',
        recognizedText: 'Hello! I am testing this platform with American Sign Language video.',
        confidenceScore: 0.954,
        signLanguage: 'ASL',
        modelVersion: 'SignBridge-PoseNet-v2.4-Transformer',
        processingDurationMs: 1340,
        segments: [
          { startTime: 0.0, endTime: 0.8, gloss: 'HELLO', confidence: 0.98 },
          { startTime: 0.9, endTime: 1.6, gloss: 'TEST-PLATFORM', confidence: 0.94 },
          { startTime: 1.7, endTime: 2.8, gloss: 'ASL-VIDEO', confidence: 0.95 },
        ],
        warnings: ['Hands fully tracked across all 60fps keyframes.'],
        keypointsDetected: { hands: true, face: true, pose: true },
      },
    },
    {
      id: 'msg_2',
      conversationId: 'conv_intro_1',
      userId: 'assistant',
      role: 'assistant',
      content:
        'Welcome! Your sign language input was clearly recognized with **95.4% confidence** in ASL.\n\nSignBridge is built to facilitate two-way communication:\n- You can record gestures or upload signing videos anytime.\n- Hearing communicators can speak via the microphone or type directly.\n- You can also click **"Show in Sign Language"** below to view how responses can be translated back into signs.\n\nWhat would you like to explore next?',
      inputModality: 'text',
      status: 'completed',
      createdAt: '2026-03-01T08:01:00.000Z',
      updatedAt: '2026-03-01T08:01:00.000Z',
      metadata: {
        tokenCount: 78,
        latencyMs: 820,
        modelVersion: 'SignBridge-Cognitive-Engine-v1',
      },
    },
  ],
  conv_multimodal_2: [
    {
      id: 'msg_3',
      conversationId: 'conv_multimodal_2',
      userId: DEFAULT_USER_PROFILE.id,
      role: 'user',
      content: 'Could you give me a summary of our team accessibility action items?',
      inputModality: 'audio',
      audioTranscript: 'Could you give me a summary of our team accessibility action items?',
      status: 'completed',
      createdAt: '2026-02-28T14:00:00.000Z',
      updatedAt: '2026-02-28T14:00:00.000Z',
    },
    {
      id: 'msg_4',
      conversationId: 'conv_multimodal_2',
      userId: 'assistant',
      role: 'assistant',
      content:
        '### Accessibility Action Items Summary\n\n1. **Sign Language Recognition**: Integrate custom keypoint detection pipeline with real-time pose validation.\n2. **Review Stage**: Keep a dedicated transcription review card before dispatching queries to the LLM.\n3. **Bidirectional Bridge**: Establish standardized contracts for future 3D AI avatar animation output.',
      inputModality: 'text',
      status: 'completed',
      createdAt: '2026-02-28T14:02:00.000Z',
      updatedAt: '2026-02-28T14:02:00.000Z',
    },
  ],
};
