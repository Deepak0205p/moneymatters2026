'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MILESTONES } from '@/lib/constants';
import { useProgress } from '@/lib/hooks/useProgress';
import { useAppStore } from '@/lib/store/useAppStore';
import { getFinancialHealthScore } from '@/lib/utils';
import ProgressRing from '@/components/shared/ProgressRing';
import StatCard from '@/components/shared/StatCard';
import { MapPin, Car, Navigation, Trophy, AlertTriangle, Flag, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ─── Road SVG Dimensions ────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ROAD_WIDTH = 900;
const ROAD_HEIGHT = 160;
const ROAD_Y = 60;
const CAR_Y_OFFSET = -18;

// ─── Milestone tooltip ──────────────────────────────────

function MilestoneTooltip({
  milestone,
  x,
  visible
}) {
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: visible && /*#__PURE__*/_jsxs(motion.div, {
      className: "absolute z-20 pointer-events-none",
      style: {
        left: x,
        top: -70
      },
      initial: {
        opacity: 0,
        y: 10,
        scale: 0.8
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1
      },
      exit: {
        opacity: 0,
        y: 10,
        scale: 0.8
      },
      transition: {
        duration: 0.25,
        ease: 'easeOut'
      },
      children: [/*#__PURE__*/_jsxs("div", {
        className: "bg-[#1a1a2e] border border-[rgba(255,255,255,0.12)] rounded-xl px-4 py-3 shadow-xl min-w-[200px] max-w-[260px]",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-sm font-semibold text-[#f59e0b] mb-1",
          children: milestone.label
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-[#a0a0b8] leading-relaxed font-medium",
          children: milestone.description
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-1.5 flex items-center gap-1",
          children: [/*#__PURE__*/_jsx("div", {
            className: "h-1 flex-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden",
            children: /*#__PURE__*/_jsx(motion.div, {
              className: "h-full rounded-full bg-[#f59e0b]",
              initial: {
                width: 0
              },
              animate: {
                width: `${milestone.percentage}%`
              },
              transition: {
                duration: 0.8,
                ease: 'easeOut'
              }
            })
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-[10px] text-[#a0a0b8] font-medium",
            children: [milestone.percentage, "%"]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "flex justify-center -mt-px",
        children: /*#__PURE__*/_jsx("div", {
          className: "w-3 h-3 rotate-45 bg-[#1a1a2e] border-b border-r border-[rgba(255,255,255,0.12)]"
        })
      })]
    })
  });
}

// ─── Direction Label ────────────────────────────────────
function getDirection(percentage) {
  if (percentage === 0) return {
    label: 'Abhi shuru nahi kiya!',
    emoji: '🧭',
    color: '#ef4444'
  };
  if (percentage < 25) return {
    label: 'Debt Trap se niklo!',
    emoji: '⚠️',
    color: '#ef4444'
  };
  if (percentage < 50) return {
    label: 'Sahi raste pe ho!',
    emoji: '🚶',
    color: '#f59e0b'
  };
  if (percentage < 75) return {
    label: 'Accha progress ho raha!',
    emoji: '🏃',
    color: '#f59e0b'
  };
  if (percentage < 100) return {
    label: 'Freedom qareeb hai!',
    emoji: '🚀',
    color: '#22c55e'
  };
  return {
    label: 'Financial Freedom mila! 🎉',
    emoji: '🏆',
    color: '#22c55e'
  };
}

// ─── Main Component ─────────────────────────────────────
export default function FinancialGPS() {
  const {
    completionPercentage,
    modulesCompleted,
    getQuizAverage
  } = useProgress();
  const {
    completedModules,
    quizScores
  } = useAppStore();
  const [activeMilestone, setActiveMilestone] = useState(null);
  const healthScore = useMemo(() => getFinancialHealthScore(completedModules, quizScores), [completedModules, quizScores]);
  const direction = getDirection(completionPercentage);

  // Car position on the road
  const carX = useMemo(() => {
    const padding = 40;
    const travelWidth = ROAD_WIDTH - padding * 2;
    return padding + completionPercentage / 100 * travelWidth;
  }, [completionPercentage]);

  // Milestone positions
  const milestonePositions = useMemo(() => {
    const padding = 40;
    const travelWidth = ROAD_WIDTH - padding * 2;
    return MILESTONES.map(m => ({
      ...m,
      x: padding + m.percentage / 100 * travelWidth
    }));
  }, []);
  const handleMilestoneClick = id => {
    setActiveMilestone(prev => prev === id ? null : id);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "w-full space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center space-y-2",
      children: [/*#__PURE__*/_jsxs(motion.div, {
        className: "flex items-center justify-center gap-2",
        initial: {
          opacity: 0,
          y: -20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        transition: {
          duration: 0.5
        },
        children: [/*#__PURE__*/_jsx(Navigation, {
          className: "text-[#f59e0b]",
          size: 28
        }), /*#__PURE__*/_jsx("h2", {
          className: "text-2xl md:text-3xl font-bold text-gradient-gold",
          children: "Paise Ka GPS"
        })]
      }), /*#__PURE__*/_jsx(motion.p, {
        className: "text-sm text-[#a0a0b8] font-medium",
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        transition: {
          delay: 0.3
        },
        children: "Tumhara financial health kahan hai? Road map dekho aur samjho!"
      })]
    }), /*#__PURE__*/_jsx(motion.div, {
      className: "w-full overflow-x-auto",
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        duration: 0.6,
        delay: 0.2
      },
      children: /*#__PURE__*/_jsxs("div", {
        className: "min-w-0 sm:min-w-[700px] relative",
        style: {
          maxWidth: ROAD_WIDTH,
          margin: '0 auto'
        },
        children: [/*#__PURE__*/_jsxs("svg", {
          viewBox: `0 0 ${ROAD_WIDTH} ${ROAD_HEIGHT + 40}`,
          className: "w-full h-auto max-w-full",
          style: {
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))'
          },
          children: [/*#__PURE__*/_jsx("rect", {
            x: "0",
            y: "0",
            width: ROAD_WIDTH * 0.3,
            height: ROAD_HEIGHT + 40,
            fill: "url(#redZone)",
            opacity: "0.15",
            rx: "8"
          }), /*#__PURE__*/_jsx("rect", {
            x: ROAD_WIDTH * 0.7,
            y: "0",
            width: ROAD_WIDTH * 0.3,
            height: ROAD_HEIGHT + 40,
            fill: "url(#greenZone)",
            opacity: "0.15",
            rx: "8"
          }), /*#__PURE__*/_jsx("rect", {
            x: "20",
            y: ROAD_Y,
            width: ROAD_WIDTH - 40,
            height: 50,
            rx: "25",
            fill: "url(#roadGradient)",
            stroke: "rgba(255,255,255,0.08)",
            strokeWidth: "1"
          }), Array.from({
            length: 22
          }).map((_, i) => /*#__PURE__*/_jsx("rect", {
            x: 50 + i * 38,
            y: ROAD_Y + 23,
            width: 20,
            height: 4,
            rx: "2",
            fill: "rgba(255,255,255,0.3)"
          }, `dash-${i}`)), /*#__PURE__*/_jsx("g", {
            transform: `translate(70, ${ROAD_Y + 25})`,
            children: /*#__PURE__*/_jsx(AlertTriangle, {
              size: 14,
              fill: "#ef4444",
              color: "#ef4444"
            })
          }), /*#__PURE__*/_jsx("text", {
            x: "95",
            y: ROAD_Y + 30,
            className: "text-[11px] font-bold",
            fill: "#ef4444",
            style: {
              fontFamily: 'system-ui'
            },
            children: "DEBT TRAP"
          }), /*#__PURE__*/_jsx("g", {
            transform: `translate(${ROAD_WIDTH - 170}, ${ROAD_Y + 25})`,
            children: /*#__PURE__*/_jsx(Flag, {
              size: 14,
              fill: "#22c55e",
              color: "#22c55e"
            })
          }), /*#__PURE__*/_jsx("text", {
            x: ROAD_WIDTH - 150,
            y: ROAD_Y + 30,
            className: "text-[11px] font-bold",
            fill: "#22c55e",
            style: {
              fontFamily: 'system-ui'
            },
            children: "FINANCIAL FREEDOM"
          }), milestonePositions.map(m => {
            const isReached = completionPercentage >= m.percentage;
            return /*#__PURE__*/_jsxs("g", {
              className: "cursor-pointer",
              onClick: () => handleMilestoneClick(m.id),
              children: [/*#__PURE__*/_jsx("circle", {
                cx: m.x,
                cy: ROAD_Y + 50,
                r: isReached ? 8 : 6,
                fill: isReached ? '#f59e0b' : '#2a2a3e',
                stroke: isReached ? '#f59e0b' : '#444460',
                strokeWidth: "2"
              }), isReached && /*#__PURE__*/_jsx("text", {
                x: m.x,
                y: ROAD_Y + 53,
                textAnchor: "middle",
                fill: "#0a0a0f",
                fontSize: "8",
                fontWeight: "bold",
                children: "\u2713"
              }), isReached && /*#__PURE__*/_jsxs("g", {
                transform: `translate(${m.x}, ${ROAD_Y - 15})`,
                children: [/*#__PURE__*/_jsx("rect", {
                  x: "-12",
                  y: "-12",
                  width: "24",
                  height: "14",
                  rx: "2",
                  fill: "#f59e0b",
                  opacity: "0.8"
                }), /*#__PURE__*/_jsxs("text", {
                  x: "0",
                  y: "-3",
                  textAnchor: "middle",
                  fill: "#0a0a0f",
                  fontSize: "6",
                  fontWeight: "bold",
                  children: [m.percentage, "%"]
                }), /*#__PURE__*/_jsx("line", {
                  x1: "0",
                  y1: "2",
                  x2: "0",
                  y2: "10",
                  stroke: "#f59e0b",
                  strokeWidth: "1.5"
                })]
              }), /*#__PURE__*/_jsx("text", {
                x: m.x,
                y: ROAD_Y + 72,
                textAnchor: "middle",
                className: "text-[9px]",
                fill: isReached ? '#e8e8ed' : '#666680',
                style: {
                  fontFamily: 'system-ui'
                },
                children: m.label.length > 18 ? m.label.slice(0, 18) + '…' : m.label
              }), /*#__PURE__*/_jsxs("text", {
                x: m.x,
                y: ROAD_Y + 84,
                textAnchor: "middle",
                className: "text-[8px]",
                fill: isReached ? '#f59e0b' : '#555570',
                style: {
                  fontFamily: 'system-ui'
                },
                children: [m.percentage, "%"]
              })]
            }, m.id);
          }), /*#__PURE__*/_jsxs(motion.g, {
            animate: {
              x: carX,
              y: ROAD_Y + CAR_Y_OFFSET
            },
            transition: {
              type: 'spring',
              stiffness: 60,
              damping: 20
            },
            initial: {
              x: 40,
              y: ROAD_Y + CAR_Y_OFFSET
            },
            children: [/*#__PURE__*/_jsx("ellipse", {
              cx: "0",
              cy: "14",
              rx: "16",
              ry: "4",
              fill: "rgba(0,0,0,0.3)"
            }), /*#__PURE__*/_jsx("rect", {
              x: "-18",
              y: "-2",
              width: "36",
              height: "14",
              rx: "4",
              fill: "#f59e0b",
              stroke: "#d97706",
              strokeWidth: "1"
            }), /*#__PURE__*/_jsx("rect", {
              x: "-10",
              y: "-10",
              width: "20",
              height: "10",
              rx: "3",
              fill: "#fbbf24",
              stroke: "#f59e0b",
              strokeWidth: "0.5"
            }), /*#__PURE__*/_jsx("rect", {
              x: "-7",
              y: "-8",
              width: "14",
              height: "6",
              rx: "2",
              fill: "rgba(59,130,246,0.5)"
            }), /*#__PURE__*/_jsx("circle", {
              cx: "-10",
              cy: "12",
              r: "4",
              fill: "#1a1a2e",
              stroke: "#444460",
              strokeWidth: "1"
            }), /*#__PURE__*/_jsx("circle", {
              cx: "10",
              cy: "12",
              r: "4",
              fill: "#1a1a2e",
              stroke: "#444460",
              strokeWidth: "1"
            }), /*#__PURE__*/_jsx("circle", {
              cx: "17",
              cy: "4",
              r: "2",
              fill: "#fef3c7",
              opacity: "0.9"
            }), /*#__PURE__*/_jsx("circle", {
              cx: "-17",
              cy: "4",
              r: "1.5",
              fill: "#ef4444",
              opacity: "0.8"
            })]
          }), /*#__PURE__*/_jsxs("defs", {
            children: [/*#__PURE__*/_jsxs("linearGradient", {
              id: "roadGradient",
              x1: "0",
              y1: "0",
              x2: "1",
              y2: "0",
              children: [/*#__PURE__*/_jsx("stop", {
                offset: "0%",
                stopColor: "#7f1d1d"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "20%",
                stopColor: "#991b1b"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "40%",
                stopColor: "#78350f"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "60%",
                stopColor: "#365314"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "80%",
                stopColor: "#166534"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "100%",
                stopColor: "#14532d"
              })]
            }), /*#__PURE__*/_jsxs("linearGradient", {
              id: "redZone",
              x1: "0",
              y1: "0",
              x2: "1",
              y2: "0",
              children: [/*#__PURE__*/_jsx("stop", {
                offset: "0%",
                stopColor: "#ef4444"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "100%",
                stopColor: "transparent"
              })]
            }), /*#__PURE__*/_jsxs("linearGradient", {
              id: "greenZone",
              x1: "0",
              y1: "0",
              x2: "1",
              y2: "0",
              children: [/*#__PURE__*/_jsx("stop", {
                offset: "0%",
                stopColor: "transparent"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "100%",
                stopColor: "#22c55e"
              })]
            })]
          })]
        }), milestonePositions.map(m => /*#__PURE__*/_jsx(MilestoneTooltip, {
          milestone: m,
          x: m.x,
          visible: activeMilestone === m.id
        }, `tooltip-${m.id}`))]
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "w-full glow-line mb-4"
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6",
      children: [/*#__PURE__*/_jsxs(motion.div, {
        className: "flex flex-col items-center gap-2",
        initial: {
          scale: 0.8,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        transition: {
          duration: 0.5,
          delay: 0.4
        },
        children: [/*#__PURE__*/_jsx(ProgressRing, {
          progress: healthScore,
          size: 100,
          color: healthScore >= 70 ? '#22c55e' : healthScore >= 40 ? '#f59e0b' : '#ef4444'
        }), /*#__PURE__*/_jsx("span", {
          className: "text-xs text-[#a0a0b8] font-medium",
          children: "Health Score"
        })]
      }), /*#__PURE__*/_jsxs(motion.div, {
        className: "flex flex-col items-center gap-2",
        initial: {
          scale: 0.8,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        transition: {
          duration: 0.5,
          delay: 0.5
        },
        children: [/*#__PURE__*/_jsx(ProgressRing, {
          progress: completionPercentage,
          size: 100,
          color: "#f59e0b"
        }), /*#__PURE__*/_jsx("span", {
          className: "text-xs text-[#a0a0b8] font-medium",
          children: "Journey Progress"
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "w-full glow-line mb-4"
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
      children: [/*#__PURE__*/_jsx(StatCard, {
        label: "Distance to Freedom",
        value: 100 - completionPercentage,
        suffix: "%",
        color: "#22c55e",
        icon: "Flag",
        className: "glass-card-premium"
      }), /*#__PURE__*/_jsx(StatCard, {
        label: "Current Direction",
        value: 0,
        prefix: direction.emoji + ' ',
        suffix: "",
        color: direction.color,
        icon: "Compass",
        className: "glass-card-premium"
      }), /*#__PURE__*/_jsx(StatCard, {
        label: "Modules Done",
        value: modulesCompleted,
        suffix: "/11",
        color: "#f59e0b",
        icon: "BookOpen",
        className: "glass-card-premium"
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "w-full glow-line mb-4"
    }), /*#__PURE__*/_jsx(motion.div, {
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        duration: 0.5,
        delay: 0.6
      },
      children: /*#__PURE__*/_jsx(Card, {
        className: "border-0 overflow-hidden",
        style: {
          background: `linear-gradient(135deg, ${direction.color}12, ${direction.color}06)`,
          border: `1px solid ${direction.color}25`
        },
        children: /*#__PURE__*/_jsx(CardContent, {
          className: "p-5",
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: `flex size-12 shrink-0 items-center justify-center rounded-xl ${completionPercentage >= 75 ? 'weather-sunny' : completionPercentage >= 50 ? 'weather-cloudy' : completionPercentage >= 25 ? 'weather-rainy' : 'weather-stormy'}`,
              style: {
                backgroundColor: `${direction.color}20`
              },
              children: [/*#__PURE__*/_jsx(Car, {
                size: 24,
                style: {
                  color: direction.color
                }
              }), /*#__PURE__*/_jsx("div", {
                className: "breathing-dot ml-2"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-sm font-semibold text-[#e8e8ed]",
                children: direction.label
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-[#a0a0b8] mt-0.5 font-medium",
                children: completionPercentage === 0 ? 'Pehla module complete karo aur journey shuru karo!' : completionPercentage < 50 ? 'Aur modules complete karo aur GPS update hoga!' : completionPercentage < 100 ? 'Bahut accha! Freedom qareeb aa raha hai!' : 'Mubarak ho! Tumne financial freedom achieve ki!'
              })]
            })]
          })
        })
      })
    }), /*#__PURE__*/_jsxs(motion.div, {
      className: "space-y-3",
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        duration: 0.5,
        delay: 0.7
      },
      children: [/*#__PURE__*/_jsxs("h3", {
        className: "text-lg font-semibold text-[#e8e8ed] flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(MapPin, {
          size: 18,
          className: "text-[#f59e0b]"
        }), "Roadmap Milestones"]
      }), /*#__PURE__*/_jsx("div", {
        className: "space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar",
        children: MILESTONES.map((milestone, index) => {
          const isReached = completionPercentage >= milestone.percentage;
          const isNext = !isReached && (index === 0 || completionPercentage >= MILESTONES[index - 1].percentage);
          return /*#__PURE__*/_jsxs(motion.div, {
            className: "flex items-center gap-3 p-3 rounded-xl transition-colors",
            style: {
              backgroundColor: isReached ? 'rgba(245, 158, 11, 0.08)' : isNext ? 'rgba(245, 158, 11, 0.04)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isReached ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)'}`
            },
            initial: {
              x: -20,
              opacity: 0
            },
            animate: {
              x: 0,
              opacity: 1
            },
            transition: {
              delay: 0.8 + index * 0.08
            },
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex size-8 shrink-0 items-center justify-center rounded-full",
              style: {
                backgroundColor: isReached ? 'rgba(245,158,11,0.2)' : isNext ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)'
              },
              children: isReached ? /*#__PURE__*/_jsx(Trophy, {
                size: 14,
                className: "text-[#f59e0b]"
              }) : isNext ? /*#__PURE__*/_jsx(ChevronRight, {
                size: 14,
                className: "text-[#f59e0b]"
              }) : /*#__PURE__*/_jsx(MapPin, {
                size: 14,
                className: "text-[#555570]"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 min-w-0",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx("p", {
                  className: `text-sm font-medium truncate ${isReached ? 'text-[#e8e8ed]' : isNext ? 'text-[#bbbbcc]' : 'text-[#666680]'}`,
                  children: milestone.label
                }), isReached && /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] px-1.5 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] shrink-0",
                  children: "Done"
                }), isNext && /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] px-1.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#fbbf24] shrink-0",
                  children: "Next"
                })]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-[#a0a0b8] truncate font-medium",
                children: milestone.description
              })]
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-xs text-[#a0a0b8] shrink-0 tabular-nums font-medium",
              children: [milestone.percentage, "%"]
            })]
          }, milestone.id);
        })
      })]
    })]
  });
}