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
  - O que: Integrar a validação do campo 'marca' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário sobre a validade da entrada.
  - Complexidade: Simples
  - Concluído: [x]
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
  - O que: Integrar a validação do campo 'placa' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação do campo 'placa' já estava implementada no schema `vehicleSchema` e sendo utilizada no `handleSubmit` do formulário em `frontend/src/screens/VehiclesScreen.tsx`. A integração estava funcionando corretamente com validação de formato brasileiro de placa.
  - Hash do Commit: 5f472c34b3dd31518bd0e6bae1fddc2b4503c833
  - Arquivos modificados: frontend/src/screens/VehiclesScreen.tsx
  - Observações: A validação já estava funcionando, apenas foi confirmada a implementação.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'tipoCombustivel' do formulário de veículos.
  - Porquê: Garantir que o tipo de combustível seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: Adicionado o campo `tipoCombustivel` ao `vehicleSchema` no arquivo `frontend/src/schemas/vehicleSchemas.ts` com validação `z.enum` para os tipos de combustível permitidos (gasolina, etanol, diesel, gnv, flex).
  - Hash do Commit: 6ac2b67
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'tipoCombustivel' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação do campo `tipoCombustivel` foi integrada ao `handleSubmit` do formulário em `frontend/src/screens/VehiclesScreen.tsx`, utilizando o `vehicleSchema` atualizado. O valor do campo é convertido para minúsculas antes da validação para corresponder ao `z.enum`.
  - Hash do Commit: 0c361ca
  - Arquivos modificados: frontend/src/screens/VehiclesScreen.tsx, frontend/src/schemas/vehicleSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'tipoUso' do formulário de veículos.
  - Porquê: Garantir que o tipo de uso seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'tipoUso' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'kmInicio' do formulário de jornadas.
  - Porquê: Garantir que a quilometragem inicial seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'kmInicio' ao formulário de jornadas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'dataInicio' do formulário de jornadas.
  - Porquê: Garantir que a data de início seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'dataInicio' ao formulário de jornadas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'quantidadeLitros' do formulário de abastecimentos.
  - Porquê: Garantir que a quantidade de litros seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'quantidadeLitros' ao formulário de abastecimentos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'valorLitro' do formulário de abastecimentos.
  - Porquê: Garantir que o valor do litro seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'valorLitro' ao formulário de abastecimentos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'valorDespesa' do formulário de despesas.
  - Porquê: Garantir que o valor da despesa seja um dado válido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'valorDespesa' ao formulário de despesas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Criar um componente básico de Toast/Notificação (apenas UI).
  - Porquê: Ter uma base visual para exibir erros e mensagens de feedback.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Adicionar o componente de Toast ao layout principal da aplicação.
  - Porquê: Permitir que qualquer parte da aplicação possa disparar notificações.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Criar uma função utilitária showErrorToast(message).
  - Porquê: Centralizar a lógica de exibição de erros e facilitar o uso em toda a aplicação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Refatorar a chamada da API de login para usar o novo hook de tratamento de erros.
  - Porquê: Exibir mensagens de erro amigáveis ao usuário durante o login.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Refatorar a chamada da API de registro para usar o novo hook de tratamento de erros.
  - Porquê: Exibir mensagens de erro amigáveis ao usuário durante o registro.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Instalar Playwright como dependência de desenvolvimento.
  - Porquê: Habilitar a escrita e execução de testes End-to-End.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Criar arquivo de configuração inicial do Playwright.
  - Porquê: Definir o ambiente e as opções de execução dos testes E2E.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para navegar até a tela de registro.
  - Porquê: Verificar se a página de registro é acessível.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para preencher o formulário de registro (campos válidos).
  - Porquê: Simular a entrada de dados de um usuário real.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para submeter o formulário de registro.
  - Porquê: Simular a ação final do usuário no formulário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para verificar sucesso do registro (redirecionamento/mensagem).
  - Porquê: Validar o comportamento esperado após um registro bem-sucedido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para navegar até a tela de login.
  - Porquê: Verificar se a página de login é acessível.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para preencher o formulário de login (credenciais válidas).
  - Porquê: Simular a entrada de credenciais de um usuário real.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para submeter o formulário de login.
  - Porquê: Simular a ação final do usuário no formulário.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para verificar sucesso do login (redirecionamento para dashboard).
  - Porquê: Validar o comportamento esperado após um login bem-sucedido.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Instalar react-query no projeto frontend.
  - Porquê: Habilitar o uso de hooks para gerenciamento de estado de dados e cache.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Configurar QueryClientProvider no componente raiz do frontend.
  - Porquê: Disponibilizar o contexto do React Query para toda a aplicação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Criar uma função fetchDashboardSummary para buscar dados do dashboard.
  - Porquê: Encapsular a lógica de busca de dados para ser usada com useQuery.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Substituir a chamada de API existente no DashboardScreen por useQuery("dashboardSummary", fetchDashboardSummary).
  - Porquê: Aproveitar os benefícios de cache, re-fetch e gerenciamento de estado do React Query.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Otimizar o carregamento de dados no Dashboard
  - Quem: Frontend
  - O que: Adicionar um if (isLoading) para exibir um LoadingSpinner simples no DashboardScreen.
  - Porquê: Melhorar a experiência do usuário, indicando que a aplicação está processando.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Frontend
  - O que: Adicionar um botão na tela de perfil do frontend para acionar a rota de backup.
  - Porquê: Permitir que o usuário inicie o download de seu backup de dados.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Implementar sistema de backup e restauração de dados
  - Quem: Frontend
  - O que: Adicionar um formulário de upload na tela de perfil do frontend para enviar o arquivo de backup para restauração.
  - Porquê: Permitir que o usuário faça o upload de seu backup para restaurar os dados.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar um sistema de feedback e suporte ao usuário
  - Quem: Frontend
  - O que: Criar um formulário de feedback simples no frontend (apenas UI).
  - Porquê: Fornecer uma interface para o usuário enviar feedback.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P3 - Implementar um sistema de feedback e suporte ao usuário
  - Quem: Frontend
  - O que: Integrar o formulário de feedback com o endpoint do backend.
  - Porquê: Permitir que o feedback seja enviado e processado pela aplicação.
  - Complexidade: Simples
  - Concluído: [ ]

- Tarefa: P2 - Adicionar autenticação de dois fatores (2FA)
  - Quem: Frontend
  - O que: Adicionar campo de entrada para o código TOTP na tela de

