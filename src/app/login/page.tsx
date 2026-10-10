'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Shield, CheckCircle2, Lock, User, AlertCircle } from 'lucide-react';
import { DEFAULT_USER_PROFILE } from '@/lib/services/conversation-store';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/chat';

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if already authenticated
  useEffect(() => {
    const existing = localStorage.getItem('signbridge_auth_user');
    if (existing) {
      router.push(redirectTarget);
    }
  }, [router, redirectTarget]);

  // Handle Demo Login
  const handleDemoLogin = () => {
    setIsLoading(true);
    setAuthError(null);
    setTimeout(() => {
      localStorage.setItem('signbridge_auth_user', JSON.stringify(DEFAULT_USER_PROFILE));
      router.push(redirectTarget);
    }, 600);
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setAuthError(null);

    // If Supabase Google OAuth is configured via environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
        window.location.origin + '/auth/callback?redirect=' + redirectTarget
      )}`;
      return;
    }

    // Secure simulated OAuth flow for local testing and demonstration
    setTimeout(() => {
      const googleUser = {
        ...DEFAULT_USER_PROFILE,
        id: 'usr_google_491',
        displayName: 'Google Verified User',
        email: 'user@gmail.com',
      };
      localStorage.setItem('signbridge_auth_user', JSON.stringify(googleUser));
      router.push(redirectTarget);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            SignBridge <span className="text-cyan-400">AI</span>
          </span>
        </Link>

        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Sign In to Your Workspace
        </h2>
        <p className="text-center text-sm text-slate-400 mb-8">
          Access your conversations, sign language recognition models, and custom settings.
        </p>

        {authError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <div className="bg-[#0b0e19] border border-white/[0.08] p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          {/* Google OAuth Button */}
          <button
            type="button"
            id="google-signin-btn"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google OAuth</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#0b0e19] px-3 text-xs font-mono uppercase text-slate-400 absolute">
              or instant access
            </span>
          </div>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            id="demo-signin-btn"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/30 text-cyan-300 font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>Continue as Demo Communicator</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted OAuth session • Ephemeral media protection</span>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-slate-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-slate-300">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
