# Backlog Backend

## Tarefas Atribuídas







- **Tarefa:** P2 - Tratamento de Erros Assíncronos em Rotas (Async Handler)
  - **Quem:** Backend
  - **O que:** Implementar um wrapper para lidar com erros em rotas assíncronas.
  - **Porquê:** Evitar a repetição de blocos `try-catch` e centralizar o tratamento de exceções.
  - **Complexidade:** Complexa
  - **Status:** Concluída [x]
  - **Como foi feita:** Criado o middleware `asyncHandler.js` para encapsular funções assíncronas e tratar erros de forma centralizada. Integrado ao `app.ts` para uso em rotas.
  - **Hash do Commit:** 5ca9e8a8bb0c0ad68282d8a860c82453da9ea41b
  - **Arquivos modificados:**
    - `src/middlewares/asyncHandler.js`
    - `backend/src/app.ts`
    - `src/routes/exampleRoutes.js`

- **Tarefa:** P3 - Remoção/Desabilitação do Endpoint `/api/test` em Produção
  - **Quem:** Backend
  - **O que:** Remover ou desabilitar o endpoint `/api/test` em ambiente de produção.
  - **Porquê:** Evitar exposição desnecessária de informações.
  - **Complexidade:** Simples
  - **Concluído:** [x]
  - **Como foi feita:** O endpoint `/api/test` foi comentado no arquivo `backend/src/app.ts` para desabilitá-lo em produção.
  - **Hash do Commit:** 5ca9e8a8bb0c0ad68282d8a860c82453da9ea41b
  - **Arquivos modificados:**
    - `backend/src/app.ts`

- **Tarefa:** P3 - Verificação e Uso de `fuelPricesRoutes`
  - **Quem:** Backend
  - **O que:** Verificar se `fuelPricesRoutes` está sendo utilizado corretamente e se é necessário.
  - **Porquê:** Manter o código limpo e remover rotas não utilizadas.
  - **Complexidade:** Simples
  - **Concluído:** [x]
  - **Como foi feita:** O import de `fuelPricesRoutes` foi removido do arquivo `backend/src/app.ts`, pois não estava sendo utilizado. Não havia uso explícito da rota no arquivo principal.
  - **Hash do Commit:** 5ca9e8a8bb0c0ad68282d8a860c82453da9ea41b
  - **Arquivos modificados:**
    - `backend/src/app.ts`

- **Tarefa:** P3 - Organização de Imports
  - **Quem:** Backend
  - **O que:** Padronizar a organização dos imports em todos os arquivos.
  - **Porquê:** Melhorar a legibilidade e manutenção do código.
  - **Complexidade:** Simples
  - **Concluído:** [x]
  - **Como foi feita:** Os imports do arquivo `backend/src/app.ts` foram reorganizados para seguir um padrão de legibilidade e manutenção.
  - **Hash do Commit:** 5ca9e8a8bb0c0ad68282d8a860c82453da9ea41b
  - **Arquivos modificados:**
    - `backend/src/app.ts`



- **Tarefa:** P2 - Atualizar documentação de API
  - **Quem:** Backend
  - **O que:** Revisar e atualizar a documentação da API de autenticação.
  - **Porquê:** Manter a documentação precisa e atualizada.
  - **Complexidade:** Simples
  - **Status:** Concluída [x]
  - **Como foi feita:** Criada uma versão atualizada da documentação da API incluindo as melhorias implementadas: middleware de tratamento de erros assíncronos, remoção do endpoint /api/test, reorganização de imports e remoção de rotas não utilizadas. Adicionados exemplos de uso e changelog.
  - **Hash do Commit:** 
  - **Arquivos modificados:**
    - `docs/04_referencias/02_api_documentation_updated.md`




- Tarefa: P1 - Análise de Queries Lentas (Otimização DB)
  - Quem: Backend
  - O que: Identificar as queries mais lentas e que consomem mais recursos no banco de dados.
  - Porquê: Subtarefa da otimização do banco de dados para focar na identificação de gargalos.
  - Complexidade: Simples
  - Status: Em Execução

- Tarefa: P1 - Criação/Otimização de Índices (Otimização DB)
  - Quem: Backend
  - O que: Criar novos índices ou otimizar os existentes com base na análise de queries lentas.
  - Porquê: Melhorar a performance de leitura do banco de dados.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Revisão de ORM/SQL (Otimização DB)
  - Quem: Backend
  - O que: Otimizar as queries escritas em SQL ou através do ORM, aplicando melhores práticas.
  - Porquê: Reduzir o tempo de execução das queries e o consumo de recursos.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Configuração do Banco de Dados (Otimização DB)
  - Quem: Backend
  - O que: Revisar e ajustar as configurações do servidor de banco de dados para melhor performance.
  - Porquê: Garantir que o banco de dados esteja operando com a máxima eficiência.
  - Complexidade: Simples
  - Concluído: [ ]


