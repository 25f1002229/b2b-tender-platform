import { Request, Response } from 'express';
import db from '../config/database';

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { tenderId } = req.params;
    const { proposal, quotedPrice } = req.body;

    const tender = await db('tenders')
      .where({ id: tenderId, status: 'active' })
      .first();
      
    if (!tender) {
      res.status(404).json({ error: 'Active tender not found' });
      return;
    }

    if (tender.company_id === req.user.companyId) {
      res.status(400).json({ error: 'Cannot apply to your own tender' });
      return;
    }

    const [application] = await db('applications').insert({
      tender_id: Number(tenderId),
      company_id: req.user.companyId,
      proposal,
      quoted_price: quotedPrice,
      status: 'submitted'
    }).returning('*');

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getApplicationsByTender = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { tenderId } = req.params;
    const tender = await db('tenders')
      .where({ id: tenderId, company_id: req.user.companyId })
      .first();
      
    if (!tender) {
      res.status(404).json({ error: 'Tender not found or access denied' });
      return;
    }

    const applications = await db('applications').where({ tender_id: Number(tenderId) });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getApplicationsByCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const applications = await db('applications')
      .where({ company_id: req.user.companyId });
      
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};