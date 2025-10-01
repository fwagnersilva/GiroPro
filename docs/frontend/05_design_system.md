# Guia de Design System do Frontend

Este documento descreve o design system utilizado no frontend do GiroPro, garantindo consistência visual e de experiência do usuário em toda a aplicação.

## Princípios do Design System

Nosso design system é construído sobre os seguintes princípios:

*   **Consistência:** Elementos visuais e interativos são padronizados para criar uma experiência unificada.
*   **Reusabilidade:** Componentes são projetados para serem reutilizáveis, acelerando o desenvolvimento e reduzindo a duplicação de código.
*   **Acessibilidade:** O design system é construído com foco em acessibilidade, garantindo que a aplicação seja utilizável por todos.
*   **Flexibilidade:** Permite adaptação e extensão para novas funcionalidades e necessidades futuras.
*   **Clareza:** Diretrizes claras para o uso de cada componente e estilo.

## Componentes Visuais

### Cores

Definição da paleta de cores principal e secundária, incluindo cores para texto, fundo, ações primárias, secundárias, sucesso, erro e aviso.

*   **Primária:** #4CAF50 (Verde)
*   **Secundária:** #FFC107 (Amarelo)
*   **Neutras:** #FFFFFF (Branco), #F5F5F5 (Cinza Claro), #E0E0E0 (Cinza Médio), #9E9E9E (Cinza Escuro), #212121 (Preto)
*   **Feedback:** #4CAF50 (Sucesso), #F44336 (Erro), #FFEB3B (Aviso)

### Tipografia

Definição das fontes, tamanhos, pesos e alturas de linha para diferentes elementos textuais (títulos, subtítulos, corpo de texto, legendas).

*   **Fonte Principal:** Roboto (Sans-serif)
*   **Tamanhos:**
    *   `h1`: 24px
    *   `h2`: 20px
    *   `h3`: 18px
    *   `body`: 16px
    *   `caption`: 12px
*   **Pesos:** Regular (400), Medium (500), Bold (700)

### Ícones

Biblioteca de ícones utilizada e diretrizes para seu uso (tamanho, cor, espaçamento).

*   **Biblioteca:** Material Community Icons
*   **Tamanhos Padrão:** 16px, 24px, 32px
*   **Cores Padrão:** Baseadas na paleta de cores definida.

### Espaçamento

Definição de uma escala de espaçamento para margens, paddings e gaps entre elementos.

*   **Escala:** 4px, 8px, 16px, 24px, 32px, 48px

### Sombras e Elevação

Diretrizes para aplicação de sombras para indicar elevação e profundidade na interface.

## Componentes de UI

### Botões

Estilos para botões primários, secundários, de texto, com ícones, e seus estados (normal, hover, pressionado, desabilitado).

### Campos de Formulário

Estilos para inputs de texto, seletores, checkboxes, radio buttons, e validação de erro.

### Cards

Estrutura e estilos para cards, utilizados para agrupar informações relacionadas.

### Listas

Estilos para diferentes tipos de listas (simples, com ícones, com avatares).

### Navegação

Diretrizes para barras de navegação, abas e menus.

### Modais e Alertas

Estilos e comportamentos para modais, pop-ups e mensagens de alerta.

## Implementação

Os componentes do design system são implementados em React Native, utilizando styled-components ou folhas de estilo padrão para estilização. O objetivo é criar componentes reutilizáveis que encapsulem tanto a lógica quanto a apresentação.

## Manutenção e Evolução

O design system é um documento vivo e será atualizado conforme a evolução do produto e as necessidades dos usuários. Novas diretrizes e componentes serão adicionados, e os existentes serão revisados e aprimorados.

---

**Última atualização**: 01/10/2025
**Versão**: 1.1

