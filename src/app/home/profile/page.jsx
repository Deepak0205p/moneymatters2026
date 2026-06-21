'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppStore } from '@/lib/store/useAppStore';
import { BADGES } from '@/lib/data/badges';
import { 
  Trophy, User, Edit3, LogOut, CheckCircle2, Shield, Camera, X, 
  MapPin, Briefcase, Mail
} from 'lucide-react';

function getLevelLabel(lvl) {
  if (lvl >= 10) return { label: 'Grand Master', color: '#F59E0B' };
  if (lvl >= 7) return { label: 'Expert Advisor', color: '#8B5CF6' };
  if (lvl >= 4) return { label: 'Smart Investor', color: '#10B981' };
  return { label: 'Rookie Learner', color: '#94A3B8' };
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    setUser,
    logout,
    level,
    xp,
    coins,
    streak,
    completedModules,
    badges,
    earnedBadges
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '', // read-only from auth
    status: '',
    city: ''
  });

  // Load existing data from Firestore if available
  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid && db) {
        const snap = await getDoc(doc(db, 'profiles', user.uid));
        const data = snap.exists() ? snap.data() : null;
        
        if (data) {
          setFormData({
            name: data.name || user.displayName || '',
            email: data.email || user.email || '',
            status: data.status || '',
            city: data.city || ''
          });
        } else {
          setFormData({
            name: user.displayName || '',
            email: user.email || '',
            status: '',
            city: ''
          });
        }
      } else if (user) {
         setFormData({
            name: user.displayName || 'Guest User',
            email: user.email || '',
            status: '',
            city: ''
          });
      }
    }
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      logout();
      router.push('/');
    } catch (err) {
      console.error('Error signing out', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setLoading(true);

    try {
      // 1. Update Firebase Auth Profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.name
        });
      }

      // 2. Update Firestore Profile
      if (db) {
        await updateDoc(doc(db, 'profiles', user.uid), {
          name: formData.name,
          status: formData.status,
          city: formData.city
        });
      }

      // 3. Update Local Store
      setUser({ ...user, displayName: formData.name });
      
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const levelInfo = getLevelLabel(level);

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left pb-10">
      
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <User className="text-emerald-500 size-8" /> 
          Your Profile
        </h1>
        <button 
          onClick={handleSignOut}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-red-500/20"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0C1420] border border-white/[0.05] p-6 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/20 to-indigo-500/20" />
            
            <div className="relative z-10 flex flex-col items-center mt-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-[#101D2E] border-4 border-[#0C1420] shadow-xl flex items-center justify-center text-5xl overflow-hidden relative">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    "🦊"
                  )}
                  {/* Subtle hover overlay to hint at future upload feature */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white size-6" />
                  </div>
                </div>
                <div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg"
                  style={{ backgroundColor: `${levelInfo.color}20`, borderColor: levelInfo.color, color: levelInfo.color }}
                >
                  Lvl {level}
                </div>
              </div>

              <h2 className="text-2xl font-black text-white mt-5 mb-1 text-center">
                {formData.name || 'Student'}
              </h2>
              <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium mb-6">
                <Shield size={14} style={{ color: levelInfo.color }} /> 
                {levelInfo.label}
              </div>

              {/* Edit Button */}
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="bg-[#0C1420] border border-white/[0.05] p-5 rounded-3xl space-y-4 shadow-xl">
             <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                <span className="text-zinc-400 text-sm font-medium">Email</span>
                <span className="text-white text-sm truncate max-w-[150px]">{user?.email || 'N/A'}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                <span className="text-zinc-400 text-sm font-medium">Status</span>
                <span className="text-white text-sm capitalize">{formData.status || 'Not Set'}</span>
             </div>
             <div className="flex justify-between items-center py-2">
                <span className="text-zinc-400 text-sm font-medium">City</span>
                <span className="text-white text-sm">{formData.city || 'Not Set'}</span>
             </div>
          </div>
        </div>

        {/* Right Column: Stats & Badges */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Stats Grid */}
          <div className="bg-[#0C1420] border border-white/[0.05] p-6 rounded-3xl shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
             
             <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
               <Trophy className="text-amber-400" size={20} /> Your Journey
             </h3>

             {/* XP Progress bar */}
             <div className="mb-8">
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">
                <span>Experience Points</span>
                <span className="text-emerald-400">{xp} / {level * 300} XP</span>
              </div>
              <div className="h-3 bg-[#101D2E] rounded-full overflow-hidden border border-white/[0.05] shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full relative" 
                  style={{ width: `${Math.min((xp / (level * 300)) * 100, 100)}%` }} 
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Gold Coins', value: coins, accent: '#F59E0B' },
                { label: 'Streak Days', value: `${streak}d`, accent: '#EF4444' },
                { label: 'Modules Done', value: `${completedModules.length}/11`, accent: '#10B981' },
                { label: 'Badges Won', value: `${badges.length + earnedBadges.length}`, accent: '#8B5CF6' }
              ].map(pill => (
                <div key={pill.label} className="bg-[#101D2E] border border-white/[0.05] rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: pill.accent }} />
                  <span className="text-2xl font-black block relative z-10" style={{ color: pill.accent }}>{pill.value}</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1.5 block relative z-10">{pill.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Gallery */}
          <div className="bg-[#0C1420] border border-white/[0.05] p-6 rounded-3xl shadow-xl">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <Shield className="text-indigo-400" size={20} /> Badges Gallery
            </h3>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
              {BADGES.map(badge => {
                const isUnlocked = badges.includes(badge.id) || earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-white/[0.1] shadow-lg hover:bg-white/[0.08]'
                        : 'bg-white/[0.02] border-white/[0.02] opacity-40 grayscale'
                    }`}
                    title={badge.description}
                  >
                    <div className="text-3xl mb-2 drop-shadow-md">{badge.emoji}</div>
                    <span className="text-[10px] font-bold text-zinc-300 block truncate w-full px-1">{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0C1420] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#101D2E]">
                <h3 className="text-xl font-black text-white">Edit Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#101D2E] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-all focus:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email (Read-only)</label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full bg-[#101D2E] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-zinc-400 text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Current Status</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-[#101D2E] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-all focus:shadow-[0_0_0_1px_rgba(16,185,129,0.2)] appearance-none"
                    >
                      <option value="">Select status...</option>
                      <option value="student">Student</option>
                      <option value="professional">Working Professional</option>
                      <option value="freelancer">Freelancer</option>
                      <option value="business">Business Owner</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="e.g. Mumbai, Bangalore"
                      className="w-full bg-[#101D2E] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-all focus:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#101D2E] border border-emerald-500/30 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-full">
              <CheckCircle2 size={18} />
            </div>
            <span className="font-medium text-sm">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
