const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
console.log(`Attempting to load .env file from: ${envPath}`);
require('dotenv').config({ path: envPath, debug: true }); // Load .env file, enable dotenv debug mode

const jwt = require('jsonwebtoken');
const fs = require('fs'); // Not strictly needed if private key content is from env var

console.log('---- Environment Variables As Seen by Script ----');
console.log(`APP_STORE_KEY_ID: ${process.env.APP_STORE_KEY_ID}`);
console.log(`APP_STORE_ISSUER_ID: ${process.env.APP_STORE_ISSUER_ID}`);
console.log(`APP_STORE_PRIVATE_KEY_P8 (first 30 chars): ${process.env.APP_STORE_PRIVATE_KEY_P8 ? process.env.APP_STORE_PRIVATE_KEY_P8.substring(0, 30) + '...' : undefined}`);
console.log(`APP_STORE_APP_ID: ${process.env.APP_STORE_APP_ID}`);
console.log('--------------------------------------------------');

// These MUST be set as environment variables in your Netlify build environment
// OR in your .env file for local testing
const keyId = process.env.APP_STORE_KEY_ID;
const issuerId = process.env.APP_STORE_ISSUER_ID;
// The content of the .p8 file, passed as an environment variable
const privateKeyP8Content = process.env.APP_STORE_PRIVATE_KEY_P8; 

if (!keyId || !issuerId || !privateKeyP8Content) {
  console.error("Missing critical API key generation credentials in environment variables for JWT generation. Please set APP_STORE_KEY_ID, APP_STORE_ISSUER_ID, and APP_STORE_PRIVATE_KEY_P8.");
  process.exit(1); // Exit with an error code
}

// Ensure the private key content has correctly formatted newlines if it was passed
// as a single line string with literal \\n characters.
const privateKey = privateKeyP8Content.replace(/\\\\n/g, '\n');

const now = Math.floor(Date.now() / 1000);
const expirationTime = now + (15 * 60); // Token valid for 15 minutes (max 20 minutes)

const payload = {
  iss: issuerId,
  iat: now, // Issued at time
  exp: expirationTime, // Expiration time
  aud: 'appstoreconnect-v1'
};

const options = {
  algorithm: 'ES256',
  header: {
    kid: keyId
  }
};

try {
  console.log('Attempting to sign JWT...');
  const token = jwt.sign(payload, privateKey, options);
  console.log('JWT signing successful.');
  process.stdout.write(token); // Output token directly to standard output
} catch (error) {
  console.error("Error generating JWT:", error);
  process.exit(1);
} 