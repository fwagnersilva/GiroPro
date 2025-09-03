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

### 31/08/2025 - Configuração Inicial e Correções de Backend
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

---




## 🔴 Prioridade Crítica

### Frontend
- [>] **Resolver problema de renderização do Frontend (Tela Branca)**
  - **Progresso:** Servidor Vite está rodando na porta 19006, mas a aplicação não renderiza. O problema é relacionado ao parsing de JSX/TSX no Vite, mesmo com as configurações de `esbuild` e `tsconfig.json` atualizadas. Tentativas de correção no `vite.config.js` não resolveram o problema de parsing de JSX em `node_modules`.
  - **Ações Necessárias:** Investigar mais a fundo a configuração do `esbuild` dentro do Vite para garantir que o JSX seja transpilado corretamente. Pode ser necessário ajustar o `jsxRuntime` ou `jsxFactory` no `tsconfig.json` ou no `vite.config.js`. Considerar alternativas como o uso de plugins específicos para Vite ou a investigação de compatibilidade entre o Expo SDK e o Vite.
  - **Observação:** Já foram criados mocks para `codegenNativeComponent` e `codegenNativeCommands` para contornar problemas de importação de módulos nativos.

## 🟠 Prioridade Alta

### Validação Técnica
- [ ] **Ajuste da Validação de Senha no Frontend**
  - **Descrição:** Implementar no `RegisterScreenOptimized.tsx` (e possivelmente no `FormInput.tsx` ou em um novo utilitário de validação no frontend) a mesma lógica de validação de senha presente no `backend/src/utils/validation.ts`.
  - **Detalhes:** Garantir que o frontend valide a senha para incluir: Mínimo de 8 caracteres, Pelo menos 1 letra minúscula, Pelo menos 1 letra maiúscula, Pelo menos 1 número, Pelo menos 1 caractere especial (`@$!%*?&`).
- [ ] **Teste End-to-End do Fluxo de Registro e Login**
  - **Descrição:** Após a estabilização do ambiente e a correção da validação de senha no frontend, realizar testes completos do fluxo de registro e login para garantir que novos usuários possam se registrar com sucesso, usuários registrados possam fazer login sem erros, e a comunicação entre frontend e backend esteja funcionando perfeitamente para essas operações.
- [ ] **Code Review Aprofundado (Login)**
  - **Descrição:** Realizar um code review detalhado do `LoginScreen.tsx`, `AuthContext.tsx` e `api.ts` para o fluxo de login, garantindo que a lógica de autenticação e o tratamento de erros estejam robustos e em conformidade com as melhores práticas.

## 🟡 Prioridade Média

### Infraestrutura e Setup
- [ ] **Criação de Script de Setup Automatizado**
  - **Descrição:** Desenvolver um script que automatize todos os passos de configuração do ambiente (instalação de dependências frontend/backend, execução do `setup_sqlite.sh`).
- [ ] **Migração de Banco de Dados Não Interativa**
  - **Descrição:** Implementar uma solução para que as migrações do banco de dados (drizzle-kit push) possam ser executadas de forma não interativa, utilizando a flag `--force` ou ajustando o script `setup_sqlite.sh` para incluir essa opção. Isso evitará a necessidade de intervenção manual durante o processo de setup.
- [ ] **Aprimoramento da Documentação de Setup**
  - **Descrição:** Atualizar o `docs/01_tutoriais/01_setup_completo.md` para refletir as correções e os problemas identificados, incluindo uma seção de troubleshooting para o problema da "Tela Branca" no frontend.

### Oportunidades de Melhoria - Complexidade Baixa

- [ ] **Reorganizar Hierarquia de Campos:** Otimizar a disposição dos campos no formulário para seguir um fluxo lógico e intuitivo de preenchimento, reduzindo a carga cognitiva do usuário.
- [ ] **Implementar Design System Consistente:** Aplicar os tokens de design definidos no projeto para garantir uma identidade visual coesa e facilitar a manutenção e escalabilidade da interface.
- [ ] **Adicionar Validação em Tempo Real:** Fornecer feedback imediato e claro ao usuário sobre a validade dos dados inseridos, prevenindo erros e guiando o preenchimento correto do formulário.
- [ ] **Melhorar Feedback Visual e Microinterações:** Tornar a interface mais dinâmica e responsiva através de animações e microinterações, melhorando a percepção de fluidez e a experiência do usuário.

### Oportunidades de Melhoria - Complexidade Média

- [ ] **Ícones e Elementos Visuais:** Tornar a interface mais informativa e agradável visualmente com o uso de ícones e outros elementos gráficos.
- [ ] **Cores e Contraste:** Garantir que a paleta de cores seja esteticamente agradável, funcional e acessível.
- [ ] **Layout e Espaçamento:** Criar um layout bem estruturado e responsivo que se adapte a diferentes tamanhos de tela.
- [ ] **Animações e Transições:** Adicionar movimento à interface para torná-la mais dinâmica e engajante.

### Oportunidades de Melhoria - Complexidade Alta

- [ ] **Feedback Háptico (Mobile):** Utilizar a vibração do dispositivo para fornecer feedback físico em interações importantes.
- [ ] **Estados Interativos:** Fornecer feedback visual claro para todas as interações do usuário.
- [ ] **Adaptações por Plataforma:** Otimizar a experiência do usuário para as convenções de design de cada plataforma (iOS, Android, Web).
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

---

**Última Atualização:** 03 de Setembro de 2025


