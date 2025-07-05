import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();
const db = require('../db'); // Your Knex or DB instance
const authMiddleware = require('../middleware/auth'); // Sets req.user

// GET /api/profile - Get current user's company profile
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(401).json({ message: "Not authenticated or company not linked" });
    }
    const company = await db('companies').where({ id: companyId }).first();
    if (!company) return res.status(404).json({ message: "Profile not found" });
    res.json(company);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// PUT /api/profile - Update current user's company profile
router.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(401).json({ message: "Not authenticated or company not linked" });
    }
    // Whitelist fields to prevent unwanted updates
    const allowedFields = ['name', 'industry', 'description', 'logo', 'logo_url', 'email'];
    const updates: Record<string, any> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update." });
    }
    const [updated] = await db('companies')
      .where({ id: companyId })
      .update(updates)
      .returning('*');
    if (!updated) return res.status(404).json({ message: "Profile not found" });
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;