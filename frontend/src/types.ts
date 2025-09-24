export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  Dashboard: undefined;
  Vehicles: undefined;
  Journeys: undefined;
  Fuelings: undefined;
  Expenses: undefined;
  Goals: undefined;
  Achievements: undefined;
  Profile: undefined;
  AddFueling: { vehicles: Vehicle[] };
  AddExpense: { vehicles: Vehicle[] };
};

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem_atual: number;
  capacidade_tanque: number;
  tipo_combustivel: string;
  media_consumo: number;
  data_aquisicao: string;
  ativo: boolean;
  usuario_id: string;
}


