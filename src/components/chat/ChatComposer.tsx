'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic, Video, Sparkles, RefreshCw, Hand, Paperclip } from 'lucide-react';
import { SupportedSignLanguage } from '@/lib/types';

interface ChatComposerProps {
  onSendMessage: (text: string) => void;
  onOpenAudioModal: () => void;
  onOpenVideoModal: () => void;
  isGenerating: boolean;
  preferredSignLanguage: SupportedSignLanguage;
}

export default function ChatComposer({
  onSendMessage,
  onOpenAudioModal,
  onOpenVideoModal,
  isGenerating,
  preferredSignLanguage,
}: ChatComposerProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isGenerating) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-6">
      <div className="relative rounded-3xl bg-[#0b0e1a]/90 backdrop-blur-xl border border-white/[0.1] shadow-2xl p-2.5 sm:p-3 transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30">
        {/* Multiline textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message, record sign language video, or speak into microphone..."
          rows={1}
          disabled={isGenerating}
          className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-400 px-3 pt-2 pb-1 focus:outline-none resize-none max-h-44 scrollbar-thin leading-relaxed"
          aria-label="Message input"
        />

        {/* Action Controls Toolbar */}
        <div className="flex items-center justify-between pt-2 px-1">
          {/* Left: Input Modality Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Video Input Button */}
            <button
              type="button"
              id="composer-video-btn"
              onClick={onOpenVideoModal}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/[0.08] text-slate-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40"
              title="Record or Upload Sign Language Video"
              aria-label="Record or Upload Sign Language Video"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Sign Video</span>
              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-1 py-0.2 rounded border border-cyan-500/20">
                {preferredSignLanguage}
              </span>
            </button>

            {/* Audio Recording Button */}
            <button
              type="button"
              id="composer-audio-btn"
              onClick={onOpenAudioModal}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-indigo-500/10 hover:text-indigo-400 border border-white/[0.08] text-slate-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40"
              title="Record Spoken Audio"
              aria-label="Record Spoken Audio"
            >
              <Mic className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Voice</span>
            </button>
          </div>

          {/* Right: Submit Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="composer-send-btn"
              onClick={() => handleSubmit()}
              disabled={!text.trim() || isGenerating}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:shadow-none transition-all cursor-pointer"
              aria-label="Send message"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <ArrowUp className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center text-[11px] text-slate-400">
        SignBridge AI bridges sign language and speech. Check model recognized output before sharing in high-stakes environments.
      </div>
    </div>
  );
}
