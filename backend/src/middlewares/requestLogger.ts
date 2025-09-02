import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] Request:`, req.method, req.originalUrl);
  const originalJson = res.json;
  res.json = function (body?: any) {
    console.log(`[${new Date().toISOString()}] Response:`, req.method, req.originalUrl, 
      body ? `- Body: ${JSON.stringify(body)}` : 
      req.originalUrl.includes("login") || req.originalUrl.includes("register") ? "- Body: [REDACTED]" : "");
    return originalJson.call(this, body);
  };
  next();
};

