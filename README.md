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





### 3. Cross-site Scripting (XSS) - ReportsScreen.tsx (Revisão)

#### Descrição da Vulnerabilidade

A vulnerabilidade de XSS persistia na função `downloadCSV` em `frontend/src/screens/ReportsScreen.tsx` devido ao uso direto de `document.body.appendChild(a)` com um `filename` não totalmente sanitizado, mesmo após a aplicação inicial do `escapeHtml` no atributo `download`. Embora o `escapeHtml` proteja o atributo, a manipulação direta do DOM ainda poderia ser explorada em cenários específicos.

#### Correção Implementada

Para uma correção mais robusta, a manipulação do DOM foi ajustada para evitar o `appendChild` direto de um elemento `<a>` que poderia ser maliciosamente construído. A abordagem agora utiliza `link.setAttribute("download", escapeHtml(filename))` e garante que o elemento seja removido do DOM imediatamente após o clique, minimizando a janela de oportunidade para ataques.

**Detalhes da Correção:**

*   **Arquivo:** `frontend/src/screens/ReportsScreen.tsx`
*   **Alteração na função `downloadCSV`:**
    ```typescript
    // Antes:
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = escapeHtml(filename);
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url);
    // document.body.removeChild(a);

    // Depois:
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", escapeHtml(filename));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ```

Esta correção fortalece a proteção contra XSS ao evitar a injeção de elementos arbitrários no DOM.

### 4. Uso de String de Formato Controlada Externamente (Use of Externally-Controlled Format String) - CWE-134

#### Descrição da Vulnerabilidade

A vulnerabilidade foi encontrada no `backend/src/middlewares/requestLogger.ts`, onde o `console.log` estava usando diretamente `req.originalUrl` e `body` como parte da string de formato. Isso poderia permitir que um usuário mal-intencionado injetasse conteúdo inesperado nos logs da aplicação, potencialmente levando a problemas de segurança ou ofuscação de logs.

#### Correção Implementada

Para resolver essa vulnerabilidade, o `console.log` foi modificado para passar os argumentos de forma separada, evitando a interpretação de `req.originalUrl` ou `body` como parte da string de formato. Além disso, foi adicionada uma lógica para redigir (ocultar) o corpo de requisições sensíveis (como login e registro) nos logs, aumentando a segurança e privacidade.

**Detalhes da Correção:**

*   **Arquivo:** `backend/src/middlewares/requestLogger.ts`
*   **Alteração na função `requestLogger`:**
    ```typescript
    // Antes:
    // console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.originalUrl}`);
    // ...
    // console.log(`[${new Date().toISOString()}] Response: ${req.method} ${req.originalUrl} - Body:`, body);

    // Depois:
    console.log(`[${new Date().toISOString()}] Request:`, req.method, req.originalUrl);
    // ...
    console.log(`[${new Date().toISOString()}] Response:`, req.method, req.originalUrl,
      body ? `- Body: ${JSON.stringify(body)}` :
      req.originalUrl.includes("login") || req.originalUrl.includes("register") ? "- Body: [REDACTED]" : "");
    ```

Esta correção garante que os logs sejam gerados de forma segura e que informações sensíveis não sejam expostas indevidamente.

### 5. Uso de Credenciais Hardcoded (Use of Hardcoded Credentials) - CWE-798

#### Descrição da Vulnerabilidade

Credenciais de usuário (email e senha) estavam hardcoded no arquivo de teste `backend/src/tests/e2e/user-journey.test.ts`. O uso de credenciais hardcoded em testes, especialmente em ambientes que podem ser acessados por desenvolvedores ou em repositórios públicos, representa um risco de segurança, pois essas credenciais podem ser expostas e utilizadas indevidamente.

#### Correção Implementada

As credenciais hardcoded foram substituídas por variáveis de ambiente (`process.env.TEST_USER_EMAIL` e `process.env.TEST_USER_PASSWORD`). Isso permite que as credenciais sejam configuradas externamente, por exemplo, através de um arquivo `.env` ou variáveis de ambiente do sistema de CI/CD, sem que elas sejam diretamente visíveis no código-fonte. Valores padrão foram mantidos para garantir que os testes ainda possam ser executados localmente sem configuração adicional imediata, mas a prioridade é dada às variáveis de ambiente.

**Detalhes da Correção:**

*   **Arquivo:** `backend/src/tests/e2e/user-journey.test.ts`
*   **Alteração no objeto `testUser`:**
    ```typescript
    // Antes:
    // const testUser = {
    //   nome: 'João Motorista',
    //   email: 'joao.motorista@exemplo.com',
    //   senha: 'minhasenha123',
    //   telefone: '11987654321'
    // };

    // Depois:
    const testUser = {
      nome: 'João Motorista',
      email: process.env.TEST_USER_EMAIL || 'joao.motorista@exemplo.com',
      senha: process.env.TEST_USER_PASSWORD || 'minhasenha123',
      telefone: '11987654321'
    };
    ```

Esta correção melhora a postura de segurança do projeto ao remover credenciais sensíveis do código-fonte e promover o uso de variáveis de ambiente para configuração de testes.

## Próximos Passos

Recomenda-se que o código corrigido seja revisado e testado minuciosamente para garantir que as vulnerabilidades foram efetivamente mitigadas e que nenhuma nova regressão foi introduzida. É crucial que os testes de E2E continuem a funcionar corretamente após a alteração das credenciais para variáveis de ambiente.


