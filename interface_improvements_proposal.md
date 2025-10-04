# Proposta de Melhorias na Interface Web do GiroPro

## 1. Introdução

Este documento apresenta uma análise inicial da interface web do aplicativo GiroPro, com foco na usabilidade, limpeza, simplicidade e agilidade das jornadas de navegação entre os menus principais. O objetivo é identificar pontos de melhoria e propor soluções que otimizem a experiência do usuário.

## 2. Observações Atuais da Interface

Durante a exploração da aplicação web, as seguintes observações foram feitas:

### 2.1. Dashboard

*   **Ausência de Filtros de Período:** O dashboard atual não oferece opções para filtrar os dados por períodos específicos (ex: hoje, esta semana, este mês, personalizado). Isso dificulta a análise rápida e contextualizada das informações pelo usuário.

### 2.2. Navegação do Menu Lateral

*   **Menu 'Configurações' não Expansível:** Ao clicar no item 'Configurações' no menu lateral, o submenu esperado não se expande. Isso impede o acesso às opções de configuração e pode gerar frustração ao usuário.

### 2.3. Telas de Conteúdo (Jornadas, Abastecimentos, Despesas, Veículos)

*   As telas de conteúdo apresentam um layout básico, com um título e, em alguns casos, um indicador de carregamento ou uma mensagem de 

nenhum registro. A falta de conteúdo real ou de exemplos de dados dificulta a avaliação completa da usabilidade e da apresentação das informações.

## 3. Propostas de Melhoria

Com base nas observações acima, as seguintes melhorias são propostas:

### 3.1. Dashboard

*   **Implementar Filtros de Período:** Adicionar um componente de filtro no topo do dashboard, permitindo que o usuário selecione períodos pré-definidos (hoje, esta semana, este mês) e um intervalo de datas personalizado. Isso proporcionará uma visão mais dinâmica e útil dos dados.

### 3.2. Navegação do Menu Lateral

*   **Menu 'Configurações' como Tela Separada:** Em vez de um submenu expansível, o item 'Configurações' pode redirecionar para uma tela separada que apresente as demais funções. Isso simplifica a implementação e mantém a agilidade, garantindo que os usuários possam acessar e gerenciar as configurações da aplicação.

### 3.3. Telas de Conteúdo

*   **Popular com Dados de Exemplo:** Para facilitar a análise e o desenvolvimento, é recomendável popular as telas de conteúdo com dados de exemplo (mock data). Isso permitirá uma visualização mais realista da interface e ajudará a identificar possíveis problemas de layout e usabilidade.

## 4. Próximos Passos

1.  **Obter aprovação do cliente** para as melhorias propostas.
2.  **Implementar as melhorias** na interface web.
3.  **Testar e validar** as alterações.
4.  **Documentar as alterações** e reportar ao usuário.



## 5. Implementação das Melhorias

### 5.1. Dashboard - Filtros de Período

Foi criado um novo componente `PeriodFilter.tsx` em `src/components/` para gerenciar a seleção de períodos. Este componente foi integrado ao `app/(auth)/dashboard.tsx`, permitindo que o usuário selecione entre "Hoje", "Semana", "Mês" e "Personalizado". A seleção do período é gerenciada por um estado local no componente `Dashboard`, e a lógica para filtrar os dados com base no período selecionado pode ser adicionada posteriormente.

### 5.2. Navegação do Menu Lateral - Menu 'Configurações'

O componente `src/components/Sidebar.tsx` foi modificado para que o item "Configurações" não expanda um submenu, mas sim redirecione para a tela `app/(auth)/settings/index.tsx`. Esta tela foi atualizada para funcionar como um hub de configurações, apresentando links claros para "Perfil", "Estilo", "Veículos" e "Plataformas", conforme acordado. A navegação para essas sub-telas é feita através de `router.push()`.

## 6. Validação

As alterações foram validadas no ambiente web local (`http://localhost:8082`).

*   O filtro de período no dashboard funciona conforme o esperado, com os botões de seleção de período respondendo visualmente aos cliques.
*   O item "Configurações" no menu lateral agora navega para a tela de configurações principal, que exibe as opções de forma organizada.
*   A navegação para as sub-telas de configurações (Perfil, Estilo, Veículos, Plataformas) a partir da tela principal de configurações está funcional.

## 7. Próximos Passos

1.  **Integração de Dados:** Implementar a lógica de filtragem de dados no dashboard com base no período selecionado.
2.  **Popular Telas de Conteúdo:** Adicionar dados de exemplo ou integrar com APIs para popular as telas de Jornadas, Abastecimentos, Despesas e Veículos.
3.  **Testes Abrangentes:** Realizar testes de integração e unitários para as novas funcionalidades e garantir a estabilidade da aplicação.

