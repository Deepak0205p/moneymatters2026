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
  const [hoveredNode, setHoveredNode] = useState(null);
  const [onboardingStrategy, setOnboardingStrategy] = useState(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [coinHovered, setCoinHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
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

  const handleCoinMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltX(-y * 35);
    setTiltY(x * 35);
  };

  const handleCoinMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
    setCoinHovered(false);
  };

  const triggerSparkles = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newSparkles = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / 12 + (Math.random() - 0.5) * 0.2;
      const speed = 40 + Math.random() * 60;
      return {
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color: ['#FBBF24', '#F59E0B', '#FFFFFF', '#60A5FA', '#34D399'][Math.floor(Math.random() * 5)]
      };
    });
    setSparkles(prev => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.includes(s)));
    }, 800);
  };

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
      // Remove metadata entry
      const meta = JSON.parse(localStorage.getItem('bookmarked_cards_meta') || '{}');
      delete meta[currentCard.id];
      localStorage.setItem('bookmarked_cards_meta', JSON.stringify(meta));
    } else {
      updated = [...bookmarks, currentCard.id];
      setBookmarked(true);
      // Save metadata entry with timestamp
      const meta = JSON.parse(localStorage.getItem('bookmarked_cards_meta') || '{}');
      meta[currentCard.id] = { savedAt: new Date().toISOString(), order: updated.length - 1 };
      localStorage.setItem('bookmarked_cards_meta', JSON.stringify(meta));
    }
    localStorage.setItem('bookmarked_cards', JSON.stringify(updated));
  };
  const handleNext = useCallback(() => {
    if (currentIndex < allCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(moduleId);
    }
  }, [currentIndex, allCards.length, onComplete, moduleId]);
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
  if (!activeModule) return null;
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
          backgroundColor: currentCard?.color || activeModule.color
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
          backgroundColor: currentCard?.color || activeModule.color
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
            className: "text-[11px] font-extrabold tracking-widest uppercase truncate text-white",
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
            }), allCards.length === 0 ? (
              /*#__PURE__*/_jsxs("div", {
                className: "flex-1 flex flex-col items-center justify-center px-8 text-center space-y-4 my-auto",
                children: [
                  /*#__PURE__*/_jsx("div", {
                    className: "text-6xl animate-bounce",
                    children: "📖"
                  }),
                  /*#__PURE__*/_jsx("h3", {
                    className: "font-display text-xl font-extrabold text-white",
                    children: "Coming Soon"
                  }),
                  /*#__PURE__*/_jsx("p", {
                    className: "text-sm text-ink-muted leading-relaxed max-w-xs",
                    children: "Is module ka content abhi ban raha hai! Financial concepts seekhne ke liye tab tak dusre active modules chuno."
                  }),
                  /*#__PURE__*/_jsx(motion.button, {
                    whileHover: { scale: 1.03 },
                    whileTap: { scale: 0.97 },
                    onClick: onClose,
                    className: "btn-emerald px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer mt-2",
                    children: "Go Back"
                  })
                ]
              })
            ) : currentCard.isHeaderCard ? (
              /*#__PURE__*/_jsxs("div", {
                className: "flex-1 flex flex-col items-center justify-between p-6 text-center relative overflow-hidden bg-[#07070a] select-none",
                children: [
                  /*#__PURE__*/_jsx(motion.div, {
                    className: "absolute w-96 h-96 rounded-full blur-3xl opacity-20 -top-20 -left-20",
                    style: {
                      backgroundColor: currentCard.color || '#3B82F6'
                    },
                    animate: {
                      scale: [1, 1.2, 1],
                      opacity: [0.15, 0.25, 0.15]
                    },
                    transition: {
                      repeat: Infinity,
                      duration: 8,
                      ease: 'easeInOut'
                    }
                  }),
                  /*#__PURE__*/_jsxs("div", {
                    className: "w-full z-10 flex flex-col items-center",
                    children: [
                      /*#__PURE__*/_jsx(motion.h2, {
                        initial: { opacity: 0, y: -25 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.8, ease: "easeOut" },
                        className: `font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b ${
                          currentCard.color === '#3B82F6'
                            ? 'from-[#E0F2FE] via-[#3B82F6] to-[#1D4ED8] drop-shadow-[0_2px_12px_rgba(59,130,246,0.3)]'
                            : currentCard.color === '#10B981' || currentCard.color === '#059669'
                            ? 'from-[#ECFDF5] via-[#10B981] to-[#047857] drop-shadow-[0_2px_12px_rgba(16,185,129,0.3)]'
                            : currentCard.color === '#EF4444'
                            ? 'from-[#FEF2F2] via-[#EF4444] to-[#B91C1C] drop-shadow-[0_2px_12px_rgba(239,68,68,0.3)]'
                            : currentCard.color === '#8B5CF6' || currentCard.color === '#7C3AED'
                            ? 'from-[#F5F3FF] via-[#8B5CF6] to-[#5B21B6] drop-shadow-[0_2px_12px_rgba(139,92,246,0.3)]'
                            : currentCard.color === '#EC4899' || currentCard.color === '#DB2777'
                            ? 'from-[#FDF2F8] via-[#EC4899] to-[#9D174D] drop-shadow-[0_2px_12px_rgba(236,72,153,0.3)]'
                            : 'from-[#FFFDF0] via-[#FBBF24] to-[#B45309] drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)]'
                        } tracking-widest uppercase leading-tight max-w-sm mt-6 select-none`,
                        children: currentCard.title
                      }),
                      /*#__PURE__*/_jsx(motion.div, {
                        initial: { width: 0, opacity: 0 },
                        animate: { width: 180, opacity: 1 },
                        transition: { duration: 0.8, delay: 0.3, ease: "easeOut" },
                        className: 'h-[1.5px] mx-auto mt-4 bg-gradient-to-r from-transparent to-transparent',
                        style: {
                          backgroundImage: `linear-gradient(to right, transparent, ${currentCard.color || '#FBBF24'}, transparent)`,
                          boxShadow: `0 1px 8px ${currentCard.color || '#FBBF24'}`
                        }
                      })
                    ]
                  }),
                  /*#__PURE__*/_jsxs("div", {
                    className: "relative w-full max-w-[340px] aspect-square my-4 z-10 flex justify-center items-center cursor-pointer",
                    style: { perspective: 1000 },
                    onMouseMove: handleCoinMouseMove,
                    onMouseLeave: handleCoinMouseLeave,
                    onClick: triggerSparkles,
                    children: [
                      currentCard.id === '1-1-1' ? (
                        /*#__PURE__*/_jsxs(motion.div, {
                          style: {
                            rotateX: tiltX,
                            rotateY: tiltY,
                            transformStyle: 'preserve-3d'
                          },
                          animate: {
                            rotateY: coinHovered ? tiltY : [tiltY, tiltY + 360]
                          },
                          transition: coinHovered ? { type: 'spring', stiffness: 150, damping: 15 } : {
                            repeat: Infinity,
                            duration: 8,
                            ease: 'linear'
                          },
                          onHoverStart: () => setCoinHovered(true),
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx("div", {
                              className: "absolute w-48 h-48 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 border-4 border-amber-500 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.35)]",
                              style: {
                                transform: 'translateZ(10px)',
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden'
                              },
                              children: /*#__PURE__*/_jsx("div", {
                                className: "w-38 h-38 rounded-full border-4 border-dashed border-amber-200/55 flex items-center justify-center bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-inner",
                                children: /*#__PURE__*/_jsx("span", {
                                  className: "text-white text-7xl font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] select-none",
                                  children: "₹"
                                })
                              })
                            }),
                            /*#__PURE__*/_jsx("div", {
                              className: "absolute w-48 h-48 rounded-full bg-gradient-to-tl from-amber-600 via-yellow-400 to-amber-300 border-4 border-amber-500 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.35)]",
                              style: {
                                transform: 'rotateY(180deg) translateZ(10px)',
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden'
                              },
                              children: /*#__PURE__*/_jsx("div", {
                                className: "w-38 h-38 rounded-full border-4 border-dashed border-amber-200/55 flex items-center justify-center bg-gradient-to-tl from-amber-500 to-yellow-400 shadow-inner",
                                children: /*#__PURE__*/_jsx("span", {
                                  className: "text-white text-6xl font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] select-none",
                                  children: "🪙"
                                })
                              })
                            }),
                            Array.from({
                              length: 20
                            }).map((_, idx) => /*#__PURE__*/_jsx("div", {
                              className: "absolute inset-0 rounded-full bg-gradient-to-r from-amber-800 to-amber-600 border border-amber-900/40",
                              style: {
                                transform: `translateZ(${idx - 10}px)`
                              }
                            }, idx))
                          ]
                        })
                      ) : currentCard.id === '1-1-4' ? (
                        /*#__PURE__*/_jsxs(motion.div, {
                          style: { rotate: tiltY * 1.5 },
                          className: "w-48 h-48 flex items-center justify-center relative",
                          children: [
                            /*#__PURE__*/_jsxs("svg", {
                              width: "160",
                              height: "160",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#0EA5E9",
                              strokeWidth: "1.5",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              className: "drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M12 3v17", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M19 20H5", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx(motion.path, {
                                  d: "M5 7h14",
                                  strokeWidth: "2.5",
                                  style: { transformOrigin: "12px 7px" },
                                  animate: { rotate: tiltY * 0.8 }
                                }),
                                /*#__PURE__*/_jsx(motion.path, {
                                  d: "M5 7v6a2 2 0 0 0 2 2h2v-2",
                                  style: { transformOrigin: "5px 7px" },
                                  animate: { y: tiltY * 0.2 }
                                }),
                                /*#__PURE__*/_jsx(motion.path, {
                                  d: "M19 7v6a2 2 0 0 1-2 2h-2v-2",
                                  style: { transformOrigin: "19px 7px" },
                                  animate: { y: -tiltY * 0.2 }
                                })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute left-6 top-20 text-3xl select-none",
                              animate: { y: tiltY * 0.2 },
                              children: "🌾"
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute right-6 top-20 text-3xl select-none",
                              animate: { y: -tiltY * 0.2 },
                              children: "🪙"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-6' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-40 h-40 rounded-full border border-pink-500/20",
                              animate: { scale: [1, 1.4, 1], opacity: [0.2, 0.6, 0.2] },
                              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                            }),
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-32 h-32 rounded-full border-2 border-dashed border-pink-400/30",
                              animate: { rotate: 360 },
                              transition: { repeat: Infinity, duration: 15, ease: "linear" }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#EC4899",
                              strokeWidth: "1.5",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              className: "drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]",
                              children: [
                                /*#__PURE__*/_jsx("rect", { x: "5", y: "2", width: "14", height: "20", rx: "2", ry: "2", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "12", y1: "18", x2: "12.01", y2: "18", strokeWidth: "3", strokeLinecap: "round" }),
                                /*#__PURE__*/_jsx("path", { d: "M9 6h6", strokeWidth: "1" }),
                                /*#__PURE__*/_jsx("path", { d: "M9 10h6", strokeWidth: "1.5" }),
                                /*#__PURE__*/_jsx("path", { d: "M10 14h4", strokeWidth: "1" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-4xl select-none",
                              animate: { y: [-6, 6, -6] },
                              transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                              children: "⚡"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-8' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl",
                              animate: { opacity: [0.2, 0.4, 0.2] },
                              transition: { repeat: Infinity, duration: 3 }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "130",
                              height: "130",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#10B981",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M3 9l9-6 9 6H3z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M4 9h16", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "5", y1: "9", x2: "5", y2: "19", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "8.5", y1: "9", x2: "8.5", y2: "19", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "12", y1: "9", x2: "12", y2: "19", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "15.5", y1: "9", x2: "15.5", y2: "19", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "19", y1: "9", x2: "19", y2: "19", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M2 19h20", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M1 21h22", strokeWidth: "2.5" })
                              ]
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-10' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.15, 1] },
                              transition: { duration: 3, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#059669",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(5,150,105,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M20 12V8H6a2 2 0 0 1-2-2 2 2 0 0 1 2-2h14v2", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M4 6v12a2 2 0 0 0 2 2h14v-8H6a2 2 0 0 0-2 2z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("circle", { cx: "16", cy: "14", r: "1", fill: "#059669" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-2xl select-none",
                              initial: { y: -80, x: -30, opacity: 0 },
                              animate: { y: -10, x: -10, opacity: [0, 1, 0] },
                              transition: { repeat: Infinity, duration: 1.8, delay: 0.2 },
                              children: "💵"
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-2xl select-none",
                              initial: { y: -80, x: 30, opacity: 0 },
                              animate: { y: -10, x: 10, opacity: [0, 1, 0] },
                              transition: { repeat: Infinity, duration: 1.8, delay: 0.8 },
                              children: "🪙"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-12' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-40 h-40 rounded-full border border-teal-500/10",
                              animate: { rotate: 360 },
                              transition: { repeat: Infinity, duration: 20, ease: "linear" }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#0D9488",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(13,148,136,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 5.5C4 22 6 21 7.5 19.5", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5l11-11c-2-2-4.5-3.5-7.5-3.5z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M19.5 4.5L22 2l-2.5 2.5L17 7l5 5-2.5-7.5z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("circle", { cx: "12", cy: "9", r: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute text-xl select-none",
                              animate: { x: [-40, 40, -40], y: [-30, 30, -30] },
                              transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                              children: "✨"
                            }),
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute text-xl select-none",
                              animate: { x: [40, -40, 40], y: [30, -30, 30] },
                              transition: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 },
                              children: "💰"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-15' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-red-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.2, 1] },
                              transition: { duration: 2.5, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#EF4444",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("circle", { cx: "9", cy: "21", r: "1", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("circle", { cx: "20", cy: "21", r: "1", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-lg select-none",
                              initial: { y: -10, opacity: 1 },
                              animate: { y: 40, opacity: 0 },
                              transition: { repeat: Infinity, duration: 1.5, ease: "easeIn" },
                              children: "💸"
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-lg select-none",
                              initial: { y: -10, x: -20, opacity: 1 },
                              animate: { y: 45, x: -30, opacity: 0 },
                              transition: { repeat: Infinity, duration: 1.5, delay: 0.5, ease: "easeIn" },
                              children: "☕"
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-lg select-none",
                              initial: { y: -10, x: 20, opacity: 1 },
                              animate: { y: 45, x: 30, opacity: 0 },
                              transition: { repeat: Infinity, duration: 1.5, delay: 1, ease: "easeIn" },
                              children: "🍿"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-18' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 border border-purple-500/20 rounded-full",
                              animate: { scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] },
                              transition: { duration: 2, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#7C3AED",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(124,58,237,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("circle", { cx: "12", cy: "12", r: "10", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx(motion.line, {
                                  x1: "12",
                                  y1: "12",
                                  x2: "12",
                                  y2: "6",
                                  strokeWidth: "2.5",
                                  style: { transformOrigin: "12px 12px" },
                                  animate: { rotate: 360 },
                                  transition: { repeat: Infinity, duration: 8, ease: "linear" }
                                }),
                                /*#__PURE__*/_jsx("line", { x1: "12", y1: "12", x2: "16", y2: "12", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M12 2v2", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-4xl font-extrabold select-none text-purple-300",
                              animate: { scale: [0.9, 1.1, 0.9] },
                              transition: { repeat: Infinity, duration: 1.5 },
                              children: "?"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-22' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-amber-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.15, 1] },
                              transition: { duration: 3, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#F59E0B",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M9 9h6", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M9 13h6", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M9 17h4", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-3xl select-none",
                              animate: { y: [-6, 6, -6] },
                              transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                              children: "📋"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-24' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-amber-500/10 rounded-full blur-2xl",
                              animate: { opacity: [0.2, 0.4, 0.2] },
                              transition: { repeat: Infinity, duration: 3 }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#F59E0B",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M12 3v17", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M5 20h14", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M3 7h18", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-3xl select-none",
                              animate: { rotate: [-5, 5, -5] },
                              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                              children: "⚖️"
                            })
                          ]
                        })
                      ) : (currentCard.id === '1-1-27' || currentCard.id === '1-1-36' || currentCard.id === '1-1-38' || currentCard.id === '1-1-40') ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-red-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.2, 1] },
                              transition: { duration: 3, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#EF4444",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("rect", { x: "2", y: "2", width: "20", height: "20", rx: "2.18", ry: "2.18", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M7 2v20", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M17 2v20", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M2 12h20", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M2 7h5", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M2 17h5", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M17 7h5", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M17 17h5", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-4xl select-none",
                              animate: { scale: [0.9, 1.1, 0.9] },
                              transition: { repeat: Infinity, duration: 1.5 },
                              children: "🎬"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-29' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-blue-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.15, 1] },
                              transition: { duration: 3, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#3B82F6",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "4", y1: "22", x2: "4", y2: "15", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-3xl select-none",
                              animate: { rotate: [-8, 8, -8] },
                              transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                              children: "🇮🇳"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-31' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-blue-500/10 rounded-full blur-2xl",
                              animate: { opacity: [0.2, 0.4, 0.2] },
                              transition: { repeat: Infinity, duration: 3 }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#3B82F6",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M22 10v6M2 10l10-5 10 5-10 5z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-3xl select-none",
                              animate: { y: [-4, 4, -4] },
                              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                              children: "🎓"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-33' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-blue-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.2, 1] },
                              transition: { duration: 3, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#3B82F6",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-3xl select-none",
                              animate: { rotate: [-10, 10, -10] },
                              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                              children: "💥"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-35' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-red-500/10 rounded-full blur-2xl",
                              animate: { opacity: [0.2, 0.4, 0.2] },
                              transition: { repeat: Infinity, duration: 3 }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#EF4444",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13", strokeWidth: "2.5" }),
                                /*#__PURE__*/_jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17", strokeWidth: "3" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-3xl select-none",
                              animate: { scale: [0.9, 1.15, 0.9] },
                              transition: { repeat: Infinity, duration: 1.8 },
                              children: "⚠️"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-37' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.15, 1] },
                              transition: { duration: 3, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#10B981",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("polyline", { points: "14 2 14 8 20 8", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("polyline", { points: "10 9 9 9 8 9", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-3xl select-none",
                              animate: { y: [-4, 4, -4] },
                              transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                              children: "📝"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-39' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-purple-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.2, 1] },
                              transition: { duration: 3, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#8B5CF6",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("circle", { cx: "12", cy: "12", r: "10", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17", strokeWidth: "3" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-4xl select-none",
                              animate: { scale: [0.95, 1.08, 0.95] },
                              transition: { repeat: Infinity, duration: 1.6 },
                              children: "🤔"
                            })
                          ]
                        })
                      ) : currentCard.id === '1-1-41' ? (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] },
                              transition: { duration: 2.5, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#10B981",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M4 22h16", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M12 2a15 15 0 0 1 6 12H6a15 15 0 0 1 6-12z", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute text-4xl select-none",
                              animate: { rotate: 360 },
                              transition: { repeat: Infinity, duration: 10, ease: "linear" },
                              children: "🏆"
                            })
                          ]
                        })
                      ) : (
                        /*#__PURE__*/_jsxs("div", {
                          className: "relative w-48 h-48 flex items-center justify-center",
                          children: [
                            /*#__PURE__*/_jsx(motion.div, {
                              className: "absolute w-36 h-36 bg-pink-500/10 rounded-full blur-2xl",
                              animate: { scale: [1, 1.2, 1] },
                              transition: { duration: 3, repeat: Infinity }
                            }),
                            /*#__PURE__*/_jsxs("svg", {
                              width: "120",
                              height: "120",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "#DB2777",
                              strokeWidth: "1.5",
                              className: "drop-shadow-[0_0_20px_rgba(219,39,119,0.4)]",
                              children: [
                                /*#__PURE__*/_jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M12 8v8", strokeWidth: "2" }),
                                /*#__PURE__*/_jsx("path", { d: "M9 11h6", strokeWidth: "2" })
                              ]
                            }),
                            /*#__PURE__*/_jsx(motion.span, {
                              className: "absolute text-3xl select-none",
                              animate: { y: [-4, 4, -4] },
                              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                              children: "💎"
                            })
                          ]
                        })
                      ),
                      sparkles.map(s => /*#__PURE__*/_jsx(motion.div, {
                        className: "absolute rounded-full pointer-events-none",
                        style: {
                          left: s.x,
                          top: s.y,
                          width: s.size,
                          height: s.size,
                          backgroundColor: s.color,
                          boxShadow: `0 0 10px ${s.color}`
                        },
                        animate: {
                          x: s.vx * 0.8,
                          y: s.vy * 0.8,
                          opacity: 0,
                          scale: 0
                        },
                        transition: {
                          duration: 0.8,
                          ease: 'easeOut'
                        }
                      }, s.id))
                    ]
                  }),
                  /*#__PURE__*/_jsxs("div", {
                    className: "relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.06] shadow-lg mb-8",
                    children: [
                      /*#__PURE__*/_jsxs("svg", {
                        width: "14",
                        height: "14",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: currentCard.color || '#3B82F6',
                        strokeWidth: "2.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        className: "animate-pulse",
                        children: [
                          /*#__PURE__*/_jsx("path", { d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }),
                          /*#__PURE__*/_jsx("path", { d: "M9 18h6" }),
                          /*#__PURE__*/_jsx("path", { d: "M10 22h4" })
                        ]
                      }),
                      /*#__PURE__*/_jsx("span", {
                        className: "text-[9px] text-zinc-400 font-extrabold tracking-wider uppercase select-none",
                        children: currentCard.id === '1-1-1'
                          ? "💡 Money is not just paper — it is a concept that represents value"
                          : currentCard.id === '1-1-4'
                          ? "💡 Barter failed because both parties needed to want what the other had"
                          : currentCard.id === '1-1-6'
                          ? "💡 India's UPI processes 10 billion+ transactions monthly — all digital"
                          : currentCard.id === '1-1-8'
                          ? "💡 Money's 5 functions make global trade, savings and loans possible"
                          : currentCard.id === '1-1-10'
                          ? "💡 Without income, budgeting and saving have no meaning"
                          : currentCard.id === '1-1-12'
                          ? "💡 Students can earn ₹500 to ₹50,000/month from 15+ real sources"
                          : currentCard.id === '1-1-15'
                          ? "💡 Fixed expenses are predictable; variable expenses are where leaks hide"
                          : currentCard.id === '1-1-18'
                          ? "💡 Test your knowledge on Money, Income and Expenses in 5 questions"
                          : currentCard.id === '1-1-20'
                          ? "💡 Pay Yourself First — save before you spend, not after"
                          : currentCard.id === '1-1-22'
                          ? "💡 A budget is your financial roadmap — without it, you walk in the dark"
                          : currentCard.id === '1-1-24'
                          ? "💡 See 5 real scenarios of students with and without a budget"
                          : currentCard.id === '1-1-27'
                          ? "💡 The 50/30/20 rule is the simplest way to allocate every rupee"
                          : currentCard.id === '1-1-29'
                          ? "💡 Only 27% of Indians are financially literate — vs 52% global average"
                          : currentCard.id === '1-1-31'
                          ? "💡 Schools teach trigonometry but not how to file a tax return"
                          : currentCard.id === '1-1-33'
                          ? "💡 Tap each myth to see the financial reality behind it"
                          : currentCard.id === '1-1-35'
                          ? "💡 Small untracked expenses can silently drain ₹6,000+ per year"
                          : currentCard.id === '1-1-37'
                          ? "💡 Review the core lessons of money, income, expenses and savings"
                          : currentCard.id === '1-1-39'
                          ? "💡 Common misconceptions keep people stuck in poor money habits"
                          : currentCard.id === '1-1-41'
                          ? "🏆 You have mastered the fundamentals of personal finance — great work!"
                          : "💡 Tap to explore this concept further"
                      })
                    ]
                  })
                ]
              })
            ) : (
              /*#__PURE__*/_jsxs("div", {
                ref: contentRef,
                className: "flex-1 overflow-y-auto px-6 pt-4 pb-12 space-y-4",
                style: {
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                },
                children: [!currentCard.hideHeader && /*#__PURE__*/_jsxs("div", {
                  className: "relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-lg flex flex-col justify-end p-6 bg-[#18181C]",
                  style: {
                    height: '32%',
                    minHeight: '180px'
                  },
                  children: [/*#__PURE__*/_jsx(motion.div, {
                    className: "absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20",
                    style: {
                      backgroundColor: currentCard?.color || activeModule.color
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
                  children: currentCard.id === '1-1-2' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-5 pt-4 px-2 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.6 },
                          children: [
                            "When we hear the word ",
                            /*#__PURE__*/_jsx("strong", { className: "text-amber-400 font-extrabold text-[17px] sm:text-[18px] drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]", children: "\"money\"" }),
                            ", notes and coins immediately come to mind."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.6, duration: 0.6 },
                          children: [
                            "But money is not just ",
                            /*#__PURE__*/_jsx("span", { className: "text-red-400 font-extrabold", children: "paper" }),
                            " or ",
                            /*#__PURE__*/_jsx("span", { className: "text-zinc-400 font-extrabold", children: "metal" }),
                            " — it is a ",
                            /*#__PURE__*/_jsx("span", { className: "text-cyan-400 font-black", children: "concept" }),
                            ", a ",
                            /*#__PURE__*/_jsx("span", { className: "text-purple-400 font-black", children: "medium" }),
                            " through which we exchange ",
                            /*#__PURE__*/_jsx("span", { className: "text-emerald-400 font-black text-[17px] sm:text-[18px] drop-shadow-[0_0_10px_rgba(52,211,153,0.2)]", children: "value" }),
                            "."
                          ]
                        }),
                        /*#__PURE__*/_jsx(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 1.0, duration: 0.6 },
                          className: "text-zinc-500 text-xs italic font-semibold tracking-wide",
                          children: "Try the simulator below to see how money represents the exchange of different assets:"
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-3' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-4 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: [
                            "Imagine, what would happen if money did not exist? If you wanted tea but only had a book, you would have to give the book to the tea vendor, and he would give you tea — this is the ",
                            /*#__PURE__*/_jsx("strong", { className: "text-amber-400 font-bold", children: "barter system" }),
                            "."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.7, duration: 0.5 },
                          children: [
                            "But does the tea vendor actually want a book? Probably not. This was the core issue with the barter system — known as the ",
                            /*#__PURE__*/_jsx("span", { className: "text-red-400 font-extrabold", children: "\"double coincidence of wants\"" }),
                            ". Both parties must want what the other has."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 1.2, duration: 0.5 },
                          children: [
                            "To solve this, ",
                            /*#__PURE__*/_jsx("span", { className: "text-emerald-400 font-black", children: "money" }),
                            " was created — a single medium that everyone accepts, has a fixed value, and is easily exchangeable."
                          ]
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-5' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-4 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: [
                            "Today, money is ",
                            /*#__PURE__*/_jsx("strong", { className: "text-amber-400 font-bold", children: "\"fiat currency\"" }),
                            " — meaning the government has declared it as ",
                            /*#__PURE__*/_jsx("span", { className: "text-cyan-400 font-bold", children: "legal tender" }),
                            ", without any ",
                            /*#__PURE__*/_jsx("span", { className: "text-red-400 font-bold", children: "gold backing" }),
                            "."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.8, duration: 0.5 },
                          children: [
                            "This means the value of money is purely backed by ",
                            /*#__PURE__*/_jsx("span", { className: "text-emerald-400 font-black", children: "public trust" }),
                            " in the government."
                          ]
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-7' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-4 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: [
                            "The evolution of money has entered the ",
                            /*#__PURE__*/_jsx("strong", { className: "text-amber-400 font-bold", children: "digital age" }),
                            ". From early ledger balances to ",
                            /*#__PURE__*/_jsx("span", { className: "text-cyan-400 font-bold", children: "credit cards" }),
                            " and now instant mobile payments."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.8, duration: 0.5 },
                          children: [
                            "Today, systems like ",
                            /*#__PURE__*/_jsx("span", { className: "text-emerald-400 font-black", children: "UPI" }),
                            " and blockchain-based digital tokens enable frictionless, instant transfer of value globally."
                          ]
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-9' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-4 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: [
                            "To function effectively, modern money serves ",
                            /*#__PURE__*/_jsx("strong", { className: "text-amber-400 font-bold", children: "five fundamental roles" }),
                            " in a global economy."
                          ]
                        }),
                        /*#__PURE__*/_jsx(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.8, duration: 0.5 },
                          className: "text-zinc-500 text-xs italic font-semibold tracking-wide",
                          children: "Click each tab below to see how money simplifies trade, valuation, savings, payments, and transfers:"
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-11' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-4 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: [
                            "Income simply means the ",
                            /*#__PURE__*/_jsx("strong", { className: "text-emerald-400 font-bold", children: "money coming to you" }),
                            ". Any source of money is income."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.8, duration: 0.5 },
                          children: [
                            "For students, this includes ",
                            /*#__PURE__*/_jsx("span", { className: "text-cyan-400 font-bold", children: "pocket money" }),
                            ", ",
                            /*#__PURE__*/_jsx("span", { className: "text-purple-400 font-bold", children: "part-time tuition" }),
                            ", ",
                            /*#__PURE__*/_jsx("span", { className: "text-pink-400 font-bold", children: "freelancing" }),
                            ", or ",
                            /*#__PURE__*/_jsx("span", { className: "text-amber-400 font-bold", children: "scholarships" }),
                            "."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 1.4, duration: 0.5 },
                          children: [
                            "Without income, ",
                            /*#__PURE__*/_jsx("span", { className: "text-red-400 font-black", children: "budgeting" }),
                            ", ",
                            /*#__PURE__*/_jsx("span", { className: "text-orange-400 font-black", children: "saving" }),
                            ", and investing make no sense — you cannot manage what you do not have!"
                          ]
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-13' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-3 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsx(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: "Explore the interactive flowchart below detailing 15 student income sources with typical amounts:"
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-14' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-4 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: [
                            /*#__PURE__*/_jsx("strong", { className: "text-emerald-400 font-bold", children: "Active Income" }),
                            " requires active labor (job, tutions). If you stop working, income stops."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.8, duration: 0.5 },
                          children: [
                            /*#__PURE__*/_jsx("strong", { className: "text-cyan-400 font-bold", children: "Passive Income" }),
                            " flows repeatedly from previous effort (YouTube ads, investments, digital sales)."
                          ]
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-16' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-4 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: [
                            "Expense is the ",
                            /*#__PURE__*/_jsx("strong", { className: "text-red-400 font-bold", children: "money leaving you" }),
                            ". Not all expenses are equal."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.8, duration: 0.5 },
                          children: [
                            /*#__PURE__*/_jsx("span", { className: "text-orange-400 font-bold", children: "Fixed Expenses" }),
                            " stay same (rent, WiFi), while ",
                            /*#__PURE__*/_jsx("span", { className: "text-yellow-400 font-bold", children: "Variable Expenses" }),
                            " change monthly (outside food, travel)."
                          ]
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-17' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-3 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsx(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: "Categorize the items below into essential Needs (cannot survive without) or Wants (can postpone or avoid) to test your budgeting strategy:"
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-19' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-3 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsx(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: "Solidify what you have learned about Money, Income, and Expenses by taking this quick 5-question timed quiz!"
                        })
                      ]
                    })
                  ) : currentCard.id === '1-1-21' ? (
                    /*#__PURE__*/_jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "font-mono text-zinc-200 text-[15px] sm:text-[16px] leading-relaxed space-y-4 pt-2 px-1 select-none",
                      children: [
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.2, duration: 0.5 },
                          children: [
                            "Saving means ",
                            /*#__PURE__*/_jsx("strong", { className: "text-emerald-400 font-bold", children: "spending less today" }),
                            " to build security and options for tomorrow."
                          ]
                        }),
                        /*#__PURE__*/_jsxs(motion.p, {
                          initial: { x: -15, opacity: 0 },
                          animate: { x: 0, opacity: 1 },
                          transition: { delay: 0.8, duration: 0.5 },
                          children: [
                            "Instead of saving what is left after spending, practice ",
                            /*#__PURE__*/_jsx("span", { className: "text-amber-400 font-extrabold", children: "\"Pay Yourself First\"" }),
                            " — save immediately when income arrives, then manage expenses with the rest."
                          ]
                        })
                      ]
                    })
                  ) : (
                    /*#__PURE__*/_jsx(RichContent, {
                      content: currentCard.content,
                      color: currentCard.color
                    })
                  )
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
                }), currentCard.interactiveType === 'value_exchange' && /*#__PURE__*/_jsx(InteractiveValueExchange, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'barter_dilemma' && /*#__PURE__*/_jsx(InteractiveBarterDilemma, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'evolution_flowchart' && /*#__PURE__*/_jsx(InteractiveEvolutionFlowchart, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'digital_evolution_flowchart' && /*#__PURE__*/_jsx(InteractiveDigitalEvolution, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'five_functions_flowchart' && /*#__PURE__*/_jsx(InteractiveFiveFunctions, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'student_income_flowchart' && /*#__PURE__*/_jsx(InteractiveStudentIncomeFlowchart, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'income_types_visual' && /*#__PURE__*/_jsx(InteractiveIncomeTypesVisual, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'expense_concept' && /*#__PURE__*/_jsx(InteractiveExpenseConcept, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'needs_vs_wants_sim' && /*#__PURE__*/_jsx(InteractiveNeedsVsWantsSim, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'mid_way_quiz' && /*#__PURE__*/_jsx(InteractiveMidWayQuiz, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'savings_deepdive' && /*#__PURE__*/_jsx(InteractiveSavingsDeepdive, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'budget_concept' && /*#__PURE__*/_jsx(InteractiveBudgetConcept, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'budget_scenarios' && /*#__PURE__*/_jsx(InteractiveInteractiveBudgetScenarios, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'rule_50_30_20' && /*#__PURE__*/_jsx(InteractiveRuleVisual, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'budgeting_strategies' && /*#__PURE__*/_jsx(InteractiveBudgetingStrategies, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'literacy_gap' && /*#__PURE__*/_jsx(InteractiveLiteracyGap, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'school_gap_taboo' && /*#__PURE__*/_jsx(InteractiveSchoolGapTaboo, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'mindset_myths' && /*#__PURE__*/_jsx(InteractiveMindsetMyths, {
                  color: currentCard.color
                }), currentCard.interactiveType === 'module_completion' && /*#__PURE__*/_jsx(InteractiveModuleCompletion, {
                  color: currentCard.color,
                  onComplete: handleNext
                }), moduleStrategies.filter(s => s.triggerAfterCard === currentIndex).map(strategy => /*#__PURE__*/_jsx(StrategySlide, {
                  strategyName: strategy.name,
                  hook: strategy.hook || strategy.description,
                  icon: strategy.iconName,
                  accentColor: strategy.accentColor,
                  rewardCoins: strategy.rewardCoins,
                  onStart: () => setOnboardingStrategy(strategy)
                }, strategy.id))]
              })
            ), allCards.length > 0 && !isLast && (
              /*#__PURE__*/_jsx("div", {
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
                    children: "Swipe Up"
                  })]
                })
              })
            )]
          }, currentCard?.id || `empty-${moduleId}`)
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

function InteractiveValueExchange({ color }) {
  const [exchangeState, setExchangeState] = useState('idle');
  const [selectedItem, setSelectedItem] = useState(null);

  const items = {
    book: { label: 'Book 📖', desc: 'Knowledge & Education' },
    chai: { label: 'Chai ☕', desc: 'Daily Beverage' },
    work: { label: 'Service 💻', desc: 'Code or Design Work' }
  };

  const handleStartExchange = (itemKey) => {
    setSelectedItem(itemKey);
    setExchangeState('paying');
    setTimeout(() => {
      setExchangeState('exchanged');
    }, 1800);
  };

  const handleReset = () => {
    setExchangeState('idle');
    setSelectedItem(null);
  };

  return _jsxs("div", {
    className: "mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4 flex flex-col items-center",
    children: [
      _jsx("h4", {
        className: "text-xs font-extrabold uppercase tracking-wider text-zinc-400",
        children: "Value Exchange Simulator"
      }),
      _jsxs("div", {
        className: "relative w-full h-32 bg-black/25 rounded-xl overflow-hidden border border-white/[0.04] flex items-center justify-between px-6",
        style: { perspective: 1000 },
        children: [
          _jsxs("div", {
            className: "flex flex-col items-center z-10",
            children: [
              _jsx("div", {
                className: "w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-lg",
                children: "🧑"
              }),
              _jsx("span", {
                className: "text-[10px] text-zinc-400 font-bold mt-1",
                children: "You"
              })
            ]
          }),
          _jsxs("div", {
            className: "absolute inset-x-16 h-1 bg-white/5 rounded-full flex items-center justify-center",
            children: [
              exchangeState === 'paying' && _jsx(motion.div, {
                initial: { x: -80, opacity: 1 },
                animate: { x: 80 },
                transition: { duration: 1.2, ease: 'easeInOut' },
                className: "w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[11px] font-black text-amber-950 shadow-[0_0_12px_#f59e0b]",
                children: "₹"
              }),
              exchangeState === 'exchanged' && _jsx(motion.div, {
                initial: { x: 80, opacity: 1 },
                animate: { x: -80 },
                transition: { duration: 1.2, ease: 'easeInOut' },
                className: "text-2xl",
                children: selectedItem === 'book' ? '📖' : selectedItem === 'chai' ? '☕' : '💻'
              })
            ]
          }),
          _jsxs("div", {
            className: "flex flex-col items-center z-10",
            children: [
              _jsx("div", {
                className: "w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg",
                children: "👳"
              }),
              _jsx("span", {
                className: "text-[10px] text-zinc-400 font-bold mt-1",
                children: "Merchant"
              })
            ]
          })
        ]
      }),
      exchangeState === 'idle' && _jsxs("div", {
        className: "w-full space-y-2",
        children: [
          _jsx("p", {
            className: "text-[11px] text-zinc-400 font-medium",
            children: "Select value to exchange:"
          }),
          _jsx("div", {
            className: "grid grid-cols-3 gap-2",
            children: Object.entries(items).map(([key, item]) => _jsx("button", {
              onClick: () => handleStartExchange(key),
              className: "p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-zinc-200 transition-colors active:scale-95 cursor-pointer",
              children: item.label
            }, key))
          })
        ]
      }),
      exchangeState === 'paying' && _jsx("div", {
        className: "text-[12px] text-zinc-400 animate-pulse font-medium",
        children: "Transferring representation of value..."
      }),
      exchangeState === 'exchanged' && _jsxs("div", {
        className: "w-full text-center space-y-3",
        children: [
          _jsxs("div", {
            className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20",
            children: [
              _jsx("p", {
                className: "text-[12px] text-emerald-400 font-bold",
                children: "Transaction Successful!"
              }),
              _jsxs("p", {
                className: "text-[11px] text-zinc-300 mt-1.5 leading-relaxed",
                children: [
                  "You gave a concept of value (money), and got a real asset (",
                  items[selectedItem].desc,
                  ") in return."
                ]
              })
            ]
          }),
          _jsx("button", {
            onClick: handleReset,
            className: "px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-[11px] font-bold text-white transition-colors active:scale-95 cursor-pointer",
            children: "Reset Simulator"
          })
        ]
      })
    ]
  });
}

function InteractiveBarterDilemma({ color }) {
  const [step, setStep] = useState('problem');

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 flex flex-col items-center select-none font-mono",
    children: [
      _jsx("h4", {
        className: "text-[11px] font-black uppercase tracking-wider text-zinc-400",
        children: "Barter System Dilemma Simulator"
      }),
      _jsxs("div", {
        className: "relative w-full h-40 bg-black/30 rounded-xl overflow-hidden border border-white/[0.04] flex flex-col justify-between p-3",
        children: [
          _jsxs("div", {
            className: "flex justify-between items-center w-full px-2 mt-2",
            children: [
              _jsxs("div", {
                className: "flex flex-col items-center space-y-1 w-1/3",
                children: [
                  _jsx("div", {
                    className: "w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-lg",
                    children: "🧑"
                  }),
                  _jsx("span", {
                    className: "text-[9px] text-zinc-400 font-bold",
                    children: "You (wants Chai)"
                  }),
                  _jsx("span", {
                    className: "text-[10px] text-amber-400 font-black",
                    children: "Has Book 📖"
                  })
                ]
              }),
              _jsx("div", {
                className: "flex-1 flex justify-center items-center relative",
                children: step === 'problem' ? _jsx(motion.div, {
                  animate: {
                    x: [0, 10, -10, 0]
                  },
                  transition: {
                    repeat: Infinity,
                    duration: 2
                  },
                  className: "text-zinc-500 text-xs font-semibold",
                  children: "Trade Book?"
                }) : step === 'fail' ? _jsx(motion.div, {
                  initial: {
                    scale: 0.5,
                    opacity: 0
                  },
                  animate: {
                    scale: 1,
                    opacity: 1
                  },
                  className: "text-red-400 text-[9px] font-bold text-center bg-red-950/40 border border-red-500/20 px-2 py-1 rounded-md",
                  children: "No Coincidence! ❌"
                }) : step === 'solution' ? _jsx(motion.div, {
                  animate: {
                    y: [-2, 2, -2]
                  },
                  transition: {
                    repeat: Infinity,
                    duration: 1.5
                  },
                  className: "text-emerald-400 text-[10px] font-bold text-center",
                  children: "Introduce Money"
                }) : _jsx(motion.div, {
                  className: "text-emerald-400 text-[9px] font-bold text-center bg-emerald-950/40 border border-emerald-500/20 px-2 py-1 rounded-md",
                  children: "Trade Success! 🪙"
                })
              }),
              _jsxs("div", {
                className: "flex flex-col items-center space-y-1 w-1/3",
                children: [
                  _jsx("div", {
                    className: "w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-lg",
                    children: "👳"
                  }),
                  _jsx("span", {
                    className: "text-[9px] text-zinc-400 font-bold",
                    children: "Vendor"
                  }),
                  _jsx("span", {
                    className: `text-[10px] ${step === 'solution' || step === 'success' ? 'text-emerald-400' : 'text-red-400'} font-black`,
                    children: step === 'solution' || step === 'success' ? "Wants Money 🪙" : "Wants Apples 🍎"
                  })
                ]
              })
            ]
          }),
          _jsx("div", {
            className: "w-full h-8 relative bg-white/[0.02] border border-white/[0.04] rounded-lg overflow-hidden flex items-center justify-center",
            children: step === 'problem' ? _jsx("button", {
              onClick: () => setStep('fail'),
              className: "text-[10px] bg-white/10 hover:bg-white/15 px-3 py-1 rounded-md font-bold text-white transition-colors active:scale-95 cursor-pointer",
              children: "Offer Book to Vendor"
            }) : step === 'fail' ? _jsxs("div", {
              className: "flex items-center space-x-2 px-2",
              children: [_jsx("span", {
                className: "text-[9px] text-red-300",
                children: "Vendor rejects book! Wants Apples."
              }), _jsx("button", {
                onClick: () => setStep('solution'),
                className: "text-[9px] bg-amber-500 hover:bg-amber-600 px-2 py-0.5 rounded-md font-bold text-black transition-colors active:scale-95 cursor-pointer",
                children: "Use Money"
              })]
            }) : step === 'solution' ? _jsx("button", {
              onClick: () => setStep('success'),
              className: "text-[10px] bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-md font-bold text-black transition-colors active:scale-95 cursor-pointer animate-pulse",
              children: "Give ₹10 Coin"
            }) : _jsxs("div", {
              className: "flex items-center space-x-2 px-2",
              children: [_jsx("span", {
                className: "text-[9px] text-emerald-400 font-bold",
                children: "Vendor accepts money! Gives Chai!"
              }), _jsx("button", {
                onClick: () => setStep('problem'),
                className: "text-[9px] bg-white/15 hover:bg-white/20 px-2 py-0.5 rounded font-bold text-white transition-colors active:scale-95 cursor-pointer",
                children: "Restart"
              })]
            })
          })
        ]
      }),
      _jsx("p", {
        className: "text-[10px] text-zinc-400 text-center leading-relaxed",
        children: step === 'problem' || step === 'fail' ? "Barter requires a Double Coincidence of Wants: both people must want exactly what the other person is offering." : "Money solves this! It acts as a common Medium of Exchange that everyone accepts and values."
      })
    ]
  });
}

function InteractiveEvolutionFlowchart({ color }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = [{
    title: 'Barter System',
    icon: '🌾',
    desc: 'Direct exchange of goods. Relied on matching wants directly.',
    weakness: 'Double coincidence of wants required.'
  }, {
    title: 'Commodity Money',
    icon: '🐚',
    desc: 'Using universally valued items like Salt, Shells, or Tobacco.',
    weakness: 'Hard to store, transport, and divide.'
  }, {
    title: 'Metallic Coins',
    icon: '🪙',
    desc: 'Standardized gold, silver, and copper coins minted by kings.',
    weakness: 'Heavy to transport in large quantities.'
  }, {
    title: 'Paper Money',
    icon: '💵',
    desc: 'Paper receipts backed by physical gold deposits in banks.',
    weakness: 'Limited supply based on gold reserves.'
  }, {
    title: 'Fiat Currency',
    icon: '🏦',
    desc: 'Modern legal tender backed only by Government declaration.',
    weakness: 'Relies fully on public trust & government stability.'
  }];

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [_jsx("h4", {
      className: "text-[11px] font-black uppercase tracking-wider text-zinc-400 text-center",
      children: "Flowchart: Evolution of Money"
    }), _jsx("div", {
      className: "flex justify-between items-center space-x-1.5 overflow-x-auto py-2 scrollbar-none",
      children: steps.map((s, idx) => _jsxs("div", {
        className: "flex items-center",
        children: [_jsxs("button", {
          onClick: () => setActiveIndex(idx),
          className: `flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 w-16 h-16 ${activeIndex === idx ? 'bg-amber-400/20 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'}`,
          children: [_jsx("span", {
            className: "text-lg",
            children: s.icon
          }), _jsx("span", {
            className: "text-[8px] font-bold mt-1 text-center truncate w-full text-zinc-300",
            children: s.title.split(' ')[0]
          })]
        }), idx < steps.length - 1 && _jsx("span", {
          className: "text-zinc-600 text-xs px-0.5",
          children: "➔"
        })]
      }, idx))
    }), _jsx(AnimatePresence, {
      mode: "wait",
      children: _jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 10
        },
        animate: {
          opacity: 1,
          y: 0
        },
        exit: {
          opacity: 0,
          y: -10
        },
        transition: {
          duration: 0.3
        },
        className: "p-3 rounded-xl bg-black/20 border border-white/[0.05] space-y-2",
        children: [_jsxs("div", {
          className: "flex items-center space-x-2 border-b border-white/[0.06] pb-1.5",
          children: [_jsx("span", {
            className: "text-lg",
            children: steps[activeIndex].icon
          }), _jsx("h5", {
            className: "text-xs font-bold text-amber-400",
            children: steps[activeIndex].title
          })]
        }), _jsx("p", {
          className: "text-[11px] text-zinc-300 leading-relaxed",
          children: steps[activeIndex].desc
        }), _jsxs("div", {
          className: "bg-red-500/10 border border-red-500/10 rounded px-2 py-1 flex items-start space-x-1.5",
          children: [_jsx("span", {
            className: "text-[9px] font-black text-red-400 uppercase",
            children: "Limit:"
          }), _jsx("span", {
            className: "text-[9px] text-red-300/90 leading-tight",
            children: steps[activeIndex].weakness
          })]
        })]
      }, activeIndex)
    })]
  });
}

function InteractiveDigitalEvolution({ color }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [{
    title: "Ledgers & Cash",
    tech: "Double Entry Ledger 📝",
    desc: "Physical recording of balances. Transactions completed with tangible gold/silver and paper cash.",
    speed: "Hours to Days"
  }, {
    title: "Electronic Money",
    tech: "Card Networks & NetBanking 💳",
    desc: "Moving money electronically via bank database updates, clearing houses, and credit card rails.",
    speed: "Seconds to 2 Days"
  }, {
    title: "Instant Mobile",
    tech: "UPI & Peer-to-Peer ⚡",
    desc: "Direct bank-to-bank instant settlement. Built on open APIs, allowing phone-to-phone QR scanning.",
    speed: "Immediate (< 2s)"
  }, {
    title: "Decentralized / CBDC",
    tech: "Blockchain & Tokens 🌐",
    desc: "Digital cash issued directly on a cryptographic ledger. Programmatic money without intermediary bank risks.",
    speed: "Real-time"
  }];

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [_jsx("h4", {
      className: "text-[11px] font-black uppercase tracking-wider text-zinc-400 text-center",
      children: "Evolution: The Digital Money Timeline"
    }), _jsx("div", {
      className: "relative flex justify-between items-center w-full px-2",
      children: steps.map((s, idx) => _jsx("button", {
        onClick: () => setActiveStep(idx),
        className: `z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${activeStep === idx ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.5)] scale-110' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'}`,
        children: idx + 1
      }, idx))
    }), _jsx(AnimatePresence, {
      mode: "wait",
      children: _jsxs(motion.div, {
        initial: {
          opacity: 0,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          scale: 1
        },
        exit: {
          opacity: 0,
          scale: 0.95
        },
        transition: {
          duration: 0.25
        },
        className: "p-3.5 rounded-xl bg-black/25 border border-white/[0.05] space-y-2.5",
        children: [_jsxs("div", {
          className: "flex justify-between items-center border-b border-white/[0.06] pb-1.5",
          children: [_jsx("span", {
            className: "text-xs font-bold text-amber-400",
            children: steps[activeStep].title
          }), _jsx("span", {
            className: "text-[8px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400",
            children: steps[activeStep].speed
          })]
        }), _jsxs("p", {
          className: "text-[9px] font-black text-cyan-400 uppercase",
          children: ["Technology: ", steps[activeStep].tech]
        }), _jsx("p", {
          className: "text-[11px] text-zinc-300 leading-relaxed",
          children: steps[activeStep].desc
        })]
      }, activeStep)
    })]
  });
}

function InteractiveFiveFunctions({ color }) {
  const [activeTab, setActiveTab] = useState('exchange');
  const tabs = {
    exchange: {
      title: "Medium of Exchange",
      desc: "Used to buy anything directly. Removes the need to match goods with a seller. You buy tea with ₹10, the vendor accepts it instantly.",
      simTitle: "Barter vs Money Simulator",
      simCode: "exchange"
    },
    unit: {
      title: "Unit of Account",
      desc: "Provides a single scale to measure the value of items. Without money, you'd price a phone in bags of flour or boxes of tea.",
      simTitle: "Price Measurement Tool",
      simCode: "unit"
    },
    store: {
      title: "Store of Value",
      desc: "Allows purchasing power to be saved for future use. Tomatoes rot in 5 days, but ₹10,000 stores its value over years.",
      simTitle: "Value Rotting Simulator",
      simCode: "store"
    },
    deferred: {
      title: "Deferred Payment",
      desc: "Allows easy credit, loans, and EMIs. Setting EMI in wheat is impossible because grain quality and supply fluctuates.",
      simTitle: "EMI / Loan Calculator",
      simCode: "deferred"
    },
    transfer: {
      title: "Transfer of Value",
      desc: "Enables instant transfers of wealth across long distances. It's easy to UPI ₹5,000 to Mumbai, but hard to send physical gold.",
      simTitle: "UPI Value Transmitter",
      simCode: "transfer"
    }
  };

  const [upiStatus, setUpiStatus] = useState('idle');
  const [emiAmount, setEmiAmount] = useState(1000);
  const [savingsType, setSavingsType] = useState('money');
  const [savingsDays, setSavingsDays] = useState(0);

  const startUpi = () => {
    setUpiStatus('sending');
    setTimeout(() => setUpiStatus('success'), 1550);
  };

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [_jsx("h4", {
      className: "text-[11px] font-black uppercase tracking-wider text-zinc-400 text-center",
      children: "5 Main Functions of Money"
    }), _jsx("div", {
      className: "flex space-x-1.5 overflow-x-auto py-1 scrollbar-none border-b border-white/[0.06] pb-2",
      children: Object.entries(tabs).map(([key, tab]) => _jsx("button", {
        onClick: () => {
          setActiveTab(key);
          setUpiStatus('idle');
          setSavingsDays(0);
        },
        className: `px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all flex-shrink-0 cursor-pointer ${activeTab === key ? 'bg-amber-400 text-black font-extrabold shadow-[0_2px_8px_rgba(251,191,36,0.3)]' : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'}`,
        children: tab.title
      }, key))
    }), _jsxs("div", {
      className: "p-3 rounded-xl bg-black/25 border border-white/[0.05] space-y-3",
      children: [_jsx("p", {
        className: "text-[11px] text-zinc-300 leading-relaxed",
        children: tabs[activeTab].desc
      }), _jsxs("div", {
        className: "p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-2",
        children: [_jsx("h5", {
          className: "text-[10px] font-bold text-amber-400 uppercase tracking-wide",
          children: tabs[activeTab].simTitle
        }), activeTab === 'exchange' && _jsxs("div", {
          className: "flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/[0.02]",
          children: [_jsxs("div", {
            className: "text-center",
            children: [_jsx("div", {
              className: "text-2xl",
              children: "📖"
            }), _jsx("span", {
              className: "text-[8px] text-zinc-400",
              children: "Book"
            })]
          }), _jsx("span", {
            className: "text-zinc-600 text-xs",
            children: "➔ 🪙 ➔"
          }), _jsxs("div", {
            className: "text-center",
            children: [_jsx("div", {
              className: "text-2xl",
              children: "☕"
            }), _jsx("span", {
              className: "text-[8px] text-zinc-400",
              children: "Chai"
            })]
          }), _jsx("span", {
            className: "text-emerald-400 text-[10px] font-extrabold ml-2",
            children: "Money enables transaction!"
          })]
        }), activeTab === 'unit' && _jsxs("div", {
          className: "space-y-2 text-[10px] text-zinc-300",
          children: [_jsxs("div", {
            className: "flex justify-between bg-black/20 p-1.5 rounded border border-white/[0.02]",
            children: [_jsx("span", {
              children: "Phone Value:"
            }), _jsx("span", {
              className: "text-emerald-400 font-bold",
              children: "₹20,000"
            }), _jsx("span", {
              className: "text-red-400 font-semibold",
              children: "or 4,000 Teacups"
            })]
          }), _jsxs("div", {
            className: "flex justify-between bg-black/20 p-1.5 rounded border border-white/[0.02]",
            children: [_jsx("span", {
              children: "Shirt Value:"
            }), _jsx("span", {
              className: "text-emerald-400 font-bold",
              children: "₹500"
            }), _jsx("span", {
              className: "text-red-400 font-semibold",
              children: "or 100 Teacups"
            })]
          })]
        }), activeTab === 'store' && _jsxs("div", {
          className: "space-y-2",
          children: [_jsxs("div", {
            className: "flex space-x-2 justify-center",
            children: [_jsx("button", {
              onClick: () => {
                setSavingsType('money');
                setSavingsDays(0);
              },
              className: `px-2 py-1 rounded text-[9px] font-bold cursor-pointer ${savingsType === 'money' ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-zinc-300'}`,
              children: "Save ₹1,000 🪙"
            }), _jsx("button", {
              onClick: () => {
                setSavingsType('tomatoes');
                setSavingsDays(0);
              },
              className: `px-2 py-1 rounded text-[9px] font-bold cursor-pointer ${savingsType === 'tomatoes' ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-zinc-300'}`,
              children: "Save Tomatoes 🍅"
            })]
          }), _jsxs("div", {
            className: "bg-black/20 p-2.5 rounded border border-white/[0.02] flex items-center justify-between text-[10px]",
            children: [_jsxs("div", {
              children: [_jsxs("span", {
                className: "text-zinc-400",
                children: ["Elapsed Days: ", savingsDays, " days"]
              }), _jsx("input", {
                type: "range",
                min: "0",
                max: "30",
                value: savingsDays,
                onChange: e => setSavingsDays(parseInt(e.target.value)),
                className: "w-full mt-1.5 accent-amber-400"
              })]
            }), _jsxs("div", {
              className: "text-right font-bold",
              children: [_jsx("span", {
                className: "text-zinc-400 block",
                children: "Value:"
              }), savingsType === 'money' ? _jsx("span", {
                className: "text-emerald-400",
                children: "₹1,000 (Fresh)"
              }) : _jsx("span", {
                className: savingsDays > 20 ? 'text-red-500' : savingsDays > 5 ? 'text-orange-400' : 'text-emerald-400',
                children: savingsDays > 20 ? 'Rotten / Worthless 🤮' : savingsDays > 5 ? 'Spoiling 🤢' : 'Fresh 🍅'
              })]
            })]
          })]
        }), activeTab === 'deferred' && _jsxs("div", {
          className: "space-y-2 text-[10px] text-zinc-300",
          children: [_jsxs("div", {
            className: "flex justify-between items-center bg-black/20 p-2 rounded border border-white/[0.02]",
            children: [_jsx("span", {
              children: "EMI (10 months):"
            }), _jsx("span", {
              className: "text-amber-400 font-bold",
              children: `₹${emiAmount}/month (Fixed)`
            })]
          }), _jsxs("div", {
            className: "flex items-center justify-between space-x-2",
            children: [_jsx("span", {
              className: "text-zinc-500 text-[9px]",
              children: "Drag to change EMI value:"
            }), _jsx("input", {
              type: "range",
              min: "500",
              max: "2000",
              step: "100",
              value: emiAmount,
              onChange: e => setEmiAmount(parseInt(e.target.value)),
              className: "flex-1 accent-amber-400"
            })]
          })]
        }), activeTab === 'transfer' && _jsxs("div", {
          className: "relative w-full h-16 bg-black/20 rounded-lg border border-white/[0.02] flex items-center justify-between px-6 overflow-hidden",
          children: [upiStatus === 'idle' && _jsx("button", {
            onClick: startUpi,
            className: "mx-auto bg-amber-400 hover:bg-amber-500 text-black px-4 py-1.5 rounded text-[10px] font-bold transition-colors active:scale-95 cursor-pointer",
            children: "Send UPI Transfer (₹5,000)"
          }), upiStatus === 'sending' && _jsxs("div", {
            className: "w-full flex items-center justify-between relative",
            children: [_jsx("span", {
              className: "text-[9px] text-zinc-400",
              children: "Delhi 📍"
            }), _jsx(motion.div, {
              initial: {
                x: -80
              },
              animate: {
                x: 80
              },
              transition: {
                duration: 1.2,
                ease: "easeInOut"
              },
              className: "w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white shadow-[0_0_8px_#10B981]",
              children: "₹"
            }), _jsx("span", {
              className: "text-[9px] text-zinc-400",
              children: "Mumbai 📍"
            })]
          }), upiStatus === 'success' && _jsxs("div", {
            className: "w-full flex flex-col items-center space-y-1.5",
            children: [_jsx("span", {
              className: "text-emerald-400 text-[10px] font-black",
              children: "Received instantly! (2s) ⚡"
            }), _jsx("button", {
              onClick: () => setUpiStatus('idle'),
              className: "text-[8px] bg-white/10 px-2 py-0.5 rounded text-white",
              children: "Send again"
            })]
          })]
        })]
      })]
    })]
  });
}

function InteractiveStudentIncomeFlowchart({ color }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState(null);

  const sources = [
    { id: 1, title: 'Pocket Money', amount: '₹500–₹5,000', category: 'regular', desc: 'Rahul gets ₹3,000/month from his father for college.', type: 'Regular' },
    { id: 2, title: 'Part-time Tuition', amount: '₹2,000–₹8,000', category: 'active', desc: 'Priya teaches 3 kids for ₹2,000/month each — ₹6,000 total.', type: 'Active' },
    { id: 3, title: 'Cafe Job', amount: '₹4,000–₹8,000', category: 'active', desc: 'Amit earns ₹7,000/month working at Starbucks on weekends.', type: 'Active' },
    { id: 4, title: 'Delivery Gig', amount: '₹6,000–₹15,000', category: 'active', desc: 'Kunal earns ₹8,000 on Swiggy weekends and up to ₹15,000 part-time.', type: 'Active' },
    { id: 5, title: 'Freelance Coding', amount: '₹5,000–₹50,000', category: 'active', desc: 'Sneha earns ₹15,000/month doing Python projects on Fiverr.', type: 'Active' },
    { id: 6, title: 'Freelance Design', amount: '₹3,000–₹30,000', category: 'active', desc: 'Rohan makes ₹10,000/month designing logos on Upwork.', type: 'Active' },
    { id: 7, title: 'Freelance Writing', amount: '₹2,000–₹20,000', category: 'active', desc: 'Meera earns ₹8,000/month writing blog content.', type: 'Active' },
    { id: 8, title: 'Scholarship', amount: '₹1,000–₹25,000', category: 'regular', desc: 'Aman gets PM Scholarship of ₹12,000/year (₹1,000/month).', type: 'Regular' },
    { id: 9, title: 'Research Stipend', amount: '₹8,000–₹25,000', category: 'regular', desc: 'PhD stipend UGC is ₹18,000/month (up to ₹25,000).', type: 'Regular' },
    { id: 10, title: 'YouTube Ad', amount: '₹500–₹50,000', category: 'passive', desc: 'Arjun earns ₹5,000/month from his tech channel ad revenue.', type: 'Passive' },
    { id: 11, title: 'Affiliate Marketing', amount: '₹500–₹20,000', category: 'passive', desc: 'Neha earns ₹3,000/month from Amazon affiliate links on her blog.', type: 'Passive' },
    { id: 12, title: 'Internship Stipend', amount: '₹5,000–₹25,000', category: 'active', desc: 'IIT summer internship pays ₹15,000–₹25,000/month.', type: 'Active' },
    { id: 13, title: 'Event Photography', amount: '₹3,000–₹15,000', category: 'active', desc: 'Vikram earns ₹8,000 shooting weekend events and weddings.', type: 'Active' },
    { id: 14, title: 'Data Entry/Freelance', amount: '₹3,000–₹10,000', category: 'active', desc: 'Simple copy-paste tasks can earn ₹5,000/month.', type: 'Active' },
    { id: 15, title: 'Campus Ambassador', amount: '₹2,000–₹8,000', category: 'campus', desc: 'Brand promotions in college campus earn ₹4,000/month.', type: 'Campus' }
  ];

  const filtered = sources.filter(s => {
    const matchesTab = filter === 'all' || s.category === filter;
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("div", {
        className: "relative w-full h-16 rounded-xl overflow-hidden flex items-center justify-center p-3",
        children: [_jsxs("svg", {
          className: "absolute inset-0 w-full h-full object-cover opacity-30",
          children: [
            _jsx("defs", {
              children: _jsxs("linearGradient", {
                id: "bannerGrad",
                x1: "0%",
                y1: "0%",
                x2: "100%",
                y2: "100%",
                children: [
                  _jsx("stop", { offset: "0%", stopColor: "#10B981" }),
                  _jsx("stop", { offset: "100%", stopColor: "#059669" })
                ]
              })
            }),
            _jsx("rect", { width: "100%", height: "100%", fill: "url(#bannerGrad)" })
          ]
        }), _jsx("h4", {
          className: "relative text-sm sm:text-base font-black uppercase tracking-wider text-emerald-400 text-center drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]",
          children: "STUDENTS' 15 REAL INCOME SOURCES WITH AMOUNTS"
        })]
      }),
      _jsxs("div", {
        className: "flex gap-2",
        children: [
          _jsx("input", {
            type: "text",
            placeholder: "Search source...",
            value: searchTerm,
            onChange: e => setSearchTerm(e.target.value),
            className: "flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-emerald-500/50"
          }),
          _jsx("select", {
            value: filter,
            onChange: e => setFilter(e.target.value),
            className: "bg-black/30 border border-white/10 rounded-xl px-2 py-1.5 text-xs sm:text-sm text-zinc-300 outline-none",
            children: [
              _jsx("option", { value: "all", children: "All Categories" }, "all"),
              _jsx("option", { value: "active", children: "Active" }, "active"),
              _jsx("option", { value: "passive", children: "Passive" }, "passive"),
              _jsx("option", { value: "regular", children: "Regular" }, "regular"),
              _jsx("option", { value: "campus", children: "Campus" }, "campus")
            ]
          })
        ]
      }),
      _jsx("div", {
        className: "max-h-[220px] overflow-y-auto space-y-1.5 pr-1 scrollbar-none",
        children: filtered.map(s => _jsxs("div", {
          onClick: () => setSelectedSource(s.id === selectedSource ? null : s.id),
          className: `p-2.5 rounded-xl border transition-all cursor-pointer ${selectedSource === s.id ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-white/5 border-white/[0.04] hover:bg-white/10'}`,
          children: [
            _jsxs("div", {
              className: "flex justify-between items-center",
              children: [
                _jsxs("div", {
                  className: "flex items-center space-x-2",
                  children: [
                    _jsx("span", { className: "text-[11px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase", children: s.type }),
                    _jsx("span", { className: "text-xs sm:text-sm font-bold text-zinc-100", children: s.title })
                  ]
                }),
                _jsx("span", { className: "text-xs sm:text-sm font-extrabold text-emerald-400", children: s.amount })
              ]
            }),
            selectedSource === s.id && _jsx(motion.div, {
              initial: { height: 0, opacity: 0 },
              animate: { height: 'auto', opacity: 1 },
              className: "mt-2 pt-2 border-t border-white/[0.05] text-xs sm:text-sm text-zinc-400 leading-relaxed",
              children: s.desc
            })
          ]
        }, s.id))
      })
    ]
  });
}

function InteractiveIncomeTypesVisual({ color }) {
  const [activeType, setActiveType] = useState('active');

  const content = {
    active: {
      title: "Active Income Engine",
      sub: "Time for Money ⏳ ➔ 💵",
      desc: "Requires your physical presence, skills, and direct time commitment. If you stop working, the income stops immediately.",
      examples: ["Cafe Shifts (Starbucks hourly pay)", "Teaching kids coding or math tuition", "Freelance developer/designer projects", "Food or package delivery gigs", "Corporate internship stipends"],
      color: "from-sky-400 to-blue-500",
      svg: _jsxs("svg", {
        className: "w-20 h-20 text-sky-400",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        children: [
          _jsx("circle", { cx: "12", cy: "12", r: "10" }),
          _jsx(motion.polyline, {
            points: "12 6 12 12 16 14",
            strokeWidth: "2",
            style: { transformOrigin: "12px 12px" },
            animate: { rotate: 360 },
            transition: { repeat: Infinity, duration: 4, ease: "linear" }
          })
        ]
      })
    },
    passive: {
      title: "Passive Income Asset",
      sub: "Asset for Money ⚙️ ➔ 💵",
      desc: "Setting up a mechanism or investing resources once, which flows return payments repeatedly without daily time investment.",
      examples: ["YouTube videos earning monthly ad-revenue", "Dividend stock payouts quarterly", "E-book or Figma template online sales", "SIP mutual fund compound returns", "Subletting a PG room or renting a bike"],
      color: "from-emerald-400 to-teal-500",
      svg: _jsxs("svg", {
        className: "w-20 h-20 text-emerald-400",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        children: [
          _jsx("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }),
          _jsx(motion.circle, {
            cx: "12",
            cy: "12",
            r: "8",
            strokeDasharray: "4 4",
            animate: { rotate: 360 },
            transition: { repeat: Infinity, duration: 10, ease: "linear" }
          })
        ]
      })
    },
    irregular: {
      title: "Regular vs Irregular Strategy",
      sub: "Predictability 📊 ➔ 🛡️",
      desc: "Regular income (pocket money, fixed stipend) is easy to budget. Irregular income (freelancing, gigs) fluctuates. Solution: Buffer Month system.",
      examples: ["Buffer Month: Keep one month of expenses in reserve", "Regular: Fixed inflow, automate SIP saving", "Irregular: Save heavily during peak gig months", "Budget using lowest average monthly income", "Separate personal and freelancing wallets"],
      color: "from-amber-400 to-orange-500",
      svg: _jsxs("svg", {
        className: "w-20 h-20 text-amber-400",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        children: [
          _jsx("path", { d: "M18 20V10M12 20V4M6 20v-6" }),
          _jsx(motion.path, {
            d: "M3 12h18",
            strokeDasharray: "2 2",
            animate: { y: [-3, 3, -3] },
            transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          })
        ]
      })
    }
  };

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("div", {
        className: "grid grid-cols-3 gap-1.5",
        children: Object.keys(content).map(key => _jsx("button", {
          onClick: () => setActiveType(key),
          className: `py-1.5 px-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all uppercase ${activeType === key ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 border border-white/10 text-zinc-400'}`,
          children: key
        }, key))
      }),
      _jsxs("div", {
        className: "p-4 rounded-xl bg-black/25 border border-white/[0.04] flex items-center gap-4",
        children: [
          _jsx("div", {
            className: "flex-shrink-0 flex items-center justify-center bg-white/[0.02] p-2 rounded-xl border border-white/[0.04]",
            children: content[activeType].svg
          }),
          _jsxs("div", {
            className: "flex-1 space-y-1",
            children: [
              _jsx("h4", { className: "text-sm sm:text-base font-black text-white leading-tight", children: content[activeType].title }),
              _jsx("h5", { className: "text-[11px] sm:text-xs font-bold text-emerald-400", children: content[activeType].sub }),
              _jsx("p", { className: "text-[11px] sm:text-xs text-zinc-400 leading-relaxed", children: content[activeType].desc })
            ]
          })
        ]
      }),
      _jsxs("div", {
        className: "space-y-1.5",
        children: [
          _jsx("h5", { className: "text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wide", children: "Typical Scenarios / Best Practices:" }),
          _jsx("div", {
            className: "grid grid-cols-1 gap-1.5",
            children: content[activeType].examples.map((ex, i) => _jsxs("div", {
              className: "flex items-center space-x-2 bg-white/[0.02] px-2.5 py-1.5 rounded-lg border border-white/[0.02] text-xs sm:text-sm text-zinc-300",
              children: [
                _jsx("span", { className: "text-emerald-500 font-bold", children: "✓" }),
                _jsx("span", { children: ex })
              ]
            }, i))
          })
        ]
      })
    ]
  });
}

function InteractiveExpenseConcept({ color }) {
  const [rent, setRent] = useState(4000);
  const [mess, setMess] = useState(3000);
  const [eatingOut, setEatingOut] = useState(2000);
  const [chaiFreq, setChaiFreq] = useState(30);

  const fixedTotal = rent + mess + 399 + 500; // Rent + Mess + Phone + Transport Pass
  const variableTotal = eatingOut + (chaiFreq * 20) + 1500; // Eating Out + Chai + Shopping/Movies

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("h4", {
        className: "text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-400 text-center",
        children: "PG & Variable Budget Builder"
      }),
      _jsxs("div", {
        className: "grid grid-cols-2 gap-3",
        children: [
          _jsxs("div", {
            className: "p-3 rounded-xl bg-black/25 border border-white/[0.04] space-y-3",
            children: [
              _jsx("h5", { className: "text-xs sm:text-sm font-extrabold text-sky-400 uppercase border-b border-white/[0.06] pb-1", children: "Fixed (Needs)" }),
              _jsxs("div", {
                className: "space-y-2 text-xs sm:text-sm text-zinc-300",
                children: [
                  _jsxs("div", {
                    children: [
                      _jsxs("span", { className: "flex justify-between", children: [_jsx("span", { children: "PG Rent:" }), _jsxs("span", { className: "text-white", children: ["₹", rent] })] }),
                      _jsx("input", { type: "range", min: "2500", max: "8000", step: "500", value: rent, onChange: e => setRent(parseInt(e.target.value)), className: "w-full mt-1 accent-sky-400" })
                    ]
                  }),
                  _jsxs("div", {
                    children: [
                      _jsxs("span", { className: "flex justify-between", children: [_jsx("span", { children: "Mess Plan:" }), _jsxs("span", { className: "text-white", children: ["₹", mess] })] }),
                      _jsx("input", { type: "range", min: "2000", max: "5000", step: "250", value: mess, onChange: e => setMess(parseInt(e.target.value)), className: "w-full mt-1 accent-sky-400" })
                    ]
                  }),
                  _jsxs("div", { className: "flex justify-between text-zinc-500", children: [_jsx("span", { children: "Phone Recharge:" }), _jsx("span", { children: "₹399" })] }),
                  _jsxs("div", { className: "flex justify-between text-zinc-500", children: [_jsx("span", { children: "Metro Pass:" }), _jsx("span", { children: "₹500" })] }),
                  _jsxs("div", { className: "border-t border-white/[0.06] pt-1 flex justify-between font-black text-sky-400 text-xs sm:text-sm", children: [_jsx("span", { children: "Fixed Sum:" }), _jsxs("span", { children: ["₹", fixedTotal] })] })
                ]
              })
            ]
          }),
          _jsxs("div", {
            className: "p-3 rounded-xl bg-black/25 border border-white/[0.04] space-y-3",
            children: [
              _jsx("h5", { className: "text-xs sm:text-sm font-extrabold text-red-400 uppercase border-b border-white/[0.06] pb-1", children: "Variable (Wants)" }),
              _jsxs("div", {
                className: "space-y-2 text-xs sm:text-sm text-zinc-300",
                children: [
                  _jsxs("div", {
                    children: [
                      _jsxs("span", { className: "flex justify-between", children: [_jsx("span", { children: "Swiggy/Eating Out:" }), _jsxs("span", { className: "text-white", children: ["₹", eatingOut] })] }),
                      _jsx("input", { type: "range", min: "500", max: "5000", step: "500", value: eatingOut, onChange: e => setEatingOut(parseInt(e.target.value)), className: "w-full mt-1 accent-red-400" })
                    ]
                  }),
                  _jsxs("div", {
                    children: [
                      _jsxs("span", { className: "flex justify-between", children: [_jsx("span", { children: "Chai/Coffee Days:" }), _jsxs("span", { className: "text-white", children: [chaiFreq, " cups"] })] }),
                      _jsx("input", { type: "range", min: "0", max: "60", step: "5", value: chaiFreq, onChange: e => setChaiFreq(parseInt(e.target.value)), className: "w-full mt-1 accent-red-400" })
                    ]
                  }),
                  _jsxs("div", { className: "flex justify-between text-zinc-500", children: [_jsx("span", { children: "Shopping/Movies:" }), _jsx("span", { children: "₹1,000" })] }),
                  _jsxs("div", { className: "flex justify-between text-zinc-500", children: [_jsx("span", { children: "Weekend Trips:" }), _jsx("span", { children: "₹500" })] }),
                  _jsxs("div", { className: "border-t border-white/[0.06] pt-1 flex justify-between font-black text-red-400 text-xs sm:text-sm", children: [_jsx("span", { children: "Variable Sum:" }), _jsxs("span", { children: ["₹", variableTotal] })] })
                ]
              })
            ]
          })
        ]
      }),
      _jsxs("div", {
        className: "p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs sm:text-sm",
        children: [
          _jsxs("div", {
            children: [
              _jsx("span", { className: "text-zinc-400", children: "Total Outflow: " }),
              _jsxs("span", { className: "font-black text-white", children: ["₹", fixedTotal + variableTotal] })
            ]
          }),
          _jsxs("div", {
            className: "text-xs sm:text-sm font-black text-right",
            children: [
              _jsx("span", { className: "text-zinc-500 block", children: "Discretionary Ratio:" }),
              _jsxs("span", {
                className: variableTotal > fixedTotal ? 'text-red-400' : 'text-emerald-400',
                children: [Math.round((variableTotal / (fixedTotal + variableTotal)) * 100), "% discretionary"]
              })
            ]
          })
        ]
      })
    ]
  });
}

function InteractiveNeedsVsWantsSim({ color }) {
  const scenarios = [
    { item: "College tuition fees", need: true, desc: "Education basic right and necessity." },
    { item: "Branded backpack", need: false, desc: "A normal backpack can carry books." },
    { item: "Internet recharge", need: true, desc: "Essential for coding courses and communication." },
    { item: "Netflix subscription", need: false, desc: "Entertainment want; YouTube is free." },
    { item: "Doctor visit (illness)", need: true, desc: "Health is non-negotiable." },
    { item: "Branded shoes (3rd pair)", need: false, desc: "One or two pairs are sufficient." },
    { item: "Laptop for coding", need: true, desc: "Essential work tool for CS students." },
    { item: "Gaming laptop", need: false, desc: "Basic programming doesn't need high-end GPU." },
    { item: "Basic medicines", need: true, desc: "Health first aid is essential." },
    { item: "Expensive gym membership", need: false, desc: "Calisthenics or college gyms are cheaper." },
    { item: "Textbooks", need: true, desc: "Essential study materials (used is fine)." },
    { item: "iPhone 15", need: false, desc: "A ₹15,000 Android works just fine." },
    { item: "Mess food", need: true, desc: "Basic nutrition is a core necessity." },
    { item: "Daily Starbucks coffee", need: false, desc: "Homemade tea/coffee costs 95% less." },
    { item: "Public transport pass", need: true, desc: "Commute is necessary for college." },
    { item: "Ola/Uber daily", need: false, desc: "Bus/Metro options are far cheaper." },
    { item: "Notebook / pen", need: true, desc: "Basic stationery tools are needs." },
    { item: "iPad for notes", need: false, desc: "Convenience, paper notebooks work." },
    { item: "Health insurance", need: true, desc: "Critical protection against emergencies." },
    { item: "Expensive birthday gift", need: false, desc: "Thoughtful actions beat expensive gifts." }
  ];

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleChoice = (chooseNeed) => {
    const isCorrect = chooseNeed === scenarios[index].need;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? "Correct! ✓" : "Incorrect! ✗");
    setTimeout(() => {
      setFeedback(null);
      if (index < scenarios.length - 1) {
        setIndex(i => i + 1);
      } else {
        setIsFinished(true);
      }
    }, 1600);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setFeedback(null);
    setIsFinished(false);
  };

  if (isFinished) {
    return _jsxs("div", {
      className: "mt-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-4 font-mono select-none",
      children: [
        _jsx("div", { className: "text-4xl animate-bounce", children: "🏆" }),
        _jsx("h4", { className: "text-sm font-black text-white", children: "Needs vs Wants Game Completed" }),
        _jsxs("p", { className: "text-[12px] text-zinc-400", children: ["Your Score: ", score, " / ", scenarios.length] }),
        _jsx("div", {
          className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-zinc-300 leading-relaxed",
          children: score > 15 ? "Excellent budgeting mindset! You know what is essential." : "Review the reasons; cut discretionary wants to save faster."
        }),
        _jsx("button", {
          onClick: handleRestart,
          className: "w-full bg-emerald-500 text-black py-2 rounded-xl text-sm sm:text-base font-bold transition-all active:scale-95 cursor-pointer",
          children: "Play Again"
        })
      ]
    });
  }

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsxs("div", {
        className: "flex justify-between items-center border-b border-white/[0.06] pb-2",
        children: [
          _jsx("span", { className: "text-[11px] sm:text-xs text-zinc-500 font-extrabold uppercase", children: "Scenario Sorter" }),
          _jsxs("span", { className: "text-xs sm:text-sm text-emerald-400 font-bold", children: [index + 1, " / ", scenarios.length] })
        ]
      }),
      _jsxs("div", {
        className: "h-28 bg-black/25 border border-white/[0.04] rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden",
        children: [
          feedback ? (
            _jsxs(motion.div, {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              className: `text-center space-y-1.5`,
              children: [
                _jsx("span", { className: `text-base font-black ${feedback.includes('Correct') ? 'text-emerald-400' : 'text-red-400'}`, children: feedback }),
                _jsx("p", { className: "text-xs sm:text-sm text-zinc-400 max-w-[280px] leading-tight", children: scenarios[index].desc })
              ]
            })
          ) : (
            _jsxs("div", {
              className: "text-center space-y-1",
              children: [
                _jsx("span", { className: "text-zinc-500 text-[10px] uppercase tracking-widest", children: "Item to classify:" }),
                _jsx("h4", { className: "text-base sm:text-lg font-black text-white", children: scenarios[index].item })
              ]
            })
          )]
      }),
      _jsxs("div", {
        className: "flex gap-3",
        children: [
          _jsx("button", {
            disabled: feedback !== null,
            onClick: () => handleChoice(true),
            className: "flex-1 bg-emerald-500 text-black py-2 rounded-xl text-sm sm:text-base font-bold transition-all disabled:opacity-50 active:scale-95 cursor-pointer",
            children: "NEED"
          }),
          _jsx("button", {
            disabled: feedback !== null,
            onClick: () => handleChoice(false),
            className: "flex-1 bg-red-500 text-white py-2 rounded-xl text-sm sm:text-base font-bold transition-all disabled:opacity-50 active:scale-95 cursor-pointer",
            children: "WANT"
          })
        ]
      })
    ]
  });
}

function InteractiveMidWayQuiz({ color }) {
  const questions = [
    {
      q: "What is the primary limitation of the Barter system?",
      opts: ["Lack of precious metals", "Double Coincidence of Wants", "High transaction tax rates", "Ledger mismatch"],
      ans: 1,
      hint: "Both parties must want what the other offers."
    },
    {
      q: "What gives 'Fiat Currency' its value?",
      opts: ["Gold stored in central banks", "Silver mining quantities", "Government decree & public trust", "Cryptographic ledgers"],
      ans: 2,
      hint: "Fiat is backed by trust and declarations."
    },
    {
      q: "Which of the following is a Passive Income example?",
      opts: ["Cafe barista job", "Swiggy delivery weekend gig", "YouTube monthly ad-revenue", "Coding project freelance hourly"],
      ans: 2,
      hint: "Frictionless payout from assets set up once."
    },
    {
      q: "PG Rent or hostel fees are classified as what type of expense?",
      opts: ["Variable Expense", "Fixed Expense", "Discretionary Outflow", "Passive Outflow"],
      ans: 1,
      hint: "Charges that stay identical every single month."
    },
    {
      q: "Which item is a non-negotiable NEED for a Computer Science student?",
      opts: ["Branded high-end shoes", "Netflix basic subscription", "A functional coding laptop", "iPad for writing logs"],
      ans: 2,
      hint: "An essential tool for study and practice."
    }
  ];

  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState('active'); // 'active', 'answered', 'ended'

  useEffect(() => {
    if (quizState !== 'active') return;
    if (timer === 0) {
      handleAnswer(-1); // Timeout
      return;
    }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, quizState]);

  const handleAnswer = (optIdx) => {
    setSelectedOpt(optIdx);
    setQuizState('answered');
    const isCorrect = optIdx === questions[qIdx].ans;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (qIdx < questions.length - 1) {
        setQIdx(qIdx + 1);
        setSelectedOpt(null);
        setTimer(15);
        setQuizState('active');
      } else {
        setQuizState('ended');
      }
    }, 2500);
  };

  const handleRestart = () => {
    setQIdx(0);
    setSelectedOpt(null);
    setTimer(15);
    setScore(0);
    setQuizState('active');
  };

  if (quizState === 'ended') {
    return _jsxs("div", {
      className: "mt-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-4 font-mono select-none",
      children: [
        _jsx("div", { className: "text-4xl", children: score === 5 ? "👑" : "🎓" }),
        _jsx("h4", { className: "text-sm font-black text-white", children: "Reinforcement Quiz Completed" }),
        _jsxs("p", { className: "text-[12px] text-zinc-400", children: ["Final Score: ", score, " / ", questions.length] }),
        _jsx("div", {
          className: "p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-zinc-300 leading-relaxed",
          children: score === 5 ? "Flawless score! You have completely mastered these concepts." : "Good attempt! Keep reviewing the cards to polish your understanding."
        }),
        _jsx("button", {
          onClick: handleRestart,
          className: "w-full bg-purple-500 text-white py-2 rounded-xl text-sm sm:text-base font-bold transition-all active:scale-95 cursor-pointer",
          children: "Retake Quiz"
        })
      ]
    });
  }

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsxs("div", {
        className: "flex justify-between items-center border-b border-white/[0.06] pb-2 text-[11px] sm:text-xs text-zinc-500 font-extrabold uppercase",
        children: [
          _jsxs("span", { children: ["Question ", qIdx + 1, " of ", questions.length] }),
          _jsxs("span", { className: timer < 5 ? 'text-red-400' : 'text-purple-400', children: ["Time Left: ", timer, "s"] })
        ]
      }),
      _jsx("div", {
        className: "min-h-[60px] flex items-center bg-black/25 border border-white/[0.04] p-3 rounded-xl",
        children: _jsx("h4", { className: "text-xs sm:text-sm font-bold text-zinc-100 leading-normal", children: questions[qIdx].q })
      }),
      _jsx("div", {
        className: "space-y-1.5",
        children: questions[qIdx].opts.map((opt, i) => {
          let optStyle = "bg-white/5 border-white/10 text-zinc-300";
          if (quizState === 'answered') {
            if (i === questions[qIdx].ans) {
              optStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold";
            } else if (i === selectedOpt) {
              optStyle = "bg-red-500/20 border-red-500 text-red-400";
            } else {
              optStyle = "bg-white/[0.02] border-white/5 text-zinc-600 opacity-60";
            }
          }

          return _jsx("button", {
            disabled: quizState === 'answered',
            onClick: () => handleAnswer(i),
            className: `w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all duration-300 active:scale-[0.99] cursor-pointer ${optStyle}`,
            children: opt
          }, i);
        })
      }),
      quizState === 'answered' && _jsxs("p", {
        className: "text-xs sm:text-sm text-zinc-500 italic text-center",
        children: ["Hint: ", questions[qIdx].hint]
      })
    ]
  });
}

function InteractiveSavingsDeepdive({ color }) {
  const [activeTab, setActiveTab] = useState('reasons');
  const [activeItem, setActiveItem] = useState(null);

  const reasons = [
    { id: 1, title: 'Emergency shield', desc: 'Emergency could strike anytime (e.g. broken phone ₹12k, illness). Without savings, credit card/loan debt at 36%+ interest becomes a nightmare.' },
    { id: 2, title: 'Stress reduction', desc: 'Saves you from constant money anxiety. Research proves financial reserves directly boost mental peace.' },
    { id: 3, title: 'Achieve future goals', desc: 'Planning to buy a laptop or bike? Saving ₹3,500/month gets a ₹40,000 device within a year debt-free.' },
    { id: 4, title: 'Debt prevention', desc: 'Avoid taking high-interest personal loans. A ₹50k loan at 18% costs you ₹72k+ total. Savings preserve that money.' },
    { id: 5, title: 'Independence', desc: 'No need to ask parents or friends for small expenses. The first stepping stone to self-reliance.' },
    { id: 6, title: 'Capital for investments', desc: 'SIP needs capital. Saving ₹100 or ₹500 is step one; that capital is what you invest.' },
    { id: 7, title: 'Compounding power', desc: 'Starting early beats saving large later. Saving ₹500/month starting at age 20 compounds to ₹17.6 Lakhs by 50.' },
    { id: 8, title: 'Building lifetime habits', desc: 'Save ₹500 today, you can save ₹5,000 tomorrow. Discipline stays for life.' },
    { id: 9, title: 'Life options remain open', desc: 'Change careers, shift cities, or leave toxic environments. Savings afford options.' },
    { id: 10, title: 'Inflation hedge', desc: 'Convert cash savings into low-risk capital or investments so purchasing power does not dissolve.' }
  ];

  const myths = [
    { id: 1, title: '"Earnings too low to save"', desc: 'Saving ₹500/month is ₹6,000/year. Invested in an index fund or SIP, it expands to ₹40k+ in 5 years. Every large sum starts small.' },
    { id: 2, title: '"I am young, will save later"', desc: 'Delaying 10 years (starting at 30 vs 20) with ₹1,000/month results in an ₹83 Lakh deficit at age 60 (₹1.18Cr vs ₹35L).' },
    { id: 3, title: '"My parents will always provide"', desc: 'Parents cannot fund you forever. Aim for self-reliance past 21.' },
    { id: 4, title: '"I do not know how to start"', desc: 'Set up an auto-debit of ₹500 from your bank account when pocket money arrives. Automate and forget.' },
    { id: 5, title: '"My lifestyle expenses are too high"', desc: 'Run an audit. Cutting daily ₹50 tea or two Swiggy orders (₹3k) frees up significant savings.' },
    { id: 6, title: '"Can always take an emergency loan"', desc: 'Loan total cost is heavy. High interests devour future earnings.' },
    { id: 7, title: '"Savings accounts are fully safe"', desc: 'With inflation at 6% and savings account giving 3-4%, you lose purchasing power. Save first, then invest.' },
    { id: 8, title: '"Lifestyle inflation is unavoidable"', desc: 'Salary went up ₹5k to ₹15k? Do not triple expenses. Triple your savings rate first.' },
    { id: 9, title: '"No financial goal = no need to save"', desc: 'Save for the habit. Goals will clarify, but savings will protect you in the interim.' },
    { id: 10, title: '"Instagram lifestyle is reality"', desc: 'Unfollow lifestyle FOMO accounts. Most online displays of wealth are debt-funded or rented.' }
  ];

  const list = activeTab === 'reasons' ? reasons : myths;

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("div", {
        className: "flex gap-2 border-b border-white/[0.06] pb-2",
        children: [
          _jsx("button", {
            onClick: () => { setActiveTab('reasons'); setActiveItem(null); },
            className: `flex-1 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all uppercase ${activeTab === 'reasons' ? 'bg-pink-500 text-white font-extrabold shadow-lg shadow-pink-500/20' : 'bg-white/5 border border-white/10 text-zinc-400'}`,
            children: "10 Reasons to Save"
          }),
          _jsx("button", {
            onClick: () => { setActiveTab('myths'); setActiveItem(null); },
            className: `flex-1 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all uppercase ${activeTab === 'myths' ? 'bg-pink-500 text-white font-extrabold shadow-lg shadow-pink-500/20' : 'bg-white/5 border border-white/10 text-zinc-400'}`,
            children: "10 Myths Busted"
          })
        ]
      }),
      _jsxs("div", {
        className: "relative w-full h-16 bg-black/25 rounded-xl border border-white/[0.04] flex items-center justify-center p-2",
        children: [
          _jsxs("svg", {
            className: "absolute inset-0 w-full h-full object-cover opacity-20",
            children: [
              _jsx("defs", {
                children: _jsxs("linearGradient", {
                  id: "savingsGrad",
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "100%",
                  children: [
                    _jsx("stop", { offset: "0%", stopColor: "#EC4899" }),
                    _jsx("stop", { offset: "100%", stopColor: "#DB2777" })
                  ]
                })
              }),
              _jsx("rect", { width: "100%", height: "100%", fill: "url(#savingsGrad)" })
            ]
          }),
          _jsx("h5", { className: "text-center text-xs sm:text-sm font-black uppercase tracking-wider text-pink-400 relative z-10", children: activeTab === 'reasons' ? "Why saving is your ultimate shield" : "Busting mainstream financial lies" })
        ]
      }),
      _jsx("div", {
        className: "max-h-[220px] overflow-y-auto space-y-1.5 pr-1 scrollbar-none",
        children: list.map(item => _jsxs("div", {
          onClick: () => setActiveItem(activeItem === item.id ? null : item.id),
          className: `p-2.5 rounded-xl border transition-all cursor-pointer ${activeItem === item.id ? 'bg-pink-500/10 border-pink-500/40' : 'bg-white/5 border-white/[0.04] hover:bg-white/10'}`,
          children: [
            _jsxs("div", {
              className: "flex justify-between items-center",
              children: [
                _jsxs("div", {
                  className: "flex items-center space-x-2",
                  children: [
                    _jsx("span", { className: "text-[11px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded font-black", children: item.id }),
                    _jsx("span", { className: "text-xs sm:text-sm font-bold text-zinc-200", children: item.title })
                  ]
                }),
                _jsx("span", { className: "text-xs sm:text-sm text-zinc-500", children: activeItem === item.id ? "▲" : "▼" })
              ]
            }),
            activeItem === item.id && _jsx(motion.div, {
              initial: { height: 0, opacity: 0 },
              animate: { height: 'auto', opacity: 1 },
              className: "mt-2 pt-2 border-t border-white/[0.05] text-xs sm:text-sm text-zinc-400 leading-relaxed",
              children: item.desc
            })
          ]
        }, item.id))
      })
    ]
  });
}

function InteractiveBudgetConcept({ color }) {
  const [inflow, setInflow] = useState(15000);
  const [expensePercent, setExpensePercent] = useState(60);
  const expenses = Math.round(inflow * (expensePercent / 100));
  const savings = inflow - expenses;

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("h4", {
        className: "text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-400 text-center",
        children: "Budget Flow Visualizer"
      }),
      _jsxs("div", {
        className: "space-y-2",
        children: [
          _jsxs("div", {
            className: "flex justify-between text-xs sm:text-sm text-zinc-300",
            children: [
              _jsx("span", { children: "Monthly Inflow (Paisa Aaya):" }),
              _jsxs("span", { className: "text-emerald-400 font-bold text-sm sm:text-base", children: ["₹", inflow.toLocaleString()] })
            ]
          }),
          _jsx("input", {
            type: "range",
            min: "5000",
            max: "50000",
            step: "1000",
            value: inflow,
            onChange: (e) => setInflow(parseInt(e.target.value)),
            className: "w-full accent-emerald-400"
          })
        ]
      }),
      _jsxs("div", {
        className: "space-y-2",
        children: [
          _jsxs("div", {
            className: "flex justify-between text-xs sm:text-sm text-zinc-300",
            children: [
              _jsx("span", { children: "Expense Allocation (Kahan Gaya):" }),
              _jsxs("span", { className: "text-red-400 font-bold", children: [expensePercent, "%"] })
            ]
          }),
          _jsx("input", {
            type: "range",
            min: "20",
            max: "90",
            step: "5",
            value: expensePercent,
            onChange: (e) => setExpensePercent(parseInt(e.target.value)),
            className: "w-full accent-red-400"
          })
        ]
      }),
      _jsxs("div", {
        className: "grid grid-cols-2 gap-4 h-36 bg-black/20 rounded-xl p-3 border border-white/[0.04] relative overflow-hidden",
        children: [
          _jsxs("div", {
            className: "flex flex-col justify-end items-center bg-red-500/5 border border-red-500/10 rounded-lg p-2 relative",
            children: [
              _jsx(motion.div, {
                className: "absolute bottom-0 inset-x-0 bg-gradient-to-t from-red-600/40 to-red-500/20 rounded-b-lg",
                style: { height: `${expensePercent}%` },
                transition: { type: "spring", stiffness: 100 }
              }),
              _jsxs("div", {
                className: "relative z-10 text-center space-y-1",
                children: [
                  _jsx("span", { className: "text-2xl", children: "💸" }),
                  _jsx("span", { className: "text-[10px] text-zinc-400 block font-bold uppercase", children: "Expenses" }),
                  _jsxs("span", { className: "text-xs sm:text-sm font-black text-red-400", children: ["₹", expenses.toLocaleString()] })
                ]
              })
            ]
          }),
          _jsxs("div", {
            className: "flex flex-col justify-end items-center bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2 relative",
            children: [
              _jsx(motion.div, {
                className: "absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-600/40 to-emerald-500/20 rounded-b-lg",
                style: { height: `${100 - expensePercent}%` },
                transition: { type: "spring", stiffness: 100 }
              }),
              _jsxs("div", {
                className: "relative z-10 text-center space-y-1",
                children: [
                  _jsx("span", { className: "text-2xl", children: "🛡️" }),
                  _jsx("span", { className: "text-[10px] text-zinc-400 block font-bold uppercase", children: "Savings" }),
                  _jsxs("span", { className: "text-xs sm:text-sm font-black text-emerald-400", children: ["₹", savings.toLocaleString()] })
                ]
              })
            ]
          })
        ]
      }),
      _jsx("p", {
        className: "text-[10px] sm:text-xs text-zinc-400 text-center leading-relaxed",
        children: "A budget maps out this entire flow. Without it, you are walking in the dark, wondering kahan gaya paisa!"
      })
    ]
  });
}

function InteractiveInteractiveBudgetScenarios({ color }) {
  const [activeId, setActiveId] = useState(0);

  const scenarios = [
    {
      id: 0,
      name: "1. Rohan (No Budget)",
      income: "₹15,000/month",
      details: "Spends recklessly. Money vanishes by the 15th of every month.",
      actions: "Borrows ₹5,000 from friends via UPI to cover leftovers.",
      result: "Debt & Stress at month-end. ❌",
      inflow: 15000,
      outflow: 20000,
      saved: -5000,
      emoji: "😰"
    },
    {
      id: 1,
      name: "2. Priya (With Budget)",
      income: "₹10,000/month",
      details: "Strict discipline: ₹5,000 needs, ₹3,000 wants.",
      actions: "Saves ₹2,000 immediately when income arrives.",
      result: "₹2,000 in bank. Peace of mind. ✓",
      inflow: 10000,
      outflow: 8000,
      saved: 2000,
      emoji: "😇"
    },
    {
      id: 2,
      name: "3. Amit (Overspending)",
      income: "₹20,000/month",
      details: "Spends ₹12,000 rent (lives alone) and ₹5,000 food.",
      actions: "Left with only ₹3,000 for transport and utilities.",
      result: "Zero savings. One emergency away from crisis.",
      inflow: 20000,
      outflow: 20000,
      saved: 0,
      emoji: "⚠️"
    },
    {
      id: 3,
      name: "4. Sneha (Smart Budget)",
      income: "₹8,000/month",
      details: "Shares rent (₹3,000) and food (₹2,000). Saves ₹1,500.",
      actions: "Sets aside ₹1,500 monthly for laptop fund.",
      result: "₹18,000 + interest saved in 1 year! Laptop goal met. 💻",
      inflow: 8000,
      outflow: 6500,
      saved: 1500,
      emoji: "🚀"
    },
    {
      id: 4,
      name: "5. Vikram (No Tracking)",
      income: "₹10,000/month",
      details: "Does not track cash leakages. Pays little expenses.",
      actions: "Loses about ₹500/month on miscellaneous leaks.",
      result: "₹6,000/year gone to 'kahan gaya pata nahi'. 💸",
      inflow: 10000,
      outflow: 10000,
      saved: 0,
      emoji: "🔍"
    }
  ];

  const current = scenarios[activeId];

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("h4", {
        className: "text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-400 text-center",
        children: "Scenario Analysis"
      }),
      _jsx("div", {
        className: "flex space-x-1.5 overflow-x-auto py-1 scrollbar-none",
        children: scenarios.map((s) => _jsx("button", {
          onClick: () => setActiveId(s.id),
          className: `px-2.5 py-1.5 rounded-lg text-[9px] sm:text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${activeId === s.id ? 'bg-amber-400 text-black font-extrabold shadow-md' : 'bg-white/5 border border-white/10 text-zinc-400'}`,
          children: s.name.split(' ')[1]
        }, s.id))
      }),
      _jsxs("div", {
        className: "p-4 rounded-xl bg-black/25 border border-white/[0.04] space-y-3",
        children: [
          _jsxs("div", {
            className: "flex justify-between items-center border-b border-white/[0.06] pb-2",
            children: [
              _jsxs("div", {
                className: "flex items-center space-x-2",
                children: [
                  _jsx("span", { className: "text-2xl", children: current.emoji }),
                  _jsx("h5", { className: "text-xs sm:text-sm font-bold text-amber-400", children: current.name })
                ]
              }),
              _jsxs("span", { className: "text-[10px] sm:text-xs text-zinc-400", children: ["Income: ", current.income] })
            ]
          }),
          _jsxs("p", { className: "text-xs sm:text-sm text-zinc-300 leading-relaxed", children: [_jsx("strong", { children: "Situation: " }), current.details] }),
          _jsxs("p", { className: "text-xs sm:text-sm text-zinc-300 leading-relaxed", children: [_jsx("strong", { children: "Behavior: " }), current.actions] }),
          _jsxs("div", {
            className: `p-2.5 rounded-lg text-xs sm:text-sm font-bold flex justify-between items-center ${current.saved > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : current.saved < 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`,
            children: [
              _jsxs("span", { children: ["Month End: ", current.result] }),
              _jsxs("span", { children: [current.saved >= 0 ? "+" : "", "₹", current.saved.toLocaleString()] })
            ]
          })
        ]
      })
    ]
  });
}

function InteractiveRuleVisual({ color }) {
  const [income, setIncome] = useState(15000);
  const needs = Math.round(income * 0.5);
  const wants = Math.round(income * 0.3);
  const savings = Math.round(income * 0.2);

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("h4", {
        className: "text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-400 text-center",
        children: "50/30/20 Rule Calculator"
      }),
      _jsxs("div", {
        className: "space-y-2",
        children: [
          _jsxs("div", {
            className: "flex justify-between text-xs sm:text-sm text-zinc-300",
            children: [
              _jsx("span", { children: "Income to Split:" }),
              _jsxs("span", { className: "text-amber-400 font-bold text-sm sm:text-base", children: ["₹", income.toLocaleString()] })
            ]
          }),
          _jsx("input", {
            type: "range",
            min: "5000",
            max: "50000",
            step: "1000",
            value: income,
            onChange: (e) => setIncome(parseInt(e.target.value)),
            className: "w-full accent-amber-400"
          })
        ]
      }),
      _jsxs("div", {
        className: "space-y-3",
        children: [
          _jsxs("div", {
            className: "flex items-center justify-between p-2.5 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20",
            children: [
              _jsxs("div", {
                children: [
                  _jsx("span", { className: "text-xs sm:text-sm font-black text-blue-400 block", children: "Needs (50%)" }),
                  _jsx("span", { className: "text-[9px] sm:text-xs text-zinc-400", children: "Rent, Food, Bills, Metro" })
                ]
              }),
              _jsxs("span", { className: "text-xs sm:text-sm font-black text-white", children: ["₹", needs.toLocaleString()] })
            ]
          }),
          _jsxs("div", {
            className: "flex items-center justify-between p-2.5 rounded-xl bg-[#EC4899]/10 border border-[#EC4899]/20",
            children: [
              _jsxs("div", {
                children: [
                  _jsx("span", { className: "text-xs sm:text-sm font-black text-pink-400 block", children: "Wants (30%)" }),
                  _jsx("span", { className: "text-[9px] sm:text-xs text-zinc-400", children: "Movies, Swiggy, Chai Outings" })
                ]
              }),
              _jsxs("span", { className: "text-xs sm:text-sm font-black text-white", children: ["₹", wants.toLocaleString()] })
            ]
          }),
          _jsxs("div", {
            className: "flex items-center justify-between p-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20",
            children: [
              _jsxs("div", {
                children: [
                  _jsx("span", { className: "text-xs sm:text-sm font-black text-emerald-400 block", children: "Savings (20%)" }),
                  _jsx("span", { className: "text-[9px] sm:text-xs text-zinc-400", children: "Emergency Fund, SIP, Stocks" })
                ]
              }),
              _jsxs("span", { className: "text-xs sm:text-sm font-black text-white", children: ["₹", savings.toLocaleString()] })
            ]
          })
        ]
      })
    ]
  });
}

function InteractiveBudgetingStrategies({ color }) {
  const [tab, setTab] = useState('pay_first');
  const [autoDebit, setAutoDebit] = useState(false);

  const totalInflow = 15000;
  const [allocations, setAllocations] = useState({
    savings: 3000,
    rent: 4000,
    food: 2500,
    transport: 1500,
    education: 1000,
    entertainment: 1500,
    wifi: 1200,
    others: 300
  });

  const handleZbbChange = (category, value) => {
    setAllocations(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const allocatedSum = Object.values(allocations).reduce((a, b) => a + b, 0);
  const remainingZbb = totalInflow - allocatedSum;

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsxs("div", {
        className: "flex gap-2 border-b border-white/[0.06] pb-2",
        children: [
          _jsx("button", {
            onClick: () => setTab('pay_first'),
            className: `flex-1 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${tab === 'pay_first' ? 'bg-amber-400 text-black font-extrabold shadow-md' : 'bg-white/5 border border-white/10 text-zinc-400'}`,
            children: "Pay Yourself First"
          }),
          _jsx("button", {
            onClick: () => setTab('zbb'),
            className: `flex-1 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${tab === 'zbb' ? 'bg-amber-400 text-black font-extrabold shadow-md' : 'bg-white/5 border border-white/10 text-zinc-400'}`,
            children: "Zero-Based Budget"
          })
        ]
      }),
      tab === 'pay_first' ? _jsxs("div", {
        className: "space-y-4",
        children: [
          _jsxs("div", {
            className: "flex items-center justify-between bg-black/25 border border-white/[0.04] p-3 rounded-xl",
            children: [
              _jsxs("div", {
                children: [
                  _jsx("span", { className: "text-xs sm:text-sm font-bold text-white block", children: "Automated Auto-Debit" }),
                  _jsx("span", { className: "text-[9px] sm:text-xs text-zinc-400", children: "Transfer ₹1,000 to Savings first" })
                ]
              }),
              _jsx("button", {
                onClick: () => setAutoDebit(!autoDebit),
                className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${autoDebit ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white hover:bg-white/15'}`,
                children: autoDebit ? "ACTIVE ✓" : "ACTIVATE"
              })
            ]
          }),
          _jsxs("div", {
            className: "relative w-full h-32 bg-black/35 rounded-xl border border-white/[0.04] flex items-center justify-around overflow-hidden px-4",
            children: [
              _jsxs("div", {
                className: "text-center",
                children: [
                  _jsx("div", { className: "text-2xl", children: "💵" }),
                  _jsx("span", { className: "text-[10px] text-zinc-400 block font-bold", children: "Income Inflow" })
                ]
              }),
              _jsxs("div", {
                className: "flex flex-col items-center space-y-1",
                children: autoDebit ? [
                  _jsx(motion.div, {
                    initial: { x: -40, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                    className: "text-xs text-emerald-400 font-extrabold",
                    children: "➔ Auto-Transfer (₹1,000) ➔"
                  }),
                  _jsx("div", { className: "text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded", children: "Savings protected!" })
                ] : [
                  _jsx("span", { className: "text-[10px] text-zinc-500 italic", children: "Waiting for auto-debit instruction..." })
                ]
              }),
              _jsxs("div", {
                className: "text-center",
                children: [
                  _jsx("div", { className: "text-2xl", children: "🏦" }),
                  _jsx("span", { className: "text-[10px] text-zinc-400 block font-bold", children: "Savings Account" })
                ]
              })
            ]
          })
        ]
      }) : _jsxs("div", {
        className: "space-y-3",
        children: [
          _jsxs("div", {
            className: "flex justify-between items-center border-b border-white/[0.06] pb-2",
            children: [
              _jsxs("span", { className: "text-xs text-zinc-400", children: ["Income: ", _jsx("strong", { className: "text-white", children: "₹15,000" })] }),
              _jsxs("span", {
                className: `text-xs font-black ${remainingZbb === 0 ? 'text-emerald-400' : 'text-amber-400'}`,
                children: [remainingZbb === 0 ? "Perfect Zero!" : `Unassigned: ₹${remainingZbb}`]
              })
            ]
          }),
          _jsx("div", {
            className: "grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-none",
            children: Object.entries(allocations).map(([cat, val]) => _jsxs("div", {
              className: "bg-black/25 border border-white/[0.04] p-2 rounded-xl text-xs flex flex-col space-y-1",
              children: [
                _jsxs("span", { className: "capitalize text-zinc-300 font-bold flex justify-between", children: [_jsx("span", { children: cat }), _jsxs("span", { className: "text-amber-400", children: ["₹", val] })] }),
                _jsx("input", {
                  type: "range",
                  min: "0",
                  max: cat === 'rent' ? "8000" : cat === 'wifi' ? "2000" : "5000",
                  step: "100",
                  value: val,
                  onChange: (e) => handleZbbChange(cat, parseInt(e.target.value)),
                  className: "w-full accent-amber-400"
                })
              ]
            }, cat))
          }),
          remainingZbb === 0 ? _jsx("div", {
            className: "p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold text-xs rounded-xl",
            children: "Every rupee is assigned a job! Zero-based budget ready."
          }) : _jsx("div", {
            className: "p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-center font-bold text-xs rounded-xl",
            children: "Adjust sliders so unassigned balance equals exactly zero!"
          })
        ]
      })
    ]
  });
}

function InteractiveLiteracyGap({ color }) {
  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("h4", {
        className: "text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-400 text-center",
        children: "India vs World Financial Literacy Gap"
      }),
      _jsxs("div", {
        className: "p-4 rounded-xl bg-black/25 border border-white/[0.04] space-y-4",
        children: [
          _jsxs("div", {
            className: "space-y-1.5",
            children: [
              _jsxs("div", {
                className: "flex justify-between text-xs sm:text-sm text-zinc-300 font-bold",
                children: [
                  _jsx("span", { children: "India Financial Literacy rate" }),
                  _jsx("span", { className: "text-red-400", children: "27%" })
                ]
              }),
              _jsx("div", {
                className: "w-full h-3 bg-zinc-800 rounded-full overflow-hidden",
                children: _jsx(motion.div, {
                  initial: { width: 0 },
                  animate: { width: "27%" },
                  transition: { duration: 1.5, ease: "easeOut" },
                  className: "h-full bg-red-500 rounded-full"
                })
              })
            ]
          }),
          _jsxs("div", {
            className: "space-y-1.5",
            children: [
              _jsxs("div", {
                className: "flex justify-between text-xs sm:text-sm text-zinc-300 font-bold",
                children: [
                  _jsx("span", { children: "Global Average" }),
                  _jsx("span", { className: "text-emerald-400", children: "52%" })
                ]
              }),
              _jsx("div", {
                className: "w-full h-3 bg-zinc-800 rounded-full overflow-hidden",
                children: _jsx(motion.div, {
                  initial: { width: 0 },
                  animate: { width: "52%" },
                  transition: { duration: 1.5, ease: "easeOut" },
                  className: "h-full bg-emerald-500 rounded-full"
                })
              })
            ]
          })
        ]
      }),
      _jsx("div", {
        className: "p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm rounded-xl leading-relaxed text-center",
        children: "Shocking Fact: 76% of Indian adults do not understand basic financial concepts (S&P Global Survey)."
      })
    ]
  });
}

function InteractiveSchoolGapTaboo({ color }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [roleplayStep, setRoleplayStep] = useState(0);

  const nodes = [
    { id: 'curriculum', title: 'Curriculum Gap', desc: 'Math focuses on trigonometry/calculus instead of real life budgeting, savings, and filing income tax returns.' },
    { id: 'training', title: 'Teacher Training', desc: 'Most teachers are themselves not trained in professional personal finance or investment mechanics.' },
    { id: 'exam', title: 'Exam Focus', desc: 'Rote-memorization of formulas to clear boards gets prioritized over practical money habit application.' },
    { id: 'taboo', title: 'Cultural Taboo', desc: 'Discussing cash, wealth accumulation, or household expenses is socially considered inappropriate in classrooms.' }
  ];

  const dialogue = [
    { speaker: "You", text: "Papa/Mummy, humara monthly budgeting system kaise kaam karta hai? Mujhe bhi seekhna hai." },
    { speaker: "Parents", text: "Beta, tum abhi padhai pe dhyan do, paisa hum manage kar lenge." },
    { speaker: "You", text: "Haan Papa, par abhi se basic concepts seekhunga toh job milte hi problem nahi hogi." },
    { speaker: "Parents", text: "Theek hai, aao samjhate hain ki hum FD, expenses aur monthly home rent kaise distribute karte hain." }
  ];

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("h4", {
        className: "text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-400 text-center",
        children: "Arrow Diagram: The Educational Gap"
      }),
      _jsx("div", {
        className: "grid grid-cols-2 gap-2",
        children: nodes.map((node) => _jsx("button", {
          onClick: () => setSelectedNode(selectedNode === node.id ? null : node.id),
          className: `p-2.5 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${selectedNode === node.id ? 'bg-amber-400/10 border-amber-400 text-amber-400' : 'bg-white/5 border-white/10 text-zinc-300'}`,
          children: node.title
        }, node.id))
      }),
      selectedNode && _jsx(motion.div, {
        initial: { opacity: 0, y: 5 },
        animate: { opacity: 1, y: 0 },
        className: "p-3 rounded-xl bg-black/20 border border-white/[0.05] text-xs sm:text-sm text-zinc-400 leading-relaxed",
        children: nodes.find(n => n.id === selectedNode).desc
      }),
      _jsx("div", { className: "border-t border-white/[0.06] pt-3" }),
      _jsx("h5", { className: "text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider text-center", children: "Roleplay: Talk with Parents" }),
      _jsxs("div", {
        className: "p-3 bg-black/25 border border-white/[0.04] rounded-xl space-y-2 text-xs sm:text-sm",
        children: [
          _jsxs("div", {
            className: "flex justify-between items-center text-[10px] text-zinc-500",
            children: [
              _jsxs("span", { children: ["Dialogue Step: ", roleplayStep + 1, " / ", dialogue.length] }),
              roleplayStep < dialogue.length - 1 ? _jsx("button", {
                onClick: () => setRoleplayStep(s => s + 1),
                className: "bg-amber-400 text-black px-2 py-0.5 rounded font-black cursor-pointer",
                children: "Next Dialogue ➔"
              }) : _jsx("button", {
                onClick: () => setRoleplayStep(0),
                className: "bg-white/10 text-white px-2 py-0.5 rounded cursor-pointer",
                children: "Restart dialogue"
              })
            ]
          }),
          _jsxs("div", {
            className: "p-2 rounded bg-white/[0.02] border border-white/[0.02]",
            children: [
              _jsxs("span", {
                className: `font-black uppercase text-[10px] block ${dialogue[roleplayStep].speaker === 'You' ? 'text-cyan-400' : 'text-amber-400'}`,
                children: [dialogue[roleplayStep].speaker, ":"]
              }),
              _jsx("p", { className: "text-zinc-300 mt-1 leading-normal", children: dialogue[roleplayStep].text })
            ]
          })
        ]
      })
    ]
  });
}

function InteractiveMindsetMyths({ color }) {
  const [activeMyth, setActiveMyth] = useState(null);

  const myths = [
    { id: 1, myth: '"Job safe hai, business risky"', reality: 'Fact: Job is also risky. Layoffs happen. Over 50,000+ tech workers lost jobs in 2023-24. Single salary is a single point of failure.', icon: '💼' },
    { id: 2, myth: '"Investing is gambling"', reality: 'Fact: Informed investing based on Nifty 50 Index funds or SIP mutual funds is research-based wealth building, not lottery.', icon: '📉' },
    { id: 3, myth: '"Paisa sirf mehnat se aata hai"', reality: 'Fact: Money can work for you. Warren Buffetts 90% wealth came after age 65 due to the compounding effect.', icon: '⏳' },
    { id: 4, myth: '"Loan lena paap hai"', reality: 'Fact: Good debt (education/home loan) builds long term assets. Bad debt (credit card shopping) is what destroys cash flow.', icon: '💳' },
    { id: 5, myth: '"Tax sirf ameer log dete hain"', reality: 'Fact: TDS is cut from salaries above a threshold, and indirect tax is paid by everyone who buys items. ITR filing is necessary.', icon: '📝' }
  ];

  return _jsxs("div", {
    className: "mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 font-mono select-none",
    children: [
      _jsx("h4", {
        className: "text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-400 text-center",
        children: "Flip to Bust Mindset Myths"
      }),
      _jsx("div", {
        className: "space-y-2",
        children: myths.map((m) => _jsxs("div", {
          onClick: () => setActiveMyth(activeMyth === m.id ? null : m.id),
          className: `p-3 rounded-xl border transition-all cursor-pointer ${activeMyth === m.id ? 'bg-amber-400/10 border-amber-400/40 shadow-md' : 'bg-white/5 border-white/[0.04] hover:bg-white/10'}`,
          children: [
            _jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                _jsxs("div", {
                  className: "flex items-center space-x-2 text-xs sm:text-sm",
                  children: [
                    _jsx("span", { className: "text-lg", children: m.icon }),
                    _jsx("span", { className: "font-black text-zinc-300", children: m.myth })
                  ]
                }),
                _jsx("span", { className: "text-zinc-500", children: activeMyth === m.id ? "▲" : "▼" })
              ]
            }),
            activeMyth === m.id && _jsx(motion.div, {
              initial: { height: 0, opacity: 0 },
              animate: { height: 'auto', opacity: 1 },
              className: "mt-2 pt-2 border-t border-white/[0.05] text-xs sm:text-sm text-amber-400 font-medium leading-relaxed",
              children: m.reality
            })
          ]
        }, m.id))
      })
    ]
  });
}

function InteractiveModuleCompletion({ color, onComplete }) {
  const [claimed, setClaimed] = useState(false);

  return _jsxs("div", {
    className: "mt-6 p-6 rounded-2xl bg-gradient-to-tr from-yellow-500/10 to-amber-500/5 border border-amber-500/20 text-center space-y-6 select-none font-mono relative overflow-hidden",
    children: [
      _jsxs(motion.div, {
        animate: { rotate: 360 },
        transition: { repeat: Infinity, duration: 12, ease: "linear" },
        className: "relative w-28 h-28 mx-auto flex items-center justify-center bg-gradient-to-tr from-amber-600 to-yellow-400 rounded-full border-4 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.35)]",
        children: [
          _jsx("span", { className: "text-5xl", children: "🏆" }),
          Array.from({ length: 12 }).map((_, idx) => _jsx("div", {
            className: "absolute inset-0 rounded-full border border-dashed border-amber-200/40",
            style: { transform: `rotate(${idx * 30}deg)` }
          }, idx))
        ]
      }),
      _jsxs("div", {
        className: "space-y-1.5",
        children: [
          _jsx("h3", { className: "text-lg sm:text-xl font-black text-amber-400 uppercase tracking-widest", children: "Foundation Badge Earned!" }),
          _jsx("p", { className: "text-xs sm:text-sm text-zinc-300 leading-relaxed", children: "You have completed your first module. You are now equipped with the essential tools of money management!" })
        ]
      }),
      _jsx("div", {
        className: "p-3 bg-white/5 border border-white/10 rounded-xl max-w-xs mx-auto text-xs sm:text-sm text-zinc-300 flex justify-center items-center gap-2",
        children: claimed ? _jsxs("div", {
          className: "flex items-center gap-1.5",
          children: [
            _jsx("span", { className: "text-emerald-400 font-extrabold", children: "✓ 100 Coins Credited" }),
            _jsx("span", { className: "text-xs", children: "🪙" })
          ]
        }) : _jsxs("button", {
          onClick: () => setClaimed(true),
          className: "bg-amber-400 hover:bg-amber-500 text-black px-4 py-1.5 rounded-lg font-black transition-all active:scale-95 cursor-pointer animate-pulse",
          children: ["Claim 100 Coins", _jsx("span", { className: "ml-1.5", children: "🪙" })]
        })
      }),
      _jsx("button", {
        onClick: onComplete,
        className: "w-full bg-emerald-500 hover:bg-emerald-600 text-black py-3 rounded-xl text-sm sm:text-base font-black transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/20",
        children: "Swipe or Click for Next Module"
      })
    ]
  });
}