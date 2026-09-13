import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Result } from './lib/result.js';
import { sanitizeInputMiddleware } from './lib/sanitizer.js';
import { globalLimiter } from './middleware/rate-limiter.js';
import apiV1Router from './routes/index.js';
import adminRouter from './routes/admin.routes.js';

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || 'https://chenille-flowers.vercel.app']
  : [/^https:\/\/.*\.vercel\.app$/, 'http://localhost:3000', 'http://127.0.0.1:3000'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 1. HTTP Security Headers (OWASP Baseline)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // API murni JSON, CSP diterapkan di level Next.js Web App
  })
);

// 2. Payload Buffer Limit (1MB Capping to prevent Large Payload Buffer Overflow DoS)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 3. Input Sanitization Middleware (Anti-XSS & Anti-Prototype Pollution)
app.use(sanitizeInputMiddleware);

// 4. Global Tiered Rate Limiter
app.use('/api', globalLimiter);

// Root endpoint to prevent "Cannot GET /" confusion
app.get('/', (req, res) => {
  res.json({
    message: 'Chenille Flowers Atelier API v1 is running.',
    health: '/api/health',
    endpoints: '/api/v1',
  });
});

// Health check endpoint (PRD and CrownJob pattern)
app.get('/api/health', (req, res) => {
  const result = Result.ok({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Chenille Flowers Atelier API',
    version: '2.2.0',
  });
  res.json(result);
});

// Mount /api/v1 routes
app.use('/api/v1', apiV1Router);

// Convenience direct mounts for admin maintenance
app.use('/api/admin', adminRouter);

// Centralized error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Unhandled Error]', err);
  const message = err?.message || 'Terjadi kesalahan internal pada server.';
  res.status(err.status || 500).json({
    success: false,
    error: message,
  });
});

export default app;
