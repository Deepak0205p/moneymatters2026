'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Send, User, Wifi, WifiOff, Loader2, Globe, Brain,
  TrendingUp, PiggyBank, Receipt, BarChart2, Bot,
  Plus, MessageSquare, Trash2, Clock, Copy, Check,
  ThumbsUp, ThumbsDown, RefreshCw, SquarePen, Sparkles,
  ChevronDown, AlertCircle,
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/chatbot/markdown-renderer';
import { SourceCard } from '@/components/chatbot/source-card';

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function fetchConversations() {
  try {
    const res = await fetch('/api/chatbot/conversations');
    if (res.ok) return await res.json();
  } catch (_) {}
  return [];
}

/* ─────────────────────────────────────────
   TYPING DOTS
───────────────────────────────────────── */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] h-4 align-middle">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block size-[5px] rounded-full bg-zinc-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────
   COPY BUTTON
───────────────────────────────────────── */
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  const doCopy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  };
  return (
    <button onClick={doCopy} title="Copy" className="p-1.5 rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-all">
      {ok ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
    </button>
  );
}

/* ─────────────────────────────────────────
   ROUTE BADGE
───────────────────────────────────────── */
function RouteBadge({ route }) {
  if (route === 'ONLINE')
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Globe className="size-2.5" />Live</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20"><Brain className="size-2.5" />AI</span>;
}

/* ─────────────────────────────────────────
   MESSAGE ROW — ChatGPT style
───────────────────────────────────────── */
function MessageRow({ message }) {
  const isUser = message.role === 'user';
  const [feedback, setFeedback] = useState(null);

  return (
    <div className={`group w-full py-5 px-4 sm:px-0 ${isUser ? '' : 'bg-white/[0.015]'} hover:bg-white/[0.02] transition-colors duration-100`}>
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            // User avatar — amber (matches project gold accent)
            <div className="size-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-bold text-white shadow-md shadow-amber-500/20 select-none">
              U
            </div>
          ) : (
            // AI avatar — project emerald
            <div className="size-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="size-4 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <div className="text-sm font-semibold text-white mb-2">
            {isUser ? 'You' : 'Money Mentor'}
          </div>

          {/* Text */}
          <div className={`text-sm leading-7 text-zinc-100 ${isUser ? '' : ''}`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : message.content ? (
              <MarkdownRenderer content={message.content} />
            ) : (
              <TypingDots />
            )}
          </div>

          {/* AI footer — hover reveal */}
          {!isUser && message.content && (
            <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CopyBtn text={message.content} />
              <button
                onClick={() => setFeedback('up')}
                className={`p-1.5 rounded-md transition-all hover:bg-white/[0.06] ${feedback === 'up' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ThumbsUp className="size-3.5" />
              </button>
              <button
                onClick={() => setFeedback('down')}
                className={`p-1.5 rounded-md transition-all hover:bg-white/[0.06] ${feedback === 'down' ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ThumbsDown className="size-3.5" />
              </button>
              {message.route && <span className="ml-1"><RouteBadge route={message.route} /></span>}
              {message.latency !== undefined && (
                <span className="text-[10px] text-zinc-700 ml-1 flex items-center gap-0.5">
                  <Clock className="size-2.5" />
                  {message.latency < 1000 ? `${Math.round(message.latency)}ms` : `${(message.latency / 1000).toFixed(1)}s`}
                </span>
              )}
            </div>
          )}

          {/* Sources */}
          {!isUser && message.sources?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.sources.map((url, idx) => <SourceCard key={idx} url={url} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUGGESTION CHIP
───────────────────────────────────────── */
function SuggestionCard({ icon: Icon, label, query, color, onClick }) {
  return (
    <button
      onClick={() => onClick(query)}
      className="group flex items-start gap-3 text-left bg-[#0C1624] hover:bg-[#101D2E] border border-white/[0.07] hover:border-emerald-500/20 rounded-2xl px-4 py-3.5 transition-all duration-150 cursor-pointer"
    >
      <div className={`shrink-0 mt-0.5 size-5 rounded-md flex items-center justify-center ${color}`}>
        <Icon className="size-3" />
      </div>
      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-snug">{label}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function ChatbotPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendOk, setBackendOk] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  /* ── scroll ── */
  const scrollToBottom = useCallback((smooth = true) => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
    }
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setTimeout(() => scrollToBottom(false), 60); }, [messages, isLoading]);

  /* ── health ── */
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/chatbot/health');
      setBackendOk(res.ok);
    } catch { setBackendOk(false); }
    finally { setCheckingHealth(false); }
  }, []);

  useEffect(() => {
    checkHealth();
    const t = setInterval(checkHealth, 15000);
    return () => clearInterval(t);
  }, [checkHealth]);

  /* ── load conversation list ── */
  const reloadList = useCallback(async () => {
    const data = await fetchConversations();
    setConversations(data);
  }, []);

  useEffect(() => { reloadList(); }, [activeConvId]);

  /* ── select conversation ── */
  const selectConv = async (id) => {
    setActiveConvId(id);
    try {
      const res = await fetch(`/api/chatbot/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.map((m) => ({
          id: m.id, role: m.role, content: m.content,
          route: m.route, sources: m.sources, latency: m.latency_ms, timestamp: m.created_at,
        })));
      }
    } catch (_) {}
  };

  /* ── new chat ── */
  const newChat = () => { setActiveConvId(null); setMessages([]); setError(null); };

  /* ── delete conversation ── */
  const deleteConv = async (id, e) => {
    e.stopPropagation();
    await fetch(`/api/chatbot/conversations/${id}`, { method: 'DELETE' }).catch(() => {});
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) newChat();
  };

  /* ── send ── */
  const send = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;
    setError(null);
    setMessages((prev) => [...prev, { id: generateId(), role: 'user', content: text, timestamp: Date.now() }]);
    setInput('');
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId: activeConvId }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const newId = res.headers.get('X-Conversation-Id');
      if (newId && newId !== activeConvId) setActiveConvId(newId);

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      const aId = generateId();
      setMessages((prev) => [...prev, { id: aId, role: 'assistant', content: '', timestamp: Date.now() }]);

      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const ev of dec.decode(value, { stream: true }).split('\n\n')) {
          if (!ev.startsWith('data: ')) continue;
          try {
            const d = JSON.parse(ev.slice(6));
            if (d.type === 'metadata') setMessages((p) => p.map((m) => m.id === aId ? { ...m, route: d.route, sources: d.sources } : m));
            else if (d.type === 'chunk') { buf += d.content; setMessages((p) => p.map((m) => m.id === aId ? { ...m, content: buf } : m)); }
            else if (d.type === 'done') setMessages((p) => p.map((m) => m.id === aId ? { ...m, latency: d.latency_ms } : m));
            else if (d.type === 'error') setError(d.message);
          } catch (_) {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const SUGGESTIONS = [
    { icon: TrendingUp, label: "What's Nifty and Sensex doing today?", query: "What's the Nifty and Sensex doing today?", color: 'bg-emerald-500/15 text-emerald-400' },
    { icon: PiggyBank, label: 'Best SIP funds to start with ₹5,000/month', query: 'Best SIP mutual funds to start with ₹5000/month', color: 'bg-violet-500/15 text-violet-400' },
    { icon: Receipt, label: 'Explain the new tax regime for FY 2024-25', query: 'How does the new Indian tax regime work for FY 2024-25?', color: 'bg-amber-500/15 text-amber-400' },
    { icon: BarChart2, label: 'What are FII and DII flows saying about markets?', query: 'What are FII and DII flows saying about Indian markets?', color: 'bg-sky-500/15 text-sky-400' },
  ];

  const isEmpty = messages.length === 0 && !isLoading;

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="flex h-full" style={{ background: '#070913' }}>

      {/* ══════════ LEFT SIDEBAR ══════════ */}
      <aside className="hidden md:flex w-[260px] shrink-0 flex-col bg-[#090D1A] border-r border-white/[0.05] h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="size-7 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-display text-sm font-bold text-white tracking-tight">Money Mentor</span>
          </div>
          {/* New chat pencil */}
          <button
            onClick={newChat}
            title="New chat"
            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
          >
            <SquarePen className="size-4" />
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-2 pb-2 shrink-0">
          <button
            onClick={newChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
          >
            <Plus className="size-4 text-emerald-400" />
            New chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,185,129,0.08) transparent' }}>
          {conversations.length > 0 && (
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-1 mt-1">Recent</p>
          )}

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <MessageSquare className="size-6 text-zinc-700 mb-2" />
              <p className="text-xs text-zinc-600">No conversations yet</p>
            </div>
          ) : (
            conversations.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => selectConv(c.id)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm cursor-pointer transition-all mb-0.5 ${
                  activeConvId === c.id
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                  <MessageSquare className="size-3.5 shrink-0 opacity-60" />
                  <span className="truncate text-xs">{c.title || 'New Conversation'}</span>
                </div>
                <button
                  onClick={(e) => deleteConv(c.id, e)}
                  className="size-5 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center hover:text-red-400 shrink-0 ml-1"
                >
                  <Trash2 className="size-3" />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Status footer */}
        <div className="px-4 py-3 border-t border-white/[0.05] shrink-0 flex items-center gap-2">
          {checkingHealth ? (
            <Loader2 className="size-3 animate-spin text-zinc-600" />
          ) : backendOk ? (
            <span className="relative flex size-2"><span className="animate-ping absolute size-full rounded-full bg-emerald-400 opacity-40" /><span className="relative size-2 rounded-full bg-emerald-500" /></span>
          ) : (
            <WifiOff className="size-3 text-red-400" />
          )}
          <span className={`text-[11px] font-medium ${checkingHealth ? 'text-zinc-600' : backendOk ? 'text-emerald-400' : 'text-red-400'}`}>
            {checkingHealth ? 'Checking...' : backendOk ? 'Connected' : 'Backend offline'}
          </span>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="flex flex-1 flex-col min-w-0 relative overflow-hidden">

        {/* ── Top bar (mobile only new-chat, desktop minimal) ── */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-[#070913]">
          <span className="text-sm font-semibold text-zinc-300 md:hidden">Money Mentor</span>
          {/* Mobile: new chat */}
          <button onClick={newChat} className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <SquarePen className="size-4" />
          </button>
          {/* Desktop: just model label */}
          <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-white">
            Money Mentor
            <ChevronDown className="size-3.5 text-zinc-500" />
          </div>
          <div className="hidden md:block w-8" />
        </div>

        {/* ── Chat scroll area ── */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}
        >
          {isEmpty ? (
            /* ── EMPTY STATE ── */
            <div className="flex flex-col items-center justify-center min-h-full px-4 pb-6 pt-12">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col items-center text-center gap-6 w-full max-w-2xl"
              >
                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  What can I help with?
                </h1>

                {/* Suggestion grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-2">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                    >
                      <SuggestionCard {...s} onClick={send} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            /* ── MESSAGES ── */
            <div className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout" initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MessageRow message={msg} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator when waiting for first chunk */}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="py-5 px-4 sm:px-0">
                  <div className="max-w-3xl mx-auto flex gap-4">
                    <div className="size-7 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
                      <svg viewBox="0 0 41 41" className="size-4 text-black" fill="currentColor">
                        <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.505-2.833 10.079 10.079 0 0 0-9.612 6.929 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.504 2.833 10.079 10.079 0 0 0 9.617-6.234 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.497v4.998l-4.331 2.501-4.331-2.498V18Z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1 pt-0.5">
                      <span className="text-sm font-semibold text-white mb-1">Money Mentor</span>
                      <TypingDots />
                    </div>
                  </div>
                </div>
              )}
              {/* spacer so last message isn't hidden behind input */}
              <div className="h-6" />
            </div>
          )}
        </div>

        {/* Scroll-to-bottom button */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollToBottom()}
              className="absolute bottom-32 right-6 size-9 rounded-full bg-[#0F1A24] border border-emerald-500/20 shadow-lg shadow-emerald-900/20 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all z-10"
            >
              <ChevronDown className="size-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Error bar ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mx-auto w-full max-w-3xl px-4 pb-2"
            >
              <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {error}
                </div>
                <button onClick={() => setError(null)} className="font-semibold hover:text-red-300 transition-colors ml-3">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════ INPUT BAR — ChatGPT style ══════════ */}
        <div className="shrink-0 px-4 pb-4 pt-2 bg-[#070913]">
          <div className="mx-auto max-w-3xl">
            <div
              className={`relative flex items-end rounded-[18px] bg-[#0D1827] border transition-all duration-200 ${
                !backendOk && !checkingHealth ? 'border-red-500/30' : 'border-white/[0.08] focus-within:border-emerald-500/40 focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.1)]'
              }`}
            >
              <textarea
                ref={textareaRef}
                id="chatbot-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
                onKeyDown={onKey}
                placeholder={
                  checkingHealth ? 'Checking connection...'
                  : !backendOk ? 'Backend offline — please start the backend server'
                  : 'Message Money Mentor'
                }
                disabled={isLoading || !backendOk}
                rows={1}
                className="flex-1 min-h-[52px] max-h-[200px] resize-none bg-transparent border-0 focus:outline-none px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed leading-relaxed"
              />

              {/* Send button */}
              <div className="p-2 shrink-0">
                <motion.button
                  whileHover={input.trim() && backendOk && !isLoading ? { scale: 1.06 } : {}}
                  whileTap={input.trim() && backendOk && !isLoading ? { scale: 0.94 } : {}}
                  onClick={() => send()}
                  disabled={!input.trim() || isLoading || !backendOk}
                  id="chatbot-send-btn"
                  className={`size-9 rounded-lg flex items-center justify-center transition-all duration-150 ${
                    input.trim() && backendOk && !isLoading
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40'
                      : 'bg-white/[0.05] text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {isLoading
                    ? <Loader2 className="size-4 animate-spin" />
                    : <Send className="size-4 translate-x-[1px]" />
                  }
                </motion.button>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[11px] text-zinc-600 mt-2.5">
              Money Mentor can make mistakes. Not financial advice — always verify before investing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
