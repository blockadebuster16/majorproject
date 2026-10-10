import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/services/server-db';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const job = await serverDb.getRecognitionJob(id);

    if (!job) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'NOT_FOUND', message: 'Recognition job not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
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
