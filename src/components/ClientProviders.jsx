"use client";

import { LanguageProvider } from '@/components/LanguageProvider';
import { Toaster } from "@/components/ui/toaster";

export default function ClientProviders({ children }) {
  return (
    <LanguageProvider>
      {children}
      <Toaster />
    </LanguageProvider>
  );
}
