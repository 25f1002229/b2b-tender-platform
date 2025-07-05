import { Request, Response } from 'express';
import db from '../config/database';

// Update the current user's company profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use camelCase as per your middleware
    const companyId = req.user?.companyId;
    if (!companyId) {
      res.status(401).json({ error: 'Not authenticated or company not linked.' });
      return;
    }

    const allowedFields = ['name', 'industry', 'description', 'logo', 'logo_url', 'email'];
    const updates: Record<string, any> = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No valid fields provided for update.' });
      return;
    }

    const [updated] = await db('companies')
      .where({ id: Number(companyId) })
      .update(updates)
      .returning('*');

    if (!updated) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get the current user's company profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      res.status(401).json({ error: 'Not authenticated or company not linked.' });
      return;
    }

    const company = await db('companies').where({ id: Number(companyId) }).first();
    if (!company) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};