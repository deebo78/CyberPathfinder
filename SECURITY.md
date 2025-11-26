# Security Documentation

CyberPathfinder Security Architecture and Guidelines

## Table of Contents

- [Security Architecture](#security-architecture)
- [Authentication & Authorization](#authentication--authorization)
- [Rate Limiting](#rate-limiting)
- [Input Validation](#input-validation)
- [File Upload Security](#file-upload-security)
- [Error Handling](#error-handling)
- [Environment Configuration](#environment-configuration)
- [Security Headers](#security-headers)
- [Incident Response](#incident-response)
- [Security Contact](#security-contact)

---

## Security Architecture

### Overview

CyberPathfinder implements a defense-in-depth security strategy with multiple layers:

1. **Network Layer**: CORS restrictions, rate limiting, HTTPS enforcement
2. **Application Layer**: Input validation, authentication middleware, secure error handling
3. **Data Layer**: Parameterized queries (Drizzle ORM), sensitive data sanitization

### Key Security Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Security Middleware | `server/security.ts` | Centralized security functions |
| Rate Limiters | `server/index.ts` | Request throttling |
| Admin Authentication | `server/security.ts` | API key validation |
| Input Validation | `server/routes.ts` | Parameter sanitization |
| Error Sanitization | `server/security.ts` | Prevent info leakage |

---

## Authentication & Authorization

### Admin API Key Authentication

Admin endpoints require API key authentication via the `X-Admin-API-Key` header.

**Configuration:**

1. Generate a secure API key using one of these methods:

   **Option A: OpenSSL (Recommended)**
   ```bash
   openssl rand -base64 32
   ```
   
   **Option B: Node.js**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
   **Option C: Python**
   ```bash
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   
   **Key Requirements:**
   - Minimum 32 bytes (256 bits) of entropy
   - Use cryptographically secure random generation
   - Never use predictable values like timestamps or sequential numbers
   - Rotate keys at least quarterly in production

2. Set the environment variable:
   ```env
   ADMIN_API_KEY=your-generated-key-here
   ```

3. Include the header in admin requests:
   ```bash
   curl -H "X-Admin-API-Key: your-key" https://your-domain/api/statistics
   ```

### Protected Endpoints

| Endpoint | Protection Level | Notes |
|----------|-----------------|-------|
| `/api/statistics` | Admin Required | Full admin auth |
| `/api/search` | Admin Required | Full admin auth |
| `/api/import/*` | Admin Required | File imports |
| `/api/export/*` | Admin Required | Data exports |
| `/api/test-openai` | Diagnostic | Admin in production |
| `/api/test-database` | Diagnostic | Admin in production |
| `/api/test` | Diagnostic | Admin in production |

### Legacy Admin Flag

The `VITE_ENABLE_ADMIN` environment variable controls UI visibility of admin features but does NOT provide security. Always use `ADMIN_API_KEY` for actual protection.

---

## Rate Limiting

### Configuration

Rate limits are enforced per IP address using sliding window counters.

| Endpoint Type | Limit | Window | Purpose |
|--------------|-------|--------|---------|
| General API | 100 requests | 15 min | Prevent abuse |
| Standard API | 50 requests | 15 min | API protection |
| Admin API | 20 requests | 15 min | Admin protection |
| **AI Endpoints** | **10 requests** | **15 min** | **Cost control (strictest)** |
| File Uploads | 10 requests | 15 min | Resource protection |

### AI Endpoint Rate Limits

The following AI-powered endpoints have the strictest limits (10 req/15min) because they:
- Incur per-request costs with OpenAI
- Are resource-intensive
- Are common targets for abuse

**Protected AI Endpoints:**

- `/api/analyze-profile` - Career profile analysis
- `/api/analyze-vacancy` - Job posting analysis  
- `/api/upload-resume` - Resume parsing and analysis
- `/api/extract-document` - Document text extraction
- `/api/track-recommendation/:id` - Detailed track recommendations
- `/api/work-role-match/:id` - Work role matching analysis

### Customizing Limits

Modify `SECURITY_CONFIG` in `server/security.ts`:

```typescript
export const SECURITY_CONFIG = {
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  GENERAL_API_LIMIT: 100,
  API_ENDPOINT_LIMIT: 50,
  ADMIN_API_LIMIT: 20,
  AI_ENDPOINT_LIMIT: 10, // Strictest limit for AI endpoints
  FILE_UPLOAD_LIMIT: 10,
};
```

---

## Prompt Injection Protection

### Overview

AI endpoints are protected against prompt injection attacks where users attempt to manipulate AI behavior through specially crafted inputs.

### Protections Implemented

1. **Input Length Limits**: All AI inputs are limited to prevent denial-of-service:
   - General text: 50,000 characters
   - Resume content: 100,000 characters
   - Job descriptions: 30,000 characters

2. **Pattern Filtering**: Known injection patterns are automatically filtered:
   - "ignore previous instructions"
   - "disregard all above"
   - "you are now..."
   - System prompt markers (`[INST]`, `<<SYS>>`, etc.)

3. **Content Sanitization**: All user inputs are sanitized before being passed to AI prompts:
   - Control characters removed
   - Excessive whitespace normalized
   - Filtered patterns replaced with `[FILTERED]`

4. **Optional Field Preservation**: Optional fields use `sanitizeOrUndefined` helper to ensure:
   - Empty/undefined inputs remain undefined (not coerced to empty strings)
   - Whitespace-only inputs become undefined
   - Non-empty inputs are properly sanitized
   - Prevents empty string payloads from triggering unnecessary AI prompt segments

### Implementation

```typescript
import { sanitizeAIInput, validateInputLength, SECURITY_CONFIG } from "./security";

// Validate length
const check = validateInputLength(input, 'fieldName', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH);
if (!check.valid) {
  return res.status(400).json({ message: check.error });
}

// Sanitize content
const sanitized = sanitizeAIInput(input);
```

### Limitations

Prompt injection protection reduces risk but cannot eliminate it entirely. Defense in depth through:
- Rate limiting (limits damage from successful injections)
- Output validation (verify AI responses meet expected format)
- Logging and monitoring (detect unusual patterns)

---

## Input Validation

### Numeric Parameters

All route parameters parsed with `parseInt()` are validated to prevent NaN issues:

```typescript
function safeParseId(value: string): number | null {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return null;
  }
  return parsed;
}
```

### Request Body Validation

All POST/PUT endpoints use Zod schemas for validation:

```typescript
const profileSchema = z.object({
  experience: z.string().optional(),
  education: z.string().optional(),
  // ...
});
```

### Database Queries

All database queries use Drizzle ORM's parameterized queries, preventing SQL injection.

**Audit Status (November 2025):** All database operations in `server/storage.ts` reviewed and confirmed safe:

| Query Type | Count | Status |
|------------|-------|--------|
| Drizzle ORM queries | 40+ | Safe (auto-parameterized) |
| Raw SQL with `sql` template | 4 | Safe (parameterized via tagged template) |
| String concatenation | 0 | None found |

**Safe Patterns Used:**

```typescript
// Safe - Drizzle ORM methods (auto-parameterized)
await db.select().from(categories).where(eq(categories.id, id));

// Safe - sql tagged template literal (parameterized)
await db.execute(sql`SELECT * FROM users WHERE id = ${userId}`);
```

**Patterns to Avoid:**

```typescript
// UNSAFE - Never do this!
await db.execute(`SELECT * FROM users WHERE id = ${userId}`);
```

---

## File Upload Security

### Allowed File Types

| Extension | MIME Type | Magic Bytes | Purpose |
|-----------|-----------|-------------|---------|
| `.txt` | text/plain | N/A (text) | Resume/job posting text |
| `.csv` | text/csv | N/A (text) | Data imports |
| `.doc` | application/msword | `D0 CF 11 E0` | Word documents |
| `.docx` | application/vnd.openxmlformats-... | `50 4B 03 04` | Word documents |
| `.json` | application/json | N/A (text) | NICE Framework imports |
| `.xlsx` | application/vnd.openxmlformats-... | `50 4B 03 04` | Data imports |
| `.pdf` | application/pdf | `25 50 44 46` | Resume uploads |

### Security Measures

1. **Extension Validation**: Checked before processing
2. **MIME Type Validation**: Secondary check
3. **Magic Bytes Validation**: File content signature verification
4. **File Size Limit**: 10MB maximum
5. **Single File**: Only one file per request
6. **Temp File Cleanup**: Files removed after processing
7. **Filename Sanitization**: Path traversal prevention

### Magic Bytes Validation

File content is validated against expected magic bytes (file signatures) to prevent:
- Malicious files with spoofed extensions (e.g., `.exe` renamed to `.pdf`)
- Zip bombs disguised as documents
- Polyglot files

```typescript
// Validates that file content matches expected type
if (!validateFileMagicBytes(filePath, extension)) {
  fs.unlinkSync(filePath);
  return res.status(400).json({ message: "File content does not match file extension" });
}
```

### Configuration

Modify in `server/security.ts`:

```typescript
MAX_FILE_SIZE_MB: 10,
ALLOWED_FILE_EXTENSIONS: ['.txt', '.doc', '.docx', '.json', '.xlsx', '.csv', '.pdf'],
```

---

## Error Handling

### Production Error Sanitization

In production, error responses are sanitized to prevent information leakage:

```typescript
// Development: Full error details
{ message: "ENOENT: no such file or directory", code: "ENOENT" }

// Production: Generic message
{ message: "An error occurred. Please try again.", code: "INTERNAL_ERROR" }
```

### Error Categories

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `NOT_FOUND` | Resource not found |
| `AUTH_REQUIRED` | Authentication needed |
| `ACCESS_DENIED` | Permission denied |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Generic server error |

---

## Environment Configuration

### Required Environment Variables

| Variable | Purpose | Sensitive |
|----------|---------|-----------|
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `OPENAI_API_KEY` | OpenAI API access | Yes |
| `ADMIN_API_KEY` | Admin authentication | Yes |
| `NODE_ENV` | Environment mode | No |
| `VITE_ENABLE_ADMIN` | Admin UI visibility | No |

### Security Notes

1. **Never use `VITE_` prefix for secrets** - These are exposed to the client
2. **Use strong, random API keys** - 256 bits minimum (32 bytes hex)
3. **Rotate keys regularly** - At least quarterly for production

---

## Security Headers

### Helmet Configuration

The application uses Helmet.js with the following security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | Configured | XSS prevention |
| Strict-Transport-Security | 1 year | HTTPS enforcement |
| X-Frame-Options | DENY | Clickjacking prevention |
| X-Content-Type-Options | nosniff | MIME type sniffing prevention |

### CSP Directives

```javascript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "ws:", "wss:"],
  }
}
```

**Note**: `unsafe-inline` and `unsafe-eval` are required for Vite in development. Consider tightening for production deployments.

---

## Logging Security

### Sensitive Data Handling

The logging system automatically redacts sensitive fields:

- Passwords
- API keys
- Tokens
- Session data
- Email addresses
- Phone numbers

### Audit Logging

Admin actions are logged with:
- Timestamp
- Client IP
- Endpoint accessed
- Success/failure status

---

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| Critical | Active exploit, data breach | Immediate |
| High | Vulnerability with exploit potential | 24 hours |
| Medium | Security improvement needed | 1 week |
| Low | Best practice recommendation | 1 month |

### Response Procedures

1. **Identify**: Confirm the security issue
2. **Contain**: Limit impact (disable features if needed)
3. **Assess**: Determine scope and severity
4. **Remediate**: Apply fixes
5. **Review**: Document and learn

### Immediate Actions for Critical Issues

1. Rotate all API keys and secrets
2. Review recent access logs
3. Notify affected users if data was exposed
4. Document timeline of events

---

## Security Contact

For security vulnerabilities or concerns:

1. **Do not** disclose publicly before contacting us
2. Email security issues directly to the development team
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

---

## Security Checklist

Before deployment, verify:

- [ ] `ADMIN_API_KEY` is set to a strong, unique value
- [ ] `NODE_ENV` is set to `production`
- [ ] HTTPS is enforced
- [ ] Rate limiting is enabled
- [ ] Diagnostic endpoints are protected
- [ ] Database connection uses SSL
- [ ] All dependencies are updated
- [ ] Error messages are sanitized
- [ ] Logs don't contain sensitive data
