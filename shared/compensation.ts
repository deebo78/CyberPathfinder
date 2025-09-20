// Compensation calculation system with geographic market tiers
// Addresses unrealistic executive salaries in smaller markets

export enum MarketTier {
  TIER_A = 'A', // SF/NYC premium markets
  TIER_B = 'B', // Large metropolitan areas  
  TIER_C = 'C', // Mid-size markets
  TIER_D = 'D'  // Small cities and rural areas
}

// City to market tier mapping - focused on commonly mentioned locations
export const CITY_TIER_MAP: Record<string, MarketTier> = {
  // Tier A - Premium markets
  'san francisco': MarketTier.TIER_A,
  'silicon valley': MarketTier.TIER_A,
  'palo alto': MarketTier.TIER_A,
  'mountain view': MarketTier.TIER_A,
  'new york': MarketTier.TIER_A,
  'manhattan': MarketTier.TIER_A,
  'brooklyn': MarketTier.TIER_A,
  'boston': MarketTier.TIER_A,
  
  // Tier B - Large metros
  'seattle': MarketTier.TIER_B,
  'washington': MarketTier.TIER_B,
  'washington dc': MarketTier.TIER_B,
  'dc': MarketTier.TIER_B,
  'los angeles': MarketTier.TIER_B,
  'chicago': MarketTier.TIER_B,
  'denver': MarketTier.TIER_B,
  'austin': MarketTier.TIER_B,
  'atlanta': MarketTier.TIER_B,
  'dallas': MarketTier.TIER_B,
  'phoenix': MarketTier.TIER_B,
  'miami': MarketTier.TIER_B,
  'philadelphia': MarketTier.TIER_B,
  
  // Tier C - Mid-size markets  
  'charlotte': MarketTier.TIER_C,
  'nashville': MarketTier.TIER_C,
  'tampa': MarketTier.TIER_C,
  'orlando': MarketTier.TIER_C,
  'raleigh': MarketTier.TIER_C,
  'richmond': MarketTier.TIER_C,
  'columbus': MarketTier.TIER_C,
  'cleveland': MarketTier.TIER_C,
  'cincinnati': MarketTier.TIER_C,
  'indianapolis': MarketTier.TIER_C,
  'kansas city': MarketTier.TIER_C,
  'milwaukee': MarketTier.TIER_C,
  'salt lake city': MarketTier.TIER_C,
  'portland': MarketTier.TIER_C,
  'sacramento': MarketTier.TIER_C,
  'san diego': MarketTier.TIER_C,
  'san antonio': MarketTier.TIER_C,
  'jacksonville': MarketTier.TIER_C,
  
  // Tier D - Small cities (examples, defaults to Tier D for unlisted)
  'augusta': MarketTier.TIER_D,
  'albany': MarketTier.TIER_D,
  'boise': MarketTier.TIER_D,
  'spokane': MarketTier.TIER_D,
  'shreveport': MarketTier.TIER_D,
  'mobile': MarketTier.TIER_D,
  'pensacola': MarketTier.TIER_D
};

// Executive salary bands by market tier (pre-adjusted for geography)
export const EXECUTIVE_SALARY_BANDS = {
  [MarketTier.TIER_A]: { min: 330000, max: 500000 }, // SF/NYC premium
  [MarketTier.TIER_B]: { min: 260000, max: 380000 }, // Large metros
  [MarketTier.TIER_C]: { min: 210000, max: 300000 }, // Mid-markets
  [MarketTier.TIER_D]: { min: 170000, max: 240000 }  // Small/rural
};

// Hard caps per tier to prevent calculation overflow
export const EXECUTIVE_SALARY_CAPS = {
  [MarketTier.TIER_A]: { ceiling: 520000, floor: 300000 },
  [MarketTier.TIER_B]: { ceiling: 400000, floor: 240000 },
  [MarketTier.TIER_C]: { ceiling: 320000, floor: 200000 },
  [MarketTier.TIER_D]: { ceiling: 260000, floor: 160000 }
};

// Role factors for executive positions (replaces 1.5x multiplier)
export const EXECUTIVE_ROLE_FACTORS = {
  'large_organization': 1.10,    // 500+ employees
  'regulated_industry': 1.05,    // Financial, healthcare, defense
  'security_team_lead': 1.08,    // Leading security teams 10+
  'default': 1.00                // Standard executive role
};

// Certification premiums for executives (reduced from non-exec levels)
export const EXECUTIVE_CERT_PREMIUMS = {
  'CISSP': 8000,
  'CISM': 8000,
  'CISA': 6000,
  'multiple_expert': 10000,      // Multiple high-level certs
  'cloud_specialty': 5000,       // AWS/Azure/GCP
  'default': 0
};

/**
 * Determines market tier based on location string
 * @param location - Location string from resume/job posting
 * @returns MarketTier enum value
 */
export function getLocationTier(location?: string): MarketTier {
  if (!location) return MarketTier.TIER_C; // Default to mid-market
  
  const normalizedLocation = location.toLowerCase().trim();
  
  // Check for exact matches first
  if (CITY_TIER_MAP[normalizedLocation]) {
    return CITY_TIER_MAP[normalizedLocation];
  }
  
  // Check for partial matches (e.g., "Augusta, GA" contains "augusta")
  for (const [city, tier] of Object.entries(CITY_TIER_MAP)) {
    if (normalizedLocation.includes(city)) {
      return tier;
    }
  }
  
  // Special handling for common patterns
  if (normalizedLocation.includes('bay area') || normalizedLocation.includes('silicon valley')) {
    return MarketTier.TIER_A;
  }
  
  if (normalizedLocation.includes('metro') || normalizedLocation.includes('metropolitan')) {
    return MarketTier.TIER_B;
  }
  
  // Default to Tier D for unknown small cities/rural areas
  return MarketTier.TIER_D;
}

/**
 * Gets executive salary band for a given market tier
 * @param tier - Market tier
 * @returns Salary band with min/max values
 */
export function getExecutiveSalaryBand(tier: MarketTier) {
  return EXECUTIVE_SALARY_BANDS[tier];
}

/**
 * Gets salary caps for a given market tier
 * @param tier - Market tier  
 * @returns Ceiling and floor values
 */
export function getExecutiveSalaryCaps(tier: MarketTier) {
  return EXECUTIVE_SALARY_CAPS[tier];
}

/**
 * Determines appropriate role factor for executive position
 * @param context - Additional context about the role/organization
 * @returns Role factor multiplier
 */
export function getExecutiveRoleFactor(context?: {
  organizationSize?: string;
  industry?: string;
  teamSize?: string;
}): number {
  if (!context) return EXECUTIVE_ROLE_FACTORS.default;
  
  // Large organization bonus
  if (context.organizationSize && 
      (context.organizationSize.includes('large') || 
       context.organizationSize.includes('enterprise') ||
       context.organizationSize.includes('500+'))) {
    return EXECUTIVE_ROLE_FACTORS.large_organization;
  }
  
  // Regulated industry bonus
  if (context.industry && 
      (context.industry.includes('financial') || 
       context.industry.includes('healthcare') ||
       context.industry.includes('defense') ||
       context.industry.includes('government'))) {
    return EXECUTIVE_ROLE_FACTORS.regulated_industry;
  }
  
  // Security team leadership bonus
  if (context.teamSize && 
      (context.teamSize.includes('10+') || 
       context.teamSize.includes('large team') ||
       context.teamSize.includes('department'))) {
    return EXECUTIVE_ROLE_FACTORS.security_team_lead;
  }
  
  return EXECUTIVE_ROLE_FACTORS.default;
}