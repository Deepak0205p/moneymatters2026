"use client";

import { MotionConfig } from "framer-motion";

export function AnimationProvider({ children }) {
  return (
    <MotionConfig reducedMotion="always">
      {children}
    </MotionConfig>
  );
}
