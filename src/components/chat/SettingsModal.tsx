'use client';

import React, { useState } from 'react';
import { X, User, Sliders, Shield, Download, Trash2, Check, Sparkles, Activity } from 'lucide-react';
import { SupportedSignLanguage, UserProfile } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onClearAllConversations: () => void;
  onExportData: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onClearAllConversations,
  onExportData,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'preferences' | 'accessibility' | 'privacy'>('preferences');
  const [preferredLang, setPreferredLang] = useState<SupportedSignLanguage>(userProfile.preferredSignLanguage);
  const [autoSend, setAutoSend] = useState(userProfile.autoSendRecognizedText);
  const [reducedMotion, setReducedMotion] = useState(userProfile.reducedMotion);
  const [highContrast, setHighContrast] = useState(userProfile.highContrast);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile({
      preferredSignLanguage: preferredLang,
      autoSendRecognizedText: autoSend,
      reducedMotion,
      highContrast,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="bg-[#0b0e19] border border-white/[0.1] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-base font-bold text-white">
                Workspace Settings
              </h2>
              <p className="text-xs text-slate-400">Language preferences, accessibility & privacy</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'preferences' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Preferences & Language
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('accessibility')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'accessibility' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Accessibility
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'privacy' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Privacy & Data
          </button>
        </div>

        {/* Tab 1: Preferences */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Preferred Sign Language
              </label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as SupportedSignLanguage)}
                className="w-full bg-[#07090e] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans"
              >
                <option value="ASL">ASL (American Sign Language)</option>
                <option value="BSL">BSL (British Sign Language)</option>
                <option value="ISL">ISL (Irish Sign Language)</option>
                <option value="Auslan">Auslan (Australian Sign Language)</option>
                <option value="LSF">LSF (Langue des Signes Française)</option>
                <option value="DGS">DGS (Deutsche Gebärdensprache)</option>
              </select>
              <p className="mt-1.5 text-xs text-slate-400">
                Customizes gesture vocabulary models and formatting prompts.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <div className="text-xs font-bold text-white">Auto-forward Recognized Text</div>
                <div className="text-xs text-slate-400">
                  Automatically sends recognized signs to the AI without requiring manual review confirmation.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoSend}
                onChange={(e) => setAutoSend(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-[#07090e] border-white/[0.2]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Accessibility */}
        {activeTab === 'accessibility' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <div className="text-xs font-bold text-white">Reduced Motion Mode</div>
                <div className="text-xs text-slate-400">
                  Disables Three.js 3D kinetic rotations, streaming token pulses, and smooth scroll effects.
                </div>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-[#07090e] border-white/[0.2]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <div className="text-xs font-bold text-white">High Contrast UI</div>
                <div className="text-xs text-slate-400">
                  Accentuates container borders and text foreground contrast above 7:1 (AAA).
                </div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-[#07090e] border-white/[0.2]"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Privacy & Data */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Export Conversation Archive</div>
                <div className="text-xs text-slate-400">
                  Download all your session transcripts and model metadata as structured JSON.
                </div>
              </div>
              <button
                type="button"
                onClick={onExportData}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-300 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-red-400">Purge Conversation History</div>
                <div className="text-xs text-slate-400">
                  Permanently deletes all saved conversations and recognition records.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Permanently delete all conversations? This cannot be undone.')) {
                    onClearAllConversations();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
