'use client';

import React from 'react';
import { HeartHandshake, Eye, ShieldAlert, Sparkles, Sliders, CheckCircle } from 'lucide-react';

export default function AccessibilitySection() {
  const principles = [
    {
      title: 'Linguistic Autonomy & Distinct Grammars',
      description:
        'Sign languages are natural, independent languages with distinct visual-spatial grammars and regional dialects (e.g., ASL, BSL, and ISL are not mutually interchangeable). We treat each language with respect and never portray them as simple word-by-word substitutions.',
      icon: HeartHandshake,
      badge: 'Linguistic Integrity',
    },
    {
      title: 'Non-Manual Marker Sensitivity',
      description:
        'Grammar in sign language is conveyed as much through facial expressions, head tilts, and shoulder posture as through hands. Our recognition pipeline models both 3D finger keypoints and facial non-manual features simultaneously.',
      icon: Eye,
      badge: 'Facial & Pose Dynamics',
    },
    {
      title: 'Human-in-the-Loop Review',
      description:
        'Because AI models can be imperfect under varied lighting or occlusion, recognized text is never silently dispatched. Users always have the power to review, correct, and confirm their message before it enters conversational AI.',
      icon: ShieldAlert,
      badge: 'No Forced Translation',
    },
    {
      title: 'WCAG 2.2 Level AA Engineered',
      description:
        'The platform is built from the ground up for full keyboard navigation, screen-reader semantic trees, high-contrast visibility modes, and native support for users with vestibular or motion sensitivities.',
      icon: Sliders,
      badge: 'Inclusive Interface',
    },
  ];

  return (
    <section id="accessibility" className="py-28 bg-[#0a0d17] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Accessibility & Ethics
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Designed With the Deaf Community, Not Just For It
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Responsible AI engineering requires acknowledging limitations, respecting linguistic identity, and building verified interfaces that put agency in users' hands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-emerald-400/90 font-mono">
                  <CheckCircle className="w-4 h-4" /> Validated standard
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
