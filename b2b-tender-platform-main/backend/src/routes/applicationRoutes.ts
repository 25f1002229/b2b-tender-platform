import { Router } from 'express';
import { 
  submitApplication, 
  getApplicationsByTender, 
  getApplicationsByCompany 
} from '../controllers/applicationController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validator';
import * as Joi from 'joi';

const router = Router();

const applicationSchema = Joi.object({
  proposal: Joi.string().min(10).required(),
  quotedPrice: Joi.number().positive().required()
});

// Fixed route definitions
router.post('/:tenderId', authenticateToken, validate(applicationSchema), submitApplication);
router.get('/by-tender/:tenderId', authenticateToken, getApplicationsByTender);
router.get('/by-company', authenticateToken, getApplicationsByCompany);

export default router;