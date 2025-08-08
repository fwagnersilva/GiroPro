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
        id_usuario: userId,
        id_veiculo: expenseData.vehicleId,
        data_despesa: expenseData.data,
        tipo_despesa: expenseData.categoria as any, // Mapear categoria para tipo_despesa
        valor_despesa: Math.round(expenseData.valor * 100), // Converter para centavos
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
        .where(and(eq(despesas.id_usuario, userId), isNull(despesas.deleted_at)));

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
          eq(despesas.id_usuario, userId),
          isNull(despesas.deleted_at)
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
        updateFields.id_veiculo = updateData.vehicleId;
      }
      if (updateData.data !== undefined) {
        updateFields.data_despesa = new Date(updateData.data);
      }
      if (updateData.categoria !== undefined) {
        updateFields.tipo_despesa = updateData.categoria;
      }
      if (updateData.valor !== undefined) {
        updateFields.valor_despesa = Math.round(updateData.valor * 100);
      }
      if (updateData.descricao !== undefined) {
        updateFields.descricao = updateData.descricao;
      }

      const result = await db
        .update(despesas)
        .set(updateFields)
        .where(and(
          eq(despesas.id, expenseId),
          eq(despesas.id_usuario, userId),
          isNull(despesas.deleted_at)
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
        .set({ deleted_at: new Date().toISOString() })
        .where(and(
          eq(despesas.id, expenseId),
          eq(despesas.id_usuario, userId),
          isNull(despesas.deleted_at)
        ))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar despesa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Mapeia dados do banco para o tipo Expense
   */
  private static mapToExpense(dbExpense: any): Expense {
    return {
      id: dbExpense.id,
      userId: dbExpense.id_usuario,
      vehicleId: dbExpense.id_veiculo,
      data: dbExpense.data_despesa,
      valor: dbExpense.valor_despesa / 100, // Converter de centavos para reais
      descricao: dbExpense.descricao || '',
      categoria: dbExpense.tipo_despesa,
      createdAt: dbExpense.created_at || dbExpense.data_despesa,
      updatedAt: dbExpense.updated_at || dbExpense.data_despesa,
    };
  }
}

