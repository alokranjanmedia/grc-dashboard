import { useState } from 'react';
import UploadControls from '../components/UploadControls';
import { authService } from '../services/api';

const Dashboard = () => {
  const [parsedData, setParsedData] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [currentUser] = useState(authService.getCurrentUser());

  const handleDataParsed = (data) => {
    setParsedData(data);
    setUploadResult(null);
  };

  const handleUploadComplete = (result) => {
    setUploadResult(result);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">GRC Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{currentUser.name}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name || 'User'}! 👋
          </h2>
          <p className="text-gray-600">
            Upload your Excel files to analyze and manage your GRC controls.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upload Excel File</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload your control data in Excel format (.xlsx, .xls, .xlsm)
            </p>
          </div>
          <div className="p-6">
            <UploadControls 
              onDataParsed={handleDataParsed}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Upload Successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Processed {uploadResult.processedRows} rows successfully.</p>
                  <p>Timestamp: {new Date(uploadResult.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parsed Data Display */}
        {parsedData && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Parsed Data Preview</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing first 10 rows of {parsedData.processedData.length} total rows
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {parsedData.processedData[0] && 
                      Object.keys(parsedData.processedData[0])
                        .filter(key => key !== '_rowIndex')
                        .map((header, index) => (
                          <th
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))
                    }
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.processedData.slice(0, 10).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {Object.keys(row)
                        .filter(key => key !== '_rowIndex')
                        .map((key, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {row[key] || '-'}
                          </td>
                        ))
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {parsedData.processedData.length > 10 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing 10 of {parsedData.processedData.length} rows. 
                  Upload to see all data in the system.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Controls</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {parsedData ? parsedData.processedData.length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Controls</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {parsedData ? parsedData.processedData.filter(row => 
                    row.Status && row.Status.toLowerCase() === 'active'
                  ).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">High Risk</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {parsedData ? parsedData.processedData.filter(row => 
                    row['Risk Level'] && row['Risk Level'].toLowerCase() === 'high'
                  ).length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
