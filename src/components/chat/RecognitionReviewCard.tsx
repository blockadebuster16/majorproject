'use client';

import React, { useState } from 'react';
import { Hand, Check, AlertCircle, ArrowRight, Edit3, ShieldAlert, Sparkles, Tag } from 'lucide-react';
import { RecognitionJobResult } from '@/lib/types';

interface RecognitionReviewCardProps {
  result: RecognitionJobResult;
  onSendToAssistant: (editedText: string) => void;
  isAlreadySent?: boolean;
}

export default function RecognitionReviewCard({
  result,
  onSendToAssistant,
  isAlreadySent = false,
}: RecognitionReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(result.recognizedText);

  const handleSend = () => {
    onSendToAssistant(currentText);
    setIsEditing(false);
  };

  const confidencePercent = Math.round(result.confidenceScore * 100);

  return (
    <div className="my-3 rounded-2xl bg-[#090e1c] border border-cyan-500/30 overflow-hidden shadow-xl shadow-cyan-950/20">
      {/* Top Metadata Header */}
      <div className="bg-cyan-950/40 px-4 py-2.5 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Hand className="w-3 h-3 text-cyan-400" />
          </div>
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            Sign Language Recognition Review
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Language: {result.signLanguage}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Confidence: {confidencePercent}%
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Gloss Segment Sequence */}
        {result.segments && result.segments.length > 0 && (
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-cyan-400" /> Detected Gloss Sequence (Temporal Landmark Order)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.segments.map((seg, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-cyan-200"
                  title={`[${seg.startTime}s - ${seg.endTime}s] Confidence: ${Math.round(seg.confidence * 100)}%`}
                >
                  {seg.gloss}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Text Area / Review Display */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-300">Translated Phrasing:</span>
            {!isAlreadySent && (
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3 h-3" />
                {isEditing ? 'Finish Editing' : 'Edit Phrasing'}
              </button>
            )}
          </div>

          {isEditing && !isAlreadySent ? (
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className="w-full bg-[#07090e] border border-cyan-500/50 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none font-sans"
              rows={2}
              autoFocus
            />
          ) : (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-slate-100 font-medium">
              &ldquo;{currentText}&rdquo;
            </div>
          )}
        </div>

        {/* Transparency / Warnings Indicator */}
        {result.warnings && result.warnings.length > 0 && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {result.warnings.map((w, wIdx) => (
                <p key={wIdx}>{w}</p>
              ))}
            </div>
          </div>
        )}

        {/* Dispatch Button if not yet sent */}
        {!isAlreadySent && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Verify accuracy above before forwarding to conversational assistant.
            </span>
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Send Recognized Text to Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isAlreadySent && (
          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Forwarded to Conversational Assistant</span>
          </div>
        )}
      </div>
    </div>
  );
}
