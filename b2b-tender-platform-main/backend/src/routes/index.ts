import { Router } from 'express';
import authRoutes from './authRoutes';
import companyRoutes from './companyRoutes';
import tenderRoutes from './tenderRoutes';
import applicationRoutes from './applicationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/tenders', tenderRoutes);
router.use('/applications', applicationRoutes);

export default router;