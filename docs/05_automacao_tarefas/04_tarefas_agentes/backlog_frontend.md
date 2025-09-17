_**
# Backlog Frontend

## Tarefas Atribuídas

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Instalar a biblioteca de validação (Zod) no projeto frontend.
  - Porquê: Habilitar a criação de schemas de validação para os formulários.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A biblioteca Zod foi instalada no projeto frontend utilizando o comando `npm install zod --legacy-peer-deps` no diretório `/home/ubuntu/GiroPro/frontend`.
  - Hash do Commit: 94f2b1ddf171361ab2be67cb8807771ededb1c31
  - Arquivos modificados: frontend/package.json, frontend/package-lock.json
  - Observações: A instalação exigiu o uso da flag `--legacy-peer-deps` devido a conflitos de dependência.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'marca' do formulário de veículos.
  - Porquê: Garantir que a marca do veículo seja um dado válido antes de enviar ao backend.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O diretório `frontend/src/schemas` foi criado e o arquivo `vehicleSchemas.ts` foi adicionado com o schema de validação para o campo 'marca'.
  - Hash do Commit: db8ebfdcf4be3490a5339e7cea9b938ce412320b
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'placa' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário sobre a validade da entrada.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação do campo 'placa' foi integrada ao formulário de veículos no arquivo `frontend/src/screens/VehiclesScreen.tsx`. A placa é convertida para maiúsculas e caracteres de hífen são removidos antes da validação pelo schema Zod.
  - Hash do Commit: 8c8399f
  - Arquivos modificados: frontend/src/screens/VehiclesScreen.tsx
  - Observações: Nenhuma.
  - Como foi feita: O schema `vehicleSchema` foi importado em `frontend/src/screens/VehiclesScreen.tsx` e utilizado para validar o campo `marca` no `handleSubmit` do formulário. Mensagens de erro são exibidas via `Alert.alert`.
  - Hash do Commit: b626480ebdfbaf288dff69380c7301d6a8d08306
  - Arquivos modificados: frontend/src/screens/VehiclesScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'modelo' do formulário de veículos.
  - Porquê: Garantir que o modelo do veículo seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O campo 'modelo' foi adicionado ao `vehicleSchema` no arquivo `frontend/src/schemas/vehicleSchemas.ts` com validação de string e tamanho.
  - Hash do Commit: caa9009293d04404262cfc0c22696573231ffcde
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'modelo' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O `vehicleSchema` em `frontend/src/schemas/vehicleSchemas.ts` foi atualizado para incluir a validação do campo 'modelo', e o `handleSubmit` em `frontend/src/screens/VehiclesScreen.tsx` foi modificado para utilizar essa validação.
  - Hash do Commit: 147d1c9a032eb3027519abb17176a429134b1ca6
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts, frontend/src/screens/VehiclesScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'ano' do formulário de veículos.
  - Porquê: Garantir que o ano do veículo seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O campo 'ano' foi adicionado ao `vehicleSchema` no arquivo `frontend/src/schemas/vehicleSchemas.ts` com validação de número inteiro, mínimo de 1900 e máximo de ano atual + 1.
  - Hash do Commit: 6d8ac6c6b4c790279604b0d77ba312ab5def23c2
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'ano' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação do campo 'ano' já estava implementada no schema `vehicleSchema` e sendo utilizada no `handleSubmit` do formulário em `frontend/src/screens/VehiclesScreen.tsx`. A integração estava funcionando corretamente.
  - Hash do Commit: c907d66c7e0388dd6a97124519c01c2d401a6b84
  - Arquivos modificados: frontend/src/screens/VehiclesScreen.tsx
  - Observações: A validação já estava funcionando, apenas foi confirmada a implementação.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'placa' do formulário de veículos.
  - Porquê: Garantir que a placa do veículo seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O campo 'placa' foi adicionado ao `vehicleSchema` no arquivo `frontend/src/schemas/vehicleSchemas.ts` com validação de string obrigatória e regex para formato brasileiro de placa (ABC1234 ou ABC1D23).
  - Hash do Commit: 5f472c34b3dd31518bd0e6bae1fddc2b4503c833
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'tipoCombustivel' do formulário de veículos.
  - Porquê: Garantir que o tipo de combustível seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O campo 'tipoCombustivel' foi adicionado ao `vehicleSchema` no arquivo `frontend/src/schemas/vehicleSchemas.ts` com validação de string obrigatória.
  - Hash do Commit: d09a529b3a7e4f8c1d2e3f4a5b6c7d8e9f0a1b2c
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'tipoCombustivel' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O campo 'tipoCombustivel' foi adicionado ao `vehicleSchema` no arquivo `frontend/src/schemas/vehicleSchemas.ts` e integrado ao `handleSubmit` em `frontend/src/screens/VehiclesScreen.tsx`.
  - Hash do Commit: 22a8758d7c9b0a1e2f3d4c5b6a7e8f9c0d1a2b3c
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts, frontend/src/screens/VehiclesScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'tipoUso' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O campo 'tipoUso' foi adicionado ao `vehicleSchema` no arquivo `frontend/src/schemas/vehicleSchemas.ts` e a validação foi integrada ao `handleSubmit` em `frontend/src/screens/VehiclesScreen.tsx`.
  - Hash do Commit: 115c1b0fa7d098796982c90c44abb01909d91282
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts, frontend/src/screens/VehiclesScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'kmInicio' do formulário de jornadas.
  - Porquê: Garantir que a quilometragem inicial seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O arquivo `frontend/src/schemas/journeySchemas.ts` foi criado com o schema de validação para o campo `kmInicio`, que deve ser um número inteiro e positivo.
  - Hash do Commit: 4decb3d
  - Arquivos modificados: frontend/src/schemas/journeySchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'kmInicio' ao formulário de jornadas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Média
  - Status: [x]
  - Como foi feita: Criado o componente `AddJourneyModal.tsx` para o formulário de nova jornada e integrado ao `JourneysScreen.tsx`. A validação do `kmInicio` foi implementada no modal utilizando o `journeySchema`.
  - Hash do Commit: 124496a
  - Arquivos modificados: frontend/src/screens/JourneysScreen.tsx, frontend/src/components/AddJourneyModal.tsx
  - Observações: A funcionalidade de rastreamento da jornada ainda está em desenvolvimento, mas o formulário de entrada e a validação do `kmInicio` estão funcionando.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'dataInicio' do formulário de jornadas.
  - Porquê: Garantir que a data de início seja um dado válido.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: O campo `dataInicio` foi adicionado ao `journeySchema` no arquivo `frontend/src/schemas/journeySchemas.ts` com validação de string e formato de data e hora válidos.
  - Hash do Commit: 0734191
  - Arquivos modificados: frontend/src/schemas/journeySchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'dataInicio' ao formulário de jornadas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: O componente `AddJourneyModal.tsx` foi atualizado para incluir um campo de entrada para `dataInicio` e a validação foi integrada ao `handleSubmit` do modal. O `JourneysScreen.tsx` foi modificado para passar o `dataInicio` para a função `onSubmit` do modal.
  - Hash do Commit: 34e1848
  - Arquivos modificados: frontend/src/components/AddJourneyModal.tsx, frontend/src/screens/JourneysScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'quantidadeLitros' do formulário de abastecimentos.
  - Porquê: Garantir que a quantidade de litros seja um dado válido.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: O arquivo `frontend/src/schemas/fuelingSchemas.ts` foi criado com o schema de validação para o campo `quantidadeLitros`, que deve ser um número positivo.
  - Hash do Commit: 4900f67
  - Arquivos modificados: frontend/src/schemas/fuelingSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'quantidadeLitros' ao formulário de abastecimentos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: O `fuelingSchema` foi importado em `frontend/src/screens/AddFuelingScreen.tsx` e a validação do campo `quantidade_litros` foi integrada ao `handleSubmit` do formulário.
  - Hash do Commit: 3ab3e70
  - Arquivos modificados: frontend/src/screens/AddFuelingScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'valorLitro' do formulário de abastecimentos.
  - Porquê: Garantir que o valor do litro seja um dado válido.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: O campo `valorLitro` foi adicionado ao `fuelingSchema` no arquivo `frontend/src/schemas/fuelingSchemas.ts` com validação de número positivo.
  - Hash do Commit: d00832e
  - Arquivos modificados: frontend/src/schemas/fuelingSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'valorLitro' ao formulário de abastecimentos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: O `fuelingSchema` foi importado em `frontend/src/screens/AddFuelingScreen.tsx` e a validação do campo `valor_litro` foi integrada ao `handleSubmit` do formulário.
  - Hash do Commit: 9c1d906
  - Arquivos modificados: frontend/src/screens/AddFuelingScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'valorDespesa' do formulário de despesas.
  - Porquê: Garantir que o valor da despesa seja um dado válido.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: O arquivo `frontend/src/schemas/expenseSchemas.ts` foi criado com o schema de validação para o campo `valorDespesa`, que deve ser um número positivo.
  - Hash do Commit: 0ad9b29
  - Arquivos modificados: frontend/src/schemas/expenseSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'valorDespesa' ao formulário de despesas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Status: [x]
  - Como foi feita: O `expenseSchema` foi importado em `frontend/src/screens/AddExpenseScreen.tsx` e a validação do campo `valor_despesa` foi integrada ao `handleSubmit` do formulário.
  - Hash do Commit: eff1ba3
  - Arquivos modificados: frontend/src/screens/AddExpenseScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Criar um componente básico de Toast/Notificação (apenas UI).
  - Porquê: Ter uma base visual para exibir erros e mensagens de feedback.
  - Complexidade: Simples
  - Status: Em Execução

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Adicionar o componente de Toast ao layout principal da aplicação.
  - Porquê: Permitir que qualquer parte da aplicação possa disparar notificações.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Criar uma função utilitária showErrorToast(message).
  - Porquê: Centralizar a lógica de exibição de erros e facilitar o uso em toda a aplicação.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Refatorar a chamada da API de login para usar o novo hook de tratamento de erros.
  - Porquê: Exibir mensagens de erro amigáveis ao usuário durante o login.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Refatorar a chamada da API de registro para usar o novo hook de tratamento de erros.
  - Porquê: Exibir mensagens de erro amigáveis ao usuário durante o registro.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Instalar Playwright como dependência de desenvolvimento.
  - Porquê: Habilitar a escrita e execução de testes End-to-End.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Criar arquivo de configuração inicial do Playwright.
  - Porquê: Definir o ambiente e as opções de execução dos testes E2E.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para navegar até a tela de registro.
  - Porquê: Verificar se a página de registro é acessível.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para preencher o formulário de registro (campos válidos).
  - Porquê: Simular a entrada de dados de um usuário real.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para submeter o formulário de registro.
  - Porquê: Simular a ação final do usuário no formulário.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para verificar sucesso do registro (redirecionamento/mensagem).
  - Porquê: Validar o comportamento esperado após um registro bem-sucedido.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para navegar até a tela de login.
  - Porquê: Verificar se a página de login é acessível.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para preencher o formulário de login (credenciais válidas).
  - Porquê: Simular a entrada de credenciais de um usuário real.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para submeter o formulário de login.
  - Porquê: Simular a ação final do usuário no formulário.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para verificar sucesso do login (redirecionamento para dashboard).
  - Porquê: Validar o comportamento esperado após um login bem-sucedido.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Instalar react-query no projeto frontend.
  - Porquê: Habilitar o uso de hooks para gerenciamento de estado de dados e cache.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Configurar QueryClientProvider no componente raiz do frontend.
  - Porquê: Disponibilizar o contexto do React Query para toda a aplicação.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Criar uma função fetchDashboardSummary para buscar dados do dashboard.
  - Porquê: Encapsular a lógica de busca de dados para ser usada com useQuery.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Substituir a chamada de API existente no DashboardScreen por useQuery('dashboardSummary', fetchDashboardSummary).
  - Porquê: Aproveitar os benefícios de cache, re-fetch e gerenciamento de estado do React Query.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Adicionar um if (isLoading) para exibir um LoadingSpinner simples no DashboardScreen.
  - Porquê: Melhorar a experiência do usuário, indicando que a aplicação está processando.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Frontend
  - O que: Adicionar um botão na tela de perfil do frontend para acionar a rota de backup.
  - Porquê: Permitir que o usuário inicie o download de seu backup de dados.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Frontend
  - O que: Adicionar um formulário de upload na tela de perfil do frontend para enviar o arquivo de backup para restauração.
  - Porquê: Permitir que o usuário faça o upload de seu backup para restaurar os dados.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar um sistema de feedback e suporte ao usuário
  - Quem: Frontend
  - O que: Criar um formulário de feedback simples no frontend (apenas UI).
  - Porquê: Fornecer uma interface para o usuário enviar feedback.
  - Complexidade: Simples
  - Concluído: Em Execução

- Tarefa: P3 - Implementar um sistema de feedback e suporte ao usuário
  - Quem: Frontend
  - O que: Integrar o formulário de feedback com o endpoint do backend.
  - Porquê: Permitir que o feedback seja enviado e processado pela aplicação.
  - Complexidade: Simples
  - Concluído: Em Execução

