import { Router } from 'express';
import { PlatformController } from '../controllers/platformController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, PlatformController.createPlatform);
router.get('/', authenticateToken, PlatformController.getPlatforms);
router.get('/:id', authenticateToken, PlatformController.getPlatformById);
router.put('/:id', authenticateToken, PlatformController.updatePlatform);
router.delete('/:id', authenticateToken, PlatformController.deletePlatform);

export const platformRoutes = router;

