'use client';

import React, { useState, useEffect } from 'react';
import { X, Hand, Bot, CheckCircle2, RefreshCw, AlertCircle, Sparkles, ExternalLink, Code2 } from 'lucide-react';
import { AvatarJob, SupportedSignLanguage } from '@/lib/types';
import { apiUrl } from '@/lib/utils/env';

interface AvatarPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  conversationId: string;
  responseText: string;
  targetLanguage: SupportedSignLanguage;
}

export default function AvatarPreviewModal({
  isOpen,
  onClose,
  messageId,
  conversationId,
  responseText,
  targetLanguage,
}: AvatarPreviewModalProps) {
  const [job, setJob] = useState<AvatarJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger avatar job creation on modal open
  useEffect(() => {
    if (!isOpen || !messageId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch(apiUrl('/api/v1/avatar/jobs'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId,
        conversationId,
        responseText,
        targetSignLanguage: targetLanguage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setJob(data.data);
          // Poll status briefly to show state transition
          const pollInterval = setInterval(() => {
            fetch(apiUrl(`/api/v1/avatar/jobs/${data.data.id}`))
              .then((r) => r.json())
              .then((pollData) => {
                if (pollData.success && isMounted) {
                  setJob(pollData.data);
                  if (pollData.data.status === 'completed' || pollData.data.status === 'failed') {
                    clearInterval(pollInterval);
                    setIsLoading(false);
                  }
                }
              })
              .catch(() => clearInterval(pollInterval));
          }, 1000);
        } else {
          setError(data.error?.message || 'Failed to start avatar job');
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Network error');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, messageId, conversationId, responseText, targetLanguage]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-modal-title"
    >
      <div className="bg-[#0b0f1c] border border-white/[0.1] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Hand className="w-5 h-5" />
            </div>
            <div>
              <h2 id="avatar-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
                Show in Sign Language <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono">Avatar Integration</span>
              </h2>
              <p className="text-xs text-slate-400">Target Language: {targetLanguage}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice of Transparency */}
        <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-violet-300 flex items-start gap-2.5 mb-6">
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-violet-400" />
          <div>
            <strong>AI Avatar Integration Contract:</strong> The 3D signing avatar service is independently managed. Below is the verified API contract, job status lifecycle, and demonstration keyframe output.
          </div>
        </div>

        {/* 3D Skeleton / Avatar Canvas Preview Container */}
        <div className="relative rounded-2xl bg-[#060810] border border-white/[0.08] p-6 mb-6 min-h-[220px] flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Subtle animated wireframe background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]" />

          {job?.status === 'queued' && (
            <div className="space-y-3 z-10">
              <RefreshCw className="w-8 h-8 text-violet-400 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-white">Job Queued in Avatar Queue...</div>
              <div className="text-xs font-mono text-slate-400">Assigning worker thread • Job ID: {job.id}</div>
            </div>
          )}

          {job?.status === 'processing' && (
            <div className="space-y-3 z-10">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 border-t-violet-400 animate-spin" />
                <Bot className="w-6 h-6 text-violet-400 absolute inset-0 m-auto" />
              </div>
              <div className="text-sm font-semibold text-white">Synthesizing 3D Sign Language Rigging...</div>
              <div className="text-xs font-mono text-cyan-400">Generating spatial keyframes & facial morph targets</div>
            </div>
          )}

          {job?.status === 'completed' && (
            <div className="space-y-4 z-10 max-w-md">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  Avatar Keyframe Generation Complete
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Syntactic translation to {targetLanguage} successfully converted into 60fps bone transform arrays.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-slate-400">
                Output Ref: <span className="text-cyan-300">{job.outputReference}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-2 z-10 text-red-400">
              <AlertCircle className="w-8 h-8 mx-auto" />
              <div className="text-sm font-bold">Failed to connect to Avatar Service</div>
              <p className="text-xs">{error}</p>
            </div>
          )}
        </div>

        {/* Response Text Under Translation */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-semibold text-slate-400">Original Assistant Response:</div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-200 line-clamp-3">
            {responseText}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs">
          <span className="font-mono text-slate-400">Provider: PlaceholderAvatarProvider v1</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
