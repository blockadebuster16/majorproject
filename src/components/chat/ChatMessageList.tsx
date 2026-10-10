'use client';

import React from 'react';
import { Sparkles, Video, Mic, MessageSquare, Hand, ArrowRight, ShieldCheck } from 'lucide-react';
import { ChatMessage, SupportedSignLanguage } from '@/lib/types';
import ChatMessageItem from './ChatMessageItem';

interface ChatMessageListProps {
  messages: ChatMessage[];
  onSelectPrompt: (promptText: string) => void;
  onOpenVideoModal: () => void;
  onOpenAudioModal: () => void;
  onSendRecognizedText: (text: string) => void;
  onOpenAvatarModal: (messageId: string, text: string) => void;
  isGenerating: boolean;
  targetSignLanguage: SupportedSignLanguage;
}

const examplePrompts = [
  {
    title: 'Analyze Sign Video',
    prompt: 'Help me understand this sign language video.',
    icon: Video,
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
  },
  {
    title: 'Summarize Meeting',
    prompt: 'Summarize this conversation for my team.',
    icon: MessageSquare,
    color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
  },
  {
    title: 'Plain Language Draft',
    prompt: 'Help me draft a message in clear, sign-friendly plain language.',
    icon: Sparkles,
    color: 'text-violet-400 border-violet-500/20 bg-violet-500/10',
  },
  {
    title: 'Convert Gestures',
    prompt: 'Convert my recorded signs into text notes.',
    icon: Hand,
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
  },
];

export default function ChatMessageList({
  messages,
  onSelectPrompt,
  onOpenVideoModal,
  onOpenAudioModal,
  onSendRecognizedText,
  onOpenAvatarModal,
  isGenerating,
  targetSignLanguage,
}: ChatMessageListProps) {
  // If empty conversation, render ChatGPT-style welcoming empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
          {/* Brand Icon */}
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 p-[2px] shadow-2xl shadow-cyan-500/20 mx-auto">
            <div className="w-full h-full bg-[#07090e] rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              How can SignBridge assist your communication today?
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Record or upload sign language video, speak through microphone audio, or type directly in our accessible conversation workspace.
            </p>
          </div>

          {/* Quick Starter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {examplePrompts.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPrompt(p.prompt)}
                  className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/40 transition-all text-left group flex items-start gap-3 cursor-pointer"
                >
                  <div className={`p-2 rounded-xl border shrink-0 ${p.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {p.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.prompt}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Direct Modality Trigger Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenVideoModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>Record Sign Language Video ({targetSignLanguage})</span>
            </button>
            <button
              type="button"
              onClick={onOpenAudioModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-400" />
              <span>Record Spoken Audio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render message stream
  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-white/[0.1]">
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          onSendRecognizedText={onSendRecognizedText}
          onOpenAvatarModal={onOpenAvatarModal}
          targetSignLanguage={targetSignLanguage}
        />
      ))}

      {/* Streaming indicator when generating */}
      {isGenerating && (
        <div className="py-4 px-6 max-w-4xl mx-auto flex items-center gap-3 text-xs text-cyan-400 font-mono animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>SignBridge Assistant is streaming conversational response...</span>
        </div>
      )}
    </div>
  );
}
