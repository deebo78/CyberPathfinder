#!/usr/bin/env node

/**
 * Test script to demonstrate nuanced education scoring
 * This script tests various education-level mismatches to show graduated deduction scoring
 */

const scenarios = [
  {
    name: "High School → Director (4+ level gap)",
    jobTitle: "Director of Cybersecurity",
    education: "High school diploma/GED required",
    expectedDeduction: 25,
    description: "Most severe mismatch - 4+ level gap"
  },
  {
    name: "Associates → Senior (2 level gap)", 
    jobTitle: "Senior Cybersecurity Analyst",
    education: "Associates degree in Computer Science required",
    expectedDeduction: 15,
    description: "Moderate mismatch - 2 level gap"
  },
  {
    name: "Bachelor's → Director (1 level gap)",
    jobTitle: "Director of Information Security",
    education: "Bachelor's degree in Computer Science required",
    expectedDeduction: 10,
    description: "Minor mismatch - 1 level gap"
  },
  {
    name: "Bachelor's → Senior (minor gap)",
    jobTitle: "Senior Security Engineer",
    education: "Bachelor's degree in Computer Science required",
    expectedDeduction: 5,
    description: "Minimal mismatch - minor gap"
  },
  {
    name: "Master's → Director (minimal gap)",
    jobTitle: "Director of Cybersecurity Operations",
    education: "Master's degree in Computer Science required",
    expectedDeduction: 3,
    description: "Almost appropriate - minimal gap"
  }
];

async function testScenario(scenario) {
  const payload = {
    jobTitle: scenario.jobTitle,
    companyName: "Test Corp",
    jobDescription: `${scenario.jobTitle} responsible for cybersecurity operations, risk management, and implementing security frameworks including NIST and ISO 27001.`,
    requiredQualifications: `${scenario.education}. 5+ years of cybersecurity experience. Knowledge of NIST Cybersecurity Framework, incident response, and vulnerability management.`,
    preferredQualifications: "Security+ certification. Experience with SIEM tools.",
    salaryMin: 80000,
    salaryMax: 120000,
    location: "Remote"
  };

  try {
    const response = await fetch('http://localhost:5000/api/analyze-vacancy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Find education-related deduction
    const educationDeduction = result.roleConsistencyAnalysis?.scoringBreakdown?.deductions?.find(
      d => d.category.toLowerCase().includes('education')
    );

    console.log(`\n${scenario.name}`);
    console.log(`Description: ${scenario.description}`);
    console.log(`Expected Deduction: -${scenario.expectedDeduction} points`);
    console.log(`Actual Deduction: ${educationDeduction ? `-${educationDeduction.points} points` : 'None found'}`);
    console.log(`Overall Score: ${result.roleConsistencyAnalysis?.overallConsistencyScore || 'N/A'}`);
    console.log(`Severity: ${result.roleConsistencyAnalysis?.severityLevel || 'N/A'}`);
    
    if (educationDeduction) {
      console.log(`Reason: ${educationDeduction.reason}`);
    }

  } catch (error) {
    console.error(`Error testing ${scenario.name}:`, error.message);
  }
}

async function runTests() {
  console.log("🎯 Testing Nuanced Education Scoring System");
  console.log("=" .repeat(60));
  
  for (const scenario of scenarios) {
    await testScenario(scenario);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between requests
  }
  
  console.log("\n" + "=" .repeat(60));
  console.log("✅ Testing Complete - Review results above");
}

runTests().catch(console.error);