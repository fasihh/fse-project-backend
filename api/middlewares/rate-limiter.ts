import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// General rate limiter for all routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later.',
});

// Stricter limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later.',
});

// Custom limiter for specific routes
export const createCustomLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  });
};

// Skip rate limiting for certain IPs (e.g., your own IP during development)
export const skipRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const skipIps = process.env.SKIP_RATE_LIMIT_IPS?.split(',') || [];
  if (skipIps.includes(req.ip as string)) {
    return next();
  }
  return generalLimiter(req, res, next);
};
