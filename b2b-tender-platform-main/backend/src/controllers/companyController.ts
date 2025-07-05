import { Request, Response } from 'express';
import db from '../config/database';

export const getCompany = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); // <--- Ensure this is a number!
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }
    const company = await db('companies').where({ id }).first();
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [updated] = await db('companies').where({ id }).update(updates).returning('*');
    
    if (!updated) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const searchCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter q is required' });
      return;
    }

    const companies = await db('companies')
      .whereRaw(`search_vector @@ plainto_tsquery(?)`, [q])
      .limit(20);

    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const companies = await db('companies').select('*');
console.log('Companies in DB:', companies);