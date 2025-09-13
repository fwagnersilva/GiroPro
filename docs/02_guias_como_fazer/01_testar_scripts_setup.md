Guia: Teste e Otimização dos Scripts de Setup do GiroPro

Este guia tem como objetivo detalhar o processo de teste dos scripts de setup do projeto GiroPro, identificar problemas comuns e apresentar as soluções aplicadas. O foco é otimizar a experiência de novos desenvolvedores, garantindo uma configuração de ambiente eficiente e sem atritos.

1. Status e Análise dos Scripts de Setup

1.1. setup_sqlite.sh

Status: ✅ Funcional com Observações Importantes

Análise e Recomendações para Agilidade:

•
Interatividade (npm run db:migrate): O script, ao executar npm run db:migrate, é interativo e pode solicitar confirmação manual para operações de migração (ex: renomeação de colunas). Isso é uma característica do drizzle-kit e requer atenção do desenvolvedor durante a execução. Para automação em ambientes de CI/CD, considere:

•
Explorar flags não-interativas do Drizzle ORM, se disponíveis, ou

•
Implementar um wrapper que simule a interação ou que execute as migrações de forma programática.



•
Dependência do Arquivo .env: O script espera que o arquivo .env já esteja configurado no diretório backend/. É crucial que o desenvolvedor crie e configure o .env ANTES de executar este script. Consulte 01_tutoriais/01_setup_inicial.md para as instruções detalhadas de configuração do .env.

• Inconsistência de Nomenclatura (camelCase): A inconsistência entre snake_case e camelCase no schema e no código foi uma fonte significativa de erros. É mandatório que a nomenclatura camelCase seja utilizada consistentemente em todo o projeto (código e banco de dados). As migrações do Drizzle ORM dependem dessa padronização para funcionar corretamente. Para mais detalhes sobre a padronização, consulte 03_explicacoes/00ProblemasComunsELicoesAprendidas.md e 03_explicacoes/04TecnologiasPadroes.md.

•
Verificação Pré-execução: Antes de rodar setup_sqlite.sh, o desenvolvedor deve:

1.
Garantir que está no diretório backend/.

2.
Verificar a existência e configuração correta do arquivo .env.

3.
Assegurar que as dependências do Node.js (npm install) foram instaladas no diretório backend/.



1.2. verify_setup.sh

Status: ✅ Funcional

Análise e Recomendações para Agilidade:

•
Este script é uma ferramenta útil para verificar rapidamente a integridade básica do ambiente após o setup. Ele valida a presença de arquivos e diretórios essenciais, garantindo que a estrutura mínima do projeto esteja correta.

•
Foco na Estrutura: Os testes de sanidade do frontend problemáticos foram removidos, e o script agora se concentra em verificações robustas da estrutura básica do projeto, o que é mais relevante para um teste de setup.

Recomendações para o Desenvolvedor:

•
Execução Pós-Setup: Execute este script após o setup_sqlite.sh (ou setup.sh) para uma validação rápida de que os arquivos e diretórios esperados foram criados.

•
Manutenção Contínua: Este script deve ser mantido atualizado com a evolução da estrutura do projeto. Se novos arquivos ou diretórios importantes forem adicionados, inclua verificações para eles.

•
Complementar, Não Substituir: Este script é um teste de

sanidade básica. Para testes mais abrangentes do frontend e backend, utilize os testes automatizados do projeto (unitários, integração, E2E) que podem ser executados de forma independente ou como parte de um pipeline de CI/CD.

Plain Text


**Exemplo de execução:**
```bash
./verify_setup.sh
```


1.3. setup.sh

Status: ❓ Não Testado Completamente (Requer Validação)

Análise e Recomendações para Agilidade:

•
Dependência do Docker: Este script foi projetado para configurar o banco de dados PostgreSQL via Docker. Ele não funcionará em ambientes onde o Docker não está disponível ou configurado corretamente. O desenvolvedor deve garantir que o Docker esteja em execução antes de tentar usar este script.

•
Referências a .env.example: Assim como o setup_sqlite.sh, este script pode depender da criação ou cópia manual de arquivos .env.example. Sempre consulte 01_tutoriais/01_setup_inicial.md para as instruções mais atualizadas sobre a configuração do ambiente.

•
Potenciais Problemas: Este script pode herdar os mesmos problemas de interatividade e conflitos de schema dos outros scripts, especialmente se as migrações do Drizzle ORM forem executadas.

Recomendações para o Desenvolvedor:

•
Validação Urgente: É crucial realizar testes completos deste script assim que os problemas de schema do banco de dados forem resolvidos e a padronização da nomenclatura for aplicada em todo o projeto.

•
Verificação de Pré-requisitos: Adicione uma verificação robusta dos pré-requisitos (Docker, Node.js, npm) no início do script para fornecer feedback claro ao usuário caso algo esteja faltando.

•
Fallback para SQLite: Considere implementar um mecanismo de fallback para SQLite quando o Docker não estiver disponível ou configurado. Isso garantirá que o setup possa ser concluído em diferentes ambientes de desenvolvimento, aumentando a flexibilidade.

•
Modo Não-Interativo: Se possível, adapte o script para que possa ser executado em um modo não-interativo, ideal para ambientes de CI/CD e para agilizar o setup em massa.

2. Problemas Comuns e Soluções para Agilizar o Desenvolvimento

Esta seção aborda os problemas mais frequentes encontrados durante o setup e desenvolvimento do GiroPro, oferecendo soluções diretas para que o programador possa superá-los rapidamente.

2.1. Inconsistência de Schema e Nomenclatura

•
Problema Crítico: O código utiliza snake_case (ex: id_usuario, data_abastecimento), enquanto o schema do Drizzle ORM e o restante do projeto esperam camelCase (ex: idUsuario, dataAbastecimento). Isso causa erros de tipagem em cascata no TypeScript e falhas nas migrações.

•
Solução Imediata: Padronize para camelCase em TODO o projeto. Isso inclui o schema do banco de dados (src/db/schema.ts), as interfaces TypeScript, os serviços, controladores e o frontend. Utilize as ferramentas de refatoração do seu IDE para garantir que todas as referências sejam atualizadas. Para mais detalhes sobre a padronização e suas implicações, consulte 03_explicacoes/00_problemas_comuns_e_licoes_aprendidas.md e 03_explicacoes/04_tecnologias_padroes.md.

•
Impacto na Agilidade: Resolver essa inconsistência é fundamental para que as migrações funcionem, o TypeScript compile sem erros e o desenvolvimento prossiga sem retrabalho constante.

2.2. Configuração de Ambiente e Variáveis .env

•
Problema: Ausência de arquivos .env.example claros e scripts que assumem uma estrutura de ambiente já configurada, além da falta de documentação clara sobre como configurar as variáveis de ambiente.

•
Solução:

1.
Crie arquivos .env.example para os diretórios backend/ e frontend/ com todas as variáveis necessárias e exemplos de valores. Isso guiará o desenvolvedor na configuração inicial.

2.
Implemente detecção automática de ambiente nos scripts de setup, se possível, para adaptar o comportamento (ex: usar SQLite em desenvolvimento, PostgreSQL em produção).

3.
Adicione um modo não-interativo aos scripts para automação em CI/CD.

4.
Consulte e mantenha atualizado o 01_tutoriais/01_setup_inicial.md, que é o guia principal para a configuração do ambiente.



•
Impacto na Agilidade: Uma configuração de ambiente clara e automatizada reduz drasticamente o tempo de onboarding de novos desenvolvedores e minimiza erros de setup.

2.3. Dependências Externas (Docker/PostgreSQL)

•
Problema: O Docker pode não funcionar em todos os ambientes de sandbox ou máquinas locais, impedindo a inicialização do PostgreSQL e bloqueando o setup.

•
Solução:

1.
Priorize o uso de SQLite para desenvolvimento local e testes. Esta é a alternativa mais leve e fácil de configurar, garantindo que o desenvolvedor possa começar a trabalhar rapidamente.

2.
Documente claramente essa alternativa e como alternar entre SQLite e PostgreSQL.

3.
Investigue e resolva os problemas com Docker para ambientes de produção ou de desenvolvimento que o exijam, mas não deixe que isso bloqueie o desenvolvimento local.



•
Impacto na Agilidade: Oferecer uma alternativa leve e funcional para o banco de dados desbloqueia o desenvolvimento local e permite que os desenvolvedores trabalhem mesmo com restrições de ambiente.

3. Checklist de Setup Rápido para Desenvolvedores

Para agilizar o processo de setup e garantir que você não perca tempo com problemas comuns, siga este checklist antes e durante a execução dos scripts de setup:

Antes de Clonar o Repositório:




Instalar Pré-requisitos: Certifique-se de ter Node.js (LTS), npm, Git e Docker/Docker Compose (se for usar PostgreSQL) instalados e configurados. Consulte 01_tutoriais/01_setup_inicial.md.

Após Clonar o Repositório (cd GiroPro):




Navegar para o Backend: cd backend




Instalar Dependências do Backend: npm install




Configurar .env do Backend: Copie giropro.env para .env (cp giropro.env .env) e edite o arquivo .env com suas configurações (especialmente DB_TYPE=sqlite para desenvolvimento local).




Executar Setup do SQLite: ./setup_sqlite.sh (este script pode ser interativo, esteja pronto para confirmar).




Iniciar Backend: npm run dev (verifique se o servidor inicia sem erros).

Em um Novo Terminal (para o Frontend):




Navegar para o Frontend: cd ../frontend




Instalar Dependências do Frontend: npm install




Configurar .env do Frontend: Copie .env.example para .env (cp .env.example .env) e configure REACT_APP_API_URL para http://localhost:3000/api/v1.




Iniciar Frontend: npm start (verifique se o Expo Dev Tools abre no navegador).

Verificação Final:




Testar Fluxo de Login/Registro: Tente registrar um novo usuário e fazer login na aplicação frontend.




Verificar Dados: Navegue pelas telas para garantir que os dados estão sendo carregados do backend (ex: dashboard, cadastro de veículo).




Executar verify_setup.sh: Volte para o diretório raiz do projeto (cd ..) e execute ./verify_setup.sh para uma verificação rápida da estrutura.

4. Troubleshooting Rápido

•
Erros de snake_case vs camelCase: Refatore o código para usar camelCase consistentemente. Verifique 03_explicacoes/04_tecnologias_padroes.md.

•
npm install falhando: Tente npm cache clean --force && rm -rf node_modules package-lock.json && npm install.

•
Backend não inicia (porta em uso): Altere a porta no .env do backend (PORT=3001) ou encerre o processo que está usando a porta (lsof -i :3000 no Linux/macOS, netstat -ano | findstr :3000 no Windows).

•
Erros de migração interativa: Confirme as operações no terminal quando solicitado pelo drizzle-kit.

•
Docker/PostgreSQL não funciona: Priorize o uso de SQLite para desenvolvimento local. Verifique a documentação do Docker para seu sistema operacional.

