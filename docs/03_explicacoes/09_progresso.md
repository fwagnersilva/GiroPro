## Progresso e Próximas Tarefas - GiroPro

Este documento detalha o progresso atual na configuração e validação do projeto GiroPro, bem como as próximas tarefas identificadas para os desenvolvedores.

### 1. Preparação e Entendimento do Projeto (Concluído)
- Repositório clonado.
- Documentação inicial revisada.

### 2. Execução e Correção Imediata (Em Andamento)

#### 2.0. Atualizar bcrypt para a versão 6.0.0

#### 2.1. Problemas de Porta do Backend
- **Problema**: O backend estava iniciando na porta 3000, mesmo após a alteração no `giropro.env` para 4000. Isso ocorria devido a um caminho incorreto no `dotenv.config` em `src/app.ts` e/ou processos antigos ocupando a porta.
- **Correção**: 
    - O caminho do `.env` em `backend/src/app.ts` foi corrigido para `dotenv.config({ path: __dirname + '/../giropro.env' });`.
    - Processos que ocupavam as portas 3000 e 4000 foram identificados e encerrados.
    - O backend agora inicia corretamente na porta 4000.

#### 2.2. Configuração do Frontend
- **Problema**: O frontend não estava se comunicando com o backend devido a uma variável de ambiente `REACT_APP_API_URL` indefinida e problemas com o carregamento do Axios no ambiente web.
- **Correção**: 
    - O arquivo `.env.local` foi criado/atualizado em `frontend/` com `REACT_APP_API_URL=http://localhost:4000/api/v1`.
    - A configuração do `app.json` foi ajustada para o bundler `metro`.
    - O `api.ts` do frontend foi verificado e está configurado para usar `REACT_APP_API_URL`.
- **Status Atual**: O frontend está configurado para apontar para a porta 4000 do backend. No entanto, a instabilidade do ambiente de sandbox impede a validação completa da comunicação.

#### 2.3. Validação de Senha no Registro (Erro 400)
- **Problema**: O fluxo de registro estava retornando um erro 400 (Bad Request) no backend, mesmo com senhas aparentemente fortes.
- **Descoberta**: Análise do `backend/src/utils/validation.ts` revelou regras de validação de senha rigorosas:
    - Mínimo de 8 caracteres.
    - Pelo menos 1 letra minúscula.
    - Pelo menos 1 letra maiúscula.
    - Pelo menos 1 número.
    - Pelo menos 1 caractere especial (`@$!%*?&`).
- **Status Atual**: O frontend (`RegisterScreenOptimized.tsx`) não possui validação de senha tão granular quanto o backend, o que pode levar ao erro 400. A tela de registro otimizada apenas verifica o comprimento mínimo da senha (8 caracteres) e a correspondência entre senha e confirmar senha.

### 3. Validação Técnica (Próximas Tarefas)

#### 3.1. Estabilização do Ambiente
- **Tarefa**: Investigar e resolver a instabilidade persistente do ambiente de sandbox que afeta as operações de arquivo e a execução dos serviços. Isso é crítico para permitir testes completos.
- **Observação**: Foi criada uma nova documentação em `docs/02_guias_como_fazer/06_como_resolver_conflitos_de_porta.md` para orientar sobre o uso de portas alternativas e evitar conflitos.

#### 3.2. Ajuste da Validação de Senha no Frontend
- **Tarefa**: Implementar no `RegisterScreenOptimized.tsx` (e possivelmente no `FormInput.tsx` ou em um novo utilitário de validação no frontend) a mesma lógica de validação de senha presente no `backend/src/utils/validation.ts`.
- **Detalhes**: Garantir que o frontend valide a senha para incluir:
    - Mínimo de 8 caracteres.
    - Pelo menos 1 letra minúscula.
    - Pelo menos 1 letra maiúscula.
    - Pelo menos 1 número.
    - Pelo menos 1 caractere especial (`@$!%*?&`).

#### 3.3. Teste End-to-End do Fluxo de Registro e Login
- **Tarefa**: Após a estabilização do ambiente e a correção da validação de senha no frontend, realizar testes completos do fluxo de registro e login para garantir que:
    - Novos usuários possam se registrar com sucesso.
    - Usuários registrados possam fazer login sem erros.
    - A comunicação entre frontend e backend esteja funcionando perfeitamente para essas operações.

#### 3.4. Code Review Aprofundado (Login)
- **Tarefa**: Realizar um code review detalhado do `LoginScreen.tsx`, `AuthContext.tsx` e `api.ts` para o fluxo de login, garantindo que a lógica de autenticação e o tratamento de erros estejam robustos e em conformidade com as melhores práticas.

### # 4. Melhorias no Frontend

### 4.1 Este documento lista as sugestões de melhoria para a tela AchievementsScreen.tsx transformadas em tarefas acionáveis. Marque cada item como concluído ([x]) à medida que for implementado.

1. Melhorias de Layout e Hierarquia de Informações
1.1. Seção de Estatísticas do Usuário
Visualização do Nível: Substituir ícones de texto por ícones de biblioteca (react-native-vector-icons ou SVGs) para consistência e escalabilidade.
Benefícios do Nível: Implementar exibição dos benefícios do nível atual (tooltip, modal ou seção expansível).
Progressão do Nível (Web): Garantir que a interação de hover/clique na barra de progresso exiba detalhes adicionais (pontos exatos, pontos atuais).
Cards de Estatísticas (Web): Adicionar microinterações (elevação, mudança de cor) ao passar o mouse sobre os cards de estatísticas.

1.2. Conquistas Recentes
Indicador de Scroll: Implementar um indicador visual de rolagem para a lista horizontal de conquistas recentes (setas para web, fade out para mobile, ou manter indicador nativo).
Interatividade dos Cards: Tornar os cards de conquistas recentes clicáveis, levando a detalhes da conquista ou exibindo um modal.
Informações no Card: Avaliar a adição sutil de raridade ou pontos de recompensa nos cards de conquistas recentes.

1.3. Filtros
Clareza Visual dos Filtros: Aprimorar a diferenciação visual entre filtros ativos/inativos (ícones, contraste acessível, microinterações de seleção).
Organização dos Tipos de Conquista: Para listas extensas, considerar Dropdown/Picker (mobile), categorização ou funcionalidade de pesquisa nos filtros.
Posicionamento dos Filtros: Avaliar fixar os filtros no topo da tela para fácil acesso, especialmente em telas longas.

1.4. Lista de Conquistas
Ícones das Conquistas: Garantir renderização consistente e escalável dos ícones das conquistas (biblioteca de ícones ou SVGs).
Badge de Desbloqueio: Aprimorar o badge de desbloqueio (ícone de troféu/estrela, animação sutil).
Raridade (Web): Adicionar tooltip ao passar o mouse sobre o badge de raridade, explicando seu significado.
Feedback Visual de Progresso: Exibir progresso numérico ou barra de progresso para conquistas bloqueadas.
Estado Vazio: Adicionar ilustração ou ícone relevante para o estado vazio da lista de conquistas.
Animações de Carregamento: Implementar animação de "esqueleto" (skeleton loader) para os cards de conquista durante o carregamento.

2. Cores e Tipografia
Paleta de Cores Centralizada: Criar um arquivo de tema (theme.ts ou colors.ts) para centralizar as cores do aplicativo.
Tipografia Consistente: Definir uma escala tipográfica (tamanhos, pesos, alturas de linha) em um arquivo de tema.
Acessibilidade: Verificar contraste de cores e tamanhos de fonte para garantir acessibilidade (WCAG).

3. Ícones e Feedbacks Visuais
Biblioteca de Ícones: Utilizar uma biblioteca de ícones (react-native-vector-icons ou react-native-svg) para todos os ícones.
Feedbacks de Toque/Clique: Implementar feedbacks visuais ricos para elementos interativos (Ripple Effect para Android, Highlight/Opacity Change para iOS, Hover States para Web).
Animações: Adicionar pequenas animações para transições de estado (desbloqueio de conquista, filtragem, carregamento).

4. Microinterações
Feedback de Sucesso/Desbloqueio: Exibir notificação toast, modal de celebração ou animação ao desbloquear uma conquista.
Feedback de Erro: Aprimorar feedback de erro (ícone visualmente distinto, vibração sutil em mobile).
Pull-to-Refresh: Considerar animação customizada para o pull-to-refresh.
Empty States: Adicionar ilustração ou animação para o estado vazio que incentive a interação.

5. Considerações Multiplataforma
Navegação: Garantir que a navegação siga os padrões de cada plataforma (gestos iOS, botão Android, histórico web).
Componentes Nativos: Avaliar o uso de componentes nativos específicos da plataforma para elementos complexos (pickers, alertas, tab bars).
Responsividade: Testar e garantir que a interface se reorganize logicamente em diferentes tamanhos de tela (desktops, tablets, mobile landscape) para a web.
Performance Web: Otimizar carregamento de imagens, bundle size JS e uso de recursos do navegador para a versão web.
Acessibilidade Web: Garantir navegação via teclado, estados de foco visíveis e uso correto de atributos ARIA para a versão web.

6. Pontos de Confusão e Clareza
Benefícios do Nível: Exibir claramente os benefícios do nível atual.
Progresso de Conquistas Bloqueadas: Implementar um indicador claro de progresso para conquistas bloqueadas.
Ícones como Texto: Substituir ícones de texto por ícones gráficos dedicados para maior clareza e consistência.

# Progresso das Melhorias na AddExpenseScreen.tsx

## 1. Melhorias de Layout e Hierarquia de Informações

### 1.1. Cabeçalho

- [ ] **Consistência de Navegação:** Garantir que o botão de voltar funcione como um botão de navegação padrão do navegador na web e siga os padrões de navegação do iOS.
- [ ] **Feedback Visual do Botão Voltar:** Adicionar feedback visual sutil ao tocar/clicar no botão de voltar (opacidade ou efeito de "press").

### 1.2. Formulário

- [ ] **Tipo de Despesa:**
  - [ ] **Responsividade:** Ajustar o layout dos botões de tipo de despesa para garantir um layout ideal em todos os tamanhos de tela (web: CSS Grid/Flexbox com mais controle).
  - [ ] **Feedback de Seleção:** Adicionar um ícone de checkmark dentro do botão selecionado para reforçar a seleção.
  - [ ] **Animação de Seleção:** Implementar uma pequena animação ao selecionar um tipo de despesa (leve scale ou fade-in da cor de fundo).
- [ ] **Data da Despesa:**
  - [ ] **Date Picker:** Implementar um `DatePicker` nativo para iOS e Android, e um componente de calendário intuitivo para a web.
  - [ ] **Formatação Automática:** Se mantiver o `TextInput`, implementar uma máscara de entrada para formatar a data automaticamente (ex: `DD/MM/YYYY`).
- [ ] **Valor da Despesa:**
  - [ ] **Formatação em Tempo Real:** Aplicar a formatação da moeda diretamente no `TextInput`.
  - [ ] **Validação Visual:** Adicionar feedback visual (borda vermelha, mensagem de erro) se o valor for inválido antes do `handleSubmit`.
- [ ] **Seleção de Veículo:**
  - [ ] **Componente Multiplataforma:** Considerar um componente de seleção customizado ou biblioteca para uma experiência consistente em todas as plataformas.
  - [ ] **Pesquisa/Filtro:** Adicionar funcionalidade de pesquisa ou filtro se a lista de veículos for muito longa.
- [ ] **Descrição:**
  - [ ] **Contador de Caracteres:** Adicionar um contador de caracteres se houver um limite para a descrição.

### 1.3. Rodapé

- [ ] **Feedback de Carregamento:** Desabilitar o botão e/ou adicionar texto "Registrando..." durante o carregamento.
- [ ] **Feedback de Sucesso/Erro:** Exibir feedback mais integrado à UI (toast message temporário, ícone de sucesso/erro) em vez de `Alert.alert`.

## 2. Cores e Tipografia

- [ ] **Paleta de Cores Centralizada:** Criar um arquivo de tema (`theme.ts` ou `colors.ts`) para centralizar as cores do aplicativo.
- [ ] **Tipografia Consistente:** Definir uma escala tipográfica (tamanhos, pesos, alturas de linha) em um arquivo de tema.
- [ ] **Acessibilidade:** Verificar contraste de cores e tamanhos de fonte para garantir acessibilidade (WCAG).

## 3. Ícones e Feedbacks Visuais

- [ ] **Consistência de Ícones:** Garantir que os ícones representem claramente sua função e sejam consistentes com o restante do aplicativo.
- [ ] **Microinterações:** Implementar feedbacks visuais ricos para elementos interativos (Ripple Effect para Android, Highlight/Opacity Change para iOS, Hover States para Web).
- [ ] **Animações:** Adicionar pequenas animações para transições de estado (abrir teclado, enviar formulário).

## 4. Microinterações

- [ ] **Feedback de Validação:** Fornecer feedback visual em tempo real para validação de campos (bordas vermelhas, mensagens de erro).
- [ ] **Feedback de Sucesso/Erro:** Usar toast message ou banner de notificação para informar sucesso ou falha da operação.
- [ ] **Animação de Teclado:** Implementar animações mais suaves ao abrir e fechar o teclado.

## 5. Considerações Multiplataforma

- [ ] **Componentes Nativos:** Avaliar o uso de componentes nativos ou bibliotecas para `DatePicker` e `Picker` de veículos para uma experiência mais próxima do nativo.
- [ ] **Responsividade:** Testar e garantir que a interface se reorganize logicamente em diferentes tamanhos de tela para a web.
- [ ] **Performance Web:** Otimizar carregamento de recursos, bundle size JS e uso de recursos do navegador para a versão web.
- [ ] **Acessibilidade Web:** Garantir navegação via teclado, estados de foco visíveis e uso correto de atributos ARIA para a versão web.

## 6. Pontos de Confusão e Clareza

- [ ] **Entrada de Data:** Substituir `TextInput` por um `DatePicker`.
- [ ] **Validação de Campos:** Implementar feedback de validação em tempo real.
- [ ] **Feedback de Operação:** Substituir `Alert.alert` por toast ou banner para feedback de sucesso/erro

# Progresso das Melhorias na AddFuelingScreen.tsx

## 1. Melhorias de Layout e Hierarquia de Informações

### 1.1. Cabeçalho

- [ ] **Consistência de Navegação:** Garantir que o botão de voltar funcione como um botão de navegação padrão do navegador na web e siga os padrões de navegação do iOS.
- [ ] **Feedback Visual do Botão Voltar:** Adicionar feedback visual sutil ao tocar/clicar no botão de voltar (opacidade ou efeito de "press").

### 1.2. Formulário

- [ ] **Seleção de Veículo:**
  - [ ] **Componente Multiplataforma:** Considerar um componente de seleção customizado ou biblioteca para uma experiência consistente em todas as plataformas.
  - [ ] **Pesquisa/Filtro:** Adicionar funcionalidade de pesquisa ou filtro se a lista de veículos for muito longa.
- [ ] **Data do Abastecimento:**
  - [ ] **Date Picker:** Implementar um `DatePicker` nativo para iOS e Android, e um componente de calendário intuitivo para a web.
  - [ ] **Formatação Automática:** Se mantiver o `TextInput`, implementar uma máscara de entrada para formatar a data automaticamente (ex: `DD/MM/YYYY`).
- [ ] **Tipo de Combustível:**
  - [ ] **Componente Multiplataforma:** Considerar um componente de seleção customizado ou botões de rádio/segmentados para uma experiência mais consistente e visualmente atraente.
- [ ] **Quantidade de Litros e Valor por Litro:**
  - [ ] **Formatação em Tempo Real:** Aplicar a formatação de números decimais (com vírgula para o Brasil) diretamente no `TextInput`.
  - [ ] **Validação Visual:** Adicionar feedback visual (borda vermelha, mensagem de erro) se o valor for inválido antes do `handleSubmit`.
- [ ] **KM Atual (Opcional):**
  - [ ] **Formatação:** Considerar formatação de números grandes (ex: separador de milhares) para facilitar a leitura.
- [ ] **Nome do Posto (Opcional):**
  - [ ] **Autocompletar:** Adicionar funcionalidade de autocompletar se houver uma lista de postos frequentes ou integração com serviços de mapas.

### 1.3. Rodapé

- [ ] **Feedback de Carregamento:** Desabilitar o botão e/ou adicionar texto "Registrando..." durante o carregamento.
- [ ] **Feedback de Sucesso/Erro:** Exibir feedback mais integrado à UI (toast message temporário, ícone de sucesso/erro) em vez de `Alert.alert`.

## 2. Cores e Tipografia

- [ ] **Paleta de Cores Centralizada:** Criar um arquivo de tema (`theme.ts` ou `colors.ts`) para centralizar as cores do aplicativo.
- [ ] **Tipografia Consistente:** Definir uma escala tipográfica (tamanhos, pesos, alturas de linha) em um arquivo de tema.
- [ ] **Acessibilidade:** Verificar contraste de cores e tamanhos de fonte para garantir acessibilidade (WCAG).

## 3. Ícones e Feedbacks Visuais

- [ ] **Consistência de Ícones:** Garantir que os ícones representem claramente sua função e sejam consistentes com o restante do aplicativo.
- [ ] **Microinterações:** Implementar feedbacks visuais ricos para elementos interativos (Ripple Effect para Android, Highlight/Opacity Change para iOS, Hover States para Web).
- [ ] **Animações:** Adicionar pequenas animações para transições de estado (abrir teclado, enviar formulário).

## 4. Microinterações

- [ ] **Feedback de Validação:** Fornecer feedback visual em tempo real para validação de campos (bordas vermelhas, mensagens de erro).
- [ ] **Feedback de Sucesso/Erro:** Usar toast message ou banner de notificação para informar sucesso ou falha da operação.
- [ ] **Animação de Teclado:** Implementar animações mais suaves ao abrir e fechar o teclado.

## 5. Considerações Multiplataforma

- [ ] **Componentes Nativos:** Avaliar o uso de componentes nativos ou bibliotecas para `DatePicker` e `Picker` de veículos/combustível para uma experiência mais próxima do nativo.
- [ ] **Responsividade:** Testar e garantir que a interface se reorganize logicamente em diferentes tamanhos de tela para a web.
- [ ] **Performance Web:** Otimizar carregamento de recursos, bundle size JS e uso de recursos do navegador para a versão web.
- [ ] **Acessibilidade Web:** Garantir navegação via teclado, estados de foco visíveis e uso correto de atributos ARIA para a versão web.

## 6. Pontos de Confusão e Clareza

- [ ] **Entrada de Data:** Substituir `TextInput` por um `DatePicker`.
- [ ] **Validação de Campos:** Implementar feedback de validação em tempo real.
- [ ] **Feedback de Operação:** Substituir `Alert.alert` por toast ou banner para feedback de sucesso/erro.

# Progresso das Melhorias na ChangePasswordScreen.tsx

Implementar validação de campos em tempo real para todos os campos de senha.
Exibir requisitos de senha claros e feedback visual em tempo real abaixo do campo "Nova Senha".
adicionar ícone "Mostrar Senha" (olho) aos campos de senha.
Adicionar link "Esqueceu a senha atual?" direcionando para o fluxo de recuperação de senha.
Subsituir Alert.alert de sucesso por um feedback visual mais suave (ex: toast message ou animação).
Fornecer mensagens de erro mais específicas e úteis para cada cenário de falha.
Aprimorar microinterações do botão "Alterar Senha" (ex: animação de sucesso no botão).
Implementar feedback tátil para interações importantes (iOS/Android).
Garantir consistência de UX/UI entre iOS, Android e Web.
Revisar e otimizar o espaçamento entre elementos no layout.
Melhorar o agrupamento visual dos campos de senha.
Refatorar o cabeçalho para centralizar o título de forma mais elegante, sem impacto do botão de voltar.
Revisar a paleta de cores para alinhar à identidade visual e melhorar o contraste.
Aplicar tipografia consistente com o restante do aplicativo, ajustando tamanhos e pesos.
Adicionar ícones de validação (checkmark/X) ao lado dos campos de senha.
Implementar estado de foco visual para os campos de texto.
Adicionar transições suaves para mudanças de estado da UI.
Considerar animações de carregamento mais personalizadas ou skeleton loaders.
Adicionar efeitos visuais sutis ao pressionar botões (TouchableOpacity).



### Observações Adicionais:
- Priorizar a resolução da instabilidade do ambiente para permitir o avanço das demais tarefas.
- Documentar qualquer avanço ou falha encontrada de forma clara e concisa.
- Manter a agilidade no desenvolvimento, focando na funcionalidade antes de refatorações complexas.



# Progresso das Melhorias na LoginScreen.tsx

Este documento detalha as melhorias implementadas e as próximas tarefas para a tela de Login do GiroPro, com foco em UX/UI para iOS, Android e Web.

## 1. Melhorias Implementadas (Prioridade Alta)

### 1.1. Sistema de Design e Tokens
- [x] Criado arquivo de design tokens (`src/theme/tokens.ts`) centralizando cores, tipografia, espaçamentos, border radius e sombras.
- [x] Implementado suporte a tema claro/escuro com detecção automática do sistema (`LoginScreenEnhanced.tsx`).
- [x] Padronizado sistema de espaçamentos e tipografia usando os tokens de design.
- [x] Criada paleta de cores mais rica e característica da marca.

### 1.2. Responsividade e Layout
- [x] Implementado layout responsivo para tablet e desktop utilizando o novo hook `useResponsiveLayout.ts`.
- [x] Otimizada a densidade de informação por tamanho de tela, ajustando paddings, font sizes e max-width do container.
- [x] Adicionados breakpoints específicos para diferentes dispositivos (`src/theme/tokens.ts`).
- [x] Melhorada a hierarquia visual com variações de tamanho de fonte e peso para títulos e subtítulos.

### 1.3. Acessibilidade
- [x] Adicionados labels adequados para screen readers nos campos de input e botões (`EnhancedFormInput.tsx`, `LoginScreenEnhanced.tsx`).
- [x] Implementada navegação por teclado básica (`TouchableOpacity` com `hitSlop`).
- [x] Melhorado o contraste de cores para garantir acessibilidade (WCAG AA) através da nova paleta de cores e temas.
- [x] Adicionados indicadores visuais para campos obrigatórios (`EnhancedFormInput.tsx`).

### 1.4. Validação e Feedback
- [x] Implementada validação em tempo real nos campos de email e senha (`EnhancedFormInput.tsx`).
- [x] Melhoradas as mensagens de erro com sugestões mais claras (`EnhancedFormInput.tsx`).
- [x] Adicionado feedback visual de sucesso (ícone de checkmark) para campos válidos (`EnhancedFormInput.tsx`).
- [x] Implementados estados de loading mais informativos no botão de login (`LoginScreenEnhanced.tsx`).

## 2. Próximas Tarefas (Prioridade Média)

### 2.1. Microinterações e Animações
- [x] Adicionadas animações de transição entre estados (foco, erro, sucesso) nos inputs (`EnhancedFormInput.tsx`).
- [x] Implementados hover states para web nos botões e links (`LoginScreenEnhanced.tsx`).
- [x] Criadas microinterações para feedback tátil (animação de pressão no botão de login) (`LoginScreenEnhanced.tsx`).
- [x] Adicionados ripple effects para Android (simulados via `TouchableOpacity` e `Animated.View` para consistência multiplataforma) (`LoginScreenEnhanced.tsx`).

### 2.2. Componentes Visuais
- [x] Criado componente de cabeçalho mais expressivo com logo animado (`LoginScreenEnhanced.tsx`).
- [x] Adicionados ícones contextuais (`car-sport` no logo, `arrow-forward` no botão de login) (`LoginScreenEnhanced.tsx`).
- [ ] Implementar componente de progresso/onboarding (futuro).
- [ ] Criar footer com links úteis (futuro).

### 2.3. Experiência de Autenticação
- [ ] Implementar "Esqueceu a senha" funcional.
- [ ] Adicionar opções de login social (Google, Apple, etc.).
- [ ] Implementar autenticação biométrica (Touch ID/Face ID).
- [ ] Criar sistema de "Lembrar-me" mais robusto (armazenamento seguro de credenciais).

### 2.4. Performance e Otimização
- [ ] Otimizar re-renderizações desnecessárias.
- [ ] Implementar lazy loading para componentes.
- [ ] Adicionar debounce na validação de inputs.
- [ ] Otimizar animações para dispositivos mais antigos.

## 3. Melhorias Futuras (Prioridade Baixa)

### 3.1. Recursos Avançados
- [ ] Implementar PWA features para web.
- [ ] Adicionar suporte a múltiplos idiomas.
- [ ] Criar sistema de notificações push.
- [ ] Implementar analytics de UX para monitoramento.

### 3.2. Personalização
- [ ] Permitir customização de temas pelo usuário.
- [ ] Adicionar preferências de acessibilidade (tamanho de fonte, alto contraste).
- [ ] Implementar layouts alternativos.
- [ ] Criar sistema de dicas contextuais e tutoriais.

### 3.3. Segurança UX
- [ ] Adicionar indicadores de segurança (HTTPS, força da senha).
- [ ] Implementar verificação de força da senha em tempo real.
- [ ] Criar sistema de timeout visual de sessão.
- [ ] Adicionar proteção contra ataques de força bruta.

### 3.4. Gamificação e Engajamento
- [ ] Implementar sistema de progresso de configuração da conta.
- [ ] Adicionar badges e conquistas.
- [ ] Criar onboarding interativo.
- [ ] Implementar dicas e tutoriais contextuais.






# Progresso das Melhorias na JourneysScreen.tsx

## 1. Melhorias de Layout e Hierarquia de Informações

### 1.1. Cabeçalho

- [ ] **Consistência de Navegação:** Garantir que o botão de voltar funcione como um botão de navegação padrão do navegador na web e siga os padrões de navegação do iOS.
- [ ] **Feedback Visual do Botão Voltar:** Adicionar feedback visual sutil ao tocar/clicar no botão de voltar (opacidade ou efeito de "press").

### 1.2. Formulário

- [ ] **Tipo de Despesa:**
  - [ ] **Responsividade:** Ajustar o layout dos botões de tipo de despesa para garantir um layout ideal em todos os tamanhos de tela (web: CSS Grid/Flexbox com mais controle).
  - [ ] **Feedback de Seleção:** Adicionar um ícone de checkmark dentro do botão selecionado para reforçar a seleção.
  - [ ] **Animação de Seleção:** Implementar uma pequena animação ao selecionar um tipo de despesa (leve scale ou fade-in da cor de fundo).
- [ ] **Data da Despesa:**
  - [ ] **Date Picker:** Implementar um `DatePicker` nativo para iOS e Android, e um componente de calendário intuitivo para a web.
  - [ ] **Formatação Automática:** Se mantiver o `TextInput`, implementar uma máscara de entrada para formatar a data automaticamente (ex: `DD/MM/YYYY`).
- [ ] **Valor da Despesa:**
  - [ ] **Formatação em Tempo Real:** Aplicar a formatação da moeda diretamente no `TextInput`.
  - [ ] **Validação Visual:** Adicionar feedback visual (borda vermelha, mensagem de erro) se o valor for inválido antes do `handleSubmit`.
- [ ] **Seleção de Veículo:**
  - [ ] **Componente Multiplataforma:** Considerar um componente de seleção customizado ou biblioteca para uma experiência consistente em todas as plataformas.
  - [ ] **Pesquisa/Filtro:** Adicionar funcionalidade de pesquisa ou filtro se a lista de veículos for muito longa.
- [ ] **Descrição:**
  - [ ] **Contador de Caracteres:** Adicionar um contador de caracteres se houver um limite para a descrição.

### 1.3. Rodapé

- [ ] **Feedback de Carregamento:** Desabilitar o botão e/ou adicionar texto "Registrando..." durante o carregamento.
- [ ] **Feedback de Sucesso/Erro:** Exibir feedback mais integrado à UI (toast message temporário, ícone de sucesso/erro) em vez de `Alert.alert`.

## 2. Cores e Tipografia

- [ ] **Paleta de Cores Centralizada:** Criar um arquivo de tema (`theme.ts` ou `colors.ts`) para centralizar as cores do aplicativo.
- [ ] **Tipografia Consistente:** Definir uma escala tipográfica (tamanhos, pesos, alturas de linha) em um arquivo de tema.
- [ ] **Acessibilidade:** Verificar contraste de cores e tamanhos de fonte para garantir acessibilidade (WCAG).

## 3. Ícones e Feedbacks Visuais

- [ ] **Consistência de Ícones:** Garantir que os ícones representem claramente sua função e sejam consistentes com o restante do aplicativo.
- [ ] **Microinterações:** Implementar feedbacks visuais ricos para elementos interativos (Ripple Effect para Android, Highlight/Opacity Change para iOS, Hover States para Web).
- [ ] **Animações:** Adicionar pequenas animações para transições de estado (abrir teclado, enviar formulário).

## 4. Microinterações

- [ ] **Feedback de Validação:** Fornecer feedback visual em tempo real para validação de campos (bordas vermelhas, mensagens de erro).
- [ ] **Feedback de Sucesso/Erro:** Usar toast message ou banner de notificação para informar sucesso ou falha da operação.
- [ ] **Animação de Teclado:** Implementar animações mais suaves ao abrir e fechar o teclado.

## 5. Considerações Multiplataforma

- [ ] **Componentes Nativos:** Avaliar o uso de componentes nativos ou bibliotecas para `DatePicker` e `Picker` de veículos para uma experiência mais próxima do nativo.
- [ ] **Responsividade:** Testar e garantir que a interface se reorganize logicamente em diferentes tamanhos de tela para a web.
- [ ] **Performance Web:** Otimizar carregamento de recursos, bundle size JS e uso de recursos do navegador para a versão web.
- [ ] **Acessibilidade Web:** Garantir navegação via teclado, estados de foco visíveis e uso correto de atributos ARIA para a versão web.

## 6. Pontos de Confusão e Clareza

- [ ] **Entrada de Data:** Substituir `TextInput` por um `DatePicker`.
- [ ] **Validação de Campos:** Implementar feedback de validação em tempo real.
- [ ] **Feedback de Operação:** Substituir `Alert.alert` por toast ou banner para feedback de sucesso/erro




### 4.2. Melhorias na InsightsScreen.tsx

Este documento lista as sugestões de melhoria para a tela InsightsScreen.tsx transformadas em tarefas acionáveis. Marque cada item como concluído ([x]) à medida que for implementado.

#### Imediatas (Alta Prioridade)
1. **Redesign do Header**: Mais compacto e informativo
2. **Filtros Fixos**: Manter filtros sempre visíveis
3. **Cards Redesenhados**: Layout mais limpo e hierárquico
4. **Ícones Profissionais**: Substituir emojis
5. **Loading States**: Melhorar skeleton loading

#### Médio Prazo (Média Prioridade)
1. **Sistema de Tabs**: Separar insights de recomendações
2. **Busca e Filtros**: Adicionar capacidade de busca
3. **Modo Escuro**: Implementar tema escuro
4. **Animações**: Adicionar microinterações
5. **Responsividade**: Otimizar para diferentes telas

#### Longo Prazo (Baixa Prioridade)
1. **Personalização**: Permitir customização da interface
2. **Comparações**: Funcionalidade de comparar períodos
3. **Exportação**: Permitir exportar insights
4. **Notificações**: Sistema de alertas inteligentes
5. **Gamificação**: Elementos de engajamento


