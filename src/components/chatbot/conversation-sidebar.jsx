"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Plus, MessageSquare, Trash2, Loader2, Sparkles, X, Clock } from "lucide-react";

export function ConversationSidebar({ activeConversationId, onSelectConversation, onNewChat }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/chatbot/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [activeConversationId]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(`/api/chatbot/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) onNewChat();
    } catch (e) {
      console.error(e);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">

      {/* ── Sidebar Header ── */}
      <div className="px-4 pt-12 pb-4 border-b border-white/[0.05]">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="size-8 rounded-xl bg-gradient-to-br from-emerald-400/15 to-emerald-600/15 border border-emerald-500/25 flex items-center justify-center">
            <Sparkles className="size-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white font-display tracking-tight">Money Mentor</p>
            <p className="text-[10px] text-zinc-600">Chat History</p>
          </div>
        </div>

        {/* New chat button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { onNewChat(); setIsOpen(false); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:border-emerald-500/25 text-white text-sm font-semibold transition-all cursor-pointer"
        >
          <Plus className="size-4 text-emerald-400" />
          New conversation
        </motion.button>
      </div>

      {/* ── Conversation list ── */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-emerald-500/30" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
            <div className="size-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <MessageSquare className="size-5 text-zinc-700" />
            </div>
            <p className="text-xs text-zinc-500 font-medium">No conversations yet</p>
            <p className="text-[11px] text-zinc-700 mt-1">Start a new chat to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {/* Group label */}
            <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-widest px-2 mb-2">Recent</p>

            {conversations.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.035, duration: 0.3 }}
                onClick={() => { onSelectConversation(c.id); setIsOpen(false); }}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 ${
                  activeConversationId === c.id
                    ? "bg-emerald-500/[0.08] border border-emerald-500/20 shadow-sm"
                    : "border border-transparent hover:bg-white/[0.03] hover:border-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
                  {/* Icon */}
                  <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    activeConversationId === c.id
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-white/[0.04] text-zinc-600 group-hover:text-zinc-500"
                  }`}>
                    <MessageSquare className="size-3.5" />
                  </div>
                  <span className={`text-xs font-medium truncate transition-colors ${
                    activeConversationId === c.id ? 'text-emerald-300' : 'text-zinc-400 group-hover:text-zinc-300'
                  }`}>
                    {c.title || "New Conversation"}
                  </span>
                </div>

                {/* Delete on hover */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleDelete(c.id, e)}
                  className="size-6 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center hover:bg-red-500/10 shrink-0 ml-1"
                >
                  <Trash2 className="size-3 text-red-400" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-white/[0.04]">
        <p className="text-[10px] text-zinc-700 text-center">
          Conversations stored on this device
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Hamburger button ── */}
      <motion.button
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        className="absolute top-3.5 left-4 z-20 size-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center transition-all"
        title="Chat history"
      >
        <Menu className="size-4 text-zinc-400" />
      </motion.button>

      {/* ── Overlay + Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 z-30 bg-black/55 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: -290, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -290, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="absolute left-0 top-0 h-full w-[275px] z-40 shadow-2xl"
              style={{
                background: 'linear-gradient(180deg, #090E1C 0%, #070B17 100%)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 size-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
              >
                <X className="size-3.5 text-zinc-500" />
              </button>

              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
