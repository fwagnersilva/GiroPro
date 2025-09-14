# Backlog Backend

## Tarefas Atribuídas

















- **Tarefa:** P2 - Atualizar documentação de API
  - **Quem:** Backend
  - **O que:** Revisar e atualizar a documentação da API de autenticação.
  - **Porquê:** Manter a documentação precisa e atualizada.
  - **Complexidade:** Simples
  - **Concluído:** [ ]
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
  - Status: Em Execução

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




- Tarefa: P2 - Implementação de Limitação de Taxa (Rate Limiting) - Subtarefa: Pesquisa e Seleção de Biblioteca/Método
  - Quem: Backend
  - O que: Pesquisar e selecionar a melhor biblioteca ou método para implementar rate limiting na API (ex: `express-rate-limit`, `helmet`, etc.).
  - Porquê: Garantir uma implementação eficiente e segura.
  - Complexidade: Simples
  - Concluído: [ ]




- Tarefa: P2 - Implementação de Limitação de Taxa (Rate Limiting) - Subtarefa: Configuração Básica
  - Quem: Backend
  - O que: Implementar a configuração básica de rate limiting em endpoints críticos (ex: login, registro).
  - Porquê: Proteger os endpoints mais vulneráveis a ataques.
  - Complexidade: Média
  - Concluído: [ ]




- Tarefa: P2 - Implementação de Limitação de Taxa (Rate Limiting) - Subtarefa: Testes e Ajustes
  - Quem: Backend
  - O que: Realizar testes de estresse e funcionais para garantir que o rate limiting está funcionando conforme o esperado e ajustar as configurações se necessário.
  - Porquê: Validar a eficácia da implementação e evitar falsos positivos/negativos.
  - Complexidade: Média
  - Concluído: [ ]




- Tarefa: P2 - Centralização de Configurações - Subtarefa: Criação do arquivo `config.ts`
  - Quem: Backend
  - O que: Criar o arquivo `config.ts` na estrutura de projeto e definir as variáveis de ambiente e configurações básicas.
  - Porquê: Iniciar a centralização das configurações da aplicação.
  - Complexidade: Simples
  - Concluído: [ ]




- Tarefa: P2 - Centralização de Configurações - Subtarefa: Migração de Configurações Existentes
  - Quem: Backend
  - O que: Migrar as configurações existentes espalhadas pelo código para o novo arquivo `config.ts`.
  - Porquê: Consolidar todas as configurações em um único local.
  - Complexidade: Média
  - Concluído: [ ]




- Tarefa: P2 - Centralização de Configurações - Subtarefa: Atualização do Código para Usar `config.ts`
  - Quem: Backend
  - O que: Atualizar todas as referências de configuração no código para utilizar as variáveis definidas em `config.ts`.
  - Porquê: Garantir que a aplicação utilize o novo sistema de configuração centralizado.
  - Complexidade: Média
  - Concluído: [ ]


