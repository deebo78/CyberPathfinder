#!/usr/bin/env node

/**
 * Comprehensive test script to validate scoring consistency improvements
 * Tests the same job posting multiple times to ensure consistent scoring
 */

const testJobPosting = {
  jobTitle: "Director, Portfolio & Program Management",
  companyName: "Georgia Department of Early Care and Learning",
  jobDescription: "A Director of Portfolio & Program Management plays a pivotal role in steering an organization's project ecosystem.",
  requiredQualifications: "High school diploma/GED required and three (3) years of job-related experience.",
  preferredQualifications: "15+ years of experience in IT project management.",
  salaryMin: null,
  salaryMax: null,
  location: "Metro Atlanta"
};

async function runSingleTest(testNumber) {
  try {
    const startTime = Date.now();
    const response = await fetch('http://localhost:5000/api/analyze-vacancy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testJobPosting)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const score = result.roleConsistencyAnalysis?.overallConsistencyScore || 'N/A';
    const severityLevel = result.roleConsistencyAnalysis?.severityLevel || 'N/A';
    const finalScore = result.roleConsistencyAnalysis?.scoringBreakdown?.finalScore || 'N/A';
    
    return {
      testNumber,
      score,
      finalScore,
      severityLevel,
      duration,
      success: true
    };

  } catch (error) {
    return {
      testNumber,
      score: 'ERROR',
      finalScore: 'ERROR',
      severityLevel: 'ERROR',
      duration: 0,
      success: false,
      error: error.message
    };
  }
}

async function runConsistencyTest() {
  console.log("🎯 Testing Map Vacancy Scoring Consistency");
  console.log("=" .repeat(70));
  console.log("Testing: Director Portfolio Management role with problematic requirements");
  console.log("Expected: Consistent low scores due to non-cybersecurity nature and education mismatch");
  console.log("=" .repeat(70));
  
  const numberOfTests = 5;
  const results = [];
  
  for (let i = 1; i <= numberOfTests; i++) {
    console.log(`Running Test ${i}/${numberOfTests}...`);
    const result = await runSingleTest(i);
    results.push(result);
    
    // Wait 2 seconds between tests
    if (i < numberOfTests) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log("\n" + "=" .repeat(70));
  console.log("RESULTS SUMMARY");
  console.log("=" .repeat(70));
  
  // Display individual results
  console.log("Test#  Score  Final  Severity   Duration  Status");
  console.log("-".repeat(50));
  results.forEach(result => {
    const status = result.success ? "✅ Pass" : "❌ Fail";
    const duration = `${result.duration}ms`;
    console.log(
      `${result.testNumber.toString().padEnd(5)} ` +
      `${result.score.toString().padEnd(6)} ` +
      `${result.finalScore.toString().padEnd(6)} ` +
      `${result.severityLevel.toString().padEnd(10)} ` +
      `${duration.padEnd(8)} ` +
      `${status}`
    );
    
    if (!result.success) {
      console.log(`    Error: ${result.error}`);
    }
  });
  
  // Calculate consistency metrics
  const successfulTests = results.filter(r => r.success);
  const scores = successfulTests.map(r => parseInt(r.score)).filter(s => !isNaN(s));
  const finalScores = successfulTests.map(r => parseInt(r.finalScore)).filter(s => !isNaN(s));
  
  if (scores.length > 0) {
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const scoreVariance = maxScore - minScore;
    
    console.log("\n" + "=" .repeat(70));
    console.log("CONSISTENCY ANALYSIS");
    console.log("=" .repeat(70));
    console.log(`Tests Completed: ${successfulTests.length}/${numberOfTests}`);
    console.log(`Average Score: ${avgScore.toFixed(1)}`);
    console.log(`Score Range: ${minScore} - ${maxScore}`);
    console.log(`Score Variance: ${scoreVariance} points`);
    
    if (scoreVariance <= 5) {
      console.log("✅ EXCELLENT: Score variance within 5 points (highly consistent)");
    } else if (scoreVariance <= 15) {
      console.log("✅ GOOD: Score variance within 15 points (acceptably consistent)");  
    } else if (scoreVariance <= 25) {
      console.log("⚠️  FAIR: Score variance within 25 points (needs improvement)");
    } else {
      console.log("❌ POOR: Score variance above 25 points (inconsistent)");
    }
    
    const avgDuration = successfulTests.reduce((a, r) => a + r.duration, 0) / successfulTests.length;
    console.log(`Average Response Time: ${avgDuration.toFixed(0)}ms`);
  }
  
  console.log("\n" + "=" .repeat(70));
  console.log("✅ Consistency Test Complete");
}

runConsistencyTest().catch(console.error);