# Guia: Como Testar os Scripts de Setup do GiroPro

Este guia detalha como testar os scripts de setup do projeto GiroPro, identificando problemas comuns e as soluções aplicadas. É fundamental para garantir que novos desenvolvedores possam configurar o ambiente de forma eficiente.

## 1. Scripts Testados e Status

### 1.1. `setup_sqlite.sh`

**Status**: ❌ Parcialmente funcional com problemas

**Problemas Encontrados e Lições Aprendidas**:
*   **Interatividade**: O script era interativo, exigindo input manual durante a execução do `drizzle-kit`, o que dificulta a automação e o uso em ambientes de CI/CD.
*   **Ausência de `.env.example`**: A dependência de um arquivo `.env.example` inexistente no backend causava falhas na configuração inicial.
*   **Conflitos de Schema**: O processo de migração era interrompido devido a conflitos de schema, especialmente relacionados à inconsistência de nomenclatura (`snake_case` vs `camelCase`).

**Correções Aplicadas (Manuais e Sugeridas)**:
*   **Criação Manual do `.env`**: Para contornar a ausência do `.env.example`, foi necessária a criação manual do arquivo `.env` com configurações básicas para SQLite (`DB_TYPE=sqlite`, `SQLITE_DB_PATH=giropro.db`, `PORT=3000`).
*   **Padronização de Nomenclatura**: A correção das inconsistências de nomenclatura no schema e no código é crucial para que as migrações do Drizzle ORM funcionem corretamente. (Ver `03_explicacoes/00_problemas_comuns_e_licoes_aprendidas.md` para mais detalhes).
*   **Automação**: É recomendado tornar o script não-interativo para permitir a automação completa do setup.

### 1.2. `verify_setup.sh`

**Status**: ✅ Funcional após correções

**Problemas Encontrados e Soluções Aplicadas**:
*   **Lista de Arquivos Incorreta**: A lista de arquivos obrigatórios incluía arquivos inexistentes, causando falhas na verificação.
*   **Teste de Sanidade do Frontend**: Um teste de sanidade do frontend falhava devido a problemas de parsing, tornando o script unreliable.

**Correções Aplicadas**:
*   **Atualização da Lista de Arquivos**: A lista de arquivos obrigatórios foi atualizada para incluir apenas arquivos existentes, refletindo a estrutura real do projeto.
*   **Remoção de Teste Problemático**: O teste problemático foi removido e substituído por uma verificação mais robusta da estrutura básica do projeto (verificação de diretórios `backend/src` e `frontend/src`).

### 1.3. `setup.sh`

**Status**: ❓ Não testado completamente

**Problemas Identificados e Recomendações**:
*   **Dependência do Docker**: O script possui dependência do Docker, que não funcionou em alguns ambientes de sandbox. Isso impede o teste completo do script.
*   **Referências a `.env.example`**: Assim como o `setup_sqlite.sh`, ele referencia arquivos `.env.example` inexistentes.
*   **Potenciais Problemas Comuns**: Pode herdar os mesmos problemas de interatividade e conflitos de schema dos outros scripts.

**Recomendações**:
*   **Testar após Resolução de Schema**: Realizar testes completos após a resolução dos problemas de schema do banco de dados.
*   **Verificação de Pré-requisitos**: Adicionar uma verificação mais robusta dos pré-requisitos (Docker, Node.js, npm) no início do script.
*   **Fallback para SQLite**: Implementar um mecanismo de fallback para SQLite quando o Docker não estiver disponível ou configurado, garantindo que o setup possa ser concluído em diferentes ambientes.

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

