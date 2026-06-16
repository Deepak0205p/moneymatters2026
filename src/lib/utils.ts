import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format Indian currency: 50000 -> '50,000' or 'Rs.50,000'
export function formatCurrency(amount: number, showSymbol = true): string {
  const formatted = amount.toLocaleString('en-IN');
  return showSymbol ? `Rs.${formatted}` : formatted;
}

// Calculate SIP future value
// Formula: P * [((1 + r)^n - 1) / r] * (1 + r)
export function calculateSIP(monthly: number, annualReturn: number, years: number): number {
  const r = annualReturn / 12 / 100;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

// Calculate inflation-adjusted value
// Formula: amount / (1 + inflationRate/100) ^ years
export function calculateInflation(amount: number, inflationRate: number, years: number): number {
  return amount / Math.pow(1 + inflationRate / 100, years);
}

// Calculate EMI
// Formula: P * r * (1+r)^n / [(1+r)^n - 1]
export function calculateEMI(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

// Calculate compound interest
export function calculateCompound(principal: number, rate: number, years: number, freq = 1): number {
  return principal * Math.pow(1 + rate / 100 / freq, freq * years);
}

// Rule of 72: years to double
export function yearsToDouble(rate: number): number {
  return 72 / rate;
}

// Get grade from percentage
export function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  return 'D';
}

// Format large Indian numbers: 100000 -> '1 lakh', 10000000 -> '1 crore'
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} crore`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} lakh`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)} thousand`;
  return num.toString();
}

// Calculate total savings from a daily saving habit
export function calculateDailySavingHabit(dailyAmount: number, annualReturn: number, years: number): number {
  const monthly = dailyAmount * 30;
  return calculateSIP(monthly, annualReturn, years);
}

// Get financial health score based on module progress
export function getFinancialHealthScore(completedModules: number[], quizScores: Record<string, number>): number {
  const moduleScore = (completedModules.length / 11) * 50;
  const quizValues = Object.values(quizScores);
  const avgQuiz = quizValues.length > 0 ? quizValues.reduce((a, b) => a + b, 0) / quizValues.length : 0;
  const quizScore = (avgQuiz / 100) * 50;
  return Math.round(moduleScore + quizScore);
}
