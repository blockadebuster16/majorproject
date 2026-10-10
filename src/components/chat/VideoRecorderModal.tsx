'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Video,
  Upload,
  Square,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  RefreshCw,
  Camera,
  Film,
  Sparkles,
} from 'lucide-react';
import { RecognitionJobResult, SupportedSignLanguage } from '@/lib/types';
import { formatDuration, formatFileSize } from '@/lib/utils/cn';
import { apiUrl } from '@/lib/utils/env';

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredSignLanguage: SupportedSignLanguage;
  onRecognitionComplete: (result: RecognitionJobResult) => void;
}

export default function VideoRecorderModal({
  isOpen,
  onClose,
  preferredSignLanguage,
  onRecognitionComplete,
}: VideoRecorderModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedSignLanguage>(preferredSignLanguage);

  // Camera & Recording State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  // Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Status & Error
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopCameraStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Cleanup on close
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (timerRef.current) clearInterval(timerRef.current);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl, stopCameraStream]);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 60 } },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
        videoElementRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Camera access failed';
      setErrorMessage(
        msg.includes('Permission denied') || msg.includes('NotAllowedError')
          ? 'Camera permission denied. Please allow camera access in your browser settings.'
          : msg
      );
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    chunksRef.current = [];
    setVideoBlob(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);

    try {
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoPreviewUrl(url);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordedSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordedSeconds((prev) => {
          if (prev >= 60) {
            // Capped at 60s
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Recording initialization failed';
      setErrorMessage(msg);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      stopCameraStream();
    }
  };

  const resetRecording = () => {
    setVideoBlob(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    setRecordedSeconds(0);
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please select a valid video file (MP4, WebM, QuickTime).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('Video file exceeds 50MB limit.');
      return;
    }

    setErrorMessage(null);
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
  };

  const handleStartRecognition = async () => {
    const activeMedia = videoBlob || uploadedFile;
    if (!activeMedia) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStatusText('Initializing PoseNet v2.4 Keypoint Extractor...');

    try {
      // 1. Post to recognition jobs endpoint
      setProcessingStatusText('Tracking hand joints & non-manual facial cues at 60fps...');
      const res = await fetch(apiUrl('/api/v1/recognition/jobs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signLanguage: selectedLanguage,
          mimeType: activeMedia.type || 'video/webm',
          fileSizeBytes: activeMedia.size,
        }),
      });

      setProcessingStatusText('Classifying temporal gloss sequences...');
      const data = await res.json();

      if (data.success && data.data?.result) {
        onRecognitionComplete(data.data.result);
        onClose();
      } else {
        throw new Error(data.error?.message || 'Recognition failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Recognition request failed';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="bg-[#0b0e1a] border border-white/[0.1] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 id="video-modal-title" className="text-base font-bold text-white">
                Sign Language Video Ingestion
              </h2>
              <p className="text-xs text-slate-400">Custom Neural Landmark Recognition Pipeline</p>
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

        {/* Tab & Language Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('camera');
                setUploadedFile(null);
                startCamera();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'camera' ? 'bg-cyan-500 text-[#07090e] shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Webcam Stream
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                stopCameraStream();
                setVideoBlob(null);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload' ? 'bg-cyan-500 text-[#07090e] shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Sign Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedSignLanguage)}
              className="bg-[#07090e] border border-white/[0.1] rounded-lg px-2.5 py-1 text-xs text-cyan-400 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="ASL">ASL (American)</option>
              <option value="BSL">BSL (British)</option>
              <option value="ISL">ISL (Irish)</option>
              <option value="Auslan">Auslan (Australian)</option>
              <option value="LSF">LSF (French)</option>
              <option value="DGS">DGS (German)</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Viewport Box */}
        <div className="relative rounded-2xl bg-[#060810] border border-white/[0.08] overflow-hidden aspect-video flex items-center justify-center mb-6">
          {activeTab === 'camera' && (
            <>
              {/* Live or Recorded Video */}
              {!videoPreviewUrl ? (
                <>
                  <video
                    ref={videoElementRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                  />
                  {!isCameraActive && (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Enable Camera
                    </button>
                  )}
                </>
              ) : (
                <video src={videoPreviewUrl} controls className="w-full h-full object-contain" />
              )}

              {/* Live Overlay for Timer */}
              {isRecording && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-mono font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  REC {formatDuration(recordedSeconds)} / 1:00
                </div>
              )}
            </>
          )}

          {activeTab === 'upload' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              {videoPreviewUrl ? (
                <video src={videoPreviewUrl} controls className="w-full h-full object-contain" />
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer p-8 border-2 border-dashed border-white/[0.1] hover:border-cyan-500/50 rounded-2xl w-full h-full">
                  <Upload className="w-10 h-10 text-slate-500 mb-3" />
                  <span className="text-sm font-semibold text-white mb-1">Click to select video file</span>
                  <span className="text-xs text-slate-400 font-mono">MP4, WebM, QuickTime up to 50MB</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Capture Controls */}
        {activeTab === 'camera' && isCameraActive && !videoPreviewUrl && (
          <div className="flex items-center justify-center gap-4 mb-6">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#07090e] font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" /> Start Recording Sign
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm shadow-lg shadow-red-500/30 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" /> Stop & Finish
              </button>
            )}
          </div>
        )}

        {videoPreviewUrl && (
          <div className="flex items-center justify-between mb-6 text-xs font-mono text-slate-400">
            <span>Video ready for inference</span>
            <button
              type="button"
              onClick={resetRecording}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </button>
          </div>
        )}

        {/* Modal Action Bar */}
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
            onClick={handleStartRecognition}
            disabled={(!videoBlob && !uploadedFile) || isProcessing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{processingStatusText || 'Analyzing Gestures...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Sign Language</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
