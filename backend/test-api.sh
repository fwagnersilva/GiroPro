#!/bin/bash

# GiroPro API - Script de Teste Completo
# Uso: bash test-api.sh

BASE_URL="http://localhost:3000"
TOKEN=""
USER_ID=""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}GiroPro API - Script de Teste${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. Health Check
echo -e "${YELLOW}[1] Testando Health Check...${NC}"
curl -s -X GET "$BASE_URL/health" | jq '.' || echo "Falhou"
echo ""

# 2. Info Endpoints
echo -e "${YELLOW}[2] Testando Info Endpoints...${NC}"
curl -s -X GET "$BASE_URL/api/v1/info" | jq '.' || echo "Falhou"
echo ""

# 3. Registrar novo usuário
echo -e "${YELLOW}[3] Testando Registro de Usuário...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Usuário Teste",
    "email": "teste'$(date +%s)'@example.com",
    "senha": "Teste123!@"
  }')

echo "$REGISTER_RESPONSE" | jq '.' 

# Extrair token se houver sucesso
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken // empty')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Não foi possível obter token. Algumas rotas podem falhar.${NC}"
else
  echo -e "${GREEN}Token obtido com sucesso!${NC}"
fi
echo ""

# 4. Testar Login
echo -e "${YELLOW}[4] Testando Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste'$(date +%s)'@example.com",
    "senha": "Teste123!@"
  }')
echo "$LOGIN_RESPONSE" | jq '.' 
echo ""

if [ -n "$TOKEN" ]; then
  # 5. Testar rotas autenticadas de usuário
  echo -e "${YELLOW}[5] Testando Rota de Perfil do Usuário...${NC}"
  curl -s -X GET "$BASE_URL/api/v1/users/profile" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""

  # 6. Testar rotas de veículos
  echo -e "${YELLOW}[6] Testando Criação de Veículo...${NC}"
  VEHICLE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/vehicles" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "marca": "Toyota",
      "modelo": "Corolla",
      "ano": 2023,
      "placa": "ABC-1234"
    }')
  echo "$VEHICLE_RESPONSE" | jq '.'
  VEHICLE_ID=$(echo "$VEHICLE_RESPONSE" | jq -r '.id // empty')
  echo ""

  # 7. Listar veículos
  echo -e "${YELLOW}[7] Testando Listagem de Veículos...${NC}"
  curl -s -X GET "$BASE_URL/api/v1/vehicles" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""

  # 8. Testar rotas de jornadas
  echo -e "${YELLOW}[8] Testando Criação de Jornada...${NC}"
  curl -s -X POST "$BASE_URL/api/v1/journeys" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "idVeiculo": "'$VEHICLE_ID'",
      "dataInicio": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
      "distancia": 50.5,
      "consumoCombustivel": 7.5
    }' | jq '.'
  echo ""

  # 9. Testar analytics
  echo -e "${YELLOW}[9] Testando Analytics...${NC}"
  curl -s -X GET "$BASE_URL/api/v1/analytics/consumption" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""

  # 10. Testar insights
  echo -e "${YELLOW}[10] Testando Insights...${NC}"
  curl -s -X GET "$BASE_URL/api/v1/insights/generate" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""

  # 11. Testar notificações
  echo -e "${YELLOW}[11] Testando Notificações...${NC}"
  curl -s -X GET "$BASE_URL/api/v1/notifications" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""

  # 12. Testar relatórios
  echo -e "${YELLOW}[12] Testando Relatórios...${NC}"
  curl -s -X GET "$BASE_URL/api/v1/reports/weekly" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""

  # 13. Testar multi-veículos
  echo -e "${YELLOW}[13] Testando Multi-Veículos...${NC}"
  curl -s -X GET "$BASE_URL/api/v1/multi-vehicle/vehicles-with-stats" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""

  # 14. Testar sync
  echo -e "${YELLOW}[14] Testando Sync...${NC}"
  curl -s -X GET "$BASE_URL/api/v1/sync/download/initial" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""

else
  echo -e "${RED}Pulando testes autenticados (sem token)${NC}"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testes Completos!${NC}"
echo -e "${BLUE}========================================${NC}"