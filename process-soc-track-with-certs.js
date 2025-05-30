import XLSX from 'xlsx';
import fs from 'fs';

function processSocTrackWithCerts() {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile('./attached_assets/Track_1_SOC_Operations_with_Certs.xlsx');
    
    // Get all sheet names
    const sheetNames = workbook.SheetNames;
    console.log('Available sheets:', sheetNames);
    
    // Process each sheet
    sheetNames.forEach(sheetName => {
      console.log(`\n=== Processing Sheet: ${sheetName} ===`);
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log('Raw data structure:');
      data.slice(0, 10).forEach((row, index) => {
        console.log(`Row ${index}:`, row);
      });
      
      // Convert to objects
      if (data.length > 1) {
        const headers = data[0];
        const rows = data.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
        
        console.log('\nHeaders:', headers);
        console.log('\nProcessed rows:');
        rows.slice(0, 5).forEach((row, index) => {
          const obj = {};
          headers.forEach((header, i) => {
            if (header && row[i] !== undefined) {
              obj[header] = row[i];
            }
          });
          console.log(`Row ${index + 1}:`, obj);
        });
      }
    });
    
  } catch (error) {
    console.error('Error processing SOC track with certs:', error);
  }
}

processSocTrackWithCerts();