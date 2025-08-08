# 🚀 Deployment Guide - GRC Dashboard with GitHub OAuth

## 📋 Prerequisites

1. **GitHub Account** - For OAuth app setup
2. **Vercel Account** - For deployment
3. **GitHub Repository** - To push your code

## 🔧 Step 1: Complete GitHub OAuth Setup

### 1.1 Get GitHub Client Secret
1. Go to https://github.com/settings/developers
2. Click on your OAuth App (the one with Client ID: `Ov23li8cKR03tDtZyuoS`)
3. Click **"Generate a new client secret"**
4. Copy the **Client Secret** (you'll need this for Vercel)

### 1.2 Update GitHub OAuth App Settings
1. In your GitHub OAuth App settings, update:
   - **Authorization callback URL**: `https://your-new-project-name.vercel.app/auth/callback`
   - Replace `your-new-project-name` with your actual Vercel project name
   - **Note**: You can add multiple callback URLs for both local development and production

## 🚀 Step 2: Deploy to Vercel

### 2.1 Push Code to GitHub
```bash
git add .
git commit -m "Add real GitHub OAuth with Vercel backend"
git push origin main
```

### 2.2 Deploy to Vercel
1. Go to https://vercel.com
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.3 Set Environment Variables
In your Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `GITHUB_CLIENT_ID` | `Ov23li8cKR03tDtZyuoS` |
| `GITHUB_CLIENT_SECRET` | `bd106c8d3ae507a1f885ed51ff89f837ec66ae20` |

**Note**: The `GITHUB_REDIRECT_URI` is now handled dynamically and will be set automatically based on your Vercel domain.

### 2.4 API URLs (Automatic)
The API URLs are now handled dynamically and will automatically use your Vercel domain. No manual updates needed!

## 🧪 Step 3: Test Locally (Optional)

### 3.1 Set up Local Environment
Create a `.env.local` file in your project root:
```env
GITHUB_CLIENT_ID=Ov23li8cKR03tDtZyuoS
GITHUB_CLIENT_SECRET=bd106c8d3ae507a1f885ed51ff89f837ec66ae20
GITHUB_REDIRECT_URI=http://localhost:5176/auth/callback
```

### 3.2 Run Local Development
```bash
# Terminal 1: Start the API server
node api/dev-server.js

# Terminal 2: Start the frontend
npm run dev
```

## ✅ Step 4: Verify Deployment

1. **Visit your Vercel app**: `https://your-app-name.vercel.app`
2. **Click "Continue with GitHub"**
3. **Authorize the app** on GitHub
4. **You should be redirected** to the dashboard with your real GitHub profile!

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Make sure the callback URL in GitHub OAuth App matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"Client secret is required"**
   - Verify the `GITHUB_CLIENT_SECRET` environment variable is set in Vercel
   - Make sure there are no extra spaces or characters

3. **"Method not allowed"**
   - The API endpoint only accepts POST requests
   - Check that the frontend is sending a POST request

4. **"Failed to exchange authorization code"**
   - Verify your GitHub OAuth App settings
   - Check that the client ID and secret are correct

### Debug Steps:
1. Check Vercel function logs in the dashboard
2. Verify environment variables are set correctly
3. Test the API endpoint directly with Postman or curl

## 🎉 Success!

Once deployed, your app will have:
- ✅ Real GitHub OAuth authentication
- ✅ Serverless backend on Vercel
- ✅ Auto-deployment from GitHub
- ✅ Real user data from GitHub API
- ✅ Production-ready architecture

## 📝 Next Steps

1. **Add Database**: Consider adding a database to store user sessions
2. **JWT Tokens**: Implement proper JWT token generation
3. **User Management**: Add user profile management features
4. **Security**: Add rate limiting and additional security measures

---

**Need help?** Check the Vercel documentation or GitHub OAuth documentation for more details.
