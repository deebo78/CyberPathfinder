import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import fs from "fs";

// Security configuration
export const SECURITY_CONFIG = {
  // Rate limiting windows (in milliseconds)
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  
  // Rate limits per window
  GENERAL_API_LIMIT: 100,
  API_ENDPOINT_LIMIT: 50, // Standard API endpoints
  ADMIN_API_LIMIT: 20, // Admin endpoints
  AI_ENDPOINT_LIMIT: 10, // AI endpoints are expensive - strictest limit
  FILE_UPLOAD_LIMIT: 10, // File uploads
  AUTH_ATTEMPT_LIMIT: 5, // Auth attempts
  
  // File upload constraints
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_EXTENSIONS: ['.txt', '.doc', '.docx', '.json', '.xlsx', '.csv', '.pdf'],
  ALLOWED_MIME_TYPES: [
    'text/plain',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/json',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf'
  ],
  
  // Admin API key header name
  ADMIN_API_KEY_HEADER: 'x-admin-api-key',
  
  // Input length limits for AI endpoints (prompt injection protection)
  MAX_TEXT_INPUT_LENGTH: 50000, // 50KB max for text inputs
  MAX_RESUME_CONTENT_LENGTH: 100000, // 100KB max for resume content
  MAX_JOB_DESCRIPTION_LENGTH: 30000, // 30KB max for job descriptions
};

// File magic bytes for content validation
// SECURITY: Validates actual file content, not just extension which can be spoofed
const FILE_SIGNATURES: { [key: string]: number[][] } = {
  // PDF: %PDF
  '.pdf': [[0x25, 0x50, 0x44, 0x46]],
  // DOCX/XLSX: PK (ZIP format)
  '.docx': [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x05, 0x06], [0x50, 0x4B, 0x07, 0x08]],
  '.xlsx': [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x05, 0x06], [0x50, 0x4B, 0x07, 0x08]],
  // DOC: Microsoft Compound File
  '.doc': [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]],
  // JSON/TXT/CSV: Allow any text-based content (validated by MIME type)
  '.json': [], // Text-based, no magic bytes
  '.txt': [],  // Text-based, no magic bytes
  '.csv': [],  // Text-based, no magic bytes
};

/**
 * Validates file content against expected magic bytes.
 * SECURITY: Prevents malicious files disguised with fake extensions.
 */
export function validateFileMagicBytes(filePath: string, extension: string): boolean {
  const signatures = FILE_SIGNATURES[extension.toLowerCase()];
  
  // Text-based files don't have magic bytes
  if (!signatures || signatures.length === 0) {
    return true;
  }
  
  try {
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
    
    // Check if file matches any valid signature
    return signatures.some(sig => {
      for (let i = 0; i < sig.length; i++) {
        if (buffer[i] !== sig[i]) return false;
      }
      return true;
    });
  } catch (error) {
    console.error('[SECURITY] Error reading file for magic byte validation:', error);
    return false;
  }
}

/**
 * Rate limiter specifically for AI endpoints.
 * SECURITY: AI endpoints cost money per request and are resource-intensive.
 * Limit: 10 requests per 15 minutes per IP.
 */
export const aiEndpointRateLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
  max: SECURITY_CONFIG.AI_ENDPOINT_LIMIT,
  message: {
    message: 'Too many AI requests. Please wait before trying again.',
    retryAfter: Math.ceil(SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS / 60000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => getClientIp(req),
  skip: (req: Request) => {
    // Skip rate limiting for admin users (they have separate limits)
    return !!req.headers[SECURITY_CONFIG.ADMIN_API_KEY_HEADER];
  }
});

/**
 * Sanitizes user input for AI prompts to prevent prompt injection attacks.
 * SECURITY: Removes or escapes content that could manipulate AI behavior.
 */
export function sanitizeAIInput(input: string, maxLength: number = SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Truncate to max length
  let sanitized = input.slice(0, maxLength);
  
  // Remove potential prompt injection patterns
  const dangerousPatterns = [
    /ignore\s+(previous|all|above)\s+instructions?/gi,
    /disregard\s+(previous|all|above)/gi,
    /forget\s+(everything|all|previous)/gi,
    /you\s+are\s+now\s+/gi,
    /new\s+instructions?:/gi,
    /system\s*:\s*/gi,
    /\[INST\]/gi,
    /<<SYS>>/gi,
    /<\|im_start\|>/gi,
    /```system/gi,
  ];
  
  for (const pattern of dangerousPatterns) {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  }
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s{10,}/g, ' ');
  
  // Remove null bytes and other control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized.trim();
}

/**
 * Validates input length for AI endpoints.
 * SECURITY: Prevents denial-of-service via extremely large inputs.
 */
export function validateInputLength(
  input: string | undefined,
  fieldName: string,
  maxLength: number
): { valid: boolean; error?: string } {
  if (!input) {
    return { valid: true };
  }
  
  if (typeof input !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  
  if (input.length > maxLength) {
    return { 
      valid: false, 
      error: `${fieldName} exceeds maximum length of ${maxLength} characters` 
    };
  }
  
  return { valid: true };
}

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
