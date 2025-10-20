# Documentação da Tela de Jornadas

**Arquivo:** `app/(auth)/jornadas.tsx`  
**Última Atualização:** 20/10/2025  
**Autor:** Equipe GiroPro

---

## Visão Geral

A tela de **Jornadas** é uma funcionalidade central do aplicativo GiroPro, permitindo que motoristas de aplicativo gerenciem o ciclo completo de suas jornadas de trabalho. A tela oferece recursos para criar, acompanhar, finalizar e editar jornadas, com foco especial no registro detalhado de faturamento por plataforma.

---

## Funcionalidades

### 1. Iniciar Jornada

Permite ao usuário criar um novo registro de jornada de trabalho.

**Campos Obrigatórios:**
- Veículo (seleção de veículo cadastrado)
- Quilometragem Inicial

**Comportamento:**
- Captura automaticamente data/hora de início
- Valida se há veículo cadastrado
- Valida se a quilometragem é um número válido
- Cria registro no backend via API

**Endpoint:** `POST /api/v1/journeys`

---

### 2. Finalizar Jornada

Encerra uma jornada ativa, registrando dados de fechamento e faturamento.

**Campos Obrigatórios:**
- Quilometragem Final
- Faturamento por plataforma (pelo menos uma)

**Campos Opcionais:**
- Observações
- Horário de corte (para plataformas específicas)

**Validações:**
- KM Final deve ser maior que KM Inicial
- Pelo menos uma plataforma deve ter faturamento > 0
- Valores monetários devem ser válidos

**Comportamento:**
- Calcula automaticamente a distância percorrida
- Soma o faturamento total de todas as plataformas
- Registra data/hora de término
- Atualiza registro no backend via API

**Endpoint:** `PUT /api/v1/journeys/:id`

---

### 3. Editar Jornada

Permite correção de dados em uma jornada já finalizada.

**Campos Editáveis:**
- Quilometragem Final
- Faturamento por plataforma
- Observações

**Validações:**
- Mesmas validações da finalização
- Não permite editar jornadas ativas

**Endpoint:** `PUT /api/v1/journeys/:id`

---

### 4. Cancelar Jornada

Remove permanentemente uma jornada do sistema.

**Comportamento:**
- Exibe confirmação antes de excluir
- Ação irreversível
- Remove do backend via API

**Endpoint:** `DELETE /api/v1/journeys/:id`

---

## Regras de Negócio

### Validações de Formulário

| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| Veículo | Obrigatório | "Selecione um veículo" |
| KM Inicial | Número válido | "Quilometragem inválida" |
| KM Final | Maior que KM Inicial | "KM final deve ser maior que KM inicial" |
| Faturamento | Pelo menos uma plataforma > 0 | "Adicione faturamento em pelo menos uma plataforma" |
| Valores | Apenas números | Bloqueio em tempo real |

### Cálculos Automáticos

**Distância Percorrida:**
```
distância = KM Final - KM Inicial
```

**Faturamento Total:**
```
total = Σ (faturamento de todas as plataformas)
```

Para plataformas com horário de corte:
```
total_plataforma = valor_antes_corte + valor_depois_corte
```

### Plataformas Suportadas

As seguintes plataformas de transporte são suportadas:

- **Uber**
- **99**
- **InDrive**
- **Outros** (campo genérico)

Cada plataforma pode ter:
- Faturamento simples (valor único)
- Faturamento com horário de corte (antes e depois)

---

## Interface do Usuário

### Componentes Principais

#### 1. Lista de Jornadas

Exibe todas as jornadas do usuário em ordem cronológica (mais recente primeiro).

**Informações Exibidas por Card:**
- Data e hora de início
- Data e hora de término (se finalizada)
- Veículo utilizado
- Distância percorrida
- Faturamento total
- Status (Ativa/Finalizada)

**Ações Disponíveis:**
- Finalizar (apenas jornadas ativas)
- Editar (apenas jornadas finalizadas)
- Cancelar (todas)

#### 2. Botão "Iniciar Nova Jornada"

Localizado no topo da tela, permite criar uma nova jornada.

**Comportamento:**
- Desabilitado se não houver veículos cadastrados
- Abre modal de seleção de veículo e KM inicial

#### 3. Modal de Iniciar Jornada

**Campos:**
- Dropdown de seleção de veículo
- Input numérico para KM inicial

**Botões:**
- Cancelar
- Iniciar Jornada

#### 4. Modal de Finalizar Jornada

**Seções:**
1. **Informações Básicas:**
   - KM Final (input numérico)
   - Observações (textarea opcional)

2. **Faturamento por Plataforma:**
   - Uber (com opção de horário de corte)
   - 99 (com opção de horário de corte)
   - InDrive
   - Outros

3. **Resumo:**
   - Distância percorrida (calculado)
   - Faturamento total (calculado)

**Botões:**
- Cancelar
- Finalizar Jornada

---

## Componentes Utilizados

### Componentes Customizados

| Componente | Descrição |
|------------|-----------|
| `CurrencyInput` | Input monetário com formatação automática (R$) |
| `NumericInput` | Input que aceita apenas números |

### Componentes React Native

- `View`, `Text`, `ScrollView`
- `TouchableOpacity` (botões)
- `TextInput` (campos de texto)
- `ActivityIndicator` (loading)
- `Modal` (modais)
- `Picker` (dropdown de veículo)

---

## Integração com Backend

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/journeys` | Lista todas as jornadas do usuário |
| `POST` | `/api/v1/journeys` | Cria uma nova jornada |
| `PUT` | `/api/v1/journeys/:id` | Atualiza uma jornada (finalizar ou editar) |
| `DELETE` | `/api/v1/journeys/:id` | Remove uma jornada |

### Formato de Dados

**Criar Jornada (POST):**
```json
{
  "vehicleId": "uuid",
  "startKm": 12345,
  "startTime": "2025-10-20T10:00:00Z"
}
```

**Finalizar Jornada (PUT):**
```json
{
  "endKm": 12445,
  "endTime": "2025-10-20T18:00:00Z",
  "earnings": {
    "uber": {
      "beforeCutoff": 150.50,
      "afterCutoff": 80.00
    },
    "99": {
      "total": 120.00
    },
    "indrive": 50.00,
    "others": 30.00
  },
  "observations": "Dia tranquilo, sem ocorrências"
}
```

**Resposta (GET):**
```json
{
  "journeys": [
    {
      "id": "uuid",
      "vehicleId": "uuid",
      "vehicle": {
        "id": "uuid",
        "brand": "Toyota",
        "model": "Corolla",
        "year": 2020,
        "plate": "ABC-1234"
      },
      "startKm": 12345,
      "endKm": 12445,
      "distance": 100,
      "startTime": "2025-10-20T10:00:00Z",
      "endTime": "2025-10-20T18:00:00Z",
      "totalEarnings": 430.50,
      "earnings": { ... },
      "observations": "...",
      "status": "completed",
      "createdAt": "2025-10-20T10:00:00Z",
      "updatedAt": "2025-10-20T18:00:00Z"
    }
  ]
}
```

---

## Estados da Aplicação

### Estados Locais

```typescript
const [journeys, setJourneys] = useState<Journey[]>([]);
const [loading, setLoading] = useState(false);
const [loadingJourneyId, setLoadingJourneyId] = useState<string | null>(null);
const [showStartModal, setShowStartModal] = useState(false);
const [showFinishModal, setShowFinishModal] = useState(false);
const [selectedVehicle, setSelectedVehicle] = useState('');
const [startKm, setStartKm] = useState('');
const [endKm, setEndKm] = useState('');
const [earnings, setEarnings] = useState({ ... });
```

### Gerenciamento de Loading

A tela implementa dois tipos de loading:

1. **Loading Global:** Para operações que afetam a lista inteira (carregar jornadas)
2. **Loading Individual:** Para operações em uma jornada específica (finalizar, cancelar)

Isso melhora a UX, permitindo que o usuário veja exatamente qual jornada está sendo processada.

---

## Melhorias Implementadas

### Versão Atual (20/10/2025)

✅ **Formatação Monetária Automática:**
- Usuário digita apenas números
- Sistema formata automaticamente em R$
- Conversão correta para centavos no backend

✅ **Feedback Visual de Ações:**
- Indicadores de loading nos botões de ação
- Botões desabilitados durante operações
- Loading individual por jornada

✅ **Validação de Inputs em Tempo Real:**
- Campos de KM aceitam apenas números
- Campos de faturamento aceitam apenas números
- Impossível inserir caracteres inválidos

---

## Fluxo de Uso

### Fluxo Completo de uma Jornada

```
1. Usuário clica em "Iniciar Nova Jornada"
   ↓
2. Seleciona veículo e informa KM inicial
   ↓
3. Sistema cria jornada ativa
   ↓
4. Usuário trabalha...
   ↓
5. Usuário clica em "Finalizar" no card da jornada
   ↓
6. Preenche KM final e faturamento por plataforma
   ↓
7. Sistema calcula distância e total
   ↓
8. Usuário confirma finalização
   ↓
9. Jornada é marcada como finalizada
   ↓
10. (Opcional) Usuário pode editar dados posteriormente
```

---

## Tratamento de Erros

### Erros de API

| Erro | Tratamento |
|------|------------|
| Erro de rede | Exibe mensagem "Erro de conexão. Verifique sua internet" |
| 400 Bad Request | Exibe mensagem específica do backend |
| 401 Unauthorized | Redireciona para login |
| 404 Not Found | Exibe "Jornada não encontrada" |
| 500 Server Error | Exibe "Erro no servidor. Tente novamente" |

### Erros de Validação

Todos os erros de validação são exibidos em tempo real abaixo dos campos correspondentes, com borda vermelha no input.

---

## Compatibilidade Multiplataforma

A tela de Jornadas é totalmente compatível com:

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

- [ ] Iniciar jornada com veículo válido
- [ ] Tentar iniciar jornada sem veículo cadastrado
- [ ] Finalizar jornada com dados válidos
- [ ] Tentar finalizar com KM final < KM inicial
- [ ] Tentar finalizar sem faturamento
- [ ] Editar jornada finalizada
- [ ] Cancelar jornada com confirmação
- [ ] Testar formatação monetária (digitar apenas números)
- [ ] Testar validação de inputs (tentar inserir letras)

### Testes de Integração

- [ ] Criar jornada e verificar no backend
- [ ] Finalizar jornada e verificar cálculos
- [ ] Editar jornada e verificar atualização
- [ ] Cancelar jornada e verificar remoção
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

- [Componente CurrencyInput](../../../src/components/CurrencyInput.tsx)
- [Componente NumericInput](../../../src/components/NumericInput.tsx)
- [Serviço de Jornadas](../../../src/services/journeyService.ts)
- [API Documentation](../../backend/api_documentation.md)

---

**Última Revisão:** 20/10/2025  
**Próxima Revisão:** Quando houver mudanças significativas

