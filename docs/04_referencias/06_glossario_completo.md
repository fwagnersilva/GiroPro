# Glossário de Termos do GiroPro

Este glossário expande os termos técnicos e de negócio utilizados no projeto GiroPro, incluindo definições detalhadas e contexto específico do projeto.

## Termos Técnicos

-   **API (Application Programming Interface):** Conjunto de regras e definições que permite que diferentes softwares se comuniquem entre si, facilitando a interação entre o frontend e o backend do GiroPro.

-   **Backend:** A parte do sistema GiroPro que lida com a lógica de negócio, banco de dados (SQLite/PostgreSQL) e comunicação com o servidor (Express.js/Node.js). Não é diretamente visível para o usuário final.

-   **CamelCase:** Convenção de nomenclatura onde a primeira letra da primeira palavra é minúscula e a primeira letra de cada palavra subsequente é maiúscula (ex: `nomeUsuario`, `dataCadastro`). Utilizada em várias partes do código do GiroPro.

-   **CI/CD (Continuous Integration/Continuous Delivery):** Práticas de desenvolvimento de software que visam automatizar e agilizar as etapas de integração, teste e entrega de código, garantindo a qualidade e a agilidade no desenvolvimento do GiroPro.

-   **CORS (Cross-Origin Resource Sharing):** Mecanismo que permite que recursos de uma página web sejam requisitados a partir de outro domínio fora do domínio original que serviu o primeiro recurso. Essencial para a comunicação segura entre o frontend e o backend do GiroPro.

-   **CSRF (Cross-Site Request Forgery):** Tipo de ataque malicioso que engana um usuário autenticado a enviar uma requisição não intencional a um servidor web. O GiroPro implementa medidas de segurança para mitigar esse tipo de ataque.

-   **DBML (Database Markup Language):** Linguagem de marcação simples e de código aberto para definir esquemas de banco de dados, facilitando a visualização e colaboração. Pode ser utilizada para documentar o schema do GiroPro.

-   **Deploy:** Processo de disponibilizar uma aplicação (GiroPro) para uso em um ambiente de produção ou teste.

-   **Docker:** Plataforma que permite empacotar, distribuir e executar aplicações em ambientes isolados (contêineres). Utilizado no GiroPro para garantir ambientes de desenvolvimento e produção consistentes.

-   **Drizzle ORM:** ORM (Object-Relational Mapper) moderno e leve para TypeScript, que permite interagir com bancos de dados usando sintaxe TypeScript/JavaScript. Utilizado no backend do GiroPro para gerenciar as interações com o banco de dados.

-   **E2E (End-to-End Testing):** Tipo de teste que simula o fluxo completo de um usuário na aplicação, desde a interface até o banco de dados. Fundamental para garantir que todas as funcionalidades do GiroPro operem corretamente.

-   **Express.js:** Framework web minimalista e flexível para Node.js, amplamente utilizado para construir APIs RESTful. É a base do backend do GiroPro.

-   **Frontend:** A parte do sistema GiroPro com a qual o usuário interage diretamente, incluindo a interface gráfica e a experiência do usuário. Desenvolvido com React Native/Expo.

-   **HTTPS (Hypertext Transfer Protocol Secure):** Versão segura do HTTP, que utiliza criptografia para proteger a comunicação entre o navegador e o servidor. Essencial para a segurança das informações no GiroPro.

-   **JWT (JSON Web Token):** Padrão aberto para a criação de tokens de acesso que permitem a autenticação e troca segura de informações entre partes. Utilizado no GiroPro para autenticação de usuários.

-   **Migração de Banco de Dados:** Processo de aplicar alterações estruturais ao esquema de um banco de dados de forma controlada e versionada. O GiroPro utiliza migrações para gerenciar as evoluções do seu esquema de banco de dados.

-   **Node.js:** Ambiente de tempo de execução JavaScript de código aberto e multiplataforma para o desenvolvimento de aplicações de rede e backend. Utilizado no backend do GiroPro.

-   **NPM (Node Package Manager):** Gerenciador de pacotes padrão para o Node.js, utilizado para instalar e gerenciar bibliotecas e dependências no projeto GiroPro.

-   **ORM (Object-Relational Mapper):** Ferramenta que permite aos desenvolvedores interagir com bancos de dados usando objetos de uma linguagem de programação, em vez de SQL puro. O Drizzle ORM é o ORM utilizado no GiroPro.

-   **PM2:** Gerenciador de processos para aplicações Node.js em produção, que oferece recursos como balanceamento de carga, reinício automático e monitoramento. Pode ser utilizado para gerenciar o backend do GiroPro em produção.

-   **React Native:** Framework de código aberto para o desenvolvimento de aplicações móveis nativas usando JavaScript e React. É a tecnologia principal do frontend do GiroPro.

-   **RESTful API:** Estilo de arquitetura para sistemas distribuídos que utiliza o protocolo HTTP para a comunicação entre cliente e servidor. A comunicação entre o frontend e o backend do GiroPro é feita via API RESTful.

-   **Schema (Banco de Dados):** A estrutura lógica de um banco de dados, incluindo tabelas, colunas, tipos de dados, relacionamentos e restrições. Definido no arquivo `backend/src/db/schema.ts` do GiroPro.

-   **Snake_case:** Convenção de nomenclatura onde as palavras são separadas por underscores e todas as letras são minúsculas (ex: `nome_usuario`, `data_cadastro`). Utilizada em algumas partes do código do GiroPro, especialmente em nomes de colunas de banco de dados.

-   **SQLite:** Biblioteca de software que implementa um sistema de gerenciamento de banco de dados relacional leve, autônomo e sem servidor. Utilizado no GiroPro para desenvolvimento local e testes.

-   **TypeScript:** Superset do JavaScript que adiciona tipagem estática opcional, melhorando a robustez e manutenibilidade do código. Utilizado em todo o stack do GiroPro (frontend e backend).

-   **XSS (Cross-Site Scripting):** Tipo de ataque de injeção que permite a execução de scripts maliciosos no navegador de um usuário, geralmente através de dados não validados. O GiroPro implementa medidas de segurança para prevenir ataques XSS.

-   **Full-stack:** Desenvolvimento que abrange tanto o frontend (interface do usuário) quanto o backend (lógica de servidor e banco de dados) de uma aplicação. O GiroPro é uma aplicação full-stack.

-   **Microsserviços Lógicos:** Abordagem arquitetural onde uma aplicação é estruturada como uma coleção de serviços pequenos, independentes e fracamente acoplados, cada um responsável por uma funcionalidade específica. O GiroPro segue um modelo de microsserviços lógicos.

-   **JSON (JavaScript Object Notation):** Formato leve de intercâmbio de dados, fácil para humanos lerem e escreverem, e para máquinas analisarem e gerarem. Utilizado para a troca de dados entre o frontend e o backend do GiroPro.

-   **Expo:** Framework e plataforma para desenvolvimento de aplicações universais React Native, que simplifica o processo de construção, teste e implantação. Utilizado no frontend do GiroPro.

-   **PostgreSQL:** Sistema de gerenciamento de banco de dados objeto-relacional de código aberto, conhecido por sua robustez, recursos avançados e conformidade com padrões SQL. É a escolha de banco de dados para ambientes de produção do GiroPro.

-   **Redis:** Um armazenamento de estrutura de dados em memória, usado como banco de dados, cache e intermediário de mensagens. Utilizado no GiroPro para armazenar dados frequentemente acessados e melhorar o desempenho.

-   **Middleware:** Software que atua como uma ponte entre um sistema operacional ou banco de dados e aplicações, permitindo que eles interajam. No contexto web do GiroPro, são funções que processam requisições antes de chegarem à rota final.

-   **React Query:** Biblioteca para React que facilita a busca, cache, sincronização e atualização de dados assíncronos em aplicações web. Pode ser utilizada no frontend do GiroPro para gerenciamento de estado de dados.

-   **MVC Lógico (Model-View-Controller):** Padrão de arquitetura de software que separa a lógica de negócio (Model), a apresentação (View) e o controle de interação do usuário (Controller). O backend do GiroPro segue um padrão MVC lógico.

-   **ENUMs Tipados:** Conjuntos de constantes nomeadas que permitem definir um tipo com um conjunto finito de valores, garantindo a segurança de tipo em linguagens como TypeScript. Amplamente utilizados no `schema.ts` do GiroPro para garantir a consistência dos dados.

-   **Schema.ts:** Arquivo TypeScript que define a estrutura do banco de dados (schemas) e os tipos de dados, frequentemente usado com ORMs como Drizzle. É o arquivo central para a definição do modelo de dados do GiroPro.

-   **sqliteTable:** Função ou construtor em bibliotecas como Drizzle ORM para definir uma tabela SQLite no código TypeScript. Utilizado no `schema.ts` do GiroPro.

-   **crypto.randomUUID():** Função JavaScript que gera um identificador universalmente único (UUID) criptograficamente forte. Utilizado no GiroPro para gerar IDs únicos para registros no banco de dados.

-   **Unix Epoch:** O número de segundos que se passaram desde 00:00:00 UTC de 1º de janeiro de 1970 (o "Epoch"), usado para representar datas e horas. Utilizado no GiroPro para armazenar timestamps no banco de dados.

-   **Soft Delete:** Estratégia de exclusão de dados onde os registros não são removidos fisicamente do banco de dados, mas marcados como inativos ou excluídos (geralmente com um campo `deletedAt`). Implementado no GiroPro para permitir recuperação e histórico de dados.

-   **onDelete: "cascade":** Uma restrição de chave estrangeira em bancos de dados que, ao excluir um registro na tabela pai, automaticamente exclui todos os registros relacionados na tabela filha. Utilizado no GiroPro para manter a integridade referencial.

-   **onDelete: "set null":** Uma restrição de chave estrangeira em bancos de dados que, ao excluir um registro na tabela pai, define os valores da chave estrangeira correspondente na tabela filha como NULL. Utilizado no GiroPro para gerenciar relacionamentos opcionais.

-   **REAL (Tipo de Dado):** Tipo de dado numérico em bancos de dados usado para armazenar números de ponto flutuante, que podem ter casas decimais. Utilizado no GiroPro para campos como `mediaConsumo` e `quantidadeLitros`.

-   **UUID (Universally Unique Identifier):** Um número de 128 bits usado para identificar informações em sistemas de computador. É projetado para ser único em todos os sistemas e em todos os momentos. Amplamente utilizado como chave primária no GiroPro.

-   **Timestamp:** Um valor que indica o momento em que um determinado evento ocorreu, geralmente expresso como o número de segundos ou milissegundos desde o Unix Epoch. Utilizado no GiroPro para registrar datas de criação, atualização e exclusão.

## Termos de Negócio

-   **Gamificação:** Aplicação de elementos e técnicas de design de jogos (como pontos, níveis e conquistas) em contextos não relacionados a jogos para engajar e motivar usuários a atingir objetivos. O GiroPro incorpora gamificação para incentivar o uso e a produtividade dos motoristas.

-   **Autenticação:** Processo de verificar a identidade de um usuário, geralmente através de credenciais como nome de usuário e senha. No GiroPro, garante que apenas usuários legítimos acessem suas contas.

-   **Autorização:** Processo de determinar quais permissões um usuário autenticado tem para acessar recursos ou realizar ações dentro do sistema. No GiroPro, define o que cada usuário pode fazer após a autenticação.

-   **Faturamento:** O valor total das vendas ou receitas geradas por um motorista em um determinado período. Uma métrica chave acompanhada no GiroPro.

-   **Quilometragem:** A distância total percorrida por um veículo, usada para calcular custos de combustível, manutenção e desgaste. Essencial para o cálculo de despesas e ganhos no GiroPro.

-   **Jornadas:** No contexto de motoristas de aplicativo, refere-se às viagens ou corridas realizadas, incluindo informações como início, fim, distância e ganhos. O GiroPro permite o registro detalhado de cada jornada.

-   **Economia:** Redução de custos ou otimização de recursos, como economia de combustível ou despesas. O GiroPro oferece ferramentas para ajudar os motoristas a identificar oportunidades de economia.

-   **Lucro:** O ganho financeiro obtido após a dedução de todas as despesas das receitas. O GiroPro calcula o lucro líquido para os motoristas.

-   **Semanal:** Relacionado a um período de uma semana. Utilizado para relatórios e metas no GiroPro.

-   **Mensal:** Relacionado a um período de um mês. Utilizado para relatórios e metas no GiroPro.

-   **Trimestral:** Relacionado a um período de três meses. Utilizado para relatórios e metas no GiroPro.

-   **Anual:** Relacionado a um período de um ano. Utilizado para relatórios e metas no GiroPro.

-   **Ativo (Status de Conta/Meta):** Indica que uma conta de usuário ou meta está em pleno funcionamento e disponível no GiroPro.

-   **Inativo (Status de Conta):** Indica que uma conta de usuário não está mais em uso ou foi desativada temporariamente no GiroPro.

-   **Suspenso (Status de Conta):** Indica que uma conta de usuário foi temporariamente bloqueada devido a alguma violação ou problema no GiroPro.

-   **Pausada (Status de Meta):** Indica que o progresso de uma meta foi temporariamente interrompido no GiroPro.

-   **Concluída (Status de Meta):** Indica que uma meta foi atingida com sucesso no GiroPro.

-   **Expirada (Status de Meta):** Indica que o prazo para atingir uma meta se esgotou sem que ela fosse concluída no GiroPro.

-   **Eficiência (Conquista):** Conquista relacionada à otimização de recursos, como consumo de combustível, no sistema de gamificação do GiroPro.

-   **Consistência (Conquista):** Conquista relacionada à regularidade ou frequência de atividades, como o registro de jornadas, no sistema de gamificação do GiroPro.

-   **Metas (Conquista):** Conquista relacionada ao atingimento de objetivos definidos pelo motorista no GiroPro.

-   **Especial (Conquista):** Conquista rara ou única, geralmente associada a eventos ou marcos importantes no GiroPro.

-   **Comum (Raridade):** Nível de raridade mais frequente para conquistas no GiroPro.

-   **Raro (Raridade):** Nível de raridade intermediário para conquistas no GiroPro.

-   **Épico (Raridade):** Nível de raridade alto para conquistas no GiroPro.

-   **Lendário (Raridade):** Nível de raridade mais alto e difícil de obter para conquistas no GiroPro.

-   **Iniciante (Nível de Usuário):** Nível inicial para novos usuários no sistema de gamificação do GiroPro.

-   **Novato (Nível de Usuário):** Segundo nível de usuário, indicando algum progresso no GiroPro.

-   **Experiente (Nível de Usuário):** Nível intermediário de usuário no GiroPro.

-   **Motorista (Nível de Usuário):** Nível que reflete a experiência como motorista de aplicativo no GiroPro.

-   **Profissional (Nível de Usuário):** Nível avançado, indicando alta performance no GiroPro.

-   **Especialista (Nível de Usuário):** Nível muito avançado, com grande domínio no GiroPro.

-   **Mestre (Nível de Usuário):** Nível de excelência no sistema de gamificação do GiroPro.

-   **Lenda (Nível de Usuário):** Nível máximo, reservado para os usuários de maior destaque no GiroPro.

-   **Sistema (Notificação):** Notificação gerada automaticamente pelo sistema do GiroPro.

-   **Alerta (Notificação):** Notificação importante que requer atenção do usuário no GiroPro.

-   **Promoção (Notificação):** Notificação sobre ofertas ou campanhas no GiroPro.

-   **Suporte (Notificação):** Notificação relacionada a assistência ou atendimento ao cliente no GiroPro.

-   **Login:** O ato de um usuário acessar o sistema GiroPro com suas credenciais.

-   **Cadastro:** O processo de um novo usuário criar uma conta no sistema GiroPro.

-   **Atualização:** O ato de modificar ou melhorar informações ou funcionalidades existentes no GiroPro.

-   **API de Mapas:** Serviço de interface de programação de aplicações que fornece dados e funcionalidades relacionadas a mapas (ex: Google Maps API). Pode ser uma integração futura no GiroPro.

-   **Serviços de Pagamento:** Plataformas ou sistemas que processam transações financeiras, permitindo pagamentos e recebimentos. Pode ser uma integração futura no GiroPro.

-   **Plataformas de Notificação:** Serviços que permitem o envio de mensagens e alertas para usuários através de diferentes canais (ex: push notifications, SMS). Utilizado no GiroPro para enviar notificações aos motoristas.

-   **ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis):** Órgão regulador brasileiro responsável pela fiscalização e regulação das atividades da indústria de petróleo, gás natural e biocombustíveis no Brasil. Frequentemente fonte de dados de preços de combustível, que podem ser utilizados no GiroPro.

-   **Resumo Financeiro:** Seção do dashboard do GiroPro que apresenta um compilado das informações financeiras do motorista, como ganho total, gasto total e lucro líquido no mês.

-   **Estatísticas Veículo:** Seção do dashboard do GiroPro que exibe dados relacionados ao desempenho do veículo, como quilometragem total no mês, consumo médio e custo por km.

-   **Jornadas Recentes:** Seção do dashboard do GiroPro que lista as últimas viagens ou corridas registradas pelo motorista.

-   **RootStackParamList:** Tipo TypeScript utilizado no frontend do GiroPro (React Native) para definir os parâmetros de navegação entre as diferentes telas da aplicação, garantindo a segurança de tipo.

-   **ApiResponse:** Interface TypeScript genérica utilizada no frontend do GiroPro para padronizar as respostas recebidas da API do backend, incluindo status de sucesso, dados e informações de erro.

-   **LoginRequest:** Interface TypeScript que define a estrutura dos dados esperados para uma requisição de login no GiroPro, contendo campos como `email` e `senha`.

-   **RegisterRequest:** Interface TypeScript que define a estrutura dos dados esperados para uma requisição de registro de novo usuário no GiroPro, contendo campos como `nome`, `email` e `senha`.

-   **User:** Interface TypeScript que representa o modelo de dados de um usuário no frontend do GiroPro, incluindo `id`, `nome`, `email`, `status_conta` e `data_cadastro`.

-   **Vehicle:** Interface TypeScript que representa o modelo de dados de um veículo no frontend do GiroPro, incluindo `id`, `id_usuario`, `marca`, `modelo`, `ano`, `placa`, `tipo_combustivel`, `tipo_uso`, entre outros.

-   **Journey:** Interface TypeScript que representa o modelo de dados de uma jornada (viagem) no frontend do GiroPro, incluindo `id`, `id_usuario`, `id_veiculo`, `data_inicio`, `km_inicio`, entre outros.

-   **Fueling:** Interface TypeScript que representa o modelo de dados de um abastecimento no frontend do GiroPro, incluindo `id`, `id_usuario`, `id_veiculo`, `data_abastecimento`, `tipo_combustivel`, `quantidade_litros`, `valor_total`, entre outros.

-   **Expense:** Interface TypeScript que representa o modelo de dados de uma despesa no frontend do GiroPro, incluindo `id`, `id_usuario`, `data_despesa`, `tipo_despesa`, `valor_despesa`, entre outros.

-   **DashboardData:** Interface TypeScript que define a estrutura dos dados exibidos no dashboard do GiroPro, agregando `resumoFinanceiro`, `estatisticasVeiculo` e `jornadasRecentes`.


