import { useState, useRef } from 'react';
import { excelParser } from '../utils/parser';
import { dataService } from '../services/api';

const UploadControls = ({ onDataParsed, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      // Validate file
      excelParser.validateExcelFile(selectedFile);
      setFile(selectedFile);
      setError('');
    } catch (err) {
      setError(err.message);
      setFile(null);
    }
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (!droppedFile) return;

    try {
      excelParser.validateExcelFile(droppedFile);
      setFile(droppedFile);
      setError('');
    } catch (err) {
      setError(err.message);
      setFile(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const parseFile = async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Parse the Excel file
      const result = await excelParser.parseExcelFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setParsedData(result);
      
      // Call parent callback
      if (onDataParsed) {
        onDataParsed(result);
      }

      // Simulate API upload
      setTimeout(async () => {
        try {
          const uploadResult = await dataService.mockUploadExcel(result.processedData);
          if (onUploadComplete) {
            onUploadComplete(uploadResult);
          }
        } catch (uploadError) {
          setError('Upload failed: ' + uploadError.message);
        }
      }, 500);

    } catch (err) {
      setError('Failed to parse file: ' + err.message);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const clearFile = () => {
    setFile(null);
    setParsedData(null);
    setError('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      { 'Control ID': 'CTRL-001', 'Control Name': 'Access Control', 'Risk Level': 'High', 'Status': 'Active' },
      { 'Control ID': 'CTRL-002', 'Control Name': 'Data Encryption', 'Risk Level': 'Medium', 'Status': 'Active' },
      { 'Control ID': 'CTRL-003', 'Control Name': 'Backup Procedures', 'Risk Level': 'Low', 'Status': 'Inactive' },
    ];

    excelParser.exportToExcel(sampleData, 'sample-controls.xlsx');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* File Upload Area */}
      <div className="mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            file 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">
              📄
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {file ? 'File Selected' : 'Upload Excel File'}
              </h3>
              <p className="text-gray-500 mb-4">
                {file 
                  ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
                  : 'Drag and drop your Excel file here, or click to browse'
                }
              </p>
            </div>
            
            {!file && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Choose File
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.xlsm"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      {isLoading && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Processing file...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        {file && !isLoading && (
          <button
            onClick={parseFile}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>📊</span>
            Parse & Upload
          </button>
        )}
        
        {file && (
          <button
            onClick={clearFile}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Clear
          </button>
        )}
        
        <button
          onClick={downloadSampleFile}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>📥</span>
          Download Sample
        </button>
      </div>

      {/* Parsed Data Summary */}
      {parsedData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">File Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{parsedData.totalRows}</div>
              <div className="text-sm text-blue-600">Total Rows</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{parsedData.totalColumns}</div>
              <div className="text-sm text-green-600">Total Columns</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{parsedData.processedData.length}</div>
              <div className="text-sm text-purple-600">Data Rows</div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <strong>Sheet:</strong> {parsedData.sheetName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadControls;
