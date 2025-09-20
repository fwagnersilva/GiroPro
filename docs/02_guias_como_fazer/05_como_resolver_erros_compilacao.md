# Como Resolver Erros de Compilação no GiroPro

Este guia fornece soluções para os erros de compilação mais comuns encontrados no desenvolvimento do GiroPro, especialmente relacionados ao TypeScript e ao Drizzle ORM.

## 1. Erros de Tipagem com Drizzle ORM

### 1.1. Problema: Incompatibilidade de tipos Date/number

**Erro típico:**
```
Argument of type 'number' is not assignable to parameter of type 'Date | SQLWrapper'
```

**Causa:** O Drizzle ORM espera objetos `Date` para colunas de timestamp, mas o código está passando `number` (Unix timestamp).

**Solução:**
```typescript
// ❌ Incorreto
gte(notificacoes.dataEnvio, yesterday.getTime())

// ✅ Correto
gte(notificacoes.dataEnvio, yesterday)
```

**Lição:** Sempre use objetos `Date` diretamente com operadores do Drizzle (`gte`, `lte`, `eq`). O ORM fará a conversão automaticamente.

### 1.2. Problema: Nomenclatura inconsistente de campos

**Erro típico:**
```
Property 'dados_extras' does not exist on type '...'. Did you mean 'dadosExtras'?
```

**Causa:** Inconsistência entre snake_case e camelCase na nomenclatura de campos.

**Solução:**
1. Verifique o schema do banco (`src/db/schema.ts`) para confirmar a nomenclatura correta
2. Use sempre camelCase no código TypeScript:

```typescript
// ❌ Incorreto
notification.dados_extras

// ✅ Correto
notification.dadosExtras
```

### 1.3. Problema: Campos opcionais não tratados

**Erro típico:**
```
Object literal may only specify known properties, but 'data_leitura' does not exist
```

**Solução:**
```typescript
// ✅ Correto - usar o nome correto do campo
.set({
  lida: true,
  dataLeitura: new Date(), // não data_leitura
})
```

## 2. Erros de Interface e Tipagem

### 2.1. Problema: Interface não corresponde ao schema

**Causa:** A interface TypeScript não reflete a estrutura real do banco de dados.

**Solução:**
1. Sempre alinhe as interfaces com o schema do Drizzle:

```typescript
// Verifique o schema em src/db/schema.ts
export const notificacoes = sqliteTable('notificacoes', {
  id: text('id').primaryKey(),
  idUsuario: text('idUsuario').notNull(),
  dataEnvio: integer('dataEnvio', { mode: 'timestamp' }).notNull(),
  // ...
});

// Interface deve corresponder
export interface NotificationData {
  id?: string;
  idUsuario: string;
  dataEnvio?: Date; // Date, não number
  // ...
}
```

### 2.2. Problema: Tipos de retorno de consultas

**Solução:**
```typescript
// ✅ Sempre type as consultas explicitamente
const notifications = await db
  .select()
  .from(notificacoes)
  .where(whereCondition);

// ✅ Mapeie os campos corretamente
return notifications.map(notification => ({
  ...notification,
  dadosExtras: notification.dadosExtras ? JSON.parse(notification.dadosExtras) : null,
}));
```

## 3. Erros de Build e Dependências

### 3.1. Problema: Dependências não instaladas

**Sintomas:**
- Erros de módulo não encontrado
- Falhas no `npm run build`

**Solução:**
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 3.2. Problema: Versões incompatíveis

**Solução:**
1. Verifique se está usando Node.js LTS
2. Confirme as versões no `package.json`
3. Use `npm audit fix` para resolver vulnerabilidades

## 4. Checklist de Resolução de Problemas

Quando encontrar erros de compilação, siga esta ordem:

1. **Verifique o schema do banco** (`src/db/schema.ts`)
2. **Confirme a nomenclatura** (camelCase vs snake_case)
3. **Valide os tipos** (Date vs number vs string)
4. **Teste a interface** contra o schema
5. **Limpe e reinstale dependências** se necessário
6. **Consulte este guia** para problemas similares

## 5. Ferramentas Úteis

### 5.1. Comandos de diagnóstico

```bash
# Verificar erros de TypeScript
npm run build

# Verificar dependências
npm audit

# Verificar versões
node --version
npm --version
```

### 5.2. Configuração do IDE

Configure seu IDE para:
- Mostrar erros TypeScript em tempo real
- Usar formatação automática (Prettier)
- Aplicar regras de linting (ESLint)

## 6. Quando Pedir Ajuda

Se após seguir este guia o problema persistir:

1. **Documente o erro completo** (mensagem + stack trace)
2. **Inclua o contexto** (que arquivo, que operação)
3. **Mencione os passos já tentados**
4. **Consulte a documentação** de problemas comuns

Lembre-se: a maioria dos erros de compilação no GiroPro está relacionada à tipagem e ao alinhamento entre interfaces TypeScript e o schema do banco de dados.

