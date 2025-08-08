// Test endpoint to verify environment variables
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      hasClientId: !!process.env.GITHUB_CLIENT_ID,
      hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GITHUB_REDIRECT_URI,
      nodeEnv: process.env.NODE_ENV,
      clientIdLength: process.env.GITHUB_CLIENT_ID ? process.env.GITHUB_CLIENT_ID.length : 0,
      clientSecretLength: process.env.GITHUB_CLIENT_SECRET ? process.env.GITHUB_CLIENT_SECRET.length : 0,
    };

    console.log('Environment check:', envCheck);

    return res.status(200).json({
      success: true,
      message: 'Environment variables check',
      envCheck: envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
