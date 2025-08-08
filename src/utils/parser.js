import * as XLSX from 'xlsx';

// Excel file parser utility
export const excelParser = {
  // Parse Excel file and return structured data
  parseExcelFile: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: '' // Default value for empty cells
          });
          
          // Process the data
          const processedData = processExcelData(jsonData);
          
          resolve({
            originalData: jsonData,
            processedData: processedData,
            sheetName: sheetName,
            totalRows: jsonData.length,
            totalColumns: jsonData[0] ? jsonData[0].length : 0
          });
        } catch (error) {
          reject(new Error('Failed to parse Excel file: ' + error.message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  },

  // Parse multiple sheets from Excel file
  parseExcelFileMultipleSheets: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets = {};
          
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
              header: 1,
              defval: ''
            });
            
            sheets[sheetName] = {
              data: jsonData,
              processedData: processExcelData(jsonData),
              totalRows: jsonData.length,
              totalColumns: jsonData[0] ? jsonData[0].length : 0
            };
          });
          
          resolve(sheets);
        } catch (error) {
          reject(new Error('Failed to parse Excel file: ' + error.message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  },

  // Export data to Excel file
  exportToExcel: (data, filename = 'export.xlsx') => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
      // Generate and download file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export Excel file');
    }
  },

  // Validate Excel file
  validateExcelFile: (file) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an Excel file (.xlsx, .xls, .xlsm)');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB');
    }
    
    return true;
  }
};

// Helper function to process Excel data
function processExcelData(rawData) {
  if (!rawData || rawData.length === 0) {
    return [];
  }
  
  // Assume first row contains headers
  const headers = rawData[0];
  const dataRows = rawData.slice(1);
  
  // Convert to array of objects with headers as keys
  return dataRows.map((row, index) => {
    const obj = {};
    headers.forEach((header, colIndex) => {
      if (header) {
        obj[header] = row[colIndex] || '';
      }
    });
    obj._rowIndex = index + 2; // Excel row number (1-based, +1 for header)
    return obj;
  }).filter(row => {
    // Filter out completely empty rows
    return Object.values(row).some(value => value !== '' && value !== null && value !== undefined);
  });
}

// Data transformation utilities
export const dataTransformer = {
  // Convert data to table format
  toTableFormat: (data) => {
    if (!data || data.length === 0) return { headers: [], rows: [] };
    
    const headers = Object.keys(data[0]).filter(key => key !== '_rowIndex');
    const rows = data.map(row => {
      return headers.map(header => row[header]);
    });
    
    return { headers, rows };
  },

  // Filter data by column value
  filterByColumn: (data, column, value) => {
    return data.filter(row => {
      const cellValue = String(row[column] || '').toLowerCase();
      return cellValue.includes(String(value).toLowerCase());
    });
  },

  // Sort data by column
  sortByColumn: (data, column, direction = 'asc') => {
    return [...data].sort((a, b) => {
      const aVal = a[column] || '';
      const bVal = b[column] || '';
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }
};

export default { excelParser, dataTransformer };
