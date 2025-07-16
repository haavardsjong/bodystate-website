const fs = require('fs');
const path = require('path');

// Read the .env file
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const privateKey = process.env.APP_STORE_PRIVATE_KEY_P8;

if (!privateKey) {
  console.error('APP_STORE_PRIVATE_KEY_P8 not found in .env');
  process.exit(1);
}

// Convert newlines to literal \n
const netlifyKey = privateKey.replace(/\n/g, '\\n');

console.log('Copy this EXACT value to Netlify (including quotes):');
console.log('');
console.log(netlifyKey);
console.log('');
console.log('Instructions:');
console.log('1. Go to Netlify > Site settings > Environment variables');
console.log('2. Edit APP_STORE_PRIVATE_KEY_P8');
console.log('3. Paste the ENTIRE output above (one long line)');
console.log('4. Save');