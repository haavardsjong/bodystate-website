import fs from 'fs/promises';
import path from 'path';

const PAGES_DIR = path.join(process.cwd(), 'src', 'pages');
const IGNORE_DIRS = ['api', 'ar', 'da', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'nb', 'pt', 'ru', 'sv', 'zh-CN', 'zh-TW'];
const OUTPUT_FILE = path.join(process.cwd(), 'extracted-content.json');

// Patterns to identify translatable content
const TEXT_PATTERNS = {
  // Text between HTML tags
  htmlText: />([^<]+)</g,
  // Astro expressions with text
  astroExpression: /\{[^}]*["'`]([^"'`]+)["'`][^}]*\}/g,
  // Heading and paragraph content
  headingContent: /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g,
  paragraphContent: /<p[^>]*>([^<]+)<\/p>/g,
  // Alt text and titles
  altText: /alt=["']([^"']+)["']/g,
  titleText: /title=["']([^"']+)["']/g,
  // Button and link text
  buttonText: /<button[^>]*>([^<]+)<\/button>/g,
  linkText: /<a[^>]*>([^<]+)<\/a>/g,
};

async function extractFromFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const relativePath = path.relative(PAGES_DIR, filePath);
  const pageName = path.basename(filePath, '.astro');
  
  const extracted = {
    file: relativePath,
    pageName,
    content: [],
    stats: {
      totalStrings: 0,
      words: 0
    }
  };

  // Extract using different patterns
  for (const [patternName, pattern] of Object.entries(TEXT_PATTERNS)) {
    const matches = [...content.matchAll(pattern)];
    for (const match of matches) {
      const text = match[1].trim();
      // Filter out empty strings, numbers, single characters, code snippets
      if (text && 
          text.length > 1 && 
          !/^\d+$/.test(text) && 
          !text.includes('{') && 
          !text.includes('<') &&
          !text.includes('/>') &&
          !text.startsWith('import ') &&
          !text.startsWith('const ') &&
          !text.includes('=')) {
        
        extracted.content.push({
          text,
          type: patternName,
          length: text.length,
          words: text.split(/\s+/).length
        });
        extracted.stats.totalStrings++;
        extracted.stats.words += text.split(/\s+/).length;
      }
    }
  }

  // Special handling for complex content blocks
  const faqPattern = /<details[^>]*>[\s\S]*?<summary>[\s\S]*?<h3>([^<]+)<\/h3>[\s\S]*?<\/summary>[\s\S]*?<div[^>]*>[\s\S]*?<p>([^<]+)<\/p>/g;
  const faqMatches = [...content.matchAll(faqPattern)];
  for (const match of faqMatches) {
    extracted.content.push({
      text: match[1].trim(),
      type: 'faqQuestion',
      length: match[1].trim().length
    });
    extracted.content.push({
      text: match[2].trim(),
      type: 'faqAnswer',
      length: match[2].trim().length
    });
  }

  return extracted;
}

async function findAstroFiles(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip language-specific directories
      if (!IGNORE_DIRS.includes(entry.name)) {
        await findAstroFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function generateTranslationStructure(extractedData) {
  const structure = {
    pages: {},
    components: {},
    common: {}
  };

  for (const fileData of extractedData) {
    const pageName = fileData.pageName;
    
    // Skip if no content found
    if (fileData.content.length === 0) continue;

    // Create page structure
    structure.pages[pageName] = {};
    
    // Group content by type
    const contentByType = {};
    for (const item of fileData.content) {
      if (!contentByType[item.type]) {
        contentByType[item.type] = [];
      }
      contentByType[item.type].push(item.text);
    }

    // Special handling for FAQ
    if (pageName === 'faq' && contentByType.faqQuestion) {
      structure.pages.faq = {
        title: "Frequently Asked Questions",
        sections: {
          userGuide: {
            title: "User Guide",
            items: contentByType.faqQuestion.map((q, i) => ({
              question: q,
              answer: contentByType.faqAnswer?.[i] || ""
            }))
          }
        }
      };
    } else {
      // Generic structure for other pages
      for (const [type, texts] of Object.entries(contentByType)) {
        structure.pages[pageName][type] = texts.length === 1 ? texts[0] : texts;
      }
    }
  }

  return structure;
}

async function main() {
  console.log('🔍 Scanning for Astro files...\n');
  
  const files = await findAstroFiles(PAGES_DIR);
  console.log(`Found ${files.length} Astro files to analyze\n`);

  const allExtracted = [];
  let totalStrings = 0;
  let totalWords = 0;

  for (const file of files) {
    const extracted = await extractFromFile(file);
    if (extracted.content.length > 0) {
      allExtracted.push(extracted);
      totalStrings += extracted.stats.totalStrings;
      totalWords += extracted.stats.words;
      console.log(`📄 ${extracted.file}: ${extracted.stats.totalStrings} strings (${extracted.stats.words} words)`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`Total translatable strings: ${totalStrings}`);
  console.log(`Total words: ${totalWords}`);
  console.log(`Estimated translation cost (GPT-4): $${(totalWords * 0.00003).toFixed(2)}\n`);

  // Generate suggested translation structure
  const suggestedStructure = await generateTranslationStructure(allExtracted);

  // Save results
  const output = {
    summary: {
      filesAnalyzed: files.length,
      totalStrings,
      totalWords,
      analyzedAt: new Date().toISOString()
    },
    files: allExtracted,
    suggestedStructure
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✅ Results saved to: ${OUTPUT_FILE}\n`);

  // Show pages that need migration
  console.log('🎯 Pages requiring translation migration:');
  for (const data of allExtracted) {
    if (data.stats.totalStrings > 10) {
      console.log(`   - ${data.pageName}: ${data.stats.totalStrings} strings`);
    }
  }
}

// Run the extraction
main().catch(console.error);