import { Request, Response } from 'express';
import { ExpenseService } from '../services/expenseService';
import { CreateExpenseRequest, UpdateExpenseRequest } from '../types';
import { authMiddleware } from '../middlewares/auth'; // Importação nomeada

export const createExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const expenseData: CreateExpenseRequest = req.body;
    const newExpense = await ExpenseService.createExpense(userId, expenseData);
    return res.status(201).json(newExpense);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const expenses = await ExpenseService.getExpensesByUserId(userId);
    return res.status(200).json(expenses);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const expense = await ExpenseService.getExpenseById(id, userId);
    if (!expense) {
      return res.status(404).json({ message: 'Despesa não encontrada.' });
    }
    return res.status(200).json(expense);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const expenseData: UpdateExpenseRequest = req.body;
    const updatedExpense = await ExpenseService.updateExpense(id, userId, expenseData);
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Despesa não encontrada ou você não tem permissão para atualizá-la.' });
    }
    return res.status(200).json(updatedExpense);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o userId do token JWT
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const { id } = req.params;
    const deleted = await ExpenseService.deleteExpense(id, userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Despesa não encontrada ou você não tem permissão para excluí-la.' });
    }
    return res.status(204).send(); // No Content
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
