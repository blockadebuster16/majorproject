'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Menu, X, Shield, Activity } from 'lucide-react';

export default function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07090e]/80 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              SignBridge <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Multimodal Communication</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300" aria-label="Main Navigation">
          <Link href="#how-it-works" className="hover:text-cyan-400 transition-colors focus:outline-none focus-visible:underline">
            How It Works
          </Link>
          <Link href="#modalities" className="hover:text-cyan-400 transition-colors focus:outline-none focus-visible:underline">
            Modalities
          </Link>
          <Link href="#demo" className="hover:text-cyan-400 transition-colors focus:outline-none focus-visible:underline">
            Interactive Demo
          </Link>
          <Link href="#accessibility" className="hover:text-cyan-400 transition-colors focus:outline-none focus-visible:underline">
            Accessibility
          </Link>
          <Link href="#avatar-vision" className="hover:text-cyan-400 transition-colors focus:outline-none focus-visible:underline">
            Future Avatar
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Sign In
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
          >
            Launch Chat
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0d17]/95 border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-4 backdrop-blur-2xl">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-300">
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.05] hover:text-cyan-400"
            >
              How It Works
            </Link>
            <Link
              href="#modalities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.05] hover:text-cyan-400"
            >
              Modalities
            </Link>
            <Link
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.05] hover:text-cyan-400"
            >
              Interactive Demo
            </Link>
            <Link
              href="#accessibility"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.05] hover:text-cyan-400"
            >
              Accessibility
            </Link>
            <Link
              href="#avatar-vision"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.05] hover:text-cyan-400"
            >
              Future Avatar
            </Link>
          </nav>
          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-white/[0.1] text-slate-200 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20"
            >
              Launch Chat
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
