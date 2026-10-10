'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Video, Mic, MessageSquare, ShieldCheck, ChevronDown, Hand } from 'lucide-react';
import HeroThreeScene from '@/components/marketing/HeroThreeScene';
import MarketingHeader from '@/components/marketing/MarketingHeader';
import HowItWorksSection from '@/components/marketing/HowItWorksSection';
import ModalitiesSection from '@/components/marketing/ModalitiesSection';
import InteractiveDemoSection from '@/components/marketing/InteractiveDemoSection';
import AccessibilitySection from '@/components/marketing/AccessibilitySection';
import FutureAvatarSection from '@/components/marketing/FutureAvatarSection';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function LandingPage() {
  const router = useRouter();
  const [reducedMotion, setReducedMotion] = useState(false);

  // Authentication check helper
  const handlePrimaryCta = () => {
    // Check local authentication session state
    const authUser = typeof window !== 'undefined' ? localStorage.getItem('signbridge_auth_user') : null;
    if (authUser) {
      router.push('/chat');
    } else {
      router.push('/login?redirect=/chat');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Three.js Interactive 3D Canvas */}
        <HeroThreeScene reducedMotion={reducedMotion} />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[25rem] bg-gradient-to-b from-cyan-500/10 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

        {/* Hero Content (Positioned cleanly with high z-index and pointer-events-auto) */}
        <div className="relative z-10 max-w-5xl mx-auto text-center py-20 flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md text-xs sm:text-sm font-medium text-slate-300 mb-8 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Next-Gen Sign Language Communication Platform</span>
            <span className="text-white/[0.2]">|</span>
            <span className="text-cyan-400 font-mono text-xs">PoseNet v2.4 + Multimodal AI</span>
          </div>

          {/* High-Impact Display Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08] sm:leading-[1.05] mb-6">
            Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Gesture & Speech</span> With Conversational Intelligence
          </h1>

          {/* Product Explanation */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10 text-balance">
            Real-time sign language recognition, audio transcription, and assistive conversational AI—engineered for transparent, accessible dialogue between Deaf and hearing individuals.
          </p>

          {/* Primary CTA Composition: EXACT label "Let's Get Started" */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              id="hero-primary-cta"
              onClick={handlePrimaryCta}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base sm:text-lg shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/50"
            >
              Let&apos;s Get Started
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore Architecture
            </a>
          </div>

          {/* Interactive hints & Motion toggle */}
          <div className="mt-14 flex items-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Interactive 3D Canvas (Drag or Move Cursor)
            </span>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className="hover:text-cyan-400 underline focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            >
              {reducedMotion ? 'Enable 3D Motion' : 'Reduce Motion'}
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="mt-10 animate-bounce text-slate-400">
            <ChevronDown className="w-5 h-5 mx-auto" />
          </div>
        </div>
      </section>

      {/* Section 1 & 2: Product Introduction & How It Works */}
      <HowItWorksSection />

      {/* Section 3: Multimodal Communication */}
      <ModalitiesSection />

      {/* Section 4: Accessibility and Ethics */}
      <AccessibilitySection />

      {/* Section 5: Interactive Product Demonstration */}
      <InteractiveDemoSection />

      {/* Section 6: Future AI Avatar Vision */}
      <FutureAvatarSection />

      {/* Section 7: Final CTA */}
      <section className="py-24 bg-gradient-to-b from-[#07090e] via-[#0d1222] to-[#05070b] border-t border-white/[0.08] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
            Instant Access
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to Experience the Communication Bridge?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Launch the ChatGPT-inspired workspace to record sign language, transcribe speech, or converse using multimodal AI.
          </p>
          <button
            type="button"
            onClick={handlePrimaryCta}
            className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/50"
          >
            Let&apos;s Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}
