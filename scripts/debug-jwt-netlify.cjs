const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath, silent: true });

const jwt = require('jsonwebtoken');

console.error('=== JWT Debug Info ===');
console.error('APP_STORE_KEY_ID:', process.env.APP_STORE_KEY_ID ? 'Set' : 'Missing');
console.error('APP_STORE_ISSUER_ID:', process.env.APP_STORE_ISSUER_ID ? 'Set' : 'Missing');

const privateKeyP8Content = process.env.APP_STORE_PRIVATE_KEY_P8;
if (!privateKeyP8Content) {
  console.error('APP_STORE_PRIVATE_KEY_P8: Missing');
  process.exit(1);
}

console.error('APP_STORE_PRIVATE_KEY_P8: Set');
console.error('Key length:', privateKeyP8Content.length);
console.error('First 50 chars:', privateKeyP8Content.substring(0, 50));
console.error('Last 50 chars:', privateKeyP8Content.substring(privateKeyP8Content.length - 50));
console.error('Contains BEGIN:', privateKeyP8Content.includes('BEGIN'));
console.error('Contains END:', privateKeyP8Content.includes('END'));
console.error('Contains newlines:', privateKeyP8Content.includes('\n'));
console.error('Contains escaped newlines:', privateKeyP8Content.includes('\\n'));
console.error('===================');

// Don't output anything to stdout so the build continues
process.exit(0);