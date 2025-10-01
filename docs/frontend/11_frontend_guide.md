# Guia de Desenvolvimento do Front-end do GiroPro

Este documento serve como a referência técnica principal para o desenvolvimento do front-end do GiroPro. Ele detalha o design system, os componentes reutilizáveis e os padrões de código que devem ser seguidos para garantir consistência, qualidade e escalabilidade.

## Padrões do Design System

O design system do GiroPro é construído sobre tokens de design que garantem uma experiência visual coesa e padronizada em toda a aplicação. A utilização desses tokens é fundamental para a manutenção e evolução do frontend.

### Cores (`enhancedTokens.colors`)

Nossa paleta de cores é definida para garantir acessibilidade e clareza visual:

*   **Primary**: `#359CF1` (azul principal)
*   **Secondary**: `#B592FF` (roxo complementar)
*   **Success**: `#42C17A` (verde acessível)
*   **Warning**: `#FFC72C` (amarelo contrastante)
*   **Error**: `#E53E3E` (vermelho acessível)
*   **Neutros**: 11 tons de cinza (`gray.0` a `gray.1000`) para flexibilidade em diferentes contextos.

### Tipografia (`enhancedTokens.typography`)

A tipografia é cuidadosamente definida para otimizar a legibilidade e a hierarquia visual:

*   **Tamanhos**: Escala de `xs` (12px) a `6xl` (60px).
*   **Pesos**: Variam de `light` (300) a `extrabold` (800).
*   **Altura de linha**: Ajustada para cada tamanho, de `xs` (16px) a `6xl` (72px).
*   **Espaçamento entre letras**: Controlado de `tighter` (-0.5) a `widest` (1) para melhor apresentação.

### Espaçamentos (`enhancedTokens.spacing`)

Um sistema de espaçamento consistente é aplicado para garantir alinhamento e clareza nos layouts:

*   **Sistema**: Baseado em múltiplos de 4px, de `0` (0px) a `96` (384px).
*   **Incrementos**: Inclui incrementos finos como `0.5` (2px), `1` (4px), `2` (8px), etc., para precisão no design.

## Componentes Interativos

O uso de componentes interativos reutilizáveis acelera o desenvolvimento e mantém a consistência da interface.

### InteractiveButton

Um botão versátil com diversas opções de estilo e comportamento:

*   **Variantes**: `primary`, `secondary`, `outline`, `ghost`, `destructive` para diferentes contextos de uso.
*   **Tamanhos**: `sm` (36px), `md` (48px), `lg` (56px) para adaptabilidade.
*   **Animações**: `scale`, `opacity`, `elevation` para feedback visual aprimorado.
*   **Feedback**: Háptico configurável para uma experiência tátil.
*   **Estados**: `pressed`, `disabled`, `loading` para indicar o status atual do botão.

**Exemplo de Uso:**

```jsx
// Código padronizado
<InteractiveButton
  variant="primary"
  size="md"
  onPress={handlePress}
>
  Confirmar Ação
</InteractiveButton>
```

### InteractiveCard

Componente de card flexível para agrupar conteúdo:

*   **Variantes**: `default`, `elevated`, `outlined` para diferentes níveis de destaque.
*   **Animações**: `scale`, `elevation` para interatividade.
*   **Estados**: `pressed`, `disabled` para controle de interação.
*   **Sombras**: Dinâmicas baseadas no estado para profundidade visual.

### InteractiveToggle

Um componente de toggle para ativar/desativar funcionalidades:

*   **Tamanhos**: `sm` (40x24px), `md` (50x30px), `lg` (60x36px) para diferentes densidades de informação.
*   **Animações**: Suaves com `spring` para uma transição fluida.
*   **Cores**: Customizáveis para integração com o tema.
*   **Feedback**: Háptico opcional para confirmação tátil.

## Validações e UX

### FormInput Melhorado

Um campo de entrada de formulário robusto com validações integradas e feedback visual:

*   **Validações**: `required`, `email`, `password`, `currency`, `plate` para garantir a integridade dos dados.
*   **Estados**: `focused`, `error`, `disabled` para feedback visual claro.
*   **Ícones**: `left`/`right` configuráveis para contextualização.
*   **Feedback**: Visual em tempo real para melhorar a experiência do usuário.
*   **Acessibilidade**: Contraste adequado para conformidade com padrões de acessibilidade.

### Validadores Disponíveis

O sistema de validação é modular e combinável:

*   **Validadores**: `validators.required`, `validators.email`, `validators.password`, `validators.positiveNumber`, `validators.currency`, `validators.plate`.
*   **Combinador**: `combineValidators(...validators)` permite criar cadeias de validação complexas.

**Exemplo de Uso:**

```javascript
import { validators, combineValidators } from './utils/validators';

const validate = combineValidators(
  validators.required,
  validators.email
);
```

## Ícones Vetoriais

A biblioteca de ícones é utilizada para garantir clareza e consistência visual em toda a aplicação.

### Ícones de Ação

*   **TrashIcon**: Representa exclusão, com feedback visual.
*   **PlusIcon**: Indica adição, frequentemente com um container destacado.
*   **TargetIcon**: Usado para metas e objetivos.

### Ícones de Tipo

*   **MoneyIcon**: Representa valores monetários.
*   **RoadIcon**: Indica quilometragem ou rotas.
*   **CarIcon**: Associado a veículos e jornadas.
*   **BulbIcon**: Usado para economia e ideias.
*   **ChartIcon**: Representa relatórios e análises.

### Ícones de Status

*   **CheckIcon**: Indica sucesso e conclusão.
*   **PauseIcon**: Representa um estado pausado ou em espera.
*   **CompleteIcon**: Usado para itens completados.
*   **ExpiredIcon**: Indica que algo expirou ou venceu.

### Ícones de Navegação

*   **HomeIcon**: Leva à tela inicial.
*   **HistoryIcon**: Acessa o histórico de atividades.
*   **AnalyticsIcon**: Direciona para análises e dados.
*   **SettingsIcon**: Abre as configurações da aplicação.

---

**Última atualização**: 01/10/2025
**Versão**: 1.1

