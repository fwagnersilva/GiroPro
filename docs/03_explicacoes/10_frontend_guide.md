Guia de Desenvolvimento do Front-end do GiroPro
Este documento serve como a referência técnica principal para o desenvolvimento do front-end do GiroPro. Ele detalha o design system, os componentes reutilizáveis e os padrões de código que devem ser seguidos para garantir consistência, qualidade e escalabilidade.

Padrões do Design System

Cores (enhancedTokens.colors)

* Primary: #359CF1 (azul principal)
* Secondary: #B592FF (roxo complementar)
* Success: #42C17A (verde acessível)
* Warning: #FFC72C (amarelo contrastante)
* Error: #E53E3E (vermelho acessível)
* Neutros: 11 tons de cinza (gray.0 a gray.1000)

Tipografia (enhancedTokens.typography)

* Tamanhos: xs (12px) → 6xl (60px)
* Pesos: light (300) → extrabold (800)
* Altura de linha: xs (16px) → 6xl (72px)
* Espaçamento entre letras: tighter (-0.5) → widest (1)

Espaçamentos (enhancedTokens.spacing)

* Sistema: 0 (0px) → 96 (384px)
* Incrementos: 0.5 (2px), 1 (4px), 2 (8px), etc.

Componentes Interativos
Utilize os componentes reutilizáveis sempre que possível para acelerar o desenvolvimento e manter a consistência.

InteractiveButton

* Variantes: primary, secondary, outline, ghost, destructive
* Tamanhos: sm (36px), md (48px), lg (56px)
* Animações: scale, opacity, elevation
* Feedback: Háptico configurável
* Estados: pressed, disabled, loading

Exemplo de Uso:
```java
// Código padronizado
<InteractiveButton
variant="primary"
size="md"
onPress={handlePress}
>
Confirmar Ação
</InteractiveButton>
```

InteractiveCard

* Variantes: default, elevated, outlined
* Animações: scale, elevation
* Estados: pressed, disabled
* Sombras: Dinâmicas baseadas no estado

InteractiveToggle

* Tamanhos: sm (40x24px), md (50x30px), lg (60x36px)
* Animações: Suaves com spring
* Cores: Customizáveis
* Feedback: Háptico opcional

Validações e UX

FormInput Melhorado

* Validações: required, email, password, currency, plate
* Estados: focused, error, disabled
* Ícones: left/right configuráveis
* Feedback: Visual em tempo real
* Acessibilidade: Contraste adequado

Validadores Disponíveis

* Validadores: validators.required, validators.email, validators.password, validators.positiveNumber, validators.currency, validators.plate
* Combinador: combineValidators(...validators)

Exemplo de Uso:
```java
import { validators, combineValidators } from './utils/validators';

const validate = combineValidators(
validators.required,
validators.email
);
```

Ícones Vetoriais
Utilize a biblioteca de ícones para garantir clareza e consistência.

Ícones de Ação

* TrashIcon - Exclusão com feedback visual
* PlusIcon - Adição com container destacado
* TargetIcon - Metas e objetivos

Ícones de Tipo

* MoneyIcon - Valores monetários
* RoadIcon - Quilometragem
* CarIcon - Veículos e jornadas
* BulbIcon - Economia e ideias
* ChartIcon - Relatórios e análises

Ícones de Status

* CheckIcon - Sucesso e conclusão
* PauseIcon - Pausado/em espera
* CompleteIcon - Completado
* ExpiredIcon - Expirado/vencido

Ícones de Navegação

* HomeIcon - Tela inicial
* HistoryIcon - Histórico
* AnalyticsIcon - Análises
* SettingsIcon - Configurações


