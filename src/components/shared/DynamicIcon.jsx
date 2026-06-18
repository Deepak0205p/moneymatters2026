'use client';

import * as LucideIcons from 'lucide-react';
import { BookOpen, Construction } from 'lucide-react';
import { jsx as _jsx } from "react/jsx-runtime";
const FALLBACK_ICONS = {
  book: BookOpen,
  construction: Construction
};
export default function DynamicIcon({
  name,
  size = 24,
  className,
  style,
  fallback = 'book'
}) {
  const IconEntry = LucideIcons[name];
  const FallbackIcon = FALLBACK_ICONS[fallback];
  if (!IconEntry) {
    return /*#__PURE__*/_jsx(FallbackIcon, {
      size: size,
      className: className,
      style: style
    });
  }
  return /*#__PURE__*/_jsx(IconEntry, {
    size: size,
    className: className,
    style: style
  });
}