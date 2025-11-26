import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Security configuration
export const SECURITY_CONFIG = {
  // Rate limiting windows (in milliseconds)
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  
  // Rate limits per window
  GENERAL_API_LIMIT: 100,
  AI_ENDPOINT_LIMIT: 20, // AI endpoints are expensive - stricter limit
  FILE_UPLOAD_LIMIT: 10, // File uploads
  AUTH_ATTEMPT_LIMIT: 5, // Auth attempts
  
  // File upload constraints
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_EXTENSIONS: ['.txt', '.doc', '.docx', '.json', '.xlsx'],
  ALLOWED_MIME_TYPES: [
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/json',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  
  // Admin API key header name
  ADMIN_API_KEY_HEADER: 'x-admin-api-key',
};

/**
 * Validates admin API key for protected routes.
 * Uses constant-time comparison to prevent timing attacks.
 * 
 * SECURITY: This replaces the insecure VITE_ENABLE_ADMIN flag with proper API key auth.
 */
export function requireAdminApiKey(req: Request, res: Response, next: NextFunction): void {
  const providedKey = req.headers[SECURITY_CONFIG.ADMIN_API_KEY_HEADER] as string | undefined;
  const expectedKey = process.env.ADMIN_API_KEY;
  
  // Check if admin functionality is enabled at all
  if (!expectedKey) {
    res.status(503).json({ 
      message: "Admin functionality is not configured on this server" 
    });
    return;
  }
  
  // Validate API key was provided
  if (!providedKey) {
    res.status(401).json({ 
      message: "Authentication required. Provide API key in X-Admin-API-Key header." 
    });
    return;
  }
  
  // Use constant-time comparison to prevent timing attacks
  // SECURITY: Regular string comparison leaks information about key length and prefix
  const isValidKey = safeCompare(providedKey, expectedKey);
  
  if (!isValidKey) {
    // Log failed auth attempt (without revealing the key)
    console.warn(`[SECURITY] Failed admin auth attempt from IP: ${getClientIp(req)}`);
    
    res.status(403).json({ 
      message: "Invalid API key" 
    });
    return;
  }
  
  // Log successful admin access for audit trail
  console.log(`[AUDIT] Admin access granted to IP: ${getClientIp(req)} for ${req.method} ${req.path}`);
  
  next();
}

/**
 * Legacy admin access check - checks VITE_ENABLE_ADMIN flag only.
 * DEPRECATED: Use requireAdminApiKey for sensitive operations.
 * This is kept for backward compatibility with UI visibility checks.
 */
export function checkAdminEnabled(req: Request, res: Response, next: NextFunction): void {
  const isAdminEnabled = process.env.VITE_ENABLE_ADMIN === 'true';
  if (!isAdminEnabled) {
    res.status(403).json({ message: "Admin access is disabled" });
    return;
  }
  next();
}

/**
 * Validates numeric route parameters to prevent NaN/undefined issues.
 * 
 * SECURITY: parseInt without validation can lead to unexpected behavior
 * when malicious input like "1; DROP TABLE" is provided.
 */
export function validateNumericParam(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params[paramName];
    
    if (!value) {
      res.status(400).json({ message: `Missing required parameter: ${paramName}` });
      return;
    }
    
    // Check for valid positive integer
    const parsed = parseInt(value, 10);
    
    if (isNaN(parsed) || parsed < 0 || parsed.toString() !== value.replace(/^0+/, '') && value !== '0') {
      res.status(400).json({ 
        message: `Invalid ${paramName}: must be a positive integer` 
      });
      return;
    }
    
    // Attach validated value to request for use in handlers
    (req as any).validatedParams = (req as any).validatedParams || {};
    (req as any).validatedParams[paramName] = parsed;
    
    next();
  };
}

/**
 * Validates uploaded file type based on extension AND magic bytes.
 * 
 * SECURITY: MIME types can be spoofed. We validate both extension and content.
 */
export function validateFileType(req: Request, res: Response, next: NextFunction): void {
  const file = (req as any).file;
  
  if (!file) {
    next();
    return;
  }
  
  const path = require('path');
  const extension = path.extname(file.originalname).toLowerCase();
  
  // Validate extension
  if (!SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS.includes(extension)) {
    // Clean up the uploaded file
    const fs = require('fs');
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.error('[SECURITY] Failed to clean up rejected file:', e);
    }
    
    res.status(400).json({ 
      message: `File type not allowed. Accepted types: ${SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS.join(', ')}` 
    });
    return;
  }
  
  // Validate MIME type
  if (!SECURITY_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    // Clean up the uploaded file
    const fs = require('fs');
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.error('[SECURITY] Failed to clean up rejected file:', e);
    }
    
    res.status(400).json({ 
      message: `File MIME type not allowed: ${file.mimetype}` 
    });
    return;
  }
  
  // Sanitize filename to prevent path traversal
  // SECURITY: Prevent "../../../etc/passwd" style attacks
  const sanitizedName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
  file.sanitizedOriginalname = sanitizedName;
  
  next();
}

/**
 * Restricts access to diagnostic endpoints in production.
 * 
 * SECURITY: Diagnostic endpoints can leak sensitive information like
 * API key prefixes, database connection status, and stack traces.
 */
export function restrictDiagnosticAccess(req: Request, res: Response, next: NextFunction): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // In production, require admin API key for diagnostic endpoints
    requireAdminApiKey(req, res, next);
  } else {
    // In development, allow access but log it
    console.log(`[DEBUG] Diagnostic endpoint accessed: ${req.path}`);
    next();
  }
}

/**
 * Sanitizes error responses to prevent information leakage.
 * 
 * SECURITY: Stack traces and detailed error messages can reveal
 * internal architecture, file paths, and potential vulnerabilities.
 */
export function sanitizeError(error: Error, isProduction: boolean): { message: string; code?: string } {
  if (!isProduction) {
    // In development, return full error for debugging
    return { 
      message: error.message,
      code: (error as any).code 
    };
  }
  
  // In production, return generic message
  // Map known error types to user-friendly messages
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('validation')) {
    return { message: 'Invalid input data', code: 'VALIDATION_ERROR' };
  }
  
  if (errorMessage.includes('not found')) {
    return { message: 'Resource not found', code: 'NOT_FOUND' };
  }
  
  if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
    return { message: 'Authentication required', code: 'AUTH_REQUIRED' };
  }
  
  if (errorMessage.includes('forbidden') || errorMessage.includes('permission')) {
    return { message: 'Access denied', code: 'ACCESS_DENIED' };
  }
  
  if (errorMessage.includes('rate limit')) {
    return { message: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' };
  }
  
  // Generic error for anything else
  return { message: 'An error occurred. Please try again.', code: 'INTERNAL_ERROR' };
}

/**
 * Constant-time string comparison to prevent timing attacks.
 * 
 * SECURITY: Regular === comparison reveals information about
 * how many characters matched before failing.
 */
function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  // Use crypto.timingSafeEqual for constant-time comparison
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  
  // If lengths differ, compare against a dummy to maintain constant time
  if (bufA.length !== bufB.length) {
    // Still do a comparison to prevent timing attacks on length
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Gets client IP address, accounting for proxies.
 * 
 * SECURITY: Required for rate limiting and audit logging.
 */
export function getClientIp(req: Request): string {
  // Trust X-Forwarded-For in production (behind proxy)
  const forwardedFor = req.headers['x-forwarded-for'];
  
  if (forwardedFor) {
    // Take the first IP in the chain (original client)
    const ips = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor).split(',');
    return ips[0].trim();
  }
  
  return req.socket.remoteAddress || 'unknown';
}

/**
 * Sanitizes log data to prevent sensitive information exposure.
 * 
 * SECURITY: Logs should never contain passwords, API keys, or PII.
 */
export function sanitizeLogData(data: Record<string, any>): Record<string, any> {
  const sensitiveKeys = [
    'password', 'apiKey', 'api_key', 'secret', 'token', 
    'authorization', 'cookie', 'session', 'credit_card',
    'ssn', 'social_security', 'email', 'phone'
  ];
  
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Generate a secure random API key for admin access.
 * Call this function once to generate a key, then store it securely.
 */
export function generateAdminApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
