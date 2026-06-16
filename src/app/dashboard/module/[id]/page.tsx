"use client";

import { useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { SwipeCardViewer } from '@/components/shared/SwipeCardViewer';

/**
 * /dashboard/module/[id] — Dedicated page for module learning.
 * Renders the SwipeCardViewer as a full page (not an overlay).
 */
export default function ModulePage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = Number(params.id);
  const hydrated = useHydration();
  const { isAuthenticated, completedModules, completeModule, addCoins } = useAppStore();

  const handleClose = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const handleComplete = useCallback(
    (id: number) => {
      if (!completedModules.includes(id)) {
        completeModule(id);
        addCoins(100);
      }
      router.push('/dashboard');
    },
    [completedModules, completeModule, addCoins, router]
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="w-12 h-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  if (!moduleId || isNaN(moduleId)) {
    router.push('/dashboard');
    return null;
  }

  return (
    <SwipeCardViewer moduleId={moduleId} onClose={handleClose} onComplete={handleComplete} />
  );
}
