import XLSX from 'xlsx';

function examineDigitalForensicsStructure() {
  try {
    const workbook = XLSX.readFile('./attached_assets/Track_4_Digital_Forensics_with_Certs.xlsx');
    const sheetNames = workbook.SheetNames;
    console.log('Available sheets:', sheetNames);
    
    const worksheet = workbook.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('=== Digital Forensics File Structure ===');
    console.log('Headers:', data[0]);
    console.log('\nAll rows:');
    
    data.forEach((row, index) => {
      console.log(`Row ${index}:`, row);
    });
    
    // Convert to objects
    if (data.length > 1) {
      const headers = data[0];
      const rows = data.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
      
      console.log('\n=== Processed Data Structure ===');
      rows.forEach((row, index) => {
        const obj = {};
        headers.forEach((header, i) => {
          if (header && row[i] !== undefined) {
            obj[header] = row[i];
          }
        });
        console.log(`\nEntry ${index + 1}:`, obj);
      });
    }
    
  } catch (error) {
    console.error('Error examining Digital Forensics structure:', error);
  }
}

examineDigitalForensicsStructure();