export interface Expense {
  id: string;
  idUsuario: string;
  vehicleId: string;
  vehicleModel?: string;
  date: string;
  category: string;
  description: string;
  value: number; // em centavos
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseDto {
  vehicleId: string;
  date: string;
  category: string;
  description: string;
  value: number; // em centavos
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {}

export interface ExpenseFilters {
  vehicleId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  periodo?: 'hoje' | 'ontem' | 'semana' | 'mes';
}
