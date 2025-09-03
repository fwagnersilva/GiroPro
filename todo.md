# TODO - Configuração GiroPro

## Status Atual
- [x] Backend compilado e funcionando na porta 3000
- [x] Frontend compilado e funcionando via arquivos estáticos na porta 8080
- [>] Banco de dados: Usando SQLite em memória temporariamente
- [ ] Integração frontend-backend completa
- [ ] Testes de fluxo completo de registro/login

## Decisão Técnica Importante
**BANCO EM MEMÓRIA TEMPORÁRIO**: Decidimos usar SQLite em memória (`:memory:`) temporariamente para resolver todos os problemas de integração e funcionalidade primeiro, antes de migrar para SQLite persistente. Isso permite focar na estabilidade do sistema sem problemas de migração.

## Próximas Tarefas
- [ ] Reiniciar backend com banco em memória
- [ ] Testar registro de usuário via API
- [ ] Testar login via API  
- [ ] Restaurar App.tsx original do frontend
- [ ] Testar integração completa frontend-backend
- [ ] Após tudo funcionando: migrar para SQLite persistente

## Problemas Resolvidos
- [x] Frontend renderizando (via build estático)
- [x] Backend compilando sem erros TypeScript
- [x] Configuração do Vite corrigida

## Problemas Identificados
- [>] Configuração do Vite em modo dev (resolvido via build)
- [>] Migrações do banco SQLite (contornado com memória)



## Esclarecimento: Banco em Memória

### O que é `:memory:`?
- **Localização:** RAM do servidor (não é arquivo)
- **Persistência:** ❌ Dados perdidos quando servidor para
- **Performance:** ⚡ Muito rápida (tudo na RAM)
- **Git:** ❌ Não vai para o Git (não é arquivo)

### Fluxo Atual:
1. Servidor inicia → Cria banco na RAM
2. Script SQL cria tabelas → Existem apenas na memória  
3. Aplicação usa → Dados ficam na RAM
4. Servidor para → Tudo é perdido

### Próximos Passos:
- [ ] Resolver problema de schema Drizzle
- [ ] Testar com dados temporários
- [ ] Migrar para `./giropro.db` (arquivo persistente)
- [ ] Configurar migrações adequadas

