# Documento de Requisitos - GiroPro

## 1. Introdução

Este documento descreve os requisitos funcionais e não funcionais para o sistema GiroPro, uma aplicação de gestão financeira para motoristas de aplicativo. O objetivo é fornecer uma compreensão clara das funcionalidades esperadas do sistema e das suas características de qualidade.

## 2. Requisitos Funcionais

Os requisitos funcionais descrevem as funcionalidades que o sistema deve oferecer aos usuários.

### 2.1. Gestão de Usuários

*   **RF001 - Registro de Usuário**: O sistema deve permitir que novos usuários se registrem, fornecendo informações como nome, e-mail e senha.
*   **RF002 - Login de Usuário**: O sistema deve permitir que usuários registrados façam login com suas credenciais.
*   **RF003 - Gerenciamento de Perfil**: O usuário deve ser capaz de visualizar e atualizar suas informações de perfil (ex: nome, senha).

### 2.2. Gestão de Veículos

*   **RF004 - Cadastro de Veículo**: O usuário deve ser capaz de cadastrar um ou mais veículos, informando dados como marca, modelo, ano e placa.
*   **RF005 - Visualização de Veículos**: O usuário deve ser capaz de visualizar a lista de seus veículos cadastrados.
*   **RF006 - Edição de Veículo**: O usuário deve ser capaz de editar as informações de um veículo existente.
*   **RF007 - Exclusão de Veículo**: O usuário deve ser capaz de excluir um veículo cadastrado.

### 2.3. Gestão de Viagens (Journeys)

*   **RF008 - Registro de Viagem**: O usuário deve ser capaz de registrar uma nova viagem, informando data, hora de início e fim, distância percorrida, valor recebido e veículo utilizado.
*   **RF009 - Visualização de Viagens**: O usuário deve ser capaz de visualizar um histórico de suas viagens, com opções de filtro por período ou veículo.
*   **RF010 - Edição de Viagem**: O usuário deve ser capaz de editar os detalhes de uma viagem registrada.
*   **RF011 - Exclusão de Viagem**: O usuário deve ser capaz de excluir uma viagem registrada.

### 2.4. Gestão de Abastecimentos (Fuelings)

*   **RF012 - Registro de Abastecimento**: O usuário deve ser capaz de registrar um abastecimento, informando data, quantidade de litros, valor total, tipo de combustível e veículo utilizado.
*   **RF013 - Visualização de Abastecimentos**: O usuário deve ser capaz de visualizar um histórico de seus abastecimentos.
*   **RF014 - Edição de Abastecimento**: O usuário deve ser capaz de editar os detalhes de um abastecimento registrado.
*   **RF015 - Exclusão de Abastecimento**: O usuário deve ser capaz de excluir um abastecimento registrado.

### 2.5. Gestão de Despesas (Expenses)

*   **RF016 - Registro de Despesa**: O usuário deve ser capaz de registrar uma despesa, informando data, descrição, valor e categoria (ex: manutenção, lavagem).
*   **RF017 - Visualização de Despesas**: O usuário deve ser capaz de visualizar um histórico de suas despesas.
*   **RF018 - Edição de Despesa**: O usuário deve ser capaz de editar os detalhes de uma despesa registrada.
*   **RF019 - Exclusão de Despesa**: O usuário deve ser capaz de excluir uma despesa registrada.

### 2.6. Relatórios e Análises

*   **RF020 - Dashboard Financeiro**: O sistema deve apresentar um dashboard com um resumo financeiro do usuário, incluindo receita total, despesas totais, lucro líquido, e média por viagem/dia/semana.
*   **RF021 - Relatórios Personalizados**: O usuário deve ser capaz de gerar relatórios financeiros personalizados, filtrando por período, veículo, tipo de despesa, etc.
*   **RF022 - Gráficos e Visualizações**: Os relatórios devem incluir gráficos e visualizações para facilitar a compreensão dos dados financeiros.

### 2.7. Notificações e Alertas

*   **RF023 - Notificações de Eventos**: O sistema deve ser capaz de enviar notificações para o usuário sobre eventos importantes (ex: lembrete de manutenção de veículo, meta financeira atingida).

## 3. Requisitos Não Funcionais

Os requisitos não funcionais descrevem as qualidades e restrições do sistema.

### 3.1. Performance

*   **RNF001 - Tempo de Resposta**: O sistema deve responder às requisições do usuário em no máximo 3 segundos para 90% das operações, sob carga normal.
*   **RNF002 - Carregamento de Dados**: O carregamento de listas e relatórios deve ser rápido, exibindo os primeiros resultados em até 2 segundos.

### 3.2. Segurança

*   **RNF003 - Autenticação Segura**: O sistema deve utilizar autenticação baseada em tokens (JWT) para proteger o acesso às APIs.
*   **RNF004 - Autorização**: O sistema deve garantir que os usuários só possam acessar e manipular seus próprios dados.
*   **RNF005 - Proteção de Dados**: Dados sensíveis (ex: senhas) devem ser armazenados de forma criptografada.
*   **RNF006 - Validação de Entrada**: Todas as entradas de usuário devem ser validadas para prevenir ataques como injeção de SQL e XSS.
*   **RNF007 - Auditoria de Acesso**: O sistema deve registrar tentativas de login e acessos não autorizados.

### 3.3. Usabilidade

*   **RNF008 - Interface Intuitiva**: A interface do usuário deve ser intuitiva e fácil de usar, mesmo para usuários com pouca experiência tecnológica.
*   **RNF009 - Responsividade**: A aplicação frontend deve ser responsiva e funcionar bem em diferentes tamanhos de tela (celulares e tablets).
*   **RNF010 - Feedback ao Usuário**: O sistema deve fornecer feedback claro e imediato sobre as ações do usuário (ex: mensagens de sucesso, erro, carregamento).

### 3.4. Confiabilidade

*   **RNF011 - Disponibilidade**: O sistema deve estar disponível 99.5% do tempo.
*   **RNF012 - Tratamento de Erros**: O sistema deve tratar erros de forma graciosa, exibindo mensagens claras ao usuário e registrando os erros para depuração.
*   **RNF013 - Backup e Recuperação**: Deve haver um plano de backup e recuperação de dados para garantir a integridade e disponibilidade das informações.

### 3.5. Manutenibilidade

*   **RNF014 - Código Limpo e Modular**: O código-fonte deve seguir padrões de codificação, ser modular e bem comentado para facilitar a manutenção e futuras extensões.
*   **RNF015 - Testabilidade**: O sistema deve ser projetado para facilitar a escrita de testes automatizados (unitários, integração, E2E).
*   **RNF016 - Documentação Atualizada**: A documentação técnica e de usuário deve ser mantida atualizada.

### 3.6. Escalabilidade

*   **RNF017 - Suporte a Crescimento de Usuários**: O sistema deve ser capaz de suportar um aumento no número de usuários e dados sem degradação significativa de performance.
*   **RNF018 - Arquitetura Distribuída (Futuro)**: A arquitetura deve permitir a futura distribuição de componentes (ex: microsserviços) se a demanda exigir.

### 3.7. Compatibilidade

*   **RNF019 - Compatibilidade com Dispositivos Móveis**: A aplicação frontend deve ser compatível com as versões mais recentes dos sistemas operacionais Android e iOS.
*   **RNF020 - Compatibilidade com Navegadores Web**: A versão web do frontend deve ser compatível com os principais navegadores modernos (Chrome, Firefox, Safari, Edge).

## 4. Glossário

*   **GiroPro**: Nome da aplicação de gestão financeira para motoristas de aplicativo.
*   **Backend**: Parte do sistema responsável pela lógica de negócio, banco de dados e API.
*   **Frontend**: Parte do sistema responsável pela interface do usuário.
*   **API**: Application Programming Interface, conjunto de regras que permite a comunicação entre diferentes softwares.
*   **JWT**: JSON Web Token, método seguro para transmitir informações entre partes como um objeto JSON.
*   **SQLite**: Banco de dados leve e embarcado, utilizado no projeto.
*   **Drizzle ORM**: Object-Relational Mapper utilizado para interagir com o banco de dados.
*   **Node.js**: Ambiente de execução JavaScript server-side.
*   **React Native**: Framework para desenvolvimento de aplicações móveis multiplataforma.
*   **Expo**: Ferramenta para desenvolvimento de aplicações React Native.
*   **camelCase**: Convenção de nomenclatura onde a primeira letra de cada palavra (exceto a primeira) é maiúscula (ex: `nomeDoUsuario`).
*   **snake_case**: Convenção de nomenclatura onde as palavras são separadas por underscores (ex: `nome_do_usuario`).

## 5. Referências

*   Documentação existente do projeto GiroPro (GUIA_DE_SETUP_COMPLETO.md, principiosArquiteturais.md, progresso.md)
*   Requisitos de sistemas de gestão financeira em geral.

---

**Data da Criação**: 29/08/2025
**Versão**: 1.0


