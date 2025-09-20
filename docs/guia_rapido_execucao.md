# Guia Rápido de Execução - GiroPro

## Pré-requisitos Verificados ✅
- Node.js v22.13.0
- npm v10.9.2
- Dependências instaladas

## Execução Rápida

### 1. Backend
```bash
cd backend
npm run dev
```
**Status**: ✅ Rodando na porta 3000

### 2. Frontend
```bash
cd frontend
npm run web-vite
```
**Status**: ✅ Rodando na porta 19007

### 3. Acesso
- **Frontend**: http://localhost:19007
- **Backend**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### 4. Login de Teste
- **Email**: test@test.com
- **Senha**: 123456

## Funcionalidades Testadas ✅
- ✅ Autenticação
- ✅ Dashboard
- ✅ Listagem de veículos
- ✅ Listagem de despesas
- ✅ Navegação entre telas

## Próximas Ações Recomendadas

### Imediatas (Prioridade Crítica)
1. Implementar formulários de adição (veículos, despesas, abastecimentos)
2. Corrigir erro de renderização em ExpensesScreen.simple.tsx
3. Adicionar validações de campos

### Médio Prazo
1. Melhorar navegação web
2. Implementar seleção de veículos nos formulários
3. Testes de integração completos

## Comandos Úteis

### Verificar Status
```bash
# Backend health check
curl http://localhost:3000/health

# API test
curl http://localhost:3000/api/test
```

### Parar Serviços
```bash
# Ctrl+C nos terminais do backend e frontend
```

### Reinstalar Dependências (se necessário)
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install --legacy-peer-deps
```

