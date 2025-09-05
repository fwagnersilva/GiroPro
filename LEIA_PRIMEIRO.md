# 🚀 GiroPro - LEIA PRIMEIRO

## ⚡ Configuração Rápida

### 1. Backend (Porta 3000)
```bash
cd backend
npm install
npm run build
npm start
```

### 2. Frontend (Porta 19006)
```bash
cd frontend
npm install --legacy-peer-deps
npm run web-vite
```

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

## 📊 Status Atual

### ✅ Funcionando
- Backend na porta 3000
- Frontend na porta 19006
- APIs de autenticação
- Banco em memória com tabelas

### ❌ Problemas Conhecidos
- Tela branca no frontend (React Native Web)
- Banco SQLite persistente (será resolvido futuramente)

## 📚 Documentação

- **Progresso**: `docs/progresso.md`
- **Arquitetura**: `docs/03_explicacoes/01_arquitetura_geral.md`
- **Setup Completo**: `docs/01_tutoriais/01_setup_completo.md`
- **Problemas Conhecidos**: `docs/03_explicacoes/00_problemas_comuns_e_licoes_aprendidas.md`

## 🔗 URLs Importantes

- **Backend Health**: http://localhost:3000/health
- **Backend Test**: http://localhost:3000/api/test
- **Frontend**: http://localhost:19006

---

**Última atualização**: 05/09/2025  
**Próxima revisão**: Quando migrar para SQLite persistente

