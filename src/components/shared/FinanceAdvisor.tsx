'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Sparkles, ArrowUp } from 'lucide-react';
import { useAppStore, AdvisorMessage } from '@/lib/store/useAppStore';

const QUICK_QUESTIONS = [
  'SIP kaise shuru karein?',
  'Emergency fund kitna hona chahiye?',
  'Credit card sahi hai ya nahi?',
  'Pehla investment kahan karein?',
  'Budget kaise banayein?',
];

const TYPING_DOTS = [
  { id: 1, delay: 0 },
  { id: 2, delay: 0.15 },
  { id: 3, delay: 0.3 },
];

export function FinanceAdvisor() {
  const {
    advisorMessages,
    advisorSessionCount,
    addAdvisorMessage,
    clearAdvisorMessages,
    coins,
    completedModules,
    streak,
    masteredTerms,
    userName,
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [advisorMessages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!trimmed || isLoading) return;

      const userMsg: AdvisorMessage = {
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };
      addAdvisorMessage(userMsg);
      setInputValue('');
      setIsLoading(true);

      try {
        const recentMessages = advisorMessages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('/api/finance-advisor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            context: {
              coins,
              completedModules,
              streak,
              masteredTerms,
              userName,
              sessionCount: advisorSessionCount,
              recentMessages,
            },
          }),
        });

        const data = await response.json();

        if (data.reply) {
          const aiMsg: AdvisorMessage = {
            role: 'assistant',
            content: data.reply,
            timestamp: Date.now(),
          };
          addAdvisorMessage(aiMsg);
        } else if (data.error) {
          const errorMsg: AdvisorMessage = {
            role: 'assistant',
            content: `⚠️ ${data.error}`,
            timestamp: Date.now(),
          };
          addAdvisorMessage(errorMsg);
        }
      } catch {
        const errorMsg: AdvisorMessage = {
          role: 'assistant',
          content:
            'Arre yaar, connection issue aa gaya! 🙏 Thoda der baad try karo — internet check kar lo!',
          timestamp: Date.now(),
        };
        addAdvisorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addAdvisorMessage, advisorMessages, coins, completedModules, streak, masteredTerms, userName, advisorSessionCount]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleClear = () => {
    clearAdvisorMessages();
  };

  const hasMessages = advisorMessages.length > 0;

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed z-50 md:bottom-6 bottom-20 right-4 md:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#0a0a0f] shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center transition-shadow group"
            aria-label="Rupaiya Guru se baat karo"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {/* Green indicator dot */}
            <motion.span
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            {/* Pulse ring effect */}
            <span className="absolute inset-0 rounded-full animate-chat-pulse bg-amber-400/30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-50 md:bottom-6 md:right-6 bottom-0 right-0 left-0 md:left-auto
              w-full md:w-[400px] h-[85vh] md:h-[560px]
              bg-[#0d0d14]/98 backdrop-blur-xl
              border border-white/[0.08] md:rounded-2xl rounded-t-2xl
              shadow-2xl shadow-black/50
              flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-[#0a0a0f]/90 to-[#12121a]/90">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Sparkles className="w-5 h-5 text-[#0a0a0f]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gradient-gold">Rupaiya Guru</h3>
                  <p className="text-[10px] text-[#a0a0b8]">Aapka personal finance advisor</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {hasMessages && (
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-lg text-[#8888a0] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    aria-label="Chat clear karo"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Chat band karo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 strategy-scroll">
              {/* Welcome message if no messages */}
              {!hasMessages && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
                    <Sparkles className="w-8 h-8 text-amber-400" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Namaste! 🙏</h4>
                  <p className="text-sm text-[#a0a0b8] mb-4 leading-relaxed">
                    Main hoon <span className="text-amber-400 font-semibold">Rupaiya Guru</span> — aapka personal finance advisor!
                    <br />
                    Poocho jo bhi jaanna hai paiso ke baare mein!
                  </p>

                  {/* Quick Questions */}
                  <div className="space-y-2">
                    <p className="text-xs text-[#6666a0] mb-2">Ye try karo 👇</p>
                    {QUICK_QUESTIONS.map((q, i) => (
                      <motion.button
                        key={q}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        onClick={() => handleQuickQuestion(q)}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-amber-200 bg-amber-400/[0.07] border border-amber-400/[0.12] hover:bg-amber-400/[0.14] hover:border-amber-400/20 transition-colors"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Chat Messages */}
              {advisorMessages.map((msg, index) => (
                <motion.div
                  key={`${msg.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500/90 text-[#0a0a0f] font-medium rounded-br-md'
                        : 'bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.06] rounded-bl-md'
                    }`}
                    style={{
                      boxShadow:
                        msg.role === 'user'
                          ? '0 2px 12px rgba(245,158,11,0.2)'
                          : '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    <div
                      className={`text-[9px] mt-1 ${
                        msg.role === 'user' ? 'text-[#0a0a0f]/50' : 'text-[#6666a0]'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    {TYPING_DOTS.map((dot) => (
                      <motion.span
                        key={dot.id}
                        className="w-2 h-2 bg-amber-400/60 rounded-full"
                        animate={{
                          y: [0, -6, 0],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: dot.delay,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions (when chat is active, show inline) */}
            {hasMessages && !isLoading && (
              <div className="px-4 pb-2">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickQuestion(q)}
                      className="shrink-0 text-[11px] px-2.5 py-1.5 rounded-full text-amber-300/80 bg-amber-400/[0.07] border border-amber-400/[0.1] hover:bg-amber-400/[0.14] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {hasMessages && (
              <div className="px-4 pb-1">
                <p className="text-[9px] text-[#5555a0] text-center">
                  ⚠️ Ye educational advice hai, professional consultation ki jagah nahi
                </p>
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06] bg-[#0a0a0f]/60"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Apna sawaal poocho..."
                disabled={isLoading}
                className="flex-1 bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-[#e8e8ed] placeholder-[#6666a0] focus:outline-none focus:border-amber-400/30 focus:ring-1 focus:ring-amber-400/20 disabled:opacity-50 transition-colors"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0a0a0f] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95"
                aria-label="Send message"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
