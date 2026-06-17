'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Sparkles, Bot, BookOpen, Trash2, Lightbulb } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/**
 * ContextTutorChat — Context-Aware AI Tutor slide-over.
 *
 * Reads `moduleContext` + `isTutorChatOpen` from the Zustand store.
 * Sends the module's content as SYSTEM context to /api/chat so the AI
 * answers strictly based on what the user is currently reading.
 *
 * Design: Premium "Midnight Wealth" theme.
 *   - Purple (#8B5CF6) for AI bubbles + accents
 *   - Emerald (#10B981) for user action buttons
 *   - Glassmorphic slide-over with backdrop blur
 */
export function ContextTutorChat() {
  const { isTutorChatOpen, moduleContext, closeTutorChat, user } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset conversation when the chat opens with a new module context
  useEffect(() => {
    if (isTutorChatOpen && moduleContext) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Namaste${user?.displayName ? ` ${user.displayName.split(' ')[0]}` : ''}! 👋\n\nMain tumhara AI Tutor hoon. Abhi tum **${moduleContext.moduleTitle}** module padh rahe ho — specifically "${moduleContext.cardTitle}".\n\nIs topic ke baare mein kuch bhi pucho — main is content ke base pe samjhaunga! 💡`,
        },
      ]);
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isTutorChatOpen, moduleContext?.moduleId, moduleContext?.cardTitle, user?.displayName]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: input.trim() };
      const newMessages = [...messages.filter((m) => m.id !== 'welcome'), userMsg];
      setMessages((prev) => [...prev, userMsg]);
      const currentInput = input.trim();
      setInput('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            moduleContext: moduleContext
              ? {
                  moduleId: moduleContext.moduleId,
                  moduleTitle: moduleContext.moduleTitle,
                  moduleDescription: moduleContext.moduleDescription,
                  cardTitle: moduleContext.cardTitle,
                  cardTopic: moduleContext.cardTopic,
                  cardContent: moduleContext.cardContent,
                }
              : null,
            userName: user?.displayName || 'Learner',
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessages((prev) => [
            ...prev,
            { id: `a-${Date.now()}`, role: 'assistant', content: data.reply },
          ]);
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: `Arre yaar, error aa gaya: ${error.message}\n\nThoda der baad try karo! 🙏`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, moduleContext, user?.displayName]
  );

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: moduleContext
          ? `Fir se shuru karte hain! 💪 **${moduleContext.moduleTitle}** ke baare mein kya puchna hai?`
          : `Kya puchna hai? Pucho! 💡`,
      },
    ]);
  };

  // Suggested questions based on the current card
  const suggestions =
    moduleContext && moduleContext.cardTitle
      ? [
          `"${moduleContext.cardTitle}" ko simple words mein samjhao`,
          'Iska ek real-life example do',
          'Is topic mein common mistakes kya hain?',
        ]
      : ['SIP kya hota hai?', 'Budget kaise banau?', 'Emergency fund kitna rakhu?'];

  return (
    <AnimatePresence>
      {isTutorChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeTutorChat}
            className="fixed inset-0 z-[90] bg-midnight/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-over panel (right side) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-[95] w-full sm:w-[440px] flex flex-col glass-strong border-l border-ai/20 shadow-premium"
            role="dialog"
            aria-label="AI Tutor chat"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/8 bg-gradient-to-r from-ai/10 to-emerald/5">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #A78BFA, #8B5CF6 60%, #6D28D9)',
                    boxShadow: '0 0 14px rgba(139,92,246,0.40)',
                  }}
                >
                  <Bot size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-ink text-sm flex items-center gap-1.5">
                    AI Tutor
                    <span className="inline-flex items-center gap-1 rounded-full bg-ai/15 border border-ai/25 px-2 py-0.5 text-[9px] font-semibold text-ai-soft">
                      <Sparkles size={8} /> Context-Aware
                    </span>
                  </h3>
                  <p className="text-[10px] text-ink-muted truncate">
                    {moduleContext ? `📚 ${moduleContext.moduleTitle}` : 'General mode'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearChat}
                  className="rounded-lg p-2 text-ink-muted hover:bg-white/10 hover:text-ink transition-all"
                  title="Clear chat"
                  aria-label="Clear chat"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={closeTutorChat}
                  className="rounded-lg p-2 text-ink-muted hover:bg-white/10 hover:text-ink transition-all"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Module context banner */}
            {moduleContext && (
              <div className="shrink-0 px-5 py-3 border-b border-white/5 bg-ai/[0.04]">
                <div className="flex items-start gap-2.5">
                  <BookOpen size={14} className="text-ai-soft mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold text-ai-soft uppercase tracking-wider mb-0.5">
                      Current Context
                    </p>
                    <p className="text-xs text-ink font-medium truncate">
                      {moduleContext.cardTitle}
                    </p>
                    <p className="text-[10px] text-ink-muted truncate">
                      {moduleContext.cardTopic}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="flex gap-2 max-w-[88%]">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #A78BFA, #8B5CF6 60%, #6D28D9)',
                        }}
                      >
                        <Bot size={14} className="text-white" />
                      </div>
                      <div className="rounded-2xl rounded-tl-md px-4 py-2.5 bg-ai/10 border border-ai/20 text-ink">
                        <div className="whitespace-pre-wrap text-[13px] leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 bg-gradient-to-r from-emerald-soft to-emerald text-midnight font-medium">
                      <div className="whitespace-pre-wrap text-[13px] leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex gap-2 max-w-[88%]">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #A78BFA, #8B5CF6 60%, #6D28D9)',
                      }}
                    >
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-md px-4 py-3.5 bg-ai/10 border border-ai/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-ai-soft animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-ai-soft animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-ai-soft animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="shrink-0 px-4 pb-2">
                <p className="text-[10px] text-ink-muted/70 mb-2 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Lightbulb size={11} className="text-gold-soft" /> Try asking
                </p>
                <div className="flex flex-col gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-left rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-[11px] text-ink-muted hover:border-ai/30 hover:text-ai-soft hover:bg-ai/5 transition-all cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="shrink-0 border-t border-white/8 p-3 bg-midnight/40">
              <div className="relative flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    moduleContext
                      ? `Ask about "${moduleContext.cardTitle}"...`
                      : 'Apna sawaal pucho...'
                  }
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-3 text-sm text-ink outline-none focus:border-ai/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-ai/15 transition-all placeholder:text-ink-muted/50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-midnight disabled:opacity-30 transition-all cursor-pointer shrink-0"
                  style={{
                    background:
                      !input.trim() || isLoading
                        ? 'rgba(255,255,255,0.15)'
                        : 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                    boxShadow:
                      !input.trim() || isLoading
                        ? 'none'
                        : '0 4px 14px rgba(16,185,129,0.30)',
                  }}
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
