import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';

const AuthCallback = ({ onLoginSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        
        if (!code) {
          setError('No authorization code received');
          setIsProcessing(false);
          return;
        }

        // Exchange the authorization code for an access token using our backend
        const response = await fetch(`${process.env.NODE_ENV === 'production' 
          ? 'https://your-vercel-domain.vercel.app/api/auth/github/callback'
          : 'http://localhost:5176/api/auth/github/callback'}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Authentication failed');
        }

        const data = await response.json();
        
        // Store the authentication data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Call the success callback
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
        
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed: ' + err.message);
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, onLoginSuccess]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Failed</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Completing Authentication</h2>
        <p className="text-gray-600 mb-6">Please wait while we complete your GitHub login...</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
