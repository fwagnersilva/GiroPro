## Análise de Nomenclatura em `src/db/schema.ts`

### Tabelas a serem padronizadas (snake_case para camelCase):
- `historico_preco_combustivel` -> `historicoPrecoCombustivel`
- `logs_atividades` -> `logsAtividades`

### Colunas a serem padronizadas (já estão em camelCase, mas revisar os índices):
- Todas as colunas parecem já seguir o padrão camelCase.

### Índices a serem padronizados (associados às tabelas acima):
- `historico_local_idx` -> `historicoLocalIdx`
- `historico_combustivel_idx` -> `historicoCombustivelIdx`
- `historico_data_idx` -> `historicoDataIdx`
- `historico_local_data_idx` -> `historicoLocalDataIdx`
- `logs_usuario_idx` -> `logsUsuarioIdx`
- `logs_tipo_idx` -> `logsTipoIdx`
- `logs_data_idx` -> `logsDataIdx`
- `logs_usuario_data_idx` -> `logsUsuarioDataIdx`

### Próximos passos:
- Identificar arquivos no backend e frontend impactados por essas mudanças.



### Arquivos Backend Impactados por `historico_preco_combustivel`:
- `backend/src/db/schema.ts`
- `backend/src/services/fuel_prices_service.ts`
- `backend/drizzle-sqlite/0000_stiff_lizard.sql` (e outros arquivos de migração)
- `backend/drizzle-sqlite/meta/0000_snapshot.json` (e outros arquivos de snapshot)
- `backend/drizzle/0000_adorable_gunslinger.sql` (e outros arquivos de migração)
- `backend/drizzle/meta/0000_snapshot.json` (e outros arquivos de snapshot)
- `backend/schema_analysis.sql`




### Arquivos Backend Impactados por `logs_atividades`:
- `backend/src/db/schema.ts`
- `backend/drizzle-sqlite/0000_stiff_lizard.sql` (e outros arquivos de migração)
- `backend/drizzle-sqlite/meta/0000_snapshot.json` (e outros arquivos de snapshot)
- `backend/drizzle/0000_adorable_gunslinger.sql` (e outros arquivos de migração)
- `backend/drizzle/meta/0000_snapshot.json` (e outros arquivos de snapshot)
- `backend/schema_analysis.sql`




### Arquivos Frontend Impactados:
Embora os nomes exatos das tabelas `historico_preco_combustivel` e `logs_atividades` não apareçam diretamente no código do frontend, é crucial entender que qualquer alteração na estrutura de dados ou nos endpoints da API do backend, que são reflexo do schema do banco de dados, impactará o frontend. Será necessário revisar os componentes e serviços do frontend que consomem dados relacionados a essas tabelas para garantir a compatibilidade com a nova nomenclatura camelCase.



