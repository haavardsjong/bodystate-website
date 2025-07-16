// netlify/functions/getAppReviews.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file variables if running locally (netlify dev might do this, but good for direct testing)
// In deployed Netlify, process.env will be populated by Netlify UI + build command export
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '../../.env'); // Assuming .env is in project root, and function is in netlify/functions/
  // console.log(`[getAppReviews] Attempting to load .env from ${envPath} for local dev.`);
  dotenv.config({ path: envPath });
}

// Helper function to generate JWT - similar to your script
async function generateJWT() {
  const keyId = process.env.APP_STORE_KEY_ID;
  const issuerId = process.env.APP_STORE_ISSUER_ID;
  const privateKeyP8Content = process.env.APP_STORE_PRIVATE_KEY_P8;

  if (!keyId || !issuerId || !privateKeyP8Content) {
    console.error("[getAppReviews] JWT Generation Error: Missing Key ID, Issuer ID, or P8 Key Content in environment.");
    throw new Error("JWT generation credentials missing.");
  }
  // Ensure the private key has proper PEM format
  let privateKey = privateKeyP8Content;
  
  // First, handle escaped newlines (common in environment variables)
  privateKey = privateKey.replace(/\\n/g, '\n');
  
  // Check if it's still all on one line after replacing escaped newlines
  const lines = privateKey.split('\n').filter(line => line.trim());
  
  if (lines.length <= 3) { // Only header, content, and footer
    // Extract just the key content
    let keyContent = privateKey
      .replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\s+/g, ''); // Remove all whitespace
    
    // Add line breaks every 64 characters (PEM standard)
    const keyLines = keyContent.match(/.{1,64}/g) || [];
    privateKey = `-----BEGIN PRIVATE KEY-----\n${keyLines.join('\n')}\n-----END PRIVATE KEY-----`;
  }
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = now + (15 * 60);
  const payload = { iss: issuerId, iat: now, exp: expirationTime, aud: 'appstoreconnect-v1' };
  const options = { algorithm: 'ES256', header: { kid: keyId } };
  
  try {
    const token = jwt.sign(payload, privateKey, options);
    // console.log("[getAppReviews] JWT generated successfully for local dev/fallback.")
    return token;
  } catch (error) {
    console.error("[getAppReviews] Error during local JWT generation:", error);
    throw error;
  }
}

export async function handler(event, context) {
    // Get territory from query parameters, default to USA
    const params = event.queryStringParameters || {};
    const territory = params.territory || 'USA';
    console.log("[getAppReviews] Territory:", territory);
    
    let apiToken = process.env.APP_STORE_CONNECT_API_TOKEN_DYNAMIC;
    const appId = process.env.APP_STORE_APP_ID || '6479940325';

    console.log(`[getAppReviews] Initial API_TOKEN_DYNAMIC: ${apiToken ? 'Set' : 'Not Set'}`);

    if (!apiToken) {
        console.warn("[getAppReviews] APP_STORE_CONNECT_API_TOKEN_DYNAMIC not found. Attempting to generate JWT locally for dev/fallback.");
        try {
            apiToken = await generateJWT();
        } catch (jwtError) {
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate JWT for function.", details: jwtError.message }) };
        }
    }

    if (!appId) {
        console.error("[getAppReviews] APP_STORE_APP_ID is not set.");
        return { statusCode: 500, body: JSON.stringify({ error: "App ID not configured." }) };
    }

    // Fetch reviews with dynamic territory, sorted by date
    const APPLE_API_URL = `https://api.appstoreconnect.apple.com/v1/apps/${appId}/customerReviews?limit=50&sort=-createdDate&filter[territory]=${territory}&fields[customerReviews]=rating,title,body,reviewerNickname,createdDate,territory`;
    console.log(`[getAppReviews] Fetching reviews for App ID ${appId} from ${APPLE_API_URL}`);

    try {
        const response = await fetch(APPLE_API_URL, {
            headers: { 'Authorization': `Bearer ${apiToken}` }
        });
        const responseBodyText = await response.text();
        console.log(`[getAppReviews] Apple API Status: ${response.status}`);

        if (!response.ok) {
            console.error(`[getAppReviews] Apple API Error. Status: ${response.status}, Details: ${responseBodyText}`);
            return { statusCode: response.status, body: JSON.stringify({ error: "Failed to fetch from Apple.", details: responseBodyText }) };
        }
        const data = JSON.parse(responseBodyText);
        const reviewsToReturn = data.data || [];
        console.log(`[getAppReviews] Successfully fetched ${reviewsToReturn.length} reviews.`);
        return { statusCode: 200, body: JSON.stringify(reviewsToReturn) };
    } catch (error) {
        console.error('[getAppReviews] Error calling Apple API:', error);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal error fetching reviews.", details: error.message }) };
    }
} 