import type { AudioTranscriptionResult } from '../types/index.ts';

export interface AudioTranscriptionInput {
  audioUrl?: string;
  audioBuffer?: Buffer | ArrayBuffer;
  audioBlob?: Blob;
  mimeType?: string;
  durationSeconds?: number;
  language?: string;
}

export interface IAudioTranscriptionProvider {
  readonly providerName: string;
  transcribe(input: AudioTranscriptionInput): Promise<AudioTranscriptionResult>;
}

export class DevAudioTranscriptionProvider implements IAudioTranscriptionProvider {
  readonly providerName = 'SignBridge-Dev-WhisperEngine';

  async transcribe(input: AudioTranscriptionInput): Promise<AudioTranscriptionResult> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const sampleTranscripts = [
      'Hello there! I am speaking into the microphone to ask if we can discuss the project milestone.',
      'Could you repeat that in sign language so my colleague can understand the requirements?',
      'Thank you for demonstrating this communication bridge. The accessibility features are impressive.',
      'Can you help me summarize the main takeaways from our conversation?',
    ];

    const transcript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];

    return {
      transcript,
      durationSeconds: input.durationSeconds || 3.4,
      confidence: 0.965,
      language: input.language || 'en',
    };
  }
}

export class WhisperAudioTranscriptionProvider implements IAudioTranscriptionProvider {
  readonly providerName = 'OpenAI-Whisper-v3';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribe(input: AudioTranscriptionInput): Promise<AudioTranscriptionResult> {
    if (!input.audioBuffer && !input.audioUrl) {
      throw new Error('Audio payload is missing');
    }

    const formData = new FormData();
    if (input.audioBuffer) {
      const bytes = new Uint8Array(input.audioBuffer as ArrayBuffer) as unknown as BlobPart;
      const blob = new Blob([bytes], { type: input.mimeType || 'audio/webm' });
      formData.append('file', blob, 'recording.webm');
    }
    formData.append('model', 'whisper-1');
    formData.append('language', input.language || 'en');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Whisper transcription failed: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      transcript: data.text,
      durationSeconds: input.durationSeconds || 0,
      confidence: 0.98,
      language: input.language || 'en',
    };
  }
}

export function getAudioTranscriptionProvider(): IAudioTranscriptionProvider {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    return new WhisperAudioTranscriptionProvider(apiKey);
  }
  return new DevAudioTranscriptionProvider();
}
