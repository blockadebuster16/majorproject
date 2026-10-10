'use client';

import React from 'react';
import { Video, Mic, MessageSquare, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function ModalitiesSection() {
  const modalities = [
    {
      title: 'Sign Language Video',
      subtitle: 'Native Gesture Processing',
      description:
        'Engineered for Deaf and signing communicators. Captures spatial motion and facial non-manual markers, translating gestures into structured text via our dedicated recognition model adapter.',
      icon: Video,
      accent: 'from-cyan-500 to-blue-600',
      tag: 'Primary Modality',
      features: [
        'Webcam live capture & local file upload',
        'Temporal 60fps landmark sequence tracking',
        'Transparent gloss and calibrated confidence scores',
        'Human-in-the-loop review before dispatch',
      ],
    },
    {
      title: 'Spoken Audio',
      subtitle: 'Microphone & Speech Transcription',
      description:
        'Engineered for hearing or speaking communicators. Real-time audio waveform visualizer and speech-to-text pipeline that operates completely independently of video infrastructure.',
      icon: Mic,
      accent: 'from-indigo-500 to-purple-600',
      tag: 'Voice Ingestion',
      features: [
        'Live Web Audio API MediaRecorder stream',
        'Whisper speech transcription adapter',
        'Editable transcript review before sending',
        'Zero dependency on computer vision pipeline',
      ],
    },
    {
      title: 'Direct Text',
      subtitle: 'Low-Latency Conversational Input',
      description:
        'Instant messaging with full markdown rendering, progressive token streaming, and keyboard shortcuts. Serves as the universal convergence format for all multimodal participants.',
      icon: MessageSquare,
      accent: 'from-violet-500 to-amber-500',
      tag: 'Fast Text',
      features: [
        'Auto-expanding multiline composer',
        'Desktop Enter to send & Shift+Enter newline',
        'Context-window limited history management',
        'WCAG 2.2 AA compliant screen reader support',
      ],
    },
  ];

  return (
    <section id="modalities" className="py-28 bg-[#0a0d17] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Independent Processing Pipelines
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Three Distinct Modalities, One Unified Conversation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Each modality features its own secure ingestion and transformation pipeline, converging seamlessly into a shared conversational state.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modalities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl bg-white/[0.02] border border-white/[0.08] p-8 flex flex-col justify-between hover:border-white/[0.2] transition-all group overflow-hidden"
              >
                {/* Subtle gradient banner */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accent}`} />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                  <div className="text-xs font-mono text-cyan-400 mb-4">{item.subtitle}</div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{item.description}</p>

                  <ul className="space-y-3 pt-6 border-t border-white/[0.06]">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Isolated Sandbox
                  </span>
                  <span className="font-mono text-slate-400">Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
