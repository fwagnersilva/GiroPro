# Progresso do Projeto GiroPro

## 🔴 Prioridade Crítica

### Oportunidades de Melhoria - Complexidade Baixa

Fase 1: Revisar e Priorizar Telas
1.1. Revisar as telas existentes no projeto GiroPro.
1.2. Identificar as telas que precisam ser simplificadas ou recriadas com base na experiência anterior de complexidade.
1.3. Priorizar as telas a serem desenvolvidas, começando pelas mais críticas (ex: Login, Registro, Dashboard, Despesas, Abastecimentos).

Fase 2: Definir Escopo de Cada Tela Simplificada
2.1. Para cada tela priorizada, definir o escopo mínimo viável, focando nas funcionalidades essenciais.
2.2. Mapear os campos necessários para cada tela com os campos existentes no banco de dados (verificar src/db/schema.ts e documentação de API).
2.3. Documentar o escopo e o mapeamento de campos para cada tela (pode ser em um novo documento ou seção no 09_progresso.md).

Fase 3: Desenvolver Telas Simplificadas (Frontend)
3.1. Criar os novos componentes e telas no frontend (src/screens/ e src/components/) seguindo o padrão simple.tsx.
3.2. Utilizar os padrões de design e componentes reutilizáveis existentes (src/components/, src/styles/, src/theme/).
3.3. Implementar a lógica de UI/UX para cada tela, incluindo feedback visual (loading, sucesso, erro) e validações de campos.
3.4. Garantir que as novas telas utilizem a nomenclatura camelCase para todos os campos e variáveis.

Fase 4: Integrar Frontend com Backend Existente
4.1. Conectar as novas telas simplificadas às APIs existentes do backend (src/services/).
4.2. Substituir dados mockados por chamadas reais à API.
4.3. Garantir que a comunicação entre frontend e backend utilize os campos e formatos de dados definidos no banco de dados existente.

Fase 5: Testar Funcionalidades das Novas Telas
5.1. Realizar testes manuais em todas as novas telas para verificar a funcionalidade básica (CRUD).
5.2. Escrever e executar testes unitários e de integração para os novos componentes e fluxos.
5.3. Testar o fluxo de autenticação completo (registro/login) com as novas telas.
5.4. Verificar a responsividade das novas telas em diferentes tamanhos de tela (web e mobile).

Fase 6: Remover Telas Antigas e Não Úteis
6.1. Após a validação das novas telas simplificadas, identificar e remover os arquivos das telas antigas e complexas que não serão mais utilizadas.
6.2. Remover quaisquer referências a essas telas antigas no código (rotas, navegação, imports).
6.3. Realizar uma limpeza geral no código para remover dependências desnecessárias.

- [ ] **Adicionar Validação de Campos Específicos:** Implementar validações específicas como formato de placa, valores monetários e datas nos formulários.
- [ ] **Melhorar Feedback Visual:** Adicionar loading states, success messages e error handling mais robustos nas operações CRUD.
- [ ] **Reorganizar Hierarquia de Campos:** Otimizar a disposição dos campos no formulário para seguir um fluxo lógico e intuitivo de preenchimento, reduzindo a carga cognitiva do usuário.
- [ ] **Adicionar Validação em Tempo Real:** Fornecer feedback imediato e claro ao usuário sobre a validade dos dados inseridos, prevenindo erros e guiando o preenchimento correto do formulário.
- [ ] **Melhorar Feedback Visual e Microinterações:** Tornar a interface mais dinâmica e responsiva através de animações e microinterações, melhorando a percepção de fluidez e a experiência do usuário.

### Oportunidades de Melhoria - Complexidade Média

- [>] **Corrigir erro na tela de despesas**: ExpensesScreen.simple.tsx apresenta erro de renderização na linha 22, causando tela branca.
  - **Progresso**: Erro identificado no console do navegador. Referências de `categoria` para `tipoDespesa` e `data` para `dataDespesa` corrigidas. Erros de digitação `fontSizeize` e `fontSiz` para `fontSize` corrigidos. Ainda há um erro de renderização que impede a tela de ser exibida corretamente.
  - **Próximo passo**: Investigar o erro de renderização que causa a tela branca, possivelmente relacionado a um componente ou estilo não resolvido, ou um erro lógico no mapeamento dos dados.
- [>] **Testar integração frontend-backend**: Validar comunicação entre as aplicações. 
  - **Progresso**: Backend e frontend estão rodando, autenticação e listagem de veículos funcionam. Necessário testar o fluxo completo de criação/edição de dados.
- [ ] **Implementar Tela de Abastecimentos:** Criar `FuelingsScreen.simple.tsx` seguindo a estrutura do banco de dados com campos: id_veiculo, data_abastecimento, tipo_combustivel, quantidade_litros, valor_litro, km_atual, nome_posto.
- [ ] **Conectar Formulários com APIs Reais:** Substituir mock data por chamadas reais para as APIs do backend nas telas de Veículos e Despesas.
- [ ] **Implementar Seleção de Veículos nos Formulários:** Adicionar dropdown/picker para seleção de veículos cadastrados nos formulários de despesas e abastecimentos.
- [ ] **Implementar Navegação Web:** Configurar o React Navigation para funcionar no ambiente web, permitindo a transição entre as telas.
- [ ] **Refatorar Componentes Incompatíveis:** Adaptar ou criar versões web-compatíveis de componentes que usam elementos nativos do React Native (ex: `FormInput.tsx`).
- [ ] **Testar Fluxo de Autenticação Completo na Web:** Validar o registro e login de usuários na interface web, garantindo a comunicação correta com o backend.
- [>] **Resolver Vulnerabilidades de Segurança Restantes:** Investigar e resolver as 7 vulnerabilidades restantes no frontend (2 moderadas, 5 altas) relacionadas a dependências do Expo SDK.
  - **Progresso:** Vulnerabilidades conhecidas documentadas, baixo risco para desenvolvimento. Não bloqueia o desenvolvimento atual.
  - **Observação:** Necessário monitorar atualizações do Expo SDK.

### Oportunidades de Melhoria - Complexidade Alta

- [ ] **Implementar Adaptações por Plataforma:** Criar variações específicas dos componentes para iOS, Android e Web seguindo as diretrizes de design de cada plataforma.
- [ ] **Otimizar Performance das Animações:** Garantir que as animações sejam fluidas e não impactem a performance, especialmente em dispositivos mais antigos.
- [ ] **Criar Sistema de Temas Dinâmico:** Implementar alternância entre tema claro e escuro com persistência de preferência do usuário.
- [ ] **Implementar Testes Automatizados:** Garantir a qualidade do código e prevenir regressões futuras com a criação de testes automatizados.
- [ ] **Otimizar Performance:** Garantir que o aplicativo seja rápido e responsivo, mesmo em dispositivos mais antigos.
- [ ] **Documentar Componentes e Padrões:** Facilitar a manutenção e a colaboração no projeto com uma documentação clara e abrangente.

## 🟢 Prioridade Baixa

### Polimento e Funcionalidades Avançadas (UX/UI)
- [ ] **Ícones e Elementos Visuais**
  - **Descrição:** Tornar a interface mais informativa e agradável visualmente com o uso de ícones e outros elementos gráficos.
- [ ] **Cores e Contraste**
  - **Descrição:** Garantir que a paleta de cores seja esteticamente agradável, funcional e acessível.
- [ ] **Layout e Espaçamento**
  - **Descrição:** Criar um layout bem estruturado e responsivo que se adapte a diferentes tamanhos de tela.
- [ ] **Animações e Transições**
  - **Descrição:** Adicionar movimento à interface para torná-la mais dinâmica e engajante.
- [ ] **Feedback Háptico (Mobile)**
  - **Descrição:** Utilizar a vibração do dispositivo para fornecer feedback físico em interações importantes.
- [ ] **Estados Interativos**
  - **Descrição:** Fornecer feedback visual claro para todas as interações do usuário.
- [ ] **Adaptações por Plataforma**
  - **Descrição:** Otimizar a experiência do usuário para as convenções de design de cada plataforma (iOS, Android, Web).

### Infraestrutura e Qualidade
- [ ] **Implementar Testes Automatizados**
  - **Descrição:** Garantir a qualidade do código e prevenir regressões futuras com a criação de testes automatizados.
- [ ] **Otimizar Performance**
  - **Descrição:** Garantir que o aplicativo seja rápido e responsivo, mesmo em dispositivos mais antigos.
- [ ] **Documentar Componentes e Padrões**
  - **Descrição:** Facilitar a manutenção e a colaboração no projeto com uma documentação clara e abrangente.


