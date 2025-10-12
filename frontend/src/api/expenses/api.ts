import { client } from '../common/client';
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ExpenseFilters } from './types';

const EXPENSES_URL = '/expenses';

export const expensesApi = {
  getAll: (filters?: ExpenseFilters) => 
    client.get<Expense[]>(EXPENSES_URL, { params: filters }).then((res) => res.data),

  getById: (id: string) =>
    client.get<Expense>(`${EXPENSES_URL}/${id}`).then((res) => res.data),

  create: (data: CreateExpenseDto) =>
    client.post<Expense>(EXPENSES_URL, data).then((res) => res.data),

  update: (id: string, data: UpdateExpenseDto) =>
    client.put<Expense>(`${EXPENSES_URL}/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    client.delete(`${EXPENSES_URL}/${id}`).then((res) => res.data),
};
