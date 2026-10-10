'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  Settings,
  LogOut,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sliders,
  Check,
  X,
} from 'lucide-react';
import { Conversation, UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  userProfile: UserProfile;
  onOpenSettings: () => void;
  onSignOut: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
  userProfile,
  onOpenSettings,
  onSignOut,
  isOpen,
  onToggleOpen,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEditing = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(id);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={onToggleOpen}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-40 flex flex-col w-72 bg-[#090c15] border-r border-white/[0.08] text-slate-300 transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden'
        )}
        aria-label="Conversation History Sidebar"
      >
        {/* Top Header & Brand */}
        <div className="p-4 flex items-center justify-between border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight">SignBridge AI</span>
              <span className="text-[10px] text-cyan-400 font-mono">Workspace</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onToggleOpen}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            id="new-chat-btn"
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/[0.1]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1">
            Recent Conversations ({filteredConversations.length})
          </div>

          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const isEditing = conv.id === editingId;

              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    'group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all',
                    isActive
                      ? 'bg-white/[0.08] text-white border border-white/[0.1] font-medium'
                      : 'hover:bg-white/[0.03] text-slate-400 hover:text-slate-200'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className={cn('w-3.5 h-3.5 shrink-0', isActive ? 'text-cyan-400' : 'text-slate-500')} />
                    {isEditing ? (
                      <form onSubmit={(e) => saveEditing(conv.id, e)} className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-[#07090e] border border-cyan-500 text-white text-xs px-1.5 py-0.5 rounded w-full focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={cancelEditing} className="p-1 text-slate-400 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate">{conv.title}</span>
                    )}
                  </div>

                  {/* Actions on hover */}
                  {!isEditing && (
                    <div className="hidden group-hover:flex items-center gap-1 ml-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => startEditing(conv, e)}
                        className="p-1 text-slate-400 hover:text-cyan-400 rounded"
                        title="Rename"
                        aria-label="Rename conversation"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(conv.id, e)}
                        className="p-1 text-slate-400 hover:text-red-400 rounded"
                        title="Delete"
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* User Profile & Settings Footer */}
        <div className="p-3 border-t border-white/[0.08] bg-[#07090e]/60 space-y-2">
          {/* User badge */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                {userProfile.displayName[0] || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">{userProfile.displayName}</span>
                <span className="text-[10px] text-cyan-400 font-mono">Sign: {userProfile.preferredSignLanguage}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              title="Settings"
              aria-label="Open settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Sign Out button */}
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
