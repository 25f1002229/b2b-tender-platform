// src/types/express/index.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        companyId?: number;
        userId?: number;
        email?: string;
        [key: string]: any;
      };
    }
  }
}
export {};
