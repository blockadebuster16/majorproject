import { NextRequest, NextResponse } from 'next/server';
import { getAvatarProvider } from '@/lib/adapters/avatar-provider';
import { serverDb } from '@/lib/services/server-db';
import { ApiResponse, AvatarJob } from '@/lib/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check DB first, then provider state
    let job = await serverDb.getAvatarJob(id);
    if (!job) {
      const avatarProvider = getAvatarProvider();
      job = await avatarProvider.getJobStatus(id);
    }

    if (!job) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'NOT_FOUND', message: 'Avatar job not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<AvatarJob>>({
      success: true,
      data: job,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'SERVER_ERROR', message: errorMessage } },
      { status: 500 }
    );
  }
}
