'use client';

import React from 'react';
import { Video, Cpu, CheckCircle2, MessageSquareCode, Sparkles, UserCheck } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Video,
    title: 'Input Gesture Video',
    description:
      'Record directly with a webcam or upload a video. The client inspects duration and format, transmitting securely to our private processing pipeline.',
    badge: 'Raw Input',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Pose & Landmark Recognition',
    description:
      'The custom sign recognition model tracks 3D spatial keypoints across hands, face, and posture, analyzing temporal gloss transitions at 60fps.',
    badge: 'Neural Inference',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Transparent Review & Edit',
    description:
      'Recognized glosses and translated sentences are presented to the user with confidence scores. Users can verify or adjust text before sending.',
    badge: 'Human in the Loop',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  },
  {
    step: '04',
    icon: MessageSquareCode,
    title: 'Contextual LLM Processing',
    description:
      'The verified transcript is orchestrated through our conversational language engine, generating rich, accessible, and structured responses.',
    badge: 'Conversational AI',
    badgeColor: 'border-violet-500/30 text-violet-400 bg-violet-500/10',
  },
  {
    step: '05',
    icon: Sparkles,
    title: 'Assistant Reply & Avatar Bridge',
    description:
      'Receive instant streamed responses. Optionally trigger the future 3D AI avatar integration to translate replies back into signing gestures.',
    badge: 'Bidirectional Loop',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden bg-[#07090e]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Core Architecture Flow
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            From Kinetic Motion to Conversational Intelligence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            A transparent 5-stage multimodal processing pipeline designed so users always maintain control over what gets recognized and communicated.
          </p>
        </div>

        {/* 5-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
                      {item.step}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center text-[11px] text-slate-400 font-mono">
                  Stage Verified <span className="ml-auto text-emerald-400">✓</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
