GiroPro: Gestão Financeira para Motoristas de Aplicativo

Visão Geral

O GiroPro é um aplicativo móvel inovador projetado para auxiliar motoristas de aplicativo a gerenciar suas finanças de forma eficiente. Com foco na simplicidade e usabilidade, o aplicativo permite o registro detalhado de jornadas, controle de despesas, acompanhamento de abastecimentos e visualização de métricas financeiras essenciais para otimizar a lucratividade e a produtividade.

Objetivo do Aplicativo

Capacitar motoristas de aplicativo com ferramentas intuitivas para:

•
Controlar Ganhos e Despesas: Tenha uma visão clara do seu faturamento e para onde seu dinheiro está indo.

•
Otimizar a Produtividade: Monitore o desempenho de suas jornadas e identifique oportunidades de melhoria.

•
Tomar Decisões Financeiras Inteligentes: Acesse relatórios e análises que o ajudarão a maximizar seus lucros.

Tecnologias Utilizadas

CategoriaTecnologiaVersão (Sug.)DescriçãoStatusLink OficialFrontendReact Native^0.73.0Framework para desenvolvimento de aplicativos móveis multiplataforma.EssencialReact Native
TypeScript^5.0.0Superset do JavaScript que adiciona tipagem estática.EssencialTypeScript
Tailwind CSS^3.0.0Framework CSS utilitário para estilização rápida e responsiva.EssencialTailwind CSS
TanStack Query^5.0.0Biblioteca para gerenciamento de estado de servidor e cache de dados.EssencialTanStack Query
React Hook Form^7.0.0Biblioteca para gerenciamento de formulários com validação.EssencialReact Hook Form
Zod^3.0.0Biblioteca para validação de schemas.EssencialZod
Radix UI / shadcn/uiN/AComponentes de UI acessíveis e personalizáveis.EssencialRadix UI / shadcn/uiBackendNode.js^20.0.0Ambiente de execução JavaScript assíncrono e orientado a eventos.EssencialNode.js
Express.js^4.18.0Framework web minimalista e flexível para Node.js.EssencialExpress.js
TypeScript^5.0.0Superset do JavaScript que adiciona tipagem estática.EssencialTypeScript
Drizzle ORM^0.29.0ORM TypeScript para bancos de dados relacionais.EssencialDrizzle ORM
Zod^3.0.0Biblioteca para validação de schemas.EssencialZod
bcrypt^5.1.0Biblioteca para hash de senhas.Essencialbcrypt
jsonwebtoken^9.0.0Implementação de JSON Web Tokens para autenticação.EssencialjsonwebtokenBanco de DadosPostgreSQL^16.0Sistema de gerenciamento de banco de dados relacional robusto e de código aberto.EssencialPostgreSQLFerramentasGitN/ASistema de controle de versão distribuído.EssencialGit
DockerN/APlataforma para desenvolver, enviar e executar aplicativos em contêineres.RecomendadoDocker
ESLint^8.0.0Ferramenta de linting para identificar e reportar padrões em JavaScript/TypeScript.EssencialESLint
Prettier^3.0.0Formatador de código opinativo.EssencialPrettier

Estrutura de Pastas e Organização do Código

O projeto segue uma estrutura modular, separando o frontend (aplicativo móvel) do backend (API). Dentro de cada módulo, a organização visa clareza e manutenibilidade.

Plain Text


giropro/
├── backend/ # Código do servidor Node.js
│   ├── src/
│   │   ├── config/ # Configurações do ambiente, banco de dados, etc.
│   │   ├── controllers/ # Lógica de negócio e manipulação de requisições HTTP
│   │   ├── db/ # Configuração do Drizzle ORM e schemas do banco de dados
│   │   ├── middlewares/ # Funções intermediárias (autenticação, tratamento de erros)
│   │   ├── routes/ # Definição das rotas da API
│   │   ├── services/ # Lógica de negócio complexa e interação com o banco de dados
│   │   ├── utils/ # Funções utilitárias e helpers
│   │   └── app.ts # Ponto de entrada da aplicação Express
│   ├── tests/ # Testes unitários e de integração do backend
│   ├── .env.example # Exemplo de variáveis de ambiente
│   ├── package.json # Dependências e scripts do backend
│   └── tsconfig.json # Configuração do TypeScript para o backend
├── frontend/ # Código do aplicativo React Native
│   ├── src/
│   │   ├── assets/ # Imagens, ícones, fontes
│   │   ├── components/ # Componentes de UI reutilizáveis
│   │   ├── contexts/ # Contextos React para gerenciamento de estado global
│   │   ├── hooks/ # Hooks personalizados
│   │   ├── navigation/ # Configuração de navegação (React Navigation)
│   │   ├── screens/ # Telas principais do aplicativo
│   │   ├── services/ # Funções para comunicação com a API do backend
│   │   ├── utils/ # Funções utilitárias e helpers
│   │   └── App.tsx # Ponto de entrada do aplicativo React Native
│   ├── tests/ # Testes unitários e de integração do frontend
│   ├── .env.example # Exemplo de variáveis de ambiente
│   ├── app.json # Configuração do Expo/React Native
│   ├── package.json # Dependências e scripts do frontend
│   └── tsconfig.json # Configuração do TypeScript para o frontend
├── .gitignore # Arquivos e pastas a serem ignorados pelo Git
├── LICENSE # Licença do projeto
└── README.md # Este arquivo


Requisitos Técnicos

Para rodar o GiroPro localmente, você precisará ter instalado:

•
Node.js: Versão 20.x ou superior.

•
npm ou Yarn: Gerenciador de pacotes (geralmente vem com o Node.js).

•
PostgreSQL: Versão 16.x ou superior.

•
Git: Para clonar o repositório.

•
Expo CLI: Para o desenvolvimento do frontend React Native.

Instruções de Instalação e Uso

Siga os passos abaixo para configurar e rodar o projeto GiroPro em seu ambiente local.

1. Clonar o Repositório

Bash


git clone https://github.com/fwagnersilva/GiroPro.git
cd GiroPro


2. Configurar o Backend

Bash


cd backend
cp .env.example .env
# Edite o arquivo .env com suas configurações de banco de dados
npm install # ou yarn install
npm run migrate # Executa as migrações do banco de dados
npm run dev # Inicia o servidor backend


3. Configurar o Frontend

Bash


cd ../frontend
cp .env.example .env
# Edite o arquivo .env com a URL do seu backend (ex: EXPO_PUBLIC_API_URL=http://localhost:3000)
npm install # ou yarn install
npm start # Inicia o servidor de desenvolvimento do Expo


Após iniciar o servidor Expo, você pode escanear o QR code com o aplicativo Expo Go no seu celular ou rodar o aplicativo em um emulador/simulador.

Fluxo do Sistema (MVP - v0.1.0)

O fluxo inicial do sistema foca nas funcionalidades essenciais para o MVP, permitindo que o motorista registre suas jornadas e despesas básicas.

1.
Autenticação de Usuário: Cadastro e Login.

2.
Gerenciamento de Veículos: Cadastro de um veículo principal.

3.
Registro de Jornadas: Início e fim de jornada com registro de quilometragem e ganhos.

4.
Registro de Abastecimentos: Registro de abastecimentos com tipo de combustível, quantidade e valor.

5.
Registro de Despesas: Registro de despesas básicas (manutenção, pneus, seguro, outros).

6.
Dashboard Básico: Visualização de faturamento, despesas e lucro líquido do dia/período atual.

Detalhamento de APIs e Modelos de Dados

Para o detalhamento completo das APIs (endpoints, payloads, respostas) e a estrutura detalhada dos modelos de dados (schemas do banco de dados), consulte o arquivo docs/API_DATA_MODELS.md.

Regras de Negócio Implementadas (MVP - v0.1.0)

•
Jornada:

•
Uma jornada é iniciada com km_inicio e data_inicio.

•
Uma jornada é finalizada com km_fim e data_fim.

•
km_fim deve ser maior ou igual a km_inicio.

•
data_fim deve ser maior ou igual a data_inicio.

•
O ganho_bruto da jornada é informado pelo usuário.



•
Abastecimento:

•
Deve estar associado a um veículo e um usuário.

•
valor_litro e quantidade_litros devem ser valores positivos.



•
Despesa:

•
Deve estar associada a um usuário e, opcionalmente, a um veículo.

•
valor_despesa deve ser um valor positivo.



•
Cálculos Básicos (Dashboard):

•
Faturamento do Dia: Soma de ganho_bruto de todas as jornadas finalizadas no dia.

•
Gasto com Combustível do Dia: Soma de valor_total de todos os abastecimentos no dia.

•
Gasto com Despesas do Dia: Soma de valor_despesa de todas as despesas no dia.

•
Lucro Líquido do Dia: Faturamento do Dia - Gasto com Combustível do Dia - Gasto com Despesas do Dia.



Roadmap do Projeto

O desenvolvimento do GiroPro seguirá um roadmap baseado em versionamento semântico, priorizando a entrega de valor incremental e a estabilidade. As funcionalidades mais complexas serão introduzidas em versões futuras.

Para o roadmap detalhado por versão, incluindo funcionalidades futuras e pendências, consulte o arquivo docs/ROADMAP.md.

Como Contribuir

Se você deseja contribuir com o projeto GiroPro, por favor, leia nosso Guia de Contribuição.

Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

Contato

Para dúvidas ou suporte, entre em contato com fwagnersilva.

