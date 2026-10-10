import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, UploadedMediaAsset } from '@/lib/types';
import { DEFAULT_USER_PROFILE } from '@/lib/services/conversation-store';

const ALLOWED_MIME_TYPES = new Set([
  'video/webm',
  'video/mp4',
  'video/quicktime',
  'audio/webm',
  'audio/wav',
  'audio/mpeg',
  'audio/ogg',
]);

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mediaType = formData.get('mediaType') as 'video' | 'audio' || 'video';

    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'FILE_MISSING', message: 'No file provided in form data.' } },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_MIME_TYPE',
            message: `Unsupported file format '${file.type}'. Allowed formats: MP4, WebM, WAV, MP3, QuickTime.`,
          },
        },
        { status: 415 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: `File size exceeds the 50MB maximum limit.`,
          },
        },
        { status: 413 }
      );
    }

    const assetId = `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + 86400000 * 2).toISOString(); // 48h ephemeral retention

    const asset: UploadedMediaAsset = {
      id: assetId,
      userId,
      fileName: file.name,
      mediaType,
      mimeType: file.type,
      sizeBytes: file.size,
      storageUrl: `/media-cache/${assetId}/${file.name}`,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<UploadedMediaAsset>>({
      success: true,
      data: asset,
    }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'UPLOAD_FAILED', message: errorMessage } },
      { status: 500 }
    );
  }
}
