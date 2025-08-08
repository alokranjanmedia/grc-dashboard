// API service for handling backend communication

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-domain.vercel.app/api'  // Replace with your actual Vercel domain
  : 'http://localhost:5176/api'; // For local development

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = 'Ov23li8cKR03tDtZyuoS'; // Real GitHub OAuth Client ID
const GITHUB_REDIRECT_URI = 'http://localhost:5176/auth/callback'; // Updated to match current port

// Authentication functions
export const authService = {
  // Initiate GitHub OAuth login
  loginWithGitHub: () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email`;
    window.location.href = githubAuthUrl;
  },

  // Handle OAuth callback
  handleAuthCallback: async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/github/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) throw new Error('Authentication failed');
      
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Auth callback error:', error);
      throw error;
    }
  },

  // Mock login for demo purposes
  mockLogin: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.username === 'demo' && credentials.password === 'demo') {
      const mockUser = {
        id: 1,
        username: 'demo',
        email: 'demo@example.com',
        name: 'Demo User',
        avatar: 'https://via.placeholder.com/40'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { user: mockUser, token: mockToken };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Data upload and processing functions
export const dataService = {
  // Upload Excel file and parse data
  uploadExcel: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload/excel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Mock upload for demo purposes
  mockUploadExcel: async (parsedData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful upload
    return {
      success: true,
      message: 'File uploaded successfully',
      data: parsedData,
      processedRows: parsedData.length,
      timestamp: new Date().toISOString()
    };
  },

  // Get upload history
  getUploadHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/uploads`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch upload history');
      
      return await response.json();
    } catch (error) {
      console.error('Fetch upload history error:', error);
      throw error;
    }
  }
};

export default { authService, dataService };
