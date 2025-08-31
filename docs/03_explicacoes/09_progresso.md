## Progresso e Próximas Tarefas - GiroPro

Este documento detalha o progresso atual na configuração e validação do projeto GiroPro, bem como as próximas tarefas identificadas para os desenvolvedores.

### 2. Execução e Correção Imediata (Em Andamento)

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

### 5. Oportunidades de Melhoria - AddExpenseScreen

Análise de UX/UI e implementação de melhorias na tela de adição de despesas, focando em usabilidade, experiência do usuário e interface visual para iOS, Android e Web.

#### 5.1. Prioridade Alta (Implementação Imediata)

##### 3. Date Picker Nativo
- **Descrição**: A implementação de um Date Picker nativo foi iniciada para melhorar a experiência de seleção de data. A verificação de dependências foi realizada, e a próxima etapa é a implementação do componente, que proporcionará uma interação mais intuitiva e familiar para o usuário em cada plataforma (iOS, Android, Web).

#### 5.1.1. Melhorias Implementadas

##### 1. Indicadores Visuais para Campos Obrigatórios
- **Descrição**: Foram adicionados indicadores visuais (asteriscos vermelhos) aos campos obrigatórios na tela de adicionar despesa (`AddExpenseScreenOptimized.tsx`), garantindo que o usuário identifique facilmente quais campos precisam ser preenchidos. Isso melhora a usabilidade e reduz a ocorrência de erros de validação.

##### 2. Validação em Tempo Real
- **Descrição**: Foi implementada a validação em tempo real para o campo de valor da despesa (`AddExpenseScreenOptimized.tsx`). Agora, o sistema fornece feedback instantâneo ao usuário, informando se o valor inserido é válido ou não, prevenindo erros antes do envio do formulário e melhorando a experiência do usuário.

##### 3. Feedback Visual de Loading e Erro
- **Descrição**: Implementado feedback visual de loading e erro na tela de registro (`RegisterScreenOptimized.tsx`). Um estado de erro foi adicionado e um componente de texto exibe mensagens de erro, melhorando a experiência do usuário ao fornecer informações claras sobre o status da operação.

##### 4. Validação de Formulário Mais Robusta
- **Descrição**: As validações de nome, email e senha foram integradas diretamente no componente `FormInput` na tela de registro (`RegisterScreenOptimized.tsx`), utilizando as funções `validators` e `combineValidators` existentes. Isso removeu a necessidade de validação manual no `handleRegister`, tornando o formulário mais robusto e fácil de manter.

#### 5.2. Prioridade Média (Melhorias Graduais)


##### 5. Design System e Tokens
- **Descrição**: Padronizar a aparência visual do aplicativo, garantindo consistência e facilitando a manutenção e a implementação de novos recursos.
- [ ] Implementar um sistema de tema claro/escuro, permitindo que o usuário escolha sua preferência.
- [ ] Criar componentes reutilizáveis e genéricos (ex: `Button`, `Input`, `Card`) para padronizar a UI.

##### 6. Acessibilidade
- **Descrição**: Garantir que o aplicativo seja utilizável por pessoas com deficiências, seguindo as diretrizes de acessibilidade (WCAG).
- [ ] Testar a usabilidade do aplicativo com um leitor de tela (ex: VoiceOver, TalkBack).
- [ ] Implementar navegação completa por teclado para a versão web.

##### 7. Sugestões Inteligentes
- **Descrição**: Agilizar o preenchimento do formulário com sugestões baseadas no histórico de uso do usuário, tornando o processo mais rápido e eficiente.
- [ ] Implementar um histórico de descrições de despesas para auto-completar o campo.
- [ ] Sugerir valores de despesa com base em lançamentos anteriores do mesmo tipo.

#### 5.3. Prioridade Baixa (Polimento e Funcionalidades Avançadas)

##### 10. Ícones e Elementos Visuais
- **Descrição**: Tornar a interface mais informativa e agradável visualmente com o uso de ícones e outros elementos gráficos.
- [ ] Adicionar ilustrações ou mensagens de "estado vazio" quando não há dados para exibir.
- [ ] Implementar `skeleton loading` para indicar o carregamento de conteúdo de forma mais suave.

##### 11. Cores e Contraste
- **Descrição**: Garantir que a paleta de cores seja esteticamente agradável, funcional e acessível.
- [ ] Implementar gradientes sutis para adicionar profundidade e um visual mais moderno.

##### 12. Layout e Espaçamento
- **Descrição**: Criar um layout bem estruturado e responsivo que se adapte a diferentes tamanhos de tela.
- [ ] Implementar `breakpoints` para ajustar o layout em telas de desktop, tablet e mobile.

##### 13. Animações e Transições
- **Descrição**: Adicionar movimento à interface para torná-la mais dinâmica e engajante.
- [ ] Adicionar uma animação de sucesso no botão de envio após o registro da despesa.
- [ ] Implementar um `bounce effect` nos botões de tipo de despesa para um feedback mais tátil.

##### 14. Feedback Háptico (Mobile)
- **Descrição**: Utilizar a vibração do dispositivo para fornecer feedback físico em interações importantes.
- [ ] Adicionar uma vibração leve ao selecionar um tipo de despesa.
- [ ] Implementar um feedback háptico de sucesso no envio do formulário.
- [ ] Adicionar uma vibração de erro em caso de falha na validação.

##### 15. Estados Interativos
- **Descrição**: Fornecer feedback visual claro para todas as interações do usuário.
- [ ] Implementar estados de `hover` para botões e links na versão web.
- [ ] Adicionar estados de `press` (pressionado) para botões em dispositivos móveis.
- [ ] Implementar estados de `focus` para elementos de formulário, melhorando a navegação por teclado.
- [ ] Adicionar um `ripple effect` nos botões para um feedback visual mais moderno (padrão do Android).

##### 16. Adaptações por Plataforma
- **Descrição**: Otimizar a experiência do usuário para as convenções de design de cada plataforma (iOS, Android, Web).
- [ ] **iOS**: Utilizar componentes e padrões de design específicos do iOS (ex: `Cupertino` widgets).
- [ ] **Android**: Seguir as diretrizes do Material Design para componentes e navegação.
- [ ] **Web**: Garantir que a aplicação seja totalmente responsiva e acessível em navegadores de desktop.

### 5.4. Tarefas de Infraestrutura e Qualidade

##### 17. Implementar Testes Automatizados
- **Descrição**: Garantir a qualidade do código e prevenir regressões futuras com a criação de testes automatizados.
- [ ] Escrever testes unitários para as funções de validação e lógica de negócio.
- [ ] Criar testes de integração para os fluxos de usuário (ex: adicionar uma despesa).
- [ ] Implementar testes de snapshot para garantir que a UI não mude inesperadamente.

##### 18. Otimizar Performance
- **Descrição**: Garantir que o aplicativo seja rápido e responsivo, mesmo em dispositivos mais antigos.
- [ ] Analisar e otimizar o tempo de carregamento da tela.
- [ ] Reduzir o número de `re-renders` desnecessários com `React.memo` e `useCallback`.
- [ ] Otimizar o tamanho das imagens e outros assets.

##### 19. Documentar Componentes e Padrões
- **Descrição**: Facilitar a manutenção e a colaboração no projeto com uma documentação clara e abrangente.
- [ ] Documentar as `props` e o uso de cada componente reutilizável.
- [ ] Criar um guia de estilo no Storybook ou similar para visualizar os componentes em isolamento.
- [ ] Documentar as decisões de arquitetura e os padrões de código utilizados.

### 6. Oportunidades de Melhoria - AddFuelingScreen

Análise de UX/UI e implementação de melhorias na tela de adição de abastecimento, focando em usabilidade, experiência do usuário e interface visual para iOS, Android e Web.

#### 6.1. Prioridade Alta (Implementação Imediata)

##### 1. Reorganizar Hierarquia de Campos
- **Descrição**: Otimizar a disposição dos campos no formulário para seguir um fluxo lógico e intuitivo de preenchimento, reduzindo a carga cognitiva do usuário.
- [ ] **Reordenar campos seguindo fluxo natural de abastecimento**
  - Mover campo "Nome do Posto" para o topo do formulário, pois é uma informação primária.
  - Reorganizar sequência: Posto → Data → Veículo → Tipo Combustível → Valor/Litro → Quantidade → KM Atual.
  - Agrupar campos obrigatórios em uma seção "Informações Essenciais" visualmente destacada.
  - Criar uma seção colapsável "Detalhes Adicionais" para campos opcionais, como "Observações" ou "Forma de Pagamento".
  - Adicionar indicadores visuais de campos obrigatórios (ex: asterisco colorido) para clareza.
  - Tempo estimado: 2-3 horas

##### 2. Implementar Design System Consistente
- **Descrição**: Aplicar os tokens de design definidos no projeto para garantir uma identidade visual coesa e facilitar a manutenção e escalabilidade da interface.
- [ ] **Utilizar tokens de design definidos no projeto**
  - Substituir cores `hardcoded` pelos tokens do `theme/tokens.ts`.
  - Implementar hierarquia tipográfica usando os tokens de tipografia definidos.
  - Padronizar espaçamentos usando o sistema de `spacing`.
  - Aplicar `border-radius` consistente usando tokens para elementos como botões e inputs.
  - Implementar cores semânticas para estados (sucesso, erro, aviso) para feedback visual padronizado.
  - Tempo estimado: 3-4 horas

##### 3. Adicionar Validação em Tempo Real
- **Descrição**: Fornecer feedback imediato e claro ao usuário sobre a validade dos dados inseridos, prevenindo erros e guiando o preenchimento correto do formulário.
- [ ] **Fornecer feedback imediato durante preenchimento**
  - Implementar validação de quantidade de litros (ex: 0.1 - 200L) para evitar valores irrealistas.
  - Validar valor por litro (ex: R$ 0.50 - R$ 15.00) com base em faixas de preço razoáveis.
  - Validar formato de data automaticamente, convertendo para o padrão esperado.
  - Mostrar mensagens de erro `inline` próximas aos campos, em vez de alertas genéricos.
  - Implementar indicadores visuais de campo válido/inválido (ex: borda verde/vermelha).
  - Adicionar validação de KM (deve ser maior que o KM anterior se disponível) para consistência.
  - Tempo estimado: 4-5 horas

##### 4. Melhorar Feedback Visual e Microinterações
- **Descrição**: Tornar a interface mais dinâmica e responsiva através de animações e microinterações, melhorando a percepção de fluidez e a experiência do usuário.
- [ ] **Tornar interface mais responsiva e engajante**
  - Adicionar animações de `focus`/`blur` nos campos de input para indicar o elemento ativo.
  - Implementar transição suave para o cálculo do valor total ao alterar quantidade/preço.
  - Adicionar `loading states` contextuais (ex: spinner no botão de envio) para operações assíncronas.
  - Implementar feedback visual (ex: checkmark temporário) ao completar campos obrigatórios.
  - Adicionar animação de `pulse` para campos com erro, chamando a atenção para a correção.
  - Implementar `haptic feedback` (vibração) para dispositivos móveis em interações importantes.
  - Tempo estimado:
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)


#### 5.1.1. Melhorias Implementadas

##### 1. Indicadores Visuais para Campos Obrigatórios
- **Descrição**: Foram adicionados indicadores visuais (asteriscos vermelhos) aos campos obrigatórios na tela de adicionar despesa (`AddExpenseScreenOptimized.tsx`), garantindo que o usuário identifique facilmente quais campos precisam ser preenchidos. Isso melhora a usabilidade e reduz a ocorrência de erros de validação.

##### 2. Validação em Tempo Real
- **Descrição**: Foi implementada a validação em tempo real para o campo de valor da despesa (`AddExpenseScreenOptimized.tsx`). Agora, o sistema fornece feedback instantâneo ao usuário, informando se o valor inserido é válido ou não, prevenindo erros antes do envio do formulário e melhorando a experiência do usuário.

##### 3. Feedback Visual de Loading e Erro
- **Descrição**: Implementado feedback visual de loading e erro na tela de registro (`RegisterScreenOptimized.tsx`). Um estado de erro foi adicionado e um componente de texto exibe mensagens de erro, melhorando a experiência do usuário ao fornecer informações claras sobre o status da operação.

##### 4. Validação de Formulário Mais Robusta
- **Descrição**: As validações de nome, email e senha foram integradas diretamente no componente `FormInput` na tela de registro (`RegisterScreenOptimized.tsx`), utilizando as funções `validators` e `combineValidators` existentes. Isso removeu a necessidade de validação manual no `handleRegister`, tornando o formulário mais robusto e fácil de manter.

