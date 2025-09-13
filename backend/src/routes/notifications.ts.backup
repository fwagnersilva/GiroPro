import { Router } from 'express';
import { NotificationsController } from '../controllers/notificationsController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

/**
 * @route POST /api/v1/notifications
 * @desc Criar uma nova notificação
 * @access Private
 * @body {string} tipo - Tipo da notificação (info, warning, success, error, insight, recommendation)
 * @body {string} titulo - Título da notificação (max 100 chars)
 * @body {string} mensagem - Mensagem da notificação (max 500 chars)
 * @body {object} [dados_extras] - Dados extras opcionais
 */
router.post('/', NotificationsController.createNotification);

/**
 * @route GET /api/v1/notifications
 * @desc Buscar notificações do usuário
 * @access Private
 * @query {number} [limit=20] - Limite de notificações por página (1-100)
 * @query {number} [offset=0] - Offset para paginação
 * @query {boolean} [onlyUnread=false] - Buscar apenas notificações não lidas
 * @query {string} [tipo] - Filtrar por tipo de notificação
 */
router.get('/', NotificationsController.getNotifications);

/**
 * @route PUT /api/v1/notifications/:id/read
 * @desc Marcar notificação como lida
 * @access Private
 * @param {string} id - ID da notificação
 */
router.put('/:id/read', NotificationsController.markAsRead);

/**
 * @route PUT /api/v1/notifications/read-all
 * @desc Marcar todas as notificações como lidas
 * @access Private
 */
router.put('/read-all', NotificationsController.markAllAsRead);

/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Obter contagem de notificações não lidas
 * @access Private
 */
router.get('/unread-count', NotificationsController.getUnreadCount);

/**
 * @route DELETE /api/v1/notifications/:id
 * @desc Deletar notificação
 * @access Private
 * @param {string} id - ID da notificação
 */
router.delete('/:id', NotificationsController.deleteNotification);

/**
 * @route POST /api/v1/notifications/process-automatic
 * @desc Processar notificações automáticas baseadas em insights
 * @access Private
 */
router.post('/process-automatic', NotificationsController.processAutomaticNotifications);

/**
 * @route POST /api/v1/notifications/test
 * @desc Gerar notificação de teste
 * @access Private
 */
router.post('/test', NotificationsController.generateTestNotification);

export default router;

