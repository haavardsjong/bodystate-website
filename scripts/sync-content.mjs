#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to parse FAQ markdown into structured JSON
function parseFAQMarkdown(content) {
  const lines = content.split('\n');
  const faqData = {
    pageTitle: "Frequently Asked Questions",
    heading: "Frequently Asked Questions",
    sections: {}
  };

  let currentSection = null;
  let currentQuestion = null;
  let currentAnswerParts = [];
  let inQuestion = false;
  let paragraphCount = 0;
  let listItems = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines unless we're in a question
    if (!line && !inQuestion) continue;

    // Section headers (## Level)
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      // Save previous question if any
      if (currentQuestion && currentSection) {
        const questionKey = currentQuestion.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, '');
        faqData.sections[currentSection].questions[questionKey] = {
          question: currentQuestion.replace(/\?$/, ''),
          answer: processAnswer(currentAnswerParts)
        };
      }
      
      const sectionTitle = line.substring(3);
      const sectionKey = sectionTitle.toLowerCase().replace(/\s+/g, '');
      currentSection = sectionKey;
      faqData.sections[sectionKey] = {
        title: sectionTitle,
        questions: {}
      };
      currentQuestion = null;
      currentAnswerParts = [];
      inQuestion = false;
    }
    // Question headers (### Level)
    else if (line.startsWith('### ')) {
      // Save previous question if any
      if (currentQuestion && currentSection) {
        const questionKey = currentQuestion.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, '');
        faqData.sections[currentSection].questions[questionKey] = {
          question: currentQuestion.replace(/\?$/, ''),
          answer: processAnswer(currentAnswerParts)
        };
      }
      
      currentQuestion = line.substring(4);
      currentAnswerParts = [];
      inQuestion = true;
      paragraphCount = 0;
      listItems = [];
      inList = false;
    }
    // Answer content
    else if (inQuestion && line) {
      // Handle lists
      if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
        inList = true;
        listItems.push(line.replace(/^(-|\d+\.)\s/, ''));
      }
      // Handle subheadings in answers
      else if (line.startsWith('#### ')) {
        if (listItems.length > 0) {
          currentAnswerParts.push({ type: 'list', items: [...listItems] });
          listItems = [];
          inList = false;
        }
        currentAnswerParts.push({ type: 'h4', text: line.substring(5) });
      }
      // Regular paragraphs
      else if (!inList) {
        if (listItems.length > 0) {
          currentAnswerParts.push({ type: 'list', items: [...listItems] });
          listItems = [];
          inList = false;
        }
        currentAnswerParts.push({ type: 'paragraph', text: line });
      }
    }
  }

  // Save the last question
  if (currentQuestion && currentSection) {
    const questionKey = currentQuestion.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, '');
    faqData.sections[currentSection].questions[questionKey] = {
      question: currentQuestion.replace(/\?$/, ''),
      answer: processAnswer(currentAnswerParts)
    };
  }

  return faqData;
}

// Process answer parts into the expected format
function processAnswer(parts) {
  const answer = {};
  let pCount = 1;
  let hasSteps = false;

  for (const part of parts) {
    if (part.type === 'paragraph') {
      answer[`p${pCount}`] = part.text;
      pCount++;
    } else if (part.type === 'h4') {
      answer.h4 = part.text;
    } else if (part.type === 'list') {
      // Check if it's a numbered list (steps)
      if (!answer.list && !hasSteps) {
        // First list is regular list
        answer.list = part.items;
      } else {
        // Subsequent lists or numbered lists are steps
        answer.steps = part.items;
        hasSteps = true;
      }
    }
  }

  return answer;
}

// Function to parse Privacy Policy markdown
function parsePrivacyMarkdown(content) {
  const lines = content.split('\n');
  const privacyData = {
    pageTitle: "Privacy Policy"
  };

  let h1Count = 0, h2Count = 0, pCount = 0, liCount = 0;
  let currentListNumber = 0;
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      if (inList) {
        currentListNumber++;
        inList = false;
      }
      continue;
    }

    // H1 headers
    if (trimmed.startsWith('# ')) {
      h1Count++;
      privacyData[`h1_${h1Count}`] = trimmed.substring(2);
    }
    // H2 headers
    else if (trimmed.startsWith('## ')) {
      h2Count++;
      privacyData[`h2_${h2Count}`] = trimmed.substring(3);
    }
    // H3 headers
    else if (trimmed.startsWith('### ')) {
      const h3Count = Object.keys(privacyData).filter(k => k.startsWith('h3_')).length + 1;
      privacyData[`h3_${h3Count}`] = trimmed.substring(4);
    }
    // List items
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        currentListNumber++;
        liCount = 0;
        inList = true;
      }
      liCount++;
      privacyData[`li${currentListNumber}_${liCount}`] = trimmed.substring(2);
    }
    // Paragraphs
    else if (!trimmed.startsWith('---') && !trimmed.startsWith('*Last updated') && !trimmed.startsWith('*Effective')) {
      pCount++;
      privacyData[`p${pCount}_${Math.ceil(pCount / 10)}`] = trimmed;
    }
  }

  return privacyData;
}

// Main sync function
async function syncContent() {
  try {
    const contentDir = path.join(__dirname, '..', 'content');
    const localesDir = path.join(__dirname, '..', 'src', 'locales');
    
    // Read current en.json
    const enJsonPath = path.join(localesDir, 'en.json');
    const currentData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
    
    // Process FAQ
    const faqPath = path.join(contentDir, 'faq.md');
    if (fs.existsSync(faqPath)) {
      const faqContent = fs.readFileSync(faqPath, 'utf8');
      const faqData = parseFAQMarkdown(faqContent);
      currentData.pages.faq = faqData;
      console.log('✓ FAQ content synced');
    }
    
    // Process Privacy Policy
    const privacyPath = path.join(contentDir, 'privacy-policy.md');
    if (fs.existsSync(privacyPath)) {
      const privacyContent = fs.readFileSync(privacyPath, 'utf8');
      const privacyData = parsePrivacyMarkdown(privacyContent);
      currentData.privacyPolicy = privacyData;
      console.log('✓ Privacy Policy content synced');
    }
    
    // Write back to en.json
    fs.writeFileSync(enJsonPath, JSON.stringify(currentData, null, 2));
    console.log('✓ Updated en.json');
    
    // Optionally trigger translation
    console.log('\nTo translate to other languages, run: npm run translate');
    
  } catch (error) {
    console.error('Error syncing content:', error);
    process.exit(1);
  }
}

// Run the sync
syncContent();