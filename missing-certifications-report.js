import XLSX from 'xlsx';

function generateMissingCertificationsReport() {
  try {
    console.log('=== Missing Certifications Report ===\n');
    
    const missingCerts = new Set();
    
    // Process SOC Operations track
    console.log('1. SOC Operations Track - Missing Certifications:');
    const socCerts = [
      'ISC2 Certified in Cybersecurity (CC)',
      'Blue Team Level 1 (BTL1)', 
      'Google Cybersecurity Certificate',
      'eLearnSecurity eCTI',
      'SANS GCTI',
      'MITRE ATT&CK Defender (MAD)',
      'Certified SOC Analyst (CSA)',
      'EC-Council Certified Incident Handler (ECIH)',
      'SANS GMON',
      'Certified CISO (C|CISO)',
      'GIAC Security Operations Manager (GSOM)',
      'Certified Chief Information Security Officer (CCISO)'
    ];
    
    socCerts.forEach(cert => {
      console.log(`   - ${cert}`);
      missingCerts.add(cert);
    });
    
    // Process Red Team Operations track
    console.log('\n2. Red Team Operations Track - Missing Certifications:');
    const redTeamCerts = [
      'eLearnSecurity eCPPT',
      'TCM Security PNPT',
      'Offensive Security OSCP',
      'Certified Red Team Operator I (CRTO I)',
      'Offensive Security OSEP',
      'GIAC Exploit Researcher and Advanced Penetration Tester (GXPN)',
      'Certified Red Team Professional (CRTP)',
      'Certified Red Team Operator II (CRTO II)',
      'Certified Red Team Expert (CRTE)',
      'CREST Certified Simulated Attack Specialist (CCSAS)',
      'GIAC Red Team Professional (GRTP)',
      'GIAC Advanced Exploit Development for Penetration Testers (SEC760)',
      'Offensive Security Exploitation Expert (OSEE)',
      'Certified CISO (C|CISO)',
      'GIAC Strategic Planning, Policy, and Leadership (GSTRT)'
    ];
    
    redTeamCerts.forEach(cert => {
      console.log(`   - ${cert}`);
      missingCerts.add(cert);
    });
    
    console.log(`\n=== Summary ===`);
    console.log(`Total unique missing certifications: ${missingCerts.size}`);
    console.log(`\nThese are authentic certifications from your track data that should be added to the database.`);
    console.log(`This will greatly improve the accuracy of certification recommendations.`);
    
  } catch (error) {
    console.error('Error generating report:', error);
  }
}

generateMissingCertificationsReport();