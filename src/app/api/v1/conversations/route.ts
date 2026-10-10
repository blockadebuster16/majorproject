import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/services/server-db';
import { DEFAULT_USER_PROFILE } from '@/lib/services/conversation-store';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;
    const conversations = await serverDb.listConversations(userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: conversations,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message: errorMessage },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;
    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' ? body.title : 'New Conversation';

    const conv = await serverDb.createConversation(userId, title);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: conv,
    }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: { code: 'CREATION_FAILED', message: errorMessage },
      },
      { status: 500 }
    );
  }
}
