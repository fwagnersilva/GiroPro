# 🚀 GiroPro - LEIA PRIMEIRO

## ⚡ Configuração Rápida

Para um setup completo do ambiente de desenvolvimento, incluindo backend e frontend, por favor, consulte o [Guia de Setup Completo](docs/01_tutoriais/01_setup_completo.md).

## 🎯 DECISÃO ESTRATÉGICA - Banco de Dados

**IMPORTANTE:** Atualmente usando **banco em memória** para desenvolvimento:

### Configuração Atual (.env)
```env
SQLITE_DB_PATH=:memory:
JWT_SECRET=minha_chave_secreta_super_segura_para_desenvolvimento
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### Por que Banco em Memória?
- ✅ **Velocidade**: Muito mais rápido para desenvolvimento
- ✅ **Limpeza automática**: Recria do zero a cada reinicialização
- ✅ **Sem conflitos**: Não há problemas de arquivo bloqueado/corrompido
- ✅ **Ideal para testes**: Cada teste tem um banco limpo
- ✅ **Sem configuração**: Não precisa gerenciar arquivos

### Migração Futura para SQLite Persistente
Quando necessário, alterar no `.env`:
```env
SQLITE_DB_PATH=./giropro.db
```





## 📚 Documentação

- **Progresso**: [Progresso do Projeto](docs/03_explicacoes/09_progresso.md)
- **Arquitetura**: [Arquitetura Geral do Sistema](docs/03_explicacoes/01_arquitetura_geral.md)
- **Setup Completo**: [Guia de Setup Completo](docs/01_tutoriais/01_setup_completo.md)
- **Problemas Conhecidos**: [Problemas Comuns e Lições Aprendidas](docs/03_explicacoes/00_problemas_comuns_e_licoes_aprendidas.md)

## 🔗 URLs Importantes

- **Backend Health**: http://localhost:3000/health
- **Backend Test**: http://localhost:3000/api/test
- **Frontend**: http://localhost:19006

---

**Última atualização**: 05/09/2025  
**Próxima revisão**: Quando migrar para SQLite persistente

