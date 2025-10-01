# Gerenciamento de Plataformas - Backend

## Visão Geral

O sistema de gerenciamento de plataformas permite que os usuários configurem e controlem as plataformas de trabalho (como Uber, 99, etc.) que utilizam para registrar o faturamento de suas jornadas. O sistema oferece plataformas predefinidas que não podem ser excluídas e permite a criação de plataformas customizadas.

## Estrutura do Banco de Dados

### Tabela `plataformas`

A tabela `plataformas` armazena as plataformas disponíveis para cada usuário.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | TEXT (UUID) | Identificador único da plataforma |
| `idUsuario` | TEXT (UUID) | Referência ao usuário proprietário |
| `nome` | TEXT(100) | Nome da plataforma (ex: "Uber", "99") |
| `isPredefinida` | BOOLEAN | Indica se é uma plataforma predefinida |
| `ativa` | BOOLEAN | Indica se a plataforma está ativa |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data da última atualização |
| `deletedAt` | TIMESTAMP | Data de exclusão (soft delete) |

### Tabela `jornadasFaturamentoPorPlataforma`

A tabela `jornadasFaturamentoPorPlataforma` registra o faturamento detalhado de cada jornada por plataforma.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | TEXT (UUID) | Identificador único do registro |
| `idJornada` | TEXT (UUID) | Referência à jornada |
| `idPlataforma` | TEXT (UUID) | Referência à plataforma |
| `valorFaturado` | INTEGER | Valor faturado na plataforma (em centavos) |
| `createdAt` | TIMESTAMP | Data de criação |

## Regras de Negócio

### Plataformas Predefinidas

1.  **Uber** e **99** são criadas automaticamente para todos os usuários no momento do cadastro.
2.  Plataformas predefinidas (`isPredefinida = true`) **não podem ser excluídas**.
3.  Plataformas predefinidas podem ser **ativadas ou desativadas** pelo usuário.
4.  O **nome** de plataformas predefinidas **não pode ser alterado**.

### Plataformas Customizadas

1.  Usuários podem **criar novas plataformas** com nomes personalizados.
2.  Plataformas customizadas (`isPredefinida = false`) podem ser **excluídas** (soft delete).
3.  Plataformas customizadas podem ter seus **nomes alterados**.
4.  Plataformas customizadas podem ser **ativadas ou desativadas**.

### Validações

1.  **Nome único por usuário**: Não pode existir duas plataformas com o mesmo nome para o mesmo usuário.
2.  **Comprimento do nome**: O nome da plataforma deve ter entre 1 e 100 caracteres.
3.  **Exclusão**: Apenas plataformas não predefinidas podem ser excluídas.

## API Endpoints

Para detalhes completos dos endpoints, incluindo exemplos de requisição e resposta, consulte a [Documentação da API](/docs/backend/02_api_documentation.md).

### Criar Plataforma

*   **Método:** `POST`
*   **URL:** `/api/v1/platforms`
*   **Descrição:** Permite ao usuário criar uma nova plataforma customizada.

### Listar Plataformas

*   **Método:** `GET`
*   **URL:** `/api/v1/platforms`
*   **Descrição:** Retorna todas as plataformas (predefinidas e customizadas) associadas ao usuário autenticado.

### Atualizar Plataforma

*   **Método:** `PUT`
*   **URL:** `/api/v1/platforms/{id}`
*   **Descrição:** Atualiza o nome ou o status de ativação de uma plataforma existente. Restrições aplicam-se a plataformas predefinidas.

### Excluir Plataforma

*   **Método:** `DELETE`
*   **URL:** `/api/v1/platforms/{id}`
*   **Descrição:** Realiza um soft delete em uma plataforma customizada. Plataformas predefinidas não podem ser excluídas.

## Integração com Jornadas

### Finalização de Jornada com Faturamento por Plataforma

Ao finalizar uma jornada, o sistema permite registrar o faturamento detalhado por plataforma. O endpoint de finalização de jornada (`PUT /api/v1/journeys/{id}/end`) agora aceita um array de objetos contendo o `id_plataforma` e o `valor_faturado` para cada plataforma.

### Cálculo Automático do Ganho Bruto

O sistema calcula automaticamente o `ganhoBruto` total da jornada somando os `valor_faturado` de todas as plataformas informadas na requisição de finalização da jornada.

## Implementação

### Service Layer

O `PlatformService` gerencia toda a lógica de negócio das plataformas, incluindo validações de nome único, listagem de plataformas ativas, e restrições de atualização/exclusão para plataformas predefinidas.

### Controller Layer

O `PlatformController` expõe os endpoints da API, garantindo autenticação, validação de entrada (usando Zod schemas) e tratamento de erros padronizado.

### Database Schema

As tabelas `plataformas` e `jornadasFaturamentoPorPlataforma` utilizam UUIDs como chaves primárias, índices para otimização de consultas, soft delete para preservar histórico e timestamps para auditoria. Foreign keys com cascade delete garantem a integridade referencial.

## Considerações de Performance

1.  **Índices**: Criados em `idUsuario` e na combinação `idUsuario + nome` para consultas eficientes.
2.  **Soft Delete**: Preserva histórico sem impactar a performance das consultas ativas.
3.  **Relacionamentos**: Foreign keys com cascade delete para limpeza automática de dados relacionados.

## Segurança

1.  **Autenticação**: Todas as rotas requerem um token JWT válido.
2.  **Autorização**: Usuários só podem acessar e modificar suas próprias plataformas.
3.  **Validação**: Entrada sanitizada e validada antes do processamento para prevenir vulnerabilidades.

---

**Última atualização**: 01/10/2025
**Versão**: 1.1

