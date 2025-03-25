## Aplicativo para Motoristas de Aplicativos - Versão 1.0

---

### 1. Visão Geral do Projeto

#### 1.1 Objetivo do Aplicativo

Este aplicativo tem como principal finalidade ajudar motoristas de aplicativos (como Uber, 99, InDrive e outros) a gerenciar suas jornadas de trabalho, acompanhar ganhos e controlar despesas relacionadas à sua atividade profissional.

Com ele, o motorista poderá:

* ✅ Registrar suas corridas e acompanhar os valores recebidos;
* ✅ Controlar seus abastecimentos e calcular o custo por quilômetro rodado;
* ✅ Monitorar despesas com manutenção, pedágios e taxas da plataforma;
* ✅ Gerar relatórios financeiros detalhados para entender melhor seus lucros e otimizar ganhos.

O aplicativo será uma ferramenta essencial para quem deseja ter um controle financeiro eficiente, ajudando os motoristas a tomar decisões mais estratégicas sobre seus rendimentos e custos.

#### 1.2 Funcionalidades Principais

O aplicativo oferecerá um conjunto de funcionalidades que permitirão ao motorista gerenciar sua rotina de trabalho de forma eficiente e prática.

**🚖 Gestão da Jornada e Faturamento**

* Registro detalhado de cada jornada de trabalho.
* Cálculo automático do faturamento diário, semanal e mensal.
* Monitoramento do tempo rodado e horas trabalhadas.

**⛽ Controle de Abastecimentos e Consumo de Combustível**

* Registro de cada abastecimento, incluindo data, valor e quantidade de litros.
* Cálculo do consumo médio do veículo (km por litro).
* Comparação do gasto com combustível em diferentes períodos.

**💰 Gestão de Despesas e Provisões**

* Cadastro de despesas fixas e variáveis (manutenção, pedágios, taxas de plataforma, etc.).
* Definição de provisões para manutenção futura ou impostos.
* Classificação automática das despesas para facilitar o acompanhamento.

**📊 Relatórios Detalhados e Análises Financeiras**

* Relatórios gráficos sobre ganhos, despesas e lucro líquido.
* Previsão financeira com base nos dados registrados.
* Ranking de melhores dias e horários para rodar.
* Comparação entre diferentes aplicativos de transporte para entender qual é mais lucrativo.

**🎯 Definição de Metas e Acompanhamento de Performance**

* Criação de metas diárias, semanais e mensais.
* Alertas sobre desempenho em relação às metas definidas.
* Sugestões baseadas nos ganhos médios para alcançar os objetivos financeiros.

**🚀 Comparação de Ganhos e Estatísticas Regionais**

* Comparação automática entre os valores recebidos nos diferentes aplicativos (Uber, 99, InDrive, etc.).
* Média de faturamento por cidade e por dia da semana.
* Identificação dos melhores horários e regiões para trabalhar.

**📎 Exportação de Relatórios e Compartilhamento de Dados**

* Exportação de dados em formatos PDF, Excel (XLSX) e CSV.
* Possibilidade de compartilhar relatórios financeiros via e-mail ou WhatsApp.

**🔐 Autenticação e Segurança**

* Login via e-mail e senha.
* Opção de login rápido com Google, Facebook e Apple ID.
* Proteção dos dados do usuário com criptografia segura.

**📱 Disponibilidade e Plataforma**

* Aplicativo desenvolvido para Android e iOS.
* Versão Web PWA (Progressive Web App) para acesso pelo navegador sem necessidade de instalação.

## 1.3 Público-Alvo

O aplicativo é voltado para motoristas de aplicativos que desejam um maior controle sobre seus ganhos e despesas. Ele é ideal para:

 ✔ Motoristas de Uber, 99, InDrive e outras plataformas que querem entender seus ganhos reais e reduzir gastos desnecessários.
 ✔ Motoristas que precisam calcular seus lucros líquidos e planejar despesas futuras para evitar surpresas financeiras.
 ✔ Motoristas que querem identificar os melhores dias e horários para trabalhar e maximizar seus rendimentos.
 ✔ Profissionais que utilizam mais de um aplicativo e desejam comparar qual plataforma está sendo mais rentável. 

---


## 2.0 Arquitetura do Sistema

**📌 Pontos importantes:**

* Middlewares no backend para padronizar logs, tratamento de erros e autenticação.
* WebSockets na API REST para atualizações em tempo real (se necessário).
* Rate Limiting para evitar ataques DDoS.
* Cache com Redis para sessões e dados estáticos (ranking de motoristas, últimos abastecimentos).
* Monitoramento de Erros com Sentry ou LogRocket.
* Backup Diário e Replicação do PostgreSQL para evitar perda de dados.

**📌 Arquitetura do Sistema**

| Camada | Descrição |
|---|---|
| 📱 Frontend (React Native) | Interface do usuário, estilização, gerenciamento de estado e navegação. |
| 🔗 API REST | Comunicação entre frontend e backend, garantindo transferência segura de dados. |
| 🌐 Backend (Node.js + Express.js) | Processamento de requisições, regras de negócio, autenticação e segurança. |
| 🗄️ Banco de Dados (PostgreSQL + Drizzle ORM) | Armazena todas as informações (usuários, veículos, jornadas, despesas). |
| ☁️ Infraestrutura (Google Cloud / AWS / Azure) | Hospedagem escalável para garantir alta disponibilidade e segurança dos dados. |


## 2.1 Estrutura do Backend

**📌 Pontos importantes:**

* CORS configurado corretamente para evitar problemas de segurança.
* Refresh Token na autenticação JWT para evitar logout automático após expiração do token.
* Helmet.js e Rate Limiter para proteção contra ataques comuns.

**📌 Tecnologias do Backend**

* Node.js + Express.js → Servidor rápido e escalável.
* Passport.js + JWT → Autenticação segura e tokens de acesso.
* Drizzle ORM + PostgreSQL → Gerenciamento eficiente do banco de dados.
* Hospedagem em Nuvem (Google Cloud, AWS ou Azure).


## 2.2 Estrutura do Frontend

**📌 Pontos importantes:**

* Lazy Loading para otimizar carregamento de telas.
* Armazenamento local seguro (AsyncStorage, SecureStore).
* Modo Offline para permitir registros sem internet e sincronização posterior.
* Animações com Framer Motion para transições suaves.

**📌 Tecnologias do Frontend**

* React Native com TypeScript → Código mais seguro e estruturado.
* Tailwind CSS + Radix UI → Interface moderna e responsiva.
* TanStack Query → Otimiza chamadas à API e melhora o desempenho.
* React Hook Form + Zod → Validação e gerenciamento de formulários eficientes.
* Modo Offline (PWA para Web e Cache para Mobile).
* Painel de Estatísticas Interativo com gráficos dinâmicos de ganhos, gastos e consumo de combustível. 

## 2.3 Estrutura do Banco de Dados

* O banco de dados será PostgreSQL, armazenado na nuvem (Google Cloud, AWS ou Azure).

**📌 2.3.1 Regras Gerais do Banco de Dados**

* E-mail será a chave principal de login (índice para otimizar consultas).
* Cada usuário pode cadastrar múltiplos veículos, mas apenas um pode estar ativo por vez.
* Despesas, abastecimentos e jornadas devem estar vinculados a um veículo.
* Se um veículo for desativado, todas as despesas pendentes precisarão ser finalizadas ou removidas manualmente pelo usuário.
* Despesas recorrentes podem ser pagas manualmente ou recalculadas se forem quitadas antecipadamente.
* Histórico de todas as transações e modificações será mantido para permitir auditoria de dados.
* Soft Delete (deleted_at TIMESTAMP NULL) será implementado em tabelas críticas para evitar perda de dados acidental.
* Enums serão usados para valores fixos como tipo_combustivel, tipo_despesa e tipo_uso, evitando registros inconsistentes.
* Criptografia (pgcrypto) será aplicada para proteger e-mails e telefones dos usuários. 

**📌 2.3.2 Estrutura das Tabelas**

**Cada tabela foi projetada para otimizar desempenho, segurança e consultas rápidas, principais otimizações aplicadas:**

* 🗑️ Soft Delete (deleted_at) → Evita exclusões definitivas, permitindo a recuperação de dados.
* ⚡ Índices nos campos mais pesquisados → Melhora o desempenho das consultas.
* 🔒 Constraints e validações → Mantêm a integridade dos dados, garantindo consistência.
* 📌 Enums → Padronizam valores fixos, evitando inconsistências.
*🔹 Otimizações Aplicadas:
*📌 Índice em data_despesa → Otimiza consultas por período.
*🔹 Uso da tabela despesas para registrar gastos relacionados a cada veículo, como manutenção, pneus, seguro, entre outros.


## 📌 2.3.3 Tabela: usuarios (Cadastro de Usuários)

🎯 Objetivo:

* Armazena os dados dos motoristas cadastrados na plataforma.
```
CREATE TABLE usuarios (
    id_usuario UUID PRIMARY KEY,               -- Identificador único do usuário.
    nome VARCHAR(100) NOT NULL,                -- Nome completo do usuário.
    email VARCHAR(150) UNIQUE NOT NULL,        -- E-mail usado como login principal.
    telefone VARCHAR(20) UNIQUE,               -- Número de telefone para autenticação via SMS.
    senha TEXT NOT NULL,                        -- Senha criptografada com bcrypt.
    cidade VARCHAR(100),                        -- Cidade onde o motorista opera.
    status_conta ENUM('ativo', 'inativo', 'banido') DEFAULT 'ativo', -- Status do usuário.
    ultimo_login TIMESTAMP,                     -- Registro do último login.
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data do cadastro.
    deleted_at TIMESTAMP NULL                   -- Soft Delete (marcação para exclusão).
);
```
**🔹 Otimizações Aplicadas:**

* 📌 Índice no campo email → Melhora a performance das consultas de login.
* 🔒 Criptografia aplicada para senha usando bcrypt.
* 🔐 Possibilidade de criptografia para email e telefone, garantindo maior segurança.

## 📌 2.3.4 Tabela: veiculos (Cadastro de Veículos)

🎯 Objetivo:

* Armazena os veículos cadastrados pelos motoristas.
```
CREATE TABLE veiculos (
    id_veiculo UUID PRIMARY KEY,                -- Identificador único do veículo.
    id_usuario UUID REFERENCES usuarios(id_usuario), -- Relacionado ao usuário dono do veículo.
    fabricante VARCHAR(50) NOT NULL,            -- Marca do veículo (Ex: Toyota, Ford).
    modelo VARCHAR(50) NOT NULL,                -- Modelo do veículo (Ex: Corolla, HB20).
    placa VARCHAR(7) UNIQUE NOT NULL,           -- Placa do veículo (Ex: ABC-1234).
    ano INTEGER CHECK (ano >= 1950 AND ano <= extract(year from now())), -- Ano de fabricação.
    tipo_uso ENUM('Próprio', 'Alugado', 'Financiado') NOT NULL, -- Tipo de posse do veículo.
    valor_aluguel NUMERIC(10,2),                -- Valor mensal se for alugado.
    valor_prestacao NUMERIC(10,2),              -- Valor da parcela se for financiado.
    ativo BOOLEAN DEFAULT true,                 -- Indica se é o veículo ativo do motorista.
    data_desativacao TIMESTAMP NULL,            -- Data de desativação do veículo.
    media_consumo NUMERIC(5,2),                 -- Média de KM/L baseada nos abastecimentos.
    deleted_at TIMESTAMP NULL                   -- Soft Delete para permitir recuperação.
);
```
**🔹 Otimizações Aplicadas:**

* 📌 Índice em id_usuario → Melhora a busca de veículos por usuário.
* 🗑️ Soft Delete (deleted_at) → Permite restauração de veículos excluídos.

## 📌 2.3.5 Tabela: jornadas (Registro de Trabalho)

🎯 Objetivo:

* Registrar cada jornada de trabalho do motorista.
```
CREATE TABLE jornadas (
    id_jornada UUID PRIMARY KEY,                 -- Identificador único da jornada.
    id_usuario UUID REFERENCES usuarios(id_usuario), -- Relacionado ao usuário.
    id_veiculo UUID REFERENCES veiculos(id_veiculo), -- Relacionado ao veículo utilizado.
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e hora de início da jornada.
    km_inicio INTEGER CHECK (km_inicio >= 0),   -- Quilometragem no início da jornada.
    data_fim TIMESTAMP NULL,                     -- Data e hora de fim da jornada.
    km_fim INTEGER CHECK (km_fim >= km_inicio),  -- Quilometragem final ao término da jornada.
    corridas INTEGER CHECK (corridas >= 0),      -- Número de corridas realizadas.
    faturamento NUMERIC(10,2),                   -- Total faturado na jornada.
    km_total INTEGER,                            -- Quilometragem percorrida (calculado automaticamente).
    tempo_total INTERVAL,                        -- Tempo total da jornada.
    status ENUM('em andamento', 'finalizada', 'cancelada') DEFAULT 'em andamento', -- Status da jornada.
    observacoes TEXT NULL,                       -- Anotações do motorista sobre a jornada.
    deleted_at TIMESTAMP NULL                    -- Soft Delete para remoção segura.
);
```
**🔹 Otimizações Aplicadas:**

* 📌 Índice em data_inicio → Otimiza consultas por período.
* 🔔 Notificação automática se a jornada não for finalizada após 8h, 10h, 12h e 18h.

## 📌 2.3.6 Tabela: abastecimentos

🎯 Objetivo:
* Registrar todos os abastecimentos feitos pelo motorista.
```
CREATE TABLE abastecimentos (
    id_abastecimento UUID PRIMARY KEY,          -- Identificador único do abastecimento.
    id_usuario UUID REFERENCES usuarios(id_usuario), -- Relacionado ao usuário.
    id_veiculo UUID REFERENCES veiculos(id_veiculo), -- Relacionado ao veículo abastecido.
    data_abastecimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e hora do abastecimento.
    odometro INTEGER CHECK (odometro >= 0),     -- Quilometragem no momento do abastecimento.
    tipo_combustivel ENUM('Gasolina', 'Álcool', 'Diesel', 'GNV') NOT NULL, -- Tipo de combustível.
    litros NUMERIC(5,2) CHECK (litros > 0),     -- Quantidade abastecida (Ex: 45,75 litros).
    preco_por_litro NUMERIC(5,2) CHECK (preco_por_litro > 0), -- Valor pago por litro.
    total_pago NUMERIC(10,2) CHECK (total_pago > 0), -- Valor total do abastecimento.
    deleted_at TIMESTAMP NULL                    -- Soft Delete para remoção segura.
);
```
**🔹 Otimizações Aplicadas:**

* 📌 Índice em data_abastecimento → Otimiza consultas por período.
* ⛽ Criação da tabela historico_preco_combustivel → Permite armazenar a variação dos preços ao longo do tempo.

## 📌 2.3.7 Tabela: despesas

🎯 Objetivo:
* Registrar todas as despesas do motorista.
```
CREATE TABLE despesas (
    id_despesa UUID PRIMARY KEY,                -- Identificador único da despesa.
    id_usuario UUID REFERENCES usuarios(id_usuario), -- Relacionado ao usuário.
    id_veiculo UUID REFERENCES veiculos(id_veiculo), -- Relacionado ao veículo.
    data_despesa TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data da despesa.
    descricao VARCHAR(255) NOT NULL,            -- Descrição da despesa.
    valor NUMERIC(10,2) CHECK (valor > 0),      -- Valor da despesa.
    tipo_despesa ENUM('Manutenção', 'Pneus', 'Seguro', 'Outros') NOT NULL, -- Tipo de despesa.
    deleted_at TIMESTAMP NULL                    -- Soft Delete para remoção segura.
);
```
## 📌 2.3.8 Tabela: metas

🎯 Objetivo: Armazenar as metas financeiras do motorista (diária, semanal e mensal), permitindo que o sistema exiba o progresso.

```
CREATE TABLE metas (
    id_meta UUID PRIMARY KEY,                -- Identificador único da meta.
    id_usuario UUID REFERENCES usuarios(id_usuario), -- Relacionado ao usuário.
    tipo_meta ENUM('diaria', 'semanal', 'mensal') NOT NULL, -- Tipo de meta.
    valor_meta NUMERIC(10,2) CHECK (valor_meta > 0), -- Valor da meta definida.
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de criação da meta.
    deleted_at TIMESTAMP NULL                    -- Soft Delete para remoção segura.
);
```

## 📌 2.3.9 Tabela: historico_preco_combustivel

🎯 Objetivo: Armazenar a variação do preço dos combustíveis ao longo do tempo, permitindo previsões mais precisas.
```
CREATE TABLE historico_preco_combustivel (
    id_registro UUID PRIMARY KEY,            -- Identificador único do registro.
    id_usuario UUID REFERENCES usuarios(id_usuario), -- Relacionado ao usuário (opcional).
    tipo_combustivel ENUM('Gasolina', 'Álcool', 'Diesel', 'GNV') NOT NULL, -- Tipo de combustível.
    preco_por_litro NUMERIC(5,2) CHECK (preco_por_litro > 0), -- Valor registrado.
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data do registro.
);
```

## 📌 2.3.10  Tabela: logs_atividades

🎯 Objetivo: Registrar ações importantes realizadas pelo motorista, garantindo auditoria e segurança.

```
CREATE TABLE logs_atividades (
    id_log UUID PRIMARY KEY,                 -- Identificador único do log.
    id_usuario UUID REFERENCES usuarios(id_usuario), -- Relacionado ao usuário.
    tipo_acao VARCHAR(50) NOT NULL,          -- Tipo de ação (ex: "iniciar jornada", "finalizar jornada").
    descricao TEXT,                          -- Descrição detalhada do evento.
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e hora do evento.
);
```

---

## 📌 3.0 Requisitos Técnicos
O aplicativo será desenvolvido como uma aplicação full-stack, utilizando tecnologias modernas para garantir performance, escalabilidade e segurança.

**📌 3.1 Tecnologias Utilizadas e Arquitetura do Sistema**

* 🔹 Adições importantes:
* 🛑 Redis → Utilizado para cache de sessões, tokens e requisições frequentes, melhorando a escalabilidade.
* 🔍 Sentry ou LogRocket → Para monitoramento de erros no frontend e backend.
* ⚙️ Especificação da versão mínima do Node.js e PostgreSQL → Garante compatibilidade futura.

**🔹 Tecnologias Utilizadas**

* Camada	Tecnologia	Motivo da Escolha
* 🖥 Frontend	React Native (com TypeScript)	Desempenho nativo para Android e iOS.
* 🎨 UI/UX	Tailwind CSS + Radix UI + shadcn/ui	Estilização eficiente e moderna.
* ⚡ Gerenciamento de Estado	TanStack Query (React Query)	Melhora a performance ao evitar re-renderizações desnecessárias.
* 🧭 Navegação	Wouter	Alternativa leve ao React Router.
* ✅ Validações	React Hook Form + Zod	Validações robustas e intuitivas nos formulários.
* 📊 Gráficos	Recharts	Exibição eficiente de métricas e relatórios.
* 🎭 Ícones	Lucide React	Ícones modernos e minimalistas.
* 🚀 Backend	Node.js + Express.js	Escalável, performático e compatível com APIs REST.
* 🔑 Autenticação	Passport.js	Login seguro via e-mail e redes sociais.
* 🗄 Banco de Dados	PostgreSQL	Alta confiabilidade e suporte a consultas complexas.
* 🛠 ORM	Drizzle ORM	Consultas SQL eficientes e tipadas.
* 🔒 Segurança	JWT (JSON Web Token)	Autenticação segura.
* 🔐 Criptografia	bcrypt.js + TLS	Segurança para senhas e transmissão de dados.
* ☁️ Infraestrutura	Google Cloud / AWS / Azure	Hospedagem escalável e confiável.

---

## 📌 4.0 Requisitos de Performance e Qualidade

**📌 4.1 Tempo de Resposta**

* 🎯 Meta de performance:
* ≤ 500ms para requisições simples.
* ≤ 1s para cálculos complexos.

* 🔹 Otimizações Aplicadas:
* 📌 Índices e cache no PostgreSQL → Melhora a leitura dos dados.
* ⚡ TanStack Query (React Query) → Evita chamadas desnecessárias ao backend.
* 📦 Compressão GZIP no Express.js → Reduz tempo de resposta.
* 🗂️ Cache em endpoints estáticos → Tabelas de preços, regras de negócio, etc.

**📌 4.2 Responsividade**

* ✅ Totalmente responsivo para Android, iOS e Web.

* 🔹 Tecnologias para responsividade:
* 🎨 Tailwind CSS + Radix UI + shadcn/ui → Facilita a adaptação da interface.
* 🌙 Suporte a Dark Mode → Baseado nas preferências do sistema do usuário.

**📌 4.3 Usabilidade**

* 🔹 Regras para melhor experiência do usuário:

* 📌 Interface intuitiva e organizada em abas para facilitar a navegação.
* 🔄 Confirmações para ações irreversíveis, evitando erros acidentais.
* ⚠️ Mensagens de erro claras e diretas, sem termos técnicos complicados.
* ✍️ Autopreenchimento inteligente nos formulários para agilizar o uso.
* 🌍 Suporte a diferentes idiomas (i18n) para expandir a acessibilidade global.
* 📚 Tutoriais interativos para novos usuários na primeira vez que acessam cada funcionalidade.

**📌 4.4 Disponibilidade**

* ✅ Uptime garantido: 99,9% com hospedagem em Google Cloud, AWS ou Azure.

🔹 Medidas de Alta Disponibilidade:
* 🗄️ Banco de dados replicado para evitar falhas e perda de dados.
* 📡 Monitoramento automático com alertas de falha.
* 🔄 Failover automático → Em caso de falha, o sistema migra para outro servidor sem interrupção.
* 📜 Logs centralizados utilizando Loggly, Datadog ou ELK Stack.

**📌 4.5 Escalabilidade**

🔹 Técnicas para garantir crescimento contínuo:

* 🏗️ Backend desacoplado → Permite crescimento sem comprometer a performance.
* ⚡ Cache de dados (Redis) → Reduz carga no banco de dados.
* 🌍 Uso de CDN → Acelera o carregamento de imagens e arquivos estáticos.
* ⚖️ Load Balancer → Distribui tráfego de forma eficiente.
* 🗂️ Uso de JSONB no PostgreSQL → Para armazenar logs e preferências personalizadas.
* 🔍 Tabela logs_atividades → Registra ações dos usuários para auditoria e segurança.

---

## 📌 5.0 Requisitos de Segurança

**📌 5.1 Proteção de Dados**

🔒 Criptografia e segurança aplicadas:

* 🔑 Senhas armazenadas com hash bcrypt (NÃO reversível).
* 🔐 Token JWT seguro para autenticação.
* 🔗 Criptografia TLS em todas as comunicações.
* 🛡️ Criptografia AES-256 para dados sensíveis.
* 🔄 Refresh Token para renovação segura de sessões.
* 🌍 CORS configurado corretamente para evitar acessos não autorizados.
* ⚡ Rate Limiting para prevenir ataques de força bruta.
* 🕵️ Monitoramento de atividades suspeitas.

**📌 5.2 Regras de Segurança**

🚨 Medidas para evitar ataques cibernéticos:

* 🔒 Bloqueio temporário após 5 tentativas de login falhas.
* 📜 Logs de atividades para rastrear ações suspeitas.

**🛡️ Proteção contra ataques:**

* SQL Injection
* XSS (Cross-Site Scripting)
* CSRF (Cross-Site Request Forgery)

* 🔑 OAuth para login social (Google, Facebook, Apple ID).
* ⚡ Rate Limiting e Proteção contra DDoS para evitar sobrecarga do servidor.
* 🔍 ReCaptcha v3 no Login e Cadastro para evitar bots.
* 🌍 Detecção de logins suspeitos (analisando localização/IP).

Aplicação full-stack, utilizando tecnologias modernas para garantir performance, escalabilidade e segurança.

## 5.3 Tecnologias Utilizadas e Arquitetura do Sistema

**📌 Adições importantes:**

* Redis: Utilizado para cache de sessões, tokens e requisições frequentes, melhorando a escalabilidade.
* Sentry ou LogRocket: Para monitoramento de erros no frontend e backend.
* Especificação da versão mínima do Node.js e PostgreSQL: Garante compatibilidade futura.

**📌 Tecnologias Utilizadas**

| Camada               | Tecnologia                          | Motivo da Escolha                                      |
|----------------------|-------------------------------------|-------------------------------------------------------|
| 🖥 Frontend          | React Native (com TypeScript)       | Desempenho nativo para Android e iOS.                 |
| 🎨 UI/UX             | Tailwind CSS + Radix UI + shadcn/ui | Estilização eficiente e moderna.                     |
| ⚡ Gerenciamento de Estado | TanStack Query (React Query)   | Melhora a performance ao evitar re-renderizações desnecessárias. |
| 🧭 Navegação         | Wouter                             | Alternativa leve ao React Router.                     |
| ✅ Validações        | React Hook Form + Zod              | Validações robustas e intuitivas nos formulários.     |
| 📊 Gráficos         | Recharts                           | Exibição eficiente de métricas e relatórios.          |
| 🎭 Ícones           | Lucide React                       | Ícones modernos e minimalistas.                      |
| 🚀 Backend           | Node.js + Express.js               | Escalável, performático e compatível com APIs REST.   |
| 🔑 Autenticação      | Passport.js                        | Login seguro via e-mail e redes sociais.              |
| 🗄 Banco de Dados    | PostgreSQL                         | Alta confiabilidade e suporte a consultas complexas.  |
| 🛠 ORM               | Drizzle                            | Consultas SQL eficientes e tipadas.                  |
| 🔒 Segurança         | JWT (JSON Web Token)               | Autenticação segura.                                 |
| 🔐 Criptografia      | bcrypt.js + TLS                    | Segurança para senhas e transmissão de dados.        |
| ☁️ Infraestrutura    | Google Cloud / AWS / Azure         | Hospedagem escalável e confiável.                    |

---

# 6.0 Funcionalidades e Regras de Negócio

## 6.1 Tela de Login e Cadastro

* A tela de login e cadastro permitirá que os motoristas acessem suas contas de forma rápida, segura e sincronizada em todos os dispositivos.

### 🔑 Opções de Login

**Login com e-mail e senha** (opção padrão).
**Login via redes sociais** (Google, Facebook, Apple ID) para mais praticidade.
**Recuperação de senha via e-mail**, permitindo redefinir a senha com um link de recuperação.

### 📝 Cadastro de Novo Usuário
Para criar uma conta, o usuário precisará preencher os seguintes campos:
**Nome** (mínimo de 3 caracteres).
**E-mail** (único no sistema, usado como chave principal para login).
**Cidade** (somente letras, sem números ou caracteres especiais).
**Senha** (mínimo de 6 caracteres, com confirmação obrigatória).

#### 📩 Confirmação de e-mail:
* Após o cadastro, um e-mail de confirmação será enviado ao usuário.
* A conta só será ativada após a validação do e-mail, evitando spam e registros falsos.

### ☁️ Sincronização de Dados na Nuvem
* Como o aplicativo estará disponível para Android, iOS e Web, os dados do usuário serão salvos na nuvem.
* Isso permite que o motorista acesse sua conta e todos os seus registros de qualquer dispositivo, garantindo continuidade no uso.

### 🎯 Motivação e Benefícios
* ✅ **Login global** para motoristas de qualquer país.
* ✅ **Facilidade de acesso** por meio de redes sociais.
* ✅ **Recuperação de conta rápida e segura** via e-mail.
* ✅ **Sincronização automática**, permitindo trocar de aparelho sem perder dados.

---

## 6.2 Tela Inicial (Painel)

A tela inicial do aplicativo funcionará como um painel de controle financeiro, onde o motorista poderá ver um resumo rápido do seu desempenho e tomar decisões sobre sua jornada de trabalho.

## 1️⃣ Card Principal → "Situação Atual"

💡 Objetivo: Exibir uma mensagem direta com a meta financeira e o que falta para atingi-la.

🔹 Lógica de Cálculo:

Obter a meta diária do motorista (meta_diaria).
Obter o faturamento do dia (faturamento_hoje).
Calcular o valor restante para atingir a meta:

```
SELECT meta_diaria - faturamento_hoje AS restante_meta
FROM metas
WHERE id_usuario = :id_usuario
```

- Construir a mensagem:

Se restante_meta > 0: "Faltam R$ X para atingir sua meta de hoje."
Se restante_meta <= 0: "Parabéns! Você já atingiu sua meta diária."

🔹 Exemplo de JSON para o Frontend:

```
{
  "mensagem": "Faltam R$ 150 para atingir sua meta de hoje.",
  "meta_diaria": 300,
  "faturamento_hoje": 150
}
```

## 📌 2️⃣ Card "Meta do Dia"
💡 Objetivo: Exibir a meta diária do motorista e o quanto já foi faturado.

🔹 Lógica de Cálculo:
Obter a meta diária do motorista (meta_diaria).
Obter o faturamento do dia (faturamento_hoje).

Calcular o progresso da meta:
```
SELECT (faturamento_hoje / meta_diaria) * 100 AS percentual_meta
FROM metas
WHERE id_usuario = :id_usuario
```
Formatar percentual entre 0% e 100%.

🔹 Exemplo de JSON para o Frontend:
```
{
  "meta_diaria": 300,
  "faturamento_hoje": 150,
  "percentual_meta": 50
}
```

## 📌 3️⃣ Card "Gasto com Combustível"
💡 Objetivo: Mostrar quanto foi gasto hoje e a previsão do mês.

🔹 Lógica de Cálculo:
Obter o gasto de combustível do dia:

```
SELECT SUM(total_pago) AS gasto_combustivel_hoje
FROM abastecimentos
WHERE id_usuario = :id_usuario
AND DATE(data_abastecimento) = CURRENT_DATE
```
Obter o gasto médio diário com base no histórico dos últimos 30 dias:
```
SELECT AVG(total_pago) AS media_gasto_diario
FROM abastecimentos
WHERE id_usuario = :id_usuario
AND data_abastecimento >= NOW() - INTERVAL '30 days'
```
Prever o gasto total no mês:
```
SELECT media_gasto_diario * 30 AS previsao_gasto_combustivel
```

🔹 Exemplo de JSON para o Frontend:

```
{
  "gasto_combustivel_hoje": 80,
  "media_gasto_diario": 75,
  "previsao_gasto_combustivel": 2250
}
```

## 📌 4️⃣ Card "Lucro Real"

💡 Objetivo: Mostrar quanto realmente sobrou depois das despesas.

🔹 Lógica de Cálculo:

Obter o faturamento do dia (faturamento_hoje).
Obter os custos do dia (custos_diarios).

```
SELECT SUM(valor) AS custos_diarios
FROM despesas
WHERE id_usuario = :id_usuario
AND DATE(data_despesa) = CURRENT_DATE
```
Calcular o lucro real do dia:
```
SELECT faturamento_hoje - custos_diarios AS lucro_real
```

🔹 Exemplo de JSON para o Frontend:
```
{
  "faturamento_hoje": 320,
  "custos_diarios": 100,
  "lucro_real": 220
}
```

## 📌 5️⃣ Card "Previsão de Gasto com Combustível"

💡 Objetivo: Prever quanto o motorista gastará com combustível no mês com base no consumo médio.

🔹 Lógica de Cálculo:
Obter a média de gasto diário (media_gasto_diario).
Multiplicar pela quantidade de dias restantes no mês:

```
SELECT media_gasto_diario * (30 - EXTRACT(DAY FROM CURRENT_DATE)) AS previsao_restante
```
🔹 Exemplo de JSON para o Frontend:
```
{
  "media_gasto_diario": 75,
  "previsao_restante": 1500
}
```

## 📌 6️⃣ Card "Previsão de Faturamento Mensal"

💡 Objetivo: Mostrar quanto o motorista irá faturar se continuar no ritmo atual.

🔹 Lógica de Cálculo:
Obter a média diária de faturamento:
```
SELECT AVG(faturamento_total) AS media_faturamento_diario
FROM jornadas
WHERE id_usuario = :id_usuario
AND data_inicio >= NOW() - INTERVAL '30 days'
```

Multiplicar pela quantidade de dias restantes no mês:

```
SELECT media_faturamento_diario * (30 - EXTRACT(DAY FROM CURRENT_DATE)) AS previsao_faturamento
```

🔹 Exemplo de JSON para o Frontend:

```
{
  "media_faturamento_diario": 200,
  "previsao_faturamento": 6000
}
```

## 📌 7️⃣ Card "Ganho da Semana"

💡 Objetivo: Mostrar quanto já foi faturado na semana e a comparação com a meta semanal.

🔹 Lógica de Cálculo:
Obter o faturamento da semana:

```
SELECT SUM(faturamento_total) AS faturamento_semana
FROM jornadas
WHERE id_usuario = :id_usuario
AND data_inicio >= date_trunc('week', CURRENT_DATE)
```

Obter a meta semanal do motorista:

```
SELECT meta_semanal FROM metas WHERE id_usuario = :id_usuario
```

Calcular o percentual da meta atingida:

```
SELECT (faturamento_semana / meta_semanal) * 100 AS percentual_meta_semanal
```

🔹 Exemplo de JSON para o Frontend:
```
{
  "faturamento_semana": 1500,
  "meta_semanal": 2000,
  "percentual_meta_semanal": 75
}
```

## 📌 8️⃣ Card "Ganho do Dia"

💡 Objetivo: Mostrar o total faturado no dia, ajudando o motorista a entender o desempenho diário.

🔹 Lógica de Cálculo:
Obter o faturamento do dia:

```
SELECT SUM(faturamento_total) AS faturamento_hoje
FROM jornadas
WHERE id_usuario = :id_usuario
AND DATE(data_inicio) = CURRENT_DATE
```

🔹 Exemplo de JSON para o Frontend:

```
{
  "faturamento_hoje": 320
}
```

## 📌 9️⃣ Card "Ganho por KM Rodado"

💡 Objetivo: Mostrar quanto o motorista está faturando por quilômetro rodado, uma métrica muito importante para ele otimizar seu trabalho.

🔹 Lógica de Cálculo:

Obter o faturamento do dia:

```
SELECT SUM(faturamento_total) AS faturamento_hoje
FROM jornadas
WHERE id_usuario = :id_usuario
AND DATE(data_inicio) = CURRENT_DATE
```

Obter a quilometragem percorrida no dia:

```
SELECT SUM(km_total) AS km_rodado_hoje
FROM jornadas
WHERE id_usuario = :id_usuario
AND DATE(data_inicio) = CURRENT_DATE
```

Calcular o ganho por KM rodado:

```
SELECT faturamento_hoje / km_rodado_hoje AS ganho_por_km
```

🔹 Exemplo de JSON para o Frontend:

```
{
  "faturamento_hoje": 320,
  "km_rodado_hoje": 80,
  "ganho_por_km": 4.0
}
```

## 📌 1️⃣0️⃣ Card "Lucro Real do Dia"

💡 Objetivo: Exibir o quanto realmente sobrou depois de descontar combustível e despesas.

🔹 Lógica de Cálculo:
Obter o faturamento do dia:

```
SELECT SUM(faturamento_total) AS faturamento_hoje
FROM jornadas
WHERE id_usuario = :id_usuario
AND DATE(data_inicio) = CURRENT_DATE
```

Obter os custos do dia (combustível + despesas):

```
SELECT SUM(valor) AS custos_diarios
FROM despesas
WHERE id_usuario = :id_usuario
AND DATE(data_despesa) = CURRENT_DATE
```

Calcular o lucro real do dia:

```
SELECT faturamento_hoje - custos_diarios AS lucro_real_dia
```

🔹 Exemplo de JSON para o Frontend:

```
{
  "faturamento_hoje": 320,
  "custos_diarios": 100,
  "lucro_real_dia": 220
}
```

⚙ Personalização do Painel

O motorista poderá escolher quais métricas deseja visualizar primeiro.
Exemplo: pode definir "Lucro Líquido" como primeiro card, em vez de "Ganho da Semana".

⚠ Alertas Inteligentes
Se os gastos com combustível estiverem acima da média usual do motorista, um aviso será exibido sugerindo otimização dos trajetos.

🎯 Motivação e Benefícios
✅ Resumo rápido da performance financeira em tempo real.
✅ Facilidade na tomada de decisão sobre quando vale a pena rodar mais.
✅ Painel personalizado, exibindo as informações mais relevantes para cada motorista.
✅ Alertas financeiros inteligentes, ajudando a manter um melhor controle de custos.

## 7.0 Jornadas de Trabalho

* A funcionalidade de Jornadas de Trabalho permitirá ao motorista registrar cada período de trabalho de forma detalhada, incluindo quilometragem, faturamento e tempo trabalhado.

* 🚗 Início de Jornada

* O motorista inicia uma jornada registrando:
  
- ✅ Horário de início → Registrado automaticamente.
- ✅ Quilometragem inicial → Inserida manualmente (apenas números entre 000000 e 999999).

* 🛑 Finalização de Jornada
- Ao encerrar a jornada, o motorista insere:

- ✅ Quilometragem final → Deve ser maior ou igual à inicial.
- ✅ Número de corridas realizadas.
- ✅ Faturamento total da jornada (campo numérico com máscara R$ 9.999,99).

* 🔢 Cálculos Automáticos
- Ao finalizar a jornada, o aplicativo calculará automaticamente:

- 🔹 Quilometragem percorrida.
- 🔹 Tempo total trabalhado.
- 🔹 Gasto estimado com combustível (baseado na quilometragem percorrida na jornada).
- 🔹 Lucro líquido da jornada (faturamento menos despesas).

* Calculo:

- 📌 7.1 Quilometragem Percorrida
- 📌 O que exibe?
- Distância total rodada durante a jornada.

* 📌 Campos do Banco de Dados:

Tabela: jornadas
Campos:
km_inicio → Quilometragem inicial.
km_fim → Quilometragem final.

* 📌 Query SQL:

```
SELECT 
  (km_fim - km_inicio) AS km_percorridos
FROM jornadas
WHERE id_jornada = 'ID_DA_JORNADA';
```

* 📌 7.2 Tempo Total Trabalhado

* 📌 O que exibe?
- Duração da jornada, do início ao fim.

* 📌 Campos do Banco de Dados:

Tabela: jornadas
Campos:
data_inicio → Data/hora de início da jornada.
data_fim → Data/hora de fim da jornada.

📌 Query SQL:
```
SELECT 
  (data_fim - data_inicio) AS tempo_trabalhado
FROM jornadas
WHERE id_jornada = 'ID_DA_JORNADA';
```

* 📌 7.3 Gasto Estimado com Combustível

* 📌 O que exibe?
- Quanto foi gasto em combustível nessa jornada, com base na média de consumo do veículo.

* 📌 Campos do Banco de Dados:

Tabela: veiculos e abastecimentos
Campos:
km_percorridos (calculado acima).
media_consumo (média de KM/L do veículo).
preco_medio_combustivel (média do preço por litro, baseado nos últimos abastecimentos).

* 📌 Query SQL para obter o preço médio do combustível:

```
SELECT 
  AVG(preco_por_litro) AS preco_medio_combustivel
FROM abastecimentos
WHERE id_veiculo = 'ID_DO_VEICULO';
```

* 📌 Query SQL para calcular o gasto estimado:

```
SELECT 
  ( (km_fim - km_inicio) / v.media_consumo ) * preco_medio_combustivel AS gasto_combustivel
FROM jornadas j
JOIN veiculos v ON j.id_veiculo = v.id_veiculo
JOIN (
  SELECT id_veiculo, AVG(preco_por_litro) AS preco_medio_combustivel
  FROM abastecimentos
  WHERE id_veiculo = 'ID_DO_VEICULO'
) AS preco ON v.id_veiculo = preco.id_veiculo
WHERE j.id_jornada = 'ID_DA_JORNADA';
```

* 📌 Lucro Líquido da Jornada

* 📌 O que exibe?
- Quanto o motorista realmente lucrou, descontando custos operacionais.

* 📌 Campos do Banco de Dados:

Tabela: jornadas, despesas e abastecimentos
Campos:
faturamento (total ganho na jornada).
gasto_combustivel (calculado acima).
valor da tabela despesas (somar todas as despesas dessa jornada).

* 📌 Query SQL para calcular o lucro líquido:

```
SELECT 
  j.faturamento - (
    ( (j.km_fim - j.km_inicio) / v.media_consumo ) * preco_medio_combustivel +
    COALESCE(SUM(d.valor), 0)
  ) AS lucro_liquido
FROM jornadas j
JOIN veiculos v ON j.id_veiculo = v.id_veiculo
LEFT JOIN despesas d ON j.id_usuario = d.id_usuario AND DATE(d.data_despesa) = DATE(j.data_jornada)
JOIN (
  SELECT id_veiculo, AVG(preco_por_litro) AS preco_medio_combustivel
  FROM abastecimentos
  WHERE id_veiculo = 'ID_DO_VEICULO'
) AS preco ON v.id_veiculo = preco.id_veiculo
WHERE j.id_jornada = 'ID_DA_JORNADA'
GROUP BY j.id_jornada, j.faturamento, v.media_consumo, preco_medio_combustivel; 
```

## 📚 Histórico de Jornadas

- Todas as jornadas ficam salvas em um histórico acessível.
- O motorista pode editar ou excluir jornadas passadas, caso tenha inserido alguma informação errada.

### 📅 Filtro por Data

- O motorista pode filtrar as jornadas por período.
- Filtro padrão: Exibir apenas as jornadas do mês atual.

### 🔔 Notificações Inteligentes

- O app enviará lembretes para evitar que o motorista esqueça de finalizar a jornada ao fim do dia.

### 🎯 Motivação e Benefícios

- ✅ Registro preciso das jornadas, permitindo um acompanhamento detalhado.
- ✅ Evita esquecimentos, garantindo que todas as informações sejam salvas corretamente.
- ✅ Análises financeiras mais precisas, ajudando o motorista a entender seus lucros e custos diários.

---

## 7.1 Gestão de Combustível

A funcionalidade de Gestão de Combustível permitirá que o motorista registre cada abastecimento, acompanhe seus gastos e analise a eficiência do consumo do veículo.

### 📌 Registro de Abastecimento

Cada abastecimento registrado terá os seguintes campos:
- ✅ **Data e Hora** – O sistema captura automaticamente, mas permite edição.
- ✅ **Tipo de Combustível** – Opções: Gasolina, Álcool, Diesel, GNV.
- ✅ **Quilometragem no momento do abastecimento** – Apenas números inteiros.
- ✅ **Quantidade abastecida** – Exemplo: 45.75 litros.
- ✅ **Preço por litro** – O usuário informa o valor pago no posto.
- ✅ **Valor total** – Calculado automaticamente (quantidade x preço por litro).
- ✅ **Posto de Combustível** (Opcional) – Para referência futura.

### 🔢 Cálculo Automático
- O aplicativo calculará automaticamente a média de consumo do veículo com base nos últimos abastecimentos.

### ⚠ Aviso de Consumo Elevado

- Se o consumo médio do carro subir muito em comparação com os últimos registros, o sistema exibirá um alerta para o motorista verificar possíveis problemas mecânicos ou estratégias para economizar combustível.

### 🎯 Motivação e Benefícios
- ✅ Controle detalhado dos gastos com combustível.
- ✅ Análises precisas sobre consumo e eficiência do veículo.
- ✅ Alertas preventivos para ajudar a economizar e evitar desperdícios.

---

## 7.2 Controle de Despesas

Esta funcionalidade ajudará o motorista a registrar e gerenciar despesas operacionais, permitindo um controle financeiro eficiente.

### 📌 Cadastro de Despesas

- O motorista pode cadastrar despesas avulsas ou recorrentes (mensais, trimestrais, anuais, etc.).
- As despesas podem ser vinculadas a um veículo específico (caso o motorista tenha mais de um carro).
- **Categorias de despesas incluem:**
  - 🔹 **Manutenção** (óleo, pneus, mecânico, etc.).
  - 🔹 **Impostos** (IPVA, licenciamento, seguro obrigatório).
  - 🔹 **Aluguel de veículo** (se o motorista aluga um carro para rodar).
  - 🔹 **Taxas da plataforma** (Uber, 99, InDrive, etc.).

### 📊 Parcelamento e Pagamentos

- Caso uma despesa seja parcelada, o sistema permitirá:
  - ✅ Definir o número de parcelas.
  - ✅ Pagar parcelas antecipadamente (o sistema sugere remover as parcelas futuras, mas o usuário pode negar e ajustar manualmente).
  - ✅ Se o motorista pagar um valor diferente do previsto, o sistema não redistribuirá automaticamente, mas permitirá ajustes manuais.

### 📂 Histórico e Exportação de Dados

- Todas as despesas ficam salvas e podem ser acessadas no histórico.
- O motorista pode editar ou excluir despesas passadas, se necessário.
- Exportação dos dados para **PDF, Excel (XLSX)** e **CSV** para análises mais detalhadas.

### 📊 Gráficos Visuais de Gastos

- Exibição da distribuição dos gastos em um gráfico de pizza:
  - 🔹 **40% combustível**
  - 🔹 **30% manutenção**
  - 🔹 **20% impostos**
  - 🔹 **10% outros gastos**

### 🔔 Lembretes Inteligentes

- Se houver uma despesa importante chegando (como IPVA ou seguro), o aplicativo enviará alertas com antecedência para lembrar o motorista.

### 🎯 Motivação e Benefícios

- ✅ Controle financeiro mais eficiente com categorização de despesas.
- ✅ Facilidade para acompanhar gastos fixos e variáveis.
- ✅ Flexibilidade para pagamentos antecipados e ajustes manuais.
- ✅ Lembretes de pagamentos importantes para evitar atrasos.

---

## 7.3 Metas para Motoristas

A funcionalidade de metas ajudará os motoristas a planejar seus ganhos e acompanhar seu desempenho ao longo do tempo.

### 🎯 Objetivo da Funcionalidade

- ✔ O motorista pode definir metas diárias, semanais e mensais.
- ✔ Um card na tela inicial mostrará o progresso da meta em tempo real.
- ✔ O sistema enviará alertas caso o motorista esteja abaixo da meta.
- ✔ O motorista poderá consultar o desempenho em metas passadas.
- ✔ Se um motorista geralmente ganha R$ 1.200 por semana, o sistema sugerirá uma meta próxima disso, ao invés de deixar em branco.

### 📊 Definição de Metas
O motorista poderá cadastrar três tipos de metas:

| Tipo de Meta | O que o motorista define? | Exemplo |
|--------------|---------------------------|---------|
| **Diária**   | Valor que deseja faturar no dia. | R$ 250/dia |
| **Semanal**  | Valor total desejado para a semana. | R$ 1.750/semana |
| **Mensal**   | Valor total desejado no mês. | R$ 7.500/mês |

- O motorista pode alterar ou redefinir metas futuras a qualquer momento.
- Não é possível alterar metas passadas para manter a precisão dos relatórios.
- As metas não são acumulativas (exemplo: a meta semanal não soma automaticamente as metas diárias).

### 📊 Monitoramento do Progresso

- Será adicionado um card dinâmico na tela inicial, mostrando o progresso da meta escolhida.
- O motorista poderá alternar entre visualizar o progresso diário, semanal ou mensal.
- Exibição do progresso em percentual e valores.

- **Exemplo de Card na Tela Inicial:**
  - 🔹 🎯 **Meta Semanal:** R$ 1.750
  - 🔹 📊 **Progresso:** R$ 1.200 / R$ 1.750 (68%)
  - 🔹 ⚠️ **Você precisa de R$ 550 para atingir sua meta!**

### 🔔 Alertas e Notificações
- Se o motorista estiver abaixo da meta, um aviso será exibido na tela inicial.
- O sistema poderá enviar notificações push, sugerindo que o motorista aumente o ritmo de trabalho.

| Condição | Mensagem exibida |
|----------|------------------|
| **75% ou mais da meta atingida ✅** | "Ótimo trabalho! Você está perto de atingir sua meta!" |
| **Abaixo de 50% ⚠️** | "Você está abaixo da sua meta. Que tal rodar mais um pouco?" |

### 📌 Integração na Tela Inicial

- ✔ O card de metas será adicionado ao painel principal.
- ✔ O motorista poderá trocar entre meta diária, semanal ou mensal.
- ✔ O progresso será atualizado em tempo real, com base no faturamento registrado.

### 🎯 Motivação e Benefícios

- ✅ Ajuda o motorista a organizar melhor seus ganhos e definir objetivos claros.
- ✅ Monitoramento visual e intuitivo do progresso financeiro.
- ✅ Notificações motivacionais para incentivar maior faturamento.
- ✅ Sugestão de metas com base no histórico do motorista.

---

## 7.4 Análises e Relatórios

- A funcionalidade de Análises e Relatórios fornecerá aos motoristas uma visão detalhada sobre seu desempenho financeiro e eficiência operacional.

- O sistema oferecerá relatórios básicos e avançados, permitindo que o motorista acompanhe sua evolução, compare seu desempenho com outros motoristas da cidade e identifique os melhores períodos para trabalhar.

### 📊 Relatórios Básicos

- ✅ **Faturamento Diário, Semanal e Mensal** – Exibição do valor total recebido por período.
- ✅ **Gastos com Combustível por Dia** – Relatório detalhado sobre os custos de abastecimento.
- ✅ **Ganho por KM Rodado** – Média de faturamento por quilômetro percorrido.
- ✅ **Comparação de Faturamento entre Aplicativos** – Mostra qual app (Uber, 99, InDrive) gerou mais receita.

### 📊 Relatórios Avançados
- Os relatórios avançados permitirão ao motorista fazer análises mais aprofundadas sobre seu desempenho, comparação com outros motoristas e tendências financeiras.

- 🔹 **Ranking de Melhores Motoristas em Faturamento** – Lista dos motoristas com maior faturamento.
- 🔹 **Ranking de Melhores Motoristas em Lucro** – Lista dos motoristas que obtiveram maior lucro líquido.
- 🔹 **Ranking de Motoristas com Maiores Quilometragens** – Comparação de quilometragem percorrida.
- 🔹 **Sua Posição no Ranking** – Mostra sua colocação em relação aos outros motoristas da cidade, baseado em faturamento, quilometragem e lucro separadamente.
- 🔹 **Média de Faturamento e Quilometragem por Dia da Semana** – Ajuda a identificar os dias mais lucrativos.
- 🔹 **Gráfico de Evolução das Últimas 8 Semanas** – Comparação entre faturamento e gastos ao longo do tempo.
- 🔹 **Previsão de Faturamento e Lucro** – Estimativa dos ganhos para a próxima semana e mês, baseada no histórico do motorista.
- 🔹 **Gráfico Comparativo dos Aplicativos** – Mostra qual plataforma (Uber, 99, InDrive) trouxe mais ganhos ao longo do tempo.

### 📂 Exportação de Dados e Personalização

- ✅ Exportação de Relatórios em **PDF, Excel (XLSX)** e **CSV**.
- ✅ Filtros por Data → O padrão será exibir o mês atual, mas o motorista pode escolher períodos personalizados.
- ✅ Modo de Exibição Otimizado → Um card por vez, com rolagem automática para facilitar a navegação.

### � Motivação e Benefícios
- ✅ Facilidade para analisar o desempenho financeiro e identificar tendências.
- ✅ Ajuda o motorista a entender quais dias e horários são mais rentáveis.
- ✅ Comparação entre diferentes aplicativos para otimizar os ganhos.
- ✅ Possibilidade de se motivar ao ver seu desempenho no ranking da cidade.
- ✅ Estimativa de faturamento futuro, auxiliando no planejamento financeiro.

---

# 8.0 Frontend UX/UI

- Esta seção descreve a experiência do usuário (UX) e a interface gráfica (UI) do aplicativo, garantindo que o design seja intuitivo, funcional e responsivo.

## 8.1 Tela de Login e Cadastro

### 🎯 Objetivo

- Permitir que o motorista faça login ou crie uma conta de forma rápida e segura.
- Suporte a **Dark Mode**, respeitando as configurações do sistema operacional.
- **Login biométrico** (Face ID / Digital) e **PIN de 4 a 6 dígitos** como alternativa rápida.
- Exibir validação instantânea do e-mail, avisando se já está cadastrado antes do envio do formulário.

### ✅ Componentes

#### 📌 Login:
- **Campos:** E-mail e senha.
- Botão **"Entrar"**.
- Botão **"Entrar com Google / Apple ID"**.
- Botão **"Entrar com Biometria"** (Face ID / Digital).
- Campo de **PIN** (Opcional) → "Digite seu PIN ou use biometria".
- Link **"Esqueceu a senha?"**.

#### 📌 Cadastro:
- **Campos:** Nome, e-mail, senha e cidade.
- Botão **"Criar Conta"**.
- Checkbox **"Aceito os termos de uso"** (obrigatório).
- Validação instantânea do e-mail (verifica se já existe no sistema).

#### 📌 Feedback Visual:
- Mensagens de erro/sucesso (exemplo: **"E-mail inválido"**, **"Senha incorreta"**).
- Animações sutis ao carregar o login/cadastro.

### 💡 Tecnologias
- ✅ **React Hook Form + Zod** → Validação de formulários.
- ✅ **Firebase Auth ou Supabase** → Autenticação segura.
- ✅ **Tailwind CSS** → Layout responsivo e moderno.

---

## 📌 8.2 Tela Inicial (Dashboard)

### 🎯 Objetivo
- A Tela Inicial deve ser clara, direta e objetiva, fornecendo informações essenciais para que o motorista compreenda rapidamente sua situação financeira e progresso nas metas.

✅ Destaques:

- Apresentação simples e sem sobrecarga de informações.
- Foco no status financeiro atual, ajudando o motorista a entender o que precisa fazer no dia.
- Previsões financeiras para que o motorista se antecipe aos gastos e ganhos.
- Atualização dinâmica dos dados sem precisar recarregar a tela.
- Skeleton loaders para evitar tela vazia enquanto os dados carregam.
- Animações suaves ao exibir novos valores.
- Acesso rápido a ações essenciais como iniciar jornada e registrar abastecimento.

### ✅ Componentes da Tela Inicial

#### 📌 1️⃣ Card Principal → "Situação Atual"

- 📌 O card principal deve ser destacado de forma mais chamativa com um gráfico de progresso mostrando visualmente o quanto falta para a meta.
- 📌 Pode incluir um botão "Ver Detalhes", que leva o usuário a um relatório mais completo.
- 📌 Mensagem personalizada sobre o status financeiro atual.

Exemplos:
```
💬 "Você precisa faturar R$ 180 hoje para cobrir seus custos fixos."
💬 "No ritmo atual, seu lucro mensal será de R$ 3.500. Você precisa de R$ 500 a mais para atingir sua meta."
💬 "Você já gastou R$ 500 com combustível este mês. Seu gasto previsto é de R$ 1.200."
```

Motivo: Ajuda o motorista a entender rapidamente sua situação sem precisar interpretar números soltos.

#### 📌 2️⃣ Cards Resumo (Indicadores Principais)

- 💰 Ganho do Dia → Total faturado hoje.
- 📊 Lucro Líquido → Quanto sobrou depois dos custos.
- 🚗 Ganho por KM Rodado → Quanto está faturando por quilômetro.
- ⛽ Gasto com Combustível → Valor gasto no dia e previsão mensal.
- 📅 Meta da Semana → Progresso percentual e valor restante.
- 🎯 Meta do Mês → Previsão de faturamento mensal e comparação com meta.

### 📌 3️⃣ Card de Metas

- Exibe o progresso da meta diária, semanal ou mensal.
- Botão "Trocar Meta" → O motorista pode alternar entre metas.
- Indicação visual (barra de progresso) para facilitar a leitura rápida.

### 📌 4️⃣ Atalhos Rápidos

- 🚀 Iniciar Jornada → Botão para registrar início da jornada.
- ⛽ Registrar Abastecimento → Acesso direto à tela de abastecimento.
- 📊 Ver Relatórios → Navegação rápida para as análises completas.

### 📌 5️⃣ Widget Opcional

- Um mini-widget fixo na tela inicial do celular, exibindo:
- Progresso da Meta (quanto já atingiu e quanto falta).

- Motivo: Permite ao motorista visualizar seu desempenho sem abrir o app.

### 📌 Cards Dinâmicos e Interativos

 - Para evitar sobrecarga visual, os cards menos usados podem ser colapsáveis ou acessíveis via um botão “Ver mais”.

### 📌 Alertas Inteligentes Mais Aprofundados

📌 Além dos alertas sobre combustível, o app pode avisar quando:

* ✔️ A rentabilidade por KM estiver abaixo da média.
* ✔️ O faturamento semanal estiver muito distante da meta.
* ✔️ O motorista estiver rodando muitas horas com baixo retorno financeiro.


## 💡 Tecnologias Utilizadas

- ✅ TanStack Query → Atualização em tempo real dos ganhos e metas.
- ✅ Shadcn/ui + Tailwind CSS → Layout responsivo e moderno.
- ✅ Framer Motion → Suavização de animações e transições de valores.
- ✅ Local Storage / Async Storage → Para salvar preferências do usuário.

---

## 8.3 Tela de Jornadas de Trabalho

### 🎯 Objetivo
- Registrar e acompanhar jornadas de trabalho.
- Permitir pausas sem contar no tempo de serviço (para intervalos, almoço, etc.).
- Exibir métricas úteis como:

  - 🚀 **Melhor dia da semana para faturamento**.
  - ⏳ **Duração média das jornadas**.

### ✅ Componentes
#### 📌 Início da Jornada:
- Botão **"Iniciar Jornada"** → Captura data, hora e quilometragem inicial automaticamente.
- Campo de **Quilometragem Inicial** → Com validação automática.

#### 📌 Pausa na Jornada:
- Botão **"Pausar Jornada"** → Permite pausas sem contar no tempo total de serviço.
- Botão **"Retomar Jornada"** → Continua o tempo de serviço normalmente.

#### 📌 Finalização da Jornada:
- Botão **"Finalizar Jornada"** → Captura quilometragem final e faturamento.
- **Cálculo Automático:**
  - 🚗 **KM Percorridos**.
  - 💰 **Faturamento Total**.
  - ⛽ **Gasto estimado com combustível**.

#### 📌 Histórico de Jornadas:
- Exibição das últimas jornadas registradas.
- Filtro por data para buscar jornadas passadas.
- Possibilidade de edição de uma jornada anterior.

### 💡 Tecnologias
- ✅ **Shadcn/ui + Tailwind CSS** → Design responsivo e leve.
- ✅ **TanStack Query** → Atualização instantânea dos dados.

## 8.4 Tela de Abastecimentos

### 🎯 Objetivo
- Permitir que o motorista registre e acompanhe abastecimentos.
- Criar uma previsão de quantos KM ainda podem ser rodados com base no tanque atual.
- Exibir gráficos de consumo médio do veículo em vez de apenas uma lista.

### ✅ Componentes

#### 📌 Registrar Abastecimento:
- 📆 **Data e Hora** (registradas automaticamente).
- ⛽ **Tipo de Combustível** (Gasolina, Álcool, Diesel, GNV).
- 🚗 **KM no momento do abastecimento**.
- 💧 **Litros abastecidos**.
- 💰 **Preço por litro e valor total** (calculado automaticamente).
- 🏪 **Posto de Combustível** (opcional).
- Botão **"Salvar Abastecimento"**.

#### 📌 Histórico de Abastecimentos:

- Listagem dos últimos abastecimentos.
- Gráfico de barras mostrando o consumo médio do veículo.

### 💡 Tecnologias
- ✅ **React Hook Form + Zod** → Validação dos campos.
- ✅ **Recharts** → Exibição do consumo médio do veículo.
- ✅ **TanStack Query** → Atualização dos dados em tempo real.

---

## 8.5 Tela de Despesas

### 🎯 Objetivo
- Registrar e visualizar despesas do motorista.
- Permitir alterar o vencimento de contas futuras.
- Indicar despesas recorrentes automaticamente.
- Enviar alertas automáticos: **"Seu IPVA vence em 3 dias. Deseja registrar o pagamento?"**

### ✅ Componentes
#### 📌 Cadastro de Despesas:
- 📌 **Tipo de Despesa** (IPVA, Seguro, Manutenção, Aluguel, Outros).
- 💰 **Valor**.
- 🗓 **Data da Despesa**.
- Checkbox **"Despesa Recorrente"** (ativar/desativar).
- Botão **"Salvar Despesa"**.

#### 📌 Histórico de Despesas:
- Listagem das últimas despesas.
- Filtro por período (dia, semana, mês).

#### 📌 Exportação de Dados:
- Botão **"Exportar para PDF/Excel"**.

### 💡 Tecnologias
- ✅ **TanStack Table** → Exibição das despesas com filtros.
- ✅ **PDFKit / SheetJS** → Exportação para PDF e Excel.
- ✅ **Shadcn/ui + Tailwind CSS** → Interface moderna.

---

## 8.6 Tela de Relatórios e Análises

### 🎯 Objetivo

- Exibir estatísticas financeiras detalhadas para o motorista.
- Criar um gráfico de tendência de lucro dos últimos 3 meses.
- Implementar um sistema de insights com sugestões automáticas:
  - **"Seu faturamento caiu 10% esta semana. Pode ser um reflexo do horário trabalhado?"**
  - **"Sábado tem sido seu dia mais lucrativo. Considere trabalhar mais nesse dia."**
- Exibir um ranking com motoristas semelhantes na cidade (com base em quilometragem e veículo).

### ✅ Componentes
#### 📌 Relatórios Básicos:

- 📆 **Faturamento diário, semanal e mensal**.
- ⛽ **Gastos com combustível por período**.
- 🚗 **Média de KM rodado por dia**.

#### 📌 Relatórios Avançados:

- 🔹 **Comparação de ganhos entre Uber, 99, InDrive**.
- 📈 **Gráfico de evolução dos últimos 3 meses**.
- 🔮 **Previsão de ganhos futuros**.
- Comparação de faturamento médio e quilometragem de motoristas da cidade.
- Ranking de melhores faturamentos, lucros e quilometragens.

#### 📌 Filtros e Exportação:

- Filtro de período.
- Botão **"Exportar Relatório"** (PDF, Excel).

### 💡 Tecnologias

- ✅ **Recharts** → Gráficos interativos.
- ✅ **SheetJS** → Exportação de relatórios.
- ✅ **TanStack Query** → Atualização dos dados.

---

## 8.7 Notificações

### 🎯 Objetivo

* Exibir alertas e mensagens importantes para o motorista.
* Permitir notificações manuais (ex: **"Me lembre de abastecer quando o tanque estiver abaixo de 25%."**).
* Implementar um Sistema de Conquistas (Gamificação) com prêmios motivacionais:

  - **"Parabéns! Você bateu sua meta semanal 3 vezes seguidas!"**
  - **"TOP 10 motoristas da sua cidade este mês!"**

### ✅ Componentes

#### 📌 Notificações de Progresso de Metas:
- 🔥 **"Você está a 75% da sua meta semanal! Falta pouco!"**
- ⚠️ **"Abaixo de 50% da meta. Tente rodar mais algumas horas!"**

#### 📌 Alertas de Manutenção do Veículo:
- 🚗 **"Você já rodou 5.000 km desde o último abastecimento. Hora de revisar o carro?"**

#### 📌 Mensagens do Sistema:
- **"Nova atualização disponível!"**

### 💡 Tecnologias
- ✅ **Expo Notifications** → Envio de notificações push.
- ✅ **Shadcn/ui + Tailwind CSS** → Interface visual para alertas.

---

## 8.8 Resumo Final das Telas do App

| Tela               | Objetivo                          | Principais Componentes                                                                 |
|---------------------|-----------------------------------|---------------------------------------------------------------------------------------|
| 1️⃣ **Login/Cadastro** | Entrada no app                    | Formulários de login e autenticação social                                            |
| 2️⃣ **Tela Inicial**   | Resumo financeiro                 | Cards de ganhos, atalhos e metas                                                      |
| 3️⃣ **Jornadas**       | Registro de trabalho              | Iniciar/Finalizar jornada, histórico                                                 |
| 4️⃣ **Abastecimentos** | Controle de combustível           | Registro e histórico de consumo                                                       |
| 5️⃣ **Despesas**       | Gerenciamento financeiro          | Cadastro e exportação de despesas                                                    |
| 6️⃣ **Relatórios**     | Estatísticas detalhadas           | Gráficos e exportação de dados                                                       |
| 7️⃣ **Notificações**   | Engajamento                       | Alertas e notificações push                                                          |

## 8.9 Notificações

📌 Wizard de Configuração Inicial

**📢 Objetivo:**

- 🔹 Auxiliar o motorista a preencher as informações essenciais logo no primeiro acesso.
- 🔹 Evitar sobrecarga de dados → Mostrar apenas o necessário de forma rápida.
- 🔹 Garantir que o sistema tenha os dados mínimos para funcionar corretamente.


## 📌 Estrutura do Wizard  

O wizard será composto por 4 etapas principais, organizadas de forma rápida e objetiva.

- 📌 Passo 1 → Cadastro do Veículo  
- 📌 Passo 2 → Configuração da Meta Financeira  
- 📌 Passo 3 → Registro de Custos Fixos  
- 📌 Passo 4 → Finalização e Dicas Iniciais  
  
### 📌 🏎️ Passo 1 → Cadastro do Veículo  
- 🔹 Perguntar se o motorista quer cadastrar seu veículo agora ou depois.  
- 🔹 Se ele quiser cadastrar agora, preencher os seguintes dados:  

- Fabricante e modelo (Ex: Toyota Corolla).  
- Ano (Ex: 2020).  
- Placa do veículo (Opcional).  
- Uso do veículo (Próprio, Alugado ou Financiado).  
- Consumo médio de combustível (km/L).  

- ✅ Se ele pular essa etapa, o sistema exibirá um aviso:  
- "Você poderá cadastrar seu veículo depois no menu ‘Veículos’  

### 📌 💰 Passo 2 → Configuração da Meta Financeira  

- 🔹 Perguntar: “Quanto você quer faturar por mês?”  
- 🔹 O sistema divide automaticamente essa meta em:  

- Meta diária = meta_mensal / 30  
- Meta semanal = meta_mensal / 4  

- 🔹 O motorista pode ajustar manualmente as metas se quiser.  

- ✅ Se ele pular essa etapa, o sistema definirá um valor padrão de R$ 5.000 como meta mensal.  

### 📌 🛠️ Passo 3 → Registro de Custos Fixos  
- 🔹 Perguntar: “Quais são seus custos mensais?”  
- 🔹 Opções para preencher rapidamente (valores são editáveis):  

- Aluguel do carro (se for alugado).  
- Prestação do carro (se for financiado).  
- Seguro do carro.  
- Média mensal de gasto com combustível (pode ser estimada).  

- ✅ Se ele pular essa etapa, o sistema assumirá um valor médio com base nos motoristas cadastrados na mesma cidade.  

### 📌 ✅ Passo 4 → Finalização e Dicas Iniciais  
- 📌 Mensagem de boas-vindas:  
- "Tudo pronto! Agora você pode começar a registrar suas jornadas e acompanhar seus ganhos."  

- 📌 Opções para acessar diretamente:  
- 🚀 Iniciar Jornada Agora  
- ⛽ Registrar Primeiro Abastecimento  
- 📊 Ver Painel Financeiro 

## 📌 Implementação Técnica

🔹 Estrutura do Wizard

- ✅ Armazenar progresso do wizard no banco de dados, na tabela usuarios:

```
ALTER TABLE usuarios ADD COLUMN wizard_completado BOOLEAN DEFAULT false;
```

- ✅ O frontend verifica se wizard_completado = false para exibir o wizard.
- ✅ Após a finalização, atualizar o banco:

```
UPDATE usuarios SET wizard_completado = true WHERE id_usuario = :id_usuario;
```

## 8.10 Configurações do Aplicativo

📢 Objetivo:
- 🔹 Permitir que o motorista personalize o aplicativo e ajuste preferências essenciais para sua experiência.
- 🔹 Garantir que as configurações sejam salvas e aplicadas automaticamente.

## 📌 7.1 Seções da Tela de Configurações
- A tela de Configurações será dividida em categorias, facilitando o acesso e a organização das opções.

###📌 1️⃣ Perfil do Usuário
-📌 Campos:

* Nome completo.
* E-mail (não editável).
* Telefone (com autenticação via SMS).
* Cidade de operação.
* Senha (opção para alterar).
* 🚨 Excluir Conta → Processo seguro para remoção definitiva dos dados.

📌 Ações disponíveis:
* ✅ Atualizar informações pessoais.
* ✅ Alterar senha com verificação de segurança.
* ✅ Configurar autenticação de dois fatores (MFA).

###📌 2️⃣ Preferências de Exibição
- 📌 Opções Disponíveis:

* 🌙 Modo Escuro / Claro / Automático (Dark Mode).
* 📏 Unidade de Medida → Km/L ou Milhas/Galão.
* 💬 Idioma → Suporte a múltiplos idiomas (i18n).
* 🎨 Tamanho da Fonte → Pequeno, Médio, Grande.
* 🔔 Ativar/Desativar Notificações → Alertas de lembrete e resumo financeiro.

### Implementação Técnica

- ✅ Alterar Senha (com verificação de senha atual)

```
app.put('/usuario/senha', autenticarUsuario, async (req, res) => {
    const { senha_atual, nova_senha } = req.body;
    const id_usuario = req.usuario.id;

    const usuario = await db('usuarios').where({ id_usuario }).first();
    
    if (!bcrypt.compareSync(senha_atual, usuario.senha)) {
        return res.status(400).json({ erro: "Senha atual incorreta!" });
    }

    const senha_criptografada = bcrypt.hashSync(nova_senha, 10);

    await db('usuarios').where({ id_usuario }).update({ senha: senha_criptografada });

    res.json({ mensagem: "Senha alterada com sucesso!" });
});
```

-  ✅ Excluir Conta (Processo Seguro)

```
app.delete('/usuario/excluir', autenticarUsuario, async (req, res) => {
    const id_usuario = req.usuario.id;

    await db('usuarios').where({ id_usuario }).update({ deleted_at: new Date() });

    res.json({ mensagem: "Conta excluída com sucesso. Seus dados foram desativados." });
});
```

- ✅ Ativar/Desativar Autenticação de Dois Fatores (MFA)

```
app.put('/usuario/mfa', autenticarUsuario, async (req, res) => {
    const { ativar } = req.body;
    const id_usuario = req.usuario.id;

    await db('usuarios').where({ id_usuario }).update({ autenticacao_dois_fatores: ativar });

    res.json({ mensagem: ativar ? "MFA ativado com sucesso!" : "MFA desativado." });
});
```

### Preferências de Exibição

- 📌 Criar Tabela para Configurações do Usuário:

```
CREATE TABLE configuracoes (
    id_configuracao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID REFERENCES usuarios(id_usuario) UNIQUE,
    modo_escuro BOOLEAN DEFAULT false,
    unidade_medida ENUM('km/l', 'mpg') DEFAULT 'km/l',
    idioma VARCHAR(10) DEFAULT 'pt-BR',
    tamanho_fonte ENUM('pequeno', 'medio', 'grande') DEFAULT 'medio',
    notificacoes_ativas BOOLEAN DEFAULT true
);
```

### 📌 Endpoints no Backend:

- ✅ Atualizar Preferências de Exibição

```
app.put('/usuario/configuracoes', autenticarUsuario, async (req, res) => {
    const { modo_escuro, unidade_medida, idioma, tamanho_fonte, notificacoes_ativas } = req.body;
    const id_usuario = req.usuario.id;

    await db('configuracoes')
        .where({ id_usuario })
        .update({ modo_escuro, unidade_medida, idioma, tamanho_fonte, notificacoes_ativas });

    res.json({ mensagem: "Configurações atualizadas!" });
});
```

- ✅ Obter Preferências do Usuário

```
app.get('/usuario/configuracoes', autenticarUsuario, async (req, res) => {
    const id_usuario = req.usuario.id;

    const configuracoes = await db('configuracoes').where({ id_usuario }).first();

    res.json(configuracoes);
});
```

---

# 9.0 Plano de Monetização

## 9.1 Modelo de Negócio
📌 **Modelo Freemium** com planos pagos para desbloquear funcionalidades avançadas.

📌 **Tipos de monetização:**
- ✅ **Plano Gratuito** → Acesso básico.
- ✅ **Plano Premium Mensal** → R$ XX,90/mês.
- ✅ **Plano Premium Anual** → R$ XXX,90/ano (desconto).
- ✅ **Plano Premium Semestral** → R$ XXX,90/ano.
- ✅ **Pagamento único** para relatórios avançados.

---

## 9.2 Plano Básico - Gratuito
📌 **Funcionalidades incluídas:**
- ✅ Cadastro e Login.
- ✅ Registro de Jornadas.
- ✅ Registro de Abastecimentos.
- ✅ Cadastro de 1 veículo ativo.
- ✅ Relatórios básicos.
- ✅ Exportação limitada (7 dias de dados).

📌 **Restrições no plano gratuito:**
- 🚫 Sem acesso a relatórios avançados.
- 🚫 Histórico de abastecimentos limitado a 30 dias.
- 🚫 Sem ranking de faturamento da cidade.
- 🚫 Não pode cadastrar múltiplos veículos.

📌 **Estratégias para conversão:**
- ✅ Botão "Ver Benefícios do Premium" nas telas bloqueadas.
- ✅ Contador de "dias restantes" de histórico.
- ✅ Assinatura com Cashback (10% se renovar antes do vencimento).

---

## 9.3 Plano Premium - Pago
📌 **Funcionalidades desbloqueadas:**
- ✅ Histórico ilimitado de abastecimentos e despesas.
- ✅ Cadastro de múltiplos veículos.
- ✅ **Relatórios avançados:**
  - Comparação de faturamento entre Uber, 99 e InDrive.
  - Ranking do motorista na cidade.
  - Previsão de faturamento para a próxima semana/mês.
- ✅ Exportação completa de relatórios (PDF, Excel, CSV).
- ✅ Suporte prioritário via chat.

📌 **Extras para monetização:**
- 🚀 **Pagamento avulso:** Acesso único a relatórios específicos sem assinatura mensal.

---

## 9.4 Estratégia para Incentivar a Assinatura
📌 **Técnicas para aumentar conversão:**
- ✅ Teste grátis de 7 dias para novos usuários.
- ✅ Mensagens dentro do app promovendo o plano premium.
- ✅ Descontos para assinaturas anuais.
- ✅ Ofertas sazonais (ex: Black Friday, fim de ano).
- ✅ Alertas antes do teste grátis expirar.
- ✅ "Nível VIP" para motoristas Premium.

📌 **Táticas avançadas:**
- **Teste Grátis de 7 Dias com Cartão Salvo 💳** → Cobrança automática após o período.
- **Plano Semestral com Desconto Progressivo 📉** → Mensal: R$ 19,90 → Semestral: R$ 14,90/mês.
- **Gamificação no Ranking �** → Motoristas Premium têm um ranking separado.
