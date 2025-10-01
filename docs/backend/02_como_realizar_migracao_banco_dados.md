# Como Realizar uma Migração de Banco de Dados com Drizzle ORM

Este guia detalha o procedimento para criar e aplicar novas migrações de banco de dados utilizando o Drizzle ORM no projeto GiroPro. Migrações são essenciais para gerenciar alterações no schema do banco de dados de forma controlada e versionada, garantindo a evolução da estrutura de dados de forma segura e eficiente.

## Pré-requisitos

Antes de iniciar, certifique-se de que você tem:

*   Node.js e pnpm instalados.
*   O repositório GiroPro clonado e as dependências do backend instaladas (`pnpm install` no diretório `backend`).
*   Conhecimento básico de TypeScript e Drizzle ORM.

## 1. Entendendo o Fluxo de Migração

O Drizzle ORM utiliza um processo de migração baseado em snapshots, que permite um controle preciso sobre as alterações do esquema do banco de dados. O fluxo é o seguinte:

1.  **Modifica o Schema**: Altera o arquivo `src/db/schema.ts` para refletir as mudanças desejadas na estrutura do banco de dados (ex: adicionar uma nova tabela, coluna, alterar tipos, etc.).
2.  **Gera a Migração**: O Drizzle compara o schema atual com um snapshot anterior e gera um arquivo SQL (e um arquivo TypeScript correspondente) com as instruções para aplicar as diferenças.
3.  **Aplica a Migração**: As instruções SQL geradas são executadas no banco de dados para atualizar sua estrutura.

## 2. Modificando o Schema (`src/db/schema.ts`)

Todas as alterações na estrutura do banco de dados devem ser feitas no arquivo `src/db/schema.ts`. Por exemplo, para adicionar uma nova coluna a uma tabela existente:

```typescript
// Exemplo: Adicionando uma coluna 'telefone' à tabela 'usuarios'
export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text("nome", { length: 100 }).notNull(),
  email: text("email", { length: 255 }).notNull(),
  senhaHash: text("senhaHash", { length: 255 }).notNull(),
  // ... outras colunas existentes
  telefone: text("telefone", { length: 20 }), // Nova coluna
});
```

**Importante**: Mantenha a consistência na nomenclatura. O projeto GiroPro utiliza `camelCase` para os nomes das colunas no schema TypeScript, que o Drizzle ORM mapeará para `snake_case` no banco de dados (se configurado para isso, o que é o caso padrão). **É crucial que os nomes das colunas no `schema.ts` sigam o padrão `camelCase` para evitar problemas de tipagem e inconsistências com o restante do código.**

## 3. Gerando a Migração

Após modificar o `src/db/schema.ts`, você precisa gerar os arquivos de migração. Navegue até o diretório `backend` e execute o seguinte comando:

```bash
pnpm run db:generate
```

Este comando fará o seguinte:

*   Comparará o `src/db/schema.ts` com o estado atual do banco de dados (ou o último snapshot).
*   Gerará um novo diretório com um timestamp (ex: `drizzle/0001_initial_schema.ts` e `drizzle/0001_initial_schema.sql`) contendo as instruções SQL para aplicar as diferenças.
*   Atualizará o arquivo `drizzle/meta/_journal.json` para registrar a nova migração.

**Verifique os arquivos gerados**: É crucial revisar o arquivo `.sql` gerado para garantir que as alterações propostas são as esperadas e não há comandos destrutivos acidentais.

## 4. Aplicando a Migração

Com os arquivos de migração gerados e verificados, você pode aplicá-los ao seu banco de dados. Certifique-se de que o banco de dados SQLite (`giropro.db`) esteja no diretório `backend`.

Execute o comando:

```bash
pnpm run db:migrate
```

**Nota Importante sobre Interatividade**: Este comando pode ser interativo, especialmente quando há operações que podem causar perda de dados (como renomeação de colunas). O Drizzle ORM pode solicitar confirmação manual para essas operações. Fique atento às mensagens no terminal e confirme as ações quando solicitado. **Para evitar interrupções em ambientes automatizados, considere as opções abaixo.**

Este comando:

*   Lerá os arquivos de migração no diretório `drizzle/`.
*   Aplicará as migrações pendentes ao banco de dados `giropro.db`.
*   Registrará as migrações aplicadas na tabela interna do Drizzle no banco de dados.

**Para Ambientes de CI/CD e Automação**: Se você precisar executar migrações em um ambiente automatizado (CI/CD) ou de forma não-interativa, o Drizzle ORM oferece a opção `--accept-data-loss` para o comando `migrate`. **Use esta flag com extrema cautela**, pois ela aceitará automaticamente qualquer perda de dados que possa ocorrer durante a migração. Exemplo:

```bash
pnpm run db:migrate -- --accept-data-loss
```

Alternativamente, para migrações que não envolvem perda de dados, o comando pode ser executado sem a flag interativa, dependendo da versão do Drizzle e da natureza da migração. Sempre teste em um ambiente de desenvolvimento antes de aplicar em produção.

## 5. Revertendo Migrações (Atenção!)

Reverter migrações deve ser feito com extrema cautela, especialmente em ambientes de produção, pois pode levar à perda de dados. O Drizzle ORM não oferece um comando `rollback` nativo para SQLite de forma simples. Se precisar reverter:

1.  **Remova os arquivos de migração gerados**: Exclua o diretório de migração mais recente em `drizzle/`.
2.  **Edite o `drizzle/meta/_journal.json`**: Remova a entrada correspondente à migração que você acabou de excluir.
3.  **Reverta as alterações no `src/db/schema.ts`**: Volte o arquivo `schema.ts` para o estado anterior à migração.
4.  **Reconstrua o banco de dados (se necessário)**: Para um ambiente de desenvolvimento, a maneira mais segura de reverter completamente é deletar o arquivo `giropro.db` e rodar `pnpm run db:migrate` novamente para recriar o banco com o schema desejado.

## 6. Dicas e Boas Práticas

*   **Migrações Pequenas e Focadas**: Faça migrações pequenas e focadas em uma única alteração de schema. Isso facilita a revisão e a reversão, se necessário.
*   **Versionamento**: Sempre faça commit dos arquivos de migração gerados junto com as alterações no `schema.ts`. Eles fazem parte do histórico do projeto.
*   **Backup**: Sempre faça backup do seu banco de dados antes de aplicar migrações, especialmente em ambientes de produção.
*   **Ambiente de Desenvolvimento**: Utilize um banco de dados de desenvolvimento separado para testar suas migrações antes de aplicá-las em ambientes de staging ou produção.

Ao seguir este guia, você poderá gerenciar as alterações no schema do banco de dados do GiroPro de forma eficiente e segura.

---

**Última atualização**: 01/10/2025
**Versão**: 1.1

