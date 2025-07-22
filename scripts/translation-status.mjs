import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const LOCALES_DIR = path.join(process.cwd(), 'src', 'locales');
const STATUS_FILE = path.join(LOCALES_DIR, '_status.json');
const SOURCE_LANG = 'en';

// Language metadata
const LANGUAGES = {
  'en': { name: 'English', isSource: true },
  'es': { name: 'Spanish' },
  'da': { name: 'Danish' },
  'fr': { name: 'French' },
  'de': { name: 'German' },
  'it': { name: 'Italian' },
  'ja': { name: 'Japanese' },
  'ko': { name: 'Korean' },
  'nb': { name: 'Norwegian Bokmål' },
  'pt': { name: 'Portuguese' },
  'ru': { name: 'Russian' },
  'sv': { name: 'Swedish' },
  'zh-CN': { name: 'Simplified Chinese' },
  'zh-TW': { name: 'Traditional Chinese' }
};

/**
 * Get all translation keys from an object recursively
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip metadata keys
    if (key.startsWith('_')) continue;
    
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push({
        key: fullKey,
        value: value,
        hash: crypto.createHash('md5').update(JSON.stringify(value)).digest('hex').substring(0, 8)
      });
    }
  }
  
  return keys;
}

/**
 * Load translation file
 */
async function loadTranslations(lang) {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${lang}.json:`, error.message);
    return null;
  }
}

/**
 * Calculate coverage statistics
 */
function calculateCoverage(sourceKeys, targetKeys) {
  const sourceMap = new Map(sourceKeys.map(k => [k.key, k]));
  const targetMap = new Map(targetKeys.map(k => [k.key, k]));
  
  const missing = [];
  const outdated = [];
  const extra = [];
  let translated = 0;
  
  // Check source keys
  for (const sourceKey of sourceKeys) {
    const targetKey = targetMap.get(sourceKey.key);
    
    if (!targetKey) {
      missing.push(sourceKey.key);
    } else {
      translated++;
      // Check if content has changed (compare hashes)
      if (sourceKey.hash !== targetKey.hash && targetKey.value !== sourceKey.value) {
        // Additional check: if it's likely a translation (different from source)
        if (typeof sourceKey.value === 'string' && typeof targetKey.value === 'string') {
          // Skip if it appears to be translated (different from English)
          if (sourceKey.value.toLowerCase() !== targetKey.value.toLowerCase()) {
            continue;
          }
        }
        outdated.push({
          key: sourceKey.key,
          sourceValue: sourceKey.value,
          targetValue: targetKey.value
        });
      }
    }
  }
  
  // Check for extra keys in target
  for (const targetKey of targetKeys) {
    if (!sourceMap.has(targetKey.key)) {
      extra.push(targetKey.key);
    }
  }
  
  const total = sourceKeys.length;
  const coverage = total > 0 ? (translated / total * 100) : 0;
  
  return {
    total,
    translated,
    missing: missing.length,
    outdated: outdated.length,
    extra: extra.length,
    coverage: coverage.toFixed(2),
    details: {
      missingKeys: missing,
      outdatedKeys: outdated.map(o => o.key),
      extraKeys: extra
    }
  };
}

/**
 * Generate status report for all languages
 */
async function generateStatusReport() {
  console.log('📊 Generating Translation Status Report\n');
  console.log('=' .repeat(80));
  
  // Load source translations
  const sourceData = await loadTranslations(SOURCE_LANG);
  if (!sourceData) {
    console.error('Failed to load source language file');
    return;
  }
  
  const sourceKeys = getAllKeys(sourceData);
  console.log(`Source language (${LANGUAGES[SOURCE_LANG].name}): ${sourceKeys.length} keys\n`);
  
  const statusData = {
    generatedAt: new Date().toISOString(),
    sourceLanguage: SOURCE_LANG,
    totalKeys: sourceKeys.length,
    languages: {}
  };
  
  // Process each target language
  for (const [lang, langInfo] of Object.entries(LANGUAGES)) {
    if (lang === SOURCE_LANG) continue;
    
    const targetData = await loadTranslations(lang);
    if (!targetData) {
      statusData.languages[lang] = {
        name: langInfo.name,
        status: 'missing',
        coverage: 0
      };
      console.log(`❌ ${langInfo.name.padEnd(20)} - File missing`);
      continue;
    }
    
    const targetKeys = getAllKeys(targetData);
    const coverage = calculateCoverage(sourceKeys, targetKeys);
    
    statusData.languages[lang] = {
      name: langInfo.name,
      ...coverage,
      lastUpdated: new Date().toISOString()
    };
    
    // Console output
    const coverageBar = generateProgressBar(parseFloat(coverage.coverage));
    const status = coverage.coverage == 100 ? '✅' : coverage.coverage >= 80 ? '🟡' : '❌';
    
    console.log(`${status} ${langInfo.name.padEnd(20)} ${coverageBar} ${coverage.coverage}%`);
    if (coverage.missing > 0) {
      console.log(`   Missing: ${coverage.missing} keys`);
    }
    if (coverage.outdated > 0) {
      console.log(`   Outdated: ${coverage.outdated} keys`);
    }
    if (coverage.extra > 0) {
      console.log(`   Extra: ${coverage.extra} keys`);
    }
    console.log('');
  }
  
  // Save status file
  await fs.writeFile(STATUS_FILE, JSON.stringify(statusData, null, 2));
  console.log('=' .repeat(80));
  console.log(`\n✅ Status report saved to: ${STATUS_FILE}`);
  
  // Show languages needing attention
  const needsWork = Object.entries(statusData.languages)
    .filter(([_, data]) => data.coverage < 100)
    .sort((a, b) => a[1].coverage - b[1].coverage);
  
  if (needsWork.length > 0) {
    console.log('\n🎯 Languages needing translation work:');
    for (const [lang, data] of needsWork) {
      console.log(`   ${data.name} (${lang}): ${data.missing} missing, ${data.outdated} outdated`);
    }
  }
  
  return statusData;
}

/**
 * Generate a progress bar
 */
function generateProgressBar(percentage) {
  const width = 20;
  const filled = Math.round(width * percentage / 100);
  const empty = width - filled;
  return `[${'█'.repeat(filled)}${' '.repeat(empty)}]`;
}

/**
 * Check specific language status
 */
async function checkLanguageStatus(lang) {
  const sourceData = await loadTranslations(SOURCE_LANG);
  const targetData = await loadTranslations(lang);
  
  if (!sourceData || !targetData) {
    console.error('Failed to load translation files');
    return;
  }
  
  const sourceKeys = getAllKeys(sourceData);
  const targetKeys = getAllKeys(targetData);
  const coverage = calculateCoverage(sourceKeys, targetKeys);
  
  console.log(`\n📋 Detailed Status for ${LANGUAGES[lang].name} (${lang})`);
  console.log('=' .repeat(50));
  console.log(`Coverage: ${coverage.coverage}%`);
  console.log(`Total keys: ${coverage.total}`);
  console.log(`Translated: ${coverage.translated}`);
  console.log(`Missing: ${coverage.missing}`);
  console.log(`Outdated: ${coverage.outdated}`);
  console.log(`Extra: ${coverage.extra}`);
  
  if (coverage.details.missingKeys.length > 0) {
    console.log('\n❌ Missing Keys:');
    coverage.details.missingKeys.slice(0, 10).forEach(key => {
      console.log(`   - ${key}`);
    });
    if (coverage.details.missingKeys.length > 10) {
      console.log(`   ... and ${coverage.details.missingKeys.length - 10} more`);
    }
  }
  
  if (coverage.details.outdatedKeys.length > 0) {
    console.log('\n⚠️  Potentially Outdated Keys:');
    coverage.details.outdatedKeys.slice(0, 10).forEach(key => {
      console.log(`   - ${key}`);
    });
    if (coverage.details.outdatedKeys.length > 10) {
      console.log(`   ... and ${coverage.details.outdatedKeys.length - 10} more`);
    }
  }
}

// CLI handling
const args = process.argv.slice(2);
if (args.length > 0 && args[0] in LANGUAGES && args[0] !== SOURCE_LANG) {
  // Check specific language
  checkLanguageStatus(args[0]).catch(console.error);
} else {
  // Generate full report
  generateStatusReport().catch(console.error);
}