import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { veiculos } from "../db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";

// Interfaces
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
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
enum TipoUso {
  PROPRIO = "proprio",
  ALUGADO = "alugado",
  FINANCIADO = "financiado",
}

enum TipoCombustivel {
  GASOLINA = "gasolina",
  ETANOL = "etanol",
  DIESEL = "diesel",
  GNV = "gnv",
  FLEX = "flex",
}

// Schemas de validação
const createVehicleSchema = z.object({
  marca: z
    .string()
    .min(1, "Marca é obrigatória")
    .max(50, "Marca deve ter no máximo 50 caracteres")
    .trim(),
  modelo: z
    .string()
    .min(1, "Modelo é obrigatório")
    .max(50, "Modelo deve ter no máximo 50 caracteres")
    .trim(),
  ano: z
    .number()
    .int("Ano deve ser um número inteiro")
    .min(1900, "Ano deve ser maior que 1900")
    .max(new Date().getFullYear() + 1, "Ano não pode ser superior ao próximo ano"),
  placa: z
    .string()
    .min(7, "Placa deve ter pelo menos 7 caracteres")
    .max(8, "Placa deve ter no máximo 8 caracteres")
    .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Formato de placa inválido (ex: ABC1234 ou ABC1D23)"),
  cor: z.string().max(30, "Cor deve ter no máximo 30 caracteres").trim().optional(),
  tipoUso: z.nativeEnum(TipoUso),
  tipoCombustivel: z.nativeEnum(TipoCombustivel),
  mediaConsumo: z
    .number()
    .positive("Consumo médio deve ser positivo")
    .max(50, "Consumo médio deve ser realista (máximo 50 km/l)")
    .optional(),
  valorAluguel: z.number().positive("Valor do aluguel deve ser positivo").optional(),
  valorPrestacao: z.number().positive("Valor da prestação deve ser positivo").optional(),
  kmAtual: z
    .number()
    .min(0, "Quilometragem atual não pode ser negativa")
    .max(9999999, "Quilometragem atual muito alta")
    .optional(),
  observacoes: z.string().max(500, "Observações devem ter no máximo 500 caracteres").trim().optional(),
});

const updateVehicleSchema = createVehicleSchema.partial();

const queryParamsSchema = z.object({
  tipoUso: z.nativeEnum(TipoUso).optional(),
  tipoCombustivel: z.nativeEnum(TipoCombustivel).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
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
      error: { message, details },
    });
  }

  /**
   * Retorna resposta de sucesso padronizada
   */
  private static successResponse<T>(res: Response, data?: T, message?: string, status: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message }),
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
            isNull(veiculos.deletedAt) // Apenas veículos não deletados
          )
        );

      if (vehicles.length === 0) {
        return { vehicle: null, error: "Veículo não encontrado" };
      }

      if (vehicles[0].idUsuario !== userId) {
        return { vehicle: null, error: "Acesso negado" };
      }

      return { vehicle: vehicles[0], error: null };
    } catch (error) {
      return { vehicle: null, error: "Erro ao buscar veículo" };
    }
  }

  /**
   * Listar todos os veículos do usuário
   */
  static async getAll(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const queryValidation = queryParamsSchema.safeParse(req.query);
      if (!queryValidation.success) {
        return VehiclesController.errorResponse(
          res,
          400,
          "Parâmetros de consulta inválidos",
          queryValidation.error.errors
        );
      }

      const { tipoUso, tipoCombustivel, limit, offset } = queryValidation.data;

      // Construir condições de filtro
      let whereConditions = and(
        eq(veiculos.idUsuario, userId),
        isNull(veiculos.deletedAt) // Apenas veículos ativos (não deletados)
      );

      if (tipoUso) {
        whereConditions = and(whereConditions, eq(veiculos.tipoUso, tipoUso));
      }

      if (tipoCombustivel) {
        whereConditions = and(whereConditions, eq(veiculos.tipoCombustivel, tipoCombustivel));
      }

      // Buscar veículos com paginação
      const [userVehicles, totalCountResult] = await Promise.all([
        db
          .select()
          .from(veiculos)
          .where(whereConditions)
          .limit(limit)
          .offset(offset)
          .orderBy(veiculos.dataCadastro),
        db
          .select({ count: sql<number>`count(*)` })
          .from(veiculos)
          .where(whereConditions),
      ]);

      const totalCount = totalCountResult[0].count;

      const responseData = {
        vehicles: userVehicles,
        pagination: {
          total: totalCount,
          limit,
          offset,
          has_more: totalCount > offset + limit,
        },
        filters: {
          tipoUso: tipoUso || null,
          tipoCombustivel: tipoCombustivel || null,
        },
      };

      return VehiclesController.successResponse(res, responseData);
    } catch (error: any) {
      console.error("Erro ao buscar veículos:", error);
      return VehiclesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Criar novo veículo
   */
  static async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const validation = createVehicleSchema.safeParse(req.body);
      if (!validation.success) {
        return VehiclesController.errorResponse(
          res,
          400,
          "Dados inválidos",
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
            "Já existe um veículo cadastrado com esta placa"
          );
        };
      };

      const vehicleData = {
        idUsuario: userId,
        marca: validation.data.marca,
        modelo: validation.data.modelo,
        ano: validation.data.ano,
        placa: validation.data.placa || `TEMP${Date.now()}`, // Placa temporária se não fornecida
        tipoCombustivel: validation.data.tipoCombustivel,
        tipoUso: validation.data.tipoUso,
        dataCadastro: new Date(),
        updatedAt: new Date(),
        // Campos opcionais
        ...(validation.data.cor && { cor: validation.data.cor }),
        ...(validation.data.mediaConsumo && { mediaConsumo: validation.data.mediaConsumo }),
        ...(validation.data.valorAluguel && { valorAluguel: validation.data.valorAluguel }),
        ...(validation.data.valorPrestacao && { valorPrestacao: validation.data.valorPrestacao }),
        ...(validation.data.kmAtual && { kmAtual: validation.data.kmAtual }),
        ...(validation.data.observacoes && { observacoes: validation.data.observacoes }),
      };

      const newVehicles = await db.insert(veiculos).values(vehicleData).returning();

      return VehiclesController.successResponse(
        res,
        newVehicles[0],
        "Veículo criado com sucesso",
        201
      );
    } catch (error: any) {
      console.error("Erro ao criar veículo:", error);

      // Tratar erros específicos do banco de dados
      if (error.code === "23505") { // Unique constraint violation
        return VehiclesController.errorResponse(res, 409, "Já existe um veículo com estes dados");
      }

      return VehiclesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Buscar veículo por ID
   */
  static async getById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório");
      }

      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);

      if (error) {
        const status = error === "Veículo não encontrado" ? 404 : 403;
        return VehiclesController.errorResponse(res, status, error);
      }

      return VehiclesController.successResponse(res, vehicle);
    } catch (error: any) {
      console.error("Erro ao buscar veículo:", error);
      return VehiclesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Atualizar veículo
   */
  static async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório");
      }

      const validation = updateVehicleSchema.safeParse(req.body);
      if (!validation.success) {
        return VehiclesController.errorResponse(
          res,
          400,
          "Dados inválidos",
          validation.error.errors
        );
      }

      // Verificar se o veículo existe e pertence ao usuário
      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);

      if (error) {
        const status = error === "Veículo não encontrado" ? 404 : 403;
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
            "Já existe um veículo cadastrado com esta placa"
          );
        }
      }

      const updateData = {
        ...validation.data,
        updatedAt: new Date(),
      };

      const updatedVehicles = await db.update(veiculos).set(updateData).where(eq(veiculos.id, id)).returning();

      return VehiclesController.successResponse(
        res,
        updatedVehicles[0],
        "Veículo atualizado com sucesso"
      );
    } catch (error: any) {
      console.error("Erro ao atualizar veículo:", error);

      if (error.code === "23505") { // Unique constraint violation
        return VehiclesController.errorResponse(res, 409, "Já existe um veículo com estes dados");
      }

      return VehiclesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Excluir veículo (soft delete)
   */
  static async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório");
      }

      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);

      if (error) {
        const status = error === "Veículo não encontrado" ? 404 : 403;
        return VehiclesController.errorResponse(res, status, error);
      }

      // Soft delete
      await db
        .update(veiculos)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(veiculos.id, id));

      return VehiclesController.successResponse(
        res,
        undefined,
        "Veículo excluído com sucesso",
        204
      );
    } catch (error: any) {
      console.error("Erro ao excluir veículo:", error);
      return VehiclesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Reativar veículo (reverter soft delete)
   */
  static async activate(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório");
      }

      // Buscar o veículo, mesmo que esteja inativo (deletedAt não nulo)
      const vehicles = await db
        .select()
        .from(veiculos)
        .where(
          and(
            eq(veiculos.id, id),
            eq(veiculos.idUsuario, userId) // Apenas veículos do usuário
          )
        );

      if (vehicles.length === 0) {
        return VehiclesController.errorResponse(res, 404, "Veículo não encontrado ou não pertence ao usuário");
      }

      const vehicleToActivate = vehicles[0];

      if (vehicleToActivate.deletedAt === null) {
        return VehiclesController.errorResponse(res, 400, "Veículo já está ativo");
      }

      const updatedVehicles = await db
        .update(veiculos)
        .set({
          deletedAt: null, // Remove o soft delete
          updatedAt: new Date(),
        })
        .where(eq(veiculos.id, id))
        .returning();

      return VehiclesController.successResponse(
        res,
        updatedVehicles[0],
        "Veículo reativado com sucesso"
      );
    } catch (error: any) {
      console.error("Erro ao reativar veículo:", error);
      return VehiclesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Desativar veículo (soft delete)
   */
  static async deactivate(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = VehiclesController.validateAuth(req);
      if (!userId) {
        return VehiclesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const { id } = req.params;
      if (!id) {
        return VehiclesController.errorResponse(res, 400, "ID do veículo é obrigatório");
      }

      const { vehicle, error } = await VehiclesController.findAndValidateVehicle(id, userId);

      if (error) {
        const status = error === "Veículo não encontrado" ? 404 : 403;
        return VehiclesController.errorResponse(res, status, error);
      }

      if (vehicle!.deletedAt !== null) {
        return VehiclesController.errorResponse(res, 400, "Veículo já está inativo");
      }

      const updatedVehicles = await db
        .update(veiculos)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(veiculos.id, id))
        .returning();

      return VehiclesController.successResponse(
        res,
        updatedVehicles[0],
        "Veículo desativado com sucesso"
      );
    } catch (error: any) {
      console.error("Erro ao desativar veículo:", error);
      return VehiclesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }
}

