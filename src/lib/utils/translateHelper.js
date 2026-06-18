/**
 * Translates a given text string dynamically using Google Translate API.
 * Uses localStorage to cache translations for speed and rate-limiting protection.
 * 
 * @param {string} text - The input text (can contain HTML tags)
 * @param {string} targetLang - The destination language code (e.g. 'hi', 'bn', 'ta', 'te')
 * @returns {Promise<string>} The translated text
 */
export async function translateText(text, targetLang) {
  if (!text || !targetLang || targetLang === 'hinglish') {
    return text;
  }

  // Check client-side cache
  const cacheKey = `tr_${targetLang}_${btoa(encodeURIComponent(text)).substring(0, 40)}`;
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Translation API request failed');
    
    const data = await response.json();
    // Google single translation API returns array of segments
    const translatedText = data[0].map(segment => segment[0]).join('');

    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, translatedText);
    }
    return translatedText;
  } catch (error) {
    console.error('Dynamic translation failed:', error);
    return text; // Fallback to original text on failure
  }
}

/**
 * Translates an entire object recursively.
 * Useful for translating educational module objects, quiz data, etc.
 * 
 * @param {object} obj - Object to translate
 * @param {string} targetLang - Target language code
 * @param {Array<string>} keysToTranslate - List of object keys that contain translatable text
 * @returns {Promise<object>} The translated object clone
 */
export async function translateObject(obj, targetLang, keysToTranslate = ['title', 'content', 'description', 'myth', 'truth', 'question', 'options']) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, targetLang, keysToTranslate)));
  }

  const translatedObj = { ...obj };

  for (const [key, value] of Object.entries(obj)) {
    if (keysToTranslate.includes(key) && typeof value === 'string') {
      // Use pre-defined English keys if targetLang is 'en'
      if (targetLang === 'en' && key === 'title' && obj.titleEn) {
        translatedObj[key] = obj.titleEn;
      } else if (targetLang === 'en' && key === 'title' && obj.titleEn === undefined && obj.title === 'Paise Ki Basic Samajh') {
        // Example fallback
        translatedObj[key] = 'Understanding Basics';
      } else {
        translatedObj[key] = await translateText(value, targetLang);
      }
    } else if (typeof value === 'object' && value !== null) {
      translatedObj[key] = await translateObject(value, targetLang, keysToTranslate);
    }
  }

  return translatedObj;
}
