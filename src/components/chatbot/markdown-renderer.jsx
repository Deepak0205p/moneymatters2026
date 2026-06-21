"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";

function CodeBlock({ node, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !match && !String(children).includes('\n');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isInline && match) {
    return (
      <div className="relative group my-4 rounded-xl overflow-hidden border border-white/5 shadow-lg shadow-black/10">
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-white/5 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="size-2 rounded-full bg-red-500/80" />
              <div className="size-2 rounded-full bg-yellow-500/80" />
              <div className="size-2 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono">{match[1]}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          </motion.button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            background: "rgba(10,12,22,0.95)",
            padding: "1rem",
            fontSize: "0.875rem",
          }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white text-sm font-mono font-medium" {...props}>
      {children}
    </code>
  );
}

export function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none break-words leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-500/30 hover:decoration-blue-400/50 transition-colors"
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-4 w-full overflow-y-auto rounded-xl border border-white/5">
              <table className="w-full text-sm text-left border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border-b border-white/5 px-4 py-2.5 font-semibold text-zinc-400 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-white/5 px-4 py-2.5 align-top text-zinc-300" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-4 last:mb-0 text-zinc-200" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 mb-4 text-zinc-200" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-4 mb-4 text-zinc-200" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 italic text-zinc-400 bg-blue-500/5 py-2 rounded-r-lg my-4"
              {...props}
            />
          ),
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-6 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-zinc-400" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
