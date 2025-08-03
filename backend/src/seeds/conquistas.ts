import { db } from '../db/connection';
import { conquistas, nivelUsuario } from '../db/schema_original';

export async function seedConquistas() {
  console.log('🎮 Inserindo conquistas iniciais...');

  const conquistasData = [
    // Conquistas de Faturamento
    {
      nome: 'Primeiro Ganho',
      descricao: 'Complete sua primeira jornada e ganhe dinheiro!',
      tipo_conquista: 'Faturamento' as const,
      raridade: 'Comum' as const,
      icone: '💰',
      cor: '#4CAF50',
      criterio_valor: 1, // R$ 0,01
      criterio_descricao: 'Ganhe pelo menos R$ 0,01 em jornadas',
      pontos_recompensa: 10,
      ordem_exibicao: 1
    },
    {
      nome: 'Centena',
      descricao: 'Ganhe R$ 100 em faturamento total',
      tipo_conquista: 'Faturamento' as const,
      raridade: 'Comum' as const,
      icone: '💵',
      cor: '#4CAF50',
      criterio_valor: 10000, // R$ 100,00 em centavos
      criterio_descricao: 'Acumule R$ 100,00 em faturamento total',
      pontos_recompensa: 25,
      ordem_exibicao: 2
    },
    {
      nome: 'Milhar',
      descricao: 'Ganhe R$ 1.000 em faturamento total',
      tipo_conquista: 'Faturamento' as const,
      raridade: 'Raro' as const,
      icone: '💸',
      cor: '#2196F3',
      criterio_valor: 100000, // R$ 1.000,00 em centavos
      criterio_descricao: 'Acumule R$ 1.000,00 em faturamento total',
      pontos_recompensa: 50,
      ordem_exibicao: 3
    },
    {
      nome: 'Empreendedor',
      descricao: 'Ganhe R$ 10.000 em faturamento total',
      tipo_conquista: 'Faturamento' as const,
      raridade: 'Epico' as const,
      icone: '🏆',
      cor: '#9C27B0',
      criterio_valor: 1000000, // R$ 10.000,00 em centavos
      criterio_descricao: 'Acumule R$ 10.000,00 em faturamento total',
      pontos_recompensa: 100,
      ordem_exibicao: 4
    },

    // Conquistas de Quilometragem
    {
      nome: 'Primeiros Passos',
      descricao: 'Complete 10 km em jornadas',
      tipo_conquista: 'Quilometragem' as const,
      raridade: 'Comum' as const,
      icone: '🚗',
      cor: '#FF9800',
      criterio_valor: 10,
      criterio_descricao: 'Percorra 10 km em jornadas',
      pontos_recompensa: 10,
      ordem_exibicao: 5
    },
    {
      nome: 'Explorador',
      descricao: 'Complete 100 km em jornadas',
      tipo_conquista: 'Quilometragem' as const,
      raridade: 'Comum' as const,
      icone: '🛣️',
      cor: '#FF9800',
      criterio_valor: 100,
      criterio_descricao: 'Percorra 100 km em jornadas',
      pontos_recompensa: 25,
      ordem_exibicao: 6
    },
    {
      nome: 'Viajante',
      descricao: 'Complete 1.000 km em jornadas',
      tipo_conquista: 'Quilometragem' as const,
      raridade: 'Raro' as const,
      icone: '🌍',
      cor: '#2196F3',
      criterio_valor: 1000,
      criterio_descricao: 'Percorra 1.000 km em jornadas',
      pontos_recompensa: 50,
      ordem_exibicao: 7
    },
    {
      nome: 'Nômade Digital',
      descricao: 'Complete 10.000 km em jornadas',
      tipo_conquista: 'Quilometragem' as const,
      raridade: 'Epico' as const,
      icone: '🚀',
      cor: '#9C27B0',
      criterio_valor: 10000,
      criterio_descricao: 'Percorra 10.000 km em jornadas',
      pontos_recompensa: 100,
      ordem_exibicao: 8
    },

    // Conquistas de Jornadas
    {
      nome: 'Primeira Jornada',
      descricao: 'Complete sua primeira jornada',
      tipo_conquista: 'Jornadas' as const,
      raridade: 'Comum' as const,
      icone: '🎯',
      cor: '#607D8B',
      criterio_valor: 1,
      criterio_descricao: 'Complete 1 jornada',
      pontos_recompensa: 10,
      ordem_exibicao: 9
    },
    {
      nome: 'Dedicado',
      descricao: 'Complete 10 jornadas',
      tipo_conquista: 'Jornadas' as const,
      raridade: 'Comum' as const,
      icone: '📈',
      cor: '#607D8B',
      criterio_valor: 10,
      criterio_descricao: 'Complete 10 jornadas',
      pontos_recompensa: 25,
      ordem_exibicao: 10
    },
    {
      nome: 'Veterano',
      descricao: 'Complete 100 jornadas',
      tipo_conquista: 'Jornadas' as const,
      raridade: 'Raro' as const,
      icone: '🎖️',
      cor: '#2196F3',
      criterio_valor: 100,
      criterio_descricao: 'Complete 100 jornadas',
      pontos_recompensa: 50,
      ordem_exibicao: 11
    },
    {
      nome: 'Lenda',
      descricao: 'Complete 1.000 jornadas',
      tipo_conquista: 'Jornadas' as const,
      raridade: 'Lendario' as const,
      icone: '👑',
      cor: '#FF6F00',
      criterio_valor: 1000,
      criterio_descricao: 'Complete 1.000 jornadas',
      pontos_recompensa: 200,
      ordem_exibicao: 12
    },

    // Conquistas de Eficiência
    {
      nome: 'Eficiente',
      descricao: 'Ganhe pelo menos R$ 1,00 por km rodado',
      tipo_conquista: 'Eficiencia' as const,
      raridade: 'Raro' as const,
      icone: '⚡',
      cor: '#FFEB3B',
      criterio_valor: 100, // R$ 1,00 por km em centavos
      criterio_descricao: 'Mantenha uma média de R$ 1,00 por km',
      pontos_recompensa: 50,
      ordem_exibicao: 13
    },
    {
      nome: 'Super Eficiente',
      descricao: 'Ganhe pelo menos R$ 2,00 por km rodado',
      tipo_conquista: 'Eficiencia' as const,
      raridade: 'Epico' as const,
      icone: '💎',
      cor: '#9C27B0',
      criterio_valor: 200, // R$ 2,00 por km em centavos
      criterio_descricao: 'Mantenha uma média de R$ 2,00 por km',
      pontos_recompensa: 100,
      ordem_exibicao: 14
    },

    // Conquistas de Consistência
    {
      nome: 'Consistente',
      descricao: 'Trabalhe 3 dias consecutivos',
      tipo_conquista: 'Consistencia' as const,
      raridade: 'Comum' as const,
      icone: '📅',
      cor: '#795548',
      criterio_valor: 3,
      criterio_descricao: 'Complete jornadas em 3 dias consecutivos',
      pontos_recompensa: 25,
      ordem_exibicao: 15
    },
    {
      nome: 'Disciplinado',
      descricao: 'Trabalhe 7 dias consecutivos',
      tipo_conquista: 'Consistencia' as const,
      raridade: 'Raro' as const,
      icone: '🔥',
      cor: '#F44336',
      criterio_valor: 7,
      criterio_descricao: 'Complete jornadas em 7 dias consecutivos',
      pontos_recompensa: 75,
      ordem_exibicao: 16
    },
    {
      nome: 'Incansável',
      descricao: 'Trabalhe 30 dias consecutivos',
      tipo_conquista: 'Consistencia' as const,
      raridade: 'Lendario' as const,
      icone: '🌟',
      cor: '#FF6F00',
      criterio_valor: 30,
      criterio_descricao: 'Complete jornadas em 30 dias consecutivos',
      pontos_recompensa: 300,
      ordem_exibicao: 17
    },

    // Conquistas de Metas
    {
      nome: 'Planejador',
      descricao: 'Crie sua primeira meta',
      tipo_conquista: 'Metas' as const,
      raridade: 'Comum' as const,
      icone: '🎯',
      cor: '#3F51B5',
      criterio_valor: 1,
      criterio_descricao: 'Crie 1 meta',
      pontos_recompensa: 15,
      ordem_exibicao: 18
    },
    {
      nome: 'Conquistador',
      descricao: 'Complete sua primeira meta',
      tipo_conquista: 'Metas' as const,
      raridade: 'Raro' as const,
      icone: '🏅',
      cor: '#2196F3',
      criterio_valor: 1,
      criterio_descricao: 'Complete 1 meta',
      pontos_recompensa: 50,
      ordem_exibicao: 19
    },
    {
      nome: 'Ambicioso',
      descricao: 'Complete 5 metas',
      tipo_conquista: 'Metas' as const,
      raridade: 'Epico' as const,
      icone: '🏆',
      cor: '#9C27B0',
      criterio_valor: 5,
      criterio_descricao: 'Complete 5 metas',
      pontos_recompensa: 150,
      ordem_exibicao: 20
    }
  ];

  try {
    // Inserir conquistas
    await db.insert(conquistas).values(conquistasData);
    console.log(`✅ ${conquistasData.length} conquistas inseridas com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao inserir conquistas:', error);
  }
}

export async function seedNiveisUsuario() {
  console.log('🎖️ Inserindo níveis de usuário...');

  const niveisData = [
    {
      nivel: 'Iniciante' as const,
      nome_exibicao: 'Iniciante',
      pontos_necessarios: 0,
      cor: '#9E9E9E',
      icone: '🚗',
      beneficios: 'Bem-vindo ao GiroPro! Comece sua jornada como motorista.',
      ordem: 1
    },
    {
      nivel: 'Novato' as const,
      nome_exibicao: 'Novato',
      pontos_necessarios: 100,
      cor: '#4CAF50',
      icone: '🌱',
      beneficios: 'Você está pegando o jeito! Continue assim.',
      ordem: 2
    },
    {
      nivel: 'Experiente' as const,
      nome_exibicao: 'Experiente',
      pontos_necessarios: 300,
      cor: '#2196F3',
      icone: '🚙',
      beneficios: 'Você já tem experiência nas estradas!',
      ordem: 3
    },
    {
      nivel: 'Profissional' as const,
      nome_exibicao: 'Profissional',
      pontos_necessarios: 600,
      cor: '#9C27B0',
      icone: '🚐',
      beneficios: 'Um verdadeiro profissional das estradas.',
      ordem: 4
    },
    {
      nivel: 'Especialista' as const,
      nome_exibicao: 'Especialista',
      pontos_necessarios: 1000,
      cor: '#FF9800',
      icone: '🚛',
      beneficios: 'Especialista em maximizar ganhos e eficiência.',
      ordem: 5
    },
    {
      nivel: 'Mestre' as const,
      nome_exibicao: 'Mestre',
      pontos_necessarios: 1500,
      cor: '#F44336',
      icone: '🏎️',
      beneficios: 'Mestre das estradas, exemplo para outros motoristas.',
      ordem: 6
    },
    {
      nivel: 'Lenda' as const,
      nome_exibicao: 'Lenda',
      pontos_necessarios: 2500,
      cor: '#FF6F00',
      icone: '👑',
      beneficios: 'Uma lenda viva do transporte! Parabéns pela dedicação.',
      ordem: 7
    }
  ];

  try {
    // Inserir níveis
    await db.insert(nivelUsuario).values(niveisData);
    console.log(`✅ ${niveisData.length} níveis de usuário inseridos com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao inserir níveis de usuário:', error);
  }
}

// Função principal para executar todos os seeds de gamificação
export async function seedGamification() {
  console.log('🎮 Iniciando seeds de gamificação...');
  
  await seedConquistas();
  await seedNiveisUsuario();
  
  console.log('🎮 Seeds de gamificação concluídos!');
}

