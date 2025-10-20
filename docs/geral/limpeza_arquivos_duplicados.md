# Plano de Limpeza de Arquivos Duplicados

**Data:** 20/10/2025  
**Autor:** Equipe GiroPro  
**Status:** ✅ Executado

---

## Contexto

Durante a análise do projeto, foram identificados arquivos duplicados entre a estrutura raiz (`/app/`, `/src/`) e a pasta `frontend/`. A pasta `frontend/` contém um boilerplate React Native completo (218 arquivos) com configurações importantes de CI/CD, testes E2E e scripts de build.

**Decisão:** Remover APENAS os arquivos duplicados de login/auth, mantendo o resto da estrutura da pasta `frontend/`.

---

## Arquivos Removidos

### 1. Login e Autenticação Duplicados

| Arquivo | Motivo da Remoção |
|---------|-------------------|
| `frontend/src/app/login.tsx` | Duplicado de `app/login.tsx` (versão raiz está ativa) |
| `frontend/src/components/login-form.tsx` | Duplicado de `src/components/LoginForm.tsx` (versão raiz está ativa) |
| `frontend/src/services/authService.ts` | Duplicado de `src/services/authService.ts` (versão raiz está ativa e atualizada) |

**Total:** 3 arquivos removidos

---

## Arquivos Mantidos

### Arquivos de Teste (Úteis para Referência)

| Arquivo | Motivo |
|---------|--------|
| `frontend/src/components/__tests__/login-form.spec.tsx` | Testes úteis para referência futura |
| `frontend/src/components/login-form.test.tsx` | Testes úteis para referência futura |

### Testes E2E (Importantes)

| Arquivo | Motivo |
|---------|--------|
| `.maestro/auth/login-with-validation.yaml` | Testes E2E importantes |
| `.maestro/utils/login.yaml` | Utilitário de login para testes |
| `.maestro/utils/onboarding-and-login.yaml` | Teste de onboarding + login |

### Biblioteca de Auth (Referência)

| Pasta | Motivo |
|-------|--------|
| `frontend/src/lib/auth/` | Implementação Zustand de autenticação (útil para referência futura) |

### Toda a Estrutura de CI/CD e Configurações

A pasta `frontend/` contém recursos importantes que foram mantidos:
- `.github/workflows/*` - Workflows de CI/CD
- `.github/actions/*` - Actions customizadas
- `.maestro/*` - Testes E2E com Maestro
- `.env.*` - Variáveis de ambiente
- Scripts de build e deploy
- Configurações do projeto

---

## Justificativa

### Por que NÃO remover a pasta `frontend/` completa?

1. **Contém 218 arquivos** com configurações importantes
2. **CI/CD:** Workflows do GitHub Actions
3. **Testes E2E:** Suite completa de testes com Maestro
4. **Scripts:** Automações de build e deploy
5. **Configurações:** Ambientes de desenvolvimento, staging e produção

### Por que remover apenas os 3 arquivos?

1. **Duplicação:** Mesma funcionalidade implementada em dois lugares
2. **Confusão:** Desenvolvedores podem editar arquivos errados
3. **Manutenção:** Dificulta evolução do código
4. **Versão Ativa:** A estrutura raiz (`/app/`, `/src/`) está sendo usada

---

## Estrutura Após Limpeza

```
GiroPro/
├── app/                           # ✅ ATIVO - Rotas Expo Router
│   ├── login.tsx                 # Tela de login principal
│   └── (auth)/
│       ├── jornadas.tsx
│       └── vehicles.tsx
│
├── src/                           # ✅ ATIVO - Componentes e serviços
│   ├── components/
│   │   ├── LoginForm.tsx         # Formulário de login principal
│   │   ├── EmailInput.tsx        # Novo componente
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx       # Context de autenticação
│   └── services/
│       └── authService.ts        # Serviço de auth (atualizado)
│
├── frontend/                      # ✅ MANTIDO - Boilerplate e configs
│   ├── .github/                  # CI/CD
│   ├── .maestro/                 # Testes E2E
│   ├── src/
│   │   ├── app/
│   │   │   └── login.tsx         # ❌ REMOVIDO
│   │   ├── components/
│   │   │   ├── login-form.tsx    # ❌ REMOVIDO
│   │   │   └── __tests__/        # ✅ MANTIDO (testes úteis)
│   │   ├── lib/
│   │   │   └── auth/             # ✅ MANTIDO (referência Zustand)
│   │   └── services/
│   │       └── authService.ts    # ❌ REMOVIDO
│   └── ...
│
└── backend/                       # ✅ API Backend
```

---

## Comandos Executados

```bash
# Remover arquivos duplicados
rm /home/ubuntu/GiroPro/frontend/src/app/login.tsx
rm /home/ubuntu/GiroPro/frontend/src/components/login-form.tsx
rm /home/ubuntu/GiroPro/frontend/src/services/authService.ts
```

---

## Verificação Pós-Limpeza

### Checklist

- [x] Arquivos duplicados removidos
- [x] Estrutura de CI/CD mantida
- [x] Testes E2E mantidos
- [x] Biblioteca de auth (Zustand) mantida como referência
- [x] Testes unitários mantidos
- [x] Documentação atualizada

### Arquivos que Permaneceram

```bash
# Total de arquivos na pasta frontend após limpeza
find frontend/ -type f | grep -v node_modules | wc -l
# Resultado esperado: ~215 arquivos (218 - 3)
```

---

## Impacto

### Positivo

✅ Elimina confusão sobre qual arquivo editar  
✅ Mantém apenas a estrutura ativa  
✅ Preserva recursos importantes (CI/CD, testes)  
✅ Facilita manutenção futura  

### Riscos Mitigados

⚠️ **Risco:** Perder código útil da pasta `frontend/`  
✅ **Mitigação:** Mantida toda a estrutura, removidos apenas 3 arquivos duplicados

⚠️ **Risco:** Quebrar testes E2E  
✅ **Mitigação:** Testes E2E mantidos intactos

---

## Próximos Passos

1. **Testar aplicação:**
   - Verificar se login funciona corretamente
   - Testar em Web, Android e iOS

2. **Executar testes E2E:**
   - Rodar suite de testes Maestro
   - Verificar se testes de login passam

3. **Documentar decisão:**
   - ✅ Documento criado em `docs/geral/limpeza_arquivos_duplicados.md`
   - ✅ Análise da estrutura em `ANALISE_PASTA_FRONTEND.md`

4. **Commit e push:**
   - Commit das mudanças
   - Push para repositório

---

## Referências

- [Análise da Pasta Frontend](../../ANALISE_PASTA_FRONTEND.md)
- [Estrutura Duplicada do Projeto](../../ESTRUTURA_DUPLICADA_PROJETO.md)
- [Documentação da Tela de Login](../frontend/telas/login.md)

---

**Executado em:** 20/10/2025  
**Responsável:** Equipe GiroPro  
**Status:** ✅ Concluído

