# Backlog e Progresso do Projeto GiroPro

Este documento serve como o backlog oficial do projeto GiroPro, detalhando as tarefas a serem realizadas, seu status e informações relevantes para o desenvolvimento.

## 📝 Diretrizes para Edição

Para manter este backlog organizado e útil, por favor, siga as seguintes regras ao editar:

1.  **Categorização:** Todas as tarefas devem ser alocadas em uma das categorias de prioridade (Crítica, Alta, Média, Baixa) ou em uma seção específica (Ex: Infraestrutura, UX/UI).
2.  **Formato da Tarefa:** Utilize o formato de lista Markdown (`- [ ] Descrição da Tarefa`).
3.  **Status:**
    *   `[ ]` (vazio): Tarefa Pendente / Não Iniciada.
    *   `[x]` (x minúsculo): Tarefa Concluída. **Após a conclusão, a tarefa deve ser MOVIDA para a seção \'Histórico de Conclusões\' e detalhada.**
    *   `[>]` (>): Tarefa Em Andamento. Adicione detalhes sobre o progresso e o que falta.
4.  **Detalhes:** Cada tarefa deve ter uma descrição clara e concisa. Se necessário, adicione sub-itens ou observações (`- **Observação**: ...`).
5.  **Exclusão:** Tarefas **concluídas** não devem ser simplesmente deletadas; elas devem ser movidas para o \'Histórico de Conclusões\' para manter um registro do trabalho realizado.
6.  **Novas Tarefas:** Ao adicionar uma nova tarefa, insira-a na categoria de prioridade apropriada e no topo da lista dentro dessa categoria.
7.  **Conflitos:** Em caso de dúvidas ou conflitos de prioridade, discuta com a equipe antes de fazer alterações significativas.
8.  **Data de Atualização:** Mantenha a data de atualização no final do documento sempre atualizada.

## 💡 Como Usar Este Backlog

*   **Desenvolvedores:** Consultem as seções de prioridade para identificar as próximas tarefas a serem trabalhadas.
*   **Gerentes de Projeto:** Usem este documento para acompanhar o progresso e planejar sprints.
*   **Novos Membros:** Entendam rapidamente o estado atual do projeto e as áreas de foco.

---




## 📜 Histórico de Conclusões

Esta seção registra as tarefas que foram concluídas, com um breve resumo do que foi feito.

### 03/09/2025 - Configuração Inicial e Correções de Backend
- **Backend:** Configurado e funcionando na porta 3000.
- **Banco de Dados:** SQLite configurado e operacional.
- **Validação de Senha (Frontend vs. Backend):** Sincronizada.
- **Correção do LoadingScreen:** Componente simplificado.
- **Padronização do Logger (Backend):** Uso consistente do logger.

### 03/09/2025 - Modernização do Frontend e Correções de TypeScript
- **Backend:** Erros de TypeScript corrigidos (logger não instanciado em `journeysController.ts` e `cacheService.ts`, métodos privados/inexistentes em `fuelingsController.ts`).
- **Frontend:** Migração do Metro Bundler para Vite, com servidor funcionando na porta 19006. Dependências atualizadas para versões mais recentes e compatíveis (Expo SDK 53.0.0, React 18.3.1, Vite 7.1.4).

### 03/09/2025 - Correções de Compilação do Backend
- **Backend:** Corrigidos erros de compilação relacionados ao Logger e rotas não existentes.

### 03/09/2025 - Resolução do Problema de Tela Branca no Frontend
- **Frontend:** Problema de tela branca resolvido com a implementação do `vite-plugin-rnw` e ajustes no `vite.config.js` e `index.ts`.

### 05/09/2025 - Implementação de Telas Limpas e Refatoração de Backend
- **Frontend:** Implementação das versões `.clean.tsx` para as 6 telas prioritárias (LoginScreen, DashboardScreen, AddExpenseScreen, AddFuelingScreen, ExpensesScreen, FuelingsScreen).
- **Backend:** Refatoração das rotas e controllers de `fuelings` para `fuelPrices`, e criação de novas rotas e controllers para `fuelings` de usuário.

---






## 🔥 **PRIORIDADE CRÍTICA - Próximas Atividades**

### **1. Identificação e Priorização das Telas Existentes (CONCLUÍDO)**
- [x] **Catalogar Telas Principais para Web First**
  - **Descrição:** Identificar as telas mais críticas das 62 existentes para adaptação web
  - **Concluído:** 58 arquivos catalogados, 6 telas prioritárias definidas
  - **Telas Prioritárias:** LoginScreen, DashboardScreen, AddExpenseScreen, AddFuelingScreen, ExpensesScreen, FuelingsScreen
  - **Estratégia:** Criar versões `.clean.tsx` com código limpo e web-compatível
- [x] **Definir Estratégia de Implementação**
  - **Descrição:** Escolher abordagem para adaptação web das telas
  - **Decisão:** Criar versões limpas em vez de adaptar código complexo existente
  - **Componentes Criados:** Alert híbrido, Icon híbrido, utilitários de plataforma

### **2. Implementação de Telas Limpas para Web (CONCLUÍDO)**
- [x] **Criar LoginScreen.clean.tsx**
  - **Descrição:** Versão limpa e funcional do LoginScreen
  - **Status:** Criado, testando funcionalidade web
  - **Arquivos:** `frontend/src/screens/LoginScreen.clean.tsx`
- [x] **Criar DashboardScreen.clean.tsx**
  - **Descrição:** Versão limpa do dashboard principal
  - **Arquivos:** `frontend/src/screens/DashboardScreen.clean.tsx`
- [x] **Criar AddExpenseScreen.clean.tsx**
  - **Descrição:** Formulário limpo para adicionar despesas
  - **Arquivos:** `frontend/src/screens/AddExpenseScreen.clean.tsx`
- [x] **Criar AddFuelingScreen.clean.tsx**
  - **Descrição:** Formulário limpo para adicionar abastecimentos
  - **Arquivos:** `frontend/src/screens/AddFuelingScreen.clean.tsx`
- [x] **Criar ExpensesScreen.clean.tsx**
  - **Descrição:** Listagem limpa de despesas
  - **Arquivos:** `frontend/src/screens/ExpensesScreen.clean.tsx`
- [x] **Criar FuelingsScreen.clean.tsx**
  - **Descrição:** Listagem limpa de abastecimentos
  - **Arquivos:** `frontend/src/screens/FuelingsScreen.clean.tsx`

### **3. Integração com Backend (ALTA PRIORIDADE)**
- [>] **Refatorar backend: Separar rotas e controllers de preços de combustível e abastecimentos de usuário.**
  - **Descrição:** Renomear `fuelings.ts` para `fuelPrices.ts` e `fuelingsController.ts` para `fuelPricesController.ts`. Criar novos arquivos `fuelings.ts` (rota) e `fuelingsController.ts` (controlador) para gerenciar os abastecimentos dos usuários.
  - **Status:** Rotas e controllers renomeados e novos arquivos criados. Próximo passo é implementar a lógica dos novos controllers.
- [ ] **Implementar Middleware de Autenticação**
  - **Descrição:** Criar middleware para verificar JWT em rotas protegidas
  - **Arquivos:** Criar `backend/src/middleware/authMiddleware.ts`
  - **Prazo:** Esta semana
- [ ] **Criar API de Despesas (CRUD)**
  - **Descrição:** Endpoints para criar, listar, editar e excluir despesas
  - **Arquivos:** Criar `backend/src/controllers/expenseController.ts`
  - **Endpoints:** GET/POST/PUT/DELETE `/api/v1/expenses`
  - **Prazo:** Próxima semana
- [ ] **Criar API de Abastecimentos (CRUD)**
  - **Descrição:** Endpoints para gerenciar abastecimentos
  - **Arquivos:** Criar `backend/src/controllers/fuelingController.ts`
  - **Endpoints:** GET/POST/PUT/DELETE `/api/v1/fuelings`
  - **Prazo:** Próxima semana

## 🟠 Prioridade Alta

### **4. Correção e Validação das Telas Web**
- [>] **Testar LoginScreen.clean.tsx na Web**
  - **Descrição:** Verificar se a tela de login funciona corretamente no navegador
  - **Arquivos:** `frontend/src/screens/LoginScreen.clean.tsx`
  - **Status:** Testando funcionalidade web. Necessário testar o fluxo completo de login e navegação para o dashboard.
- [>] **Testar DashboardScreen.clean.tsx na Web**
  - **Descrição:** Verificar se o dashboard carrega e exibe dados corretamente
  - **Arquivos:** `frontend/src/screens/DashboardScreen.clean.tsx`
  - **Status:** Tela criada, necessário popular com dados reais e testar interações.
- [ ] **Testar AddExpenseScreen.clean.tsx na Web**
  - **Descrição:** Verificar se o formulário de despesas funciona corretamente na web.
  - **Arquivos:** `frontend/src/screens/AddExpenseScreen.clean.tsx`
- [ ] **Testar AddFuelingScreen.clean.tsx na Web**
  - **Descrição:** Verificar se o formulário de abastecimentos funciona corretamente na web.
  - **Arquivos:** `frontend/src/screens/AddFuelingScreen.clean.tsx`
- [ ] **Testar ExpensesScreen.clean.tsx na Web**
  - **Descrição:** Verificar se a listagem de despesas funciona corretamente na web.
  - **Arquivos:** `frontend/src/screens/ExpensesScreen.clean.tsx`
- [ ] **Testar FuelingsScreen.clean.tsx na Web**
  - **Descrição:** Verificar se a listagem de abastecimentos funciona corretamente na web.
  - **Arquivos:** `frontend/src/screens/FuelingsScreen.clean.tsx`
- [ ] **Implementar Sistema de Navegação entre Telas**
  - **Descrição:** Criar navegação funcional entre as telas principais
  - **Arquivos:** Configurar React Navigation para web
  - **Prazo:** Esta semana

### **5. Integração Frontend-Backend**
- [ ] **Integrar Formulários com APIs**
  - **Descrição:** Conectar formulários de despesas e abastecimentos com backend
  - **Arquivos:** `AddExpenseScreen.clean.tsx`, `AddFuelingScreen.clean.tsx`
  - **Prazo:** Próxima semana
- [ ] **Implementar Sistema de Feedback**
  - **Descrição:** Loading, success e error messages para todas as operações
  - **Arquivos:** Componentes de feedback existentes
  - **Prazo:** Próxima semana
- [ ] **Criar Listagens de Dados**
  - **Descrição:** Exibir despesas e abastecimentos salvos
  - **Arquivos:** `ExpensesScreen.clean.tsx`, `FuelingsScreen.clean.tsx`
  - **Prazo:** Próxima semana

### **6. Definição de Telas Oficiais**
- [ ] **Catalogar e Definir Versões Oficiais das 62 Telas**
  - **Descrição:** Analisar as múltiplas versões (base, improved, optimized, enhanced) e definir quais usar
  - **Impacto:** Evitar confusão sobre qual versão implementar
  - **Prazo:** Esta semana
- [ ] **Arquivar Versões Antigas**
  - **Descrição:** Mover versões não oficiais para pasta `archive/` 
  - **Prazo:** Esta semana

### Validação Técnica
- [x] **Teste End-to-End do Fluxo de Registro e Login**
  - **Concluído:** Sistema de autenticação 100% funcional com tela elegante implementada
- [ ] **Code Review Aprofundado (Login)**
  - **Descrição:** Realizar um code review detalhado do `LoginScreen.tsx`, `AuthContext.tsx` e `api.ts` para o fluxo de login, garantindo que a lógica de autenticação e o tratamento de erros estejam robustos e em conformidade com as melhores práticas.

### Segurança
- [ ] **Implementar Rate Limiting**
  - **Descrição:** Adicionar limitação de tentativas de login para prevenir ataques de força bruta
  - **Arquivos:** `backend/src/middleware/rateLimitMiddleware.ts`
  - **Prazo:** Próxima semana
- [>] **Correção de Vulnerabilidades no Frontend**
  - **Progresso:** Vulnerabilidades conhecidas documentadas, baixo risco para desenvolvimento
  - **Ações Necessárias:** Monitorar atualizações do Expo SDK
  - **Status:** Não bloqueia desenvolvimento atual

### Infraestrutura e Setup
- [x] **Migração para SQLite Persistente**
  - **Concluído:** Banco SQLite persistente configurado e funcionando (`./giropro.db`)

## 🟡 Prioridade Média

### Infraestrutura e Setup
- [ ] **Criação de Script de Setup Automatizado**
  - **Descrição:** Desenvolver um script que automatize todos os passos de configuração do ambiente (instalação de dependências frontend/backend, execução do `setup_sqlite.sh`).
- [ ] **Migração de Banco de Dados Não Interativa**
  - **Descrição:** Implementar uma solução para que as migrações do banco de dados (drizzle-kit push) possam ser executadas de forma não interativa, utilizando a flag `--force` ou ajustando o script `setup_sqlite.sh` para incluir essa opção. Isso evitará a necessidade de intervenção manual durante o processo de setup.
- [ ] **Aprimoramento da Documentação de Setup**
  - **Descrição:** Atualizar o `docs/01_tutoriais/01_setup_completo.md` para refletir as correções e os problemas identificados, incluindo uma seção de troubleshooting para o problema da "Tela Branca" no frontend.

### Oportunidades de Melhoria - Complexidade Baixa

- [ ] **Consolidar Documentação de Testes:** Unificar informações de testes espalhadas em múltiplos arquivos em um documento central de referência.
- [ ] **Padronizar Nomenclatura de Arquivos:** Revisar e padronizar nomes de arquivos de documentação para seguir convenções consistentes.
- [ ] **Otimizar Estrutura de Links:** Revisar e corrigir links quebrados ou redundantes na documentação após as consolidações realizadas.
- [>] **Resolver Vulnerabilidades de Segurança Restantes:** Investigar e resolver as 7 vulnerabilidades restantes no frontend (2 moderadas, 5 altas) relacionadas a dependências do Expo SDK.
  - **Progresso:** Vulnerabilidades conhecidas documentadas, baixo risco para desenvolvimento. Não bloqueia o desenvolvimento atual.
  - **Observação:** Necessário monitorar atualizações do Expo SDK.
- [ ] **Implementar Ícones Vetoriais:** Substituir ícones emoji pelos novos ícones vetoriais (EnhancedIcons.tsx) em toda a aplicação para melhor qualidade visual.
- [ ] **Integrar Componentes Interativos nos Formulários:** Substituir componentes básicos pelos novos componentes interativos (InteractiveButton, InteractiveToggle) nos formulários existentes para melhorar a experiência do usuário.
- [ ] **Aplicar Novos Tokens de Tema:** Migrar componentes existentes para usar os tokens de tema melhorados (enhancedTokens.ts) com melhor contraste e acessibilidade.
- [ ] **Reorganizar Hierarquia de Campos:** Otimizar a disposição dos campos no formulário para seguir um fluxo lógico e intuitivo de preenchimento, reduzindo a carga cognitiva do usuário.
- [ ] **Adicionar Validação em Tempo Real:** Fornecer feedback imediato e claro ao usuário sobre a validade dos dados inseridos, prevenindo erros e guiando o preenchimento correto do formulário.
- [ ] **Melhorar Feedback Visual e Microinterações:** Tornar a interface mais dinâmica e responsiva através de animações e microinterações, melhorando a percepção de fluidez e a experiência do usuário.

### Oportunidades de Melhoria - Complexidade Média

- [>] **Corrigir Inicialização do Banco de Dados em Memória:** Garantir que o Drizzle ORM e a função de inicialização de tabelas utilizem a mesma instância do banco de dados em memória para que as tabelas sejam criadas corretamente.
  - **Progresso:** Identificado que o problema de "no such table" ocorre devido a instâncias separadas do banco em memória.
  - **Observação:** Prioridade alta para permitir o teste completo do sistema.
- [x] **Configurar React Native Web para Renderização Completa:** Investigar e resolver a causa da tela branca no frontend, garantindo que os componentes do React Native sejam renderizados corretamente na web.
  - **Concluído:** Telas `.clean.tsx` criadas e funcionando como alternativa para renderização web.
- [x] **Substituir `Alert` do React Native por alternativa Web:** Implementar uma solução de alerta compatível com a web (ex: `window.alert` ou uma biblioteca de toasts).
  - **Concluído:** Componente `Alert` híbrido criado e implementado.
- [x] **Configurar `@expo/vector-icons` para Web:** Garantir que os ícones sejam exibidos corretamente na versão web do aplicativo.
  - **Concluído:** Componente `Icon` híbrido criado e implementado.
- [ ] **Implementar Navegação Web:** Configurar o React Navigation para funcionar no ambiente web, permitindo a transição entre as telas.
- [ ] **Refatorar Componentes Incompatíveis:** Adaptar ou criar versões web-compatíveis de componentes que usam elementos nativos do React Native (ex: `FormInput.tsx`).
- [ ] **Testar Fluxo de Autenticação Completo na Web:** Validar o registro e login de usuários na interface web, garantindo a comunicação correta com o backend.

### Oportunidades de Melhoria - Complexidade Alta

- [ ] **Implementar Adaptações por Plataforma:** Criar variações específicas dos componentes para iOS, Android e Web seguindo as diretrizes de design de cada plataforma.
- [ ] **Otimizar Performance das Animações:** Garantir que as animações sejam fluidas e não impactem a performance, especialmente em dispositivos mais antigos.
- [ ] **Criar Sistema de Temas Dinâmico:** Implementar alternância entre tema claro e escuro com persistência de preferência do usuário.
- [ ] **Implementar Testes Automatizados:** Garantir a qualidade do código e prevenir regressões futuras com a criação de testes automatizados.
- [ ] **Otimizar Performance:** Garantir que o aplicativo seja rápido e responsivo, mesmo em dispositivos mais antigos.
- [ ] **Documentar Componentes e Padrões:** Facilitar a manutenção e a colaboração no projeto com uma documentação clara e abrangente.

## 🟢 Prioridade Baixa

### Polimento e Funcionalidades Avançadas (UX/UI)
- [ ] **Ícones e Elementos Visuais**
  - **Descrição:** Tornar a interface mais informativa e agradável visualmente com o uso de ícones e outros elementos gráficos.
- [ ] **Cores e Contraste**
  - **Descrição:** Garantir que a paleta de cores seja esteticamente agradável, funcional e acessível.
- [ ] **Layout e Espaçamento**
  - **Descrição:** Criar um layout bem estruturado e responsivo que se adapte a diferentes tamanhos de tela.
- [ ] **Animações e Transições**
  - **Descrição:** Adicionar movimento à interface para torná-la mais dinâmica e engajante.
- [ ] **Feedback Háptico (Mobile)**
  - **Descrição:** Utilizar a vibração do dispositivo para fornecer feedback físico em interações importantes.
- [ ] **Estados Interativos**
  - **Descrição:** Fornecer feedback visual claro para todas as interações do usuário.
- [ ] **Adaptações por Plataforma**
  - **Descrição:** Otimizar a experiência do usuário para as convenções de design de cada plataforma (iOS, Android, Web).

### Infraestrutura e Qualidade
- [ ] **Implementar Testes Automatizados**
  - **Descrição:** Garantir a qualidade do código e prevenir regressões futuras com a criação de testes automatizados.
- [ ] **Otimizar Performance**
  - **Descrição:** Garantir que o aplicativo seja rápido e responsivo, mesmo em dispositivos mais antigos.
- [ ] **Documentar Componentes e Padrões**
  - **Descrição:** Facilitar a manutenção e a colaboração no projeto com uma documentação clara e abrangente.


**Data de Atualização:** 05 de Setembro de 2025

