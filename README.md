# 🚀 GRC Dashboard

A modern Governance, Risk, and Compliance (GRC) dashboard built with React, Tailwind CSS, and GitHub OAuth authentication. Upload and analyze Excel files with a beautiful, responsive interface.

<!-- Deployment test - Triggering new deployment with environment variables -->

## ✨ Features

- 🔐 **GitHub OAuth Authentication** - Secure login with your GitHub account
- 📤 **Excel File Upload** - Drag & drop Excel files (.xlsx, .xls, .xlsm)
- 📊 **Data Parsing & Display** - View parsed data in a clean table format
- 🎨 **Modern UI/UX** - Beautiful interface built with Tailwind CSS
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 🚀 **Vercel Ready** - Deploy instantly with serverless functions

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Authentication**: GitHub OAuth
- **File Processing**: SheetJS (xlsx)
- **Deployment**: Vercel (Serverless Functions)
- **Routing**: React Router DOM

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- GitHub account (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alokranjanmedia/grc-dashboard.git
   cd grc-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5176`

## 🔧 Configuration

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App with these settings:
   - **Application name**: GRC Dashboard
   - **Homepage URL**: `http://localhost:5176`
   - **Authorization callback URL**: `http://localhost:5176/auth/callback`

3. Copy your Client ID and update `src/services/api.js`

### Environment Variables

Create a `.env.local` file in the project root:

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:5176/auth/callback
```

## 📁 Project Structure

```
grc-dashboard/
├── api/                          # Vercel serverless functions
│   ├── auth/github/callback.js   # GitHub OAuth handler
│   └── dev-server.js            # Local development server
├── src/
│   ├── components/              # Reusable components
│   │   └── UploadControls.jsx   # Excel upload component
│   ├── pages/                   # Page components
│   │   ├── Login.jsx           # Authentication page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   └── AuthCallback.jsx    # OAuth callback handler
│   ├── services/               # API services
│   │   └── api.js             # Authentication & data services
│   ├── utils/                  # Utility functions
│   │   └── parser.js          # Excel file parser
│   └── App.jsx                # Main application component
├── vercel.json                 # Vercel configuration
└── DEPLOYMENT.md              # Deployment guide
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables
   - Deploy!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📊 Usage

### 1. Authentication
- Click "Continue with GitHub" to authenticate
- Or use demo credentials: `demo` / `demo`

### 2. Upload Excel Files
- Drag & drop Excel files or click "Choose File"
- Supported formats: `.xlsx`, `.xls`, `.xlsm`
- Maximum file size: 10MB

### 3. View Data
- Parsed data is displayed in a table format
- View file statistics and summaries
- Download sample Excel templates

## 🔍 Troubleshooting

### Common Issues

1. **GitHub OAuth not working**
   - Verify your OAuth App settings
   - Check callback URLs match exactly
   - Ensure environment variables are set

2. **File upload errors**
   - Check file format (must be Excel)
   - Verify file size (max 10MB)
   - Ensure file has valid data

3. **Build errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [SheetJS](https://sheetjs.com/) - Excel processing
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

If you have any questions or need help:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions
2. Open an [issue](https://github.com/alokranjanmedia/grc-dashboard/issues) on GitHub
3. Review the troubleshooting section above

---

**Made with ❤️ for GRC professionals - Updated for GitHub OAuth**
