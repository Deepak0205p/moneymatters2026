'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@/lib/hooks/useProgress';
import { useAppStore } from '@/lib/store/useAppStore';
import { getGrade, getFinancialHealthScore } from '@/lib/utils';
import { modules } from '@/lib/data/modules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  GraduationCap,
  Share2,
  Award,
  AlertCircle,
  PenLine,
  Stamp,
  Star,
  BookOpen,
  TrendingUp,
  XCircle,
} from 'lucide-react';

// ─── Grade color mapping ────────────────────────────────
function getGradeColor(grade: string): { bg: string; text: string; border: string } {
  switch (grade) {
    case 'A+':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' };
    case 'A':
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
    case 'B':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
    case 'C':
      return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
    case 'D':
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' };
  }
}

// ─── Remarks generator (Hinglish) ───────────────────────
interface ModuleGrade {
  moduleId: number;
  title: string;
  grade: string;
  percentage: number;
}

function generateRemarks(grades: ModuleGrade[]): string[] {
  const remarks: string[] = [];

  // Find weakest modules (D, C, or no grade)
  const weakModules = grades
    .filter((g) => g.grade === 'D' || g.grade === 'C' || g.grade === '-')
    .sort((a, b) => {
      const order: Record<string, number> = { '-': 0, D: 1, C: 2 };
      return (order[a.grade] || 3) - (order[b.grade] || 3);
    })
    .slice(0, 3);

  // Hinglish advice per module
  const adviceMap: Record<number, string> = {
    1: 'Paisa ka basic samajh weak hai — Module 1 zaroor padho!',
    2: 'Budgeting mein weak ho — Module 2 review karo!',
    3: 'Saving strategies clear nahi hain — Module 3 se seekho!',
    4: 'Emergency fund ka importance samjho — Module 4 karo!',
    5: 'Debt se bachne ke liye Module 5 zaroor karo!',
    6: 'Banking basics strong karo — Module 6 padho!',
    7: 'Investment basics clear nahi hai — Module 7 padho!',
    8: 'Financial independence ka plan banao — Module 8 karo!',
    9: 'Insurance ki zaroorat samjho — Module 9 complete karo!',
    10: 'Tax planning se paisa bachao — Module 10 zaroor karo!',
    11: 'Real-world scenarios ke liye Module 11 complete karo!',
  };

  if (weakModules.length === 0) {
    remarks.push('Bahut badhiya! Financial literacy mein strong ho! 🎉');
    remarks.push('Aur improvement ke liye advanced topics explore karo!');
  } else {
    weakModules.forEach((m) => {
      if (m.grade === '-') {
        remarks.push(`Module ${m.moduleId} abhi tak nahi kiya — jaldi shuru karo!`);
      } else {
        remarks.push(adviceMap[m.moduleId] || `Module ${m.moduleId} mein improvement chahiye!`);
      }
    });
  }

  // Positive remark if some modules done well
  const strongModules = grades.filter((g) => g.grade === 'A+' || g.grade === 'A');
  if (strongModules.length > 0 && weakModules.length > 0) {
    const strongNames = strongModules
      .slice(0, 2)
      .map((m) => `Module ${m.moduleId}`)
      .join(', ');
    remarks.push(`${strongNames} mein bahut acche ho — isi tarah aage badho!`);
  }

  return remarks;
}

// ─── Main Component ─────────────────────────────────────
export default function ReportCard() {
  const { completionPercentage, modulesCompleted, getQuizAverage } = useProgress();
  const { completedModules, quizScores, userName, setUserName } = useAppStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName || '');
  const [showStamp, setShowStamp] = useState(false);

  // ─── Calculate grades for each module ─────────────────
  const moduleGrades: ModuleGrade[] = useMemo(() => {
    return modules.map((mod) => {
      // Find quiz scores for this module
      const moduleQuizKeys = Object.keys(quizScores).filter((key) =>
        key.startsWith(`m${mod.id}-`)
      );

      if (moduleQuizKeys.length > 0) {
        const totalScore = moduleQuizKeys.reduce((sum, key) => sum + quizScores[key], 0);
        const avgScore = totalScore / moduleQuizKeys.length;
        return {
          moduleId: mod.id,
          title: mod.title,
          grade: getGrade(avgScore),
          percentage: Math.round(avgScore),
        };
      } else if (completedModules.includes(mod.id)) {
        return {
          moduleId: mod.id,
          title: mod.title,
          grade: 'B',
          percentage: 70,
        };
      }

      return {
        moduleId: mod.id,
        title: mod.title,
        grade: '-',
        percentage: 0,
      };
    });
  }, [quizScores, completedModules]);

  const remarks = useMemo(() => generateRemarks(moduleGrades), [moduleGrades]);
  const healthScore = useMemo(
    () => getFinancialHealthScore(completedModules, quizScores),
    [completedModules, quizScores]
  );

  // Determine if promoted (overall average >= 60% or all modules completed)
  const isPromoted = useMemo(() => {
    const gradedModules = moduleGrades.filter((g) => g.grade !== '-');
    if (gradedModules.length === 0) return false;
    const avgPercentage =
      gradedModules.reduce((sum, g) => sum + g.percentage, 0) / gradedModules.length;
    return avgPercentage >= 60;
  }, [moduleGrades]);

  // Class level based on completion
  const classLevel = useMemo(() => {
    if (completionPercentage >= 90) return 'V — Financial Guru';
    if (completionPercentage >= 70) return 'IV — Advanced Learner';
    if (completionPercentage >= 50) return 'III — Intermediate';
    if (completionPercentage >= 25) return 'II — Beginner Plus';
    return 'I — Beginner';
  }, [completionPercentage]);

  // Overall grade
  const overallGrade = useMemo(() => {
    const avg = getQuizAverage();
    if (avg === 0 && modulesCompleted === 0) return '-';
    return getGrade(avg || completionPercentage);
  }, [getQuizAverage, completionPercentage, modulesCompleted]);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const handleShare = async () => {
    const shareText = `🎓 RUPAIYA VIDYALAYA Report Card\nStudent: ${userName || 'Student'}\nOverall Grade: ${overallGrade}\nModules Done: ${modulesCompleted}/11\nHealth Score: ${healthScore}%\n\n#Rupaiya101 #FinancialLiteracy`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Financial Report Card', text: shareText });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  // Trigger stamp animation on mount
  const handleStampClick = () => {
    setShowStamp(true);
    setTimeout(() => setShowStamp(false), 2500);
  };

  return (
    <div className="w-full flex justify-center">
      <motion.div
        className="w-full max-w-[800px]"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* ─── Report Card Container ──────────────────── */}
        <div
          className="relative rounded-xl overflow-hidden watermark-bg paper-texture"
          style={{
            background: '#fef3c7',
            border: '3px solid #1e3a5f',
            boxShadow: '4px 4px 0px #1e3a5f, 8px 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* PASSED / NEEDS IMPROVEMENT Stamp Overlay */}
          <AnimatePresence>
            {showStamp && (
              <motion.div
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="border-4 rounded-md px-6 py-3"
                  style={{
                    borderColor: isPromoted ? '#16a34a' : '#dc2626',
                    color: isPromoted ? '#16a34a' : '#dc2626',
                    transform: 'rotate(-15deg)',
                    backgroundColor: isPromoted ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                    fontFamily: 'Georgia, serif',
                  }}
                  initial={{ scale: 3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.7 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.36, 0.07, 0.19, 0.97] }}
                >
                  <span className="text-3xl font-black tracking-widest">
                    {isPromoted ? '✓ PASSED' : '✗ NEEDS IMPROVEMENT'}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* ─── Decorative top border ─────────────────── */}
          <div
            className="h-3 w-full"
            style={{
              background: 'repeating-linear-gradient(90deg, #1e3a5f 0px, #1e3a5f 20px, #fef3c7 20px, #fef3c7 40px)',
            }}
          />

          {/* ─── Header ────────────────────────────────── */}
          <div className="text-center py-5 px-4" style={{ borderBottom: '2px solid #1e3a5f' }}>
            {/* School emblem */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                <GraduationCap size={28} className="text-[#fef3c7]" />
              </div>
            </div>
            <h2
              className="text-xl md:text-2xl font-bold tracking-wide"
              style={{ color: '#1e3a5f', fontFamily: 'Georgia, serif' }}
            >
              RUPAIYA VIDYALAYA
            </h2>
            <p className="text-sm mt-1" style={{ color: '#3b5f8a', fontFamily: 'Georgia, serif' }}>
              Financial Literacy Report Card
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#6b8db5' }}>
              Established 2024 &bull; &ldquo;Paisa seekho, aage badho&rdquo;
            </p>
          </div>

          {/* ─── Student Info ──────────────────────────── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 sm:px-6 py-4"
            style={{ borderBottom: '1px dashed #1e3a5f' }}
          >
            {/* Student Name */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold shrink-0" style={{ color: '#1e3a5f' }}>
                Student Name:
              </span>
              {isEditingName ? (
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="h-7 text-sm bg-white border-[#1e3a5f]/30"
                    style={{ color: '#1e3a5f' }}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    placeholder="Apna naam likho"
                  />
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs"
                    style={{ backgroundColor: '#1e3a5f', color: '#fef3c7' }}
                    onClick={handleSaveName}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-sm underline" style={{ color: '#1e3a5f' }}>
                    {userName || 'Student'}
                  </span>
                  <button
                    onClick={() => {
                      setNameInput(userName || '');
                      setIsEditingName(true);
                    }}
                    className="p-0.5 rounded hover:bg-[#1e3a5f]/10 transition-colors"
                  >
                    <PenLine size={12} style={{ color: '#6b8db5' }} />
                  </button>
                </div>
              )}
            </div>

            {/* Class */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold shrink-0" style={{ color: '#1e3a5f' }}>
                Class:
              </span>
              <span className="text-sm" style={{ color: '#3b5f8a' }}>
                Level {classLevel}
              </span>
            </div>

            {/* Roll Number */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold shrink-0" style={{ color: '#1e3a5f' }}>
                Roll No:
              </span>
              <span className="text-sm" style={{ color: '#3b5f8a' }}>
                RUP-{String(healthScore).padStart(3, '0')}
              </span>
            </div>

            {/* Overall Grade */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold shrink-0" style={{ color: '#1e3a5f' }}>
                Overall Grade:
              </span>
              <span
                className="text-sm font-bold px-2 py-0.5 rounded corner-accent"
                style={{
                  color: getGradeColor(overallGrade).text.replace('text-', ''),
                  backgroundColor: getGradeColor(overallGrade).bg.replace('bg-', ''),
                }}
              >
                {overallGrade}
              </span>
            </div>
          </div>

          {/* ─── Grades Table ──────────────────────────── */}
          <div className="px-3 sm:px-4 py-3 overflow-x-auto">
            <table className="w-full border-collapse min-w-[300px]" style={{ fontFamily: 'Georgia, serif' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e3a5f' }}>
                  <th className="text-left text-xs px-3 py-2 text-[#fef3c7] font-semibold w-8">
                    #
                  </th>
                  <th className="text-left text-xs px-3 py-2 text-[#fef3c7] font-semibold">
                    Module Name
                  </th>
                  <th className="text-center text-xs px-3 py-2 text-[#fef3c7] font-semibold w-20">
                    Grade
                  </th>
                  <th className="text-center text-xs px-3 py-2 text-[#fef3c7] font-semibold w-24">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {moduleGrades.map((mg, index) => {
                  const gradeStyle = getGradeColor(mg.grade);
                  const isCompleted = completedModules.includes(mg.moduleId);
                  const rowBg = index % 2 === 0 ? 'rgba(30,58,95,0.03)' : 'transparent';

                  return (
                    <motion.tr
                      key={mg.moduleId}
                      className="slide-up-reveal"
                      style={{
                        backgroundColor: rowBg,
                        borderBottom: '1px solid rgba(30,58,95,0.1)',
                        animationDelay: `${0.1 + index * 0.08}s`,
                        opacity: 0,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <td
                        className="text-xs px-3 py-2"
                        style={{ color: '#6b8db5' }}
                      >
                        {mg.moduleId}
                      </td>
                      <td
                        className="text-xs px-3 py-2 font-medium"
                        style={{ color: '#1e3a5f' }}
                      >
                        {mg.title}
                      </td>
                      <td className="text-center px-3 py-2">
                        <span
                          className={`inline-flex items-center justify-center w-9 h-7 rounded-md text-xs font-bold ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border} border`}
                        >
                          {mg.grade}
                        </span>
                      </td>
                      <td className="text-center px-3 py-2">
                        {mg.grade === '-' ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500">
                            Not Started
                          </span>
                        ) : isCompleted ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Completed
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                            In Progress
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ─── Summary Stats ─────────────────────────── */}
          <div
            className="grid grid-cols-3 gap-2 sm:gap-3 px-4 sm:px-6 py-3"
            style={{ borderTop: '2px solid #1e3a5f', borderBottom: '1px dashed #1e3a5f' }}
          >
            <div className="text-center">
              <p className="text-[9px] sm:text-[10px]" style={{ color: '#6b8db5' }}>Modules Done</p>
              <p className="text-base sm:text-lg font-bold" style={{ color: '#1e3a5f' }}>{modulesCompleted}/11</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] sm:text-[10px]" style={{ color: '#6b8db5' }}>Quiz Average</p>
              <p className="text-base sm:text-lg font-bold" style={{ color: '#1e3a5f' }}>{getQuizAverage()}%</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] sm:text-[10px]" style={{ color: '#6b8db5' }}>Health Score</p>
              <p className="text-base sm:text-lg font-bold" style={{ color: '#1e3a5f' }}>{healthScore}</p>
            </div>
          </div>

          {/* ─── Remarks Section ───────────────────────── */}
          <div className="px-4 sm:px-6 py-4" style={{ borderBottom: '1px dashed #1e3a5f' }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} style={{ color: '#1e3a5f' }} />
              <h3
                className="text-sm font-bold underline"
                style={{ color: '#1e3a5f', fontFamily: 'Georgia, serif' }}
              >
                Teacher&apos;s Remarks:
              </h3>
            </div>
            <div className="space-y-2 pl-2">
              {remarks.map((remark, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <Star size={10} className="shrink-0 mt-1" style={{ color: '#f59e0b' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#1e3a5f' }}>
                    {remark}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── Parent/Teacher Comment Section ────────── */}
          <div className="px-4 sm:px-6 py-4" style={{ borderBottom: '1px dashed #1e3a5f', backgroundColor: 'rgba(30,58,95,0.03)' }}>
            <div className="flex items-center gap-2 mb-2">
              <PenLine size={14} style={{ color: '#3b5f8a' }} />
              <h3
                className="text-xs font-bold"
                style={{ color: '#1e3a5f', fontFamily: 'Georgia, serif' }}
              >
                Parent / Guardian Advice:
              </h3>
            </div>
            <div className="space-y-1.5 pl-6 border-l-2" style={{ borderColor: '#1e3a5f20' }}>
              {(isPromoted ? [
                'Accha ja raha hai! Aur practice karo — SIP shuru karo agar abhi tak nahi kiya.',
                'Budgeting ka habit banao — roz thoda bachana seekho.',
                'Financial literacy tumhari superpower hai — ise continue karo!',
              ] : [
                'Abhi seekhne ka waqt hai — modules complete karo aur quiz attempt karo.',
                'Paisa ka basic samjho — Module 1 se shuru karo.',
                'Galtiyan karna seekhne ka hissa hai — improve karte raho!',
              ]).map((advice, i) => (
                <p key={i} className="text-[11px] italic" style={{ color: '#3b5f8a' }}>
                  • {advice}
                </p>
              ))}
            </div>
          </div>

          {/* ─── Stamp Area ────────────────────────────── */}
          <div className="relative px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Stamp */}
            <div className="relative">
              <motion.button
                onClick={handleStampClick}
                className="cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4"
                  style={{
                    borderColor: isPromoted ? '#dc2626' : '#6b7280',
                    backgroundColor: 'transparent',
                    transform: 'rotate(-12deg)',
                  }}
                >
                  <Stamp size={20} style={{ color: isPromoted ? '#dc2626' : '#6b7280' }} />
                  <span
                    className="text-[10px] font-bold mt-1 text-center leading-tight"
                    style={{
                      color: isPromoted ? '#dc2626' : '#6b7280',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    {isPromoted ? 'PROMOTED' : 'NEEDS\nIMPROVEMENT'}
                  </span>
                  <span
                    className="text-[7px] mt-0.5"
                    style={{ color: isPromoted ? '#dc2626' : '#6b7280' }}
                  >
                    {new Date().getFullYear()}
                  </span>
                </div>
              </motion.button>

              {/* Stamp animation overlay */}
              <AnimatePresence>
                {showStamp && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ scale: 3, opacity: 0, rotate: -12 }}
                    animate={{ scale: 0.9, opacity: 0.6, rotate: -12 }}
                    exit={{ scale: 1, opacity: 0, rotate: -12 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <div
                      className="w-28 h-28 rounded-full border-4 flex items-center justify-center"
                      style={{
                        borderColor: isPromoted ? '#dc2626' : '#6b7280',
                        backgroundColor: isPromoted ? 'rgba(220,38,38,0.1)' : 'rgba(107,114,128,0.1)',
                      }}
                    >
                      <span
                        className="text-xs font-bold text-center"
                        style={{ color: isPromoted ? '#dc2626' : '#6b7280' }}
                      >
                        {isPromoted ? '✓ PROMOTED' : '✗ NEEDS\nIMPROVEMENT'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Share button */}
            <Button
              onClick={handleShare}
              className="flex items-center gap-2"
              style={{
                backgroundColor: '#1e3a5f',
                color: '#fef3c7',
                fontFamily: 'Georgia, serif',
              }}
            >
              <Share2 size={14} />
              <span className="text-xs">Share Report</span>
            </Button>
          </div>

          {/* ─── Footer ────────────────────────────────── */}
          <div
            className="px-4 sm:px-6 py-3 text-center"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            <p className="text-[10px] text-[#fef3c7]">
              RUPAIYA VIDYALAYA &bull; Financial Literacy for Indian Youth &bull; &ldquo;Paisa seekho, aage badho&rdquo;
            </p>
            <p className="text-[8px] text-[#6b8db5] mt-1">
              This report card is auto-generated based on your progress in RUPAIYA 101
            </p>
          </div>

          {/* Decorative bottom border */}
          <div
            className="h-3 w-full"
            style={{
              background:
                'repeating-linear-gradient(90deg, #1e3a5f 0px, #1e3a5f 20px, #fef3c7 20px, #fef3c7 40px)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
