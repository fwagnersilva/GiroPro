# Backlog Global do Projeto GiroPro

<!-- ATENÇÃO: Não modifique ou remova este cabeçalho e a estrutura geral deste arquivo. Ele é essencial para o funcionamento do sistema. -->

Este é o backlog central do projeto GiroPro. Ele contém todas as demandas, épicos, features, bugs e débitos técnicos que precisam ser trabalhados pelos agentes.

## Backlog Frontend

- **Tarefa:** P0 - Corrigir renderização do Dashboard após login (Web)
  - **Quem:** Frontend
  - **O que:** O frontend não está atualizando o estado do usuário após o login bem-sucedido, impedindo a renderização do Dashboard.
  - **Porquê:** A API retorna sucesso, o localStorage é atualizado, mas o componente Dashboard não renderiza.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P0 - Corrigir interatividade do formulário de login no frontend React (Web)
  - **Quem:** Frontend
  - **O que:** O formulário de login no React não está processando o submit corretamente.
  - **Porquê:** Campos são limpos após clique, mas nenhuma ação subsequente. Console não mostra logs de debug do JavaScript, indicando possível problema de execução.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P1 - Implementar Seleção de Veículos nos Formulários (Web, Android, iOS)
  - **Quem:** Frontend
  - **O que:** Adicionar dropdown/picker para seleção de veículos cadastrados nos formulários de despesas e abastecimentos.
  - **Porquê:** Melhorar a usabilidade e evitar erros de digitação.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P1 - Implementar Navegação Web Completa
  - **Quem:** Frontend
  - **O que:** Configurar o React Navigation ou solução alternativa para funcionar no ambiente web, permitindo a transição entre as telas.
  - **Porquê:** Permitir que o usuário navegue entre as diferentes seções da aplicação web.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P1 - Refatorar Componentes Incompatíveis
  - **Quem:** Frontend
  - **O que:** Adaptar ou criar versões web-compatíveis de componentes que usam elementos nativos do React Native (ex: `FormInput.tsx`).
  - **Porquê:** Garantir a compatibilidade e o funcionamento correto da aplicação na plataforma web.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P2 - Decidir Estratégia de Frontend
  - **Quem:** Frontend
  - **O que:** Avaliar se manter duas versões (React Native para mobile + React para web) ou migrar completamente para React com React Native Web.
  - **Porquê:** Definir a arquitetura de frontend para o projeto, visando a otimização de recursos e a manutenibilidade.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P2 - Implementar Funcionalidades Principais na Versão Web
  - **Quem:** Frontend
  - **O que:** Expandir `web-app.tsx` com CRUD de veículos, despesas, abastecimentos e dashboard com gráficos e relatórios.
  - **Porquê:** Tornar a versão web da aplicação funcional e útil para o usuário.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Atualizar Credenciais de Teste Hardcoded
  - **Quem:** Frontend
  - **O que:** Atualizar a interface para mostrar as credenciais de teste corretas (`teste@teste.com` / `Teste123@`).
  - **Porquê:** Facilitar o acesso e os testes da aplicação.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

## Backlog Backend

- **Tarefa:** P1 - Otimização do Banco de Dados e Queries
  - **Quem:** Backend
  - **O que:** Analisar e otimizar as operações de banco de dados para melhorar a performance.
  - **Porquê:** Isso inclui a criação de índices, otimização de queries SQL (ou ORM) e revisão da configuração do banco de dados.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P2 - Implementação de Compressão (Gzip)
  - **Quem:** Backend
  - **O que:** Adicionar middleware de compressão (Gzip) para reduzir o tamanho das respostas HTTP.
  - **Porquê:** Melhorar o tempo de carregamento para os clientes.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P2 - Implementação de Limitação de Taxa (Rate Limiting)
  - **Quem:** Backend
  - **O que:** Adicionar rate limiting para proteger a API contra ataques de força bruta e abuso.
  - **Porquê:** Aumentar a segurança da aplicação, especialmente em endpoints de autenticação.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P2 - Centralização de Configurações
  - **Quem:** Backend
  - **O que:** Criar um arquivo `config.ts` para centralizar todas as configurações da aplicação.
  - **Porquê:** Tornar as configurações mais fáceis de gerenciar e acessar.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P2 - Tratamento de Erros Assíncronos em Rotas (Async Handler)
  - **Quem:** Backend
  - **O que:** Implementar um wrapper para lidar com erros em rotas assíncronas.
  - **Porquê:** Evitar a repetição de blocos `try-catch` e centralizar o tratamento de exceções.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Remoção/Desabilitação do Endpoint `/api/test` em Produção
  - **Quem:** Backend
  - **O que:** Remover ou desabilitar o endpoint `/api/test` em ambiente de produção.
  - **Porquê:** Evitar exposição desnecessária de informações.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**

- **Tarefa:** P3 - Verificação e Uso de `fuelPricesRoutes`
  - **Quem:** Backend
  - **O que:** Verificar se `fuelPricesRoutes` está sendo utilizado corretamente e se é necessário.
  - **Porquê:** Manter o código limpo e remover rotas não utilizadas.
  - **Concluído:** [ ]
  - **Comentários:**
  - **Hash do Commit:**


