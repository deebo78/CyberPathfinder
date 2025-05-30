import XLSX from 'xlsx';

function examineRedTeamStructure() {
  try {
    const workbook = XLSX.readFile('./attached_assets/Track_2_Red_Team_Operations_with_Certs.xlsx');
    const worksheet = workbook.Sheets['Sheet1'];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('=== Red Team Operations File Structure ===');
    console.log('Headers:', data[0]);
    console.log('\nFirst 10 rows:');
    
    data.slice(0, 10).forEach((row, index) => {
      console.log(`Row ${index}:`, row);
    });
    
    // Convert to objects to see the structure better
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
    console.error('Error examining Red Team structure:', error);
  }
}

examineRedTeamStructure();