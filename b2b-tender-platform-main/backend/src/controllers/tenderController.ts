import { Request, Response } from 'express';
import db from '../config/database';

export const createTender = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description, budget, deadline } = req.body;
    const [tender] = await db('tenders').insert({
      title,
      description,
      budget,
      deadline: new Date(deadline),
      company_id: req.user.companyId,
      status: 'active'
    }).returning('*');

    res.status(201).json(tender);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTenders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const tenders = await db('tenders')
      .where('status', 'active')
      .limit(Number(limit))
      .offset(offset)
      .orderBy('created_at', 'desc');

    res.json(tenders);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTenderDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tender = await db('tenders').where({ id }).first();
    
    if (!tender) {
      res.status(404).json({ error: 'Tender not found' });
      return;
    }
    
    res.json(tender);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateTender = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;
    
    const tender = await db('tenders')
      .where({ id, company_id: req.user.companyId })
      .first();
      
    if (!tender) {
      res.status(404).json({ error: 'Tender not found or access denied' });
      return;
    }

    const [updated] = await db('tenders')
      .where({ id })
      .update(updates)
      .returning('*');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};