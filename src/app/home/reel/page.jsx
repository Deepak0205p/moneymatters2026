'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Film,
  Volume2,
  VolumeX,
  PlusSquare,
  Sparkles,
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  X,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ReelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, addXP, addCoins, logActivity } = useAppStore();

  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const [videoMeta, setVideoMeta] = useState(null);

  // Load reels from backend API
  useEffect(() => {
    async function fetchReels() {
      try {
        const res = await fetch('/api/reels');
        if (res.ok) {
          const data = await res.json();
          setReels(data);
        }
      } catch (err) {
        console.error('Failed to load reels:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReels();
  }, []);

  // Sync active reel index with URL id parameter
  useEffect(() => {
    const reelIdParam = searchParams?.get('id') || searchParams?.get('reelId');
    if (reelIdParam && reels.length > 0) {
      const index = reels.findIndex(r => 
        String(r.id) === String(reelIdParam) || 
        String(r.videoId) === String(reelIdParam)
      );
      if (index !== -1 && index !== currentReelIndex) {
        setCurrentReelIndex(index);
      }
    }
  }, [searchParams, reels, currentReelIndex]);

  // Fetch YouTube video metadata dynamically when active reel changes
  useEffect(() => {
    if (!reels[currentReelIndex]) return;
    async function fetchOEmbed() {
      setVideoMeta(null);
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${reels[currentReelIndex].videoId}&format=json`);
        if (res.ok) {
          const data = await res.json();
          setVideoMeta({
            title: data.title || reels[currentReelIndex].title,
            description: `Watch this video by ${data.author_name || 'YouTube'}.`
          });
        }
      } catch (e) {
        console.error('Error fetching oEmbed metadata:', e);
      }
    }
    fetchOEmbed();
  }, [currentReelIndex, reels]);

  // Key navigation for reels
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (reels.length <= 1) return;
      if (e.key === 'ArrowDown') {
        nextReel();
      } else if (e.key === 'ArrowUp') {
        prevReel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reels.length, currentReelIndex]);

  const lastScrollTime = useRef(0);
  const handleWheel = (e) => {
    if (reels.length <= 1) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 800) return;

    if (e.deltaY > 30) {
      nextReel();
      lastScrollTime.current = now;
    } else if (e.deltaY < -30) {
      prevReel();
      lastScrollTime.current = now;
    }
  };

  const nextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
      setShowComments(false);
    }
  };

  const prevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
      setShowComments(false);
    }
  };

  // Interactions handlers
  const handleReelLike = (index) => {
    const newReels = [...reels];
    const isLiking = !newReels[index].hasLiked;
    newReels[index].hasLiked = isLiking;
    newReels[index].likes = isLiking ? newReels[index].likes + 1 : newReels[index].likes - 1;
    setReels(newReels);

    if (isLiking) {
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
      addXP(5);
      logActivity('general', `Reel liked: ${newReels[index].title}`, 0);
    }
  };

  const handleReelBookmark = (index) => {
    const newReels = [...reels];
    newReels[index].hasBookmarked = !newReels[index].hasBookmarked;
    setReels(newReels);
    addXP(5);
    logActivity('general', `${newReels[index].hasBookmarked ? 'Bookmarked' : 'Unbookmarked'} reel: ${newReels[index].title}`, 0);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newReels = [...reels];
    const newComment = {
      id: Date.now(),
      user: user?.displayName?.split(' ')[0] || "You",
      text: commentInput.trim()
    };
    newReels[currentReelIndex].comments.push(newComment);
    setReels(newReels);
    setCommentInput('');
    addXP(10);
    addCoins(2);
    logActivity('general', `Comment added on reel: ${newReels[currentReelIndex].title}`, 2);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center max-w-4xl mx-auto h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)]">
      {/* Smartphone Mockup Frame */}
      <div
        onWheel={handleWheel}
        className="relative w-full max-w-[340px] aspect-[9/16] bg-[#0c0f1d] border-4 border-zinc-800 rounded-[36px] shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-full z-30 flex items-center justify-center" />

        <div className="relative flex-1 bg-gradient-to-b from-[#131627] to-[#0A0C16] flex flex-col justify-between p-4 overflow-hidden pt-7">
          <div className="flex items-center justify-between text-zinc-400 z-20">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Reels</span>
            <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>

          {reels.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 z-20">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <PlusSquare size={24} className="animate-pulse" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">No Reels Yet</h4>
            </div>
          ) : (
            <>
              {reels[currentReelIndex]?.videoId && (
                <YoutubeReelPlayer
                  videoId={reels[currentReelIndex].videoId}
                  isMuted={isMuted}
                  autoScroll={autoScroll}
                  onVideoEnd={nextReel}
                />
              )}
              {reels[currentReelIndex]?.videoUrl && (
                <LocalReelPlayer
                  videoUrl={reels[currentReelIndex].videoUrl}
                  isMuted={isMuted}
                  autoScroll={autoScroll}
                  onVideoEnd={nextReel}
                />
              )}

              {/* Spacer container to allow clear video view */}
              <div className="flex-1 z-10" />

              {/* Heart Pop Animation */}
              <AnimatePresence>
                {showHeartPop && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.3, 0.9, 1.1, 1], opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 m-auto flex items-center justify-center pointer-events-none z-30"
                  >
                    <Heart size={80} fill="#EF4444" className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Column and Title metadata */}
              <div className="flex justify-between items-end z-20">
                <div className="flex-1 min-w-0 pr-4 text-left">
                  {videoMeta && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h4 className="text-sm font-extrabold text-white leading-tight flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <Sparkles size={14} className="text-amber-400 shrink-0" />
                        <span className="truncate">{videoMeta.title}</span>
                      </h4>
                      <p className="text-[11px] text-zinc-300 mt-1.5 leading-snug line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {videoMeta.description}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4 text-white">
                  <button onClick={() => handleReelLike(currentReelIndex)} className="flex flex-col items-center group">
                    <div className="h-9 w-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center">
                      <Heart size={16} fill={reels[currentReelIndex]?.hasLiked ? "#EF4444" : "none"} className={reels[currentReelIndex]?.hasLiked ? "text-red-500" : "text-white"} />
                    </div>
                    <span className="text-[9px] font-bold mt-1 text-zinc-400">{(reels[currentReelIndex]?.likes / 1000).toFixed(0)}k</span>
                  </button>

                  <button onClick={() => setShowComments(true)} className="flex flex-col items-center group">
                    <div className="h-9 w-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center">
                      <MessageSquare size={16} className="text-white" />
                    </div>
                    <span className="text-[9px] font-bold mt-1 text-zinc-400">{reels[currentReelIndex]?.comments.length}</span>
                  </button>

                  <button onClick={() => handleReelBookmark(currentReelIndex)} className="flex flex-col items-center group">
                    <div className="h-9 w-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center">
                      <Bookmark size={16} fill={reels[currentReelIndex]?.hasBookmarked ? "#F59E0B" : "none"} className={reels[currentReelIndex]?.hasBookmarked ? "text-amber-400" : "text-white"} />
                    </div>
                    <span className="text-[9px] font-bold mt-1 text-zinc-400">Save</span>
                  </button>

                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/home/reel?id=${reels[currentReelIndex]?.id}`;
                      navigator.clipboard.writeText(shareUrl);
                      logActivity('general', 'Reel link copied', 0);
                    }}
                    className="flex flex-col items-center group"
                  >
                    <div className="h-9 w-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center">
                      <Share2 size={16} className="text-white" />
                    </div>
                    <span className="text-[9px] font-bold mt-1 text-zinc-400">Share</span>
                  </button>
                </div>
              </div>

              {/* Comments drawer inside the mockup */}
              <AnimatePresence>
                {showComments && (
                  <motion.div
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    className="absolute inset-x-0 bottom-0 h-[70%] bg-[#0B0E1E] border-t border-white/[0.08] rounded-t-2xl z-30 flex flex-col p-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.05] mb-2.5">
                      <span className="text-xs font-black uppercase text-zinc-400">Comments</span>
                      <button onClick={() => setShowComments(false)} className="p-1 rounded-lg text-zinc-400 hover:bg-white/5">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-2 max-h-40 text-left">
                      {reels[currentReelIndex]?.comments.map(c => (
                        <div key={c.id} className="text-xs bg-white/[0.01] border border-white/[0.03] p-2 rounded-xl">
                          <span className="font-extrabold text-emerald-400 block mb-0.5">{c.user}</span>
                          <p className="text-zinc-200 leading-snug">{c.text}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddComment} className="flex gap-1.5 border-t border-white/[0.05] pt-2.5 bg-[#0B0E1E]">
                      <input
                        type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/40 text-white"
                      />
                      <button type="submit" className="p-2 rounded-xl bg-emerald-500 text-black flex items-center justify-center">
                        <Send size={12} />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function YoutubeReelPlayer({ videoId, isMuted, autoScroll, onVideoEnd }) {
  const containerId = `yt-player-${videoId}`;
  const playerRef = useRef(null);

  useEffect(() => {
    let player;

    const initPlayer = () => {
      player = new window.YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: isMuted ? 1 : 0,
          controls: 0,
          loop: autoScroll ? 0 : 1,
          playlist: autoScroll ? undefined : videoId,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (autoScroll) {
                onVideoEnd();
              }
            }
          }
        }
      });
      playerRef.current = player;
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = initPlayer;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        const checkLoaded = setInterval(() => {
          if (window.YT && window.YT.Player) {
            initPlayer();
            clearInterval(checkLoaded);
          }
        }, 100);
      }
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [videoId, autoScroll, onVideoEnd]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none rounded-[32px]">
      <div id={containerId} className="absolute top-1/2 left-1/2 w-[300%] h-[100%] -translate-x-1/2 -translate-y-1/2 aspect-[9/16] pointer-events-none scale-[1.35]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10 pointer-events-none" />
    </div>
  );
}

function LocalReelPlayer({ videoUrl, isMuted, autoScroll, onVideoEnd }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto rounded-[32px] flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover scale-[1.05]"
        autoPlay
        playsInline
        loop={!autoScroll}
        muted={isMuted}
        onEnded={() => {
          if (autoScroll) {
            onVideoEnd();
          }
        }}
        controls={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10 pointer-events-none" />
    </div>
  );
}
