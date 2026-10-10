import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sliders, Shield } from 'lucide-react';

export default function AccessibilityStatementPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SignBridge
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Accessibility Statement
        </h1>
        <p className="text-xs font-mono text-slate-400 mb-8">
          Target Conformance: WCAG 2.2 Level AA • Status: Active Implementation
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Our Accessibility Standard</h2>
            <p>
              SignBridge AI is built from the core belief that digital tools must be accessible to all users regardless of auditory, visual, motor, or cognitive capabilities. We benchmark our frontend implementation against the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Specific Accessibility Features Implemented</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full Keyboard Navigability
                </div>
                <p className="text-xs text-slate-400">
                  All interactive controls, modals, and composers are operable via keyboard (<kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">Tab</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">Enter</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">Esc</kbd>).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> High-Contrast Ratios
                </div>
                <p className="text-xs text-slate-400">
                  Text elements maintain a minimum contrast ratio of 4.5:1 against dark backgrounds for maximum readability.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reduced-Motion Support
                </div>
                <p className="text-xs text-slate-400">
                  Three.js 3D kinetic animations and transitions honor system <code className="text-cyan-400">prefers-reduced-motion</code> settings and in-app toggles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transparent Transcription Review
                </div>
                <p className="text-xs text-slate-400">
                  Recognized gestures are presented in an editable review card to eliminate forced machine interpretations.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Feedback & Continuous Improvement</h2>
            <p>
              If you encounter any accessibility hurdles or have recommendations for improving our sign language workflows, please contact our accessibility engineering team at <span className="text-cyan-400 font-mono">accessibility@signbridge.ai</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
