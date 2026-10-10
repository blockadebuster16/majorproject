'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Activity, Heart } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer className="bg-[#05070b] border-t border-white/[0.08] text-slate-400 py-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SignBridge AI</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered multimodal sign language communication platform bridging Deaf and hearing communities worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              All Systems Operational
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/chat" className="hover:text-cyan-400 transition-colors">
                  AI Communication Workspace
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-cyan-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#modalities" className="hover:text-cyan-400 transition-colors">
                  Multimodal Processing
                </Link>
              </li>
              <li>
                <Link href="#demo" className="hover:text-cyan-400 transition-colors">
                  Interactive Demo
                </Link>
              </li>
              <li>
                <Link href="#avatar-vision" className="hover:text-cyan-400 transition-colors">
                  Future 3D Avatar Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (Draft Notice) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Governance & Policies</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Privacy Policy <span className="text-[10px] text-amber-400/80 font-mono">(Draft)</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Terms of Service <span className="text-[10px] text-amber-400/80 font-mono">(Draft)</span>
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-cyan-400 transition-colors">
                  Accessibility Statement (WCAG 2.2 AA)
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-[11px]">
                  Video data is ephemeral and purged according to retention policy.
                </span>
              </li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Architecture</h4>
            <ul className="space-y-2.5 text-xs font-mono text-slate-400">
              <li>Core: Next.js 16 + React 19</li>
              <li>Vision Model: PoseNet-v2.4</li>
              <li>Speech: Whisper-v3</li>
              <li>Avatar: Integration v1</li>
              <li className="pt-2">
                <Link
                  href="/api/v1/health"
                  target="_blank"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Activity className="w-3.5 h-3.5" /> View /api/v1/health
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 SignBridge AI. Engineered for inclusive communication.</p>
          <p className="flex items-center gap-1">
            Built with accessibility and ethical AI standards
          </p>
        </div>
      </div>
    </footer>
  );
}
