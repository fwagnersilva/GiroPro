import { Request, Response } from 'express';
import { PlatformService } from '../services/platformService';
import { z } from 'zod';

// Schemas de validação para plataformas
const createPlatformSchema = z.object({
  nome: z.string().min(1, "Nome da plataforma é obrigatório").max(100, "Nome da plataforma deve ter no máximo 100 caracteres"),
  isPadrao: z.boolean().optional(),
  ativa: z.boolean().optional(),
});

const updatePlatformSchema = z.object({
  nome: z.string().min(1, "Nome da plataforma é obrigatório").max(100, "Nome da plataforma deve ter no máximo 100 caracteres").optional(),
  ativa: z.boolean().optional(),
});

type CreatePlatformRequest = z.infer<typeof createPlatformSchema>;

type UpdatePlatformRequest = z.infer<typeof updatePlatformSchema>;

export class PlatformController {
  static async createPlatform(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).send({ success: false, message: 'Usuário não autenticado.' });
      }

      const validatedData = createPlatformSchema.parse(req.body);
      const newPlatform = await PlatformService.createPlatform(userId, validatedData as any);
      return res.status(201).send({ success: true, message: 'Plataforma criada com sucesso.', platform: newPlatform });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).send({ success: false, message: 'Dados de entrada inválidos.', errors: error.errors });
      }
      console.error('Erro ao criar plataforma:', error);
      return res.status(500).send({ success: false, message: error.message || 'Ocorreu um erro interno no servidor.' });
    }
  }

  static async getPlatforms(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).send({ success: false, message: 'Usuário não autenticado.' });
      }

      const platforms = await PlatformService.getPlatformsByUserId(userId);
      return res.status(200).send({ success: true, platforms });
    } catch (error: any) {
      console.error('Erro ao buscar plataformas:', error);
      return res.status(500).send({ success: false, message: error.message || 'Ocorreu um erro interno no servidor.' });
    }
  }

  static async getActivePlatforms(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).send({ success: false, message: 'Usuário não autenticado.' });
      }

      const platforms = await PlatformService.getActivePlatforms(userId);
      return res.status(200).send({ success: true, platforms });
    } catch (error: any) {
      console.error('Erro ao buscar plataformas ativas:', error);
      return res.status(500).send({ success: false, message: error.message || 'Ocorreu um erro interno no servidor.' });
    }
  }

  static async getPlatformById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).send({ success: false, message: 'Usuário não autenticado.' });
      }
      const { id } = req.params;
      const platform = await PlatformService.getPlatformById(userId, id);

      if (!platform) {
        return res.status(404).send({ success: false, message: 'Plataforma não encontrada.' });
      }
      return res.status(200).send({ success: true, platform });
    } catch (error: any) {
      console.error('Erro ao buscar plataforma por ID:', error);
      return res.status(500).send({ success: false, message: error.message || 'Ocorreu um erro interno no servidor.' });
    }
  }

  static async updatePlatform(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).send({ success: false, message: 'Usuário não autenticado.' });
      }
      const { id } = req.params;
      const updateData: UpdatePlatformRequest = updatePlatformSchema.parse(req.body);

      const updatedPlatform = await PlatformService.updatePlatform(userId, id, updateData);

      if (!updatedPlatform) {
        return res.status(404).send({ success: false, message: 'Plataforma não encontrada ou não pertence ao usuário.' });
      }
      return res.status(200).send({ success: true, message: 'Plataforma atualizada com sucesso.', platform: updatedPlatform });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).send({ success: false, message: 'Dados de entrada inválidos.', errors: error.errors });
      }
      console.error('Erro ao atualizar plataforma:', error);
      return res.status(500).send({ success: false, message: error.message || 'Ocorreu um erro interno no servidor.' });
    }
  }

  static async deletePlatform(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).send({ success: false, message: 'Usuário não autenticado.' });
      }
      const { id } = req.params;

      const deleted = await PlatformService.deletePlatform(userId, id);

      if (!deleted) {
        return res.status(404).send({ success: false, message: 'Plataforma não encontrada ou não pertence ao usuário.' });
      }
      return res.status(200).send({ success: true, message: 'Plataforma excluída com sucesso.' });
    } catch (error: any) {
      console.error('Erro ao deletar plataforma:', error);
      return res.status(500).send({ success: false, message: error.message || 'Ocorreu um erro interno no servidor.' });
    }
  }
}

