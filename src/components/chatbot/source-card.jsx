"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function SourceCard({ url }) {
  let domain = "";
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname.replace("www.", "");
  } catch (e) {
    domain = url;
  }

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      title={url}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 hover:border-blue-500/30 transition-all shadow-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={faviconUrl} alt="" className="w-3.5 h-3.5 rounded-sm" />
      <span className="text-xs font-medium text-zinc-400 truncate max-w-[100px]">
        {domain}
      </span>
      <ExternalLink className="size-3 text-zinc-500" />
    </motion.a>
  );
}
