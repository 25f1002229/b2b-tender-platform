import { Request, Response } from 'express';
import db from '../config/database'; // Adjust the import path to your db instance

/**
 * Controller to update (save) the current user's company profile.
 * Assumes req.user.companyId is set by your authentication middleware.
 */
export const saveProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure the user is authenticated and linked to a company
    const companyId = req.user?.companyId;
    if (!companyId) {
      res.status(401).json({ error: "Not authenticated or company not linked." });
      return;
    }

    // Whitelist allowed fields for update
    const allowedFields = ['name', 'industry', 'description', 'logo', 'email'];
    const updates: Record<string, any> = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No valid fields provided for update." });
      return;
    }

    // Update the company profile
    const [updated] = await db('companies')
      .where({ id: companyId })
      .update(updates)
      .returning('*');

    if (!updated) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
};