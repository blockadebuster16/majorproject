'use client';

import React from 'react';
import { Bot, Code2, Cpu, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function FutureAvatarSection() {
  return (
    <section id="avatar-vision" className="py-28 bg-[#07090e] relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-1/2 right-10 w-[36rem] h-[36rem] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.1] p-8 sm:p-14 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
                Future Integration Roadmap
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Closing the Loop: 3D Signing AI Avatars
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                True conversational equity requires bidirectional communication. While SignBridge AI currently handles full gesture video recognition to text, we have architected standard integration infrastructure for a future 3D AI avatar that animates assistant responses directly into sign language.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                    <Code2 className="w-4 h-4 text-violet-400" /> Decoupled Contract
                  </div>
                  <p className="text-xs text-slate-400">
                    Documented API specification (<code className="text-violet-300">AvatarProvider</code>) ready for independent avatar servers.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Transparent State
                  </div>
                  <p className="text-xs text-slate-400">
                    Every assistant response provides a clearly labeled integration preview without misleading claims.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 transition-all"
                >
                  <Bot className="w-4 h-4" /> Try Integration in Chat
                </Link>
                <a
                  href="#how-it-works"
                  className="text-xs font-mono text-slate-400 hover:text-white underline"
                >
                  Read Architecture Spec
                </a>
              </div>
            </div>

            {/* Right: Technical Contract Visual */}
            <div className="lg:col-span-5 rounded-2xl bg-[#090c15] border border-white/[0.1] p-6 font-mono text-xs text-slate-300 shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4 text-[11px] text-slate-400">
                <span>AVATAR_PROVIDER_SPEC.ts</span>
                <span className="text-violet-400">v1.0 Ready</span>
              </div>
              <pre className="text-cyan-300/90 leading-relaxed text-[11px]">
{`interface AvatarJobRequest {
  messageId: string;
  conversationId: string;
  responseText: string;
  targetSignLanguage: 'ASL' | 'BSL';
  speedMultiplier?: number;
}

// Asynchronous Job Lifecycle:
// queued -> processing -> completed

POST /api/v1/avatar/jobs
Response: {
  status: 'queued',
  jobId: 'av_9812_k2x',
  provider: 'Independent-3D-Rig'
}`}
              </pre>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] text-slate-400">
                Verified API boundary ready for external 3D WebGL skeleton rigging.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
