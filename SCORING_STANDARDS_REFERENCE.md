# CyberPathfinder Job Posting Quality Scoring Standards

## Overview
This document provides the complete scoring methodology used by CyberPathfinder's AI analysis system to evaluate job posting quality and consistency. The scoring system is based on industry best practices, NICE Framework alignment standards, and cybersecurity market intelligence.

## Scoring Scale

### Quality Ranges
| Score Range | Quality Level | Description |
|-------------|---------------|-------------|
| 90-100      | Excellent     | Minimal issues, industry best practices followed |
| 75-89       | Good          | Minor improvements needed, generally well-structured |
| 60-74       | Fair          | Moderate issues requiring attention |
| 40-59       | Poor          | Significant problems affecting candidate attraction |
| 0-39        | Critical      | Major issues requiring substantial revision |

### Severity Indicators
- **Low Severity**: 80+ points (green indicators)
- **Medium Severity**: 60-79 points (yellow indicators)  
- **High Severity**: <60 points (red indicators)

## Deduction Categories and Point Values

### 1. Skills Overload (-15 to -25 points)
**Definition**: Requiring unrealistic breadth of technical expertise

**Deduction Triggers**:
- 5+ unrelated technology stacks: -15 points
- 7+ unrelated technology stacks: -20 points
- 10+ unrelated technology stacks: -25 points

**Examples**:
- ❌ "Expert in Python, Java, C++, JavaScript, Go, Rust, and Scala" (-25 points)
- ❌ "Proficient in AWS, Azure, GCP, VMware, and OpenStack" (-15 points)
- ✅ "Expert in Python with familiarity in Java or C++" (no deduction)

### 2. Role Scope Conflicts (-15 to -25 points)
**Definition**: Combining responsibilities from multiple distinct job functions

**Deduction Triggers**:
- 2 distinct roles combined: -15 points
- 3+ distinct roles combined: -20 points
- Management + technical expert roles: -25 points

**Examples**:
- ❌ "Security Analyst + Network Administrator + Project Manager" (-20 points)
- ❌ "Lead a team of 15 while performing hands-on pentesting" (-25 points)
- ✅ "Security Analyst with network monitoring responsibilities" (no deduction)

### 3. Experience Misalignment (-10 to -20 points)
**Definition**: Experience requirements inconsistent with stated level or responsibilities

**Deduction Triggers**:
- Minor contradiction (1-2 year variance): -10 points
- Major contradiction (3-5 year variance): -15 points
- Extreme contradiction (5+ year variance): -20 points

**Examples**:
- ❌ "Entry-level position requiring 8+ years experience" (-20 points)
- ❌ "Senior role with 2-3 years required experience" (-15 points)
- ✅ "Mid-level role requiring 3-5 years experience" (no deduction)

### 4. Certification Level Mischaracterization (-10 to -20 points)
**Definition**: Incorrectly characterizing certification difficulty levels or mixing inappropriate certification levels

**Deduction Triggers**:
- Professional/Expert certs labeled as "intermediate": -15 points
- Foundation certs required for senior roles: -10 points
- Entry + expert certs mixed inappropriately: -15 points
- Conflicting certification paths: -20 points

**Examples**:
- ❌ "CISSP, CISA, CISM characterized as intermediate-level" (-15 points)
- ❌ "CompTIA Security+ and CISSP both required for same role" (-15 points)
- ❌ "Security+ required for Senior Security Architect" (-10 points)
- ❌ "CCNA and CCIE certification paths" (-20 points)
- ✅ "CISSP or equivalent professional-level certification" (no deduction)
- ✅ "CompTIA Security+ or equivalent foundation certification" (no deduction)

### 5. Compensation Misalignment (-10 to -15 points)
**Definition**: Salary ranges inconsistent with experience level and market rates

**Market Benchmarks by Level**:
| Experience Level | Typical Range | Undercompensation Threshold | Deduction |
|------------------|---------------|----------------------------|-----------|
| Entry-Level      | $45K-75K      | <$40K                      | -15 points |
| Mid-Level        | $75K-110K     | <$65K                      | -10 points |
| Senior-Level     | $110K-150K    | <$100K                     | -10 points |
| Expert-Level     | $150K-200K    | <$140K                     | -10 points |
| Executive-Level  | $200K+        | <$180K                     | -15 points |

**Examples**:
- ❌ "Senior Security Architect, $60K-80K" (-10 points)
- ❌ "Entry-level SOC Analyst, $30K-35K" (-15 points)
- ✅ "Mid-level Security Analyst, $80K-95K" (no deduction)

### 6. Redundant Requirements (-5 to -10 points)
**Definition**: Duplicate or overlapping qualifications listed separately

**Deduction Triggers**:
- Minor redundancy (2-3 instances): -5 points
- Moderate redundancy (4-5 instances): -7 points
- Major redundancy (6+ instances): -10 points

**Examples**:
- ❌ "Python programming" and "Python scripting" listed separately (-5 points)
- ❌ "Bachelor's in Computer Science" and "CS degree required" (-5 points)
- ✅ "Programming experience in Python or similar language" (no deduction)

### 7. Education Contradictions (-5 to -15 points)
**Definition**: Conflicting or unrealistic education requirements

**Deduction Triggers**:
- Minor contradiction: -5 points
- Major contradiction: -10 points
- Unrealistic requirements: -15 points

**Examples**:
- ❌ "High school required, Bachelor's preferred, Master's required" (-10 points)
- ❌ "PhD required for entry-level position" (-15 points)
- ✅ "Bachelor's degree in related field or equivalent experience" (no deduction)

## Additional Evaluation Criteria

### Geographic Adjustments
Salary thresholds may be adjusted based on location:
- **High-cost areas** (San Francisco, NYC): +20-30% to thresholds
- **Medium-cost areas** (Austin, Denver): +10-15% to thresholds  
- **Low-cost areas** (Remote, rural): Standard thresholds apply

### Industry Sector Considerations
- **Government/Public Sector**: -10% adjustment to salary thresholds
- **Financial Services**: +15% adjustment to salary thresholds
- **Healthcare**: +10% adjustment to salary thresholds
- **Startup/Small Business**: -15% adjustment to salary thresholds

### NICE Framework Alignment Bonus
- **Perfect alignment** with single NICE work role: +5 bonus points
- **Clear career progression** pathway identified: +3 bonus points
- **Comprehensive KSAs** mapping: +2 bonus points

## Improvement Recommendations Framework

### Mandatory Recommendations
When specific deductions are applied, the system provides standardized improvement suggestions:

1. **Skills Overload**: "Reduce required technologies to core 3-4 essential skills"
2. **Role Conflicts**: "Split into [Role A] and [Role B] for better candidate targeting"
3. **Experience Misalignment**: "Adjust experience requirement to [X-Y] years for stated level"
4. **Certification Level Mischaracterization**: "Correctly characterize certification levels (Foundation/Associate/Professional/Expert) and align with job requirements"
5. **Compensation**: "Increase salary range to $X-Y to align with market rates"
6. **Redundancy**: "Consolidate overlapping requirements in qualifications section"

### Enhancement Suggestions
Additional recommendations for well-scoring postings:
- Specific NICE Framework work role code alignment
- Career development pathway clarification
- Diversity and inclusion language improvements
- Benefits and perks that strengthen market position

## Quality Assurance Standards

### Consistency Validation
The scoring system includes built-in validation to ensure:
- Mathematical accuracy (base score - deductions = final score)
- Severity level alignment with numerical score
- No contradictory findings (high score with major issues flagged)

### Market Intelligence Updates
Salary benchmarks and scoring criteria are updated quarterly based on:
- Industry salary surveys (CyberSeek, ISACA, SANS)
- Geographic cost-of-living adjustments
- Market demand fluctuations
- Certification value changes

## Implementation Notes

### Scoring Calculation Process
1. Start with base score of 100 points
2. Apply deductions based on identified issues
3. Add any applicable bonuses
4. Validate final score against severity indicators
5. Generate specific improvement recommendations

### Quality Control Measures
- Minimum 3 data points required for deduction application
- Manual review triggers for scores below 40
- Bias detection for protected class language
- Regular algorithm accuracy testing

---

**Document Version**: 2.0  
**Last Updated**: June 17, 2025  
**Next Review**: September 17, 2025  
**Authority**: CyberPathfinder AI Analysis System based on NICE Framework 2.0.0 and industry best practices