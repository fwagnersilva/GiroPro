import { Router } from 'express';
import { SyncDownloadController } from '../controllers/syncDownloadController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Rotas protegidas que requerem autenticação
router.get('/download/all', authMiddleware, SyncDownloadController.downloadAll);
router.get('/download/since', authMiddleware, SyncDownloadController.downloadSince);

export { router as syncDownloadRoutes };
