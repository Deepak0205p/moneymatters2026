'use client';

import { useRouter } from 'next/navigation';
import { 
  TrendingUp, ShieldCheck, Milestone, Compass, 
  Eye, Target, Newspaper, PiggyBank, Brain, 
  Dices, HelpCircle, Gamepad2, Landmark, 
  CalendarDays, Award, BarChart3, Activity, Wrench
} from 'lucide-react';

export default function ToolsPage() {
  const router = useRouter();

  const openToolDialog = (toolId) => {
    router.push(`/home/tools?tool=${toolId}`);
  };

  const tools = [
    { 
      id: 'sip', 
      label: 'Compounding Khazana 💰', 
      sub: 'SIP Growth Engine', 
      desc: 'Check karo compounding ka magic aur dekho investment kaise badhegi.', 
      color: '#10B981', 
      icon: TrendingUp 
    },
    { 
      id: 'emergency', 
      label: 'Suraksha Kavach 🛡️', 
      sub: 'Emergency Fund Builder', 
      desc: 'Apne bure waqt ke liye safe reserve estimate aur track karo.', 
      color: '#38BDF8', 
      icon: ShieldCheck 
    },
    { 
      id: 'age', 
      label: 'Ameer Meter 📈', 
      sub: 'Financial Age Calculator', 
      desc: 'Calculate karo ki aap money management mein kitne mature ho.', 
      color: '#F59E0B', 
      icon: Milestone 
    },
    { 
      id: 'priority', 
      label: 'Zaroorat vs Khwahish ⚖️', 
      sub: 'Needs vs Wants Budgeter', 
      desc: 'Apne daily kharche audit karo aur priority wisely set karo.', 
      color: '#8B5CF6', 
      icon: Compass 
    },
    { 
      id: 'expense', 
      label: 'Kharcha Spy 🕵️‍♂️', 
      sub: 'Smart Expense Tracker', 
      desc: 'Paisa kaha ja raha hai? Apne spending patterns ko track karo.', 
      color: '#EF4444', 
      icon: Eye 
    },
    { 
      id: 'goals', 
      label: 'Sapne Se Sach 🎯', 
      sub: 'Dream Goal Planner', 
      desc: 'Apne financial goals set karo aur target timeline map karo.', 
      color: '#06B6D4', 
      icon: Target 
    },
    { 
      id: 'news', 
      label: 'Paisa Patrika 📰', 
      sub: 'Finance News & Insights', 
      desc: 'Roj ke market updates aur important financial lessons padho.', 
      color: '#EC4899', 
      icon: Newspaper 
    },
    { 
      id: 'savings', 
      label: 'Bachat Challenge 🐷', 
      sub: 'Savings Challenger', 
      desc: 'Smart money-saving challenges complete karke savings habit banao.', 
      color: '#10B981', 
      icon: PiggyBank 
    },
    { 
      id: 'quiz', 
      label: 'Gyan Arena 🧠', 
      sub: 'Financial Literacy Quiz', 
      desc: 'Test karo apna financial knowledge aur naye rewards kamao.', 
      color: '#F59E0B', 
      icon: HelpCircle 
    },
    { 
      id: 'spin', 
      label: 'Kismat Chakra 🎡', 
      sub: 'Daily Fortune Wheel', 
      desc: 'Spin karo har roj aur financial bonuses and tips jeeto.', 
      color: '#A855F7', 
      icon: Dices 
    },
    { 
      id: 'memory', 
      label: 'Dimag ki Kasrat 🧩', 
      sub: 'Financial Memory Match', 
      desc: 'Card match karke finance concepts ko mazedaar tarike se seekho.', 
      color: '#6366F1', 
      icon: Brain 
    },
    { 
      id: 'word', 
      label: 'Shabda Sangram 🔠', 
      sub: 'Word Scramble Game', 
      desc: 'Letters arrange karo aur finance terms discover karo.', 
      color: '#F43F5E', 
      icon: Gamepad2 
    },
    { 
      id: 'invest', 
      label: 'Bada Faisla 🔍', 
      sub: 'Investment Comparison', 
      desc: 'Alag-alag assets (Gold, Stocks, FD) ke returns compare karo.', 
      color: '#14B8A6', 
      icon: Landmark 
    },
    { 
      id: 'habit', 
      label: 'Aadat Tracker 📅', 
      sub: 'Money Habit Tracker', 
      desc: 'Daily good financial habits log karo aur streak build karo.', 
      color: '#06B6D4', 
      icon: CalendarDays 
    },
    { 
      id: 'badges', 
      label: 'Sammaan Gallery 🏆', 
      sub: 'Financial Badges Showcase', 
      desc: 'Apne seekhe hue achievements aur unlocked badges check karo.', 
      color: '#EAB308', 
      icon: Award 
    },
    { 
      id: 'achievement', 
      label: 'Kamyabi Board 📊', 
      sub: 'Achievement Dashboard', 
      desc: 'Apni total learning progress aur rewards statistics dekho.', 
      color: '#3B82F6', 
      icon: BarChart3 
    },
    { 
      id: 'health', 
      label: 'Paisa Doctor 🏥', 
      sub: 'Financial Health Checkup', 
      desc: 'Apne financial status ka complete checkup aur custom prescription lo.', 
      color: '#EF4444', 
      icon: Activity 
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left py-2">
      {/* Header section */}
      <div className="space-y-2 border-b border-white/[0.06] pb-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Wrench className="text-indigo-400 animate-pulse" size={26} /> Financial Tools & Utilities
        </h2>
        <p className="text-xs text-zinc-400">
          Apne money game ko upgrade karne ke liye smart utilities, calculators, aur mini-activities use karo.
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map(t => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              className="bg-[#0D0F1F] border border-white/[0.05] rounded-3xl p-5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              style={{
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Top ambient glow */}
              <div 
                className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" 
                style={{ backgroundColor: t.color }}
              />

              <div>
                {/* Icon & Sub-header */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border" 
                    style={{ 
                      color: t.color, 
                      backgroundColor: `${t.color}08`,
                      borderColor: `${t.color}25`
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span 
                    className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ 
                      color: t.color, 
                      backgroundColor: `${t.color}12`,
                      border: `1px solid ${t.color}20`
                    }}
                  >
                    {t.sub}
                  </span>
                </div>

                {/* Content */}
                <h4 className="text-base font-black text-white leading-tight group-hover:text-zinc-200 transition-colors mt-2">
                  {t.label}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed mt-2 min-h-[3.25rem]">
                  {t.desc}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openToolDialog(t.id)}
                className="w-full mt-5 py-3 rounded-2xl text-[10px] font-black tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                style={{
                  backgroundColor: `${t.color}15`,
                  color: t.color,
                  border: `1px solid ${t.color}25`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.color;
                  e.currentTarget.style.color = '#0a0c1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${t.color}15`;
                  e.currentTarget.style.color = t.color;
                }}
              >
                OPEN TOOL 🛠️
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
