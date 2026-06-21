"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const LanguageContext = createContext();

export const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
];

const STORAGE_KEY = 'money-matters-language';

function setGoogleTranslateLang(langCode) {
  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    combo.value = langCode;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
}

export function LanguageProvider({ children }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);
  const widgetReady = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== 'en') {
      setSelectedLang(saved);
    }
    setIsLoaded(true);
  }, []);

  const changeLanguage = useCallback((langCode) => {
    setSelectedLang(langCode);
    localStorage.setItem(STORAGE_KEY, langCode);

    if (langCode === 'en') {
      // Clear cookies to restore original text
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      
      setGoogleTranslateLang('');
      document.body.classList.remove('translated-ltr', 'translated-rtl');
      const frame = document.querySelector('.goog-te-banner-frame');
      if (frame) frame.style.display = 'none';
      document.body.style.top = '0px';
      
      // Sometimes just selecting '' works, but for safety reload to strip all translation nodes
      setTimeout(() => {
         window.location.reload();
      }, 300);
      return;
    }

    const attempt = () => {
      if (setGoogleTranslateLang(langCode)) return;
      setTimeout(attempt, 500);
    };
    attempt();
  }, []);

  useEffect(() => {
    if (!isLoaded || widgetReady.current) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: INDIAN_LANGUAGES.map(l => l.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google-translate-element'
      );
      widgetReady.current = true;

      setTimeout(() => {
        const banner = document.querySelector('.goog-te-banner-frame');
        if (banner) banner.style.display = 'none';
        document.body.style.top = '0px';

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && saved !== 'en') {
          setTimeout(() => {
            const combo = document.querySelector('.goog-te-combo');
            if (combo) {
              combo.value = saved;
              combo.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, 800);
        }
      }, 1000);
    };

    const s1 = document.createElement('script');
    s1.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s1.async = true;
    document.body.appendChild(s1);

    return () => {
      widgetReady.current = false;
    };
  }, [isLoaded]);

  return (
    <LanguageContext.Provider value={{ selectedLang, changeLanguage, languages: INDIAN_LANGUAGES }}>
      <div id="google-translate-element" style={{ position: 'fixed', bottom: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { selectedLang: 'en', changeLanguage: () => {}, languages: INDIAN_LANGUAGES };
  }
  return context;
}
