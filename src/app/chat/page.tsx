'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Plus, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatComposer from '@/components/chat/ChatComposer';
import AudioRecorderModal from '@/components/chat/AudioRecorderModal';
import VideoRecorderModal from '@/components/chat/VideoRecorderModal';
import AvatarPreviewModal from '@/components/chat/AvatarPreviewModal';
import SettingsModal from '@/components/chat/SettingsModal';
import {
  ChatMessage,
  Conversation,
  RecognitionJobResult,
  UserProfile,
} from '@/lib/types';
import { DEFAULT_USER_PROFILE, INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '@/lib/services/conversation-store';
import { apiUrl } from '@/lib/utils/env';

export default function ChatPage() {
  const router = useRouter();

  // Authentication & Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(INITIAL_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES[INITIAL_CONVERSATIONS[0].id] || []);

  // UI Drawer & Modals State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Avatar Modal State
  const [avatarModalState, setAvatarModalState] = useState<{
    isOpen: boolean;
    messageId: string;
    text: string;
  }>({
    isOpen: false,
    messageId: '',
    text: '',
  });

  // Restore session from localStorage or seed
  useEffect(() => {
    const storedUser = localStorage.getItem('signbridge_auth_user');
    if (storedUser) {
      try {
        setUserProfile(JSON.parse(storedUser));
      } catch {
        // Fallback to default
      }
    }

    // Fetch conversations from server DB API
    fetch(apiUrl('/api/v1/conversations'))
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setConversations(data.data);
          setActiveConversationId(data.data[0].id);
        }
      })
      .catch(() => {
        // Fallback to initial seed
      });
  }, []);

  // Fetch messages whenever active conversation changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    fetch(apiUrl(`/api/v1/conversations/${activeConversationId}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.messages) {
          setMessages(data.data.messages);
        } else if (INITIAL_MESSAGES[activeConversationId]) {
          setMessages(INITIAL_MESSAGES[activeConversationId]);
        } else {
          setMessages([]);
        }
      })
      .catch(() => {
        if (INITIAL_MESSAGES[activeConversationId]) {
          setMessages(INITIAL_MESSAGES[activeConversationId]);
        }
      });
  }, [activeConversationId]);

  // Handler: Create New Conversation
  const handleNewConversation = async () => {
    try {
      const res = await fetch(apiUrl('/api/v1/conversations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const newConv = data.data;
        setConversations([newConv, ...conversations]);
        setActiveConversationId(newConv.id);
        setMessages([]);
      }
    } catch {
      const fallbackId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: fallbackId,
        userId: userProfile.id,
        title: 'New Conversation',
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
      };
      setConversations([newConv, ...conversations]);
      setActiveConversationId(fallbackId);
      setMessages([]);
    }
  };

  // Handler: Select Conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setErrorMessage(null);
  };

  // Handler: Rename Conversation
  const handleRenameConversation = async (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
    try {
      await fetch(apiUrl(`/api/v1/conversations/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch {
      // Ignore network failure on rename
    }
  };

  // Handler: Delete Conversation
  const handleDeleteConversation = async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        handleNewConversation();
      }
    }
    try {
      await fetch(apiUrl(`/api/v1/conversations/${id}`), { method: 'DELETE' });
    } catch {
      // Ignore
    }
  };

  // Handler: Send Message (Direct text or derived from audio/sign review)
  const handleSendMessage = async (
    text: string,
    modality: 'text' | 'audio' | 'video' = 'text',
    recognitionResult?: RecognitionJobResult
  ) => {
    let currentConvId = activeConversationId;
    if (!currentConvId) {
      await handleNewConversation();
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    const now = new Date().toISOString();
    const tempUserMsgId = `msg_tmp_${Date.now()}`;

    // Optimistically append user message
    const optimisticUserMessage: ChatMessage = {
      id: tempUserMsgId,
      conversationId: currentConvId,
      userId: userProfile.id,
      role: 'user',
      content: text,
      inputModality: modality,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
      recognitionResult,
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);

    try {
      const res = await fetch(apiUrl(`/api/v1/conversations/${currentConvId}/messages`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userProfile.id,
        },
        body: JSON.stringify({
          content: text,
          inputModality: modality,
          recognizedSignText: modality === 'video' ? text : undefined,
          audioTranscript: modality === 'audio' ? text : undefined,
          preferredSignLanguage: userProfile.preferredSignLanguage,
          recognitionResult,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.assistantMessage) {
        const assistantMsg: ChatMessage = data.data.assistantMessage;
        setMessages((prev) => [...prev, assistantMsg]);

        // Update conversation title in list if first message
        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConvId
              ? {
                  ...c,
                  title: c.messageCount === 0 || c.title === 'New Conversation' ? text.slice(0, 32) : c.title,
                  lastMessageAt: new Date().toISOString(),
                }
              : c
          )
        );
      } else {
        throw new Error(data.error?.message || 'Failed to generate response');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Message generation failed';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: When Sign Recognition completes from VideoRecorderModal
  const handleRecognitionComplete = (result: RecognitionJobResult) => {
    let currentConvId = activeConversationId;
    if (!currentConvId) return;

    // Post an explicit gesture video user message containing the recognition review card
    const userMsgId = `msg_rec_${Date.now()}`;
    const gestureMessage: ChatMessage = {
      id: userMsgId,
      conversationId: currentConvId,
      userId: userProfile.id,
      role: 'user',
      content: result.recognizedText,
      inputModality: 'video',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recognitionResult: result,
    };

    setMessages((prev) => [...prev, gestureMessage]);

    // If autoSend is enabled in user settings, immediately forward to assistant
    if (userProfile.autoSendRecognizedText) {
      handleSendMessage(result.recognizedText, 'video', result);
    }
  };

  // Handler: When Audio Transcription completes from AudioRecorderModal
  const handleTranscriptReady = (transcript: string) => {
    handleSendMessage(transcript, 'audio');
  };

  // Handler: Open Avatar Integration Modal
  const handleOpenAvatarModal = (messageId: string, text: string) => {
    setAvatarModalState({
      isOpen: true,
      messageId,
      text,
    });
  };

  // Handler: Sign out
  const handleSignOut = () => {
    localStorage.removeItem('signbridge_auth_user');
    router.push('/login');
  };

  // Handler: Clear All Conversations
  const handleClearAllConversations = () => {
    setConversations([]);
    setMessages([]);
    handleNewConversation();
  };

  // Handler: Export Data as JSON
  const handleExportData = () => {
    const archive = {
      user: userProfile,
      conversations,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signbridge-archive-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-[#07090e] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Collapsible Left Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        userProfile={userProfile}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onSignOut={handleSignOut}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Conversation Workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Navbar */}
        <header className="h-14 px-4 border-b border-white/[0.08] flex items-center justify-between bg-[#07090e]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
              {conversations.find((c) => c.id === activeConversationId)?.title || 'SignBridge Workspace'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Sign: {userProfile.preferredSignLanguage}
            </span>
            <button
              type="button"
              onClick={handleNewConversation}
              className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white sm:hidden"
              title="New Chat"
              aria-label="New Chat"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="px-4 py-2.5 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs hover:underline text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Central Message Area */}
        <ChatMessageList
          messages={messages}
          onSelectPrompt={(prompt) => handleSendMessage(prompt, 'text')}
          onOpenVideoModal={() => setIsVideoModalOpen(true)}
          onOpenAudioModal={() => setIsAudioModalOpen(true)}
          onSendRecognizedText={(text) => handleSendMessage(text, 'video')}
          onOpenAvatarModal={handleOpenAvatarModal}
          isGenerating={isGenerating}
          targetSignLanguage={userProfile.preferredSignLanguage}
        />

        {/* Bottom-Anchored Composer */}
        <ChatComposer
          onSendMessage={(text) => handleSendMessage(text, 'text')}
          onOpenAudioModal={() => setIsAudioModalOpen(true)}
          onOpenVideoModal={() => setIsVideoModalOpen(true)}
          isGenerating={isGenerating}
          preferredSignLanguage={userProfile.preferredSignLanguage}
        />
      </main>

      {/* Audio Recorder Modal */}
      <AudioRecorderModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onTranscriptReady={handleTranscriptReady}
      />

      {/* Video Ingestion & Recognition Modal */}
      <VideoRecorderModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        preferredSignLanguage={userProfile.preferredSignLanguage}
        onRecognitionComplete={handleRecognitionComplete}
      />

      {/* Future AI Avatar Integration Modal */}
      <AvatarPreviewModal
        isOpen={avatarModalState.isOpen}
        onClose={() => setAvatarModalState({ isOpen: false, messageId: '', text: '' })}
        messageId={avatarModalState.messageId}
        conversationId={activeConversationId || ''}
        responseText={avatarModalState.text}
        targetLanguage={userProfile.preferredSignLanguage}
      />

      {/* User Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updates) => setUserProfile((prev) => ({ ...prev, ...updates }))}
        onClearAllConversations={handleClearAllConversations}
        onExportData={handleExportData}
      />
    </div>
  );
}
