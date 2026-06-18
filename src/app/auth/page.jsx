"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { auth, googleProvider } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  CheckCircle2,
  Sparkles,
  Coins
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const {
    isAuthenticated,
    loginUser,
    addCoins,
    addBadge,
    badges
  } = useAppStore();
  const [mode, setMode] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hydrated && isAuthenticated) router.push('/dashboard');
  }, [hydrated, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email aur password dono zaroori hai!');
      return;
    }
    if (mode === 'signup' && name.trim().length < 2) {
      setError('Naam kam se kam 2 characters ka hona chahiye!');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
        const user = userCredential.user;
        await updateProfile(user, { displayName: name.trim() });

        const profile = {
          uid: user.uid,
          email: user.email,
          displayName: name.trim(),
          phoneNumber: null,
          photoURL: null
        };

        await loginUser(profile);
        addCoins(25);
        if (!badges.includes('first-login')) addBadge('first-login');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
        const user = userCredential.user;

        const profile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          phoneNumber: user.phoneNumber || null,
          photoURL: user.photoURL || null
        };

        await loginUser(profile);
      }
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Yeh email pehle se registered hai!');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Sahi email ya password daalein!');
      } else if (err.code === 'auth/weak-password') {
        setError('Password kam se kam 6 characters ka hona chahiye!');
      } else {
        setError(err.message || 'Auth failure! Phir se try karein.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const profile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        phoneNumber: user.phoneNumber || null,
        photoURL: user.photoURL || null
      };

      await loginUser(profile);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Sign-In fail ho gaya.');
    } finally {
      setLoading(false);
    }
  };



  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="w-12 h-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-midnight bg-grid-pattern">
      {/* 3D Decorative Floating Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.08] blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.08] blur-[140px]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center perspective-deep">
          
          {/* Left Feature Column (Premium 3D card presentation) */}
          <div className="hidden lg:block">
            <div className="glass-card-premium rounded-3xl p-8 relative overflow-hidden card-3d border-b-8 border-emerald-500/20">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-ai/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl coin-spin-3d"
                    style={{
                      background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                      boxShadow: '0 0 20px rgba(16,185,129,0.40)'
                    }}
                  >
                    <Coins size={24} className="text-midnight" strokeWidth={2.5} />
                  </div>
                  <h1 className="font-display text-3xl font-extrabold">
                    <span className="text-emerald-soft">Capital</span>{' '}
                    <span className="text-gradient-brand">Mastery</span>
                  </h1>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 mb-6 hover-card-scale shadow-premium">
                  <Image
                    src="/images/auth_illustration.jpeg"
                    alt="Financial learning illustration"
                    width={600}
                    height={300}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105"
                    priority
                  />
                </div>

                <h2 className="font-display text-2xl font-bold text-ink mb-3 heading-gradient">
                  Paisa samjho, future secure karo!
                </h2>
                <p className="text-ink-muted mb-6 leading-relaxed">
                  11 modules, 11 interactive strategies, AI advisor, gamified learning — sab kuch Hinglish mein, specially designed for Indian youth.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Shield, label: 'Safe', color: '#10B981' },
                    { icon: Sparkles, label: 'Free', color: '#8B5CF6' },
                    { icon: CheckCircle2, label: 'Easy', color: '#F59E0B' }
                  ].map(f => (
                    <div key={f.label} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center hover-lift border-b-4 border-white/10">
                      <f.icon
                        size={20}
                        className="mx-auto mb-1.5"
                        style={{ color: f.color }}
                      />
                      <span className="text-xs text-ink-muted font-medium">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Input Form Column */}
          <div>
            <div className="glass-card-premium rounded-3xl p-8 sm:p-10 card-3d border-b-8 border-emerald-500/20">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-emerald-soft transition-colors mb-6 font-medium btn-magnetic"
              >
                <ArrowLeft size={14} /> Home
              </button>

              <h2 className="font-display text-2xl font-bold text-ink mb-1">
                {mode === 'signup' ? 'Apna account banao' : 'Wapas aao, dost!'}
              </h2>
              <p className="text-sm text-ink-muted mb-8">
                {mode === 'signup' ? 'Signup karke 25 bonus coins pao! 🎁' : 'Login karke apni progress continue karo'}
              </p>

              {/* Mode Toggle Button */}
              <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/8 mb-6">
                {['signup', 'login'].map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setError('');
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      mode === m ? 'bg-emerald text-midnight font-bold shadow-glow-emerald border-b-2 border-emerald-600' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {m === 'signup' ? 'Sign Up' : 'Login'}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="overflow-hidden">
                    <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                      Naam
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Apna naam likho"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-ink outline-none focus:border-emerald/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald/15 transition-all placeholder:text-ink-muted/50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="dost@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-ink outline-none focus:border-emerald/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald/15 transition-all placeholder:text-ink-muted/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-sm text-ink outline-none focus:border-emerald/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald/15 transition-all placeholder:text-ink-muted/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Submit 3D Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-emerald btn-3d w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {mode === 'signup' ? 'Sign Up' : 'Login'}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-ink-muted uppercase tracking-wider">ya</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-ink hover:bg-white/10 hover:border-emerald/40 hover:translate-y-[-2px] transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google se Login karo
                </button>
              </div>

              <p className="text-center text-[10px] text-ink-muted/60 mt-6 leading-relaxed">
                By continuing you agree to our Terms of Service. Your data is synced automatically to Supabase database.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}