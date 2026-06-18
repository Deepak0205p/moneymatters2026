"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { translateText } from '@/lib/utils/translateHelper';

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE',
  'INPUT', 'TEXTAREA', 'SVG', 'PATH', 'CIRCLE', 'LINE', 'TEXT'
]);

const BATCH_SIZE = 10;
const BATCH_DELAY = 80;

function requestIdleCallbackPolyfill(callback) {
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    return window.requestIdleCallback(callback, { timeout: 100 });
  }
  return setTimeout(() => callback({ timeRemaining: () => 50 }), 1);
}

function cancelIdleCallbackPolyfill(id) {
  if (typeof window !== 'undefined' && window.cancelIdleCallback) {
    return window.cancelIdleCallback(id);
  }
  return clearTimeout(id);
}

export function TranslationProvider({ children }) {
  const { language } = useAppStore();
  const observerRef = useRef(null);
  const originalTexts = useRef(new WeakMap());
  const translatedNodes = useRef(new WeakMap());
  const idleCallbackRef = useRef(null);
  const pendingNodesRef = useRef([]);
  const translatingRef = useRef(false);

  const translateNode = useCallback(async (node) => {
    const text = node.textContent;
    if (!text) return;

    const transMap = translatedNodes.current;
    if (transMap.get(node) === text) return;

    const trimmed = text.trim();
    if (!trimmed || !/[a-zA-Z\u0900-\u097F]/.test(trimmed)) return;

    const origMap = originalTexts.current;
    if (!origMap.has(node)) {
      origMap.set(node, text);
    }

    try {
      const translated = await translateText(trimmed, language);
      if (node.textContent === text) {
        const prefix = text.match(/^\s*/)[0];
        const suffix = text.match(/\s*$/)[0];
        const finalVal = prefix + translated + suffix;

        transMap.set(node, finalVal);

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
  }, [language]);

  const processBatch = useCallback(() => {
    if (pendingNodesRef.current.length === 0) {
      translatingRef.current = false;
      return;
    }

    const batch = pendingNodesRef.current.splice(0, BATCH_SIZE);
    translatingRef.current = true;

    Promise.all(batch.map(n => translateNode(n))).then(() => {
      if (pendingNodesRef.current.length > 0) {
        idleCallbackRef.current = requestIdleCallbackPolyfill(processBatch);
      } else {
        translatingRef.current = false;
      }
    });
  }, [translateNode]);

  useEffect(() => {
    const targetLang = language;
    const origMap = originalTexts.current;
    const transMap = translatedNodes.current;

    if (idleCallbackRef.current) {
      cancelIdleCallbackPolyfill(idleCallbackRef.current);
      idleCallbackRef.current = null;
    }
    pendingNodesRef.current = [];
    translatingRef.current = false;

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

      pendingNodesRef.current.push(...nodes);

      if (!translatingRef.current) {
        idleCallbackRef.current = requestIdleCallbackPolyfill(processBatch);
      }
    }

    translateTree(document.body);

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
      if (observerRef.current) observerRef.current.disconnect();
      if (idleCallbackRef.current) cancelIdleCallbackPolyfill(idleCallbackRef.current);
    };
  }, [language, translateNode, processBatch]);

  return children;
}
