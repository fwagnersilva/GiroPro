import { Router } from 'express';
import { downloadInitialData, downloadIncrementalData } from '../controllers/syncDownloadController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get("/download/initial", authMiddleware, downloadInitialData);
router.get("/download/incremental", authMiddleware, downloadIncrementalData);

export default router;


