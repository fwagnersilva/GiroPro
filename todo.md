## Tarefas do Projeto GiroPro

### Fase 1: Preparação e Entendimento
- [x] Clonar o repositório.
- [x] Ler os documentos no diretório `docs/`, com atenção especial a:
  - [x] `docs/03_explicacoes/09_progresso.md` (backlog oficial do projeto).
- [x] Identificar pontos críticos a partir das seções de **Prioridade Crítica** e **Oportunidades de Melhoria**.

### Fase 2: Execução e Correção Imediata
- [x] Rodar backend e frontend localmente sem erros.
- [x] Testar conexões e migrações do banco (corrigir falhas de schema, migrations ou setup).
- [x] Verificar integração entre banco e aplicação, corrigindo inconsistências.
- [x] Corrigir de imediato erros críticos para liberar o fluxo de uso.

### Fase 3: Remoção da Tela Elegante e Foco nas Telas Existentes
- [x] **Remover a tela `elegant-login.html` e o componente `ElegantLogin.tsx`**.
- [ ] **Reverter o `App.tsx`** para usar a `LoginScreen.tsx` original do projeto.
- [ ] **Focar na correção e integração das 62 telas existentes**.

### Fase 4: Correções Críticas Aplicadas
- [x] **Corrigir importações do banco de dados:** Substituir `import { db }` por `import { getDb }` em todos os arquivos.
- [x] **Corrigir authService:** Atualizar todos os métodos para usar `getDb()` ao invés de `db` diretamente.
- [x] **Instalar dependências:** Backend e frontend instalados com sucesso.
- [x] **Identificar arquivos problemáticos:** vehiclesController, reportsController, etc.
- [ ] **Finalizar correções nos controllers:** Ainda há erros de compilação TypeScript nos controllers.

### Fase 5: Commit e Documentação
- [ ] **Commit das alterações realizadas**
- [ ] **Atualizar documentação de progresso**




# Tarefas de Correção da Documentação GiroPro

## Fase 2: Analisar estrutura do projeto e identificar problemas

- [ ] Confirmar a existência e o conteúdo dos arquivos mencionados no relatório.
- [ ] Mapear as redundâncias e os locais incorretos das instruções.

## Fase 3: Implementar correções baseadas na análise

### 1. Redundância nas Instruções de Setup

- [x] Consolidar todas as instruções detalhadas de setup em `docs/01_tutoriais/01_setup_completo.md`.
- [x] Atualizar `README.md` para que contenha apenas uma breve introdução ao projeto e um link claro para `docs/01_tutoriais/01_setup_completo.md`.
- [x] Revisar `LEIA_PRIMEIRO.md` para focar em informações críticas de alto nível para iniciar rapidamente, com links para o guia completo de setup. Remover instruções de setup duplicadas.
- [x] Revisar `GUIA_DESENVOLVIMENTO.md` para focar em guias de desenvolvimento pós-setup, removendo instruções de setup duplicadas e adicionando link para o guia de setup completo.

### 2. Redundância na Documentação de APIs

- [x] Mover detalhes e exemplos de API de `GUIA_DESENVOLVIMENTO.md` para `docs/04_referencias/02_api_documentation.md` ou `docs/04_referencias/02_api_endpoints.md`.
- [x] Em `GUIA_DESENVOLVIMENTO.md`, substituir a seção de APIs por um link claro para a documentação de API na pasta `docs/04_referencias/`.
- [x] Avaliar a necessidade de `docs/04_referencias/02_api_documentation.md` e `docs/04_referencias/02_api_endpoints.md` serem arquivos separados. Se houver sobreposição, considerar a fusão.

### 3. Redundância em Glossários e Dicionários

- [x] Consolidar `docs/04_referencias/01_dicionario_dados.md` e `docs/04_referencias/01_documentacao_banco_dados.md` em `docs/04_referencias/01_documentacao_e_dicionario_de_dados.md`.
- [x] Consolidar `docs/04_referencias/06_glossario_completo.md` e `docs/04_referencias/06_glossario_tecnico.md` em `docs/04_referencias/06_glossario.md`.
- [x] Garantir que quaisquer referências a esses arquivos antigos sejam atualizadas para os novos nomes.

### 4. Arquivos de Propósito Único e Potenciais Duplicações

- [x] Para arquivos específicos, garantir que `GUIA_DESENVOLVIMENTO.md` ou outros documentos de alto nível apenas *referenciem* esses arquivos, em vez de duplicar seu conteúdo. Remover qualquer resumo ou duplicação.
- [x] Avaliar o conteúdo de `documentation.md` e `documentation_summary.md`. Remover se redundantes ou integrar à estrutura `docs/`.
- [x] Garantir que `docs/03_explicacoes/09_progresso.md` seja o único local para acompanhamento do progresso e que `LEIA_PRIMEIRO.md` apenas o referencie.
- [x] Garantir que `docs/03_explicacoes/00_problemas_comuns_e_licoes_aprendidas.md` seja o único local para problemas comuns e lições aprendidas e que `LEIA_PRIMEIRO.md` apenas o referencie.
- [x] Garantir que `docs/03_explicacoes/01_arquitetura_geral.md` seja o único local para a arquitetura geral e que `LEIA_PRIMEIRO.md` apenas o referencie.

## Fase 4: Validar correções e entregar resultados

- [ ] Revisar toda a documentação para garantir consistência e clareza.
- [ ] Gerar um relatório final das correções realizadas.
- [ ] Apresentar os resultados ao usuário.



# Tarefas Críticas e Oportunidades de Melhoria

## 🔴 Prioridade Alta - Funcionalidade Essencial para Lançamento

- [ ] **LoginScreen:** Implementar frontend e integração com backend.
- [ ] **AddExpenseScreen:** Implementar frontend e integração com backend.
- [ ] **AddFuelingScreen:** Implementar frontend e integração com backend.
- [ ] **VehiclesScreen:** Implementar frontend e integração com backend.
- [ ] **ExpensesScreen:** Implementar frontend e integração com backend.
- [ ] **FuelingsScreen:** Implementar frontend e integração com backend.
- [ ] **GoalsScreen:** Implementar frontend e integração com backend.
- [ ] **InsightsScreen:** Implementar frontend e integração com backend.
- [ ] **JourneyHistoryScreen:** Implementar frontend e integração com backend.
- [ ] **JourneysScreen:** Implementar frontend e integração com backend.
- [ ] **MultiVehicleScreen:** Implementar frontend e integração com backend.
- [ ] **OnboardingScreen:** Implementar frontend.
- [ ] **ProfileScreen:** Implementar frontend e integração com backend.
- [ ] **ReportsScreen:** Implementar frontend e integração com backend.
- [ ] **FuelPricesScreen:** Implementar frontend e integração com backend.
- [ ] **ExpenseHistoryScreen:** Implementar frontend e integração com backend.
- [ ] **FuelingHistoryScreen:** Implementar frontend e integração com backend.
- [ ] **AchievementsScreen:** Implementar frontend e integração com backend.
- [ ] **ChangePasswordScreen:** Implementar frontend e integração com backend.
- [ ] **PasswordValidationTest:** Implementar frontend.
- [ ] **TestRefactoredComponents:** Implementar frontend.

## 🟡 Prioridade Média - Funcionalidade Complementar

- [ ] **ExpensesScreen:** Corrigir erro de renderização que causa tela branca.
- [ ] **AddExpenseScreen / AddFuelingScreen:** Implementar seleção de veículos nos formulários.
- [ ] **Geral (Integração e Navegação):**
    - [ ] Testar integração frontend-backend.
    - [ ] Implementar Navegação Web.
    - [ ] Refatorar Componentes Incompatíveis com a Web.
    - [ ] Testar Fluxo de Autenticação Completo na Web.


