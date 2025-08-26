# Documentação Detalhada do Projeto GiroPro

## Introdução

Este documento serve como uma documentação detalhada para o projeto GiroPro, abordando aspectos cruciais como a estrutura do banco de dados, migrações e a integração de diagramas de Entidade-Relacionamento (ER). O objetivo é fornecer uma visão abrangente do sistema, facilitando o entendimento, a manutenção e o desenvolvimento futuro.

O GiroPro é uma aplicação desenvolvida para auxiliar no gerenciamento de despesas e receitas relacionadas a veículos e jornadas, com foco em motoristas de aplicativo. Ele oferece funcionalidades para rastrear abastecimentos, despesas diversas, jornadas de trabalho, e metas financeiras, além de um sistema de notificações e logs de atividades para monitoramento e auditoria.

## Migrações do Banco de Dados

As migrações do banco de dados são gerenciadas utilizando o Drizzle ORM, uma ferramenta moderna e eficiente para TypeScript que permite definir o esquema do banco de dados de forma programática e gerar as alterações necessárias para manter o banco de dados atualizado. Este processo garante que as modificações no esquema sejam aplicadas de forma controlada e versionada, minimizando erros e facilitando a colaboração entre desenvolvedores.

### Processo de Geração e Aplicação de Migrações

Para gerar novas migrações, o Drizzle ORM compara o esquema definido no código (`src/db/schema.ts`) com o estado atual do banco de dados. Quaisquer diferenças são então convertidas em arquivos de migração SQL, que podem ser aplicados ao banco de dados. O comando utilizado para gerar as migrações é `npx drizzle-kit generate`, que cria os arquivos de migração no diretório `drizzle/`.

Após a geração, as migrações são aplicadas ao banco de dados utilizando o comando `npx drizzle-kit push`. Este comando executa os scripts SQL gerados, atualizando a estrutura do banco de dados para refletir o esquema mais recente. É fundamental que este processo seja executado em ambientes de desenvolvimento e produção para garantir a consistência do esquema.

## Diagrama de Entidade-Relacionamento (ER)

O Diagrama de Entidade-Relacionamento (ER) é uma representação visual da estrutura do banco de dados do GiroPro, mostrando as entidades (tabelas) e os relacionamentos entre elas. Este diagrama é essencial para entender como os dados são organizados e como as diferentes partes do sistema interagem. O diagrama ER do GiroPro é gerado a partir de um arquivo Mermaid (`giropro_schema.mmd`), que descreve as entidades e seus relacionamentos de forma textual.

### Entidades Principais:

*   **USUARIOS**: Gerencia as informações dos usuários, incluindo dados de login, perfil e pontos acumulados.
*   **VEICULOS**: Armazena detalhes sobre os veículos registrados pelos usuários, como marca, modelo, ano e placa.
*   **ABASTECIMENTOS**: Registra os detalhes de cada abastecimento realizado, incluindo tipo de combustível, quantidade, valor e quilometragem.
*   **DESPESAS**: Contabiliza as despesas diversas, como manutenção, lavagem, etc.
*   **JORNADAS**: Acompanha as viagens realizadas, registrando quilometragem inicial e final, ganhos e tempo total.
*   **METAS**: Permite aos usuários definir e acompanhar metas financeiras e de desempenho.
*   **PROGRESSO_METAS**: Registra o progresso das metas ao longo do tempo.
*   **LOGS_ATIVIDADES**: Mantém um registro das ações importantes realizadas pelos usuários no sistema.
*   **HISTORICO_PRECO_COMBUSTIVEL**: Armazena o histórico de preços de combustível por cidade e estado.
*   **NOTIFICACOES**: Gerencia as notificações enviadas aos usuários.

### Relacionamentos Chave:

O diagrama ER ilustra os relacionamentos entre as entidades, como um usuário pode ter múltiplos veículos, abastecimentos, despesas, jornadas, metas e notificações. Da mesma forma, um veículo pode estar associado a vários abastecimentos, despesas e jornadas. O relacionamento entre `METAS` e `PROGRESSO_METAS` é de um para muitos, onde uma meta pode ter múltiplos registros de progresso.

O diagrama ER é uma ferramenta vital para a compreensão da arquitetura de dados do GiroPro e para o planejamento de futuras expansões ou modificações no esquema do banco de dados.




## Diagrama ER do GiroPro

![Diagrama ER do GiroPro](/home/ubuntu/GiroPro/giropro_er_diagram.png)



