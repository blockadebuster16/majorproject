import { NextRequest, NextResponse } from 'next/server';
import { getAvatarProvider } from '@/lib/adapters/avatar-provider';
import { serverDb } from '@/lib/services/server-db';
import { DEFAULT_USER_PROFILE } from '@/lib/services/conversation-store';
import { ApiResponse, AvatarJob, AvatarJobRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;
    const body = await request.json().catch(() => ({}));

    if (!body.responseText || !body.messageId || !body.conversationId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'responseText, messageId, and conversationId are required to initiate an avatar job.',
          },
        },
        { status: 400 }
      );
    }

    const avatarProvider = getAvatarProvider();
    const avatarReq: AvatarJobRequest = {
      messageId: body.messageId,
      conversationId: body.conversationId,
      responseText: body.responseText,
      targetSignLanguage: body.targetSignLanguage || 'ASL',
      speedMultiplier: body.speedMultiplier || 1.0,
    };

    const job = await avatarProvider.generateFromText(avatarReq);
    await serverDb.createAvatarJob(job);

    return NextResponse.json<ApiResponse<AvatarJob>>(
      {
        success: true,
        data: job,
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'AVATAR_JOB_ERROR', message: errorMessage } },
      { status: 500 }
    );
  }
}
