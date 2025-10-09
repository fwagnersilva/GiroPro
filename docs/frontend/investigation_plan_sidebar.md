# Plano de Investigação para o Problema do Menu Lateral (Sidebar)

## Contexto do Problema

O projeto GiroPro é um aplicativo multiplataforma que deve funcionar de forma nativa e otimizada em Web, Android e iOS. Foi solicitada a implementação de um menu de navegação lateral (sidebar) no frontend, conforme o exemplo visual fornecido. Após várias tentativas de implementação e depuração, o menu lateral não está sendo exibido corretamente na versão web da aplicação.

As tentativas incluíram:
1.  Criação de um componente `Sidebar.tsx` usando componentes React Native (`View`, `Text`, `TouchableOpacity`).
2.  Integração deste `Sidebar` no `AppRouter.tsx` dentro de um `DashboardLayout`.
3.  Criação de versões simplificadas (`SimpleSidebar.tsx`, `WebSidebar.tsx`) usando estilos inline e elementos HTML puros para isolar o problema.
4.  Integração direta do código do sidebar no componente `Dashboard.tsx`.

Todas as tentativas falharam em exibir o menu lateral na interface web, embora o usuário esteja autenticado e o conteúdo principal do dashboard seja renderizado. As verificações no console do navegador indicaram que o componente do sidebar não está sendo renderizado no DOM ou está sendo ocultado por algum motivo.

## Objetivo da Investigação

Diagnosticar a causa raiz da não renderização do menu lateral (sidebar) no frontend web do GiroPro e implementar uma solução funcional que seja compatível com a arquitetura multiplataforma do projeto.

## Plano de Ação Detalhado

### Fase 1: Análise do Ambiente e Configuração

1.  **Verificar Configuração do React Native Web:**
    *   Confirmar se o `react-native-web` está configurado corretamente no projeto (`babel.config.js`, `webpack.config.js` ou `vite.config.js`).
    *   Verificar se há aliases ou resoluções de módulos que possam estar causando conflitos.
    *   Assegurar que os componentes do React Native estão sendo transpilados e renderizados como elementos web adequados.
2.  **Revisar Dependências:**
    *   Verificar a versão das dependências relacionadas a UI e roteamento (`react-native`, `react-native-web`, `react-router-dom`, `@expo/vector-icons`).
    *   Procurar por incompatibilidades conhecidas entre as versões instaladas.
3.  **Analisar `App.tsx` e `AppRouter.tsx`:**
    *   Confirmar como o `AppRouter` é renderizado no `App.tsx` para a plataforma web.
    *   Verificar se o `DashboardLayout` ou qualquer outro componente pai está aplicando estilos que podem estar ocultando o sidebar (ex: `overflow: hidden`, `position: absolute` sem `z-index` adequado, `display: none`).

### Fase 2: Depuração de Renderização e Estilos

1.  **Inspeção Detalhada do DOM:**
    *   Utilizar as ferramentas de desenvolvedor do navegador para inspecionar o DOM da página `/dashboard`.
    *   Procurar por qualquer elemento que corresponda à estrutura do sidebar (mesmo que invisível).
    *   Verificar os estilos computados para esses elementos: `display`, `visibility`, `opacity`, `position`, `z-index`, `width`, `height`, `left`, `top`, `margin`, `padding`.
2.  **Verificação de Erros no Console:**
    *   Monitorar o console do navegador para quaisquer erros ou avisos relacionados à renderização de componentes, estilos ou React Native Web.
3.  **Teste de Renderização Condicional:**
    *   Adicionar um componente de teste simples (ex: um `Text` com uma mensagem "Sidebar Teste") no local onde o sidebar deveria ser renderizado para confirmar se o slot de renderização está ativo.
4.  **Isolamento de Estilos:**
    *   Remover temporariamente todos os estilos do sidebar, deixando apenas o conteúdo básico, para verificar se o problema é de layout ou de renderização.
    *   Aplicar estilos básicos (`backgroundColor`, `width`, `height`) diretamente no componente para ver se ele aparece.

### Fase 3: Proposta de Solução e Implementação

1.  **Reavaliar a Abordagem Multiplataforma para o Sidebar:**
    *   Considerar a criação de um componente de sidebar específico para web (`Sidebar.web.tsx`) que utilize elementos HTML/CSS padrão, se a complexidade do `react-native-web` para layout fixo for muito alta.
    *   Alternativamente, garantir que o `Sidebar.tsx` original esteja usando as propriedades de estilo do React Native Web de forma que sejam traduzidas corretamente para CSS web.
2.  **Ajustar Layout do `DashboardLayout`:**
    *   Implementar um layout robusto (ex: usando Flexbox ou Grid CSS) no `DashboardLayout` que acomode o sidebar fixo e o conteúdo principal, garantindo que o conteúdo principal tenha um `marginLeft` ou `paddingLeft` igual à largura do sidebar.
3.  **Testar Navegação:**
    *   Após a renderização do sidebar, testar a navegação entre todas as telas do menu para garantir que as rotas estão funcionando e o conteúdo é carregado corretamente.

## Critérios de Sucesso

*   O menu lateral (sidebar) é visível e funcional na versão web da aplicação GiroPro.
*   Os itens do menu são clicáveis e navegam para as telas corretas.
*   O layout geral da aplicação (sidebar + conteúdo principal) é responsivo e não apresenta sobreposições ou problemas visuais.
*   Não há erros ou avisos críticos no console do navegador relacionados à renderização do sidebar.
*   A solução implementada é consistente com as diretrizes multiplataforma do projeto, ou uma justificativa clara é fornecida para qualquer desvio.

## Informações Adicionais para o Agente

*   O repositório do projeto está em `GiroPro/`.
*   O frontend está em `GiroPro/frontend/`.
*   O `AppRouter.tsx` está em `GiroPro/frontend/src/components/AppRouter.tsx`.
*   O `Dashboard.tsx` está em `GiroPro/frontend/src/screens/Dashboard.tsx`.
*   O `backlog.md` foi atualizado para refletir o status pendente da tarefa do menu lateral.

Este plano deve fornecer um roteiro claro para o próximo agente investigar e resolver o problema do menu lateral.
