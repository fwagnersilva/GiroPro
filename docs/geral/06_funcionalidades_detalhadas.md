# Funcionalidades Detalhadas do Sistema GiroPro

Este documento descreve em detalhes as principais funcionalidades do sistema GiroPro, divididas entre Frontend e Backend, com foco em sua operação, validações e importância para o negócio. Ele também serve como uma referência rápida para entender o escopo atual da aplicação, listando as APIs disponíveis, telas e componentes reutilizáveis.

## 1. Backend - APIs Disponíveis

A seguir, as APIs disponíveis no backend do GiroPro, organizadas por módulo:

### 1.1. Módulo de Autenticação (`/auth`)
*   **Função**: Gerencia o ciclo de vida da autenticação e autorização de usuários.
*   **Endpoints Principais**:
    *   ✅ `POST /register`: Criação de novas contas.
    *   ✅ `POST /login`: Autentica usuários e emite tokens de sessão.
    *   ✅ `GET /me`: Retorna o perfil do usuário autenticado.

### 1.2. Módulo de Dashboard (`/dashboard`)
*   **Função**: Fornece dados agregados e métricas de desempenho para o frontend.
*   **Endpoints Principais**:
    *   ✅ `GET /summary`: Resumo consolidado de lucratividade e métricas financeiras.
    *   ✅ `GET /evolution`: Dados para gráficos de evolução temporal.
    *   ✅ `GET /vehicles`: Comparativo de desempenho entre veículos.

### 1.3. Módulo de Veículos (`/vehicles`)
*   **Função**: Gerencia o ciclo de vida (CRUD) dos veículos do usuário.
*   **Endpoints Principais**: Operações CRUD para veículos (criação, leitura, atualização, exclusão).
*   **Importância**: Garante a integridade dos dados da frota e impacta cálculos de custos e desempenho.

### 1.4. Módulo de Abastecimentos (`/fuelings`)
*   **Função**: Gerencia o registro, consulta, atualização e remoção de dados de abastecimento.
*   **Endpoints Principais**: Operações CRUD para abastecimentos.
*   **Importância**: Essencial para a gestão de custos de combustível e análise de eficiência.

### 1.5. Módulo de Despesas (`/expenses`)
*   **Função**: Gerencia o registro, consulta, atualização e remoção de despesas operacionais e pessoais.
*   **Endpoints Principais**: Operações CRUD para despesas.
*   **Importância**: Crucial para o controle financeiro detalhado e análises de lucratividade.

### 1.6. Módulo de Jornadas (`/journeys`)
*   **Função**: Gerencia o registro, consulta, atualização e remoção de jornadas de trabalho.
*   **Endpoints Principais**: Operações CRUD para jornadas, incluindo início e finalização.
*   **Importância**: Fundamental para o planejamento e controle logístico, e registro de faturamento por plataforma.

### 1.7. Módulo de Plataformas (`/platforms`)
*   **Função**: Gerencia as plataformas de trabalho do usuário (predefinidas e customizadas).
*   **Endpoints Principais**: Operações CRUD para plataformas, incluindo ativação/desativação.
*   **Importância**: Vital para o cálculo correto do faturamento por plataforma e métricas do dashboard.

### 1.8. Módulo de Relatórios (`/reports`)
*   **Função**: Transforma dados brutos em insights estratégicos através de relatórios e análises.
*   **Endpoints Principais**: Geração de resumos financeiros, relatórios semanais/mensais e analytics avançados.

### 1.9. Módulo de Gamificação (`/gamification`)
*   **Função**: Implementa sistema de conquistas para engajamento do usuário.

### 1.10. Módulo de Preços de Combustível (`/fuel-prices`)
*   **Função**: Consulta e histórico de preços de combustível.

### 1.11. Módulo de Notificações (`/notifications`)
*   **Função**: Sistema de notificações para alertas e informações ao usuário.

### 1.12. Módulo de Insights (`/insights`)
*   **Função**: Geração de análises e sugestões personalizadas para o usuário.

## 2. Frontend - Telas e Interações

A interface do usuário do GiroPro oferece as seguintes telas principais:

### 2.1. Telas de Autenticação

#### `LoginScreen`

*   **Propósito**: Autenticação de usuários, validação de credenciais e início de sessão.
*   **Campos**: `email` (formato válido), `senha` (mínimo 8 caracteres).
*   **Integração**: Endpoint `/auth/login` do backend.

#### `RegisterScreen`

*   **Propósito**: Criação de novas contas de usuário.
*   **Campos**: `nome`, `email` (válido e único), `senha` (mínimo 8 caracteres, maiúsculas, minúsculas, números, especiais), `confirmarSenha` (igual à senha).
*   **Integração**: Endpoint `/auth/register` do backend.

#### `ChangePasswordScreen`

*   **Propósito**: Atualização segura da senha do usuário.
*   **Campos**: `senhaAtual`, `novaSenha`, `confirmarNovaSenha`.
*   **Validações**: `novaSenha` deve atender aos requisitos de segurança e `confirmarNovaSenha` deve ser idêntica.

### 2.2. Telas de Dashboard

#### `DashboardScreen`

*   **Propósito**: Visualização centralizada de métricas operacionais e financeiras.
*   **Dados Exibidos**: Lucratividade, evolução de receitas/despesas, comparativo de veículos, faturamento por plataforma, KM rodados, número de jornadas.
*   **Integração**: Consome dados dos endpoints `/dashboard/summary`, `/dashboard/evolution` e `/dashboard/vehicles` do backend.

### 2.3. Telas de Veículos

#### `VehiclesScreen`

*   **Propósito**: Gerenciamento completo (CRUD) da frota de veículos do usuário.
*   **Funcionalidades**: Listagem, adição, edição e remoção de veículos.
*   **Integração**: Endpoint `/vehicles` do backend.

#### `MultiVehicleScreen`

*   **Propósito**: Seleção e alternância eficiente entre veículos para usuários com múltiplas frotas.
*   **Impacto**: A seleção do veículo nesta tela afeta os dados exibidos em outras seções do aplicativo.

### 2.4. Telas de Abastecimentos

#### `FuelingsScreen`

*   **Propósito**: Registro e acompanhamento de abastecimentos para cálculo de custos e eficiência de combustível.
*   **Funcionalidades**: Registro de novos abastecimentos (data, valor, volume, odômetro), listagem, edição e exclusão.
*   **Integração**: Endpoint `/fuelings` do backend.

### 2.5. Telas de Despesas

#### `ExpensesScreen`

*   **Propósito**: Gerenciamento completo (CRUD) de despesas operacionais e pessoais.
*   **Funcionalidades**: Listagem, adição, edição e remoção de despesas.
*   **Integração**: Endpoint `/expenses` do backend.

### 2.6. Telas de Jornadas

#### `JourneysScreen`

*   **Propósito**: Gerenciamento completo (CRUD) de jornadas de trabalho.
*   **Funcionalidades**: Listagem, início, finalização, edição e exclusão de jornadas.
*   **Integração**: Endpoint `/journeys` do backend.

### 2.7. Telas de Plataformas

#### `PlatformsScreen`

*   **Propósito**: Gerenciamento das plataformas de trabalho (ex: Uber, 99).
*   **Funcionalidades**: Visualização, ativação/desativação de plataformas predefinidas, adição, edição e exclusão de plataformas customizadas.
*   **Integração**: Endpoint `/platforms` do backend.

### 2.8. Telas de Relatórios

*   ✅ `ReportsScreen`

### 2.9. Telas de Gamificação

*   ✅ `GoalsScreen` / `GoalsScreenOptimized`
*   ✅ `AchievementsScreen` / `AchievementsScreenOptimized`

### 2.10. Telas de Perfil

*   ✅ `ProfileScreen` / `ProfileScreenOptimized`

### 2.11. Telas de Insights

*   ✅ `InsightsScreen`

### 2.12. Telas de Onboarding

*   ✅ `OnboardingScreen`

## 3. Componentes Reutilizáveis

O projeto utiliza uma série de componentes reutilizáveis para agilizar o desenvolvimento e manter a consistência da UI.

### 3.1. UI Components
*   ✅ `FormInput`
*   ✅ `LoadingSpinner`
*   ✅ `SkeletonLoader`
*   ✅ `ResponsiveContainer`

### 3.2. Feature Components
*   ✅ `EnhancedDashboard`
*   ✅ `AdvancedAnalytics`
*   ✅ `WeeklyMonthlyReports`
*   ✅ `InsightsPanel`
*   ✅ `NotificationBell`
*   ✅ `NotificationCenter`
*   ✅ `MultiVehicleSelector`
*   ✅ `SearchAndFilter`
*   ✅ `HistoryList`
*   ✅ `OnboardingWizard`

---

**Última atualização**: 01/10/2025
**Versão**: 1.3

