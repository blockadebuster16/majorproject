'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Check, ArrowRight, Video, RefreshCw, Eye, MessageSquare, Hand } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  gesture: string;
  videoPlaceholderText: string;
  recognizedText: string;
  confidence: number;
  glosses: string[];
  aiResponse: string;
}

const scenarios: Scenario[] = [
  {
    id: 'asl-greeting',
    title: 'ASL Greeting & Introduction',
    gesture: 'HELLO + I + EXCITED + TEST + SIGN-BRIDGE',
    videoPlaceholderText: 'Webcam feed: 3D Hand keypoints mapped at (X, Y, Z). High pose stability.',
    recognizedText: 'Hello! I am excited to test this AI translation bridge.',
    confidence: 0.961,
    glosses: ['HELLO', 'I', 'EXCITED', 'TEST', 'SIGN-BRIDGE'],
    aiResponse:
      'Welcome to SignBridge AI! It is wonderful to connect. Your gestures were recognized with 96.1% confidence. How can I help you today?',
  },
  {
    id: 'question-asl',
    title: 'Inquiry on Accessibility',
    gesture: 'PLEASE + EXPLAIN + ACCESSIBLE + SETTING',
    videoPlaceholderText: 'Webcam feed: Facial non-manual markers (eyebrows raised for question syntax).',
    recognizedText: 'Can you please explain how this platform supports accessible settings?',
    confidence: 0.938,
    glosses: ['PLEASE', 'EXPLAIN', 'ACCESSIBLE', 'SETTING'],
    aiResponse:
      'SignBridge includes high-contrast visual modes, reduced-motion overrides, screen reader semantic trees, and editable review steps before text dispatch.',
  },
];

export default function InteractiveDemoSection() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [stage, setStage] = useState<'idle' | 'analyzing' | 'recognized' | 'responded'>('idle');
  const [customText, setCustomText] = useState(scenarios[0].recognizedText);

  const handleSelectScenario = (s: Scenario) => {
    setSelectedScenario(s);
    setCustomText(s.recognizedText);
    setStage('idle');
  };

  const handleRunRecognition = () => {
    setStage('analyzing');
    setTimeout(() => {
      setStage('recognized');
    }, 1200);
  };

  const handleSendToAI = () => {
    setStage('responded');
  };

  return (
    <section id="demo" className="py-28 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Interactive Product Preview
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Experience the Gesture Pipeline Live
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Test the step-by-step workflow: observe spatial landmark analysis, review recognized glosses, and trigger conversational AI responses.
          </p>
        </div>

        {/* Demo Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Scenario Selector */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Sample Scenario
            </h3>
            {scenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectScenario(s)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedScenario.id === s.id
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm">{s.title}</span>
                  {selectedScenario.id === s.id && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="text-xs font-mono text-cyan-400/80 mb-2">{s.gesture}</div>
                <div className="text-xs text-slate-400 line-clamp-2">{s.recognizedText}</div>
              </button>
            ))}

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-300">
                <Eye className="w-4 h-4 text-indigo-400" /> Model Integrity Notice
              </div>
              <p>
                This interactive preview demonstrates our standard state transitions and UI pipeline. The full chat app connects directly to the dedicated model adapter.
              </p>
            </div>
          </div>

          {/* Right: Live Interactive Workflow Mockup */}
          <div className="lg:col-span-8 rounded-3xl bg-[#0c101d] border border-white/[0.1] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Top header of mockup */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">Pipeline Sandbox: {selectedScenario.title}</span>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                PoseNet v2.4 Active
              </span>
            </div>

            {/* Video / Keypoint Simulator Box */}
            <div className="relative rounded-2xl bg-[#07090e] border border-white/[0.08] p-6 mb-6 overflow-hidden min-h-[160px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" /> Simulated Video Capture Stream
                </span>
                <span className="text-emerald-400">FPS: 60 • Resolution: 1080p</span>
              </div>

              <div className="my-4 text-xs font-mono text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                {selectedScenario.videoPlaceholderText}
              </div>

              {stage === 'idle' && (
                <button
                  type="button"
                  onClick={handleRunRecognition}
                  className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#07090e] font-bold text-xs shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Run Gesture Recognition
                </button>
              )}

              {stage === 'analyzing' && (
                <div className="flex items-center gap-3 text-cyan-400 text-xs font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting 21-point hand landmarks & facial non-manuals...</span>
                </div>
              )}

              {(stage === 'recognized' || stage === 'responded') && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <Check className="w-4 h-4" /> Inference Complete ({selectedScenario.confidence * 100}% confidence)
                  </div>
                  <button
                    type="button"
                    onClick={handleRunRecognition}
                    className="text-xs text-slate-400 hover:text-white underline font-mono"
                  >
                    Re-analyze
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Recognized Text Review Card (Visible when recognized or responded) */}
            {(stage === 'recognized' || stage === 'responded') && (
              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 mb-6 transition-all animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Hand className="w-4 h-4" /> Recognized Sign Language Gloss
                  </span>
                  <div className="flex items-center gap-1.5">
                    {selectedScenario.glosses.map((g, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  disabled={stage === 'responded'}
                  className="w-full bg-[#07090e]/70 border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none"
                  rows={2}
                />

                {stage === 'recognized' && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Edit text above if needed, then forward to conversational AI.
                    </span>
                    <button
                      type="button"
                      onClick={handleSendToAI}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs shadow-md hover:scale-105 transition-all"
                    >
                      Send to Conversational AI <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Conversational AI Response */}
            {stage === 'responded' && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.1] transition-all animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Assistant Response
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Latency: 820ms</span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed mb-4">
                  {selectedScenario.aiResponse}
                </p>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 transition-colors"
                  >
                    <Hand className="w-3.5 h-3.5 text-indigo-400" /> Show in Sign Language (Preview)
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">Tokens: 64</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
