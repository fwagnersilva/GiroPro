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

*   **RF004 - Cadastro de Veículo**: O usuário deve ser capaz de cadastrar um ou mais veículos, informando dados como marca, modelo, ano, placa, tipo de combustível e tipo de uso.
*   **RF005 - Visualização de Veículos**: O usuário deve ser capaz de visualizar a lista de seus veículos cadastrados.
*   **RF006 - Edição de Veículo**: O usuário deve ser capaz de editar as informações de um veículo existente.
*   **RF007 - Exclusão de Veículo**: O usuário deve ser capaz de excluir um veículo cadastrado (soft delete).

### 2.3. Gestão de Jornadas

*   **RF008 - Início de Jornada**: O usuário deve ser capaz de iniciar uma jornada, registrando o veículo utilizado e a quilometragem inicial.
*   **RF009 - Finalização de Jornada**: O usuário deve ser capaz de finalizar uma jornada em andamento, registrando a quilometragem final e o faturamento obtido por cada plataforma utilizada (ex: Uber, 99).
*   **RF010 - Visualização de Jornadas**: O usuário deve ser capaz de visualizar um histórico de suas jornadas, com opções de filtro por período ou veículo.
*   **RF011 - Edição de Jornada**: O usuário deve ser capaz de editar os detalhes de uma jornada registrada.
*   **RF012 - Exclusão de Jornada**: O usuário deve ser capaz de excluir uma jornada registrada.

### 2.4. Gestão de Abastecimentos

*   **RF013 - Registro de Abastecimento**: O usuário deve ser capaz de registrar um abastecimento, informando data, quantidade de litros, valor total, tipo de combustível e veículo utilizado.
*   **RF014 - Visualização de Abastecimentos**: O usuário deve ser capaz de visualizar um histórico de seus abastecimentos.
*   **RF015 - Edição de Abastecimento**: O usuário deve ser capaz de editar os detalhes de um abastecimento registrado.
*   **RF016 - Exclusão de Abastecimento**: O usuário deve ser capaz de excluir um abastecimento registrado.

### 2.5. Gestão de Despesas

*   **RF017 - Registro de Despesa**: O usuário deve ser capaz de registrar uma despesa, informando data, descrição, valor e categoria (ex: manutenção, lavagem).
*   **RF018 - Visualização de Despesas**: O usuário deve ser capaz de visualizar um histórico de suas despesas.
*   **RF019 - Edição de Despesa**: O usuário deve ser capaz de editar os detalhes de uma despesa registrada.
*   **RF020 - Exclusão de Despesa**: O usuário deve ser capaz de excluir uma despesa registrada (soft delete).

### 2.6. Gestão de Plataformas

*   **RF021 - Visualização de Plataformas**: O usuário deve ser capaz de visualizar a lista de plataformas disponíveis e customizadas.
*   **RF022 - Ativação/Desativação de Plataforma**: O usuário deve ser capaz de ativar ou desativar plataformas predefinidas (Uber, 99).
*   **RF023 - Criação de Plataforma Customizada**: O usuário deve ser capaz de criar novas plataformas customizadas.
*   **RF024 - Edição de Plataforma Customizada**: O usuário deve ser capaz de editar o nome e o status de plataformas customizadas.
*   **RF025 - Exclusão de Plataforma Customizada**: O usuário deve ser capaz de excluir plataformas customizadas (soft delete).

### 2.7. Relatórios e Análises

*   **RF026 - Dashboard Financeiro**: O sistema deve apresentar um dashboard com um resumo financeiro do usuário, incluindo faturamento total, despesas totais, lucro líquido, KM rodados e número de jornadas, com detalhamento por plataforma.
*   **RF027 - Relatórios Personalizados**: O usuário deve ser capaz de gerar relatórios financeiros personalizados, filtrando por período, veículo, tipo de despesa, etc.
*   **RF028 - Gráficos e Visualizações**: Os relatórios devem incluir gráficos e visualizações para facilitar a compreensão dos dados financeiros.

### 2.8. Notificações e Alertas

*   **RF029 - Notificações de Eventos**: O sistema deve ser capaz de enviar notificações para o usuário sobre eventos importantes (ex: lembrete de manutenção de veículo, meta financeira atingida).

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

### 3.3. Usabilidade

*   **RNF007 - Interface Intuitiva**: A interface do usuário deve ser intuitiva e fácil de usar, mesmo para usuários com pouca experiência tecnológica.
*   **RNF008 - Responsividade**: A aplicação frontend deve ser responsiva e funcionar bem em diferentes tamanhos de tela (celulares e tablets).
*   **RNF009 - Feedback ao Usuário**: O sistema deve fornecer feedback claro e imediato sobre as ações do usuário (ex: mensagens de sucesso, erro, carregamento).

### 3.4. Confiabilidade

*   **RNF010 - Disponibilidade**: O sistema deve estar disponível 99.5% do tempo.
*   **RNF011 - Tratamento de Erros**: O sistema deve tratar erros de forma graciosa, exibindo mensagens claras ao usuário e registrando os erros para depuração.

### 3.5. Manutenibilidade

*   **RNF012 - Código Limpo e Modular**: O código-fonte deve seguir padrões de codificação, ser modular e bem comentado para facilitar a manutenção e futuras extensões.
*   **RNF013 - Testabilidade**: O sistema deve ser projetado para facilitar a escrita de testes automatizados (unitários, integração, E2E).
*   **RNF014 - Documentação Atualizada**: A documentação técnica e de usuário deve ser mantida atualizada.

### 3.6. Escalabilidade

*   **RNF015 - Suporte a Crescimento de Usuários**: O sistema deve ser capaz de suportar um aumento no número de usuários e dados sem degradação significativa de performance.

### 3.7. Compatibilidade

*   **RNF016 - Compatibilidade com Dispositivos Móveis**: A aplicação frontend deve ser compatível com as versões mais recentes dos sistemas operacionais Android e iOS.
*   **RNF017 - Compatibilidade com Navegadores Web**: A versão web do frontend deve ser compatível com os principais navegadores modernos (Chrome, Firefox, Safari, Edge).

---

**Data da Criação**: 29/08/2025
**Última Atualização**: 01/10/2025
**Versão**: 1.2

