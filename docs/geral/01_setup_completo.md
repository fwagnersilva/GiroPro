# Guia de Setup Completo - GiroPro

## Visão Geral

O GiroPro é uma aplicação para gestão financeira de motoristas de aplicativo:
- **Backend**: API REST Node.js/TypeScript + Express.js
- **Frontend**: React Native/Expo (Web, iOS, Android)
- **Banco de Dados**: PostgreSQL via Docker

## Pré-requisitos

- Node.js 20.x (LTS)
- pnpm v10.18.2+
- Git
- Docker
- WSL2 (Windows)

## Setup Completo

### 1. Instalar Ferramentas
```bash
# Sistema
sudo apt update && sudo apt upgrade -y

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm
sudo npm install -g pnpm

# Git
sudo apt install git -y

# Build tools
sudo apt install -y python3 make g++ build-essential

2. Instalar Docker

# Repositório
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Instalar
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Permissões
sudo usermod -aG docker $USER
sudo service docker start
newgrp docker

### 3. Clonar Projeto
```bash

Backend
1. Instalar

cd backend
pnpm install

2. Configurar .env

DB_TYPE=postgresql
DATABASE_URL="postgresql://giropro:giropro123@localhost:5432/giropro_db"
JWT_SECRET="giropro_dev_secret_2025"
JWT_REFRESH_SECRET="giropro_refresh_secret_2025"
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:19006,http://localhost:8081,http://localhost:5173"

3. Docker Compose
Criar docker-compose.yml:

version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: giropro_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: giropro
      POSTGRES_PASSWORD: giropro123
      POSTGRES_DB: giropro_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
  
  4. Iniciar

docker-compose up -d
pnpm run db:push
pnpm run dev

5. Testar
curl http://localhost:3000/health

Frontend

bashcd ../frontend
pnpm install

Criar .env:

REACT_APP_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1

Iniciar:
bashpnpm run web-vite

Atualizado: 11/10/2025
**Salve: Ctrl+O, Enter, Ctrl+X**

Pronto! Agora vamos instalar o frontend! 🚀