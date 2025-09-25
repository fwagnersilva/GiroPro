# Funcionalidades do Sistema GiroPro

## 1. Frontend

### 1.1. Telas de Autenticação

#### `LoginScreen` / `LoginScreenOptimized`

*   **Resumo**: A `LoginScreen` é a interface primária para autenticação de usuários. Sua função é validar credenciais e iniciar a sessão do usuário, sendo um ponto crítico para a segurança do sistema. Para desenvolvedores, é essencial entender a integração com o endpoint `/auth/login` do backend e as validações de entrada para garantir a integridade do processo de autenticação.
*   **Campos**:
    *   `email`: Endereço de e-mail do usuário (string).
    *   `senha`: Senha do usuário (string).
*   **Validações**:
    *   `email`: Formato de e-mail válido.
    *   `senha`: Mínimo de 8 caracteres.
*   **Ações**:
    *   Botão "Entrar": Submete o formulário para a API de login.
    *   Link "Esqueceu sua senha?": Navega para a tela de recuperação de senha.
    *   Checkbox "Lembrar-me": Mantém o usuário logado.

#### `RegisterScreen` / `RegisterScreenOptimized`

*   **Resumo**: A `RegisterScreen` é a interface para a criação de novas contas de usuário. Sua função é coletar informações essenciais e registrá-las no sistema, integrando-se ao endpoint `/auth/register` do backend. Para desenvolvedores, é crucial garantir a correta validação de todos os campos e a segurança no armazenamento das credenciais, além de lidar com possíveis erros de registro, como e-mails duplicados.
*   **Campos**:
    *   `nome`: Nome do usuário (string).
    *   `email`: Endereço de e-mail do usuário (string).
    *   `senha`: Senha do usuário (string).
    *   `confirmarSenha`: Confirmação da senha (string).
*   **Validações**:
    *   `nome`: Campo obrigatório.
    *   `email`: Formato de e-mail válido e único no sistema.
    *   `senha`: Mínimo de 8 caracteres, com letras maiúsculas, minúsculas, números e caracteres especiais.
    *   `confirmarSenha`: Deve ser igual ao campo `senha`.
*   **Ações**:
    *   Botão "Registrar": Submete o formulário para a API de registro.

#### `ChangePasswordScreen`

*   **Resumo**: A `ChangePasswordScreen` é vital para a segurança da conta, permitindo que os usuários atualizem suas senhas. Para desenvolvedores, a implementação deve focar na comunicação segura com o backend para atualização de credenciais, garantindo que a nova senha atenda aos requisitos de segurança e que a autenticação do usuário seja verificada antes da alteração.
*   **Campos**:
    *   `senhaAtual`: Senha atual do usuário (string).
    *   `novaSenha`: Nova senha do usuário (string).
    *   `confirmarNovaSenha`: Confirmação da nova senha (string).
*   **Validações**:
    *   `senhaAtual`: Deve corresponder à senha atual do usuário.
    *   `novaSenha`: Mínimo de 8 caracteres, com os mesmos requisitos da tela de registro.
    *   `confirmarNovaSenha`: Deve ser igual ao campo `novaSenha`.
*   **Ações**:
    *   Botão "Alterar Senha": Submete o formulário para a API de alteração de senha.

### 1.2. Telas de Dashboard

#### `DashboardScreen` / `DashboardScreenOptimized`

*   **Resumo**: A `DashboardScreen` é a interface central para a visualização de métricas operacionais e financeiras. Sua função é consolidar dados de diversos módulos (veículos, abastecimentos, despesas) e apresentá-los de forma gráfica e resumida. Para desenvolvedores, é crucial entender como esta tela consome dados dos endpoints `/dashboard/summary`, `/dashboard/evolution` e `/dashboard/vehicles` do backend, e como os componentes visuais são renderizados para refletir o estado atual da frota e as tendências financeiras.
*   **Componentes**:
    *   Card de Lucratividade: Exibe o lucro líquido do período.
    *   Gráfico de Evolução: Mostra a evolução de receitas e despesas.
    *   Lista de Veículos: Apresenta um resumo dos veículos cadastrados.
    *   Botões de Ação Rápida: Atalhos para adicionar abastecimento, despesa ou viagem.

### 1.3. Telas de Veículos

#### `VehiclesScreen` / `VehiclesScreenOptimized`

*   **Resumo**: A `VehiclesScreen` é a interface principal para o gerenciamento da frota de veículos. Sua função é permitir operações CRUD (Criar, Ler, Atualizar, Deletar) sobre os registros de veículos, interagindo diretamente com o endpoint `/vehicles` do backend. Para desenvolvedores, é crucial implementar validações robustas nos campos de entrada e garantir a correta manipulação dos dados para manter a integridade do inventário de veículos e impactar precisamente os cálculos de custos e desempenho.
*   **Funcionalidades**:
    *   Listagem de veículos cadastrados.
    *   Adição de novos veículos.
    *   Edição de informações de veículos existentes.
    *   Remoção de veículos.

#### `MultiVehicleScreen`

*   **Resumo**: A `MultiVehicleScreen` é projetada para otimizar a experiência de usuários com múltiplas frotas, permitindo a seleção e alternância eficiente entre veículos. Para desenvolvedores, é crucial entender como esta tela gerencia o estado do veículo selecionado, pois essa escolha impacta diretamente os dados exibidos em outras seções do aplicativo. A implementação deve garantir uma transição fluida e a correta atualização das informações dependentes do veículo ativo.
*   **Funcionalidades**:
    *   Exibição de todos os veículos em formato de grade ou lista.
    *   Seleção de um veículo para visualizar detalhes.

## 2. Backend

### 2.1. Módulo de Autenticação (`/auth`)

Este módulo é a espinha dorsal da segurança do sistema, responsável por gerenciar o ciclo de vida da autenticação e autorização dos usuários. Para desenvolvedores, compreender a arquitetura deste módulo é fundamental para integrar novas funcionalidades que dependam de acesso seguro e para implementar políticas de segurança robustas. Ele lida com a criação de contas, login e gerenciamento de sessões, garantindo que apenas usuários válidos possam acessar recursos protegidos.

*   `POST /register`: **Função**: Permite a criação de novas contas de usuário. **Importância**: Essencial para a expansão da base de usuários e para a integração de novos clientes.
*   `POST /login`: **Função**: Autentica usuários existentes, verificando credenciais e emitindo tokens de sessão. **Importância**: Garante o acesso seguro e controlado às funcionalidades do sistema.
*   `GET /me`: **Função**: Retorna os dados do perfil do usuário atualmente autenticado. **Importância**: Permite que o frontend personalize a experiência do usuário e exiba informações relevantes.

### 2.2. Módulo de Dashboard (`/dashboard`)

Este módulo é a fonte de dados agregados e métricas de desempenho para o frontend. Para desenvolvedores, entender os endpoints aqui é crucial para construir dashboards precisos e responsivos, que forneçam insights em tempo real sobre a performance da frota. Ele consolida informações de outros módulos para apresentar uma visão holística.

*   `GET /summary`: **Função**: Retorna um resumo consolidado de lucratividade e métricas financeiras chave. **Importância**: Fornece os dados para o card principal do dashboard, permitindo uma visão rápida da saúde financeira.
*   `GET /evolution`: **Função**: Retorna dados estruturados para a construção de gráficos de evolução temporal. **Importância**: Essencial para visualizar tendências e padrões de desempenho ao longo do tempo.
*   `GET /vehicles`: **Função**: Retorna dados para comparar o desempenho entre diferentes veículos. **Importância**: Permite identificar veículos mais eficientes ou problemáticos, auxiliando na gestão da frota.





### 2.3. Módulo de Veículos (`/vehicles`)

Este módulo é o coração da gestão de frotas no sistema, fornecendo uma API completa para o ciclo de vida dos veículos. Para desenvolvedores, é crucial entender a estrutura de dados dos veículos e as validações aplicadas, pois a integridade deste módulo impacta diretamente os cálculos de custos, análises de desempenho e a integração com módulos como abastecimentos e despesas. A robustez das operações CRUD aqui é fundamental para a confiabilidade de todo o sistema.

*   **CRUD Completo de Veículos**: **Função**: Permite a criação, leitura, atualização e exclusão de registros de veículos (marca, modelo, ano, placa, tipo de combustível). **Importância**: Garante a integridade e a atualidade dos dados da frota. As operações de escrita (POST, PUT, DELETE) requerem validação robusta de dados.
*   **Gerenciamento Multi-veículo**: **Função**: Suporta o cadastro e gerenciamento de múltiplos veículos por um único usuário. **Importância**: Essencial para usuários com frotas, permitindo a segregação e análise individualizada de dados por veículo.




### 1.4. Telas de Abastecimentos

#### `FuelingsScreen`

*   **Resumo**: A `FuelingsScreen` é crucial para o registro e acompanhamento de abastecimentos, impactando diretamente o cálculo de custos e a análise de eficiência de combustível. Para desenvolvedores, é fundamental garantir a precisão dos dados de entrada (data, valor, volume, odômetro) e a correta associação com o veículo. A tela interage com o endpoint `/fuelings` do backend para operações CRUD, e a validação de dados é vital para a integridade das métricas.
*   **Funcionalidades**:
    *   Registro de novos abastecimentos (data, valor, volume, odômetro).
    *   Listagem de abastecimentos anteriores.
    *   Edição e exclusão de registros.




### 2.4. Módulo de Abastecimentos (`/fuelings`)

Este módulo é o pilar para a gestão de custos de combustível, fornecendo uma API para registrar, consultar, atualizar e remover dados de abastecimento. Para desenvolvedores, a precisão e a integridade dos dados são cruciais, pois eles alimentam métricas de consumo e eficiência. A implementação deve garantir validações rigorosas e a correta associação dos abastecimentos aos veículos, impactando diretamente a confiabilidade dos relatórios financeiros.

*   `POST /`: **Função**: Cria um novo registro de abastecimento. **Importância**: Permite a inserção de novos dados de abastecimento, que são a base para as análises de consumo e custo.
*   `GET /`: **Função**: Retorna uma lista de todos os abastecimentos registrados. **Importância**: Fornece um histórico completo de abastecimentos para análise e visualização.
*   `PUT /:id`: **Função**: Atualiza um registro de abastecimento existente. **Importância**: Garante a correção de dados e a manutenção da precisão do histórico.
*   `DELETE /:id`: **Função**: Remove um registro de abastecimento. **Importância**: Permite a exclusão de registros incorretos ou duplicados.




### 2.5. Módulo de Despesas (`/expenses`)

Este módulo é essencial para o controle financeiro detalhado, oferecendo uma API para gerenciar despesas operacionais e pessoais. Para desenvolvedores, a correta categorização e registro das despesas são cruciais para análises de lucratividade e otimização de custos. A implementação deve focar na robustez das operações CRUD e na validação de dados para garantir a integridade financeira do sistema.

*   `POST /`: **Função**: Cria um novo registro de despesa. **Importância**: Permite a inserção de novos dados financeiros, essenciais para o acompanhamento de gastos.
*   `GET /`: **Função**: Retorna uma lista de todas as despesas registradas. **Importância**: Fornece um histórico completo de despesas para análise e visualização.
*   `PUT /:id`: **Função**: Atualiza um registro de despesa existente. **Importância**: Garante a correção de dados e a manutenção da precisão do histórico financeiro.
*   `DELETE /:id`: **Função**: Remove um registro de despesa. **Importância**: Permite a exclusão de registros incorretos ou duplicados.




### 2.6. Módulo de Viagens (`/trips`)

Este módulo é fundamental para o planejamento e controle logístico, oferecendo uma API para gerenciar viagens. Para desenvolvedores, é essencial entender como as rotas, distâncias e tempos de deslocamento são registrados e processados, pois esses dados são cruciais para a otimização de custos e a análise de eficiência da frota. A implementação deve garantir a precisão geográfica e temporal dos registros.

*   `POST /`: **Função**: Cria um novo registro de viagem. **Importância**: Permite o registro de novas viagens, essencial para o planejamento e controle logístico.
*   `GET /`: **Função**: Retorna uma lista de todas as viagens registradas. **Importância**: Fornece um histórico completo de viagens para análise e visualização.
*   `PUT /:id`: **Função**: Atualiza um registro de viagem existente. **Importância**: Garante a correção de dados e a manutenção da precisão do histórico de viagens.
*   `DELETE /:id`: **Função**: Remove um registro de viagem. **Importância**: Permite a exclusão de registros incorretos ou duplicados.




### 2.7. Módulo de Relatórios (`/reports`)

Este módulo atua como o motor analítico do sistema, transformando dados brutos em insights estratégicos. Para desenvolvedores, é crucial entender como os dados são agregados e processados para gerar relatórios precisos e relevantes. A correta implementação dos endpoints aqui é vital para que o frontend possa apresentar informações confiáveis sobre a performance da frota, auxiliando na identificação de oportunidades de otimização e na tomada de decisões baseadas em dados.

*   `GET /financial-summary`: **Função**: Gera um resumo financeiro completo, incluindo receitas, despesas e lucratividade. **Importância**: Oferece uma visão macro da saúde financeira da operação.
*   `GET /vehicle-performance`: **Função**: Gera relatórios detalhados sobre o desempenho individual de cada veículo. **Importância**: Permite a identificação de veículos com baixo desempenho ou custos elevados.
*   `GET /expense-analysis`: **Função**: Analisa as despesas por categoria e período. **Importância**: Ajuda a identificar os principais focos de custo e a encontrar oportunidades de economia.




### 2.8. Módulo de Gamificação (`/gamification`)

Este módulo é estratégico para aumentar o engajamento e a retenção de usuários, aplicando princípios de gamificação. Para desenvolvedores, é crucial entender a API para gerenciar conquistas e classificações, pois ela permite a integração de novos desafios e recompensas, incentivando a interação contínua e a melhoria do desempenho do usuário. A correta implementação aqui impacta diretamente a motivação e a fidelidade dos usuários.

*   `GET /achievements`: **Função**: Fornece uma API para listar todas as conquistas disponíveis e o progresso do usuário em relação a elas. **Importância**: Permite que o frontend exiba o status de gamificação do usuário, incentivando a conclusão de tarefas e a interação contínua.
*   `GET /leaderboard`: **Função**: Retorna dados para construir classificações de usuários com base em métricas de desempenho (ex: distância percorrida, economia de combustível). **Importância**: Essencial para a criação de um ambiente competitivo e social, motivando os usuários a melhorar seu desempenho.




### 2.9. Módulo de Preços de Combustível (`/fuel-prices`)

Este módulo é crucial para a otimização de custos e a tomada de decisões estratégicas relacionadas a abastecimentos, fornecendo dados atualizados sobre os preços dos combustíveis. Para desenvolvedores, é fundamental entender como os dados de localização são utilizados para buscar e apresentar preços relevantes, e como o histórico de preços pode ser integrado para análises preditivas. A precisão e a disponibilidade desses dados impactam diretamente a capacidade do usuário de economizar e planejar eficientemente.

*   `GET /`: **Função**: Retorna os preços de combustível para uma determinada localização. **Importância**: Permite que o usuário encontre os postos de combustível mais baratos em sua região.
*   `GET /history`: **Função**: Retorna o histórico de preços de combustível para uma determinada localização. **Importância**: Ajuda o usuário a identificar tendências de preços e a planejar seus abastecimentos de forma mais estratégica.

