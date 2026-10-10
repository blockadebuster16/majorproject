import { NextRequest, NextResponse } from 'next/server';
import { getSignLanguageRecognizer } from '@/lib/adapters/sign-recognizer';
import { serverDb } from '@/lib/services/server-db';
import { DEFAULT_USER_PROFILE } from '@/lib/services/conversation-store';
import { ApiResponse, RecognitionJob, SupportedSignLanguage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;
    const body = await request.json().catch(() => ({}));

    const signLanguage: SupportedSignLanguage = body.signLanguage || 'ASL';
    const videoUrl = body.videoUrl;
    const conversationId = body.conversationId;

    const recognizer = getSignLanguageRecognizer();

    const jobId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const initialJob: RecognitionJob = {
      id: jobId,
      userId,
      conversationId,
      status: 'processing',
      modelVersion: recognizer.version,
      createdAt: now,
    };
    await serverDb.createRecognitionJob(initialJob);

    // Run inference adapter
    try {
      const result = await recognizer.recognize({
        videoUrl,
        signLanguage,
        mimeType: body.mimeType || 'video/webm',
        fileSizeBytes: body.fileSizeBytes,
      });

      const completedJob: RecognitionJob = {
        ...initialJob,
        status: 'completed',
        result,
        completedAt: new Date().toISOString(),
      };
      await serverDb.updateRecognitionJob(jobId, completedJob);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: completedJob,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Recognition failed';
      const failedJob: RecognitionJob = {
        ...initialJob,
        status: 'failed',
        errorCode: 'MODEL_INFERENCE_ERROR',
        errorMessage,
        completedAt: new Date().toISOString(),
      };
      await serverDb.updateRecognitionJob(jobId, failedJob);

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: { code: 'RECOGNITION_FAILED', message: errorMessage, details: failedJob },
        },
        { status: 422 }
      );
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'SERVER_ERROR', message: errorMessage } },
      { status: 500 }
    );
  }
}
