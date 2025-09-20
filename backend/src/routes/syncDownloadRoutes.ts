import { Router } from 'express';
import { downloadInitialData, downloadIncrementalData } from '../controllers/syncDownloadController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/download/initial', authenticateToken, downloadInitialData);
router.get('/download/incremental', authenticateToken, downloadIncrementalData);

export default router;


