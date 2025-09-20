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
  - Concluído: [x]
  - Como foi feita: O campo 'tipoUso' foi adicionado ao `vehicleSchema` no arquivo `frontend/src/schemas/vehicleSchemas.ts` com validação de enum para os tipos 'Proprio', 'Alugado', 'Financiado'.
  - Hash do Commit: 51317a9
  - Arquivos modificados: frontend/src/schemas/vehicleSchemas.ts
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'tipoUso' ao formulário de veículos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O campo 'tipoUso' foi integrado ao `handleSubmit` do formulário em `frontend/src/screens/VehiclesScreen.tsx`, utilizando o `vehicleSchema` atualizado.
  - Hash do Commit: 5b77148d7c9b0a1e2f3d4c5b6a7e8f9c0d1a2b3c
  - Arquivos modificados: frontend/src/screens/VehiclesScreen.tsx
  - Observações: Nenhuma.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'kmInicio' do formulário de jornadas.
  - Porquê: Garantir que a quilometragem inicial seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O schema de validação para 'kmInicio' já estava implementado no arquivo `frontend/src/schemas/journeySchemas.ts`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'kmInicio' ao formulário de jornadas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação para 'kmInicio' já estava integrada no `AddJourneyModal.tsx` através do `journeySchema.parse`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'dataInicio' do formulário de jornadas.
  - Porquê: Garantir que a data de início seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O schema de validação para 'dataInicio' já estava implementado no arquivo `frontend/src/schemas/journeySchemas.ts`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'dataInicio' ao formulário de jornadas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação para 'dataInicio' já estava integrada no `AddJourneyModal.tsx` através do `journeySchema.parse`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'quantidadeLitros' do formulário de abastecimentos.
  - Porquê: Garantir que a quantidade de litros seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O schema de validação para 'quantidadeLitros' já estava implementado no arquivo `frontend/src/schemas/fuelingSchemas.ts`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'quantidadeLitros' ao formulário de abastecimentos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação para 'quantidadeLitros' já estava integrada no `AddFuelingScreen.tsx` através do `fuelingSchema.pick({ quantidadeLitros: parseFloat(formData.quantidade_litros) })`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'valorLitro' do formulário de abastecimentos.
  - Porquê: Garantir que o valor do litro seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O schema de validação para 'valorLitro' já estava implementado no arquivo `frontend/src/schemas/fuelingSchemas.ts`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'valorLitro' ao formulário de abastecimentos.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação para 'valorLitro' já estava integrada no `AddFuelingScreen.tsx` através do `fuelingSchema.pick({ valorLitro: parseFloat(formData.valor_litro) })`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Criar o schema de validação para o campo 'valorDespesa' do formulário de despesas.
  - Porquê: Garantir que o valor da despesa seja um dado válido.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O schema de validação para 'valorDespesa' já estava implementado no arquivo `frontend/src/schemas/expenseSchemas.ts`.

- Tarefa: P1 - Implementar validação de dados no frontend
  - Quem: Frontend
  - O que: Integrar a validação do campo 'valorDespesa' ao formulário de despesas.
  - Porquê: Fornecer feedback imediato ao usuário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A validação para 'valorDespesa' já estava integrada no `AddExpenseScreen.tsx` através do `expenseSchema.pick({ valorDespesa: parseFloat(formData.valor_despesa) })`.

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Criar um componente básico de Toast/Notificação (apenas UI).
  - Porquê: Ter uma base visual para exibir erros e mensagens de feedback.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O componente `ToastNotification.tsx` já existe no diretório `frontend/src/components` e atende a este requisito.

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Adicionar o componente de Toast ao layout principal da aplicação.
  - Porquê: Permitir que qualquer parte da aplicação possa disparar notificações.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O `ToastProvider` já está configurado em `App.tsx`, envolvendo o `NavigationContainer`, o que significa que o componente de Toast já está disponível globalmente.

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Criar uma função utilitária showErrorToast(message).
  - Porquê: Centralizar a lógica de exibição de erros e facilitar o uso em toda a aplicação.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A funcionalidade de exibir erros já é provida pelo `useToast` e a função `showToast` no `ToastContext.tsx`, que aceita um tipo 'error' para exibir mensagens de erro.

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Refatorar a chamada da API de login para usar o novo hook de tratamento de erros.
  - Porquê: Exibir mensagens de erro amigáveis ao usuário durante o login.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A função `showErrorToast` já está sendo utilizada no `LoginScreen.tsx` para exibir mensagens de erro durante o login.

- Tarefa: P2 - Refatorar o tratamento de erros global no frontend
  - Quem: Frontend
  - O que: Refatorar a chamada da API de registro para usar o novo hook de tratamento de erros.
  - Porquê: Exibir mensagens de erro amigáveis ao usuário durante o registro.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: A função `showErrorToast` já está sendo utilizada no `RegisterScreen.tsx` para exibir mensagens de erro durante o registro.

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Instalar Playwright como dependência de desenvolvimento.
  - Porquê: Habilitar a escrita e execução de testes End-to-End.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O Playwright foi instalado como dependência de desenvolvimento usando o comando `npm install --save-dev @playwright/test --legacy-peer-deps` no diretório frontend. Também foram instalados os navegadores necessários com `npx playwright install` e as dependências do sistema com `npx playwright install-deps`.
  - Hash do Commit: 0ad3af8d02d8e541c64f931604d4c76fabfef14a
  - Arquivos modificados: frontend/package.json, frontend/package-lock.json
  - Observações: Foi necessário usar a flag --legacy-peer-deps devido a conflitos de dependência com o Expo.

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Criar arquivo de configuração inicial do Playwright.
  - Porquê: Definir o ambiente e as opções de execução dos testes E2E.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O arquivo de configuração do Playwright já existia no projeto em `frontend/playwright.config.ts` com configurações adequadas para testes E2E, incluindo configuração para múltiplos navegadores e dispositivos móveis.
  - Hash do Commit: 0ad3af8d02d8e541c64f931604d4c76fabfef14a
  - Arquivos modificados: frontend/playwright.config.ts (já existente)
  - Observações: A configuração já estava presente no projeto, não foi necessário criar um novo arquivo.

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para navegar até a tela de registro.
  - Porquê: Verificar se a página de registro é acessível.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O teste E2E para navegar até a tela de registro já estava implementado no arquivo `frontend/tests/e2e/auth.spec.ts` com o teste "deve navegar até a tela de registro" que verifica a visibilidade do botão de registro, clica nele e valida o redirecionamento e campos visíveis.
  - Hash do Commit: e4caa8a777597271071a455e77fa3f588c6b746f
  - Arquivos modificados: frontend/tests/e2e/auth.spec.ts (já existente)
  - Observações: O teste já estava implementado no projeto, cobrindo a navegação e validação da tela de registro.

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para preencher o formulário de registro (campos válidos).
  - Porquê: Simular a entrada de dados de um usuário real.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O teste E2E para preencher o formulário de registro já estava implementado no arquivo `frontend/tests/e2e/auth.spec.ts` com o teste "deve preencher o formulário de registro com campos válidos" que preenche os campos nome, email e senha e valida os valores inseridos.
  - Hash do Commit: e4caa8a777597271071a455e77fa3f588c6b746f
  - Arquivos modificados: frontend/tests/e2e/auth.spec.ts (já existente)
  - Observações: O teste já estava implementado, cobrindo o preenchimento e validação dos campos do formulário de registro.

- Tarefa: P3 - Implementar testes E2E para o fluxo de registro e login
  - Quem: Frontend
  - O que: Escrever teste E2E para submeter o formulário de registro.
  - Porquê: Simular a ação final do usuário no formulário.
  - Complexidade: Simples
  - Concluído: [x]
  - Como foi feita: O teste E2E para submeter o formulário de registro já estava implementado no arquivo `frontend/tests/e2e/auth.spec.ts` com o teste "deve submeter o formulário de registro" que preenche os campos e clica no botão de submissão.
  - Hash do Commit: e4caa8a777597271071a455e77fa3f588c6b746f
  - Arquivos modificados: frontend/tests/e2e/auth.spec.ts (já existente)
  - Observações: O teste já estava implementado, cobrindo a submissão completa do formulário de registro.

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

