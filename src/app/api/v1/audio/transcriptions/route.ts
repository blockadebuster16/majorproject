import { NextRequest, NextResponse } from 'next/server';
import { getAudioTranscriptionProvider } from '@/lib/adapters/audio-transcription';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const audioUrl = body.audioUrl;
    const durationSeconds = body.durationSeconds;
    const language = body.language || 'en';

    const transcriber = getAudioTranscriptionProvider();
    const result = await transcriber.transcribe({
      audioUrl,
      durationSeconds,
      language,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'TRANSCRIPTION_FAILED', message: errorMessage } },
      { status: 500 }
    );
  }
}
