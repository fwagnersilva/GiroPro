import { Router, Request, Response, NextFunction } from 'express';
import { SyncDownloadController } from '../controllers/syncDownloadController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/download/all', authenticateToken, asyncHandler(SyncDownloadController.downloadAll));
router.get('/download/since', authenticateToken, asyncHandler(SyncDownloadController.downloadSince));

export default router;
