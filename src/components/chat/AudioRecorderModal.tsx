'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Play, Pause, Trash2, ArrowRight, RefreshCw, AlertCircle, Volume2 } from 'lucide-react';
import { AudioTranscriptionResult } from '@/lib/types';
import { formatDuration } from '@/lib/utils/cn';
import { apiUrl } from '@/lib/utils/env';

interface AudioRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady: (transcript: string) => void;
}

export default function AudioRecorderModal({
  isOpen,
  onClose,
  onTranscriptReady,
}: AudioRecorderModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Cleanup on close or unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    chunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone recording is not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 120) {
            // Auto stop at 2 minutes
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not access microphone';
      setErrorMessage(
        msg.includes('Permission denied') || msg.includes('NotAllowedError')
          ? 'Microphone permission was denied. Please allow microphone access in your browser settings.'
          : msg
      );
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTranscribeAndSubmit = async () => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      const res = await fetch(apiUrl('/api/v1/audio/transcriptions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationSeconds: recordingSeconds,
          mimeType: audioBlob.type,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.transcript) {
        onTranscriptReady(data.data.transcript);
        onClose();
      } else {
        throw new Error(data.error?.message || 'Transcription failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transcription request failed';
      setErrorMessage(msg);
    } finally {
      setIsTranscribing(false);
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingSeconds(0);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-modal-title"
    >
      <div className="bg-[#0b0e19] border border-white/[0.1] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 id="audio-modal-title" className="text-base font-bold text-white">
                Record Spoken Audio
              </h2>
              <p className="text-xs text-slate-400">Microphone speech-to-text pipeline</p>
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

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Central Recording Console */}
        <div className="py-8 flex flex-col items-center justify-center text-center rounded-2xl bg-[#060810] border border-white/[0.06] mb-6">
          {/* Duration Indicator */}
          <div className="text-3xl font-mono font-bold text-white mb-4">
            {formatDuration(recordingSeconds)}
          </div>

          {/* Pulsing visualizer effect */}
          {isRecording ? (
            <div className="flex items-center gap-1.5 h-12 mb-6">
              {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 80, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-cyan-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.08}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="h-12 flex items-center text-xs text-slate-400 mb-6 font-mono">
              {audioBlob ? 'Audio captured • Ready to transcribe' : 'Press button below to begin recording'}
            </div>
          )}

          {/* Action buttons */}
          {!audioBlob ? (
            !isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all cursor-pointer"
                title="Start Recording"
                aria-label="Start recording microphone"
              >
                <Mic className="w-7 h-7" />
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:scale-105 transition-all cursor-pointer animate-pulse"
                title="Stop Recording"
                aria-label="Stop recording microphone"
              >
                <Square className="w-6 h-6 fill-current" />
              </button>
            )
          ) : (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlayback}
                className="w-12 h-12 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center justify-center transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={discardRecording}
                className="w-12 h-12 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                title="Discard"
                aria-label="Discard recording"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {audioUrl && (
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleTranscribeAndSubmit}
            disabled={!audioBlob || isTranscribing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isTranscribing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Transcribing Speech...</span>
              </>
            ) : (
              <>
                <span>Transcribe Speech</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
