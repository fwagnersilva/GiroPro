# Documentação da Tela de Veículos

**Arquivo:** `app/(auth)/vehicles.tsx` + `src/components/VehicleList.tsx` + `app/(auth)/vehicles/VehicleForm.tsx`  
**Última Atualização:** 20/10/2025  
**Autor:** Equipe GiroPro

---

## Visão Geral

A tela de **Veículos** permite que os usuários gerenciem sua frota de veículos utilizados para trabalhar como motorista de aplicativo. A funcionalidade é essencial, pois os veículos são necessários para iniciar jornadas de trabalho.

---

## Funcionalidades

### 1. Listar Veículos

Exibe todos os veículos cadastrados pelo usuário em uma lista organizada.

**Informações Exibidas por Card:**
- Marca e Modelo
- Ano
- Placa
- Cor (opcional)

**Ações Disponíveis:**
- Editar veículo
- Excluir veículo

**Endpoint:** `GET /api/v1/vehicles`

---

### 2. Adicionar Veículo

Permite o cadastro de um novo veículo através de um formulário dedicado.

**Campos Obrigatórios:**
- Marca
- Modelo

**Campos Opcionais:**
- Ano
- Placa
- Cor

**Validações:**
- Marca e Modelo não podem estar vazios
- Ano deve estar entre 1900 e (ano atual + 1)
- Placa deve seguir formato Mercosul (ABC1D23) ou antigo (ABC-1234)

**Endpoint:** `POST /api/v1/vehicles`

---

### 3. Editar Veículo

Permite a modificação dos dados de um veículo existente.

**Campos Editáveis:**
- Marca
- Modelo
- Ano
- Placa
- Cor

**Validações:**
- Mesmas validações do cadastro

**Endpoint:** `PUT /api/v1/vehicles/:id`

---

### 4. Excluir Veículo

Remove um veículo do sistema após confirmação do usuário.

**Comportamento:**
- Exibe alerta de confirmação
- Ação irreversível
- Remove do backend via API

**Endpoint:** `DELETE /api/v1/vehicles/:id`

---

## Regras de Negócio

### Validações de Formulário

| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| Marca | Obrigatório | "Marca é obrigatória" |
| Modelo | Obrigatório | "Modelo é obrigatório" |
| Ano | Entre 1900 e (ano atual + 1) | "Ano inválido. Deve estar entre 1900 e 2026" |
| Placa | Formato Mercosul ou antigo | "Placa inválida" |

### Formatação Automática

**Placa:**
- Aceita entrada livre
- Formata automaticamente para:
  - **Mercosul:** ABC1D23
  - **Antigo:** ABC-1234
- Converte para maiúsculas automaticamente

**Ano:**
- Aceita apenas números
- Valida intervalo em tempo real

---

## Interface do Usuário

### Componentes Principais

#### 1. Lista de Veículos (`VehicleList.tsx`)

Exibe todos os veículos cadastrados.

**Informações por Card:**
- Marca e Modelo (título)
- Ano
- Placa (formatada)
- Cor (se informada)

**Ações:**
- Botão "Editar" (ícone de lápis)
- Botão "Excluir" (ícone de lixeira)

**Estados:**
- Loading individual por veículo durante ações
- Botões desabilitados durante operações

#### 2. Botão "Adicionar Veículo"

Localizado no topo da tela.

**Comportamento:**
- Navega para tela de formulário
- Passa modo "create" como parâmetro

#### 3. Formulário de Veículo (`VehicleForm.tsx`)

Formulário reutilizável para criar e editar veículos.

**Campos:**
- Marca (TextInput)
- Modelo (TextInput)
- Ano (YearInput - componente customizado)
- Placa (PlateInput - componente customizado)
- Cor (TextInput opcional)

**Botões:**
- Cancelar (volta para lista)
- Salvar (cria ou atualiza)

**Estados:**
- Loading no botão de salvar
- Botão desabilitado durante submissão

---

## Componentes Utilizados

### Componentes Customizados

| Componente | Descrição |
|------------|-----------|
| `PlateInput` | Input de placa com formatação automática (Mercosul/Antigo) |
| `YearInput` | Input de ano com validação de intervalo (1900 - ano atual + 1) |

### Componentes React Native

- `View`, `Text`, `ScrollView`
- `TouchableOpacity` (botões)
- `TextInput` (campos de texto)
- `ActivityIndicator` (loading)

---

## Integração com Backend

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/vehicles` | Lista todos os veículos do usuário |
| `POST` | `/api/v1/vehicles` | Cria um novo veículo |
| `PUT` | `/api/v1/vehicles/:id` | Atualiza um veículo |
| `DELETE` | `/api/v1/vehicles/:id` | Remove um veículo |

### Formato de Dados

**Criar Veículo (POST):**
```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "plate": "ABC1D23",
  "color": "Prata"
}
```

**Atualizar Veículo (PUT):**
```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2021,
  "plate": "ABC1D23",
  "color": "Preto"
}
```

**Resposta (GET):**
```json
{
  "vehicles": [
    {
      "id": "uuid",
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "plate": "ABC1D23",
      "color": "Prata",
      "createdAt": "2025-10-20T10:00:00Z",
      "updatedAt": "2025-10-20T10:00:00Z"
    }
  ]
}
```

---

## Estados da Aplicação

### Hook Customizado: `useVehicleService`

```typescript
const {
  vehicles,           // Lista de veículos
  loading,            // Loading global
  error,              // Erro global
  fetchVehicles,      // Buscar veículos
  createVehicle,      // Criar veículo
  updateVehicle,      // Atualizar veículo
  deleteVehicle,      // Deletar veículo
} = useVehicleService();
```

### Estados Locais (VehicleList)

```typescript
const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
```

Permite loading individual por veículo durante exclusão.

### Estados Locais (VehicleForm)

```typescript
const [brand, setBrand] = useState('');
const [model, setModel] = useState('');
const [year, setYear] = useState('');
const [plate, setPlate] = useState('');
const [color, setColor] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
```

---

## Melhorias Implementadas

### Versão Atual (20/10/2025)

✅ **Componente de Placa com Máscara:**
- Formatação automática (Mercosul e formato antigo)
- Conversão para maiúsculas
- Validação de formato

✅ **Validação de Ano:**
- Aceita apenas anos entre 1900 e (ano atual + 1)
- Mensagens de erro contextuais
- Bloqueio de caracteres não numéricos

✅ **Feedback Visual de Ações:**
- Loading individual por veículo
- Indicador de loading no botão "Excluir"
- Loading no formulário de cadastro/edição
- Botões desabilitados durante operações

---

## Fluxo de Uso

### Fluxo de Cadastro de Veículo

```
1. Usuário clica em "Adicionar Veículo"
   ↓
2. Sistema navega para formulário vazio
   ↓
3. Usuário preenche dados do veículo
   ↓
4. Sistema valida campos em tempo real
   ↓
5. Usuário clica em "Salvar"
   ↓
6. Sistema envia dados para API
   ↓
7. API retorna veículo criado
   ↓
8. Sistema volta para lista atualizada
```

### Fluxo de Edição de Veículo

```
1. Usuário clica em "Editar" no card do veículo
   ↓
2. Sistema navega para formulário preenchido
   ↓
3. Usuário modifica dados
   ↓
4. Sistema valida campos em tempo real
   ↓
5. Usuário clica em "Salvar"
   ↓
6. Sistema envia dados para API
   ↓
7. API retorna veículo atualizado
   ↓
8. Sistema volta para lista atualizada
```

### Fluxo de Exclusão de Veículo

```
1. Usuário clica em "Excluir" no card do veículo
   ↓
2. Sistema exibe alerta de confirmação
   ↓
3. Usuário confirma exclusão
   ↓
4. Sistema exibe loading no botão
   ↓
5. Sistema envia requisição para API
   ↓
6. API confirma exclusão
   ↓
7. Sistema remove veículo da lista
```

---

## Tratamento de Erros

### Erros de API

| Erro | Tratamento |
|------|------------|
| Erro de rede | Exibe mensagem "Erro de conexão. Verifique sua internet" |
| 400 Bad Request | Exibe mensagem específica do backend |
| 401 Unauthorized | Redireciona para login |
| 404 Not Found | Exibe "Veículo não encontrado" |
| 500 Server Error | Exibe "Erro no servidor. Tente novamente" |

### Erros de Validação

Todos os erros de validação são exibidos em tempo real abaixo dos campos correspondentes, com borda vermelha no input.

---

## Validação de Placa

### Formatos Suportados

**Formato Mercosul (atual):**
- Padrão: ABC1D23
- Exemplo: ABC1D23

**Formato Antigo:**
- Padrão: ABC-1234
- Exemplo: ABC-1234

### Lógica de Formatação

```typescript
// Detecta formato baseado no comprimento e caracteres
if (length === 7 && hasLetterInPosition4) {
  // Formato Mercosul: ABC1D23
  return formatMercosul(value);
} else if (length === 7 && allNumbersAfterPosition3) {
  // Formato Antigo: ABC-1234
  return formatAntigo(value);
}
```

---

## Compatibilidade Multiplataforma

A tela de Veículos é totalmente compatível com:

✅ **Web** - Testado em Chrome, Firefox, Safari  
✅ **Android** - Testado em API 21+  
✅ **iOS** - Testado em iPhone e iPad  

**Tecnologias Utilizadas:**
- React Native core components
- Expo Router para navegação
- Componentes customizados compatíveis com react-native-web

---

## Testes Recomendados

### Testes Funcionais

- [ ] Criar veículo com dados válidos
- [ ] Tentar criar veículo sem marca
- [ ] Tentar criar veículo sem modelo
- [ ] Criar veículo com ano inválido (< 1900 ou > ano atual + 1)
- [ ] Criar veículo com placa Mercosul
- [ ] Criar veículo com placa formato antigo
- [ ] Editar veículo existente
- [ ] Excluir veículo com confirmação
- [ ] Cancelar exclusão de veículo
- [ ] Testar formatação automática de placa

### Testes de Integração

- [ ] Criar veículo e verificar no backend
- [ ] Editar veículo e verificar atualização
- [ ] Excluir veículo e verificar remoção
- [ ] Testar com conexão offline

### Testes de Plataforma

- [ ] Testar em Web (Chrome, Firefox, Safari)
- [ ] Testar em Android (diferentes versões)
- [ ] Testar em iOS (iPhone e iPad)

---

## Problemas Conhecidos

Nenhum problema conhecido na versão atual.

---

## Referências

- [Componente PlateInput](../../../src/components/PlateInput.tsx)
- [Componente YearInput](../../../src/components/YearInput.tsx)
- [Hook useVehicleService](../../../src/hooks/useVehicleService.ts)
- [Serviço de Veículos](../../../src/services/vehicleService.ts)
- [API Documentation](../../backend/api_documentation.md)

---

**Última Revisão:** 20/10/2025  
**Próxima Revisão:** Quando houver mudanças significativas

