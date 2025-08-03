import { Request, Response } from 'express';
import { db } from '../db';
import { veiculos } from '../db/schema';
import { eq } from 'drizzle-orm';

export class VehiclesController {
  static async getAll(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const userVehicles = await db.select().from(veiculos).where(eq(veiculos.id_usuario, req.user?.id));
      return res.json({ success: true, data: userVehicles });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  static async create(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const newVehicle = await db.insert(veiculos).values({ ...req.body, id_usuario: req.user?.id }).returning();
      return res.status(201).json({ success: true, data: newVehicle[0] });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  static async getById(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const vehicle = await db.select().from(veiculos).where(eq(veiculos.id, req.params.id));
      if (vehicle.length === 0) {
        return res.status(404).json({ success: false, error: { message: 'Veículo não encontrado' } });
      }

      if (vehicle[0].id_usuario !== req.user?.id) {
        return res.status(403).json({ success: false, error: { message: 'Acesso negado' } });
      }

      return res.json({ success: true, data: vehicle[0] });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  static async update(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const vehicle = await db.select().from(veiculos).where(eq(veiculos.id, req.params.id));
      if (vehicle.length === 0) {
        return res.status(404).json({ success: false, error: { message: 'Veículo não encontrado' } });
      }

      if (vehicle[0].id_usuario !== req.user?.id) {
        return res.status(403).json({ success: false, error: { message: 'Acesso negado' } });
      }

      const updatedVehicle = await db.update(veiculos).set(req.body).where(eq(veiculos.id, req.params.id)).returning();
      return res.json({ success: true, data: updatedVehicle[0] });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  static async delete(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const vehicle = await db.select().from(veiculos).where(eq(veiculos.id, req.params.id));
      if (vehicle.length === 0) {
        return res.status(404).json({ success: false, error: { message: 'Veículo não encontrado' } });
      }

      if (vehicle[0].id_usuario !== req.user?.id) {
        return res.status(403).json({ success: false, error: { message: 'Acesso negado' } });
      }

      await db.delete(veiculos).where(eq(veiculos.id, req.params.id));
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}


