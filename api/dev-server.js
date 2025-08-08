// Local development server for testing API endpoints
const express = require('express');
const cors = require('cors');
const githubCallback = require('./auth/github/callback');

const app = express();
const PORT = 5176;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.post('/api/auth/github/callback', async (req, res) => {
  // Set environment variables for local development
  process.env.GITHUB_CLIENT_ID = 'Ov23li8cKR03tDtZyuoS';
  process.env.GITHUB_CLIENT_SECRET = 'your-github-client-secret'; // You'll need to add this
  process.env.GITHUB_REDIRECT_URI = 'http://localhost:5176/auth/callback';
  
  return githubCallback(req, res);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📝 GitHub OAuth callback: http://localhost:${PORT}/api/auth/github/callback`);
});

module.exports = app;
