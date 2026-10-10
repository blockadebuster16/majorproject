import type { AvatarJob, AvatarJobRequest } from '../types/index.ts';

export interface IAvatarProvider {
  readonly providerName: string;
  readonly isServiceConfigured: boolean;
  generateFromText(request: AvatarJobRequest): Promise<AvatarJob>;
  getJobStatus(jobId: string): Promise<AvatarJob | null>;
}

/**
 * Avatar Integration Contract & Placeholder Implementation.
 * 
 * NOTE TO INTEGRATION ENGINEERS:
 * The AI Avatar generation service is developed, hosted, and managed independently.
 * This class establishes the production interface contract, job state machine,
 * and test harness for the future 3D Signing Avatar pipeline.
 */
export class PlaceholderAvatarProvider implements IAvatarProvider {
  readonly providerName = 'SignBridge-AvatarBridge-Contract-v1';
  readonly isServiceConfigured = Boolean(process.env.AVATAR_SERVICE_ENDPOINT);

  private jobs = new Map<string, AvatarJob>();

  async generateFromText(request: AvatarJobRequest): Promise<AvatarJob> {
    const jobId = `av_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const job: AvatarJob = {
      id: jobId,
      userId: 'user_active',
      conversationId: request.conversationId,
      messageId: request.messageId,
      provider: this.providerName,
      status: 'queued',
      targetSignLanguage: request.targetSignLanguage,
      createdAt: now,
    };

    this.jobs.set(jobId, job);

    setTimeout(() => {
      const j = this.jobs.get(jobId);
      if (j) {
        j.status = 'processing';
      }
    }, 400);

    setTimeout(() => {
      const j = this.jobs.get(jobId);
      if (j) {
        j.status = 'completed';
        j.completedAt = new Date().toISOString();
        j.outputReference = 'https://assets.signbridge.ai/contracts/avatar-spec-v1.json';
        j.previewAnimationType = 'webgl_bones';
      }
    }, 1200);

    return job;
  }

  async getJobStatus(jobId: string): Promise<AvatarJob | null> {
    return this.jobs.get(jobId) || null;
  }
}

let avatarProviderInstance: IAvatarProvider | null = null;

export function getAvatarProvider(): IAvatarProvider {
  if (!avatarProviderInstance) {
    avatarProviderInstance = new PlaceholderAvatarProvider();
  }
  return avatarProviderInstance;
}
