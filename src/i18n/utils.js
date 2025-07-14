import enStrings from '../locales/en.json';
import esStrings from '../locales/es.json';
import daStrings from '../locales/da.json';
import frStrings from '../locales/fr.json';
import deStrings from '../locales/de.json';
import itStrings from '../locales/it.json';
import jaStrings from '../locales/ja.json';
import koStrings from '../locales/ko.json';
import nbStrings from '../locales/nb.json';
import ptStrings from '../locales/pt.json';
import ruStrings from '../locales/ru.json';
import zhCNStrings from '../locales/zh-CN.json';
import svStrings from '../locales/sv.json';
import zhTWStrings from '../locales/zh-TW.json';

export const languages = {
  en: enStrings,
  es: esStrings,
  da: daStrings,
  fr: frStrings,
  de: deStrings,
  it: itStrings,
  ja: jaStrings,
  ko: koStrings,
  nb: nbStrings,
  pt: ptStrings,
  ru: ruStrings,
  'zh-CN': zhCNStrings,
  sv: svStrings,
  'zh-TW': zhTWStrings,
};

export const defaultLang = 'en'; // Define default language

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  // Check if the extracted lang is a supported language
  if (lang in languages) return lang;
  // If no lang prefix or unsupported lang, assume default
  return defaultLang; 
}

// Function that returns the whole strings object for the given language
export function useTranslations(lang) {
  // If the lang is not supported, default to English
  return languages[lang] || languages[defaultLang]; 
} 