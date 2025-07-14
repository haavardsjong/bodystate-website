// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en', 'es', 'da', 'fr', 'de', 'it', 'ja', 'ko', 
      'nb', 'pt', 'ru', 'zh-CN', 'sv', 'zh-TW'
    ], 
    routing: {
      prefixDefaultLocale: false, // URLs: / for en, /es/..., /da/... etc.
      // strategy: 'pathname' // This is the default, good for SEO
    }
  }
});
