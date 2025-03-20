Aplicativo para motoristas de aplicativos
Versão 1.0

# 1. Visão Geral do Projeto

## 1.1 Objetivo do aplicativo  

O aplicativo auxilia motoristas de aplicativo (Uber, 99, InDrive, etc.) a gerenciar jornadas, ganhos, abastecimentos e despesas, fornecendo relatórios completos para análise financeira.  

## 1.2 Funcionalidades Principais  

- 📌 **Registro de jornadas** com cálculo de faturamento e tempo rodado.
- ⛽ **Gestão de abastecimentos** com monitoramento de consumo médio.
- 💰 **Cadastro de despesas e provisões** para planejamento financeiro.
- 📊 **Relatórios detalhados** com previsões e rankings.
- 🎯 **Definição de metas** diárias, semanais e mensais.
- 🚀 **Comparação de ganhos entre aplicativos** e média de faturamento por cidade.
- 📎 **Exportação de relatórios** para PDF, Excel e CSV.
- 🔐 **Autenticação via e-mail, senha e redes sociais**.
- 📱 **Disponível para Android, iOS e Web (PWA)**.

## 1.3 Público-alvo  

Motoristas de aplicativo (Uber, 99, InDrive, etc.) que querem controlar melhor seus ganhos e gastos.
Motoristas que precisam calcular lucros líquidos e planejar despesas futuras.
Motoristas que querem saber quais dias são mais rentáveis e qual plataforma rende mais na cidade.

# 2. Funcionalidades e Regras de Negócio  

## 2.1 Tela de Login e Cadastro  

1. Login com E-mail e Senha
2. Suporte a Redes Sociais (Google, Facebook, Apple ID).
3. Recuperação de Senha via E-mail.
4. Cadastro com os seguintes campos:

Nome (mínimo 3 caracteres).
E-mail (único no sistema, usado como chave principal do login).
Cidade (somente letras).
Senha (mínimo 6 caracteres, confirmação obrigatória).  
Sincronização de dados ☁️, Como o app pode ser usado em múltiplos dispositivos (Web, Android, iOS), garantir que todas as entradas fiquem salvas na nuvem.

Motivação:

📌 Ter um login global, acessível para motoristas de qualquer país.  
📌 Facilidade de acesso com redes sociais.  
📌 Recuperação de conta simples e segura via e-mail.
Enviar um e-mail de confirmação antes de ativar a conta. Isso evita spam e contas falsas.

## 2.2 Tela Inicial (Painel)  

1. Resumo da Semana (dados do mês atual carregados automaticamente).
2. Cards com indicadores principais:

Ganho do Dia (faturamento do dia).
Ganho da Semana (faturamento acumulado na semana).
Lucro Líquido (faturamento - custos).
Gastos com Combustível (gasto diário e semanal).
Ganho por KM rodado.

Motivação:

📌 Exibir um resumo rápido da performance financeira.  
📌 Permitir que o motorista tome decisões sobre quando vale a pena trabalhar mais.
Permitir que o motorista escolha quais métricas quer ver primeiro. Ex: pode querer ver "Lucro líquido" antes de "Ganho da Semana".
Exibir um aviso caso os gastos com combustível estejam acima da média usual do motorista.

## 2.3 Jornadas de Trabalho  

Motorista inicia uma jornada, registrando quilometragem inicial e horário automático.
Ao final, insere quilometragem final, corridas realizadas e faturamento podendo editar informações passadas se necessário for.

Cálculos automáticos:

- Quilometragem percorrida.
- Tempo total da jornada.
- Gasto estimado com combustível (baseado na média do veículo).
- Lucro líquido da jornada (faturamento - despesas).

Início de Jornada:

- Data e Hora registradas automaticamente.
- Quilometragem inicial (somente números inteiros entre 000000 e 999999).  

Finalização de Jornada:  

- Quilometragem final (deve ser maior ou igual à inicial).
- Número de corridas realizadas.
- Faturamento total da jornada (com máscara R$ 9.999,99).  

Cálculos automáticos ao finalizar a jornada:

- Quilometragem percorrida.
- Tempo total trabalhado.
- Gasto estimado com combustível (baseado na média do carro).
- Lucro líquido da jornada.
- Histórico de Jornadas** (edição e exclusão permitidas).
- Filtro por data** (padrão: mês atual).


Motivação:  
📌 **Registrar todas as jornadas de trabalho** e acompanhar os ganhos por período.  
📌 **Evitar que o motorista esqueça de finalizar a jornada** (notificações de lembrete).

## 2.4 Gestão de Combustivel  

🚗 Registro de abastecimentos com:

- Data e hora.
- Tipo de combustível (Gasolina, Álcool, Diesel, GNV).
- Quilometragem no momento do abastecimento.
- Quantidade abastecida e preço por litro.
- Posto de combustível (opcional).  

Campos para inserção de abastecimento:

- Data e Hora.
- Tipo de combustível (Gasolina, Álcool, Diesel, GNV).
- Quilometragem no momento do abastecimento.
- Quantidade abastecida (exemplo: 45.75 litros).
- Preço por litro.
- Valor total.  

Motivação:
📌 Controlar com precisão o gasto com combustível, permitindo análises sobre consumo e eficiência.
📌 A quilometragem media é calculada com base na quantidade de litros abastecidos e a quilometragem percorrida.
Aviso de Consumo Elevado ⚠️ - Se o consumo médio do carro subir muito em comparação com os últimos abastecimentos, exibir um alerta.

## 2.5 Controle de Despesas  

 Cadastro de despesas avulsas e recorrentes (ex: mecânico, IPVA, seguro, aluguel).
  Vinculação a um veículo específico (o usuário escolhe qual veículo).  
  Se uma despesa for parcelada, o sistema permitirá:

- Cadastrar a quantidade de parcelas.
- Pagar parcelas antecipadamente (o sistema sugere remover parcelas futuras, mas o usuário pode negar e ajustar manualmente).
- Caso pague um valor diferente do previsto, o sistema não redistribuirá automaticamente**, mas **permitirá ajuste manual.

Histórico de despesas acessível e editável.  
Exportação de dados em formato de tabela (PDF, Excel, CSV).

Motivação:  
📌 Controlar gastos avulsos e recorrentes.  
📌 Permitir ajustes manuais para pagamentos antecipados e parcelamentos.
Gráficos Visuais 📊 Mostrar gráficos de distribuição de gastos (Ex: 40% combustível, 30% manutenção, etc.).
Se houver um IPVA ou seguro para pagar, exibir um lembrete com antecedência.


## 2.6 Metas para Motoristas

Objetivo da Funcionalidade

🎯 Motorista pode definir metas diárias, semanais e mensais.
📊 Card na tela inicial mostra progresso da meta em tempo real.
🔔 Alertas se o motorista estiver abaixo da meta.
Permitir que o motorista veja como foi seu desempenho em metas passadas.
Se um motorista geralmente ganha R$ 1.200/semana, sugerir uma meta próxima disso ao invés de deixar em branco.

Comparar o progresso com a meta diretamente na tela inicial.  
Ter um card dinâmico mostrando o percentual atingido.  

Como Funcionará?

Definição de Metas

O motorista poderá cadastrar três tipos de metas:

| **Tipo de Meta** | **O que o motorista define?** | **Exemplo** |
| **Diária** | Valor que deseja faturar no dia. | **R$ 250/dia** |
| **Semanal** | Valor total desejado para a semana. | **R$ 1.750/semana** |
| **Mensal** | Valor total desejado no mês. | **R$ 7.500/mês** |

O motorista pode alterar ou redefinir metas futuras a qualquer momento, no entanto nao pode alterar uma meta do passado.  
As metas não são acumulativas (ex: uma meta semanal não soma automaticamente as diárias).

Monitoramento do Progresso

Será adicionado um card dinâmico na tela inicial mostrando o progresso da meta escolhida.  
O motorista poderá alternar entre visualizar o progresso diário, semanal ou mensal.  
Exibição do progresso em percentual e valores.  

Exemplo de Card na Tela Inicial:

🎯 Meta Semanal: R$ 1.750
📊 Progresso: R$ 1.200 / R$ 1.750 (68%)
⚠️ Você precisa de R$ 550 para atingir sua meta!

Alertas e Notificações

Se o motorista estiver abaixo da meta, aparecerá um alerta na tela inicial.  
O sistema pode enviar notificações push sugerindo aumentar o ritmo de trabalho.

| Condição | Mensagem exibida|
| 75% ou mais da meta atingida ✅ | **"Ótimo trabalho! Você está perto de atingir sua meta!"** |
| Abaixo de 50% ⚠️ | **"Você está abaixo da sua meta. Que tal rodar mais um pouco?"** |

Integração na Tela Inicial

🔹 O card de metas será adicionado ao painel principal.  
🔹 O motorista poderá trocar entre meta diária, semanal ou mensal.  
🔹 O progresso será atualizado **em tempo real, com base no faturamento registrado.

## 2.7 Análises e Relatórios

Relatórios Básicos:

- Faturamento diário, semanal e mensal.
- Gastos com combustível por dia.
- Ganho por KM rodado.
- Comparação de faturamento entre Uber, 99, InDrive.

Relatórios Avançados:

- Ranking de faturamento na cidade.
- Ranking de melhores motoristas em relação a faturamento da cidade
- Ranking de melhores motoristas em relação a lucro da cidade
- Ranking de motoristas com maiores quilometragens
- Ranking da sua posição em relação aos outros motoristas em faturamento e lucro
- Média de faturamento e quilometragem por dia da semana.
- Gráfico de evolução das últimas 8 semanas (faturamento vs. gastos).
- Previsão de faturamento e lucro líquido para a próxima semana e mês.  
    ✅ Exportação de dados em tabela (PDF, Excel, CSV).  
    ✅ Filtros por data (mês atual por padrão).  
    ✅ Modo de exibição otimizado (mostrando um card de cada vez, com rolagem automática).
  Mostrar um ranking opcional com os melhores motoristas da cidade baseado em faturamento e lucro líquido.
  O motorista pode optar por mostrar ou esconder seu nome no ranking nos configuraçõees do app
  Um gráfico mostrando qual app (Uber, 99, etc.) trouxe mais ganhos ao longo do tempo.

Motivação:  
📌 Analisar desempenho financeiro e eficiência.  
📌 Comparar ganhos entre plataformas** e entender quais dias e semanas são mais lucrativos.

# 3.0 Frontend UX/UI

## Tela de Login e Cadastro
Objetivo: Permitir que o motorista faça login ou crie uma conta.
permitir acionar o dark mode
Permitir login biometrico com digital
Além de login por digital/Face ID, permitir um PIN de 4-6 dígitos como alternativa rápida ao login completo, Exemplo: "Digite seu PIN ou use biometria."
Avisar instantaneamente se o e-mail já existe ao digitar, antes de apertar "Criar Conta".
Permitir a mudança automática para Dark Mode com base nas preferências do sistema operacional.

Componentes:

✅ **Login:**

- **Campos:** E-mail e senha.
- **Botão "Entrar"**.
- **Botão "Entrar com Google / Apple ID"**.
- **Link "Esqueceu a senha?"**.

✅ **Cadastro:**

- **Campos:** Nome, e-mail, senha e cidade.
- **Botão "Criar Conta"**.
- **Checkbox "Aceito os termos de uso"**.

✅ **Feedback Visual:**

- **Mensagens de erro/sucesso** (ex: "E-mail inválido", "Senha incorreta").
- **Animação ao carregar o login/cadastro**.

**Tecnologias:**

- **React Hook Form + Zod** → Validação de formulários.
- **Firebase Auth ou Supabase** → Autenticação segura.

## 3.1 Tela Inicial (Dashboard)

Objetivo: Mostrar um resumo do desempenho do motorista.
os dados não serao atualizados de acordo com o banco de dados
Exibir skeleton loaders enquanto os dados carregam para evitar tela "vazia".
Suavizar a transição dos valores no card de ganhos quando um novo valor entra.
Motoristas podem escolher quais cards querem ver primeiro. Exemplo: Alguém pode querer ver Lucro Líquido antes de KM Rodados.
Criar um widget opcional mostrando "Faturamento do Dia" e "Progresso da Meta" direto na tela inicial do celular.

**Componentes:**

✅ **Cards Resumo:**

- **Ganhos do Dia** 💰.
- **Lucro Líquido** 📊.
- **KM Rodados** 🚗.
- **Gasto com Combustível** ⛽.

✅ **Card de Metas:**

- Progresso da meta escolhida (diária, semanal ou mensal).
- **Botão "Trocar Meta"**.

✅ **Atalhos Rápidos:**

- 📌 **Iniciar Jornada**.
- 📌 **Registrar Abastecimento**.
- 📌 **Ver Relatórios**.

💡 **Tecnologias:**

- **TanStack Query** → Atualização em tempo real dos ganhos.
- **Shadcn/ui + Tailwind CSS** → Layout responsivo e moderno.

## 3.2 Tela de Jornadas de Trabalho

**Objetivo:** Registrar e acompanhar jornadas de trabalho do motorista.
É possivel editar uma jornada passada e possibilidade de pausar uma jornada no caso de um café ou almoço para nao contar o tempo de serviço.
Criar um botão "Pausar Jornada" para cafés e intervalos sem contar como tempo de serviço.
Exibir pequenas métricas como:
🚀 Melhor dia da semana para faturamento
⏳ Duração média das jornadas

**Componentes:**

✅ **Início da Jornada:**

- **Botão "Iniciar Jornada"** → Grava **data, hora e quilometragem inicial**.
- **Campo de Quilometragem Inicial** (validação automática).

✅ **Finalização da Jornada:**

- **Botão "Finalizar Jornada"** → Captura **quilometragem final e faturamento**.
- **Cálculo Automático:**
  - 🚗 **KM Percorridos**.
  - 💰 **Faturamento Total**.
  - ⛽ **Gasto estimado com combustível**.

## Histórico de Jornadas

- Exibição das **últimas jornadas registradas**.
- Filtro por data.

💡 **Tecnologias:**

- **Shadcn/ui + Tailwind CSS** → Design responsivo.
- **TanStack Query** → Atualização instantânea dos dados.

## 3.3 Tela de Abastecimentos

**Objetivo:** Registrar e acompanhar abastecimentos.
Criar uma previsão de quantos KM ainda podem ser rodados baseado no tanque atual.
Exibir abastecimentos passados como um gráfico de barras ao invés de apenas uma lista.


**Componentes:**

✅ **Registrar Abastecimento:**

- 📆 **Data e Hora** (registradas automaticamente).
- ⛽ **Tipo de Combustível** (Gasolina, Álcool, Diesel, GNV).
- 🚗 **KM no momento do abastecimento**.
- 💧 **Litros abastecidos**.
- 💰 **Preço por litro e valor total**.
- 🏪 **Posto de Combustível (opcional)**.
- **Botão "Salvar Abastecimento"**.

✅ **Histórico de Abastecimentos:**

- Listagem dos últimos abastecimentos.
- Gráfico de **consumo médio do veículo**.

💡 **Tecnologias:**

- **React Hook Form + Zod** → Validação dos campos.
- **Recharts** → Exibição do consumo médio do veículo.

## 3.4 Tela de Despesas

📍 **Objetivo:** Registrar e visualizar despesas do motorista.
permitir alterar o vencimento de contas futuras
indicar se uma despesa é recorrente e forma automatica
Alertas Automáticos, "Seu IPVA vence em 3 dias. Deseja registrar o pagamento?"

**Componentes:**

✅ **Cadastro de Despesas:**

- 📌 **Tipo de Despesa:** (IPVA, Seguro, Manutenção, Aluguel, Outros).
- 💰 **Valor**.
- 🗓 **Data da Despesa**.
- **Botão "Salvar Despesa"**.

✅ **Histórico de Despesas:**

- Listagem das últimas despesas.
- Filtro por período (dia, semana, mês).

✅ **Exportação de Dados:**

- **Botão "Exportar para PDF/Excel"**.

💡 **Tecnologias:**

- **TanStack Table** → Exibição das despesas com filtros.
- **PDFKit / SheetJS** → Exportação para PDF e Excel.

## 3.5 Tela de Relatórios e Análises

📍 **Objetivo:** Mostrar estatísticas financeiras para o motorista.
Gráfico de Tendência de Lucro, Um gráfico de linha comparando últimos 3 meses de lucro líquido.
Sistema de Insights Sugestões automáticas como: "Seu faturamento caiu 10% esta semana. Pode ser um reflexo do horário trabalhado?" "Sábado tem sido seu dia mais lucrativo. Considere trabalhar mais nesse dia."
Ranking mostrando motoristas com perfil semelhante na cidade (Ex: mesma média de quilometragem, mesmo carro).

**Componentes:**

✅ **Relatórios Básicos:**

- 📆 **Faturamento diário, semanal e mensal**.
- ⛽ **Gastos com combustível por período**.
- 🚗 **Média de KM rodado por dia**.

✅ **Relatórios Avançados:**

- 🔹 **Comparação de ganhos entre Uber, 99, InDrive**.
- 📈 **Gráfico de evolução dos últimos 3 meses**.
- 🔮 **Previsão de ganhos futuros**.
- Comparação de faturamento medio dos motoristas da cidade
- comparação de quilometragem media dos motoristas da cidade
- ranking dos motoristas com melhores faturamento
- ranking dos motoristas com melhor ganho liquido
- ranking com motoristas com maiores quilometragens 

✅ **Filtros e Exportação:**

- Filtro de período.
- **Botão "Exportar Relatório"** (PDF, Excel).

💡 **Tecnologias:**

- **Recharts** → Gráficos interativos.
- **SheetJS** → Exportação de relatórios.

## 3.6 Notificações

📍 **Objetivo:** Mostrar alertas e mensagens importantes para o motorista.
O usuário pode definir notificações manuais. Exemplo: "Me lembre de abastecer quando o tanque estiver abaixo de 25%."
Sistema de Conquistas (Gamificação) Pequenos prêmios motivacionais: "Parabéns! Você bateu sua meta semanal 3 vezes seguidas!" "TOP 10 motoristas da sua cidade este mês!"

**Componentes:**

✅ **Notificações de Progresso de Metas:**

- 🔥 "Você está a 75% da sua meta semanal! Falta pouco!"
- ⚠️ "Abaixo de 50% da meta. Tente rodar mais algumas horas!"

✅ **Alertas de Manutenção do Veículo:**

- 🚗 "Você já rodou 5.000 km desde o último abastecimento. Hora de revisar o carro?"

✅ **Mensagens do Sistema:**

- "Nova atualização disponível!"

💡 **Tecnologias:**

- **Expo Notifications** → Envio de notificações push.

**📌 3.7 Resumo Final das Telas do App**

| **Tela** | **Objetivo** | **Principais Componentes** |
| --- | --- | --- |
| **1️⃣ Login/Cadastro** | Entrada no app | Formulários de login e autenticação social |
| **2️⃣ Tela Inicial** | Resumo financeiro | Cards de ganhos, atalhos e metas |
| **3️⃣ Jornadas** | Registro de trabalho | Iniciar/Finalizar jornada, histórico |
| **4️⃣ Abastecimentos** | Controle de combustível | Registro e histórico de consumo |
| **5️⃣ Despesas** | Gerenciamento financeiro | Cadastro e exportação de despesas |
| **6️⃣ Relatórios** | Estatísticas detalhadas | Gráficos e exportação de dados |
| **7️⃣ Notificações** | Engajamento | Alertas e notificações push |

## 3.8 Estrutura do Projeto para UX  

✅ O app será desenvolvido com **React Native (Expo)** para rodar em **Android e iOS**.  
✅ O backend será em **Node.js (Express) + PostgreSQL**.  
✅ Gerenciamento de estado usando **Zustand** ou **TanStack Query**.  
✅ Design com **shadcn/ui + Tailwind CSS** para manter um layout moderno.
✅ **Barra de Progresso para Metas:**
Suporte para internacionalização i18n
Implementação de background sync para salvar dados offline e sincronizar quando houver internet.

- **Exibição de progresso diário, semanal e mensal**.
- **Usar shadcn/ui Progress ou Radix UI Progress**.
- Animação suave ao atualizar o progresso.

✅ **Feedback Visual ao Cadastrar Jornadas e Abastecimentos:**

- **Confirmação animada** ao registrar um abastecimento ou jornada.
- **Loading effects** ao salvar dados.

✅ **Mudanças Dinâmicas no Ranking do Desafio:**

- **Animação ao subir ou descer no ranking** (Framer Motion).
- Destaque no **TOP 3 motoristas** com efeito especial.

### 3.9 Compatibilidade com Android e iOS

💡 **Sim, o app será compatível com ambos desde o início!**

✅ **React Native com Expo** já permite rodar no Android e iOS sem modificações complexas.  
✅ **Shadcn/ui + Tailwind CSS** garante responsividade e adaptação a diferentes telas.  
✅ **Expo Notifications** para envio de **notificações push**.


# 4.0 Estrutura do Banco de Dados

O **banco de dados será PostgreSQL**, armazenado na **nuvem (Google Cloud, AWS ou Azure)**.

## Regras Gerais do Banco de Dados  

1. **E-mail será a chave principal de login**.
2. **Cada usuário pode cadastrar múltiplos veículos**, mas apenas **um pode estar ativo por vez**.
3. **Despesas, abastecimentos e jornadas devem estar vinculados a um veículo**.
4. **Se um veículo for desativado**, todas as despesas pendentes precisarão ser **finalizadas ou removidas manualmente pelo usuário**.
5. **Despesas recorrentes** podem ser pagas manualmente ou **recalculadas** se forem quitadas antecipadamente.
6. O **histórico de todas as transações e modificações será mantido**, permitindo auditoria de dados.

## 4.1 Estrutura das Tabelas  

Definir índices nas colunas mais consultadas
Incluir Soft Delete (deleted_at TIMESTAMP NULL) para evitar perda acidental de dados em tabelas críticas
Utilizar enum para valores fixos como tipo_combustivel, tipo_despesa, tipo_uso para evitar registros inconsistentes.
Adicionar um campo telefone VARCHAR(20) para eventual autenticação via SMS.
Adicionar status_conta ENUM(‘ativo’, ‘inativo’, ‘banido’) para controle de usuários.
Criar índice no campo email para melhorar consultas de login


### 4.1.1. Tabela: usuarios (Cadastro de Usuários)

Guarda informações dos motoristas cadastrados no sistema.
Adicione um campo de autenticação por telefone (telefone VARCHAR(20)) ☎️
Registrar o último login do usuário (ultimo_login TIMESTAMP) 
Criptografia de e-mail e telefone - O PostgreSQL permite usar pgcrypto para encriptar e-mails e dados sensíveis.

Para permitir login via SMS futuramente.

| **Campo** | **Tipo de Dado** | **Regras de Validação** | **Descrição** |
| id_usuario | UUID | Chave Primária (PK) | Identificador único do usuário. |
| nome | VARCHAR(100) | Mínimo 3 caracteres, apenas letras. | Nome completo do usuário. |
| email | VARCHAR(150) | **Único no sistema**, formato <email@dominio.com>. | E-mail usado como chave principal do login. |
| senha | TEXT (HASHED) | Armazenada de forma segura (bcrypt). | Senha criptografada do usuário. |
| cidade | VARCHAR(100) | Apenas letras. | Cidade onde o motorista opera. |
| data_criacao | TIMESTAMP | Formato: YYYY-MM-DD HH:MM:SS. | Data e hora do cadastro do usuário. |

### 4.1.2. Tabela: veiculos (Cadastro de veículos)  

Cada veículo pertence a um **usuário único**, e apenas um pode estar **ativo**.  

Adicionar campo ativo BOOLEAN DEFAULT true para indicar o veículo atual.
Adicionar data_desativacao TIMESTAMP NULL para registro do histórico de veículos antigos.
Criar um índice em id_usuario para melhorar a performance de busca dos veículos por usuário.
Adicione deleted_at TIMESTAMP NULL para Soft Delete: Permite ao usuário restaurar veículos excluídos.
Criar um campo media_consumo NUMERIC(5,2): Guarda a média de KM/L baseada nos abastecimentos do veículo.


| **Campo** | **Tipo de Dado** | **Regras de Validação** | **Descrição** |
| id_veiculo | UUID | \-  | Identificador único do veículo. |
| id_usuario | UUID | Relacionamento com usuarios. Cada usuário pode ter vários veículos, mas apenas **um pode estar ativo**. |     |
| fabricante | VARCHAR(50) | Apenas letras | Marca do veículo (Ex: Toyota, Ford). |
| modelo | VARCHAR(50) | Apenas letras/números | Modelo do veículo (Ex: Corolla, HB20). |
| placa | VARCHAR(7) | **Única** no sistema | Formato AAA-9999 ou AAA9A99. Se reativar a mesma placa, atualizar dados do veículo. |
| ano | INTEGER | 1950 até ano atual | Ano de fabricação. |
| tipo_uso | VARCHAR(15) | ('Próprio', 'Alugado', 'Financiado') | Indica a posse do veículo. |
| valor_aluguel | NUMERIC(10,2) | R$ 9.999,99 | Se alugado, valor mensal. |
| valor_prestacao | NUMERIC(10,2) | R$ 9.999,99 | Se financiado, valor da parcela. |
| data_cadastro | TIMESTAMP | YYYY-MM-DD HH:MM:SS |     |

### 4.1.3. Tabela: jornadas

Adicionar campo status ENUM(‘em andamento’, ‘finalizada’, ‘cancelada’) para maior controle das jornadas.
Criar índice em data_inicio para otimizar consultas por período.
Adicionar um campo observacoes TEXT NULL para anotações do motorista sobre a jornada.
Melhoria no cálculo de faturamento líquido: Adicionar um campo calculado faturamento_liquido NUMERIC(10,2), que já subtrai custos como aluguel e combustível.

| **Campo** | **Tipo de Dado** | **Regras de Validação** | **Descrição** |
| id_jornada | UUID | Chave Primária (PK) | Identificador único da jornada. |
| id_usuario | UUID | Chave Estrangeira (FK) → usuarios(id_usuario). | Relacionamento com a tabela de usuários. |
| id_veiculo | UUID | Chave Estrangeira (FK) → veiculos(id_veiculo). | Apenas veículos **ativos** podem ser usados. |
| data_inicio | TIMESTAMP | Definido automaticamente ao iniciar a jornada. | Data e hora do início da jornada. |
| km_inicio | INTEGER | Apenas números positivos (000000 a 999999). | Quilometragem registrada no início da jornada. |
| data_fim | TIMESTAMP | Definido automaticamente ao finalizar a jornada. | Data e hora do fim da jornada. |
| km_fim | INTEGER | Deve ser maior ou igual ao km_inicio. | Quilometragem final ao término da jornada. |
| corridas | INTEGER | Apenas números inteiros positivos. | Número de corridas realizadas na jornada. |
| faturamento | NUMERIC(10,2) | **Máscara:** R$ 9.999,99. | Total faturado na jornada. |
| km_total | INTEGER | **Cálculo automático:** km_fim - km_inicio. | Quilometragem percorrida na jornada. |
| tempo_total | INTERVAL | Formato HH:MM:SS. | Tempo total da jornada (calculado com data_fim - data_inicio). |

🔹 **Notificação automática** após **8h, 10h, 12h e 18h**, caso a jornada não tenha sido finalizada.  
🔹 **O usuário pode editar ou excluir qualquer jornada individualmente**.  
🔹 **Filtro por data** disponível (padrão: mês atual).

### 4.1.4. Tabela: abastecimentos

Registra todos os **abastecimentos feitos**.

Criar índice em data_abastecimento para otimizar consultas por período
Histórico de preço do combustível: Adicionar uma tabela separada historico_preco_combustivel com:
id_preco (UUID), data TIMESTAMP, tipo_combustivel VARCHAR(20), preco NUMERIC(5,2).
Isso permite gráficos de variação de preços ao longo do tempo.

| **Campo** | **Tipo de Dado** | **Regras de Validação** | **Descrição** |
| id_abastecimento | UUID | Identificador único. |     |
| id_usuario | UUID | Relacionamento com usuarios. |     |
| id_veiculo | UUID | Relacionamento com veiculos. |     |
| data_abastecimento | TIMESTAMP | Data e hora do abastecimento. |     |
| odometro | INTEGER | Entre 000000 e 999999. |     |
| tipo_combustivel | VARCHAR(20) | ('Gasolina', 'Álcool', 'Diesel', 'GNV'). |     |
| litros | NUMERIC(5,2) | **Formato:** 99,99 litros. |     |
| preco_por_litro | NUMERIC(5,2) | **Máscara:** R$ 9,99. |     |
| total_pago | NUMERIC(10,2) | **Máscara:** R$ 9.999,99. |     |

**O usuário pode editar e excluir abastecimentos individualmente**.  
**O sistema calculará automaticamente o consumo médio do veículo**.

### 4.1.5. Tabela: despesas  

Adicionar um campo descricao TEXT NULL para detalhes adicionais da despesa.
Criar índice em data_despesa para otimizar filtros por período.
Adicionar deleted_at TIMESTAMP NULL para Soft Delete.
Adicionar notificar_vencimento BOOLEAN DEFAULT true: Ativa lembretes automáticos para contas a pagar.
Criar uma categoria_despesa ENUM('Fixas', 'Variáveis', 'Extras') Facilita o agrupamento de despesas no relatório financeiro.

| **Campo** | **Tipo de Dado** | **Regras de Validação** | **Descrição** |
| id_despesa | UUID | Identificador único. |     |
| id_usuario | UUID | Relacionamento com usuarios. |     |
| id_veiculo | UUID | Relacionamento com veiculos. |     |
| tipo_despesa | VARCHAR(50) | ('Manutenção', 'IPVA', 'Seguro', 'Aluguel'). |     |
| valor | NUMERIC(10,2) | **Máscara:** R$ 9.999,99. |     |
| parcelado | BOOLEAN | true ou false. |     |
| parcelas | INTEGER | Se parcelado, de 1 a 99. |     |
| data_despesa | TIMESTAMP | Data da despesa. |     |

**Histórico de despesas acessível e editável**.  
**O usuário pode antecipar parcelas, ajustando manualmente os valores**.  
**Exportação de dados em PDF, Excel e CSV**.

### 4.1.6. Tabela: Tabela de Metas  

Criar índice em id_usuario para acelerar consultas por motorista.
Adicionar um campo meta_alcancada BOOLEAN DEFAULT false para marcar metas cumpridas.

| **Campo** | **Tipo de Dado** | **Descrição** |
| id_meta | UUID | Identificador único da meta. |
| id_usuario | UUID | Relacionamento com a tabela usuarios. |
| tipo_meta | VARCHAR(10) | Valores possíveis: 'diaria', 'semanal', 'mensal'. |
| valor_meta | NUMERIC(10,2) | Valor definido pelo motorista. |
| data_criacao | TIMESTAMP | Data e hora da criação da meta. |

## 5.0 Requisitos Técnicos

### 5.1 Tecnologias Utilizadas e Arquitetura do Sistema  

O aplicativo será desenvolvido como uma **aplicação full-stack**, com tecnologias modernas para garantir **performance, escalabilidade e segurança**.  

Adicionar Redis para cache de sessões, tokens e requisições frequentes (melhoria na escalabilidade).
Especificar a versão mínima do Node.js e PostgreSQL para garantir compatibilidade no futuro.
Incluir Sentry ou LogRocket para monitoramento de erros no frontend e backend.


Tecnologias Utilizadas  

| **Camada** | **Tecnologia** | **Motivo da Escolha** |
| **Frontend** | React Native (com TypeScript) | Desempenho nativo para Android e iOS. |
| **UI/UX** | Tailwind CSS + Radix UI + shadcn/ui | Estilização eficiente e moderna. |
| **Gerenciamento de Estado** | TanStack Query (React Query) | Melhora a performance ao evitar re-renderizações desnecessárias. |
| **Navegação** | Wouter | Alternativa leve ao React Router. |
| **Validações** | React Hook Form + Zod | Validações robustas e intuitivas nos formulários. |
| **Gráficos** | Recharts | Exibição eficiente de métricas e relatórios. |
| **Ícones** | Lucide React | Ícones modernos e minimalistas. |
| **Backend** | Node.js + Express.js | Escalável, performático e compatível com APIs REST. |
| **Autenticação** | Passport.js | Login seguro via e-mail e redes sociais. |
| **Banco de Dados** | PostgreSQL | Alta confiabilidade e suporte a consultas complexas. |
| **ORM** | Drizzle ORM | Consultas SQL eficientes e tipadas. |
| **Segurança** | JWT (JSON Web Token) | Autenticação segura. |
| **Criptografia** | bcrypt.js + TLS | Segurança para senhas e transmissão de dados. |
| **Infraestrutura** | Google Cloud / AWS / Azure | Hospedagem escalável e confiável. |

### 5.2 Arquitetura do Sistema 
O aplicativo seguirá uma arquitetura **modular** para facilitar **escalabilidade e manutenção**.  

Adicionar camada de middlewares no backend para padronizar logs, tratamento de erros e autenticação.
Especificar se a API REST terá suporte para WebSockets (para atualizações em tempo real).
Definir taxa limite de requisições (Rate Limiting) para prevenir ataques DDoS.
Cache com Redis para sessões e dados estáticos
Evita consultas repetitivas ao banco.
Pode armazenar dados de ranking de motoristas, últimos abastecimentos.
Monitoramento de Erros com Sentry ou LogRocket

Captura erros de frontend e backend em tempo real.
Permite reproduzir bugs diretamente do painel.
Backup Diário e Replicação do PostgreSQL
Evita perda de dados em caso de falha no servidor.
Configurar failover automático para outra instância.


| **Camada** | **Descrição** |
| **📱 Frontend (React Native)** | Responsável pela interface do usuário e interações com a API. Inclui estilização, gerenciamento de estado e navegação. |
| **🔗 API REST** | Ponto de comunicação entre o **frontend** e o **backend**, garantindo transferência segura de dados. |
| **🌐 Backend (Node.js + Express.js)** | Processa requisições, gerencia regras de negócio, autenticação e segurança. Conecta-se ao banco de dados. |
| **🗄️ Banco de Dados (PostgreSQL + Drizzle ORM)** | Armazena todas as informações (usuários, veículos, jornadas, despesas). Projetado para eficiência e escalabilidade. |
| **☁️ Infraestrutura (Google Cloud / AWS / Azure)** | Hospedagem escalável para garantir alta disponibilidade e segurança dos dados. |

### 5.3 Estrutura do Backend  

O **backend** será responsável por gerenciar **todas as regras de negócio, validações e segurança**, além de disponibilizar uma **API REST** para comunicação com o **frontend**.  

Incluir CORS configurado corretamente para evitar problemas de segurança.
Implementar Refresh Token na autenticação JWT para evitar logout automático após expiração do token.
Incluir Helmet.js e Rate Limiter no Express.js para proteção contra ataques comuns.

**Node.js + Express.js** → Servidor rápido e escalável.  
**Passport.js + JWT** → Autenticação segura e tokens de acesso.  
**Drizzle ORM + PostgreSQL** → Gerenciamento eficiente do banco de dados.  
**Hospedagem em Nuvem** (Google Cloud, AWS ou Azure).

### 5.4 Estrutura do Frontend

Especificar uso de Lazy Loading para otimizar carregamento de telas.
Definir política de armazenamento local (AsyncStorage, SecureStore, etc.) para manter segurança de tokens no app.

O **frontend (React Native)** será responsável pela interface do usuário e interações com a API.
**React Native com TypeScript** → Código mais seguro e estruturado.  
**Tailwind CSS + Radix UI** → Interface moderna e responsiva.  
**TanStack Query** → Otimiza chamadas à API e melhora o desempenho.  
**React Hook Form + Zod** → Validação e gerenciamento de formulários eficientes.
Modo Offline (PWA para Web e Cache para Mobile) 📶

Motorista pode registrar abastecimentos sem internet e sincronizar depois.
Animações de Transição com Framer Motion ✨

Para suavizar carregamentos e melhorar a percepção de velocidade.
Painel de Estatísticas Interativo 📊

Gráficos dinâmicos de ganhos, gastos e consumo de combustível

### 5.5 Estrutura do Banco de Dados  

O **banco de dados será PostgreSQL**, hospedado na nuvem, com tabelas bem estruturadas para **garantir velocidade e consistência dos dados**.

Incluir suporte a JSONB no PostgreSQL para campos flexíveis (ex: logs de atividades).
Definir backups automáticos diários/semanalmente e política de retenção.
Adicionar tabelas auxiliares para logs e auditoria (quem alterou determinado dado e quando).

**Tabelas bem definidas** para usuários, veículos, jornadas, abastecimentos e despesas.  
**Índices e otimizações** para evitar lentidão.  
**Relacionamentos entre tabelas** bem estruturados.  
**Backups automáticos e segurança reforçada**.

### 6.0 Requisitos de Performance e Qualidade  

#### 6.1 Tempo de Resposta  

**Tempo máximo de resposta da API:** **≤ 500ms** para requisições simples e **≤ 1s** para cálculos complexos.  
**Banco de Dados otimizado** com índices e cache para reduzir tempo de leitura.  
**Uso de TanStack Query (React Query)** para otimizar requisições e evitar chamadas desnecessárias.
Habilitar compressão GZIP no Express.js para reduzir tempo de resposta.
Definir um cache de API em endpoints que não mudam frequentemente (ex: tabelas de preços, regras de negócio).

#### 6.2 Responsividade  

**100% responsivo** para telas **Android, iOS e Web**.  
**UI adaptável** com **Tailwind CSS** e componentes do **Radix UI + shadcn/ui**.  
**Suporte a Dark Mode** para melhor experiência visual.
Testes de acessibilidade (WCAG) no frontend para garantir suporte a usuários com deficiência.

#### 6.3 Usabilidade  

**Interface intuitiva**, organizada em abas para facilitar a navegação.  
**Cadastro simplificado** (e-mail como login principal, CPF opcional).  
**Confirmações para ações irreversíveis** (exclusão de registros, redefinição de senha).  
**Mensagens de erro e sucesso claras e diretas**.  
**Autopreenchimento inteligente** nos formulários.
Suporte a diferentes idiomas (internacionalização - i18n).
Tutoriais interativos na primeira vez que o usuário acessa cada funcionalidade.

#### 6.4 Disponibilidade  

**99,9% de uptime garantido**, hospedado em **Google Cloud, AWS ou Azure**.  
**Banco de Dados replicado** para evitar falhas.  
**Monitoramento automático** e alertas em caso de falhas.
Definir failover automático para outro servidor em caso de falha.
Adicionar logs centralizados (ex: Loggly, Datadog, ELK Stack) para monitoramento avançado.

#### 6.5 Escalabilidade  

**Backend desacoplado**, permitindo crescimento sem comprometer performance.  
**Cache de dados** para reduzir carga no banco de dados.  
**Uso de CDN** para servir imagens e arquivos estáticos rapidamente.
Definir horizontal scaling no backend (load balancer para múltiplas instâncias).
Incluir suporte para GraphQL ou gRPC caso a API precise ser mais performática em buscas complexas.
Habilitar JSONB para armazenar logs e preferências do usuário 📦

Permite salvar configurações personalizadas sem criar várias colunas.
Exemplo: { "dark_mode": true, "notificacoes": false }.
Criar uma tabela de logs de atividades (logs_atividades) 📑

Ajuda na auditoria de ações do motorista.
Campos: id_log, id_usuario, acao, data_hora.
Indexação em colunas de busca frequente ⚡

Criar índices em:
email (usuarios), data_abastecimento (abastecimentos), data_despesa (despesas).
Melhora velocidade de consultas em grande escala.

### 7.0 Requisitos de Segurança  

#### 7.1 Proteção de Dados

**Senhas armazenadas com hash bcrypt** (NÃO reversível).  
**Token JWT seguro para autenticação** (expira após X tempo).  
**Criptografia TLS em todas as comunicações**.  
**Dados sensíveis armazenados com criptografia AES-256**.
Adicionar Refresh Token para renovação segura de sessões (evita login frequente).
Implementar CORS corretamente para prevenir requisições maliciosas.
Configurar Rate Limiting no backend para prevenir ataques de força bruta.
Monitoramento de atividades suspeitas (ex: múltiplos logins falhos de diferentes IPs).
Adotar MFA (Multi-Factor Authentication) Opcional 🔑

Além do 2FA via SMS ou e-mail, permitir autenticação via Google Authenticator ou Authy.
Token JWT com Refresh Seguro 🔄

Implementar Rotação de Refresh Tokens para evitar vazamentos.
Adicionar Monitoramento de Sessões 🕵️‍♂️

Criar uma tela onde o motorista vê dispositivos conectados e pode deslogar remotamente.
Assinaturas Digitais para Registros Sensíveis ✍️

Todas as operações críticas (exemplo: alteração de e-mail, remoção de conta, troca de veículo) podem exigir um código de confirmação enviado via e-mail/SMS.

#### 7.2 Regras de Segurança

**Autenticação de dois fatores (2FA) opcional**.  
**Tentativas de login limitadas** (bloqueio temporário após 5 tentativas falhas).  
**Permissões e papéis de usuário** para restringir acessos indevidos.  
**Logs de atividades** para rastrear ações suspeitas.  
**Proteção contra SQL Injection e XSS**.
Adicionar "Lembrar este dispositivo" no 2FA para melhorar experiência do usuário.
Notificar usuários por e-mail/SMS em caso de login em um novo dispositivo.
Proteção contra ataques CSRF para evitar ações maliciosas em sessões ativas.
Implementar Refresh Token JWT: O usuário não precisa logar toda vez que o token expira.
Evita requisições desnecessárias de login.
Adotar OAuth para login social: Permitir login com Google, Facebook, Apple ID via Passport.js.
Habilitar Rate Limiting e Proteção contra DDoS 🛡
Utilizar express-rate-limit para limitar tentativas de login.: Helmet.js para bloquear headers vulneráveis
Adotar ReCaptcha v3 no Login e Cadastro 🛡

Evita bots e ataques de força bruta sem incomodar o usuário.
Detectar Logins Suspeitos 🌎

Notificar o usuário caso um login seja feito de outro país ou IP suspeito.
Logs de Atividades com Geolocalização 📍

Adicionar ip_usuario e localizacao_aproximada para rastrear de onde partem logins e ações importantes.
Criptografia para Dados Sensíveis 🔒

Guardar números de telefone, e-mails e placas de veículos com pgcrypto no PostgreSQL.

# 8.0 Plano de Monetização - Aplicativo para Motoristas  

## 8.1 Modelo de Negócio  

O aplicativo seguirá um **modelo freemium**, onde os motoristas podem usar as funções básicas **gratuitamente**, mas precisarão **pagar para acessar recursos avançados**.

Tipos de Monetização  
✅ **Plano Gratuito** (acesso básico, com limitações).  
✅ **Plano Premium Mensal** (R$ XX,90/mês - desbloqueia funcionalidades avançadas).  
✅ **Plano Premium Anual** (R$ XXX,90/ano - desconto em relação ao mensal).  
✅ **Plano Premium semestral** (R$ XXX,90/ano - desconto em relação ao anual).  
✅ **Pagamento Único para Recursos Específicos** (exemplo: relatório detalhado).

### 8.2 Plano Básico - Free

Liberar Recursos Premium Temporariamente ⏳

Exemplo: "Hoje você pode testar um relatório premium de graça!".
Isso pode aumentar o desejo de assinar.

Os motoristas poderão usar **as funções essenciais**, mas com **restrições**:

✅ **Cadastro e Login** (incluindo redes sociais).  
✅ **Registro de Jornadas** (iniciar/finalizar jornada, quilometragem, faturamento).  
✅ **Registro de Abastecimentos** (data, litros, preço, posto).  
✅ **Cadastro de Veículos** (apenas **1 veículo ativo** por conta).  
✅ **Relatórios básicos** (ganho do dia e semana, lucro líquido básico).  
✅ **Exportação limitada** (PDF apenas para os últimos 7 dias).

🔹 **Restrições no Plano Gratuito:**  
🚫 **Sem acesso a relatórios avançados.**  
🚫 **Histórico de abastecimentos limitado a 30 dias.**  
🚫 **Sem ranking de faturamento da cidade.**  
🚫 **Não pode cadastrar múltiplos veículos.**

Adicionar um botão "Ver Benefícios do Premium" nas telas bloqueadas para aumentar conversões.
Mostrar um contador de "dias restantes" de histórico → Isso incentiva o motorista a assinar para manter acesso.
Alertas personalizados: "Seu relatório avançado está bloqueado. Assine o Premium para ver detalhes completos!".
Assinatura com Cashback 💸

Motoristas podem receber cashback de 10% se renovarem a assinatura antes do vencimento.

### 8.3 Plano Premium – Pago  

ecompensas para Usuários Fieis 🎖

Quem mantiver a assinatura por 6 meses consecutivos ganha um mês grátis.
Notificações Personalizadas para Assinantes Premium 🔔

Exemplo: "Você é Premium! Aqui estão os melhores horários para rodar hoje em sua cidade."
Criar um Nível VIP 🏆

Motoristas Premium ganham um selo especial no ranking e em seus relatórios.
Isso cria um efeito de exclusividade.
Os motoristas que assinarem o plano terão **acesso ilimitado a todas as funções**, incluindo:

✅ **Histórico ilimitado de abastecimentos e despesas.**  
✅ **Cadastro de múltiplos veículos (troca livre entre veículos).**  
✅ **Relatórios avançados**:

- Comparação de faturamento **entre Uber, 99 e InDrive**.
- Ranking do motorista **na cidade** (posição baseada nos ganhos).
- **Média de faturamento diário, semanal e mensal dos motoristas na cidade**.
- **Previsão de faturamento para a próxima semana/mês.**  
    ✅ **Exportação de relatórios completa** (PDF, Excel, CSV de qualquer período).  
    ✅ **Gráficos detalhados de desempenho semanal e mensal.**  
    ✅ **Suporte prioritário** via chat.

🔹 **Extras para monetização:**  
🚀 **Pagamento avulso:** Motoristas podem pagar um valor único para **acessar um relatório específico sem precisar assinar o plano** (Exemplo: pagar R$ 9,90 para ver o ranking da cidade).

## 9.0 Estratégia para Incentivar a Assinatura

✅ **Teste grátis** por 7 dias para novos usuários.  
✅ **Mensagens dentro do app sugerindo o plano premium** ao tentar acessar funcionalidades bloqueadas.  
✅ **Descontos para assinaturas anuais.**  
✅ **Ofertas especiais em épocas sazonais (ex: Black Friday, fim de ano).**
Enviar e-mails e notificações push antes do teste grátis expirar para lembrar os usuários de assinar.
Oferecer descontos progressivos para quem assina imediatamente após o teste grátis (exemplo: 10% de desconto se assinar nas primeiras 24h após teste).
Mostrar "quantos motoristas já assinaram" → Isso cria prova social e aumenta conversões.
Criar um "Nível VIP" para motoristas Premium → Isso pode incluir vantagens exclusivas, como ícones diferenciados no ranking.
Teste Grátis de 7 Dias com Cartão Salvo 💳

O usuário pode testar sem compromisso, e se não cancelar, a cobrança automática começa.
Plano Semestral com Desconto Progressivo 📉

Exemplo:
Mensal: R$ 19,90
Trimestral: R$ 17,90/mês
Semestral: R$ 14,90/mês
Gamificação no Ranking 🏅

Motoristas Premium têm um ranking separado só para assinantes.
Isso incentiva competitividade entre os que pagam.
