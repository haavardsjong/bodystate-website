import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const LOCALES_DIR = path.join(process.cwd(), 'src', 'locales');
const SOURCE_LOCALE = 'en';
const TARGET_LOCALES = [
  'es', 'da', 'fr', 'de', 'it', 'ja', 'ko', 
  'nb', 'pt', 'ru', 'zh-CN', 'sv', 'zh-TW'
];

// Define keys that should not be translated
const NON_TRANSLATABLE_KEYS = [
  'footer.brandName',
  'header.brandName'
  // Add other keys here if needed, e.g., 'footer.twitterLink' if you always want "Twitter"
];

// Simple check for placeholder patterns (add more specific patterns if needed)
const PLACEHOLDER_REGEX = /\{.*?\}/;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in the .env file.');
  process.exit(1);
}

// Mapping from locale code to full language name for the prompt
const languageNames = {
  es: 'Spanish',
  da: 'Danish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  nb: 'Norwegian Bokmål',
  pt: 'Portuguese',
  ru: 'Russian',
  'zh-CN': 'Simplified Chinese',
  sv: 'Swedish',
  'zh-TW': 'Traditional Chinese'
  // Add other languages here, e.g., fr: 'French'
};

async function getBatchTranslations(keysToTranslate, targetLang) {
  const fullLanguageName = languageNames[targetLang];
  if (!fullLanguageName) {
    throw new Error(`Unsupported target language: ${targetLang}`);
  }
  if (Object.keys(keysToTranslate).length === 0) {
    console.log('  -> No keys need translation in this batch.');
    return {};
  }

  const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  
  // Prepare the input for the API call
  const requestPayload = JSON.stringify(keysToTranslate, null, 2);

  console.log(` -> Calling OpenAI to translate ${Object.keys(keysToTranslate).length} keys to ${fullLanguageName}...`);

  const requestBody = {
    model: 'gpt-3.5-turbo', // Or a model known for good JSON output like gpt-4o if available
    messages: [
      {
        role: 'system',
        content: `You are a helpful translation assistant. You will be given a JSON object containing key-value pairs where values are English strings. Translate the English string values accurately to ${fullLanguageName}. Respond ONLY with a valid JSON object mapping the exact original keys to their corresponding translated strings. Ensure the output is a single JSON object and nothing else.`
      },
      {
        role: 'user',
        content: requestPayload
      }
    ],
    temperature: 0.2,
    max_tokens: 4000, // Increased max_tokens for potentially larger payloads
    response_format: { type: "json_object" } // Request JSON output if using compatible models
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    const responseContent = data.choices[0].message.content;
    
    // Attempt to parse the JSON string within the content
    let translatedKeys = JSON.parse(responseContent);
    console.log(`  -> Received and parsed batch translations for ${Object.keys(translatedKeys).length} keys.`);

    return translatedKeys;

  } catch (error) {
    console.error(`  -> OpenAI batch API call or JSON parsing failed for ${targetLang}:`, error);
    // Fallback: Return an empty object, indicating failure
    return {}; 
  }
}

async function processLocale(targetLocale) {
  console.log(`\nProcessing target locale: ${targetLocale}...`);
  
  const sourceFile = path.join(LOCALES_DIR, `${SOURCE_LOCALE}.json`);
  const targetFile = path.join(LOCALES_DIR, `${targetLocale}.json`);

  let sourceStrings = {};
  let targetStrings = {};

  try {
    sourceStrings = JSON.parse(await fs.readFile(sourceFile, 'utf-8'));
  } catch (error) {
    console.error(`Error reading source file ${sourceFile}:`, error);
    return;
  }

  try {
    targetStrings = JSON.parse(await fs.readFile(targetFile, 'utf-8'));
    console.log(`Loaded existing translations for ${targetLocale}.`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Target file ${targetFile} not found, starting fresh.`);
      targetStrings = {};
    } else {
      console.error(`Error reading target file ${targetFile}:`, error);
      return;
    }
  }

  let changesMade = false;
  const keysToTranslate = {};

  // Recursive function to collect keys needing translation
  function findMissingKeys(sourceObj, targetObj, keyPrefix = '') {
    for (const key in sourceObj) {
      if (Object.hasOwnProperty.call(sourceObj, key)) {
        const currentKey = keyPrefix ? `${keyPrefix}.${key}` : key;
        const sourceValue = sourceObj[key];

        if (NON_TRANSLATABLE_KEYS.includes(currentKey)) {
          // Ensure non-translatable keys exist and match the source
          if (targetObj[key] === undefined || targetObj[key] !== sourceValue) {
             targetObj[key] = sourceValue;
             changesMade = true;
          }
          continue; 
        }

        if (typeof sourceValue === 'object' && sourceValue !== null) {
          if (typeof targetObj[key] !== 'object' || targetObj[key] === null) {
            targetObj[key] = {}; 
            changesMade = true; // Structure change counts as a change
          }
          findMissingKeys(sourceValue, targetObj[key], currentKey);
        } else if (typeof sourceValue === 'string') {
          const targetValue = targetObj[key];
          // Needs translation if missing, empty, or identical to source (and not a placeholder)
          const needsTranslation = (targetValue === undefined || targetValue === '' || (targetValue === sourceValue && !PLACEHOLDER_REGEX.test(sourceValue)));
          
          if (needsTranslation) {
            // console.log(`Queueing key for translation: ${currentKey}`);
            keysToTranslate[currentKey] = sourceValue; // Add to batch
            changesMade = true; // Mark potential change
          } else if (targetValue === undefined && PLACEHOLDER_REGEX.test(sourceValue)) {
             // Copy placeholder if missing
             // console.log(`Copying missing placeholder: ${currentKey}`);
             targetObj[key] = sourceValue;
             changesMade = true;
          }
        } else {
          // Handle other types (number, boolean, null): copy if missing
          if (targetObj[key] === undefined) {
            targetObj[key] = sourceValue;
            changesMade = true;
          }
        }
      }
    }
  }

  // Find all keys that need translation first
  findMissingKeys(sourceStrings, targetStrings);

  // Perform batch translation if needed
  if (Object.keys(keysToTranslate).length > 0) {
    const batchTranslations = await getBatchTranslations(keysToTranslate, targetLocale);

    // Merge batch translations back into targetStrings
    for (const keyPath in batchTranslations) {
        if (Object.hasOwnProperty.call(batchTranslations, keyPath)) {
            const translation = batchTranslations[keyPath];
            const keys = keyPath.split('.');
            let currentLevel = targetStrings;
            for (let i = 0; i < keys.length - 1; i++) {
                currentLevel = currentLevel[keys[i]];
                if (!currentLevel) break; // Should not happen if findMissingKeys worked correctly
            }
            if (currentLevel) {
                console.log(`  -> Applying translation for: ${keyPath}`);
                currentLevel[keys[keys.length - 1]] = translation;
            }
        }
    }
  } else {
     console.log('No keys needed translation for this locale.');
  }


  // Write file only if changes were made (structure changes, non-translatables copied, or translations added)
  if (changesMade) {
    try {
      await fs.writeFile(targetFile, JSON.stringify(targetStrings, null, 2), 'utf-8');
      console.log(`Successfully updated ${targetFile}`);
    } catch (error) {
      console.error(`Error writing target file ${targetFile}:`, error);
    }
  } else {
    console.log(`No effective changes required for ${targetLocale}.`); // Changed message slightly
  }
}

async function main() {
  console.log('Starting translation process...');
  for (const locale of TARGET_LOCALES) {
    await processLocale(locale);
  }
  console.log('\nTranslation process finished.');
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
}); 