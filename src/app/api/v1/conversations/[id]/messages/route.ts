import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/services/server-db';
import { DEFAULT_USER_PROFILE } from '@/lib/services/conversation-store';
import { getLLMProvider } from '@/lib/adapters/llm-provider';
import { ApiResponse, ChatMessage, InputModality, SupportedSignLanguage } from '@/lib/types';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await context.params;
    const userId = request.headers.get('x-user-id') || DEFAULT_USER_PROFILE.id;
    const body = await request.json();

    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const inputModality: InputModality = body.inputModality || 'text';
    const recognizedSignText = body.recognizedSignText;
    const audioTranscript = body.audioTranscript;
    const preferredSignLanguage: SupportedSignLanguage = body.preferredSignLanguage || 'ASL';

    if (!content && !recognizedSignText && !audioTranscript) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Message content is required' } },
        { status: 400 }
      );
    }

    // 1. Verify conversation exists
    const conv = await serverDb.getConversation(conversationId, userId);
    if (!conv) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const userMsgId = `msg_${Date.now()}_u`;

    // 2. Persist User Message
    const userMessage: ChatMessage = {
      id: userMsgId,
      conversationId,
      userId,
      role: 'user',
      content: content || recognizedSignText || audioTranscript || '',
      inputModality,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
      recognitionResult: body.recognitionResult,
      audioTranscript,
    };
    await serverDb.addMessage(userMessage);

    // 3. Assemble history and call LLM Provider
    const history = await serverDb.getMessages(conversationId, userId);
    const llm = getLLMProvider();

    const llmResponse = await llm.generateResponse({
      userMessage: userMessage.content,
      conversationHistory: history.slice(-8), // Window of recent messages
      recognizedSignText,
      audioTranscript,
      preferredSignLanguage,
    });

    // 4. Persist Assistant Response
    const assistantMsgId = `msg_${Date.now() + 1}_a`;
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      conversationId,
      userId: 'assistant',
      role: 'assistant',
      content: llmResponse.content,
      inputModality: 'text',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        tokenCount: llmResponse.tokenCount,
        latencyMs: llmResponse.latencyMs,
        modelVersion: llmResponse.modelVersion,
      },
    };
    await serverDb.addMessage(assistantMessage);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        userMessage,
        assistantMessage,
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: 'MESSAGE_SUBMISSION_FAILED', message: errorMessage } },
      { status: 500 }
    );
  }
}
