// --- Express Request user property augmentation ---
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

import express, { Request, Response } from "express";
const router = express.Router();
const db = require("../db"); // Your Knex or DB instance
const authMiddleware = require("../middleware/auth"); // Sets req.user

// PUT /api/profile - Save (update) current user's company profile
router.put("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(401).json({ error: "Not authenticated or company not linked." });
    }

    const allowedFields = ["name", "industry", "description", "logo", "email"];
    const updates: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update." });
    }

    const [updated] = await db("companies")
      .where({ id: companyId })
      .update(updates)
      .returning("*");

    if (!updated) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;