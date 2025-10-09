# Guia de Testes e Configuração de Ambiente

Este documento detalha as configurações e procedimentos para a execução de testes de integração e e2e no projeto GiroPro, bem como as etapas para mitigar problemas comuns e garantir a funcionalidade do ambiente de testes.

## 1. Configuração do Ambiente de Testes

O ambiente de testes utiliza o Jest como framework e o Drizzle ORM para interagir com o banco de dados SQLite. A configuração é definida principalmente nos arquivos `jest.config.js` e `src/tests/setup.ts`.

### 1.1. `jest.config.js`

Este arquivo configura o Jest, definindo:

*   `preset: 'ts-jest'`: Para testes com TypeScript.
*   `testEnvironment: 'node'`: Ambiente de execução dos testes.
*   `roots: ['<rootDir>/src']`: Onde os testes devem ser procurados.
*   `testMatch`: Padrões para identificar arquivos de teste (`.test.ts`, `.spec.ts`).
*   `setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts']`: Um arquivo de setup que é executado antes de cada suíte de testes.
*   `testTimeout: 30000`: Timeout padrão para cada teste (30 segundos).
*   `detectOpenHandles: false`, `forceExit: false`: Configurações importantes para evitar que testes travem ou impeçam o Jest de finalizar.

### 1.2. `src/tests/setup.ts`

Este arquivo é crucial para a inicialização do ambiente de testes. Ele:

*   Carrega variáveis de ambiente de teste (`.env.test`).
*   Define `process.env.SQLITE_DB_PATH = ':memory:'`: Isso garante que os testes rodem em um banco de dados SQLite em memória, isolando os testes e garantindo que não haja impacto no banco de dados de desenvolvimento/produção.
*   Executa as migrações do Drizzle ORM: `migrate(db, { migrationsFolder: "./drizzle" });`. Isso assegura que o schema do banco de dados em memória esteja atualizado com as últimas migrações antes da execução dos testes.
*   Silencia logs do console para evitar ruído, mantendo apenas os erros visíveis.
*   Fecha a conexão com o banco de dados após todos os testes (`afterAll`).

## 2. Resolução de Problemas com Testes Travando

Se os testes estiverem travando ou não reportando resultados, as seguintes etapas podem ajudar a diagnosticar e resolver o problema:

1.  **Verificar o `testTimeout`**: Aumentar o `testTimeout` em `jest.config.js` pode ser necessário para testes mais longos, especialmente testes de integração que envolvem operações de I/O.
2.  **`detectOpenHandles` e `forceExit`**: As configurações `detectOpenHandles: false` e `forceExit: false` em `jest.config.js` são importantes. Se `detectOpenHandles` estiver como `true`, o Jest pode tentar identificar handles abertos que impedem a saída, o que pode causar lentidão ou travamento. `forceExit: false` permite que o Jest tente fechar os handles abertos de forma mais graciosa.
3.  **Logs Detalhados**: Para depurar, remova temporariamente o `console.log = jest.fn();` do `src/tests/setup.ts` para ver todos os logs durante a execução dos testes. Isso pode revelar onde o teste está travando.
4.  **Isolamento de Testes**: Se um teste específico estiver causando problemas, tente executá-lo isoladamente (`npx jest path/to/your/test.ts`). Isso ajuda a identificar a causa raiz.
5.  **Recursos do Sandbox**: Em ambientes como o sandbox atual, recursos limitados podem causar travamentos. Se os testes forem muito pesados, considere:
    *   **Dividir Suítes de Testes**: Quebrar grandes arquivos de teste em arquivos menores.
    *   **Testes Unitários vs. Integração/E2E**: Priorizar testes unitários mais rápidos e leves, e ter menos testes de integração/e2e, que são naturalmente mais lentos.
    *   **Otimização de Queries**: Garantir que as queries de banco de dados nos testes de integração sejam eficientes e não causem gargalos.

## 3. Próximos Passos no Backlog

Com as migrações de banco de dados concluídas e o ambiente de testes configurado para aplicar migrações automaticamente, os próximos passos devem focar em:

1.  **Executar Testes de Integração e E2E**: Rodar todos os testes para validar que as correções e migrações foram aplicadas corretamente e que o sistema funciona como esperado.
2.  **Analisar Falhas de Teste**: Caso haja falhas, investigar as causas, corrigi-las e repetir os testes.
3.  **Otimização de Testes**: Se os testes ainda estiverem lentos ou instáveis, aplicar as estratégias de mitigação mencionadas acima (divisão de suítes, otimização de queries, etc.).
4.  **Documentar Novas Nomenclaturas**: Atualizar a documentação da API e do frontend com as novas nomenclaturas de colunas (`quantidade_litros`, `valor_litro`, etc.) para garantir a consistência.

Este guia servirá como referência para futuras manutenções e desenvolvimento de testes no projeto GiroPro.
