import { Router } from 'express';
import { 
  uploadOfflineData, 
  downloadInitialData, 
  downloadIncrementalData,
  getLastSyncTimestamp 
} from '../controllers/syncController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Upload de dados offline (batch processing)
router.post('/upload', uploadOfflineData);

// Download de dados para sincronização inicial
router.get('/download/initial', downloadInitialData);

// Download de dados para sincronização incremental
router.get('/download/incremental', downloadIncrementalData);

// Obter timestamp da última sincronização
router.get('/last-sync', getLastSyncTimestamp);

export { router as syncRoutes };

