import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/services/server-db';
import { DEFAULT_USER_PROFILE } from '@/lib/services/conversation-store';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;

    const conv = await serverDb.getConversation(id, userId);
    if (!conv) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } },
        { status: 404 }
      );
    }

    const messages = await serverDb.getMessages(id, userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        conversation: conv,
        messages,
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'SERVER_ERROR', message: errorMessage } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;
    const body = await request.json().catch(() => ({}));

    const updated = await serverDb.updateConversation(id, userId, {
      title: body.title,
      isPinned: body.isPinned,
    });

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updated,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'UPDATE_FAILED', message: errorMessage } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;

    const ok = await serverDb.deleteConversation(id, userId);
    if (!ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id, deleted: true },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'DELETE_FAILED', message: errorMessage } },
      { status: 500 }
    );
  }
}
