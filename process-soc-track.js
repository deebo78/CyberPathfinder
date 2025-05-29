import XLSX from 'xlsx';

try {
  // Read the SOC Operations Career Ladder Excel file
  const workbook = XLSX.readFile('attached_assets/Track_18_Threat_Intelligence.xlsx');
  
  // Get all sheet names
  console.log('Sheet names:', workbook.SheetNames);
  
  // Process each sheet
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n=== Sheet: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Rows: ${jsonData.length}`);
    if (jsonData.length > 0) {
      console.log('Columns:', Object.keys(jsonData[0]));
      console.log('Complete SOC Operations Career Ladder:');
      console.log(JSON.stringify(jsonData, null, 2));
    }
  });
  
} catch (error) {
  console.error('Error processing Excel file:', error);
}