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

// Try the key formatting logic
try {
  let privateKey = privateKeyP8Content;
  privateKey = privateKey.replace(/\\n/g, '\n');
  
  if (!privateKey.includes('\n') || privateKey.split('\n').filter(line => line.trim()).length <= 3) {
    console.error('Key needs reformatting');
    let keyContent = privateKey
      .replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\s+/g, '');
    console.error('Key content length after cleanup:', keyContent.length);
    console.error('First 20 chars of content:', keyContent.substring(0, 20));
    
    // Apply the full formatting
    const keyLines = keyContent.match(/.{1,64}/g) || [];
    privateKey = `-----BEGIN PRIVATE KEY-----\n${keyLines.join('\n')}\n-----END PRIVATE KEY-----`;
    console.error('Reformed key lines:', privateKey.split('\n').length);
  } else {
    console.error('Key appears properly formatted');
  }
  
  // Try to sign with it
  const token = jwt.sign(
    { iss: process.env.APP_STORE_ISSUER_ID, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 900, aud: 'appstoreconnect-v1' },
    privateKey,
    { algorithm: 'ES256', header: { kid: process.env.APP_STORE_KEY_ID } }
  );
  console.error('JWT generation would succeed');
} catch (err) {
  console.error('JWT generation would fail:', err.message);
}

console.error('===================')

// Don't output anything to stdout so the build continues
process.exit(0);