# Matriz de Dependências de Tarefas

<!-- ATENÇÃO: Não modifique ou remova este cabeçalho e a estrutura geral deste arquivo. Ele é essencial para o funcionamento do sistema. As dependências devem ser gerenciadas automaticamente pelo Scrum Master. -->

Este arquivo mapeia as dependências ativas entre as tarefas, permitindo que o Scrum Master orquestre a execução e libere tarefas subsequentes.

## Dependências Ativas

- **Tarefa:** Implementar `AddExpenseScreen` (Agente_12)
  - **Depende de:** Rota `POST /expenses` finalizada (Agente_09)
  - **Status:** Agente_09 Concluído, Agente_12 Liberado.

- **Tarefa:** Criar testes de integração para o fluxo de despesas (Agente_23)
  - **Depende de:** `AddExpenseScreen` finalizada (Agente_12)
  - **Status:** Pendente.


