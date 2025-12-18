import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import { SECURITY_CONFIG, sanitizeError, sanitizeLogData, getClientIp } from "./security";

const app = express();

// Trust proxy for rate limiting and IP detection behind Replit's infrastructure
// SECURITY: Required for accurate client IP detection when behind a proxy
app.set('trust proxy', 1);

// CORS configuration
// SECURITY: Restrict origins in production to prevent unauthorized cross-origin requests
// In development, allow Replit's dynamic dev URLs
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
    if (!origin) return callback(null, true);
    
    if (isProduction) {
      // Production: Only allow specific domains
      const productionOrigins = [
        'https://cyber-pathfinder-dmetheredge.replit.app',
        // Add any additional production domains here
      ];
      
      if (productionOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[SECURITY] Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development: Allow Replit dev URLs, localhost, and local IPs
      const isReplitDev = origin.includes('.replit.dev') || origin.includes('.replit.app');
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('0.0.0.0');
      
      if (isReplitDev || isLocalhost) {
        callback(null, true);
      } else {
        console.warn(`[SECURITY] Blocked CORS request from unknown origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-API-Key']
}));

// Rate limiting configuration
// SECURITY: Prevents abuse, DoS attacks, and runaway API costs

// General rate limiter for all requests
const generalLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
  max: SECURITY_CONFIG.GENERAL_API_LIMIT,
  message: { message: 'Too many requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

// Stricter rate limiter for AI-powered endpoints (these cost money)
const aiEndpointLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
  max: SECURITY_CONFIG.AI_ENDPOINT_LIMIT,
  message: { message: 'AI analysis limit reached. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
  max: SECURITY_CONFIG.FILE_UPLOAD_LIMIT,
  message: { message: 'File upload limit reached. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
});

// Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// Apply stricter limits to AI endpoints
app.use('/api/analyze-profile', aiEndpointLimiter);
app.use('/api/analyze-vacancy', aiEndpointLimiter);
app.use('/api/upload-resume', aiEndpointLimiter);
app.use('/api/extract-document', aiEndpointLimiter);
app.use('/api/track-recommendation', aiEndpointLimiter);
app.use('/api/work-role-match', aiEndpointLimiter);

// Apply upload limits
app.use('/api/upload-resume', uploadLimiter);
app.use('/api/extract-document', uploadLimiter);
app.use('/api/import', uploadLimiter);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware with sanitization
// SECURITY: Prevents logging of sensitive data like passwords, tokens, and PII
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Create basic log line without response body for security
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Only log sanitized response data in development and only if not sensitive
      if (process.env.NODE_ENV !== 'production' && capturedJsonResponse) {
        // Sanitize response before logging
        const sanitized = sanitizeLogData(capturedJsonResponse);
        const sanitizedStr = JSON.stringify(sanitized);
        
        // Only append if response is small and not an error with stack trace
        if (sanitizedStr.length < 200 && !sanitizedStr.includes('stack')) {
          logLine += ` :: ${sanitizedStr}`;
        }
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  // SECURITY: Sanitizes error responses in production to prevent information leakage
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Log the full error for debugging (server-side only)
    console.error(`[ERROR] ${req.method} ${req.path}:`, {
      status,
      message: err.message,
      // Only log stack in development
      ...(isProduction ? {} : { stack: err.stack })
    });
    
    // Sanitize error response for client
    const sanitizedError = sanitizeError(err, isProduction);
    
    // Send response (don't throw after sending!)
    // SECURITY FIX: Previous code threw after res.json() which caused unhandled errors
    res.status(status).json({ 
      message: sanitizedError.message,
      ...(sanitizedError.code ? { code: sanitizedError.code } : {})
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
