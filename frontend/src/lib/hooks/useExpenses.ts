import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '@/api/expenses/api';
import type { CreateExpenseDto, UpdateExpenseDto, ExpenseFilters } from '@/api/expenses/types';

const EXPENSES_KEY = 'expenses';

export const useExpenses = (filters?: ExpenseFilters) => {
  return useQuery({
    queryKey: [EXPENSES_KEY, filters],
    queryFn: () => expensesApi.getAll(filters),
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: [EXPENSES_KEY, id],
    queryFn: () => expensesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expensesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDto }) => 
      expensesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => expensesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] });
    },
  });
};
