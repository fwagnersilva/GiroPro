# Lista de Tarefas - GiroPro

## Documentação de Setup e Onboarding
- [x] Revisar e ajustar o "Troubleshooting Básico" e "Checklist de Setup Rápido" no `GUIA_DE_SETUP_COMPLETO.md`
- [ ] Atualizar referências nos documentos para o novo `GUIA_DE_SETUP_COMPLETO.md`
- [x] Remover arquivos antigos (`docs/GUIA_SETUP_DESENVOLVEDOR.md` e `docs/01_tutoriais/01SetupInicial.md`)
- [x] Atualizar `docs/README.md` (se existir) para apontar para o novo `GUIA_DE_SETUP_COMPLETO.md` - N/A (arquivo não existe)

## Consistência de Nomenclatura e Framework Backend
- [x] Padronizar Nomenclatura para `camelCase` em `src/db/schema.ts` e refatorar código backend e frontend
- [ ] Atualizar migrações se necessário
- [ ] Atualizar documentação para refletir `camelCase`
- [x] Corrigir Inconsistência do Framework Backend (alterar "Fastify" para "Express.js" em documentos)

## Aprofundamento e Expansão da Documentação
- [x] Criar `docs/04_referencias/01_documentacao_banco_dados.md` e gerar Diagrama ER
- [ ] Criar Dicionário de Dados e documentar Migrações e Padrões de Acesso a Dados
- [ ] Criar `docs/04_referencias/02_documentacao_testes.md` e detalhar a estratégia de testes
- [ ] Criar `docs/04_referencias/03_guia_deploy.md` e fornecer um guia detalhado para o deploy
- [ ] Criar `docs/04_referencias/04_documentacao_seguranca.md` e detalhar as práticas de segurança
- [ ] Criar `docs/04_referencias/05_design_system.md` e criar um guia para o design system do frontend

## Melhorias de Formato e Usabilidade
- [ ] Inserir Diagramas e Visualizações (atualizar `docs/03_explicacoes/01ArquiteturaGeral.md`)
- [ ] Utilizar Tabelas para organizar informações (Endpoints da API, Variáveis de Ambiente, Scripts)
- [ ] Garantir Referências Cruzadas Clicáveis em todos os documentos
- [ ] Criar Glossário (`docs/04_referencias/06_glossario.md`)

## Resolução de Problemas e Vulnerabilidades
- [ ] Resolver Erros TypeScript Restantes
- [ ] Resolver Vulnerabilidades de Segurança Moderadas

## Atualização do progresso.md
- [ ] Manter o `progresso.md` como um diário de bordo atualizado e estruturado




## Tarefas para Padronização de Nomenclatura (camelCase)

### Fase 1: Clonar repositório e análise inicial
- [x] Clonar o repositório GiroPro do GitHub.

### Fase 2: Análise e mapeamento completo do schema e código
- [x] Revisar completamente o arquivo `src/db/schema.ts` e listar todas as colunas e tabelas que não seguem o padrão camelCase.
- [x] Identificar todos os arquivos no backend que serão impactados pela mudança no schema (ex: services, controllers, repositories).
- [x] Identificar todos os arquivos no frontend que consomem ou enviam dados para as colunas que serão renomeadas.

### Fase 3: Atualização do schema do banco de dados
- [ ] Renomear todas as colunas e tabelas identificadas no passo 1.1 para o padrão camelCase no arquivo `src/db/schema.ts`.
- [ ] Gerar e aplicar a migração do banco de dados para refletir as mudanças do schema.

### Fase 4: Refatoração do código backend
- [ ] Atualizar o código do backend (services, controllers, queries, etc.) para usar a nova nomenclatura definida no schema.
- [ ] Executar os testes do backend para garantir que nenhuma funcionalidade foi quebrada. Se não houver testes, este seria um bom momento para adicioná-los.

### Fase 5: Refatoração do código frontend
- [ ] Atualizar o código do frontend (componentes, services, hooks, etc.) para corresponder à nova nomenclatura da API.
- [ ] Testar manualmente as interfaces de usuário afetadas para garantir que os dados estão sendo exibidos e enviados corretamente.

### Fase 6: Revisão, validação e entrega dos resultados
- [ ] Fazer uma revisão completa (code review) das mudanças no backend e no frontend. (Falha: Erros de TypeScript no schema)
- [ ] Realizar um teste de ponta a ponta (end-to-end) para validar o fluxo completo da aplicação com a nova padronização.

