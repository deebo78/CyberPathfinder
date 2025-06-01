import fs from 'fs';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function generateCertificationAudit() {
  console.log('🔍 Generating comprehensive certification audit report...');
  
  try {
    // Get all certifications with detailed information
    const result = await pool.query(`
      SELECT 
        id,
        code,
        name,
        issuer,
        description,
        level,
        domain,
        prerequisites,
        renewal_period,
        created_at
      FROM certifications 
      ORDER BY issuer, name
    `);

    const certifications = result.rows;
    console.log(`📊 Found ${certifications.length} total certifications`);

    // Create CSV content
    const csvHeaders = [
      'ID',
      'Code',
      'Name',
      'Issuer',
      'Description',
      'Level',
      'Domain',
      'Prerequisites',
      'Renewal Period',
      'Created At'
    ];

    const csvRows = [csvHeaders.join(',')];
    
    certifications.forEach(cert => {
      const row = [
        cert.id,
        `"${cert.code || ''}"`,
        `"${cert.name || ''}"`,
        `"${cert.issuer || ''}"`,
        `"${(cert.description || '').replace(/"/g, '""')}"`,
        `"${cert.level || ''}"`,
        `"${cert.domain || ''}"`,
        `"${(cert.prerequisites || '').replace(/"/g, '""')}"`,
        `"${cert.renewal_period || ''}"`,
        `"${cert.created_at || ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    
    // Write to file
    fs.writeFileSync('certifications_complete_audit.csv', csvContent);
    console.log('✅ Complete certification audit saved to: certifications_complete_audit.csv');

    // Analyze for duplicates
    console.log('\n🔍 Analyzing for potential duplicates...');
    
    const duplicateAnalysis = [];
    const nameGroups = {};
    const codeGroups = {};

    certifications.forEach(cert => {
      // Group by name
      const normalizedName = cert.name.toLowerCase().trim();
      if (!nameGroups[normalizedName]) {
        nameGroups[normalizedName] = [];
      }
      nameGroups[normalizedName].push(cert);

      // Group by code
      if (cert.code) {
        const normalizedCode = cert.code.toUpperCase().trim();
        if (!codeGroups[normalizedCode]) {
          codeGroups[normalizedCode] = [];
        }
        codeGroups[normalizedCode].push(cert);
      }
    });

    // Find duplicates by name
    console.log('\n📋 Potential duplicates by NAME:');
    let nameCount = 0;
    Object.entries(nameGroups).forEach(([name, certs]) => {
      if (certs.length > 1) {
        nameCount++;
        console.log(`\n${nameCount}. "${name}" (${certs.length} entries):`);
        certs.forEach(cert => {
          console.log(`   - ID ${cert.id}: ${cert.code} (${cert.issuer})`);
        });
        duplicateAnalysis.push({
          type: 'name',
          value: name,
          count: certs.length,
          certifications: certs
        });
      }
    });

    // Find duplicates by code
    console.log('\n🏷️  Potential duplicates by CODE:');
    let codeCount = 0;
    Object.entries(codeGroups).forEach(([code, certs]) => {
      if (certs.length > 1) {
        codeCount++;
        console.log(`\n${codeCount}. "${code}" (${certs.length} entries):`);
        certs.forEach(cert => {
          console.log(`   - ID ${cert.id}: ${cert.name} (${cert.issuer})`);
        });
        duplicateAnalysis.push({
          type: 'code',
          value: code,
          count: certs.length,
          certifications: certs
        });
      }
    });

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`Total Certifications: ${certifications.length}`);
    console.log(`Duplicate Names Found: ${nameCount}`);
    console.log(`Duplicate Codes Found: ${codeCount}`);
    
    // Count by issuer
    const issuerCounts = {};
    certifications.forEach(cert => {
      const issuer = cert.issuer || 'Unknown';
      issuerCounts[issuer] = (issuerCounts[issuer] || 0) + 1;
    });

    console.log('\n🏢 Certifications by Issuer:');
    Object.entries(issuerCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([issuer, count]) => {
        console.log(`   ${issuer}: ${count}`);
      });

    // Generate duplicate analysis CSV
    if (duplicateAnalysis.length > 0) {
      const duplicateCsvHeaders = ['Type', 'Value', 'Count', 'IDs', 'Names', 'Issuers'];
      const duplicateCsvRows = [duplicateCsvHeaders.join(',')];
      
      duplicateAnalysis.forEach(dup => {
        const ids = dup.certifications.map(c => c.id).join(';');
        const names = dup.certifications.map(c => c.name).join(';');
        const issuers = dup.certifications.map(c => c.issuer).join(';');
        
        const row = [
          dup.type,
          `"${dup.value}"`,
          dup.count,
          `"${ids}"`,
          `"${names.replace(/"/g, '""')}"`,
          `"${issuers}"`
        ];
        duplicateCsvRows.push(row.join(','));
      });

      const duplicateCsvContent = duplicateCsvRows.join('\n');
      fs.writeFileSync('certification_duplicates_analysis.csv', duplicateCsvContent);
      console.log('✅ Duplicate analysis saved to: certification_duplicates_analysis.csv');
    }

  } catch (error) {
    console.error('❌ Error generating certification audit:', error);
  } finally {
    await pool.end();
  }
}

generateCertificationAudit();