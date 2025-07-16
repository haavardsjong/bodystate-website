export async function handler(event, context) {
    const keyId = process.env.APP_STORE_KEY_ID;
    const issuerId = process.env.APP_STORE_ISSUER_ID;
    const privateKeyP8Content = process.env.APP_STORE_PRIVATE_KEY_P8;
    
    const debugInfo = {
        keyId: keyId ? 'Set' : 'Missing',
        issuerId: issuerId ? 'Set' : 'Missing',
        privateKey: privateKeyP8Content ? 'Set' : 'Missing',
        privateKeyLength: privateKeyP8Content ? privateKeyP8Content.length : 0,
        privateKeyFirstChars: privateKeyP8Content ? privateKeyP8Content.substring(0, 50) + '...' : 'N/A',
        hasBeginMarker: privateKeyP8Content ? privateKeyP8Content.includes('-----BEGIN') : false,
        hasEndMarker: privateKeyP8Content ? privateKeyP8Content.includes('-----END') : false,
        hasNewlines: privateKeyP8Content ? privateKeyP8Content.includes('\n') : false,
        hasEscapedNewlines: privateKeyP8Content ? privateKeyP8Content.includes('\\n') : false
    };
    
    return {
        statusCode: 200,
        body: JSON.stringify(debugInfo, null, 2)
    };
}