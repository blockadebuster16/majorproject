import type { ChatMessage, SupportedSignLanguage } from '../types/index.ts';

export interface LLMRequestOptions {
  userMessage: string;
  conversationHistory?: ChatMessage[];
  recognizedSignText?: string;
  audioTranscript?: string;
  preferredSignLanguage?: SupportedSignLanguage;
  systemPrompt?: string;
}

export interface LLMResponse {
  content: string;
  tokenCount: number;
  latencyMs: number;
  modelVersion: string;
}

export interface ILLMProvider {
  readonly providerName: string;
  generateResponse(options: LLMRequestOptions): Promise<LLMResponse>;
  streamResponse(
    options: LLMRequestOptions,
    onChunk: (chunk: string) => void
  ): Promise<LLMResponse>;
}

export class DevConversationalLLMProvider implements ILLMProvider {
  readonly providerName = 'SignBridge-Cognitive-Engine-v1';

  async generateResponse(options: LLMRequestOptions): Promise<LLMResponse> {
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 200));

    let content = '';
    const query = (options.recognizedSignText || options.userMessage).toLowerCase();

    if (options.recognizedSignText) {
      content = `I understand your sign language input: **"${options.recognizedSignText}"**.\n\nHere is how I can assist:\n- **Semantic Interpretation**: Your gesture clearly communicated your intent without loss of nuance.\n- **Next Steps**: Would you like me to translate this into formal text, draft a reply, or prepare a response for sign language output?\n\nFeel free to continue with text, another sign video, or speech!`;
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      content = `Hello! Welcome to **SignBridge AI**. I'm here to support seamless communication between sign language users, speech communicators, and text users.\n\nYou can:\n1. **Record or Upload Sign Language Video** using the camera icon.\n2. **Speak into your microphone** using the audio icon.\n3. **Type messages directly** in this chat.\n\nHow would you like to begin?`;
    } else if (query.includes('how') && query.includes('work')) {
      content = `### How SignBridge AI Works\n\n1. **Multimodal Ingestion**: You can communicate via **Sign Language Video**, **Spoken Audio**, or **Direct Text**.\n2. **Pose Landmark & Neural Recognition**: Videos are processed by our custom gesture model, isolating hand keypoints and facial expressions.\n3. **Transparent Review**: You inspect and edit the recognized gloss before sending to conversational AI.\n4. **Contextual LLM Processing**: Our language engine produces clear, accessible responses.\n5. **AI Avatar Infrastructure**: You can click **"Show in Sign Language"** on any response to generate a 3D animated signing reference.\n\nEverything is private, encrypted, and designed according to WCAG 2.2 AA accessibility guidelines.`;
    } else if (query.includes('summarize')) {
      content = `### Conversation Summary\n\n- **Modality Used**: Multimodal communication bridge active.\n- **Key Discussion**: Explored platform capabilities, gesture recognition accuracy, and accessibility controls.\n- **Status**: All recognition adapters and streaming pipelines are operating normally.`;
    } else {
      content = `Thank you for sharing that. I've received your message:\n\n> "${options.userMessage}"\n\nI am processing your query within our accessible communication context. Is there a specific format you would like the reply in (e.g., bullet points, simplified plain text, or prepared for sign translation)?`;
    }

    const latencyMs = Date.now() - startTime;
    return {
      content,
      tokenCount: Math.ceil(content.length / 4),
      latencyMs,
      modelVersion: this.providerName,
    };
  }

  async streamResponse(
    options: LLMRequestOptions,
    onChunk: (chunk: string) => void
  ): Promise<LLMResponse> {
    const full = await this.generateResponse(options);
    const words = full.content.split(' ');

    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      onChunk(chunk);
      await new Promise((r) => setTimeout(r, 10));
    }

    return full;
  }
}

/**
 * Cloud LLM Provider (OpenAI / Anthropic / Gemini Compatible)
 */
export class CloudLLMProvider implements ILLMProvider {
  readonly providerName: string;
  private apiKey: string;

  constructor(apiKey: string, modelName = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.providerName = modelName;
  }

  async generateResponse(options: LLMRequestOptions): Promise<LLMResponse> {
    const startTime = Date.now();
    const systemPrompt = `You are SignBridge AI, an assistive communication platform bridging sign language users (Deaf / Hard of Hearing) and hearing/text communicators. Keep responses concise, clear, and well-structured.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(options.conversationHistory || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: 'user',
        content: options.recognizedSignText
          ? `[Recognized Sign Language Input]: ${options.recognizedSignText}\n[User Context]: ${options.userMessage}`
          : options.userMessage,
      },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.providerName,
        messages,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      throw new Error(`Cloud LLM provider failed: ${res.statusText}`);
    }

    const data = await res.json();
    const content = data.choices[0]?.message?.content || '';
    const latencyMs = Date.now() - startTime;

    return {
      content,
      tokenCount: data.usage?.total_tokens || Math.ceil(content.length / 4),
      latencyMs,
      modelVersion: this.providerName,
    };
  }

  async streamResponse(
    options: LLMRequestOptions,
    onChunk: (chunk: string) => void
  ): Promise<LLMResponse> {
    const resp = await this.generateResponse(options);
    const words = resp.content.split(' ');
    for (let i = 0; i < words.length; i++) {
      onChunk((i === 0 ? '' : ' ') + words[i]);
      await new Promise((r) => setTimeout(r, 10));
    }
    return resp;
  }
}

export function getLLMProvider(): ILLMProvider {
  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
    return new CloudLLMProvider(openAiKey);
  }
  return new DevConversationalLLMProvider();
}
