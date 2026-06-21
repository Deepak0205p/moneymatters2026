"use client";

import { useCallback, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { SwipeCardViewer } from '@/components/shared/SwipeCardViewer';
import { getModuleById } from '@/data/modulesIndex';

/**
 * /dashboard/module/[id] — Dedicated page for module learning.
 * Renders the SwipeCardViewer as a full page (not an overlay).
 */
export default function ModulePage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = Number(params.id);
  const hydrated = useHydration();
  
  const {
    isAuthenticated,
    completedModules,
    completeModule,
    addCoins,
    logActivity
  } = useAppStore();

  const handleClose = useCallback(() => {
    router.push('/home');
  }, [router]);

  const handleComplete = useCallback(id => {
    if (!completedModules.includes(id)) {
      completeModule(id);
      addCoins(100);
    }
    router.push('/home');
  }, [completedModules, completeModule, addCoins, router]);

  const hasLogged = useRef(false);

  useEffect(() => {
    if (hydrated && isAuthenticated && moduleId && !isNaN(moduleId) && !hasLogged.current) {
      const moduleData = getModuleById(moduleId);
      if (moduleData) {
        logActivity('module_section', `Started Module: ${moduleData.title}`, 0);
        hasLogged.current = true;
      }
    }
  }, [hydrated, isAuthenticated, moduleId, logActivity]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  if (!moduleId || isNaN(moduleId)) {
    router.push('/home');
    return null;
  }

  return (
    <SwipeCardViewer
      moduleId={moduleId}
      onClose={handleClose}
      onComplete={handleComplete}
    />
  );
}