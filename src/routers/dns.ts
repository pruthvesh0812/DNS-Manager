import domainRoutes from './domain';
import express from 'express';
import { authenticateLoggedIn } from '../middlewares';
import authRoutes from './auth'
import recordRoutes from './records/recordOperatoins'

const router = express.Router();


router.use("/domain", authenticateLoggedIn, domainRoutes);
router.use("/auth", authRoutes)
router.use("/record", authenticateLoggedIn, recordRoutes)

export default router;
