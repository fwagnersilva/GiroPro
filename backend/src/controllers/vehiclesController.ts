import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { veiculos } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';

// Interfaces
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  message?: string;
}

// Enums para tipos de veículos e combustíveis
enum TipoVeiculo {
  CARRO = 'Carro',
  MOTO = 'Moto',
  CAMINHAO = 'Caminhão',
  VAN = 'Van',
  UTILITARIO = 'Utilitário'
}

enum TipoCombustivel {
  GASOLINA = 'Gasolina',
  ETANOL = 'Etanol', 
  DIESEL = 'Diesel',
  GNV = 'GNV',
  FLEX = 'Flex',
  ELETRICO = 'Elétrico',
  HIBRIDO = 'Híbrido'
}

// Schemas de validação
const createVehicleSchema = z.object({
  marca: z.string()
    .min(1, 'Marca é obrigatória')
    .max(50, 'Marca deve ter no máximo 50 caracteres')
    .trim(),
  modelo: z.string()
    .min(1, 'Modelo é obrigatório')
    .max(50, 'Modelo deve ter no máximo 50 caracteres')
    .trim(),
  ano: z.number()
    .int('Ano deve ser um número inteiro')
    .min(1900, 'Ano deve ser maior que 1900')
    .max(new Date().getFullYear() + 1, 'Ano não pode ser superior ao próximo ano'),
  placa: z.string()
    .min(7, 'Placa deve ter pelo menos 7 caracteres')
    .max(8, 'Placa deve ter no máximo 8 caracteres')
    .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, 'Formato de placa inválido (ex: ABC1234 ou ABC1D23)')
    .transform(val => val.toUpperCase())
    .optional(),
  cor: z.string()
    .max(30, 'Cor deve ter no máximo 30 caracteres')
    .trim()
    .optional(),
  tipo_veiculo: z.nativeEnum(TipoVeiculo)
    .default(TipoVeiculo.CARRO),
  tipoCombustivel: z.nativeEnum(TipoCombustivel)
    .default(TipoCombustivel.FLEX),
  consumo_medio: z.number()
    .positive('Consumo médio deve ser positivo')
    .max(50, 'Consumo médio deve ser realista (máximo 50 km/l)')
    .optional(),
  capacidade_tanque: z.number()
    .positive('Capacidade do tanque deve ser positiva')
    .max(200, 'Capacidade do tanque deve ser realista (máximo 200L)')
    .optional(),
  kmAtual: z.number()
    .min(0, 'Quilometragem atual não pode ser negativa')
    .max(9999999, 'Quilometragem atual muito alta')
    .optional(),
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .trim()
    .optional()
});

const updateVehicleSchema = createVehicleSchema.partial();

const queryParamsSchema = z.object({
  tipo_veiculo: z.nativeEnum(TipoVeiculo).optional(),
  tipoCombustivel: z.nativeEnum(TipoCombustivel).optional(),
  ativo: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0)
});

export class VehiclesController {
  /**
   * Valida se o usuário está autenticado
   */
  private static validateAuth(req: AuthenticatedRequest): string | null {
    return req.user?.id || null;
  }

  /**
   * Retorna resposta de erro padronizada
   */
  private static errorResponse(res: Response, status: number, message: string, details?: any): Response {
    return res.status(status).json({
      success: false,
      error: { message, details }
    });
  }

  /**
   * Retorna resposta de sucesso padronizada
   */
  private static successResponse<T>(res: Response, data?: T, message?: string, status: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message })
    };
    return res.status(status).json(response);
  }

  /**
   * Busca e valida se o veículo pertence ao usuário
   */
  private static async findAndValidateVehicle(vehicleId: string, userId: string) {
    try {
      const vehicles = await db
        .select()
        .from(veiculos)
        .where(
          and(
            eq(veiculos.id, vehicleId),
            isNull(veiculos.deletedAt)
          )
        );

      if (vehicles.length === 0) {
        return { vehicle: null, error: 'Veículo não encontrado' };
      }

      if (vehicles[0].idUsuario !== userId) {
        return { vehicle: null, error: 'Acesso negado' };
      }

      return { vehicle: vehicles[0], error: null };
    } catch (error) {
      return { vehicle: null, error: 'Erro ao buscar veículo' };
    }
  }

  /**
   * Listar todos os veículos do usuário
   */
  static async getAll(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const queryValidation = queryParamsSchema.safeParse(req.query);
      if (!queryValidation.success) {
        return VehiclesController.errorResponse(
          res,
          400,
          'Parâmetros de consulta inválidos',
          queryValidation.error.errors
        );
      }

      const { tipo_veiculo, tipoCombustivel, ativo, limit, offset } = queryValidation.data;

      // Construir condições de filtro
      let whereConditions = and(
        eq(veiculos.idUsuario, userId),
        isNull(veiculos.deletedAt)
      );

      if (tipo_veiculo) {
        whereConditions = and(whereConditions, eq(veiculos.tipo_veiculo, tipo_veiculo));
      }

      if (tipoCombustivel) {
        whereConditions = and(whereConditions, eq(veiculos.tipoCombustivel, tipoCombustivel));
      }

      if (ativo !== undefined) {
        whereConditions = and(whereConditions, eq(veiculos.ativo, ativo));
      }

      // Buscar veículos com paginação
      const [userVehicles, totalCount] = await Promise.all([
        db
          .select()
          .from(veiculos)
          .where(whereConditions)
          .limit(limit)
          .offset(offset)
          .orderBy(veiculos.createdAt),
        db
          .select({ count: veiculos.id })
          .from(veiculos)
          .where(whereConditions)
      ]);

      const responseData = {
        vehicles: userVehicles,
        pagination: {
          total: totalCount.length,
          limit,
          offset,
          has_more: totalCount.length > offset + limit
        },
        filters: {
          tipo_veiculo: tipo_veiculo || null,
          tipoCombustivel: tipoCombustivel || null,
          ativo: ativo !== undefined ? ativo : null
        }
      };

      return VehiclesController.successResponse(res, responseData);

    } catch (error: any) {
      console.error('Erro ao buscar veículos:', error);
      return VehiclesController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Criar novo veículo
   */
  static async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const validation = createVehicleSchema.safeParse(req.body);
      if (!validation.success) {
        return VehiclesController.errorResponse(
          res,
          400,
          'Dados inválidos',
          validation.error.errors
        );
      }

      // Verificar se já existe veículo com a mesma placa (se fornecida)
      if (validation.data.placa) {
        const existingVehicle = await db
          .select({ id: veiculos.id })
          .from(veiculos)
          .where(
            and(
              eq(veiculos.placa, validation.data.placa),
              eq(veiculos.idUsuario, userId),
              isNull(veiculos.deletedAt)
            )
          );

        if (existingVehicle.length > 0) {
          return VehiclesController.errorResponse(
            res,
            409,
            'Já existe um veículo cadastrado com esta placa'
          );
        }
      }

      const vehicleData = {
        ...validation.data,
        idUsuario: userId,
        ativo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newVehicles = await db
        .insert(veiculos)
        .values(vehicleData)
        .returning();

      return VehiclesController.successResponse(
        res,
        newVehicles[0],
        'Veículo criado com sucesso',
        201
      );

    } catch (error: any) {
      console.error('Erro ao criar veículo:', error);
      
      // Tratar erros específicos do banco de dados
      if (error.code === '23505') { // Unique constraint violation
        return VehiclesController.errorResponse(res, 409, 'Já existe um veículo com estes dados');
      }
      
      return VehiclesController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Buscar veículo por ID
   */
  static async getById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, 'ID do veículo é obrigatório');
      }

      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);
      
      if (error) {
        const status = error === 'Veículo não encontrado' ? 404 : 403;
        return VehiclesController.errorResponse(res, status, error);
      }

      return VehiclesController.successResponse(res, vehicle);

    } catch (error: any) {
      console.error('Erro ao buscar veículo:', error);
      return VehiclesController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Atualizar veículo
   */
  static async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, 'ID do veículo é obrigatório');
      }

      const validation = updateVehicleSchema.safeParse(req.body);
      if (!validation.success) {
        return VehiclesController.errorResponse(
          res,
          400,
          'Dados inválidos',
          validation.error.errors
        );
      }

      // Verificar se o veículo existe e pertence ao usuário
      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);
      
      if (error) {
        const status = error === 'Veículo não encontrado' ? 404 : 403;
        return VehiclesController.errorResponse(res, status, error);
      }

      // Verificar conflito de placa (se está sendo alterada)
      if (validation.data.placa && validation.data.placa !== vehicle!.placa) {
        const existingVehicle = await db
          .select({ id: veiculos.id })
          .from(veiculos)
          .where(
            and(
              eq(veiculos.placa, validation.data.placa),
              eq(veiculos.idUsuario, userId),
              isNull(veiculos.deletedAt)
            )
          );

        if (existingVehicle.length > 0) {
          return VehiclesController.errorResponse(
            res,
            409,
            'Já existe um veículo cadastrado com esta placa'
          );
        }
      }

      const updateData = {
        ...validation.data,
        updatedAt: new Date().toISOString()
      };

      const updatedVehicles = await db
        .update(veiculos)
        .set(updateData)
        .where(eq(veiculos.id, id))
        .returning();

      return VehiclesController.successResponse(
        res,
        updatedVehicles[0],
        'Veículo atualizado com sucesso'
      );

    } catch (error: any) {
      console.error('Erro ao atualizar veículo:', error);
      
      if (error.code === '23505') {
        return VehiclesController.errorResponse(res, 409, 'Já existe um veículo com estes dados');
      }
      
      return VehiclesController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Excluir veículo (soft delete)
   */
  static async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, 'ID do veículo é obrigatório');
      }

      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);
      
      if (error) {
        const status = error === 'Veículo não encontrado' ? 404 : 403;
        return VehiclesController.errorResponse(res, status, error);
      }

      // Verificar se o veículo tem jornadas associadas
      // Esta verificação pode ser implementada conforme necessário
      // const hasJourneys = await checkVehicleHasJourneys(id);
      // if (hasJourneys) {
      //   return VehiclesController.errorResponse(
      //     res, 
      //     409, 
      //     'Não é possível excluir veículo com jornadas associadas'
      //   );
      // }

      // Soft delete
      await db
        .update(veiculos)
        .set({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .where(eq(veiculos.id, id));

      return VehiclesController.successResponse(
        res,
        undefined,
        'Veículo excluído com sucesso',
        204
      );

    } catch (error: any) {
      console.error('Erro ao excluir veículo:', error);
      return VehiclesController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Reativar veículo
   */
  static async activate(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, 'ID do veículo é obrigatório');
      }

      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);
      
      if (error) {
        const status = error === 'Veículo não encontrado' ? 404 : 403;
        return VehiclesController.errorResponse(res, status, error);
      }

      const updatedVehicles = await db
        .update(veiculos)
        .set({
          ativo: true,
          updatedAt: new Date().toISOString()
        })
        .where(eq(veiculos.id, id))
        .returning();

      return VehiclesController.successResponse(
        res,
        updatedVehicles[0],
        'Veículo reativado com sucesso'
      );

    } catch (error: any) {
      console.error('Erro ao reativar veículo:', error);
      return VehiclesController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Desativar veículo
   */
  static async deactivate(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, 'ID do veículo é obrigatório');
      }

      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);
      
      if (error) {
        const status = error === 'Veículo não encontrado' ? 404 : 403;
        return VehiclesController.errorResponse(res, status, error);
      }

      const updatedVehicles = await db
        .update(veiculos)
        .set({
          ativo: false,
          updatedAt: new Date().toISOString()
        })
        .where(eq(veiculos.id, id))
        .returning();

      return VehiclesController.successResponse(
        res,
        updatedVehicles[0],
        'Veículo desativado com sucesso'
      );

    } catch (error: any) {
      console.error('Erro ao desativar veículo:', error);
      return VehiclesController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }

  /**
   * Obter estatísticas dos veículos do usuário
   */
  static async getStatistics(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, 'Usuário não autenticado');
      }

      // Buscar estatísticas gerais
      const [totalVehicles] = await db
        .select({
          total: veiculos.id,
          ativo: veiculos.ativo,
          tipo_veiculo: veiculos.tipo_veiculo,
          tipoCombustivel: veiculos.tipoCombustivel
        })
        .from(veiculos)
        .where(
          and(
            eq(veiculos.idUsuario, userId),
            isNull(veiculos.deletedAt)
          )
        );

      // Calcular estatísticas
      const statistics = {
        total_vehicles: totalVehicles ? 1 : 0,
        active_vehicles: totalVehicles?.ativo ? 1 : 0,
        inactive_vehicles: totalVehicles && !totalVehicles.ativo ? 1 : 0,
        by_type: {},
        by_fuel_type: {}
      };

      return VehiclesController.successResponse(res, statistics);

    } catch (error: any) {
      console.error('Erro ao obter estatísticas dos veículos:', error);
      return VehiclesController.errorResponse(res, 500, 'Erro interno do servidor');
    }
  }
}
