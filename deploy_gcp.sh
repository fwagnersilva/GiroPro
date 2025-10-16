#!/bin/bash

# Script de Deploy para Google Cloud Run

# --- Variáveis de Configuração ---
PROJECT_ID="[SEU_PROJETO_ID]"
REGION="us-central1" # Escolha uma região próxima ou com Free Tier
SERVICE_NAME="giropro-backend"
BACKEND_DIR="./backend"

# Variáveis do Cloud SQL (A SEREM PREENCHIDAS)
# Formato: [PROJECT_ID]:[REGION]:[INSTANCE_NAME]
CLOUD_SQL_CONNECTION_NAME="[NOME_DA_CONEXAO_DA_INSTANCIA]"
DB_USER="giropro_user"
DB_PASS="[SUA_SENHA_FORTE]"
DB_NAME="giropro_db"

# Outras Variáveis de Ambiente (A SEREM PREENCHIDAS)
# Exemplo: JWT_SECRET, EMAIL_PASS, etc.
ENV_VARS="JWT_SECRET=sua_chave_secreta,EMAIL_PASS=sua_senha_de_email"

# --- 1. Configuração Inicial ---
echo "Configurando projeto e autenticação..."
gcloud config set project $PROJECT_ID
gcloud auth configure-docker $REGION-docker.pkg.dev # Configura autenticação para Artifact Registry

# --- 2. Build da Imagem Docker ---
echo "Construindo e enviando a imagem Docker para o Artifact Registry..."
# Usando Artifact Registry (novo padrão)
IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$SERVICE_NAME/$SERVICE_NAME:latest"

# O Cloud Build usa o Dockerfile na pasta $BACKEND_DIR
gcloud builds submit $BACKEND_DIR --tag $IMAGE_URI

if [ $? -ne 0 ]; then
    echo "Erro no build da imagem. Abortando."
    exit 1
fi

# --- 3. Deploy no Cloud Run ---
echo "Fazendo deploy no Cloud Run..."

gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_URI \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --add-cloudsql-instances $CLOUD_SQL_CONNECTION_NAME \
    --update-env-vars DB_USER=$DB_USER,DB_PASS=$DB_PASS,DB_NAME=$DB_NAME,$ENV_VARS \
    --port 8080 \
    --max-instances 1 \
    --min-instances 0 \
    --cpu-boost \
    --memory 512Mi \
    --timeout 300

if [ $? -ne 0 ]; then
    echo "Erro no deploy do Cloud Run. Verifique as configurações."
    exit 1
fi

echo "Deploy concluído com sucesso!"
echo "Acesse a URL do serviço para testar sua API."
