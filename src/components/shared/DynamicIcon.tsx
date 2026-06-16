'use client';

import * as LucideIcons from 'lucide-react';
import { BookOpen, Construction } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  fallback?: 'book' | 'construction';
}

const FALLBACK_ICONS = {
  book: BookOpen,
  construction: Construction,
} as const;

export default function DynamicIcon({ name, size = 24, className, style, fallback = 'book' }: DynamicIconProps) {
  const IconEntry = (LucideIcons as Record<string, React.ElementType>)[name];
  const FallbackIcon = FALLBACK_ICONS[fallback];

  if (!IconEntry) {
    return <FallbackIcon size={size} className={className} style={style} />;
  }

  return <IconEntry size={size} className={className} style={style} />;
}
