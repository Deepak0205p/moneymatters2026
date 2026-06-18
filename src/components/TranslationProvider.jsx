"use client";

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { translateText } from '@/lib/utils/translateHelper';

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE', 
  'INPUT', 'TEXTAREA', 'SVG', 'PATH', 'CIRCLE', 'LINE', 'TEXT'
]);

export function TranslationProvider({ children }) {
  const { language } = useAppStore();
  const observerRef = useRef(null);
  const originalTexts = useRef(new WeakMap());
  const translatedNodes = useRef(new WeakMap());

  useEffect(() => {
    const targetLang = language;
    const origMap = originalTexts.current;
    const transMap = translatedNodes.current;

    // Restore any previously translated nodes to original texts first
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    const restoreWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let restoreNode;
    while (restoreNode = restoreWalker.nextNode()) {
      if (origMap.has(restoreNode)) {
        restoreNode.textContent = origMap.get(restoreNode);
        transMap.delete(restoreNode);
      }
    }

    if (targetLang === 'hinglish') {
      return;
    }

    // Helper to translate a single text node
    async function translateNode(node) {
      const text = node.textContent;
      if (!text) return;

      // If already translated to the desired value, skip
      if (transMap.get(node) === text) {
        return;
      }

      const trimmed = text.trim();
      // Only translate if contains letters (English or Devanagari/etc.)
      if (!trimmed || !/[a-zA-Z\u0900-\u097F]/.test(trimmed)) {
        return;
      }

      // Save original text if not saved yet
      if (!origMap.has(node)) {
        origMap.set(node, text);
      }

      try {
        const translated = await translateText(trimmed, targetLang);
        if (node.textContent === text) {
          const prefix = text.match(/^\s*/)[0];
          const suffix = text.match(/\s*$/)[0];
          const finalVal = prefix + translated + suffix;

          transMap.set(node, finalVal);

          // Temporarily disconnect observer to prevent infinite loops
          if (observerRef.current) observerRef.current.disconnect();
          node.textContent = finalVal;
          if (observerRef.current) {
            observerRef.current.observe(document.body, {
              childList: true,
              subtree: true,
              characterData: true
            });
          }
        }
      } catch (err) {
        console.error('Translation error for node:', err);
      }
    }

    // Helper to walk DOM and translate
    function translateTree(root) {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentNode;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
            if (parent.closest('[data-no-translate]') || parent.closest('.no-translate')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      const nodes = [];
      let node;
      while (node = walker.nextNode()) {
        nodes.push(node);
      }
      
      // Process nodes
      nodes.forEach(n => translateNode(n));
    }



    // Initial translation of the whole body
    translateTree(document.body);

    // Setup MutationObserver to watch for additions/changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const parent = node.parentNode;
              if (parent && !SKIP_TAGS.has(parent.tagName) && !parent.closest('[data-no-translate]') && !parent.closest('.no-translate')) {
                translateNode(node);
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              if (!SKIP_TAGS.has(node.tagName) && !node.closest('[data-no-translate]') && !node.closest('.no-translate')) {
                translateTree(node);
              }
            }
          });
        } else if (mutation.type === 'characterData') {
          const node = mutation.target;
          const parent = node.parentNode;
          if (parent && !SKIP_TAGS.has(parent.tagName) && !parent.closest('[data-no-translate]') && !parent.closest('.no-translate')) {
            translateNode(node);
          }
        }
      });
    });

    observerRef.current = observer;
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return children;
}
