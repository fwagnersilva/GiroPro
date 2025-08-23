import { db } from '../db';
import { despesas } from '../db/schema';
import { CreateExpenseRequest, UpdateExpenseRequest, Expense } from '../types';
import { eq, and, isNull } from 'drizzle-orm';
import crypto from 'crypto';

export class ExpenseService {
  /**
   * Cria uma nova despesa
   */
  static async createExpense(userId: string, expenseData: CreateExpenseRequest): Promise<Expense> {
    try {
      const newExpense = {
        id: crypto.randomUUID(),
        idUsuario: userId,
        idVeiculo: expenseData.vehicleId,
        dataDespesa: new Date(expenseData.data),
        tipoDespesa: expenseData.categoria as any, // Mapear categoria para tipoDespesa
        valorDespesa: Math.round(expenseData.valor * 100), // Converter para centavos
        descricao: expenseData.descricao,
      };

      const result = await db.insert(despesas).values(newExpense).returning();
      
      if (result.length === 0) {
        throw new Error('Falha ao criar despesa');
      }

      return this.mapToExpense(result[0]);
    } catch (error) {
      throw new Error(`Erro ao criar despesa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Busca todas as despesas de um usuário
   */
  static async getExpensesByUserId(userId: string): Promise<Expense[]> {
    try {
      const result = await db
        .select()
        .from(despesas)
        .where(and(eq(despesas.idUsuario, userId), isNull(despesas.deletedAt)));

      return result.map(this.mapToExpense);
    } catch (error) {
      throw new Error(`Erro ao buscar despesas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Busca uma despesa específica por ID
   */
  static async getExpenseById(userId: string, expenseId: string): Promise<Expense | null> {
    try {
      const result = await db
        .select()
        .from(despesas)
        .where(and(
          eq(despesas.id, expenseId),
          eq(despesas.idUsuario, userId),
          isNull(despesas.deletedAt)
        ));

      if (result.length === 0) {
        return null;
      }

      return this.mapToExpense(result[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar despesa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Atualiza uma despesa
   */
  static async updateExpense(userId: string, expenseId: string, updateData: UpdateExpenseRequest): Promise<Expense | null> {
    try {
      const updateFields: any = {};

      if (updateData.vehicleId !== undefined) {
        updateFields.idVeiculo = updateData.vehicleId;
      }
      if (updateData.data !== undefined) {
        updateFields.dataDespesa = new Date(updateData.data);
      }
      if (updateData.categoria !== undefined) {
        updateFields.tipoDespesa = updateData.categoria;
      }
      if (updateData.valor !== undefined) {
        updateFields.valorDespesa = Math.round(updateData.valor * 100);
      }
      if (updateData.descricao !== undefined) {
        updateFields.descricao = updateData.descricao;
      }

      const result = await db
        .update(despesas)
        .set(updateFields)
        .where(and(
          eq(despesas.id, expenseId),
          eq(despesas.idUsuario, userId),
          isNull(despesas.deletedAt)
        ))
        .returning();

      if (result.length === 0) {
        return null;
      }

      return this.mapToExpense(result[0]);
    } catch (error) {
      throw new Error(`Erro ao atualizar despesa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Remove uma despesa (soft delete)
   */
  static async deleteExpense(userId: string, expenseId: string): Promise<boolean> {
    try {
      const result = await db
        .update(despesas)
        .set({ deletedAt: new Date() })
        .where(and(
          eq(despesas.id, expenseId),
          eq(despesas.idUsuario, userId),
          isNull(despesas.deletedAt)
        ))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar despesa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Obtém estatísticas das despesas de um usuário
   */
  static async getExpenseStats(userId: string): Promise<any> {
    try {
      const result = await db
        .select()
        .from(despesas)
        .where(and(eq(despesas.idUsuario, userId), isNull(despesas.deletedAt)));

      const total = result.reduce((sum, expense) => sum + expense.valorDespesa, 0) / 100;
      const count = result.length;
      const average = count > 0 ? total / count : 0;

      return {
        total,
        count,
        average,
      };
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Busca despesas por categoria
   */
  static async getExpensesByCategory(userId: string, category: string): Promise<Expense[]> {
    try {
      const result = await db
        .select()
        .from(despesas)
        .where(and(
          eq(despesas.idUsuario, userId),
          eq(despesas.tipoDespesa, category as any),
          isNull(despesas.deletedAt)
        ));

      return result.map(this.mapToExpense);
    } catch (error) {
      throw new Error(`Erro ao buscar despesas por categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Mapeia dados do banco para o tipo Expense
   */
  private static mapToExpense(dbExpense: any): Expense {
    return {
      id: dbExpense.id,
      userId: dbExpense.idUsuario,
      vehicleId: dbExpense.idVeiculo,
      data: dbExpense.dataDespesa,
      valor: dbExpense.valorDespesa / 100, // Converter de centavos para reais
      descricao: dbExpense.descricao || '',
      categoria: dbExpense.tipoDespesa,
      createdAt: dbExpense.createdAt || dbExpense.dataDespesa,
      updatedAt: dbExpense.updatedAt || dbExpense.dataDespesa,
    };
  }
}

