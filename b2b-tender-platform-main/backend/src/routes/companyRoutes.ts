import { Router } from 'express';
import { getCompany, updateCompany, searchCompanies } from '../controllers/companyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:id', authenticateToken, getCompany);
router.put('/:id', authenticateToken, updateCompany);
router.get('/', authenticateToken, searchCompanies);

export default router;