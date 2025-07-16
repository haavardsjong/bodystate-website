const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath, silent: true }); // Load .env file silently

const jwt = require('jsonwebtoken');

// Function to generate JWT
function generateJWT() {
  const keyId = process.env.APP_STORE_KEY_ID;
  const issuerId = process.env.APP_STORE_ISSUER_ID;
  const privateKeyP8Content = process.env.APP_STORE_PRIVATE_KEY_P8; 

  if (!keyId || !issuerId || !privateKeyP8Content) {
    throw new Error("Missing critical API key generation credentials");
  }

  // Ensure the private key has proper PEM format
  let privateKey = privateKeyP8Content;
  
  // First, handle escaped newlines (common in environment variables)
  privateKey = privateKey.replace(/\\n/g, '\n');
  
  // Check if the key needs formatting (Netlify strips newlines)
  if (!privateKey.includes('\n') || privateKey.split('\n').filter(line => line.trim()).length <= 3) {
    // Extract just the key content, removing headers/footers and all whitespace
    let keyContent = privateKey
      .replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\s+/g, ''); // Remove all whitespace
    
    // Add line breaks every 64 characters (PEM standard)
    const keyLines = keyContent.match(/.{1,64}/g) || [];
    privateKey = `-----BEGIN PRIVATE KEY-----\n${keyLines.join('\n')}\n-----END PRIVATE KEY-----`;
  }

  const now = Math.floor(Date.now() / 1000);
  const expirationTime = now + (15 * 60); // Token valid for 15 minutes

  const payload = {
    iss: issuerId,
    iat: now,
    exp: expirationTime,
    aud: 'appstoreconnect-v1'
  };

  const options = {
    algorithm: 'ES256',
    header: {
      kid: keyId
    }
  };

  return jwt.sign(payload, privateKey, options);
}

// When run directly, output only the token
if (require.main === module) {
  try {
    const token = generateJWT();
    process.stdout.write(token); // Output ONLY the token
  } catch (error) {
    process.stderr.write("Error: " + error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = { generateJWT };