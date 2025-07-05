import { Router } from 'express';
import { 
  createTender, 
  getTenders, 
  getTenderDetails, 
  updateTender 
} from '../controllers/tenderController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validator';
import * as Joi from 'joi';

const router = Router();

const tenderSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().min(20).required(),
  budget: Joi.number().positive().required(),
  deadline: Joi.date().required()
});

// Fixed route definitions
router.post('/', authenticateToken, validate(tenderSchema), createTender);
router.get('/', authenticateToken, getTenders);
router.get('/:id', authenticateToken, getTenderDetails);
router.put('/:id', authenticateToken, validate(tenderSchema), updateTender);

export default router;