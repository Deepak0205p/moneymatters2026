"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { getModuleById, getAllCardsForModule } from '@/data/modulesIndex';
import { StrategySlide } from '@/components/shared/StrategySlide';
import { StrategyOnboarding } from '@/components/shared/StrategyOnboarding';
import { getStrategiesForModule } from '@/lib/data/strategyRegistry';
import { X, CheckCircle2, Sparkles, ArrowUp, Bookmark, FileText, Send, Trash2 } from 'lucide-react';
import { RichContent, RainbowProgress, InteractiveQuizViewer, InteractiveCalculatorViewer, InteractiveChoiceViewer } from './CardContent';

/**
 * SwipeCardViewer — Full-page module learning experience.
 * Renders as a dedicated page (not an overlay). Navigation via keyboard,
 * mouse wheel, and touch swipe. Includes AI Tutor, notes, bookmarks.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SwipeCardViewer({
  moduleId,
  onClose,
  onComplete
}) {
  const allCards = getAllCardsForModule(moduleId);
  const activeModule = getModuleById(moduleId);
  const {
    moduleProgress,
    updateModuleProgress,
    setModuleContext
  } = useAppStore();
  const savedPercent = moduleProgress[moduleId] || 0;
  const initialIndex = Math.round(savedPercent / 100 * Math.max(allCards.length - 1, 0));
  const [currentIndex, setCurrentIndex] = useState(Math.min(initialIndex, allCards.length - 1));
  const contentRef = useRef(null);
  const touchStartY = useRef(0);
  const scrollAccumulator = useRef(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [onboardingStrategy, setOnboardingStrategy] = useState(null);
  const router = useRouter();

  // Get strategies embedded in this module (appear as bonus slides after last content card)
  const moduleStrategies = getStrategiesForModule(moduleId);
  const isLast = currentIndex === allCards.length - 1;
  const currentCard = allCards[currentIndex];
  useEffect(() => {
    const percentage = Math.floor(currentIndex / Math.max(allCards.length - 1, 1) * 100);
    updateModuleProgress(moduleId, percentage);
  }, [currentIndex, moduleId, allCards.length, updateModuleProgress]);
  useEffect(() => {
    if (!activeModule || !currentCard) return;
    setModuleContext({
      moduleId: activeModule.id,
      moduleTitle: activeModule.title,
      moduleDescription: activeModule.description,
      cardTitle: currentCard.title,
      cardTopic: currentCard.topicTitle,
      cardContent: currentCard.content
    });
  }, [activeModule, currentCard, setModuleContext]);
  useEffect(() => {
    if (!currentCard?.id) return;
    const cardId = currentCard.id;
    const raf = requestAnimationFrame(() => {
      const savedNotes = localStorage.getItem(`notes_${cardId}`);
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch {
          setNotes([]);
        }
      } else setNotes([]);
      const bookmarks = JSON.parse(localStorage.getItem('bookmarked_cards') || '[]');
      setBookmarked(bookmarks.includes(cardId));
    });
    return () => cancelAnimationFrame(raf);
  }, [currentCard?.id]);
  const addNote = () => {
    if (!newNote.trim()) return;
    const updated = [...notes, newNote.trim()];
    setNotes(updated);
    setNewNote('');
    if (currentCard?.id) localStorage.setItem(`notes_${currentCard.id}`, JSON.stringify(updated));
  };
  const deleteNote = index => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
    if (currentCard?.id) localStorage.setItem(`notes_${currentCard.id}`, JSON.stringify(updated));
  };
  const toggleBookmark = () => {
    if (!currentCard?.id) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_cards') || '[]');
    let updated;
    if (bookmarks.includes(currentCard.id)) {
      updated = bookmarks.filter(id => id !== currentCard.id);
      setBookmarked(false);
    } else {
      updated = [...bookmarks, currentCard.id];
      setBookmarked(true);
    }
    localStorage.setItem('bookmarked_cards', JSON.stringify(updated));
  };
  const handleNext = useCallback(() => {
    if (currentIndex < allCards.length - 1) setCurrentIndex(prev => prev + 1);
  }, [currentIndex, allCards.length]);
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentIndex]);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let lastScrollTime = 0;
    const handleWheel = e => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = el;
      const isScrollingDown = e.deltaY > 0;
      const now = Date.now();
      if (isScrollingDown) {
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 8;
        if (isAtBottom) {
          e.preventDefault();
          scrollAccumulator.current += e.deltaY;
          if (scrollAccumulator.current > 300 && now - lastScrollTime > 800) {
            lastScrollTime = now;
            scrollAccumulator.current = 0;
            handleNext();
          }
        } else scrollAccumulator.current = 0;
      } else {
        const isAtTop = scrollTop <= 8;
        if (isAtTop) {
          e.preventDefault();
          scrollAccumulator.current += e.deltaY;
          if (scrollAccumulator.current < -300 && now - lastScrollTime > 800) {
            lastScrollTime = now;
            scrollAccumulator.current = 0;
            handlePrev();
          }
        } else scrollAccumulator.current = 0;
      }
    };
    el.addEventListener('wheel', handleWheel, {
      passive: false
    });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrev]);
  const handleTouchStart = e => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = e => {
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const el = contentRef.current;
    if (!el) return;
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = el;
    if (diffY > 120 && scrollTop + clientHeight >= scrollHeight - 10) handleNext();else if (diffY < -120 && scrollTop <= 10) handlePrev();
  };
  if (!currentCard || !activeModule) return null;
  return /*#__PURE__*/_jsxs("main", {
    className: "min-h-screen w-full overflow-hidden bg-midnight relative",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060608]",
      children: [/*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0
        },
        animate: {
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15]
        },
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        },
        className: "absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[140px]",
        style: {
          backgroundColor: currentCard.color
        }
      }), /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0
        },
        animate: {
          scale: [1.3, 1, 1.3],
          opacity: [0.1, 0.25, 0.1]
        },
        transition: {
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        },
        className: "absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[140px]",
        style: {
          backgroundColor: currentCard.color
        }
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative z-10 w-full h-screen sm:max-w-[480px] sm:mx-auto sm:h-[94vh] sm:mt-[3vh] sm:rounded-3xl sm:border sm:border-white/[0.06] sm:overflow-hidden sm:shadow-2xl sm:shadow-black/50 flex flex-col bg-[#0F0F13]",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative z-30 flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0 bg-[#0F0F13]",
        children: [/*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 transition-colors active:scale-90 cursor-pointer",
          "aria-label": "Close",
          children: /*#__PURE__*/_jsx(X, {
            size: 14
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "text-center truncate px-2 max-w-[60%]",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-white/60 text-[11px] font-medium truncate",
            children: currentCard.topicTitle
          }), /*#__PURE__*/_jsx("p", {
            className: "text-[9px] font-extrabold tracking-widest uppercase truncate",
            style: {
              color: activeModule.color
            },
            children: activeModule.title
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-2",
          children: [/*#__PURE__*/_jsx("button", {
            onClick: () => {
              useAppStore.getState().openTutorChat();
            },
            className: "w-8 h-8 rounded-full bg-ai/20 border border-ai/50 flex items-center justify-center hover:bg-ai/30 text-ai-soft transition-colors active:scale-90 cursor-pointer",
            title: "Ask AI Tutor about this card",
            "aria-label": "Ask AI Tutor",
            children: /*#__PURE__*/_jsx(Sparkles, {
              size: 14
            })
          }), /*#__PURE__*/_jsx("button", {
            onClick: toggleBookmark,
            className: `w-8 h-8 rounded-full border flex items-center justify-center transition-colors active:scale-90 cursor-pointer ${bookmarked ? 'bg-gold/20 border-gold/50 text-gold-soft' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'}`,
            "aria-label": "Bookmark",
            children: /*#__PURE__*/_jsx(Bookmark, {
              size: 14,
              className: bookmarked ? 'fill-current' : ''
            })
          }), /*#__PURE__*/_jsxs("button", {
            onClick: () => setShowNotes(true),
            className: "w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 transition-colors active:scale-90 cursor-pointer relative",
            "aria-label": "Notes",
            children: [/*#__PURE__*/_jsx(FileText, {
              size: 14
            }), notes.length > 0 && /*#__PURE__*/_jsx("span", {
              className: "absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-black",
              children: notes.length
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex-1 overflow-hidden",
        children: [/*#__PURE__*/_jsx(AnimatePresence, {
          mode: "wait",
          children: /*#__PURE__*/_jsxs(motion.div, {
            className: "absolute inset-0 flex flex-col bg-[#0F0F13] select-none overflow-hidden",
            onTouchStart: handleTouchStart,
            onTouchEnd: handleTouchEnd,
            initial: {
              y: 200,
              opacity: 0,
              scale: 0.96
            },
            animate: {
              y: 0,
              opacity: 1,
              scale: 1
            },
            exit: {
              y: -200,
              opacity: 0,
              scale: 0.96
            },
            transition: {
              type: 'spring',
              stiffness: 250,
              damping: 25
            },
            children: [/*#__PURE__*/_jsx(RainbowProgress, {
              currentIndex: currentIndex,
              totalCount: allCards.length
            }), /*#__PURE__*/_jsxs("div", {
              ref: contentRef,
              className: "flex-1 overflow-y-auto px-6 pt-4 pb-12 space-y-4",
              style: {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              },
              children: [/*#__PURE__*/_jsxs("div", {
                className: "relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-lg flex flex-col justify-end p-6 bg-[#18181C]",
                style: {
                  height: '32%',
                  minHeight: '180px'
                },
                children: [/*#__PURE__*/_jsx(motion.div, {
                  className: "absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20",
                  style: {
                    backgroundColor: currentCard.color
                  },
                  animate: {
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15]
                  },
                  transition: {
                    repeat: Infinity,
                    duration: 6,
                    ease: 'easeInOut'
                  }
                }), /*#__PURE__*/_jsxs("div", {
                  className: "relative z-10 w-fit mt-auto",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-3xl mb-2 block",
                    children: currentCard.emoji
                  }), /*#__PURE__*/_jsx(motion.h3, {
                    className: "font-extrabold text-[17px] sm:text-[19px] tracking-tight leading-snug text-zinc-100",
                    initial: {
                      opacity: 0,
                      y: 15
                    },
                    animate: {
                      opacity: 1,
                      y: 0
                    },
                    transition: {
                      duration: 0.5,
                      delay: 0.1
                    },
                    children: currentCard.title
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-[11px] mt-1 font-medium",
                    style: {
                      color: currentCard.color
                    },
                    children: currentCard.topicTitle
                  })]
                })]
              }), /*#__PURE__*/_jsx(motion.div, {
                className: "pt-1",
                initial: {
                  opacity: 0,
                  y: 10
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                transition: {
                  delay: 0.1,
                  duration: 0.4
                },
                children: /*#__PURE__*/_jsx(RichContent, {
                  content: currentCard.content,
                  color: currentCard.color
                })
              }), currentCard.interactiveType === 'quiz' && currentCard.quizData && /*#__PURE__*/_jsx(InteractiveQuizViewer, {
                data: currentCard.quizData,
                color: currentCard.color
              }), currentCard.interactiveType === 'myth_buster' && currentCard.quizData && /*#__PURE__*/_jsx(InteractiveQuizViewer, {
                data: currentCard.quizData,
                color: currentCard.color
              }), currentCard.interactiveType === 'calculator' && currentCard.calcData && /*#__PURE__*/_jsx(InteractiveCalculatorViewer, {
                data: currentCard.calcData,
                color: currentCard.color
              }), currentCard.interactiveType === 'choice_sim' && currentCard.choiceData && /*#__PURE__*/_jsx(InteractiveChoiceViewer, {
                data: currentCard.choiceData,
                color: currentCard.color
              }), moduleStrategies.filter(s => s.triggerAfterCard === currentIndex).map(strategy => /*#__PURE__*/_jsx(StrategySlide, {
                strategyName: strategy.name,
                hook: strategy.hook || strategy.description,
                icon: strategy.iconName,
                accentColor: strategy.accentColor,
                rewardCoins: strategy.rewardCoins,
                onStart: () => setOnboardingStrategy(strategy)
              }, strategy.id)), isLast && /*#__PURE__*/_jsxs(motion.div, {
                initial: {
                  opacity: 0,
                  scale: 0.95
                },
                animate: {
                  opacity: 1,
                  scale: 1
                },
                transition: {
                  delay: 0.2,
                  type: 'spring'
                },
                className: "rounded-2xl p-5 border overflow-hidden relative mt-2 bg-emerald-950/20 border-emerald-500/20",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "absolute -inset-4 blur-xl opacity-10 bg-emerald-500"
                }), /*#__PURE__*/_jsxs("div", {
                  className: "relative flex items-center gap-2 mb-2",
                  children: [/*#__PURE__*/_jsx(motion.div, {
                    animate: {
                      rotate: [0, 360]
                    },
                    transition: {
                      repeat: Infinity,
                      duration: 3,
                      ease: 'linear'
                    },
                    children: /*#__PURE__*/_jsx(Sparkles, {
                      size: 18,
                      className: "text-emerald-400"
                    })
                  }), /*#__PURE__*/_jsx("span", {
                    className: "font-bold text-sm text-emerald-400",
                    children: "Module Complete!"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-xl",
                    children: "\uD83C\uDFC6"
                  })]
                }), /*#__PURE__*/_jsxs("p", {
                  className: "relative text-zinc-400 text-sm",
                  children: ["Badhai ho! ", activeModule.title, " complete! Aage badhein aur naya seekhein!"]
                }), /*#__PURE__*/_jsxs(motion.button, {
                  whileHover: {
                    scale: 1.03
                  },
                  whileTap: {
                    scale: 0.97
                  },
                  onClick: () => onComplete(moduleId),
                  className: "relative mt-4 w-full py-3 rounded-xl font-bold text-sm text-midnight flex items-center justify-center gap-2 cursor-pointer",
                  style: {
                    background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.30)'
                  },
                  children: [/*#__PURE__*/_jsx(CheckCircle2, {
                    size: 16
                  }), "Module Complete Karo (+100 coins)"]
                })]
              })]
            }), !isLast && /*#__PURE__*/_jsx("div", {
              className: "absolute bottom-5 left-0 right-0 z-30 pointer-events-none flex flex-col items-center gap-0.5 sm:hidden",
              children: /*#__PURE__*/_jsxs(motion.div, {
                className: "flex flex-col items-center gap-0.5",
                animate: {
                  y: [0, -4, 0]
                },
                transition: {
                  repeat: Infinity,
                  duration: 1.5
                },
                children: [/*#__PURE__*/_jsx(ArrowUp, {
                  size: 14,
                  className: "text-white/35"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-white/35 text-[10px] font-medium tracking-wider uppercase",
                  children: "Swipe up to read next"
                })]
              })
            })]
          }, currentCard.id)
        }), /*#__PURE__*/_jsx(AnimatePresence, {
          children: showNotes && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              y: '100%'
            },
            animate: {
              y: 0
            },
            exit: {
              y: '100%'
            },
            transition: {
              type: 'spring',
              damping: 25,
              stiffness: 200
            },
            className: "absolute inset-x-0 bottom-0 top-1/4 z-50 rounded-t-3xl bg-[#18181C] border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between p-4 border-b border-white/10 bg-[#0F0F13]",
              children: [/*#__PURE__*/_jsxs("h3", {
                className: "font-bold text-white flex items-center gap-2",
                children: [/*#__PURE__*/_jsx(FileText, {
                  size: 16,
                  className: "text-gold-soft"
                }), " Notes (", notes.length, ")"]
              }), /*#__PURE__*/_jsx("button", {
                onClick: () => setShowNotes(false),
                className: "p-2 rounded-full hover:bg-white/10 text-white/60",
                "aria-label": "Close notes",
                children: /*#__PURE__*/_jsx(X, {
                  size: 16
                })
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "flex-1 overflow-y-auto p-4 space-y-3",
              children: notes.length === 0 ? /*#__PURE__*/_jsx("div", {
                className: "text-center text-white/40 mt-10 text-sm",
                children: "No notes yet. Add one below!"
              }) : notes.map((n, i) => /*#__PURE__*/_jsxs("div", {
                className: "group relative bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/80 pr-10",
                children: [n, /*#__PURE__*/_jsx("button", {
                  onClick: () => deleteNote(i),
                  className: "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20",
                  "aria-label": "Delete note",
                  children: /*#__PURE__*/_jsx(Trash2, {
                    size: 14
                  })
                })]
              }, i))
            }), /*#__PURE__*/_jsx("div", {
              className: "p-4 bg-[#0F0F13] border-t border-white/10",
              children: /*#__PURE__*/_jsxs("div", {
                className: "flex gap-2",
                children: [/*#__PURE__*/_jsx("input", {
                  type: "text",
                  placeholder: "Add a note line...",
                  value: newNote,
                  onChange: e => setNewNote(e.target.value),
                  onKeyDown: e => e.key === 'Enter' && addNote(),
                  className: "flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-colors"
                }), /*#__PURE__*/_jsx("button", {
                  onClick: addNote,
                  disabled: !newNote.trim(),
                  className: "w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gold text-black rounded-xl disabled:opacity-50 disabled:bg-white/20 disabled:text-white/40",
                  "aria-label": "Add note",
                  children: /*#__PURE__*/_jsx(Send, {
                    size: 16
                  })
                })]
              })
            })]
          })
        })]
      })]
    }), /*#__PURE__*/_jsx(StrategyOnboarding, {
      isOpen: onboardingStrategy !== null,
      onClose: () => setOnboardingStrategy(null),
      onStart: () => {
        if (onboardingStrategy) {
          router.push(`/strategy/${onboardingStrategy.slug}`);
        }
      },
      steps: onboardingStrategy?.onboardingSteps?.map(s => ({
        title: s.title,
        icon: s.icon,
        content: /*#__PURE__*/_jsx("p", {
          className: "whitespace-pre-line text-sm text-ink-muted leading-relaxed",
          children: s.content
        })
      })) || [],
      accentColor: onboardingStrategy?.accentColor || '#10B981',
      strategyName: onboardingStrategy?.name || '',
      rewardCoins: onboardingStrategy?.rewardCoins || 0
    })]
  });
}