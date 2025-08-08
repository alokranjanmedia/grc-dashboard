// Vercel serverless function to handle GitHub OAuth callback
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    console.log('Processing GitHub OAuth callback with code:', code);

    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.NODE_ENV === 'production' 
          ? `${req.headers.origin}/auth/callback`
          : process.env.GITHUB_REDIRECT_URI || 'http://localhost:5176/auth/callback',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub token exchange error:', tokenData);
      return res.status(400).json({ error: 'Failed to exchange authorization code' });
    }

    const accessToken = tokenData.access_token;

    // Get user information from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    if (userResponse.status !== 200) {
      console.error('GitHub user API error:', userData);
      return res.status(400).json({ error: 'Failed to fetch user information' });
    }

    // Get user email
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const emailData = await emailResponse.json();
    const primaryEmail = emailData.find(email => email.primary)?.email || userData.email;

    // Create user object
    const user = {
      id: userData.id,
      username: userData.login,
      email: primaryEmail,
      name: userData.name || userData.login,
      avatar: userData.avatar_url,
      githubUrl: userData.html_url,
      company: userData.company,
      location: userData.location,
      bio: userData.bio,
    };

    // In a real application, you would:
    // 1. Store the user in your database
    // 2. Create a JWT token or session
    // 3. Return the token to the client

    // For this demo, we'll create a simple token
    const token = `github-${userData.id}-${Date.now()}`;

    console.log('GitHub OAuth successful for user:', user.username);

    // Return success response
    return res.status(200).json({
      success: true,
      user: user,
      token: token,
      accessToken: accessToken, // In production, don't return this to client
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
