import { Router } from "express";
import { GoalsController } from "../controllers/goalsController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

/**
 * @route GET /api/v1/goals
 * @desc Listar metas do usuário com paginação e filtros
 * @access Private
 * @query {number} [page=1] - Página atual
 * @query {number} [limit=20] - Itens por página
 * @query {string} [id_veiculo] - UUID do veículo para filtrar
 * @query {string} [tipo_meta] - Tipo de meta (Faturamento, Quilometragem, Jornadas, Economia, Lucro)
 * @query {string} [status] - Status da meta (Ativa, Pausada, Concluida, Expirada)
 * @query {string} [periodo] - Período da meta (Semanal, Mensal, Trimestral, Anual)
 * @query {string} [sort_by=data_inicio] - Campo para ordenação
 * @query {string} [sort_order=desc] - Ordem de classificação (asc, desc)
 */
router.get("/", GoalsController.getAll);

/**
 * @route POST /api/v1/goals
 * @desc Criar nova meta
 * @access Private
 * @body {string} [id_veiculo] - UUID do veículo (opcional - meta geral se não especificado)
 * @body {string} titulo - Título da meta
 * @body {string} [descricao] - Descrição da meta
 * @body {string} tipo_meta - Tipo de meta (Faturamento, Quilometragem, Jornadas, Economia, Lucro)
 * @body {string} periodo - Período da meta (Semanal, Mensal, Trimestral, Anual)
 * @body {number} valor_objetivo - Valor objetivo da meta
 * @body {string} data_inicio - Data de início (ISO 8601)
 * @body {string} data_fim - Data de fim (ISO 8601)
 */
router.post("/", GoalsController.create);



/**
 * @route GET /api/v1/goals/:id
 * @desc Obter meta específica por ID com histórico de progresso
 * @access Private
 * @param {string} id - UUID da meta
 */
router.get("/:id", GoalsController.getById);

/**
 * @route PUT /api/v1/goals/:id
 * @desc Atualizar meta específica
 * @access Private
 * @param {string} id - UUID da meta
 * @body {string} [id_veiculo] - UUID do veículo
 * @body {string} [titulo] - Título da meta
 * @body {string} [descricao] - Descrição da meta
 * @body {string} [tipo_meta] - Tipo de meta
 * @body {string} [periodo] - Período da meta
 * @body {number} [valor_objetivo] - Valor objetivo da meta
 * @body {string} [data_inicio] - Data de início (ISO 8601)
 * @body {string} [data_fim] - Data de fim (ISO 8601)
 * @body {string} [status] - Status da meta (Ativa, Pausada, Concluida, Expirada)
 */
router.put("/:id", GoalsController.update);

/**
 * @route DELETE /api/v1/goals/:id
 * @desc Excluir meta específica (soft delete)
 * @access Private
 * @param {string} id - UUID da meta
 */
router.delete("/:id", GoalsController.delete);

export default router;


