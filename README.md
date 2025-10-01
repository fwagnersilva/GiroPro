# GiroPro

Bem-vindo ao GiroPro! Este é um aplicativo de gestão financeira para motoristas de aplicativo.

Para informações detalhadas sobre o projeto, stack tecnológico, setup e muito mais, por favor, consulte a pasta `docs/`.

## Documentação Principal

Esta documentação está organizada de acordo com o framework Diátaxis, que categoriza os documentos com base em seu propósito:

*   **Tutoriais**: Guias passo a passo para aprender a usar o projeto.
*   **Guias de Como Fazer**: Instruções para resolver problemas específicos.
*   **Explicações**: Aprofundamento em tópicos para entender o projeto.
*   **Referências**: Informações técnicas e especificações.

### Índice da Documentação

*   **01. Tutoriais**
    *   [Setup Inicial do Ambiente de Desenvolvimento](docs/01_tutoriais/01_setup_completo.md)

*   **02. Guias de Como Fazer**
    *   [Como Testar os Scripts de Setup](docs/02_guias_como_fazer/01_testar_scripts_setup.md)
    *   [Como Realizar Migração de Banco de Dados](docs/02_guias_como_fazer/02_como_realizar_migracao_banco_dados.md)
    *   [Como Adicionar Nova API](docs/02_guias_como_fazer/03_como_adicionar_nova_api.md)
    *   [Como Criar Novo Componente Frontend](docs/02_guias_como_fazer/04_como_criar_novo_componente_frontend.md)
    *   [Como Resolver Erros de Compilação](docs/02_guias_como_fazer/05_como_resolver_erros_compilacao.md)
*   **03. Explicações**
    *   [Problemas Comuns e Lições Aprendidas](docs/03_explicacoes/00_problemas_comuns_e_licoes_aprendidas.md)
    *   [Arquitetura Geral do Sistema](docs/03_explicacoes/01_arquitetura_geral.md)
    *   [Tecnologias e Padrões](docs/03_explicacoes/04_tecnologias_padroes.md)
    *   [Fórmulas e Métricas Financeiras](docs/03_explicacoes/05_formulas_metricas_financeiras.md)
    *   [Estratégia de Precificação](docs/03_explicacoes/06_estrategia_precificacao.md)
    *   [Relatórios e Dashboards](docs/03_explicacoes/07_relatorios_e_dashboards.md)
    *   [Roadmap do Projeto](docs/03_explicacoes/08_roadmap_do_projeto.md)
    *   [Progresso do Projeto](docs/03_explicacoes/09_progresso.md)
    *   [Princípios Arquiteturais](docs/03_explicacoes/03_principios_arquiteturais.md)

*   **04. Referências**
    *   [Documentação e Dicionário de Dados (Schemas do Banco de Dados)](docs/04_referencias/01_documentacao_e_dicionario_de_dados.md)
    
    *   [Glossário](docs/04_referencias/06_glossario.md)
    *   [Documentação de Testes](docs/04_referencias/02_documentacao_testes.md)
    *   [Documentação da API](docs/04_referencias/02_api_documentation.md)
    
    *   [Guia de Deploy](docs/04_referencias/03_guia_deploy.md)
    *   [Funcionalidades Implementadas](docs/04_referencias/05_funcionalidades_implementadas.m

## Setup e Execução

Para configurar e executar o projeto GiroPro, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/fwagnersilva/GiroPro.git
    cd GiroPro
    ```

2.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example` fornecido. Este arquivo contém as configurações essenciais para o backend e frontend.
    ```bash
    cp .env.example .env
    ```
    Edite o arquivo `.env` com suas configurações específicas, como credenciais de banco de dados e chaves de API.

3.  **Configuração do Backend:**
    Navegue até o diretório `backend`, instale as dependências e inicie o servidor.
    ```bash
    cd backend
    pnpm install
    pnpm start
    ```

4.  **Configuração do Frontend:**
    Em um novo terminal, navegue até o diretório `frontend`, instale as dependências e inicie a aplicação.
    ```bash
    cd ../frontend
    pnpm install
    pnpm exec cross-env APP_ENV=development expo start --web
    ```

Agora o backend e o frontend estarão rodando e acessíveis em `http://localhost:3000` e `http://localhost:8081` (ou portas configuradas no `.env`), respectivamente.

