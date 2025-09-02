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
    *   [Dicionário de Dados (Schemas do Banco de Dados)](docs/04_referencias/01_dicionario_dados.md)
    *   [Documentação do Banco de Dados](docs/04_referencias/01_documentacao_banco_dados.md)
    *   [Glossário Completo](docs/04_referencias/06_glossario_completo.md)
    *   [Documentação de Testes](docs/04_referencias/02_documentacao_testes.md)
    *   [Documentação da API](docs/04_referencias/02_api_documentation.md)
    *   [API Endpoints](docs/04_referencias/02_api_endpoints.md)
    *   [Guia de Deploy](docs/04_referencias/03_guia_deploy.md)
    *   [Funcionalidades Implementadas](docs/04_referencias/05_funcionalidades_implementadas.md)

## Setup Rápido

Para configurar o ambiente de desenvolvimento, siga as instruções detalhadas no [Tutorial de Setup Inicial](docs/01_tutoriais/01_setup_completo.md).

## Contato

Para dúvidas ou contribuições, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

    *   [Segurança](docs/03_explicacoes/09_seguranca.md)
    *   [Requisitos do Sistema](docs/03_explicacoes/02_requisitos_do_sistema.md)
    *   [Documentação do Banco de Dados](docs/04_referencias/01_documentacao_banco_dados.md)
    *   [Documentação de Testes](docs/04_referencias/02_documentacao_testes.md)
    *   [Guia de Deploy](docs/04_referencias/03_guia_deploy.md)
    *   [Documentação de Segurança](docs/04_referencias/04_documentacao_seguranca.md)
    *   [Design System](docs/04_referencias/05_design_system.md)
    *   [Glossário Técnico](docs/04_referencias/06_glossario_tecnico.md)





## 🔐 Correções de Segurança

Este documento detalha as correções de segurança implementadas no projeto GiroPro para resolver vulnerabilidades de **Cross-site Scripting (XSS)** e **Information Exposure**.

### 1. Cross-site Scripting (XSS) - CWE-79

#### Descrição da Vulnerabilidade

A vulnerabilidade de XSS foi identificada nas funções de `downloadCSV` nos arquivos `frontend/src/components/WeeklyMonthlyReports.tsx` e `frontend/src/screens/ReportsScreen`.tsx`. O `filename` (nome do arquivo) que era usado para criar o link de download não estava sendo sanitizado, permitindo a injeção de código malicioso no DOM através do `document.body.appendChild`.

#### Correção Implementada

Para mitigar essa vulnerabilidade, foi criada uma função utilitária `escapeHtml` em `frontend/src/utils/security.ts`. Esta função é responsável por escapar caracteres HTML comuns, garantindo que qualquer entrada de usuário ou dados externos sejam renderizados como texto puro e não como código executável.

**Detalhes da Correção:**

1.  **Criação da função `escapeHtml`:**
    *   **Arquivo:** `frontend/src/utils/json`
    *   **Função:**
        ```typescript
        export const escapeHtml = (str: string) => {
          const div = document.createElement('div');
          div.appendChild(document.createTextNode(str));
          return div.innerHTML;
        };
        ```

2.  **Aplicação da função `escapeHtml`:**
    *   A função `escapeHtml` foi aplicada ao `filename` antes de ser atribuído ao `a.download` nas funções `downloadCSV` dos seguintes arquivos:
        *   `frontend/src/components/WeeklyMonthlyReports.tsx`
        *   `frontend/src/screens/ReportsScreen.tsx`

    *   **Exemplo de alteração (em ambos os arquivos):}$
        ```typescript
        // Antes:
        // a.download = filename;

        // Depois:
        a.download = escapeHtml(filename);
        ```

Esta correção garante que o nome do arquivo seja tratado como texto seguro, prevenindo a execução de scripts maliciosos.

### 2. Exposição de Informações (Information Exposure) - CWE-200

#### Descrição da Vulnerabilidade

A vulnerabilidade de Information Exposure foi identificada no arquivo `backend/src/app.ts`. O cabeçalho `X-Powered-By` estava sendo exposto nas respostas do servidor, revelando informações sobre o *framework* utilizado (Express). Esta informação pode ser útil para potenciais atacantes que buscam explorar vulnerabilidades conhecidas em versões específicas do *framework*.

#### Correção Implementada

Para resolver essa vulnerabilidade, o cabeçalho `X-Powered-By` foi desabilitado no servidor Express. Isso foi feito utilizando a biblioteca `helmet`, que ajuda a proteger aplicativos Express definindo vários cabeçalhos HTTP.

**Detalhe da Correção:**

1.  **Instalação da dependência `helmet`:**
    *   `npm install helmet` (no diretório `GiroPro/backend`)

2.  **Configuração do `helmet` no `app.js`:**
    *   **Arquivo:** `backend/src/app.ts`
    *   **Alterações:**
        ```typescript
        import helmet from 




## 🔐 Correções de Segurança

Este documento detalha as correções de segurança implementadas no projeto GiroPro para resolver vulnerabilidades de **Cross-site Scripting (XSS)** e **Information Exposure**.

### 1. Cross-site Scripting (XSS) - CWE-79

#### Descrição da Vulnerabilidade

A vulnerabilidade de XSS foi identificada nas funções de `downloadCSV` nos arquivos `frontend/src/components/WeeklyMonthlyReports.tsx` e `frontend/src/screens/ReportsScreen`.tsx`. O `filename` (nome do arquivo) que era usado para criar o link de download não estava sendo sanitizado, permitindo a injeção de código malicioso no DOM através do `document.body.appendChild`.

#### Correção Implementada

Para mitigar essa vulnerabilidade, foi criada uma função auxiliar `escapeHtml` em `frontend/src/utils/security.md`. Esta função é responsável por escapar caracteres HTML comuns, garantindo que qualquer entrada de usuário ou dados externos sejam renderizados como texto puro e não como código executável.

**Detalhes da Correção:**

1.  **Criação da função `escapeHtml`:**
    *   **Arquivo:** `frontend/src/utils/security.ts`
    *   **Função:**
        ```typescript
        export const escapeHtml = (str: string) => {
          const div = document.createElement("div");
          div.appendChild(document.createTextNode(str));
          return div.innerHTML;
        };
        ```

2.  **Aplicação da função `escapeHtml`:**
    *   A função `escapeHtml` foi aplicada ao `filename` antes de ser atribuído ao `a.download` nas funções `downloadCSV` dos seguintes arquivos:
        *   `frontend/src/components/WeeklyMonthlyReports.tsx`
        *   `frontend/src/screens/ReportsScreen`

    *   **Exemplo de alteração (em ambos os arquivos):**
        ```typescript
        // Antes:
        // a.download = filename;

        // Depois:
        a.download = escapeHtml(filename);
        ```

Esta correção garante que o nome do arquivo seja tratado como texto seguro, prevenindo a execução de scripts maliciosos.

### 2. Exposição de Informações (Information Exposure) - CWE-200

#### Descrição da Vulnerabilidade

A vulnerabilidade de Information Exposure foi identificada no arquivo `backend/src/app.ts`. O cabeçalho `X-Powered-By` estava sendo exposto nas respostas do servidor, revelando informações sobre o *framework* utilizado (Express). Esta informação pode ser útil para potenciais atacantes que buscam explorar vulnerabilidades conhecidas em versões específicas do *framework*.

#### Correção Implementada

Para resolver essa vulnerabilidade, o cabeçalho `X-Powered-By` foi desabilitado no servidor Express. Isso foi feito utilizando a biblioteca `helmet`, que ajuda a proteger aplicativos Express definindo vários cabeçalhos HTTP.

**Detalhe da Correção:**

1.  **Instalação da dependência `helmet`:**
    *   `npm install helmet` (no diretório `GiroPro/backend`)

2.  **Configuração do `helmet` no `app.js`:**
    *   **Arquivo:** `backend/src/app.ts`
    *   **Alterações:**
        ```typescript
        import helmet from 'helmet';
        // ... outras importações

        const app = express();
        // ... outras configurações

        // Middlewares
        app.use(helmet()); // Use Helmet para segurança
        app.disable('x-powered-by'); // Desabilita o cabeçalho X-Powered-By`
        app.use(cors({
          // ... outras configurações CORS
        }));
        ```

Esta correção impede que o servidor revele informações desnecessárias sobre seu ambiente, reduzindo a superfície de ataque para potenciais invasores.

## Próximos Passos

Recomenda-se que o código corrigido seja revisado e testado minuindo. para garantir que as vulnerabilidades foram efetivamente mitigadas e que nenhuma nova regressão foi introduz


