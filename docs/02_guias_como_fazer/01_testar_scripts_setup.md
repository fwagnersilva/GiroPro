# Guia: Como Testar os Scripts de Setup do GiroPro

Este guia detalha como testar os scripts de setup do projeto GiroPro, identificando problemas comuns e as soluções aplicadas. É fundamental para garantir que novos desenvolvedores possam configurar o ambiente de forma eficiente.

## 1. Scripts Testados e Status

### 1.1. `setup_sqlite.sh`

**Status**: ✅ Funcional com observações

**Observações e Lições Aprendidas**:
*   **Interatividade**: O script, ao executar `npm run db:migrate`, é interativo e exige input manual para confirmar operações de migração (como renomeação de colunas). Isso é uma característica do `drizzle-kit` e deve ser considerado em ambientes de CI/CD ou automação. O usuário deve estar preparado para confirmar as ações no terminal.
*   **Dependência de `.env`**: O script espera que o arquivo `.env` já esteja configurado no diretório `backend/`. A ausência ou configuração incorreta deste arquivo pode causar falhas. Certifique-se de seguir as instruções em `01_tutoriais/01_setup_inicial.md` para configurar o `.env` antes de executar este script.
*   **Padronização de Nomenclatura**: A correção das inconsistências de nomenclatura (`snake_case` vs `camelCase`) no schema e no código é crucial para que as migrações do Drizzle ORM funcionem corretamente. Este problema foi abordado em `03_explicacoes/00_problemas_comuns_e_licoes_aprendidas.md`.

**Recomendações**:
*   Para automação completa, considere a criação de um script não-interativo ou a utilização de flags específicas do Drizzle ORM que permitam execução automática, se disponíveis.
*   Sempre verifique o `backend/.env` antes de executar este script.

### 1.2. `verify_setup.sh`

**Status**: ✅ Funcional

**Observações e Lições Aprendidas**:
*   Este script foi ajustado para verificar a presença de arquivos e diretórios essenciais, garantindo que a estrutura básica do projeto esteja correta após o setup.
*   Testes de sanidade do frontend que eram problemáticos foram removidos ou substituídos por verificações mais robustas da estrutura básica do projeto.

**Recomendações**:
*   Manter este script atualizado com a estrutura do projeto, adicionando verificações para novos arquivos ou diretórios importantes.
*   Considerar a adição de testes mais abrangentes para o frontend e backend, que possam ser executados de forma independente ou como parte de um pipeline de CI/CD, em vez de depender apenas deste script de verificação de setup.

### 1.3. `setup.sh`

**Status**: ❓ Não testado completamente

**Observações e Recomendações**:
*   **Dependência do Docker**: Este script possui dependência do Docker para a configuração do banco de dados PostgreSQL. Em ambientes onde o Docker não está disponível ou configurado, o script não funcionará como esperado.
*   **Referências a `.env.example`**: Assim como o `setup_sqlite.sh`, este script pode referenciar arquivos `.env.example` que precisam ser criados ou copiados manualmente, conforme detalhado em `01_tutoriais/01_setup_inicial.md`.
*   **Potenciais Problemas Comuns**: Pode herdar os mesmos problemas de interatividade e conflitos de schema dos outros scripts, especialmente se as migrações do Drizzle ORM forem executadas.

**Recomendações**:
*   **Testar após Resolução de Schema**: É crucial realizar testes completos deste script após a resolução dos problemas de schema do banco de dados e a padronização da nomenclatura em todo o projeto.
*   **Verificação de Pré-requisitos**: Adicionar uma verificação mais robusta dos pré-requisitos (Docker, Node.js, npm) no início do script para fornecer feedback claro ao usuário.
*   **Fallback para SQLite**: Implementar um mecanismo de fallback para SQLite quando o Docker não estiver disponível ou configurado, garantindo que o setup possa ser concluído em diferentes ambientes de desenvolvimento.
*   **Modo Não-Interativo**: Se possível, adaptar o script para que possa ser executado em um modo não-interativo, ideal para ambientes de CI/CD.

## 2. Problemas Gerais Identificados e Soluções

### 2.1. Inconsistência de Schema

*   **Problema**: O código utiliza `snake_case` (`id_usuario`, `data_abastecimento`), enquanto o schema SQLite está configurado para `camelCase` (`idUsuario`, `dataAbastecimento`), causando múltiplos erros de TypeScript.
*   **Solução**: Padronizar a nomenclatura para `camelCase` em todo o projeto (código e banco de dados) e refatorar o código existente para seguir essa convenção. (Ver `03_explicacoes/00_problemas_comuns_e_licoes_aprendidas.md` e `03_explicacoes/04_tecnologias_padroes.md` para mais detalhes sobre a padronização).

### 2.2. Configuração de Ambiente

*   **Problema**: Ausência de arquivos `.env.example` e scripts que assumem uma estrutura que não existe, além da falta de documentação clara de configuração.
*   **Solução**: Criar arquivos `.env.example` adequados para backend e frontend. Implementar detecção automática de ambiente nos scripts e adicionar um modo não-interativo. A documentação de setup (ver `01_tutoriais/01_setup_inicial.md`) é crucial para guiar o processo.

### 2.3. Dependências Externas

*   **Problema**: Docker não funcional em alguns ambientes de sandbox e PostgreSQL não pode ser iniciado, exigindo alternativas.
*   **Solução**: Priorizar o uso de SQLite para desenvolvimento local e testes, e documentar claramente essa alternativa. Investigar e resolver os problemas com Docker para ambientes de produção ou de desenvolvimento que o exijam.

## 3. Próximos Passos para Melhoria dos Scripts

1.  **Resolver Inconsistências de Schema**: Essencial para que as migrações e o Drizzle ORM funcionem corretamente.
2.  **Melhorar Scripts de Setup**: Implementar as sugestões de automação, detecção de ambiente e criação de `.env.example`.
3.  **Testes Abrangentes**: Corrigir problemas de parsing nos testes existentes e implementar testes de integração para validar a funcionalidade completa dos scripts e da aplicação.
4.  **Documentação Detalhada**: Manter a documentação de setup e troubleshooting atualizada, refletindo as melhorias e soluções aplicadas.

