import { marked } from 'marked';

// Import existing utilities
export * from './utils.js';

/**
 * Get a translation value using dot notation
 * @param {Object} translations - Translation object
 * @param {string} key - Dot notation key (e.g., 'pages.index.hero.title')
 * @param {Object} params - Parameters for placeholder replacement
 * @returns {string|Object} Translation value
 */
export function getTranslation(translations, key, params = {}) {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return key as fallback
    }
  }
  
  // Handle placeholder replacement
  if (typeof value === 'string' && params) {
    Object.entries(params).forEach(([param, val]) => {
      value = value.replace(new RegExp(`{${param}}`, 'g'), val);
    });
  }
  
  // Check if this is an object with numeric keys that should be an array
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const keys = Object.keys(value);
    const isNumericObject = keys.length > 0 && keys.every(k => /^\d+$/.test(k));
    
    if (isNumericObject) {
      // Convert to array
      const arr = [];
      keys.sort((a, b) => parseInt(a) - parseInt(b)).forEach(k => {
        arr[parseInt(k)] = value[k];
      });
      return arr;
    }
  }
  
  return value;
}

/**
 * Get rich content translation (supports markdown and HTML)
 * @param {Object} translations - Translation object
 * @param {string} key - Translation key
 * @param {Object} params - Parameters for placeholder replacement
 * @param {Object} options - Rendering options
 * @returns {string} Rendered HTML content
 */
export function getRichTranslation(translations, key, params = {}, options = {}) {
  const content = getTranslation(translations, key, params);
  
  if (typeof content !== 'string') {
    return content;
  }
  
  // Handle markdown content
  if (options.markdown || content.includes('\n') || content.includes('**') || content.includes('##')) {
    return marked(content, {
      breaks: true,
      gfm: true,
      ...options.markdownOptions
    });
  }
  
  // Handle styled placeholders (e.g., {charged} -> <span class="accent">charged</span>)
  if (options.styledPlaceholders) {
    Object.entries(options.styledPlaceholders).forEach(([placeholder, className]) => {
      const regex = new RegExp(`{(${placeholder})}`, 'g');
      content = content.replace(regex, `<span class="${className}">$1</span>`);
    });
  }
  
  return content;
}

/**
 * Get translation with fallback to default language
 * @param {Object} translations - Current language translations
 * @param {Object} defaultTranslations - Default language translations
 * @param {string} key - Translation key
 * @param {Object} params - Parameters
 * @returns {string|Object} Translation value
 */
export function getTranslationWithFallback(translations, defaultTranslations, key, params = {}) {
  const value = getTranslation(translations, key, params);
  
  // If translation is missing (key returned), try default language
  if (value === key && defaultTranslations) {
    return getTranslation(defaultTranslations, key, params);
  }
  
  return value;
}

/**
 * Check if a translation key exists
 * @param {Object} translations - Translation object
 * @param {string} key - Translation key
 * @returns {boolean} True if key exists
 */
export function hasTranslation(translations, key) {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }
  
  return true;
}

/**
 * Get all translation keys from an object recursively
 * @param {Object} obj - Translation object
 * @param {string} prefix - Key prefix
 * @returns {Array<string>} Array of all keys
 */
export function getAllTranslationKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllTranslationKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Compare two translation objects and find missing keys
 * @param {Object} source - Source translations (e.g., English)
 * @param {Object} target - Target translations
 * @returns {Object} Missing and outdated keys
 */
export function compareTranslations(source, target) {
  const sourceKeys = getAllTranslationKeys(source);
  const targetKeys = getAllTranslationKeys(target);
  
  const missing = sourceKeys.filter(key => !targetKeys.includes(key));
  const extra = targetKeys.filter(key => !sourceKeys.includes(key));
  
  return {
    missing,
    extra,
    coverage: ((sourceKeys.length - missing.length) / sourceKeys.length * 100).toFixed(2)
  };
}

/**
 * Create a translation helper for component use
 * @param {string} lang - Language code
 * @returns {Object} Translation helper functions
 */
export function createTranslationHelper(lang) {
  const translations = useTranslations(lang);
  const defaultTranslations = lang !== defaultLang ? useTranslations(defaultLang) : null;
  
  return {
    t: (key, params) => getTranslationWithFallback(translations, defaultTranslations, key, params),
    tRich: (key, params, options) => getRichTranslation(translations, key, params, options),
    has: (key) => hasTranslation(translations, key),
    raw: translations
  };
}

/**
 * Format a translation key for display (e.g., for development)
 * @param {string} key - Translation key
 * @returns {string} Formatted key
 */
export function formatTranslationKey(key) {
  return `[${key}]`;
}

// Re-export utils from original file
import { useTranslations, getLangFromUrl, defaultLang } from './utils.js';