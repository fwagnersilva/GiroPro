## Prompts para Agentes de Automação

### 1. Introdução

Este documento detalha os prompts e as diretrizes para a criação e configuração dos agentes de automação. Prompts bem definidos são cruciais para garantir que os agentes executem suas tarefas de forma autônoma e eficiente.

### 2. Estrutura de um Prompt

Cada prompt deve conter os seguintes elementos:

*   **Objetivo:** Descrição clara e concisa da tarefa que o agente deve realizar.
*   **Contexto:** Informações relevantes sobre o ambiente, sistemas externos ou dados necessários para a execução da tarefa.
*   **Entradas:** Quais dados o agente receberá para iniciar a tarefa.
*   **Saídas Esperadas:** O formato e o conteúdo dos resultados que o agente deve produzir.
*   **Restrições/Regras:** Quaisquer limitações, condições ou regras de negócio que o agente deve seguir.
*   **Exemplos (Opcional):** Exemplos de entradas e saídas para ilustrar o comportamento esperado.

### 3. Exemplos de Prompts

#### Exemplo 1: Agente de Coleta de Dados de E-commerce

*   **Objetivo:** Coletar informações de produtos (nome, preço, descrição, URL da imagem) de uma lista de URLs de produtos de e-commerce.
*   **Contexto:** O agente terá acesso a uma API de scraping ou a um navegador headless (Selenium/Puppeteer) para navegar pelas páginas.
*   **Entradas:** Uma lista de URLs de produtos.
*   **Saídas Esperadas:** Um arquivo JSON contendo uma lista de objetos, onde cada objeto representa um produto com os campos `nome`, `preco`, `descricao`, `url_imagem`.
*   **Restrições/Regras:**
    *   Ignorar produtos fora de estoque.
    *   Lidar com diferentes estruturas de HTML de páginas de produtos.
    *   Limitar a taxa de requisições para evitar bloqueio.

#### Exemplo 2: Agente de Geração de Relatórios Diários

*   **Objetivo:** Gerar um relatório diário de vendas consolidando dados de diferentes fontes e enviá-lo por e-mail.
*   **Contexto:** O agente terá acesso ao banco de dados de vendas e a um serviço de e-mail.
*   **Entradas:** Data de referência para o relatório (ex: `YYYY-MM-DD`).
*   **Saídas Esperadas:** Um arquivo PDF com o relatório de vendas e um e-mail enviado para `gerencia@empresa.com` com o relatório anexado.
*   **Restrições/Regras:**
    *   O relatório deve incluir vendas totais, vendas por categoria e os 5 produtos mais vendidos.
    *   O e-mail deve ter o assunto 

