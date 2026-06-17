"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Sparkles, Globe, Bot } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isSearch?: boolean;
};

const SUGGESTIONS = [
  'SIP kaise shuru karun?',
  'Budget 50/30/20 kya hai?',
  'Emergency fund kitna rakhun?',
  'Credit score kaise badhayein?',
];

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    user, coins, streak, completedModules, masteredTerms,
    advisorMessages, addAdvisorMessage, clearAdvisorMessages, advisorSessionCount,
  } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'system',
          content: `Namaste ${user?.displayName || 'Champion'}! Main hoon Rupaiya Guru — tumhara AI Financial Advisor. Paisa, budget, SIP, debt — kuch bhi pucho, Hinglish mein jawab dunga!`,
        },
      ]);
      if (advisorMessages.length > 0) {
        setMessages((prev) => [
          ...prev,
          ...advisorMessages.map((m, i) => ({
            id: `hist-${i}`,
            role: m.role,
            content: m.content,
          })),
        ]);
      }
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/finance-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          context: {
            userName: user?.displayName || 'User',
            coins,
            streak,
            completedModules,
            masteredTerms,
            sessionCount: advisorSessionCount,
            recentMessages: advisorMessages.slice(-6),
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const replyMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.reply,
          isSearch: data.usedSearch,
        };
        setMessages((prev) => [...prev, replyMsg]);
        addAdvisorMessage({ role: 'user', content: currentInput, timestamp: Date.now() });
        addAdvisorMessage({ role: 'assistant', content: data.reply, timestamp: Date.now() });
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: `Sorry yaar, error aa gaya: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    clearAdvisorMessages();
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 0 32px rgba(16,185,129,0.50)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-midnight shadow-2xl transition-all duration-300 cursor-pointer ${
          isOpen ? 'rotate-90' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
          boxShadow: '0 8px 24px rgba(16,185,129,0.40)',
        }}
        aria-label="Open AI Finance Advisor"
      >
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai opacity-60" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-ai border-2 border-midnight" />
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 sm:bottom-24 sm:right-8 z-[60] flex h-[540px] max-h-[80vh] w-[calc(100vw-48px)] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-ai/20 glass-strong shadow-premium"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 bg-gradient-to-r from-emerald/8 to-ai/8 px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                    boxShadow: '0 0 12px rgba(16,185,129,0.35)',
                  }}
                >
                  <Bot size={20} className="text-midnight" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink text-sm">Rupaiya Guru</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-soft animate-pulse" />
                    <p className="text-[10px] text-emerald-soft font-medium">Online · AI Powered</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-xl p-2 text-ink-muted hover:bg-white/10 hover:text-ink transition-all cursor-pointer"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,185,129,0.20) transparent' }}
            >
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-soft to-emerald text-midnight rounded-br-md font-medium'
                        : msg.role === 'system'
                        ? 'bg-ai/10 border border-ai/20 text-ai-soft w-full text-center text-xs rounded-2xl'
                        : 'bg-white/5 border border-white/8 text-zinc-200 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' && msg.isSearch && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-soft mb-1.5 bg-emerald/10 w-fit px-2 py-0.5 rounded-full">
                        <Globe size={10} /> <span>Web Search</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-[13px] leading-relaxed">{msg.content}</div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/8 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-soft animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-soft animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-soft animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-ink-muted/60 mb-2 uppercase tracking-wider font-semibold">Try asking</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-ink-muted hover:border-emerald/30 hover:text-emerald-soft transition-all cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="border-t border-white/8 bg-midnight/60 p-3">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paisa finance ke baare mein pucho..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-sm text-ink outline-none focus:border-emerald/50 focus:bg-white/[0.07] transition-all placeholder:text-ink-muted/50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg text-midnight disabled:opacity-30 transition-all cursor-pointer"
                  style={{
                    background:
                      !input.trim() || isLoading
                        ? 'rgba(255,255,255,0.15)'
                        : 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                  }}
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
