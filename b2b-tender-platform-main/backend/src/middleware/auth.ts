import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// (Optional) Extend Express Request type for TypeScript safety
declare module 'express' {
  interface Request {
    user?: any; // Replace 'any' with your custom user type if available
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    // Fail fast if secret is not set
    throw new Error('JWT_SECRET environment variable is not set');
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      // 401 is more standard for invalid/expired tokens
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // (Optional) Validate payload structure here if needed
    // if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
    //   return res.status(401).json({ error: 'Invalid token payload' });
    // }

    req.user = decoded;
    next();
  });
};