'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  RotateCcw,
  Hand,
  Video,
  Mic,
  MessageSquare,
  Bot,
} from 'lucide-react';
import { ChatMessage, SupportedSignLanguage } from '@/lib/types';
import RecognitionReviewCard from './RecognitionReviewCard';
import { cn } from '@/lib/utils/cn';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSendRecognizedText: (text: string) => void;
  onOpenAvatarModal: (messageId: string, text: string) => void;
  onRegenerate?: () => void;
  targetSignLanguage: SupportedSignLanguage;
}

export default function ChatMessageItem({
  message,
  onSendRecognizedText,
  onOpenAvatarModal,
  onRegenerate,
  targetSignLanguage,
}: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedTime = mounted && message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : (message.createdAt ? new Date(message.createdAt).toISOString().slice(11, 16) : '');

  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'group py-5 px-4 sm:px-6 rounded-3xl transition-colors',
        isUser ? 'bg-transparent' : 'bg-white/[0.02] border border-white/[0.05]'
      )}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3.5 sm:gap-4">
        {/* Avatar */}
        <div
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md',
            isUser
              ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white'
              : 'bg-gradient-to-tr from-indigo-500 to-violet-600 text-white'
          )}
        >
          {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Row: Role & Modality Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                {isUser ? 'You' : 'SignBridge Assistant'}
              </span>

              {/* Modality Badge */}
              {isUser && message.inputModality === 'video' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  <Video className="w-3 h-3 text-cyan-400" /> Sign Video
                </span>
              )}
              {isUser && message.inputModality === 'audio' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Mic className="w-3 h-3 text-indigo-400" /> Speech Audio
                </span>
              )}
              {isUser && message.inputModality === 'text' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                  <MessageSquare className="w-3 h-3 text-slate-400" /> Text
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono text-slate-400" suppressHydrationWarning>
              {formattedTime}
            </span>
          </div>

          {/* If message has an attached gesture recognition result, show the review card */}
          {message.recognitionResult && (
            <RecognitionReviewCard
              result={message.recognitionResult}
              onSendToAssistant={onSendRecognizedText}
              isAlreadySent={true}
            />
          )}

          {/* Message Text */}
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-wrap selection:bg-cyan-500/30">
            {message.content}
          </div>

          {/* Assistant Action Bar */}
          {!isUser && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/[0.04]">
              {/* Left: Show in Sign Language Avatar Action Button */}
              <button
                type="button"
                id={`avatar-btn-${message.id}`}
                onClick={() => onOpenAvatarModal(message.id, message.content)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 hover:text-violet-200 border border-violet-500/25 transition-all cursor-pointer font-medium hover:scale-[1.02] active:scale-[0.98]"
                title="Translate this response into 3D Sign Language"
              >
                <Hand className="w-3.5 h-3.5 text-violet-400" />
                <span>Show in Sign Language</span>
                <span className="text-[10px] font-mono text-violet-400/80 bg-violet-500/10 px-1 py-0.2 rounded">
                  {targetSignLanguage}
                </span>
              </button>

              {/* Right: Copy & Regenerate */}
              <div className="flex items-center gap-2 text-slate-400">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
                  title="Copy to clipboard"
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {onRegenerate && (
                  <button
                    type="button"
                    onClick={onRegenerate}
                    className="p-1.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
                    title="Regenerate response"
                    aria-label="Regenerate response"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                {message.metadata?.latencyMs && (
                  <span className="text-[10px] font-mono text-slate-400 ml-1">
                    {message.metadata.latencyMs}ms
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
