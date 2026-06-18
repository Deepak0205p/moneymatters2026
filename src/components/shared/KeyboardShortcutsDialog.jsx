'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { shortcutsList } from '@/lib/hooks/useKeyboardShortcuts';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const categoryOrder = ['Navigation', 'Tools', 'General'];
const categoryLabels = {
  Navigation: '🧭 Navigation — Strategy Switch',
  Tools: '🛠️ Tools — Quick Access',
  General: '⌨️ General — App Control'
};
const categoryDescriptions = {
  Navigation: 'Alt + key se turant strategy switch karo',
  Tools: 'Important tools ek shortcut mein kholo',
  General: 'App control ke shortcuts'
};
function KeyBadge({
  children
}) {
  return /*#__PURE__*/_jsx("span", {
    className: "inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-[#0a0a0f] border border-amber-500/30 text-amber-400 text-xs font-mono font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]",
    children: children
  });
}
function ShortcutRow({
  keys,
  description
}) {
  return /*#__PURE__*/_jsxs(motion.div, {
    className: "flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors",
    initial: {
      opacity: 0,
      x: -10
    },
    animate: {
      opacity: 1,
      x: 0
    },
    whileHover: {
      x: 2
    },
    children: [/*#__PURE__*/_jsx("span", {
      className: "text-sm text-[#a0a0b8] font-medium truncate",
      children: description
    }), /*#__PURE__*/_jsx("div", {
      className: "flex items-center gap-1 shrink-0",
      children: keys.map((key, i) => /*#__PURE__*/_jsxs("span", {
        className: "flex items-center gap-1",
        children: [/*#__PURE__*/_jsx(KeyBadge, {
          children: key
        }), i < keys.length - 1 && /*#__PURE__*/_jsx("span", {
          className: "text-[#5555a0] text-xs font-bold mx-0.5",
          children: "+"
        })]
      }, i))
    })]
  });
}
export default function KeyboardShortcutsDialog({
  open,
  onClose
}) {
  // Close on Escape (handled by parent via useKeyboardShortcuts)
  // Prevent body scroll when dialog open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Group shortcuts by category
  const grouped = categoryOrder.map(cat => ({
    category: cat,
    shortcuts: shortcutsList.filter(s => s.category === cat)
  }));
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: open && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(motion.div, {
        className: "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm",
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        exit: {
          opacity: 0
        },
        transition: {
          duration: 0.2
        },
        onClick: onClose,
        "aria-hidden": "true"
      }), /*#__PURE__*/_jsx(motion.div, {
        className: "fixed inset-0 z-[61] flex items-center justify-center p-4",
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        exit: {
          opacity: 0
        },
        children: /*#__PURE__*/_jsxs(motion.div, {
          className: "relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl bg-[#0f0f18] border border-white/[0.08] shadow-2xl",
          initial: {
            scale: 0.9,
            y: 20
          },
          animate: {
            scale: 1,
            y: 0
          },
          exit: {
            scale: 0.9,
            y: 20
          },
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30
          },
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Keyboard shortcuts help",
          children: [/*#__PURE__*/_jsx("div", {
            className: "relative px-6 pt-6 pb-4 border-b border-white/[0.06]",
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-3",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center",
                  children: /*#__PURE__*/_jsx(Keyboard, {
                    className: "w-5 h-5 text-amber-400"
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("h2", {
                    className: "text-lg font-bold text-gradient-gold",
                    children: "Keyboard Shortcuts"
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-xs text-[#8888a0]",
                    children: "App ko keyboard se control karo"
                  })]
                })]
              }), /*#__PURE__*/_jsx("button", {
                onClick: onClose,
                className: "w-8 h-8 rounded-lg flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors",
                "aria-label": "Close shortcuts dialog",
                children: /*#__PURE__*/_jsx(X, {
                  className: "w-4 h-4"
                })
              })]
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "overflow-y-auto max-h-[calc(85vh-140px)] custom-scroll px-6 py-4",
            children: /*#__PURE__*/_jsx("div", {
              className: "space-y-6",
              children: grouped.map(group => /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "mb-3",
                  children: [/*#__PURE__*/_jsx("h3", {
                    className: "text-sm font-bold text-[#e8e8ed]",
                    children: categoryLabels[group.category]
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-[10px] text-[#5555a0] mt-0.5",
                    children: categoryDescriptions[group.category]
                  })]
                }), /*#__PURE__*/_jsx("div", {
                  className: "space-y-0.5",
                  children: group.shortcuts.map((shortcut, index) => /*#__PURE__*/_jsx(ShortcutRow, {
                    keys: shortcut.keys,
                    description: shortcut.description
                  }, `${group.category}-${index}`))
                })]
              }, group.category))
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "px-6 py-4 border-t border-white/[0.06] bg-gradient-to-r from-amber-500/[0.04] via-amber-400/[0.02] to-amber-500/[0.04]",
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex items-start gap-2.5",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-amber-400 text-base mt-0.5",
                children: "\uD83D\uDCA1"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-xs font-semibold text-amber-400 mb-0.5",
                  children: "Pro Tip"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[11px] text-[#a0a0b8] leading-relaxed",
                  children: "Keyboard shortcuts tabhi kaam karte hain jab tum koi input field type nahi kar rahe ho! Alt+1 se Alt+= tak strategies ke beech instant jump karo \u2014 mouse ki zaroorat nahi! \uD83D\uDE80"
                })]
              })]
            })
          })]
        })
      })]
    })
  });
}