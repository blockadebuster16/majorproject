import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SignBridge
        </Link>

        {/* Draft Notice Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">DEVELOPMENT DRAFT NOTICE:</span> This document represents the architectural privacy and data retention specification during development. It must undergo formal legal counsel review before production publishing.
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Privacy & Data Retention Policy (Draft)
        </h1>
        <p className="text-xs font-mono text-slate-400 mb-8">
          Last Updated: March 2026 • Document Version: 1.0-draft
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Core Privacy Commitment</h2>
            <p>
              SignBridge AI is dedicated to protecting user communication, particularly visual gesture data which constitutes sensitive biometric and behavioral information. We adhere strictly to data minimization principles: we do not store raw gesture videos permanently.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Video & Audio Ingestion Lifecycle</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>
                <strong className="text-slate-200">Ephemeral Processing</strong>: Uploaded or recorded sign language video files are processed in an isolated sandbox. Once temporal pose landmarks (hands, face, pose) are extracted and translated, raw video files are scheduled for automatic purge within 48 hours.
              </li>
              <li>
                <strong className="text-slate-200">Audio Ingestion</strong>: Microphone recordings are converted to audio buffers solely for speech-to-text transcription and purged immediately thereafter.
              </li>
              <li>
                <strong className="text-slate-200">No Model Training Without Explicit Consent</strong>: We never train third-party models on user conversation or video records by default.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Third-Party AI Services</h2>
            <p>
              When user requests are forwarded to conversational LLM providers (e.g. OpenAI or custom endpoints), only the verified or edited text representation is transmitted. Media files and biometric landmarks are never sent to external LLMs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. User Rights & Data Deletion</h2>
            <p>
              Users have the complete right to export their conversation history, clear individual sessions, or delete their account profile at any time through the in-app Settings modal.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
