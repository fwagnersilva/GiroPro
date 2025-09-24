# Documentação Detalhada das Funcionalidades do Sistema GiroPro

## 1. Introdução

Este documento tem como objetivo fornecer uma visão abrangente e detalhada das funcionalidades implementadas no sistema GiroPro. Ele serve como um guia essencial para desenvolvedores, stakeholders e qualquer pessoa interessada em compreender o escopo técnico e operacional da aplicação. O GiroPro é uma plataforma desenvolvida para gerenciamento de frotas e controle financeiro de veículos para motoristas e empresas..

### 1.1. Propósito do Documento

O propósito principal deste documento é consolidar informações sobre as capacidades do sistema, desde as APIs de backend até as interfaces de usuário no frontend, incluindo componentes reutilizáveis e áreas para desenvolvimento futuro. A documentação visa facilitar o onboarding de novos membros da equipe, a manutenção do sistema e o planejamento de futuras expansões.

## 2. Funcionalidades do Backend (APIs)

O backend do GiroPro é construído em uma arquitetura modular, oferecendo uma série de APIs RESTful que suportam todas as operações do frontend e interações com o banco de dados. Cada módulo é projetado para ser escalável e eficiente.

### 2.1. Módulo de Autenticação (`/auth`)

O módulo de autenticação é responsável por gerenciar o acesso dos usuários ao sistema, garantindo segurança e integridade. Ele inclui as seguintes funcionalidades:

O módulo de autenticação é responsável por gerenciar o acesso dos usuários ao sistema, garantindo segurança e integridade. Ele oferece funcionalidades essenciais como o **Registro de Usuário (`POST /register`)**, que permite a criação de novas contas, e o **Login de Usuário (`POST /login`)**, que autentica usuários existentes e emite tokens de acesso para sessões seguras. Além disso, o sistema permite a **Recuperação de Perfil (`GET /me`)**, onde usuários autenticados podem acessar suas próprias informações. Um recurso planejado é a **Recuperação de Senha**, que permitirá aos usuários redefinir suas senhas através de um fluxo seguro, envolvendo o envio de e-mails com tokens de recuperação e interfaces dedicadas para redefinição, conforme detalhado no Backlog da Tela de Login.

### 2.2. Módulo de Dashboard (`/dashboard`)

O módulo de dashboard fornece dados agregados e métricas chave para a visualização do desempenho e informações relevantes para o usuário.

O módulo de dashboard fornece dados agregados e métricas chave para a visualização do desempenho e informações relevantes para o usuário. Ele oferece um **Resumo de Lucratividade e Métricas Chave (`GET /summary`)**, que proporciona um panorama financeiro rápido, incluindo lucro líquido, custos totais, receitas e outras métricas importantes. Além disso, disponibiliza **Dados para Gráficos de Evolução Temporal (`GET /evolution`)**, que são estruturados para a construção de gráficos que mostram a evolução de métricas ao longo do tempo (diário, semanal, mensal). Complementarmente, permite o **Comparativo de Desempenho entre Veículos (`GET /vehicles`)**, auxiliando na tomada de decisões sobre eficiência e custos ao comparar a performance de diferentes veículos registrados.

### 2.3. Módulo de Veículos (`/vehicles`)

Este módulo gerencia todas as informações relacionadas aos veículos do usuário.

Este módulo gerencia todas as informações relacionadas aos veículos do usuário. Ele oferece um **CRUD Completo de Veículos**, suportando a criação, leitura, atualização e exclusão de registros de veículos, incluindo detalhes como marca, modelo, ano, placa e tipo de combustível. Adicionalmente, o sistema permite o **Gerenciamento Multi-veículo**, onde um único usuário pode cadastrar e gerenciar múltiplos veículos em sua conta, conta de forma eficiente.

### 2.4. Módulo de Abastecimentos (`/fuelings`)

Responsável pelo registro e acompanhamento dos abastecimentos dos veículos.

O módulo de abastecimentos é responsável pelo registro e acompanhamento dos abastecimentos dos veículos. Ele oferece um **CRUD de Registros de Abastecimentos**, permitindo adicionar, visualizar, modificar e remover detalhes de cada abastecimento, como data, local, quantidade de litros, valor por litro e odômetro. Além disso, mantém um **Histórico Detalhado de Abastecimentos**, que é um registro cronológico de todos os abastecimentos realizados, facilitando a consulta e análise.

### 2.5. Módulo de Despesas (`/expenses`)

Gerencia todas as despesas associadas aos veículos ou à operação geral.

O módulo de despesas gerencia todas as despesas associadas aos veículos ou à operação geral. Ele oferece um **CRUD de Registros de Despesas**, permitindo adicionar, visualizar, modificar e remover diferentes tipos de despesas, como manutenção, pedágios e estacionamento, com detalhes de valor e data. Além disso, armazena um **Histórico Detalhado de Despesas**, que é um registro completo de todas as despesas registradas, facilitando o controle financeiro.

### 2.6. Módulo de Viagens (`/journeys`)

Controla o registro e o histórico das viagens realizadas.

O módulo de viagens controla o registro e o histórico das viagens realizadas. Ele oferece um **CRUD de Registros de Viagens/Jornadas**, permitindo criar, visualizar, atualizar e excluir informações detalhadas sobre as viagens, como início, fim, distância percorrida e consumo de combustível. Complementarmente, mantém um **Histórico Detalhado de Viagens**, que é um registro completo de todas as jornadas realizadas, facilitando a análise de rotas e desempenho.

### 2.7. Módulo de Relatórios (`/reports`)

Oferece funcionalidades para a geração de relatórios e análises.

O módulo de relatórios oferece funcionalidades robustas para a geração de análises e insights. Ele permite a **Geração de Relatórios Semanais e Mensais**, produzindo resumos periódicos do desempenho financeiro e operacional do usuário. Além disso, inclui **Funcionalidades de Analytics Avançados**, que fornecem ferramentas para análises mais profundas dos dados, auxiliando na identificação de tendências e padrões importantes para a gestão de veículos.

### 2.8. Módulo de Gamificação (`/gamification`)

Projetado para aumentar o engajamento do usuário através de elementos de jogo.

O módulo de gamificação é projetado para aumentar o engajamento do usuário através de elementos de jogo. Ele implementa um **Sistema de Conquistas**, que recompensa os usuários por atingirem metas ou marcos específicos no uso do aplicativo. Além disso, permite a **Definição e Acompanhamento de Metas**, onde os usuários podem estabelecer seus próprios objetivos, como economia de combustível ou redução de despesas, e monitorar seu progresso de forma interativa.

### 2.9. Módulo de Preços de Combustível (`/fuel-prices`)

Fornece informações sobre os preços dos combustíveis.

O módulo de preços de combustível fornece informações essenciais para os usuários. Ele permite a **Consulta de Preços de Combustível**, onde os usuários podem verificar os preços atuais de diferentes tipos de combustível. Adicionalmente, oferece um **Histórico de Preços de Combustível**, que armazena e exibe a variação dos preços ao longo do tempo, auxiliando na tomada de decisões sobre quando e onde abastecer.

### 2.10. Módulo de Notificações (`/notifications`)

Gerencia o sistema de alertas e comunicações dentro do aplicativo.

O módulo de notificações gerencia o sistema de alertas e comunicações dentro do aplicativo. Ele implementa um **Sistema de Notificações** robusto, capaz de enviar alertas importantes, lembretes e informações relevantes diretamente para o usuário, mantendo-o sempre atualizado sobre eventos críticos ou novidades na plataforma.

### 2.11. Módulo de Insights (`/insights`)

Oferece análises inteligentes e sugestões personalizadas.

O módulo de insights oferece análises inteligentes e sugestões personalizadas. Ele é responsável pela **Geração de Análises e Sugestões Personalizadas**, fornecendo recomendações baseadas nos dados do usuário para otimizar o uso do veículo, economizar custos e melhorar a eficiência geral, transformando dados brutos em ações práticas.

## 3. Funcionalidades do Frontend (Telas)

O frontend do GiroPro é desenvolvido para oferecer uma experiência de usuário intuitiva e responsiva, com telas otimizadas para diferentes dispositivos.

### 3.1. Telas de Autenticação

As telas de autenticação do GiroPro são projetadas para garantir um acesso seguro e intuitivo ao sistema. A **`LoginScreen`**, com sua versão otimizada **`LoginScreenOptimized`**, oferece uma interface para o login de usuários, incluindo campos para e-mail e senha, melhorias de feedback de erro e a conveniente opção "Lembrar-me". Para novos usuários, a **`RegisterScreen`**, também disponível em uma versão **`RegisterScreenOptimized`**, proporciona uma experiência de cadastro fluida e com feedback visual aprimorado. Além disso, a **`ChangePasswordScreen`** permite que os usuários alterem suas senhas de forma segura, seja após a autenticação ou como parte de um fluxo de recuperação de senha.

### 3.2. Telas de Dashboard

As telas de Dashboard são o coração da visualização de dados no GiroPro. A **`DashboardScreen`**, com sua versão aprimorada **`DashboardScreenOptimized`**, serve como a tela principal, exibindo um resumo conciso das informações do usuário, como lucratividade, gráficos de evolução e comparativos de veículos. A versão `Optimized` eleva a experiência do usuário com uma hierarquia visual aprimorada, um fluxo de ações otimizado, responsividade avançada para diversos dispositivos, microinterações e animações fluidas, além de um sistema de feedback aprimorado. Complementarmente, a **`LoadingScreen`** é exibida durante o carregamento de dados ou a inicialização da aplicação, garantindo uma experiência de espera mais agradável e informativa para o usuário.

### 3.3. Telas de Veículos

As telas de Veículos permitem aos usuários gerenciar sua frota de forma eficaz. A **`VehiclesScreen`**, com sua versão otimizada **`VehiclesScreenOptimized`**, oferece a capacidade de visualizar, adicionar, editar e remover veículos, proporcionando uma interface eficiente para o gerenciamento de múltiplos veículos. Além disso, a **`MultiVehicleScreen`** é uma tela dedicada que facilita a gestão e a alternância entre os diversos veículos cadastrados, otimizando a experiência do usuário que possui mais de um veículo.

### 3.4. Telas de Abastecimentos

As telas de Abastecimentos são dedicadas ao registro e acompanhamento do consumo de combustível. A **`FuelingsScreen`**, com sua versão otimizada **`FuelingsScreenOptimized`**, exibe a lista de todos os abastecimentos registrados, podendo incluir filtros e opções de ordenação para facilitar a análise. Para registrar novos abastecimentos, o sistema oferece a **`AddFuelingScreen`**, que em sua versão **`AddFuelingScreenOptimized`**, aprimora a usabilidade do formulário e inclui validação de dados em tempo real. O **`FuelingHistoryScreen`** apresenta um histórico detalhado de todos os abastecimentos, enquanto o **`FuelPricesScreen`** exibe informações sobre os preços de combustível, podendo incluir gráficos de tendência para auxiliar na decisão de compra.

### 3.5. Telas de Despesas

As telas de Despesas permitem o gerenciamento detalhado de todos os gastos associados aos veículos ou à operação. A **`ExpensesScreen`**, com sua versão otimizada **`ExpensesScreenOptimized`**, lista todas as despesas registradas, podendo oferecer funcionalidades avançadas de categorização e busca para facilitar a organização financeira. Para o registro de novos gastos, a **`AddExpenseScreen`**, em sua versão **`AddExpenseScreenOptimized`**, proporciona um formulário intuitivo com validação de dados, aprimorando a experiência de entrada. O **`ExpenseHistoryScreen`** oferece um histórico completo de todas as despesas, permitindo uma visão clara dos padrões de gastos ao longo do tempo.

### 3.6. Telas de Viagens

As telas de Viagens são essenciais para o registro e acompanhamento das jornadas realizadas. A **`JourneysScreen`**, com sua versão otimizada **`JourneysScreenOptimized`**, exibe uma lista de todas as viagens registradas, podendo incorporar funcionalidades de mapa ou visualização de rota para uma melhor compreensão do trajeto. O **`JourneyHistoryScreen`** complementa, apresentando um histórico detalhado de todas as viagens, permitindo aos usuários revisar informações como datas, distâncias percorridas e consumo de combustível por jornada.

### 3.7. Telas de Relatórios

A **`ReportsScreen`** é a tela dedicada à exibição dos relatórios gerados pelo sistema. Nela, os usuários podem visualizar análises financeiras e operacionais, com opções de personalização para ajustar os dados exibidos e funcionalidades de exportação para formatos diversos, facilitando o compartilhamento e a análise externa.

### 3.8. Telas de Gamificação

As telas de Gamificação são projetadas para motivar e engajar os usuários através de elementos lúdicos. A **`GoalsScreen`**, com sua versão otimizada **`GoalsScreenOptimized`**, permite que os usuários definam e acompanhem suas metas, oferecendo visualizações de progresso mais interativas para mantê-los motivados. Complementarmente, a **`AchievementsScreen`**, disponível também em uma versão **`AchievementsScreenOptimized`**, exibe as conquistas alcançadas pelo usuário, celebrando seus marcos e incentivando a continuidade do uso do aplicativo.

### 3.9. Telas de Perfil

A **`ProfileScreen`**, com sua versão otimizada **`ProfileScreenOptimized`**, é a tela onde o usuário pode visualizar e editar suas informações de perfil. Esta tela oferece a flexibilidade para atualizar dados pessoais e, na versão `Optimized`, pode incluir configurações avançadas para personalizar a experiência do aplicativo.

### 3.10. Telas de Insights

A **`InsightsScreen`** é a tela onde o sistema apresenta análises inteligentes e sugestões personalizadas para o usuário. Esta funcionalidade visa transformar dados brutos em informações acionáveis, ajudando o usuário a tomar decisões mais informadas sobre a gestão de seus veículos e finanças.

### 3.11. Telas de Onboarding

A **`OnboardingScreen`** é uma sequência de telas cuidadosamente elaboradas para guiar o novo usuário pela aplicação. Seu objetivo é introduzir as principais funcionalidades do GiroPro de forma didática e interativa, garantindo uma primeira experiência positiva e facilitando a adaptação ao sistema.

## 4. Componentes Reutilizáveis

O projeto GiroPro faz uso extensivo de componentes reutilizáveis para garantir consistência, modularidade e eficiência no desenvolvimento.

### 4.1. Componentes de UI (Interface do Usuário)

Os **Componentes de UI (Interface do Usuário)** são a base visual do GiroPro, garantindo uma experiência consistente e responsiva. O **`FormInput`** é um componente genérico e versátil para campos de entrada de formulário, oferecendo suporte robusto a validação e adaptabilidade a diferentes tipos de input. Para melhorar a percepção de performance durante operações assíncronas, o sistema utiliza o **`LoadingSpinner`** como um indicador visual de carregamento e o **`SkeletonLoader`**, um componente de placeholder que simula o layout do conteúdo enquanto ele está sendo carregado. A responsividade da aplicação é assegurada pelo **`ResponsiveContainer`**, um contêiner inteligente que se adapta dinamicamente a diversos tamanhos de tela, proporcionando uma visualização otimizada em qualquer dispositivo.

### 4.2. Componentes de Funcionalidades

Os **Componentes de Funcionalidades** estendem as capacidades do GiroPro, oferecendo módulos especializados. O **`EnhancedDashboard`** representa uma versão aprimorada do dashboard, integrando funcionalidades avançadas de visualização de dados e interação para uma análise mais profunda. Para análises de dados mais complexas, o **`AdvancedAnalytics`** fornece um componente robusto para exibir gráficos interativos e tabelas dinâmicas. O **`WeeklyMonthlyReports`** é um componente dedicado à visualização e geração de relatórios periódicos, enquanto o **`InsightsPanel`** exibe sugestões e recomendações personalizadas, transformando dados em conselhos práticos. O sistema de notificações é composto pelo **`NotificationBell`**, um ícone que indica novas mensagens, e o **`NotificationCenter`**, um hub centralizado para o usuário visualizar e gerenciar todos os seus alertas. O **`MultiVehicleSelector`** facilita a seleção e alternância entre veículos cadastrados, e o **`SearchAndFilter`** é um componente genérico para busca e filtragem de dados em listas e tabelas. Para exibir históricos de forma eficiente, o **`HistoryList`** gerencia listas de abastecimentos, despesas e viagens com paginação ou rolagem infinita. Por fim, o **`OnboardingWizard`** é um assistente passo a passo que guia novos usuários através da configuração inicial e introdução às funcionalidades do aplicativo.

## 5. Gaps Identificados e Próximos Passos

Esta seção aborda as lacunas existentes no projeto e as áreas que requerem atenção ou desenvolvimento futuro, conforme identificado na análise da documentação existente.

### 5.1. Problemas Técnicos

A seção de **Problemas Técnicos** detalha desafios cruciais que afetam a estabilidade e o desenvolvimento do GiroPro. A **inconsistência no schema do banco de dados**, com a mistura de padrões `snake_case` e `camelCase` nos nomes das colunas, tem gerado erros de tipagem. Embora análises prévias sugiram uma padronização, a atenção contínua a este ponto é vital para a robustez do sistema. Outro ponto crítico são os **erros de TypeScript que impedem o build** completo do projeto, exigindo revisão e correção para garantir a integridade do código. A **configuração de ambiente incompleta** tem causado dificuldades na configuração inicial, indicando a necessidade de aprimorar a documentação de setup ou automatizar o processo. Por fim, o **Docker não funcional no ambiente atual** em alguns ambientes de desenvolvimento impacta a padronização e a facilidade de deploy, sendo um obstáculo a ser superado.

### 5.2. Funcionalidades Potencialmente Faltantes

A seção de **Funcionalidades Potencialmente Faltantes** destaca áreas de oportunidade para o futuro desenvolvimento do GiroPro. A **integração com APIs externas de preços de combustível** pode ser expandida para além da consulta atual, explorando fontes mais robustas e dados em tempo real. A implementação de um **sistema de backup/sincronização de dados** é crucial para garantir a segurança e a disponibilidade das informações do usuário através de mecanismos automáticos. A capacidade de **exportação de dados para formatos diversos (CSV, PDF, etc.)** facilitaria a análise externa e o compartilhamento de relatórios. O desenvolvimento de **configurações avançadas do usuário** permitiria a personalização de preferências, temas e notificações. Por fim, o **suporte offline para funcionalidades críticas** é uma expansão importante, permitindo que os usuários realizem operações essenciais mesmo sem conexão à internet, com sincronização posterior.

### 5.3. Testes

A seção de **Testes** aborda a estratégia de garantia de qualidade do GiroPro. Atualmente, existem **testes unitários parciais implementados**, mas é fundamental aumentar a **cobertura de testes completa para todas as funcionalidades**, expandindo tanto os testes unitários quanto os de integração para garantir a estabilidade e a correção do sistema. Além disso, é necessário desenvolver **testes de integração abrangentes** que cubram os fluxos completos entre frontend e backend. Por fim, a implementação de **testes E2E (End-to-End) para os fluxos principais da aplicação** é crucial para validar a experiência do usuário de ponta a ponta, simulando interações reais e assegurando que o sistema funcione conforme o esperado em cenários de uso típicos.

## 6. Status Geral do Projeto

*   **Backend**: A estrutura do backend está completa, mas ainda enfrenta desafios relacionados a problemas de build e tipagem que precisam ser resolvidos para garantir a estabilidade.
*   **Frontend**: O frontend possui uma estrutura robusta e completa, com versões otimizadas de telas e componentes, focando na experiência do usuário e responsividade.
*   **Banco de Dados**: A configuração do banco de dados tem sido uma área de atenção devido a inconsistências de schema, que estão sendo gradualmente abordadas para garantir a integridade dos dados.
*   **Deploy**: O processo de deploy ainda não foi totalmente testado ou otimizado devido aos problemas técnicos e de configuração identificados, sendo uma prioridade para futuras etapas.

Este documento será atualizado conforme o projeto evolui e novas funcionalidades são implementadas ou refinadas.

