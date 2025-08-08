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
          setError('No authorization code received from GitHub');
          setIsProcessing(false);
          return;
        }

        console.log('Processing auth callback with code:', code);

        // Use the authService to handle the callback
        const data = await authService.handleAuthCallback(code);
        
        console.log('Auth successful:', data);
        
        // Call the success callback
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
        
      } catch (err) {
        console.error('Auth callback error:', err);
        
        // Try to get more detailed error information
        let errorMessage = 'Authentication failed';
        
        if (err.message) {
          errorMessage = err.message;
        } else if (err.error) {
          errorMessage = err.error;
        }
        
        setError(errorMessage);
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
          <div className="text-sm text-gray-500 mb-6">
            <p>Please check:</p>
            <ul className="text-left mt-2">
              <li>• GitHub OAuth app settings</li>
              <li>• Environment variables in Vercel</li>
              <li>• Network connectivity</li>
            </ul>
          </div>
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
