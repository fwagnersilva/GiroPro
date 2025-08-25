import { Router, Request, Response, NextFunction } from 'express';
import { NotificationsController } from '../controllers/notificationsController';
import { authMiddleware } from '../middlewares/auth';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Wrapper functions para converter métodos estáticos para RequestHandler
const createNotificationWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.createNotification(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

const getNotificationsWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.getNotifications(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

const markAsReadWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.markAsRead(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

const markAllAsReadWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.markAllAsRead(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

const deleteNotificationWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.deleteNotification(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

const getUnreadCountWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.getUnreadCount(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

const generateInsightNotificationWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.generateTestNotification(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

const generateTestNotificationWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.generateTestNotification(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

const processAutomaticNotificationsWrapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationsController.processAutomaticNotifications(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/v1/notifications
 * @desc Criar uma nova notificação
 * @access Private
 * @body {string} tipo - Tipo da notificação (info, warning, success, error, insight, recommendation)
 * @body {string} titulo - Título da notificação (max 100 chars)
 * @body {string} mensagem - Mensagem da notificação (max 500 chars)
 * @body {object} [dados_extras] - Dados extras opcionais
 */
router.post('/', createNotificationWrapper);

/**
 * @route GET /api/v1/notifications
 * @desc Buscar notificações do usuário
 * @access Private
 * @query {number} [limit=20] - Limite de notificações por página (1-100)
 * @query {number} [offset=0] - Offset para paginação
 * @query {boolean} [onlyUnread=false] - Buscar apenas notificações não lidas
 * @query {string} [tipo] - Filtrar por tipo de notificação
 */
router.get('/', getNotificationsWrapper);

/**
 * @route PUT /api/v1/notifications/:id/read
 * @desc Marcar notificação como lida
 * @access Private
 * @param {string} id - ID da notificação
 */
router.put('/:id/read', markAsReadWrapper);

/**
 * @route PUT /api/v1/notifications/read-all
 * @desc Marcar todas as notificações como lidas
 * @access Private
 */
router.put('/read-all', markAllAsReadWrapper);

/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Obter contagem de notificações não lidas
 * @access Private
 */
router.get('/unread-count', getUnreadCountWrapper);

/**
 * @route DELETE /api/v1/notifications/:id
 * @desc Deletar notificação
 * @access Private
 * @param {string} id - ID da notificação
 */
router.delete('/:id', deleteNotificationWrapper);

/**
 * @route POST /api/v1/notifications/process-automatic
 * @desc Processar notificações automáticas baseadas em insights
 * @access Private
 */
router.post('/process-automatic', processAutomaticNotificationsWrapper);

/**
 * @route POST /api/v1/notifications/test
 * @desc Gerar notificação de teste
 * @access Private
 */
router.post('/test', generateTestNotificationWrapper);

export default router;

