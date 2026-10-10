import test from 'node:test';
import assert from 'node:assert/strict';

// Test DevSignLanguageRecognizer
test('Sign Language Recognizer Adapter - Basic & Multi-Language Inference', async (t) => {
  // Dynamic import of compiled adapter or direct simulation
  const { DevSignLanguageRecognizer } = await import('../src/lib/adapters/sign-recognizer.ts');
  const recognizer = new DevSignLanguageRecognizer();

  assert.equal(recognizer.version, 'SignBridge-PoseNet-v2.4-Transformer');
  assert.ok(recognizer.supportedLanguages.includes('ASL'));
  assert.ok(recognizer.supportedLanguages.includes('BSL'));

  const resultASL = await recognizer.recognize({
    signLanguage: 'ASL',
    mimeType: 'video/webm',
  });

  assert.ok(resultASL.jobId.startsWith('rec_'));
  assert.ok(resultASL.confidenceScore >= 0.8 && resultASL.confidenceScore <= 1.0);
  assert.ok(resultASL.recognizedText.length > 0);
  assert.ok(resultASL.segments.length > 0);
  assert.equal(resultASL.keypointsDetected.hands, true);
  assert.equal(resultASL.keypointsDetected.face, true);

  const resultBSL = await recognizer.recognize({
    signLanguage: 'BSL',
    mimeType: 'video/webm',
  });
  assert.equal(resultBSL.signLanguage, 'BSL');
  assert.ok(resultBSL.recognizedText.includes('British Sign Language'));
});

// Test Audio Transcription Adapter
test('Audio Transcription Provider - Ingestion & Output', async () => {
  const { DevAudioTranscriptionProvider } = await import('../src/lib/adapters/audio-transcription.ts');
  const transcriber = new DevAudioTranscriptionProvider();

  const res = await transcriber.transcribe({
    durationSeconds: 4.5,
    language: 'en',
  });

  assert.ok(res.transcript.length > 0);
  assert.equal(res.durationSeconds, 4.5);
  assert.ok(res.confidence > 0.9);
});

// Test LLM Engine & Context Assembly
test('Conversational LLM Provider - Contextual Response & Streaming', async () => {
  const { DevConversationalLLMProvider } = await import('../src/lib/adapters/llm-provider.ts');
  const llm = new DevConversationalLLMProvider();

  const responseGreeting = await llm.generateResponse({
    userMessage: 'Hello there!',
    preferredSignLanguage: 'ASL',
  });
  assert.ok(responseGreeting.content.includes('SignBridge AI'));

  const responseSign = await llm.generateResponse({
    userMessage: 'What next?',
    recognizedSignText: 'Hello, I am excited to test this bridge.',
    preferredSignLanguage: 'ASL',
  });
  assert.ok(responseSign.content.includes('Hello, I am excited to test this bridge.'));

  // Test streaming token dispatch
  const chunks = [];
  await llm.streamResponse(
    { userMessage: 'Tell me about the platform' },
    (chunk) => chunks.push(chunk)
  );
  assert.ok(chunks.length > 1);
  assert.ok(chunks.join('').length > 10);
});

// Test Avatar Provider Job State Machine
test('Avatar Provider - Asynchronous Job Lifecycle Contract', async () => {
  const { PlaceholderAvatarProvider } = await import('../src/lib/adapters/avatar-provider.ts');
  const avatarProvider = new PlaceholderAvatarProvider();

  const job = await avatarProvider.generateFromText({
    messageId: 'msg_test_1',
    conversationId: 'conv_test_1',
    responseText: 'Thank you for communicating.',
    targetSignLanguage: 'ASL',
  });

  assert.ok(job.id.startsWith('av_'));
  assert.equal(job.status, 'queued');

  const queriedJob = await avatarProvider.getJobStatus(job.id);
  assert.ok(queriedJob !== null);
  assert.equal(queriedJob.id, job.id);
});

// Test Server Database Persistence
test('Server Database - Isolation & Message Ordering', async () => {
  const { serverDb } = await import('../src/lib/services/server-db.ts');

  const testUserId = 'usr_unit_test_99';
  const conv = await serverDb.createConversation(testUserId, 'Unit Test Conv');
  assert.equal(conv.userId, testUserId);
  assert.equal(conv.title, 'Unit Test Conv');

  const userMsg = await serverDb.addMessage({
    id: 'msg_u_1',
    conversationId: conv.id,
    userId: testUserId,
    role: 'user',
    content: 'Testing persistence',
    inputModality: 'text',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  assert.equal(userMsg.content, 'Testing persistence');

  const msgs = await serverDb.getMessages(conv.id, testUserId);
  assert.equal(msgs.length, 1);
  assert.equal(msgs[0].id, 'msg_u_1');

  // Verify cross-user isolation: Another user cannot see this conversation
  const otherUserMsgs = await serverDb.getMessages(conv.id, 'usr_stranger_00');
  assert.equal(otherUserMsgs.length, 0);

  // Clean up
  await serverDb.deleteConversation(conv.id, testUserId);
  const deletedConv = await serverDb.getConversation(conv.id, testUserId);
  assert.equal(deletedConv, null);
});
