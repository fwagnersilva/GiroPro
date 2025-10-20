# Documentação da Tela de Login

**Arquivo:** `app/login.tsx` + `src/components/LoginForm.tsx`  
**Última Atualização:** 20/10/2025  
**Autor:** Equipe GiroPro

---

## Visão Geral

A tela de **Login** é a porta de entrada para o aplicativo GiroPro. Ela é responsável por autenticar o usuário e iniciar a sessão, permitindo acesso às funcionalidades protegidas do sistema.

---

## Funcionalidades

### 1. Autenticação de Usuário

Permite que o usuário insira suas credenciais para acessar o sistema.

**Campos Obrigatórios:**
- Email
- Senha

**Validações:**
- Email deve ter formato válido
- Senha deve ter pelo menos 6 caracteres

**Comportamento:**
- Valida campos antes de enviar
- Exibe loading durante autenticação
- Redireciona para dashboard em caso de sucesso
- Exibe mensagens de erro específicas em caso de falha

**Endpoint:** `POST /api/v1/auth/login`

---

### 2. Lembrar-me

Opção para manter o usuário logado em sessões futuras.

**Comportamento:**
- Checkbox opcional
- Armazena tokens de forma persistente
- Mantém sessão ativa entre fechamentos do app

---

### 3. Esqueci Minha Senha

Link para recuperação de senha.

**Status:** ⚠️ Não implementado (apenas `console.log`)

**Próximos Passos:**
- Criar tela de recuperação de senha
- Integrar com endpoint `/auth/forgot-password`

---

### 4. Criar Conta

Link para tela de registro de novos usuários.

**Comportamento:**
- Navega para `/register`
- Permite cadastro de novos usuários

---

## Regras de Negócio

### Validações de Formulário

| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| Email | Obrigatório | "Email é obrigatório" |
| Email | Formato válido | "Email inválido" |
| Senha | Obrigatória | "Senha é obrigatória" |
| Senha | Mínimo 6 caracteres | "A senha deve ter pelo menos 6 caracteres" |

### Validação de Email

Utiliza regex para validar formato:

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Exemplos Válidos:**
- usuario@example.com
- nome.sobrenome@empresa.com.br
- teste123@mail.co

**Exemplos Inválidos:**
- usuario
- usuario@
- @example.com
- usuario@example

---

## Interface do Usuário

### Componentes Principais

#### 1. Logo e Título

Exibe a identidade visual do aplicativo no topo da tela.

**Elementos:**
- Logo do GiroPro
- Título "Bem-vindo de volta!"
- Subtítulo "Faça login para continuar"

#### 2. Formulário de Login

Campos de entrada para credenciais.

**Campos:**
- Email (EmailInput customizado)
- Senha (TextInput com botão "Mostrar/Ocultar")

**Características:**
- Validação em tempo real
- Feedback visual de erros (borda vermelha)
- Mensagens de erro abaixo dos campos

#### 3. Opções

Elementos adicionais do formulário.

**Elementos:**
- Checkbox "Lembrar-me"
- Link "Esqueci minha senha"

#### 4. Botão de Login

Botão principal para submeter o formulário.

**Estados:**
- Normal: Azul, texto "Entrar"
- Loading: Desabilitado, exibe ActivityIndicator
- Desabilitado: Opacidade reduzida

#### 5. Mensagem de Erro Global

Exibe erros retornados pela API.

**Exemplos:**
- "Email ou senha incorretos"
- "Usuário não encontrado"
- "Muitas tentativas de login. Tente novamente mais tarde"
- "Erro de conexão. Verifique sua internet"

#### 6. Link para Registro

Permite navegação para tela de cadastro.

**Texto:** "Não tem uma conta? Cadastre-se"

---

## Componentes Utilizados

### Componentes Customizados

| Componente | Descrição |
|------------|-----------|
| `EmailInput` | Input de email com validação de formato |

### Componentes React Native

- `View`, `Text`, `ScrollView`
- `TouchableOpacity` (botões e checkbox)
- `TextInput` (campo de senha)
- `ActivityIndicator` (loading)

---

## Integração com Backend

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/v1/auth/login` | Autentica o usuário |
| `POST` | `/api/v1/auth/register` | Registra novo usuário |
| `POST` | `/api/v1/auth/refresh` | Renova token de acesso |
| `POST` | `/api/v1/auth/logout` | Invalida sessão |

### Formato de Dados

**Login (POST /auth/login):**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "Nome do Usuário",
    "createdAt": "2025-10-20T10:00:00Z",
    "updatedAt": "2025-10-20T10:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": 1729450800000
  }
}
```

**Resposta de Erro:**
```json
{
  "message": "Email ou senha incorretos",
  "statusCode": 401
}
```

---

## Estados da Aplicação

### Context: `AuthContext`

```typescript
const {
  login,              // Função de login
  isLoading,          // Loading global
  error,              // Erro global
  clearError,         // Limpa erros
  isAuthenticated,    // Status de autenticação
} = useAuth();
```

### Estados Locais (LoginForm)

```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [rememberMe, setRememberMe] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [emailError, setEmailError] = useState('');
const [passwordError, setPasswordError] = useState('');
```

---

## Melhorias Implementadas

### Versão Atual (20/10/2025)

✅ **Remoção de Dados Mockados:**
- Integração real com API backend
- Credenciais fixas removidas
- Tokens reais retornados pela API

✅ **Componente de Validação de Email:**
- Validação de formato com regex
- Feedback visual (borda vermelha)
- Mensagens de erro contextuais

✅ **Mensagens de Erro Específicas:**
- Erros baseados no status HTTP da API
- Mensagens diferentes para cada situação
- Tratamento de erros de rede

✅ **Validações de Frontend:**
- Email: formato válido
- Senha: mínimo 6 caracteres
- Campos obrigatórios
- Feedback visual imediato

---

## Mensagens de Erro

### Erros de Validação (Frontend)

| Situação | Mensagem |
|----------|----------|
| Email vazio | "Email é obrigatório" |
| Email inválido | "Email inválido" |
| Senha vazia | "Senha é obrigatória" |
| Senha curta | "A senha deve ter pelo menos 6 caracteres" |

### Erros da API (Backend)

| Status HTTP | Mensagem |
|-------------|----------|
| 401 Unauthorized | "Email ou senha incorretos" |
| 404 Not Found | "Usuário não encontrado" |
| 429 Too Many Requests | "Muitas tentativas de login. Tente novamente mais tarde" |
| 500 Server Error | "Erro ao fazer login. Tente novamente" |
| Network Error | "Erro de conexão. Verifique sua internet e tente novamente" |

---

## Fluxo de Uso

### Fluxo de Login Bem-Sucedido

```
1. Usuário acessa tela de login
   ↓
2. Preenche email e senha
   ↓
3. Sistema valida campos (frontend)
   ↓
4. Usuário clica em "Entrar"
   ↓
5. Sistema exibe loading
   ↓
6. Sistema envia credenciais para API
   ↓
7. API valida credenciais
   ↓
8. API retorna usuário e tokens
   ↓
9. Sistema armazena tokens
   ↓
10. Sistema redireciona para dashboard
```

### Fluxo de Login com Erro

```
1. Usuário acessa tela de login
   ↓
2. Preenche email e senha
   ↓
3. Sistema valida campos (frontend)
   ↓
4. Usuário clica em "Entrar"
   ↓
5. Sistema exibe loading
   ↓
6. Sistema envia credenciais para API
   ↓
7. API retorna erro (401, 404, etc.)
   ↓
8. Sistema exibe mensagem de erro específica
   ↓
9. Usuário corrige dados e tenta novamente
```

---

## Tratamento de Erros

### Erros de Validação

Exibidos em tempo real abaixo dos campos, com borda vermelha no input.

### Erros de API

Exibidos em um banner vermelho acima do formulário, com mensagem específica baseada no erro retornado.

### Erros de Rede

Detectados e tratados com mensagem específica: "Erro de conexão. Verifique sua internet e tente novamente"

---

## Segurança

### Armazenamento de Tokens

**Access Token:**
- Armazenado em memória (estado da aplicação)
- Enviado em todas as requisições autenticadas
- Expira em 1 hora (padrão)

**Refresh Token:**
- Armazenado de forma persistente (AsyncStorage)
- Usado para renovar access token
- Expira em 7 dias (padrão)

### Proteção de Senha

- Senha nunca é armazenada localmente
- Campo de senha com opção "Mostrar/Ocultar"
- Senha enviada apenas via HTTPS

### Rate Limiting

API implementa rate limiting para prevenir ataques de força bruta:
- Máximo de tentativas por IP
- Bloqueio temporário após muitas tentativas
- Mensagem específica ao usuário

---

## Compatibilidade Multiplataforma

A tela de Login é totalmente compatível com:

✅ **Web** - Testado em Chrome, Firefox, Safari  
✅ **Android** - Testado em API 21+  
✅ **iOS** - Testado em iPhone e iPad  

**Tecnologias Utilizadas:**
- React Native core components
- Expo Router para navegação
- AsyncStorage para persistência
- Componentes customizados compatíveis com react-native-web

---

## Testes Recomendados

### Testes Funcionais

- [ ] Login com credenciais válidas
- [ ] Login com email inválido (formato)
- [ ] Login com senha curta (< 6 caracteres)
- [ ] Login com credenciais incorretas
- [ ] Login com usuário não existente
- [ ] Testar rate limiting (muitas tentativas)
- [ ] Testar sem conexão de internet
- [ ] Testar opção "Lembrar-me"
- [ ] Testar botão "Mostrar/Ocultar" senha
- [ ] Testar navegação para "Criar Conta"

### Testes de Integração

- [ ] Login e verificar tokens armazenados
- [ ] Login e verificar redirecionamento
- [ ] Logout e verificar limpeza de tokens
- [ ] Refresh token automático

### Testes de Segurança

- [ ] Verificar se senha não é armazenada
- [ ] Verificar se tokens são enviados via HTTPS
- [ ] Testar rate limiting
- [ ] Verificar expiração de tokens

### Testes de Plataforma

- [ ] Testar em Web (Chrome, Firefox, Safari)
- [ ] Testar em Android (diferentes versões)
- [ ] Testar em iOS (iPhone e iPad)

---

## Problemas Conhecidos

### Funcionalidades Pendentes

⚠️ **Recuperação de Senha:**
- Funcionalidade não implementada
- Apenas `console.log` no momento
- Necessário criar tela e integrar com API

---

## Próximos Passos

1. **Implementar Recuperação de Senha:**
   - Criar tela de recuperação
   - Integrar com endpoint `/auth/forgot-password`
   - Implementar fluxo de reset de senha

2. **Adicionar Autenticação Social:**
   - Login com Google
   - Login com Apple (iOS)
   - Login com Facebook

3. **Melhorias de UX:**
   - Adicionar animações de transição
   - Implementar feedback haptic (vibração)
   - Adicionar loading skeleton

4. **Testes:**
   - Testes unitários para componentes
   - Testes de integração para fluxo de login
   - Testes E2E com Maestro

---

## Referências

- [Componente EmailInput](../../../src/components/EmailInput.tsx)
- [Serviço de Autenticação](../../../src/services/authService.ts)
- [Context de Autenticação](../../../src/contexts/AuthContext.tsx)
- [API Documentation](../../backend/api_documentation.md)

---

## Variáveis de Ambiente

```bash
# URL da API backend
EXPO_PUBLIC_API_URL=https://giropro-78908506544.europe-west1.run.app/api/v1

# Fallback para desenvolvimento local
# EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

**Última Revisão:** 20/10/2025  
**Próxima Revisão:** Quando houver mudanças significativas

