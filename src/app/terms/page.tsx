import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SignBridge
        </Link>

        {/* Draft Notice */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">DEVELOPMENT DRAFT NOTICE:</span> This document represents draft terms of service for prototype and pilot environments.
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Terms of Service (Draft)
        </h1>
        <p className="text-xs font-mono text-slate-400 mb-8">
          Last Updated: March 2026 • Document Version: 1.0-draft
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Scope of the Platform</h2>
            <p>
              SignBridge AI provides experimental assistive communication technologies, including machine-learning gesture recognition, speech transcription, and conversational synthesis. The system is designed to facilitate general dialogue and bridge understanding between signing and non-signing communicators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Not a Certified Human Interpreter</h2>
            <p>
              Sign language recognition models can be affected by factors such as camera resolution, illumination, hand occlusion, dialectal variation, and non-standard gestures. 
              <strong> SignBridge AI does not replace certified sign language interpreters (such as RID or ASLI certified professionals) in high-stakes environments, including emergency medical care, legal proceedings, or regulatory compliance settings.</strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Acceptable Use</h2>
            <p>
              Users agree not to upload malicious media files, attempt to reverse-engineer server-side model weights, or deploy the service to harass or infringe upon the rights of others.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
