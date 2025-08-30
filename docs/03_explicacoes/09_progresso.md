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

## Complexidade Baixa (Polimento e Otimização)

### 1. Melhorias de Acessibilidade
- **Adicionar labels para screen readers**: Implementar `accessibilityLabel`, `accessibilityHint` e `accessibilityRole` em todos os elementos interativos para garantir a compatibilidade com leitores de tela.
- **Melhorar navegação por teclado (Web)**: Assegurar uma ordem de tabulação lógica, adicionar atalhos de teclado (ex: Ctrl+N para nova despesa) e implementar indicadores de foco visíveis.

### 2. Adaptações Multiplataforma
- **Otimizações para iOS**: Implementar swipe actions nativas, usar cores do sistema quando apropriado e adicionar `disclosure indicators` para navegação.
- **Otimizações para Android**: Utilizar componentes do Material Design, adicionar um FAB (Floating Action Button) para novas despesas e usar `elevation` e sombras do Material Design.
- **Otimizações para Web**: Adicionar `hover states` para elementos interativos, usar `cursor: pointer` e incluir `tooltips` informativos.

### 3. Implementar Modo Escuro
- **Criar tema escuro**: Definir uma paleta de cores para o modo escuro, implementar detecção automática da preferência do sistema, adicionar um toggle manual e testar o contraste.

### 4. Otimizações de Performance
- **Melhorar renderização da lista**: Implementar `getItemLayout` para a `FlatList`, otimizar o `keyExtractor` e usar memoização de componentes.
- **Adicionar cache local**: Implementar cache de despesas para acesso offline com sincronização inteligente.

### 5. Microinterações e Animações
- **Adicionar animações suaves**: Usar `LayoutAnimation` para mudanças na lista, adicionar animações de entrada/saída para os cards e animar os estados de carregamento.
- **Melhorar feedback tátil**: Adicionar `haptic feedback` para ações importantes e vibrações sutis para confirmações.

## Complexidade Média (Melhorias Significativas)

### 1. Adicionar Resumos Financeiros
- **Implementar header com resumo**: Mostrar o total de despesas do período selecionado, atualizando dinamicamente com os filtros, e adicionar indicadores de tendência.
- **Adicionar visualizações simples**: Implementar um gráfico de pizza para distribuição por categoria e barras de progresso para as categorias principais.

### 2. Melhorar Estados e Feedback
- **Implementar skeleton screens**: Substituir o `ActivityIndicator` por um skeleton loading com animação de shimmer que imita a estrutura dos cards.
- **Melhorar estados de erro**: Criar um componente `ErrorState` com ilustração, botões de ação (tentar novamente) e mensagens de erro mais informativas.
- **Aprimorar empty state**: Adicionar uma ilustração mais engajante, melhorar o texto com dicas de uso e adicionar um botão de ação primário mais proeminente.

### 3. Implementar Funcionalidade de Edição
- **Criar tela de edição de despesas**: Implementar uma tela `EditExpenseScreen` similar à `AddExpenseScreen`, pré-populando os campos com os dados existentes e adicionando validação de formulário.
- **Atualizar navegação**: Adicionar a rota para edição na navegação, implementar a passagem de parâmetros da despesa e atualizar a lista após a edição.

## Complexidade Alta (Impacto Imediato na UX)

### 1. Implementar Sistema de Filtros
- **Criar componente FilterModal**: Implementar um modal ou bottom sheet para filtros, incluindo filtros por data, seletor de data customizado, filtros por categoria e por veículo.
- **Adicionar barra de busca**: Implementar uma `SearchBar` no header com busca em tempo real por descrição e histórico de buscas recentes.
- **Atualizar header com indicadores de filtro**: Adicionar um ícone de filtro no header, mostrar badges quando filtros estiverem ativos e exibir um contador de resultados.

### 2. Redesign dos Cards de Despesa
- **Melhorar hierarquia visual**: Aumentar o tamanho e o peso da fonte do valor, reposicioná-lo e reduzir a proeminência da data, melhorando o contraste de cores.
- **Otimizar layout dos cards**: Reduzir o espaçamento vertical, implementar um layout mais compacto e ajustar o padding interno.
- **Revisar sistema de cores**: Atualizar as cores das categorias seguindo princípios semânticos e testar o contraste WCAG AA.

### 3. Implementar Swipe Actions
- **Swipe para editar**: Implementar swipe da direita para a esquerda com uma ação de edição (ícone e cor azul).
- **Swipe para excluir**: Implementar swipe da esquerda para a direita com uma ação de exclusão (ícone e cor vermelha) e confirmação com possibilidade de desfazer.


