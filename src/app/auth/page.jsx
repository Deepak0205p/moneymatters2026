'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  reload
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { syncUserToFirestore } from '@/lib/dbSync';
import { useAppStore } from '@/lib/store/useAppStore';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  MailCheck,
  RefreshCw
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const loginUser = useAppStore(state => state.loginUser);
  const loadFromCloud = useAppStore(state => state.loadFromCloud);
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Email Verification State
  const [verifyStep, setVerifyStep] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingName, setPendingName] = useState('');
  const pollRef = useRef(null);

  // Auto-redirect if already logged in & verified
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await reload(user);
        if (user.emailVerified) {
          loginUser(user);
          await loadFromCloud();
          router.push('/home/dashboard');
        } else {
          setPendingUser(user);
          setVerifyStep(true);
        }
      }
    });
    return () => unsubscribe();
  }, [router, loginUser, loadFromCloud]);

  // Resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Poll email verification status
  useEffect(() => {
    if (!verifyStep || !pendingUser) return;
    pollRef.current = setInterval(async () => {
      await reload(pendingUser);
      if (pendingUser.emailVerified) {
        clearInterval(pollRef.current);
        await handleAuthSuccess(pendingUser, { name: pendingName });
      }
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [verifyStep, pendingUser]);

  const handleAuthSuccess = async (user, additionalData = {}) => {
    try {
      await syncUserToFirestore(user, additionalData);
      loginUser(user);
      await loadFromCloud();
      router.push('/home/dashboard');
    } catch (err) {
      console.error('Post-auth sync error:', err);
      router.push('/home/dashboard');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await reload(userCred.user);
        if (!userCred.user.emailVerified) {
          setPendingUser(userCred.user);
          setPendingName('');
          setVerifyStep(true);
          return;
        }
        await handleAuthSuccess(userCred.user);
      } else {
        if (!name.trim()) throw new Error("Name is required");
        
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: name });
        await sendEmailVerification(userCred.user);
        
        setPendingUser(userCred.user);
        setPendingName(name);
        setVerifyStep(true);
        setResendCountdown(60);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerifyLoading(true);
    setError('');
    try {
      await sendEmailVerification(pendingUser);
      setResendCountdown(60);
    } catch (err) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleCheckVerified = async () => {
    setVerifyLoading(true);
    setError('');
    try {
      await reload(pendingUser);
      if (pendingUser.emailVerified) {
        clearInterval(pollRef.current);
        await handleAuthSuccess(pendingUser, { name: pendingName });
      } else {
        setError('Email not verified yet. Check your inbox and click the verification link.');
      }
    } catch (err) {
      setError(err.message || 'Failed to check verification status');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthSuccess(result.user);
    } catch (err) {
      console.error("Google Auth Error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-md bg-[#0C1420]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] shadow-2xl p-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="size-8 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight mb-2">
            Money Mentor
          </h1>
          <p className="text-sm text-zinc-400">
            {verifyStep 
              ? 'Check your email to verify' 
              : isLogin 
                ? 'Welcome back! Ready to learn?' 
                : 'Create an account to master your money.'}
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, mb: 0 }}
              animate={{ opacity: 1, height: 'auto', mb: 20 }}
              exit={{ opacity: 0, height: 0, mb: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-3 overflow-hidden"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p className="leading-tight">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!verifyStep ? (
            /* ── Login / Signup Form ── */
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name" 
                        className="w-full bg-[#101D2E] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all focus:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
                        required={!isLogin}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    className="w-full bg-[#101D2E] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all focus:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="w-full bg-[#101D2E] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all focus:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">OR</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Google Auth */}
              <button 
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Guest fallback */}
              <button 
                onClick={() => router.push('/home/dashboard')}
                className="w-full mt-4 text-xs text-zinc-500 hover:text-emerald-400 transition-colors py-2 flex justify-center items-center gap-1.5"
              >
                <ShieldCheck className="size-3.5" />
                Continue as Guest (Demo)
              </button>

              {/* Footer Toggle */}
              <p className="text-center text-sm text-zinc-400 mt-8">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          ) : (
            /* ── Email Verification Step ── */
            <motion.div
              key="verify-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Verification Icon */}
              <div className="flex justify-center mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                >
                  <MailCheck className="size-10 text-emerald-400" />
                </motion.div>
              </div>

              {/* Email info */}
              <div className="text-center mb-6">
                <p className="text-zinc-300 text-sm">
                  We sent a verification link to
                </p>
                <p className="text-white font-semibold text-sm mt-1">{pendingUser?.email || email}</p>
                <p className="text-zinc-500 text-xs mt-3">
                  Click the link in your email to verify your account.
                </p>
              </div>

              {/* Check Verification Button */}
              <button 
                onClick={handleCheckVerified}
                disabled={verifyLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {verifyLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    I've Verified — Continue
                    <CheckCircle2 className="size-4 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>

              {/* Resend Verification */}
              <div className="text-center mt-4">
                {resendCountdown > 0 ? (
                  <p className="text-zinc-500 text-xs">
                    Resend email in {resendCountdown}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    disabled={verifyLoading}
                    className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors disabled:opacity-50 flex items-center gap-1.5 mx-auto"
                  >
                    <RefreshCw className="size-3" />
                    {verifyLoading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>

              {/* Auto-detect notice */}
              <p className="text-center text-zinc-600 text-[10px] mt-4">
                We'll automatically detect when your email is verified.
              </p>

              {/* Back to login */}
              <div className="text-center mt-6">
                <button
                  onClick={() => { 
                    setVerifyStep(false); 
                    setError(''); 
                    setResendCountdown(0);
                    clearInterval(pollRef.current);
                  }}
                  className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors"
                >
                  ← Back to sign in
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
