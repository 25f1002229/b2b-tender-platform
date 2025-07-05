import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import db from '../config/database';

// --- Registration: case-sensitive email check ---
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, companyName } = req.body;

    // Case-sensitive check for existing user
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.transaction(async (trx) => {
      const [company] = await trx('companies').insert({
        name: companyName
      }).returning('*');
      
      const [user] = await trx('users').insert({
        email,
        password_hash: hashedPassword,
        company_id: company.id
      }).returning('*');
      
      return { user, company };
    });
    
    const token = jwt.sign(
      { userId: result.user.id, companyId: result.company.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ token, user: result.user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// --- Login: case-sensitive email check ---
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    // Case-sensitive email lookup
    const user = await db('users').where({ email }).first();

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, companyId: user.company_id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
