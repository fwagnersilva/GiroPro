# Gerenciamento de Plataformas - Frontend

## Visão Geral

A interface de gerenciamento de plataformas permite que os usuários configurem as plataformas de trabalho (como Uber, 99, etc.) que utilizam para registrar o faturamento de suas jornadas. Esta funcionalidade está integrada à seção de **Configurações** do sistema e permite ativar/desativar plataformas predefinidas e criar/gerenciar plataformas customizadas.

## Localização na Interface

A funcionalidade está acessível através de:

**Navegação:** Configurações → Plataformas

**URL:** `/configuracoes/plataformas`

## Funcionalidades e Interações

### Listagem de Plataformas

A tela principal exibe uma lista de todas as plataformas do usuário, com as seguintes características:

*   **Plataformas Predefinidas (Uber, 99):** São exibidas com um ícone de cadeado, indicando que seus nomes não podem ser alterados e não podem ser excluídas. Podem ser ativadas ou desativadas.
*   **Plataformas Customizadas:** Podem ser criadas, editadas (nome e status de ativação) e excluídas pelo usuário.
*   **Status:** Cada plataforma exibe seu status (Ativa/Inativa), que pode ser alternado.

### Adição e Edição de Plataformas

Um modal unificado é utilizado para adicionar novas plataformas customizadas ou editar plataformas existentes. As regras de negócio aplicadas são:

*   **Nome da Plataforma:** Campo obrigatório, com validação de unicidade por usuário e limite de caracteres (1 a 100).
*   **Ativação:** Um checkbox permite definir se a plataforma estará ativa ou inativa.
*   **Restrições para Predefinidas:** Ao editar uma plataforma predefinida, o campo de nome é desabilitado e o botão de exclusão não é exibido.

### Exclusão de Plataformas

*   Apenas plataformas customizadas podem ser excluídas.
*   Um modal de confirmação é exibido antes da exclusão para prevenir ações acidentais.

## Integração com Jornadas

### Finalização de Jornada - Faturamento por Plataforma

Ao finalizar uma jornada, o formulário de registro de faturamento exibe apenas as plataformas que estão **ativas** para o usuário. Isso garante que o motorista possa registrar os ganhos apenas nas plataformas que realmente utiliza no momento.

## Considerações Técnicas

### Gerenciamento de Estado

O estado das plataformas é gerenciado localmente no componente, utilizando um objeto `PlatformState` que inclui a lista de plataformas, status de carregamento e visibilidade dos modais. As operações de CRUD (Create, Read, Update, Delete) são realizadas através de chamadas à API do backend.

### Validações de Frontend

Validações em tempo real são implementadas para o nome da plataforma (obrigatório, unicidade, comprimento) para fornecer feedback imediato ao usuário e melhorar a experiência. As restrições para plataformas predefinidas (nome não editável, não excluível) são aplicadas na interface.

### Feedback Visual

O sistema oferece feedback visual claro para as interações do usuário:

*   **Estados de Carregamento:** Indicadores visuais (e.g., spinners, skeleton loading) são exibidos durante o carregamento de dados e a execução de operações para informar o usuário sobre o progresso.
*   **Notificações:** Mensagens de sucesso e erro (e.g., toasts) são exibidas para confirmar ações ou informar sobre falhas.
*   **Estados Vazios:** Mensagens explicativas são mostradas quando não há plataformas cadastradas, incentivando o usuário a adicionar a primeira.

## Acessibilidade e Responsividade

A interface foi projetada com foco em acessibilidade, garantindo navegação por teclado, compatibilidade com leitores de tela e contraste adequado. A responsividade é garantida através de layouts adaptativos para diferentes tamanhos de tela (desktop, tablet, mobile), otimizando a experiência do usuário em qualquer dispositivo.

---

**Última atualização**: 01/10/2025
**Versão**: 1.1

