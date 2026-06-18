'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function QuizCard({
  question,
  onAnswer,
  showResult = true
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const isCorrect = selectedIndex === question.correctIndex;

  // Use the question id as a key to force re-mount when question changes
  // This avoids the need for setState in useEffect

  const handleOptionClick = useCallback(index => {
    if (hasAnswered) return;
    setSelectedIndex(index);
    setHasAnswered(true);

    // Show explanation after a short delay
    setTimeout(() => setShowExplanation(true), 400);

    // Auto-advance after 2.5 seconds
    setTimeout(() => onAnswer(index), 2500);
  }, [hasAnswered, onAnswer]);
  const getOptionStyle = index => {
    if (!hasAnswered) {
      return 'border-[rgba(255,255,255,0.08)] bg-[#1a1a2e] hover:bg-[#22223a] hover:border-[#f59e0b]/30 text-[#e8e8ed]';
    }
    if (index === question.correctIndex) {
      return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
    }
    if (index === selectedIndex && !isCorrect) {
      return 'border-red-500/50 bg-red-500/10 text-red-300';
    }
    return 'border-[rgba(255,255,255,0.04)] bg-[#12121a] text-[#8888a0] opacity-50';
  };
  return /*#__PURE__*/_jsxs(Card, {
    className: "border-0 bg-[#12121a] overflow-hidden",
    style: {
      border: '1px solid rgba(255,255,255,0.06)'
    },
    children: [/*#__PURE__*/_jsxs(CardHeader, {
      className: "pb-2",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 mb-2",
        children: [/*#__PURE__*/_jsx(Badge, {
          variant: "outline",
          className: cn('text-[10px] border-[rgba(255,255,255,0.1)]', question.difficulty === 'easy' && 'text-emerald-400 bg-emerald-500/10', question.difficulty === 'medium' && 'text-[#f59e0b] bg-[#f59e0b]/10', question.difficulty === 'hard' && 'text-red-400 bg-red-500/10'),
          children: question.difficulty.toUpperCase()
        }), /*#__PURE__*/_jsxs(Badge, {
          variant: "outline",
          className: "text-[10px] border-[rgba(255,255,255,0.1)] text-[#8888a0]",
          children: ["Module ", question.moduleId]
        })]
      }), /*#__PURE__*/_jsx(CardTitle, {
        className: "text-base text-[#e8e8ed] leading-relaxed",
        children: question.question
      })]
    }), /*#__PURE__*/_jsxs(CardContent, {
      className: "space-y-2",
      children: [/*#__PURE__*/_jsx("div", {
        className: "grid gap-2",
        children: question.options.map((option, index) => /*#__PURE__*/_jsxs(motion.button, {
          whileHover: !hasAnswered ? {
            scale: 1.01
          } : {},
          whileTap: !hasAnswered ? {
            scale: 0.98
          } : {},
          onClick: () => handleOptionClick(index),
          disabled: hasAnswered,
          className: cn('w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200', 'flex items-center gap-3', getOptionStyle(index)),
          children: [/*#__PURE__*/_jsx("span", {
            className: "flex size-6 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-xs font-medium text-[#8888a0]",
            children: String.fromCharCode(65 + index)
          }), /*#__PURE__*/_jsx("span", {
            className: "flex-1",
            children: option
          }), hasAnswered && index === question.correctIndex && /*#__PURE__*/_jsx(motion.div, {
            initial: {
              scale: 0
            },
            animate: {
              scale: 1
            },
            transition: {
              type: 'spring',
              stiffness: 500
            },
            children: /*#__PURE__*/_jsx(CheckCircle2, {
              size: 18,
              className: "text-emerald-400 shrink-0"
            })
          }), hasAnswered && index === selectedIndex && !isCorrect && index !== question.correctIndex && /*#__PURE__*/_jsx(motion.div, {
            initial: {
              scale: 0
            },
            animate: {
              scale: 1
            },
            transition: {
              type: 'spring',
              stiffness: 500
            },
            children: /*#__PURE__*/_jsx(XCircle, {
              size: 18,
              className: "text-red-400 shrink-0"
            })
          })]
        }, index))
      }), /*#__PURE__*/_jsx(AnimatePresence, {
        children: showExplanation && hasAnswered && /*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0,
            height: 0
          },
          animate: {
            opacity: 1,
            height: 'auto'
          },
          exit: {
            opacity: 0,
            height: 0
          },
          transition: {
            duration: 0.3
          },
          className: cn('rounded-lg p-3 mt-2', isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'),
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-start gap-2",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              size: 14,
              className: isCorrect ? 'text-emerald-400 mt-0.5 shrink-0' : 'text-red-400 mt-0.5 shrink-0'
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-xs font-medium text-[#e8e8ed] mb-1",
                children: isCorrect ? 'Sahi jawab! 🎉' : 'Galat jawab!'
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-[#8888a0] leading-relaxed",
                children: question.explanation
              })]
            })]
          })
        })
      })]
    })]
  });
}