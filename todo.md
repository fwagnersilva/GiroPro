# Próximas Tarefas - GiroPro

## PRIORIDADE CRÍTICA - Reabilitação e Correção dos Arquivos Desabilitados
- [ ] Corrigir e reabilitar o `expensesController.ts`: resolver problemas de mapeamento de dados entre formatos de API.
- [ ] Corrigir e reabilitar o `insightsController.ts`: implementar método `generateInsights` no `AdvancedAnalyticsService`.
- [ ] Corrigir e reabilitar o `multiVehicleController.ts`: resolver problemas de conversão de timestamp em queries Drizzle.

## Correção dos Erros TypeScript Remanescentes no DashboardController
- [ ] Resolver problemas de cache e propriedades `cacheInfo` não definidas.
- [ ] Corrigir funções que não retornam valores em todos os caminhos de código.
- [ ] Resolver problemas de acesso a propriedades privadas (`TTL_CONFIG`).

## Padronização e Consistência de Dados
- [ ] Criar camada de mapeamento consistente entre formatos de API e estrutura do banco.
- [ ] Resolver inconsistências de nomenclatura (snake_case vs camelCase) de forma sistemática.
- [ ] Implementar conversões de timestamp padronizadas para todo o projeto.

## Teste e Validação do Backend
- [x] Instalação das dependências do backend (npm install)
- [ ] Garantir que o backend compile completamente sem erros TypeScript (`npm run build` bem-sucedido).
- [ ] Iniciar o backend com sucesso (`npm run dev`) e verificar se não há erros de runtime.
- [ ] Testar endpoints básicos da API para verificar funcionalidade das correções implementadas.

## Configuração e Teste do Frontend
- [ ] Configurar e testar o frontend React Native com Expo (após backend funcional).
- [ ] Validar comunicação entre frontend e backend.

## Análise Avançada do Banco de Dados
- [ ] Usar Drizzle Studio (`npm run db:studio`) para análise visual do banco de dados.
- [ ] Revisar performance de queries complexas e identificar necessidade de novos índices.

## Erros de Compilação TypeScript (Identificados)
- `src/controllers/dashboardController.ts`: 10 erros
- `src/controllers/expensesController.ts`: 6 erros
- `src/controllers/notificationsController.ts`: 3 erros
- `src/controllers/reportsController.ts`: 7 erros
- `src/controllers/weeklyMonthlyReportsController.ts`: 31 erros
- `src/routes/analytics.ts`: 3 erros
- `src/routes/dashboard.ts`: 1 erro
- `src/routes/insights.ts`: 1 erro
- `src/routes/multi-vehicle.ts`: 1 erro
- `src/services/advancedAnalyticsService.ts`: 18 erros
- `src/services/create_goal_service.ts`: 1 erro

