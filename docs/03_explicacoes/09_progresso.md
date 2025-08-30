## Progresso e Próximas Tarefas - GiroPro

Este documento detalha o progresso atual na configuração e validação do projeto GiroPro, bem como as próximas tarefas identificadas para os desenvolvedores.

### 1. Preparação e Entendimento do Projeto (Concluído)
- Repositório clonado.
- Documentação inicial revisada.

### 2. Execução e Correção Imediata (Em Andamento)

#### 2.0. Atualizar bcrypt para a versão 6.0.0

#### 2.1. Problemas de Porta do Backend
- **Problema**: O backend estava iniciando na porta 3000, mesmo após a alteração no `giropro.env` para 4000. Isso ocorria devido a um caminho incorreto no `dotenv.config` em `src/app.ts` e/ou processos antigos ocupando a porta.
- **Correção**: 
    - O caminho do `.env` em `backend/src/app.ts` foi corrigido para `dotenv.config({ path: __dirname + '/../giropro.env' });`.
    - Processos que ocupavam as portas 3000 e 4000 foram identificados e encerrados.
    - O backend agora inicia corretamente na porta 4000.

#### 2.2. Configuração do Frontend
- **Problema**: O frontend não estava se comunicando com o backend devido a uma variável de ambiente `REACT_APP_API_URL` indefinida e problemas com o carregamento do Axios no ambiente web.
- **Correção**: 
    - O arquivo `.env.local` foi criado/atualizado em `frontend/` com `REACT_APP_API_URL=http://localhost:4000/api/v1`.
    - A configuração do `app.json` foi ajustada para o bundler `metro`.
    - O `api.ts` do frontend foi verificado e está configurado para usar `REACT_APP_API_URL`.
- **Status Atual**: O frontend está configurado para apontar para a porta 4000 do backend. No entanto, a instabilidade do ambiente de sandbox impede a validação completa da comunicação.

#### 2.3. Validação de Senha no Registro (Erro 400)
- **Problema**: O fluxo de registro estava retornando um erro 400 (Bad Request) no backend, mesmo com senhas aparentemente fortes.
- **Descoberta**: Análise do `backend/src/utils/validation.ts` revelou regras de validação de senha rigorosas:
    - Mínimo de 8 caracteres.
    - Pelo menos 1 letra minúscula.
    - Pelo menos 1 letra maiúscula.
    - Pelo menos 1 número.
    - Pelo menos 1 caractere especial (`@$!%*?&`).
- **Status Atual**: O frontend (`RegisterScreenOptimized.tsx`) não possui validação de senha tão granular quanto o backend, o que pode levar ao erro 400. A tela de registro otimizada apenas verifica o comprimento mínimo da senha (8 caracteres) e a correspondência entre senha e confirmar senha.

### 3. Validação Técnica (Próximas Tarefas)

#### 3.1. Estabilização do Ambiente
- **Tarefa**: Investigar e resolver a instabilidade persistente do ambiente de sandbox que afeta as operações de arquivo e a execução dos serviços. Isso é crítico para permitir testes completos.
- **Observação**: Foi criada uma nova documentação em `docs/02_guias_como_fazer/06_como_resolver_conflitos_de_porta.md` para orientar sobre o uso de portas alternativas e evitar conflitos.

#### 3.2. Ajuste da Validação de Senha no Frontend
- **Tarefa**: Implementar no `RegisterScreenOptimized.tsx` (e possivelmente no `FormInput.tsx` ou em um novo utilitário de validação no frontend) a mesma lógica de validação de senha presente no `backend/src/utils/validation.ts`.
- **Detalhes**: Garantir que o frontend valide a senha para incluir:
    - Mínimo de 8 caracteres.
    - Pelo menos 1 letra minúscula.
    - Pelo menos 1 letra maiúscula.
    - Pelo menos 1 número.
    - Pelo menos 1 caractere especial (`@$!%*?&`).

#### 3.3. Teste End-to-End do Fluxo de Registro e Login
- **Tarefa**: Após a estabilização do ambiente e a correção da validação de senha no frontend, realizar testes completos do fluxo de registro e login para garantir que:
    - Novos usuários possam se registrar com sucesso.
    - Usuários registrados possam fazer login sem erros.
    - A comunicação entre frontend e backend esteja funcionando perfeitamente para essas operações.

#### 3.4. Code Review Aprofundado (Login)
- **Tarefa**: Realizar um code review detalhado do `LoginScreen.tsx`, `AuthContext.tsx` e `api.ts` para o fluxo de login, garantindo que a lógica de autenticação e o tratamento de erros estejam robustos e em conformidade com as melhores práticas.

### 7. Melhorias no Frontend - ExpenseHistoryScreen

Análise de UX/UI e implementação de melhorias na tela de histórico de despesas, focando em usabilidade, experiência do usuário e interface visual para iOS, Android e Web.

## Complexidade Baixa (Melhorias)

### 5. Funcionalidades Avançadas
- [ ] **Implementar modo escuro**
  - Criar tema escuro para a tela
  - Implementar toggle de tema
  - Ajustar todas as cores para modo escuro
  - Tempo estimado: 2 horas

- [ ] **Adicionar tooltips informativos**
  - Implementar tooltips para requisitos de senha
  - Adicionar ajuda contextual
  - Tempo estimado: 1 hora

- [ ] **Implementar navegação por teclado (Web)**
  - Adicionar suporte completo a teclado
  - Implementar tab order lógico
  - Adicionar atalhos de teclado
  - Tempo estimado: 1 hora 30 minutos

### 6. Otimizações de Performance
- [ ] **Implementar debounce para validação**
  - Adicionar debounce na validação em tempo real
  - Otimizar re-renders desnecessários
  - Tempo estimado: 30 minutos

- [ ] **Lazy loading de componentes**
  - Implementar carregamento sob demanda
  - Otimizar bundle size
  - Tempo estimado: 45 minutos

## Prioridade Média (Importantes)

### 3. Aprimoramentos de UX
- [ ] **Implementar barra de força da senha**
  - Criar componente visual de força da senha
  - Integrar com validação existente
  - Adicionar feedback visual progressivo
  - Tempo estimado: 1 hora

- [ ] **Melhorar feedback visual de validação**
  - Aumentar tamanho dos ícones de requisitos (16px → 20px)
  - Adicionar animações suaves para transições
  - Implementar estados intermediários
  - Tempo estimado: 45 minutos

- [ ] **Reorganizar layout em cards separados**
  - Separar cada seção em cards distintos
  - Implementar elevação e sombras adequadas
  - Melhorar espaçamento entre elementos
  - Tempo estimado: 1 hora

### 4. Microinterações
- [ ] **Adicionar animações de transição**
  - Implementar fade in/out para mensagens
  - Adicionar bounce effect para sucesso
  - Criar shake animation para erros
  - Tempo estimado: 1 hora 30 minutos

- [ ] **Melhorar estados de foco**
  - Implementar animações suaves para foco
  - Adicionar indicadores visuais mais claros
  - Melhorar feedback tátil
  - Tempo estimado: 45 minutos

## Prioridade Alta (Críticas)

### 1. Correção de Layout e Estrutura
- [ ] **Reorganizar posicionamento dos ícones de visualização de senha**
  - Mover ícones para dentro do container do input
  - Garantir alinhamento consistente em todos os campos
  - Tempo estimado: 30 minutos

- [ ] **Corrigir posicionamento das mensagens de erro**
  - Mover mensagens de erro para dentro do container do input
  - Ajustar margem negativa que quebra o layout
  - Tempo estimado: 20 minutos

- [ ] **Implementar sistema de cores semânticas**
  - Criar constantes para cores do sistema
  - Substituir cores hardcoded por variáveis
  - Implementar paleta de cores acessível
  - Tempo estimado: 45 minutos

### 2. Melhorias de Acessibilidade
- [ ] **Adicionar labels adequados para screen readers**
  - Implementar accessibilityLabel para todos os inputs
  - Adicionar accessibilityHint para ações
  - Tempo estimado: 30 minutos

- [ ] **Melhorar contraste de cores**
  - Ajustar cores para conformidade WCAG 2.1 AA
  - Testar contraste em diferentes temas
  - Tempo estimado: 25 minutos


