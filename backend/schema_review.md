# Revisão do Schema do Banco de Dados

## Observações Iniciais

O schema do banco de dados, conforme definido em `schema_analysis.sql`, parece seguir um padrão consistente para a maioria das tabelas, utilizando `id` como chave primária do tipo `text` e campos de timestamp como `createdAt`, `updatedAt` e `deletedAt`.

## Padronização Proposta

### Nomenclatura

- **Campos de ID:** Manter `id` como o nome do campo de chave primária em todas as tabelas.
- **Chaves Estrangeiras:** Manter o padrão `id[NomeDaTabelaReferenciada]` (ex: `idUsuario`, `idVeiculo`).
- **Campos de Data/Hora:** Manter o padrão `data[NomeDoEvento]` (ex: `dataAbastecimento`, `dataInicio`, `dataFim`).
- **Campos de Timestamp:** Manter `createdAt`, `updatedAt`, `deletedAt` para controle de auditoria e exclusão lógica.

### Tipos de Dados

- **IDs:** `text` para UUIDs ou IDs gerados por string.
- **Timestamps:** `integer` para `unixepoch()`.
- **Valores Monetários/Quantidades:** `integer` para valores que representam dinheiro (ex: `valorLitro`, `valorTotal`, `valorDespesa`, `ganhoBruto`, `valorObjetivo`, `valorAtual`, `incremento`). Considerar `real` para `quantidadeLitros` e `mediaConsumo`.
- **Textos:** `text` com limites de comprimento apropriados (ex: `text(100)`, `text(255)`, `text(500)`).

### Restrições e Índices

- **Chaves Primárias:** `PRIMARY KEY NOT NULL` para todos os campos `id`.
- **Chaves Estrangeiras:** `FOREIGN KEY` com `ON UPDATE no action ON DELETE cascade` ou `ON DELETE set null` conforme a necessidade da relação.
- **Índices:** Manter os índices existentes para otimização de consultas e adicionar novos conforme necessário para campos frequentemente usados em `WHERE` ou `JOIN` clauses.

## Inconsistências Encontradas e Sugestões de Ajuste

1.  **`valorLitro`, `valorTotal`, `valorDespesa`, `precoMedio`, `ganhoBruto`, `valorObjetivo`, `valorAtual`, `incremento`:** Atualmente definidos como `integer`. Se esses campos representam valores monetários que podem ter casas decimais (centavos), o tipo `real` ou `numeric` seria mais apropriado para evitar perda de precisão. Se a intenção é armazenar centavos como inteiros (ex: R$10,50 como 1050), então `integer` está correto, mas isso deve ser documentado e consistente.
    *   **Sugestão:** Mudar para `real` ou `numeric` se houver necessidade de precisão decimal para valores monetários, ou garantir que a aplicação trate os valores como inteiros representando centavos.

2.  **`percentualConcluido`, `percentualAnterior`, `percentualAtual`:** Atualmente definidos como `integer`. Se representam porcentagens, podem ser `real` para permitir valores como 99.5%, ou `integer` se a intenção é apenas valores inteiros (ex: 99%).
    *   **Sugestão:** Mudar para `real` se for necessário armazenar porcentagens com casas decimais.

3.  **`kmAtual`, `kmInicio`, `kmFim`, `kmTotal`:** Atualmente definidos como `integer`. Geralmente, quilometragem é um número inteiro, mas se houver casos de quilometragem parcial (ex: 10.5 km), `real` seria mais flexível.
    *   **Sugestão:** Manter `integer` se a quilometragem for sempre inteira, ou mudar para `real` se houver necessidade de precisão decimal.

4.  **`tempoTotal` na tabela `jornadas`:** Definido como `integer`. Assumindo que é em segundos ou minutos, `integer` está ok. Se for para armazenar durações mais complexas, pode ser necessário um tipo de dado específico ou uma combinação de campos.
    *   **Sugestão:** Manter `integer` se a unidade de tempo for consistente (ex: segundos ou minutos).

5.  **`tentativasLogin` e `conquistasDesbloqueadas` na tabela `usuarios`:** Definidos como `integer` com `DEFAULT 0 NOT NULL`. Isso está consistente.

6.  **`deletedAt`:** Consistente em todas as tabelas para exclusão lógica.

7.  **`id` em `__drizzle_migrations`:** Definido como `SERIAL PRIMARY KEY`. Em outras tabelas, `id` é `text PRIMARY KEY NOT NULL`. Embora `__drizzle_migrations` seja uma tabela interna do ORM, é uma pequena inconsistência na padronização geral de IDs.
    *   **Sugestão:** Manter como está, pois é uma tabela de controle do ORM.

## Próximos Passos

- Discutir as sugestões de ajuste com a equipe de desenvolvimento.
- Aplicar as alterações no schema, se aprovadas.
- Revisar as migrações existentes e criar novas, se necessário, para refletir as mudanças no schema.
- Gerar o Diagrama ER atualizado.

