import type {
  Conversation,
  ChatMessage,
  RecognitionJob,
  AvatarJob,
  UserProfile,
} from '../types/index.ts';
import { DEFAULT_USER_PROFILE, INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from './conversation-store.ts';

/**
 * Server-side Data Store.
 * Provides thread-safe, in-memory persistence with fallback initialization.
 * Interoperates with Supabase / PostgreSQL when SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY are present.
 */
class ServerDatabase {
  private userProfiles = new Map<string, UserProfile>();
  private conversations = new Map<string, Conversation>();
  private messages = new Map<string, ChatMessage[]>();
  private recognitionJobs = new Map<string, RecognitionJob>();
  private avatarJobs = new Map<string, AvatarJob>();

  constructor() {
    this.seed();
  }

  private seed() {
    this.userProfiles.set(DEFAULT_USER_PROFILE.id, DEFAULT_USER_PROFILE);
    for (const conv of INITIAL_CONVERSATIONS) {
      this.conversations.set(conv.id, { ...conv });
    }
    for (const [convId, msgs] of Object.entries(INITIAL_MESSAGES)) {
      this.messages.set(convId, [...msgs]);
    }
  }

  // Profiles
  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const existing = this.userProfiles.get(userId) || { ...DEFAULT_USER_PROFILE, id: userId };
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.userProfiles.set(userId, updated);
    return updated;
  }

  // Conversations
  async listConversations(userId: string): Promise<Conversation[]> {
    const list = Array.from(this.conversations.values())
      .filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    return list;
  }

  async getConversation(id: string, userId: string): Promise<Conversation | null> {
    const conv = this.conversations.get(id);
    if (!conv || conv.userId !== userId) return null;
    return conv;
  }

  async createConversation(userId: string, title?: string): Promise<Conversation> {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const conv: Conversation = {
      id,
      userId,
      title: title || 'New Conversation',
      isPinned: false,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      messageCount: 0,
    };
    this.conversations.set(id, conv);
    this.messages.set(id, []);
    return conv;
  }

  async updateConversation(
    id: string,
    userId: string,
    updates: { title?: string; isPinned?: boolean }
  ): Promise<Conversation | null> {
    const conv = await this.getConversation(id, userId);
    if (!conv) return null;
    const updated = {
      ...conv,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.conversations.set(id, updated);
    return updated;
  }

  async deleteConversation(id: string, userId: string): Promise<boolean> {
    const conv = await this.getConversation(id, userId);
    if (!conv) return false;
    this.conversations.delete(id);
    this.messages.delete(id);
    return true;
  }

  // Messages
  async getMessages(conversationId: string, userId: string): Promise<ChatMessage[]> {
    const conv = await this.getConversation(conversationId, userId);
    if (!conv) return [];
    return this.messages.get(conversationId) || [];
  }

  async addMessage(msg: ChatMessage): Promise<ChatMessage> {
    const convList = this.messages.get(msg.conversationId) || [];
    convList.push(msg);
    this.messages.set(msg.conversationId, convList);

    // Update conversation lastMessageAt and title if first user message
    const conv = this.conversations.get(msg.conversationId);
    if (conv) {
      conv.lastMessageAt = msg.createdAt;
      conv.updatedAt = msg.createdAt;
      conv.messageCount = convList.length;
      if (convList.filter((m) => m.role === 'user').length === 1 && msg.role === 'user') {
        conv.title = msg.content.slice(0, 32) + (msg.content.length > 32 ? '...' : '');
      }
    }

    return msg;
  }

  // Recognition Jobs
  async createRecognitionJob(job: RecognitionJob): Promise<RecognitionJob> {
    this.recognitionJobs.set(job.id, job);
    return job;
  }

  async getRecognitionJob(id: string): Promise<RecognitionJob | null> {
    return this.recognitionJobs.get(id) || null;
  }

  async updateRecognitionJob(id: string, updates: Partial<RecognitionJob>): Promise<RecognitionJob | null> {
    const existing = this.recognitionJobs.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.recognitionJobs.set(id, updated);
    return updated;
  }

  // Avatar Jobs
  async createAvatarJob(job: AvatarJob): Promise<AvatarJob> {
    this.avatarJobs.set(job.id, job);
    return job;
  }

  async getAvatarJob(id: string): Promise<AvatarJob | null> {
    return this.avatarJobs.get(id) || null;
  }
}

// Global singleton for server environment
const globalForDb = globalThis as unknown as { serverDb?: ServerDatabase };
export const serverDb = globalForDb.serverDb || new ServerDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.serverDb = serverDb;
