# Guia de Configuração do Ambiente - GiroPro

Este documento descreve como configurar o ambiente de desenvolvimento local para o projeto GiroPro.

## 📋 Pré-requisitos

- **Node.js**: v18+ (recomendado v22.13.0)
- **pnpm**: v8+ (gerenciador de pacotes)
- **Git**: Para controle de versão
- **Build tools**: Para compilar dependências nativas (better-sqlite3)

### Instalação do Node.js

```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
nvm use 22
```

### Instalação do pnpm

```bash
npm install -g pnpm
```

### Ferramentas de Build (Linux/Ubuntu)

```bash
sudo apt-get update
sudo apt-get install -y build-essential python3
```

### Ferramentas de Build (macOS)

```bash
xcode-select --install
```

### Ferramentas de Build (Windows)

```powershell
npm install --global windows-build-tools
```

## 🚀 Configuração Inicial

### 1. Clonar o Repositório

```bash
git clone https://github.com/fwagnersilva/GiroPro.git
cd GiroPro
```

### 2. Configurar o Backend

#### 2.1. Instalar Dependências

```bash
cd backend
pnpm install
```

**Nota**: Se houver erro com `better-sqlite3`, execute:

```bash
pnpm rebuild better-sqlite3
```

#### 2.2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Para desenvolvimento com banco em memória (recomendado para testes)
DB_TYPE=sqlite_memory
SQLITE_DB_PATH=":memory:"

# Para desenvolvimento com banco persistente
# DB_TYPE=sqlite_file
# SQLITE_DB_PATH="giropro.db"

# Configurações da API
PORT=3000
NODE_ENV=development

# Segurança - Gere suas próprias chaves!
JWT_SECRET="sua-chave-secreta-aqui"
JWT_REFRESH_SECRET="sua-chave-refresh-aqui"
```

**⚠️ IMPORTANTE**: Para produção, **sempre gere chaves JWT únicas**:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.3. Iniciar o Backend

```bash
pnpm run dev
```

O servidor estará disponível em: `http://localhost:3000`

### 3. Configurar o Frontend

### 3.1. Instalar Dependências

```bash
cd ../frontend  # A partir da raiz do projeto
pnpm install
```
#### 3.2. Iniciar o Frontend

Para desenvolvimento web:

```bash
pnpm run web
```

Para desenvolvimento mobile (Expo):

```bash
pnpm start
```

## 🗂️ Estrutura de Arquivos de Configuração

### Arquivos Ignorados pelo Git

Os seguintes arquivos são **ignorados pelo Git** e devem ser configurados localmente:

- `.env` - Variáveis de ambiente
- `*.db`, `*.db-shm`, `*.db-wal` - Arquivos de banco de dados SQLite
- `*.log` - Arquivos de log
- `node_modules/` - Dependências
- `.vscode/`, `.idea/` - Configurações de IDE

### Arquivos Versionados

- `.env.example` - Template de configuração
- `package.json` - Dependências do projeto
- `pnpm-lock.yaml` - Lock de dependências

## 🔧 Configurações Recomendadas

### Banco de Dados

#### Desenvolvimento Rápido (Memória)
```env
DB_TYPE=sqlite_memory
SQLITE_DB_PATH=":memory:"
```
✅ Rápido, limpo a cada reinicialização  
❌ Dados não persistem

#### Desenvolvimento com Persistência
```env
DB_TYPE=sqlite_file
SQLITE_DB_PATH="giropro.db"
```
✅ Dados persistem entre reinicializações  
❌ Pode acumular dados de teste

#### Produção (PostgreSQL)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/giropro"
```
✅ Robusto, escalável  
❌ Requer instalação e configuração do PostgreSQL

### Portas

Por padrão:
- **Backend**: 3000
- **Frontend (Vite)**: 5173
- **Expo**: 19000 (Metro), 19006 (Web)

Para alterar a porta do backend:

```env
PORT=8080
```

## 🧪 Testando a Instalação

### 1. Testar Backend

```bash
# Health check
curl http://localhost:3000/health

# Criar usuário
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "teste@example.com",
    "senha": "Senha@123"
  }'
```

### 2. Testar Frontend

Acesse no navegador:
- Web: `http://localhost:5173`
- Expo: `http://localhost:19006`

## 🐛 Problemas Comuns

### Erro: "better-sqlite3" não compila

**Solução**:
```bash
cd backend
pnpm rebuild better-sqlite3
```

Se ainda falhar, instale as ferramentas de build (ver seção Pré-requisitos).

### Erro: "Port 3000 already in use"

**Solução 1**: Matar o processo na porta 3000
```bash
# Linux/macOS
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solução 2**: Usar outra porta no `.env`
```env
PORT=3001
```

### Erro: "Cannot find module 'dotenv'"

**Solução**:
```bash
cd backend
pnpm install dotenv
```

### Banco de dados com schema antigo

**Solução**: Deletar o banco e reiniciar
```bash
cd backend
rm -f giropro.db giropro.db-shm giropro.db-wal
pnpm run dev
```

## 📚 Comandos Úteis

### Backend

```bash
# Desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Executar build
pnpm start

# Testes
pnpm test

# Linter
pnpm run lint
```

### Frontend

```bash
# Web (Vite)
pnpm run web-vite

# Expo (Mobile)
pnpm start

# Android
pnpm run android

# iOS
pnpm run ios
```

## 🔐 Segurança

### Nunca commite:

- ❌ Arquivos `.env` com credenciais reais
- ❌ Chaves JWT de produção
- ❌ Senhas ou tokens
- ❌ Arquivos de banco de dados

### Sempre:

- ✅ Use `.env.example` como template
- ✅ Gere chaves únicas para cada ambiente
- ✅ Mantenha credenciais fora do código
- ✅ Use variáveis de ambiente

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as dependências estão instaladas
2. Confirme que as variáveis de ambiente estão corretas
3. Consulte a documentação em `/docs`
4. Abra uma issue no GitHub

## 🔄 Atualizando o Projeto

```bash
# Atualizar código
git pull origin main

# Atualizar dependências do backend
cd backend
pnpm install

# Atualizar dependências do frontend
cd ..
pnpm install

# Reiniciar servidores
```

---

**Última atualização**: 03/10/2025  
**Versão**: 1.1.0
