import { Router } from 'express';
import { PlatformController } from '../controllers/platformController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, PlatformController.createPlatform);
router.get('/', authMiddleware, PlatformController.getPlatforms);
router.get('/:id', authMiddleware, PlatformController.getPlatformById);
router.put('/:id', authMiddleware, PlatformController.updatePlatform);
router.delete('/:id', authMiddleware, PlatformController.deletePlatform);

export const platformRoutes = router;

