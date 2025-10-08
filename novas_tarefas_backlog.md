

### Épico: Melhorias em Testes e Scripts de Dados

#### História de Usuário: Como desenvolvedor, quero ter scripts de seed robustos e testes de integração que validem a lógica de negócio com dados realistas, para garantir a qualidade e a consistência do sistema.

#### Tarefas de Testes e Scripts (Prioridade Média)

1.  **Criar Script de Seed para o Banco de Dados (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Desenvolver um script automatizado para popular o banco de dados com um conjunto de dados de teste realistas e abrangentes, cobrindo todas as entidades principais do sistema.
    *   **Microtarefas:**
        *   Criar um arquivo `backend/src/seeds/run-seed.ts` para orquestrar a população dos dados.
        *   Adicionar lógica para inserir dados em `usuarios`, `veiculos`, `jornadas`, `abastecimentos` e `despesas`.
        *   Garantir que os dados inseridos sejam diversificados (múltiplos veículos, diferentes plataformas, etc.).
        *   Criar um comando `npm run seed` no `package.json` do backend para facilitar a execução do script.
        *   Documentar o uso do script de seed no `README.md`.

2.  **Expandir Testes de Integração para Cálculos Financeiros (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Adicionar testes de integração que validem a precisão dos cálculos financeiros realizados pelo backend, como lucratividade, custo por KM e outras métricas do dashboard.
    *   **Microtarefas:**
        *   Criar um novo arquivo de teste `backend/src/tests/integration/financials.test.ts`.
        *   Escrever testes para verificar os cálculos de `lucro`, `receita`, `despesas`, `km rodados` e `R$/KM`.
        *   Utilizar os dados gerados pelo script de seed para garantir a consistência dos testes.
        *   Validar os resultados retornados pelo endpoint do dashboard (`/api/v1/dashboard/summary`).

3.  **Adicionar Testes para Cenários com Múltiplos Veículos (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Implementar testes que simulem o uso do sistema por um usuário com múltiplos veículos, garantindo que os filtros e cálculos por veículo funcionem corretamente.
    *   **Microtarefas:**
        *   Atualizar o script de seed para incluir cenários com múltiplos veículos para um único usuário.
        *   Escrever testes de integração que filtrem jornadas, despesas e abastecimentos por veículo.
        *   Validar a precisão do endpoint de comparativo de veículos (`/api/v1/dashboard/veiculos`).

4.  **Refatorar e Corrigir Scripts de Setup do Banco de Dados (Pendente)**
    *   **Status:** Pendente
    *   **Detalhes:** Revisar e corrigir os scripts de setup do banco de dados para resolver inconsistências de schema e garantir que o ambiente de desenvolvimento possa ser configurado de forma confiável.
    *   **Microtarefas:**
        *   Revisar os scripts `setup_db_manual.sh` e `setup_sqlite.sh`.
        *   Corrigir inconsistências de schema identificadas (e.g., `veiculoId` vs `idVeiculo`, uso de `unixepoch()`).
        *   Garantir que os scripts sejam idempotentes e possam ser executados múltiplas vezes sem causar erros.
        *   Testar os scripts de setup em um ambiente limpo para validar a correção.

