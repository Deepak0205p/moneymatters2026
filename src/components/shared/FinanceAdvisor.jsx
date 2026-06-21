'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Trash2, Sparkles, ArrowUp } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const QUICK_QUESTIONS = ['SIP kaise shuru karein?', 'Emergency fund kitna hona chahiye?', 'Credit card sahi hai ya nahi?', 'Pehla investment kahan karein?', 'Budget kaise banayein?'];
const TYPING_DOTS = [{
  id: 1,
  delay: 0
}, {
  id: 2,
  delay: 0.15
}, {
  id: 3,
  delay: 0.3
}];
export function FinanceAdvisor() {
  const {
    advisorMessages,
    advisorSessionCount,
    advisorConversationId,
    setAdvisorConversationId,
    addAdvisorMessage,
    clearAdvisorMessages,
    coins,
    completedModules,
    streak,
    masteredTerms,
    userName,
    isAdvisorOpen: isOpen,
    setAdvisorOpen: setIsOpen
  } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [advisorMessages, isLoading, scrollToBottom]);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);
  const sendMessage = useCallback(async message => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    const userMsg = {
      role: 'user',
      content: trimmed,
      timestamp: Date.now()
    };
    addAdvisorMessage(userMsg);
    setInputValue('');
    setIsLoading(true);
    try {
      const recentMessages = advisorMessages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));
      const response = await fetch('/api/finance-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmed,
          conversationId: advisorConversationId,
          context: {
            coins,
            completedModules,
            streak,
            masteredTerms,
            userName,
            sessionCount: advisorSessionCount,
            recentMessages,
            moduleContext: useAppStore.getState().moduleContext
          }
        })
      });
      const data = await response.json();
      if (data.conversationId && !advisorConversationId) {
        setAdvisorConversationId(data.conversationId);
      }
      if (data.reply) {
        const aiMsg = {
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now()
        };
        addAdvisorMessage(aiMsg);
      } else if (data.error) {
        const errorMsg = {
          role: 'assistant',
          content: `⚠️ ${data.error}`,
          timestamp: Date.now()
        };
        addAdvisorMessage(errorMsg);
      }
    } catch {
      const errorMsg = {
        role: 'assistant',
        content: 'Arre yaar, connection issue aa gaya! 🙏 Thoda der baad try karo — internet check kar lo!',
        timestamp: Date.now()
      };
      addAdvisorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addAdvisorMessage, advisorMessages, coins, completedModules, streak, masteredTerms, userName, advisorSessionCount]);
  const handleSubmit = e => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  const handleQuickQuestion = question => {
    sendMessage(question);
  };
  const handleClear = () => {
    clearAdvisorMessages();
  };
  const hasMessages = advisorMessages.length > 0;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(AnimatePresence, {
      children: !isOpen && /*#__PURE__*/_jsxs(motion.button, {
        initial: {
          scale: 0,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        exit: {
          scale: 0,
          opacity: 0
        },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20
        },
        onClick: () => setIsOpen(true),
        className: "fixed z-50 md:bottom-6 bottom-20 right-4 md:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#0a0a0f] shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center transition-shadow group",
        "aria-label": "Money Matters se baat karo",
        children: [/*#__PURE__*/_jsx(MessageCircle, {
          className: "w-6 h-6 group-hover:scale-110 transition-transform"
        }), /*#__PURE__*/_jsx(motion.span, {
          className: "absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f]",
          animate: {
            scale: [1, 1.2, 1]
          },
          transition: {
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }
        }), /*#__PURE__*/_jsx("span", {
          className: "absolute inset-0 rounded-full animate-chat-pulse bg-amber-400/30"
        })]
      })
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: isOpen && /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 25
        },
        className: "fixed z-50 md:bottom-6 md:right-6 bottom-0 right-0 left-0 md:left-auto w-full md:w-[400px] h-[85vh] md:h-[560px] bg-[#0d0d14]/98 backdrop-blur-xl border border-white/[0.08] md:rounded-2xl rounded-t-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-[#0a0a0f]/90 to-[#12121a]/90",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20",
              children: /*#__PURE__*/_jsx(Sparkles, {
                className: "w-5 h-5 text-[#0a0a0f]"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-sm font-bold text-gradient-gold",
                children: "Money Matters"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[10px] text-[#a0a0b8]",
                children: "Aapka personal finance advisor"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1",
            children: [hasMessages && /*#__PURE__*/_jsx("button", {
              onClick: handleClear,
              className: "p-2 rounded-lg text-[#8888a0] hover:text-red-400 hover:bg-red-400/10 transition-colors",
              "aria-label": "Chat clear karo",
              title: "Clear chat",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "w-4 h-4"
              })
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setIsOpen(false),
              className: "p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors",
              "aria-label": "Chat band karo",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-4 h-4"
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 overflow-y-auto p-4 space-y-3 strategy-scroll",
          children: [!hasMessages && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 10
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              delay: 0.1
            },
            className: "text-center py-8",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10",
              children: /*#__PURE__*/_jsx(Sparkles, {
                className: "w-8 h-8 text-amber-400"
              })
            }), /*#__PURE__*/_jsx("h4", {
              className: "text-base font-bold text-white mb-1",
              children: "Namaste! \uD83D\uDE4F"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-sm text-[#a0a0b8] mb-4 leading-relaxed",
              children: ["Main hoon ", /*#__PURE__*/_jsx("span", {
                className: "text-amber-400 font-semibold",
                children: "Money Matters"
              }), " \u2014 aapka personal finance advisor!", /*#__PURE__*/_jsx("br", {}), "Poocho jo bhi jaanna hai paiso ke baare mein!"]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-2",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-xs text-[#6666a0] mb-2",
                children: "Ye try karo \uD83D\uDC47"
              }), QUICK_QUESTIONS.map((q, i) => /*#__PURE__*/_jsx(motion.button, {
                initial: {
                  opacity: 0,
                  x: -10
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                transition: {
                  delay: 0.2 + i * 0.05
                },
                onClick: () => handleQuickQuestion(q),
                className: "w-full text-left px-3 py-2.5 rounded-xl text-sm text-amber-200 bg-amber-400/[0.07] border border-amber-400/[0.12] hover:bg-amber-400/[0.14] hover:border-amber-400/20 transition-colors",
                children: q
              }, q))]
            })]
          }), advisorMessages.map((msg, index) => /*#__PURE__*/_jsx(motion.div, {
            initial: {
              opacity: 0,
              y: 8,
              scale: 0.97
            },
            animate: {
              opacity: 1,
              y: 0,
              scale: 1
            },
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 25
            },
            className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`,
            children: /*#__PURE__*/_jsxs("div", {
              className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-amber-500/90 text-[#0a0a0f] font-medium rounded-br-md' : 'bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.06] rounded-bl-md'}`,
              style: {
                boxShadow: msg.role === 'user' ? '0 2px 12px rgba(245,158,11,0.2)' : '0 2px 8px rgba(0,0,0,0.3)'
              },
              children: [/*#__PURE__*/_jsx("div", {
                className: "whitespace-pre-wrap break-words",
                children: msg.content
              }), /*#__PURE__*/_jsx("div", {
                className: `text-[9px] mt-1 ${msg.role === 'user' ? 'text-[#0a0a0f]/50' : 'text-[#6666a0]'}`,
                children: new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              })]
            })
          }, `${msg.timestamp}-${index}`)), isLoading && /*#__PURE__*/_jsx(motion.div, {
            initial: {
              opacity: 0,
              y: 8
            },
            animate: {
              opacity: 1,
              y: 0
            },
            className: "flex justify-start",
            children: /*#__PURE__*/_jsx("div", {
              className: "bg-[#1a1a2e] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5",
              children: TYPING_DOTS.map(dot => /*#__PURE__*/_jsx(motion.span, {
                className: "w-2 h-2 bg-amber-400/60 rounded-full",
                animate: {
                  y: [0, -6, 0],
                  opacity: [0.4, 1, 0.4]
                },
                transition: {
                  repeat: Infinity,
                  duration: 0.8,
                  delay: dot.delay,
                  ease: 'easeInOut'
                }
              }, dot.id))
            })
          }), /*#__PURE__*/_jsx("div", {
            ref: messagesEndRef
          })]
        }), hasMessages && !isLoading && /*#__PURE__*/_jsx("div", {
          className: "px-4 pb-2",
          children: /*#__PURE__*/_jsx("div", {
            className: "flex gap-1.5 overflow-x-auto pb-1 scrollbar-none",
            children: QUICK_QUESTIONS.map(q => /*#__PURE__*/_jsx("button", {
              onClick: () => handleQuickQuestion(q),
              className: "shrink-0 text-[11px] px-2.5 py-1.5 rounded-full text-amber-300/80 bg-amber-400/[0.07] border border-amber-400/[0.1] hover:bg-amber-400/[0.14] transition-colors",
              children: q
            }, q))
          })
        }), hasMessages && /*#__PURE__*/_jsx("div", {
          className: "px-4 pb-1",
          children: /*#__PURE__*/_jsx("p", {
            className: "text-[9px] text-[#5555a0] text-center",
            children: "\u26A0\uFE0F Ye educational advice hai, professional consultation ki jagah nahi"
          })
        }), /*#__PURE__*/_jsxs("form", {
          onSubmit: handleSubmit,
          className: "flex items-center gap-2 px-4 py-3 border-t border-white/[0.06] bg-[#0a0a0f]/60",
          children: [/*#__PURE__*/_jsx("input", {
            ref: inputRef,
            type: "text",
            value: inputValue,
            onChange: e => setInputValue(e.target.value),
            placeholder: "Apna sawaal poocho...",
            disabled: isLoading,
            className: "flex-1 bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-[#e8e8ed] placeholder-[#6666a0] focus:outline-none focus:border-amber-400/30 focus:ring-1 focus:ring-amber-400/20 disabled:opacity-50 transition-colors",
            maxLength: 500
          }), /*#__PURE__*/_jsx("button", {
            type: "submit",
            disabled: !inputValue.trim() || isLoading,
            className: "w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0a0a0f] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95",
            "aria-label": "Send message",
            children: /*#__PURE__*/_jsx(ArrowUp, {
              className: "w-5 h-5"
            })
          })]
        })]
      })
    })]
  });
}