import { useAppStore } from '@/lib/store/useAppStore';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import hinglish from '@/locales/hinglish.json';

const translations = {
  en,
  hi,
  hinglish,
};

export function useTranslation() {
  // Read selected language from global Zustand store
  const { language } = useAppStore();

  const t = (key) => {
    // Select active dictionary, fallback to Hinglish
    const activeDict = translations[language] || translations['hinglish'] || {};
    
    // Support nested object keys (e.g. "nav.dashboard")
    const keys = key.split('.');
    let value = activeDict;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback level 1: English dictionary
        let fallbackVal = translations['en'];
        for (const fk of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fk in fallbackVal) {
            fallbackVal = fallbackVal[fk];
          } else {
            fallbackVal = null;
            break;
          }
        }
        if (fallbackVal !== null && fallbackVal !== undefined) return fallbackVal;
        
        // Fallback level 2: Hinglish dictionary
        let hinglishFallback = translations['hinglish'];
        for (const hk of keys) {
          if (hinglishFallback && typeof hinglishFallback === 'object' && hk in hinglishFallback) {
            hinglishFallback = hinglishFallback[hk];
          } else {
            hinglishFallback = null;
            break;
          }
        }
        if (hinglishFallback !== null && hinglishFallback !== undefined) return hinglishFallback;

        // Final fallback: return the key string
        return key;
      }
    }
    
    return value;
  };

  return { t, locale: language };
}
