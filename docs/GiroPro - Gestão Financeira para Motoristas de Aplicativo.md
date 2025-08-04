# GiroPro - Gestão Financeira para Motoristas de Aplicativo

![GiroPro Logo](https://via.placeholder.com/400x100/4A90E2/FFFFFF?text=GiroPro)

## 📱 Sobre o Projeto

O **GiroPro** é um aplicativo completo de gestão financeira desenvolvido especificamente para motoristas de aplicativo. Com interface intuitiva e funcionalidades robustas, o app permite controle total sobre ganhos, despesas e lucratividade, ajudando motoristas a maximizar seus resultados.

**Status Atual:** ✅ Versão 1.0 - Correções de Banco de Dados e Testes Iniciais Concluídas
**Última Atualização:** 8 de Março de 2025

## 🚀 Funcionalidades Principais

### 💰 Gestão Financeira Completa
- **Dashboard Intuitivo** com métricas em tempo real
- **Controle de Jornadas** com registro detalhado de viagens
- **Gestão de Abastecimentos** com histórico completo
- **Controle de Despesas** categorizadas
- **Relatórios Avançados** com insights inteligentes

### 📊 Analytics e Insights
- Métricas de performance personalizadas
- Gráficos interativos de faturamento
- Indicadores de tendência
- Comparações temporais (dia, semana, mês, ano)
- Sugestões de otimização baseadas em dados

### 🎨 Experiência do Usuário
- **Onboarding Interativo** em 4 etapas
- **Dashboard Visual** com cards modulares
- **Modo Condução** otimizado para uso durante direção
- **Animações Suaves** e feedback visual
- **Design Responsivo** para todos os dispositivos

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com TypeScript
- **Express.js** para API REST
- **SQLite** com Drizzle ORM
- **JWT** para autenticação
- **Jest** para testes automatizados

### Frontend
- **React Native** com Expo
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **React Native Chart Kit** para gráficos
- **Expo Vector Icons** para ícones
- **Jest** e **Testing Library** para testes

### DevOps e Build
- **EAS Build** para geração de APK/IPA
- **Docker** para containerização
- **GitHub Actions** para CI/CD (configuração futura)

## 📁 Estrutura do Projeto

```
GiroPro/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── controllers/     # Controllers da API
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── db/              # Configuração do banco
│   │   ├── middleware/      # Middlewares
│   │   └── __tests__/       # Testes automatizados
│   ├── package.json
│   ├── tsconfig.json
│   └── node_modules/        # Excluído do controle de versão (gerado por npm install)
├── frontend/                # App React Native
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── screens/         # Telas do aplicativo
│   │   ├── services/        # Serviços de API
│   │   ├── contexts/        # Contextos React
│   │   └── __tests__/       # Testes de componentes
│   ├── app.json             # Configuração do Expo
│   ├── eas.json             # Configuração do EAS Build
│   ├── package.json
│   └── node_modules/        # Excluído do controle de versão (gerado por npm install)
├── docs/                    # Documentação
│   ├── GiroPro - Gestão Financeira para Motoristas de Aplicativo.md
│   ├── Relatório de Correções e Próximas Etapas para o Projeto GiroPro.md
│   ├── Relatórios e Dashboards/
│   ├── Roadmap do Projeto GiroPro - 2025-2026.md
│   ├── relatorio-correcoes.md
│   ├── ⚙️EspecificaçõesTécnicas-GiroPro.md
│   ├── 💰 Estratégia de Precificação para o GiroPro_ Foco no Motorista de Aplicativo.md
│   └── 🚀DetalhamentodeAPIseModelosdeDadosdoGiroPro.md
├── docker-compose.yml
├── relatorio_correcoes_schema.md
├── setup.sh
├── setup_db_manual.sh
├── setup_sqlite.sh
└── verify_setup.sh
```

## 🚀 Como Executar o Projeto

Para configurar e executar o projeto GiroPro, siga os passos abaixo. É altamente recomendado utilizar os scripts de setup fornecidos para garantir um ambiente consistente. As pastas `node_modules` não estão incluídas no repositório e serão geradas ao executar `npm install`.

### Pré-requisitos
- Node.js 18+ instalado
- Expo CLI instalado globalmente
- Docker e Docker Compose (para ambiente de desenvolvimento completo)

### Setup Inicial (Recomendado)

Para um setup completo do ambiente de desenvolvimento (backend, frontend e banco de dados), execute o script `setup.sh` na raiz do projeto:

```bash
./setup.sh
```

Este script irá:
- Instalar as dependências do backend e frontend.
- Configurar o banco de dados SQLite (ou PostgreSQL via Docker, se configurado).
- Preparar o ambiente para execução.

### Execução Manual

#### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configure as variáveis de ambiente (JWT_SECRET, SQLITE_DB_PATH) de acordo com suas necessidades
npm run dev
```

#### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npx expo start
```

### Gerar APK
```bash
cd frontend
eas login
eas build --platform android --profile preview
```
```

## 🧪 Testes

### Backend
```bash
cd backend
npm test                    # Todos os testes
npm run test:watch         # Modo watch
npm run test:coverage      # Com cobertura
```

### Frontend
```bash
cd frontend
npm test                   # Todos os testes
npm run test:watch        # Modo watch
```

### Status Atual dos Testes

Recentemente, foram realizadas diversas correções no backend para resolver problemas de compilação (erros TS7030), gerenciamento de conexão com o banco de dados em ambiente de teste e inicialização do servidor Express. Essas correções visam estabilizar o ambiente de testes e permitir a execução completa dos testes automatizados.

**Observações:**
- O arquivo `src/__tests__/controllers/vehiclesController.test.ts` foi ajustado para corrigir importações duplicadas e garantir o fechamento adequado da conexão com o banco de dados após os testes.
- As configurações do Jest (`jest.config.js`) foram modificadas para desabilitar `detectOpenHandles` e `forceExit`, prevenindo travamentos durante a execução dos testes.
- A inicialização do servidor Express (`src/app.ts`) foi condicionada ao ambiente de teste, e a instância do servidor agora é exportada e fechada programaticamente no `src/tests/setup.ts`.
- O banco de dados SQLite em memória (`:memory:`) está sendo utilizado para isolar as execuções de teste.

**Próximos Passos:**
Recomenda-se executar `npm test` no diretório `backend` para validar todas as correções e verificar o status atual de todos os testes. Quaisquer falhas restantes devem ser investigadas e priorizadas para correção.



## 📱 Instalação do APK

1. **Gere o APK** usando EAS Build (veja instruções acima)
2. **Baixe o APK** do link fornecido pelo Expo
3. **Habilite "Fontes desconhecidas"** nas configurações do Android
4. **Instale o APK** no dispositivo
5. **Configure a URL do backend** se necessário

## 🎯 Roadmap

### ✅ Versão 1.0 (Atual)
- [x] Funcionalidades básicas completas
- [x] Dashboard visual com gráficos
- [x] Onboarding interativo
- [x] Testes automatizados expandidos
- [x] Configuração para build APK

### 🔄 Versão 1.1 (Próxima)
- [ ] Modo offline com sincronização
- [ ] Notificações push
- [ ] Backup automático na nuvem
- [ ] Integração com APIs de combustível
- [ ] Sistema de metas e conquistas

### 🚀 Versão 2.0 (Futuro)
- [ ] Funcionalidade de mentoria
- [ ] Comunidade de motoristas
- [ ] IA para otimização de rotas
- [ ] Integração bancária
- [ ] Marketplace de serviços

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código
- Use **TypeScript** em todos os arquivos
- Siga as configurações do **ESLint** e **Prettier**
- Escreva **testes** para novas funcionalidades
- Mantenha **cobertura de testes** acima de 80%

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Desenvolvedor Principal:** Manus AI
- **Arquitetura:** Full-stack TypeScript
- **Design UX/UI:** Interface nativa otimizada
- **Testes:** Cobertura automatizada abrangente

## 📞 Suporte

- **Documentação:** Veja a pasta `/docs` para guias detalhados
- **Issues:** Use o sistema de issues do GitHub
- **Discussões:** Use as discussões do GitHub para perguntas

---

**Desenvolvido com ❤️ para a comunidade de motoristas de aplicativo**

*Última atualização: 8 de Março de 2025*




## 🔒 Padrões e Padronização

Para garantir a consistência e a manutenibilidade do projeto GiroPro, as seguintes diretrizes e tecnologias são consideradas **padrões obrigatórios** e não devem ser alteradas sem uma revisão e aprovação formal da arquitetura do sistema. O objetivo é evitar um "loop infinito" de modificações infundadas e garantir a estabilidade e a escalabilidade do projeto.

### ⚙️ Tecnologias Chave (Não Alteráveis sem Aprovação Formal)

- **Backend:**
  - **Linguagem:** Node.js com TypeScript (versão 18+)
  - **Framework Web:** Express.js
  - **ORM:** Drizzle ORM
  - **Banco de Dados:** SQLite (para desenvolvimento e produção inicial, com possibilidade de migração para PostgreSQL em fases futuras, mas apenas com aprovação formal e plano de migração detalhado).
  - **Autenticação:** JWT (JSON Web Tokens)
  - **Testes:** Jest

- **Frontend:**
  - **Framework:** React Native com Expo
  - **Linguagem:** TypeScript
  - **Navegação:** React Navigation
  - **Gráficos:** React Native Chart Kit
  - **Ícones:** Expo Vector Icons
  - **Testes:** Jest e Testing Library

- **DevOps:**
  - **Build:** EAS Build (para APK/IPA)
  - **Containerização:** Docker
  - **CI/CD:** GitHub Actions (configuração futura, mas a ferramenta é padrão)

### 📏 Padrões de Código e Qualidade

- **Tipagem:** Uso obrigatório de TypeScript em todo o código (backend e frontend).
- **Estilo de Código:** Seguir rigorosamente as configurações de ESLint e Prettier definidas no projeto.
- **Testes:** Cobertura de testes automatizados mínima de 80% para novas funcionalidades e correções.
- **Documentação:** Manter a documentação atualizada e detalhada, especialmente para APIs, modelos de dados e lógica de negócio.

### 🏛️ Arquitetura de Banco de Dados e Modelos de Dados

Os modelos de dados definidos em `🚀DetalhamentodeAPIseModelosdeDadosdoGiroPro.md` são a fonte da verdade para a estrutura do banco de dados. Qualquer alteração na estrutura de tabelas, colunas, tipos de dados ou relacionamentos deve ser precedida por uma proposta formal e aprovada pela equipe de arquitetura.

- **Convenções de Nomenclatura:**
  - Tabelas: snake_case (ex: `usuarios`, `jornadas`)
  - Colunas: snake_case (ex: `id_usuario`, `ganho_bruto`)
  - Chaves Primárias: `id` (UUID)
  - Chaves Estrangeiras: `id_<nome_tabela_referenciada>`
- **Tipos de Dados:** Respeitar os tipos de dados definidos no Drizzle ORM e no esquema do banco de dados (ex: `text` para UUIDs, `integer` para valores monetários em centavos, `text` para datas ISO 8601).
- **Soft Delete:** Implementação de `deleted_at` para soft delete em todas as tabelas relevantes.

### 🌐 Padrões de API

- **Estilo:** RESTful
- **Formato de Dados:** JSON
- **Versionamento:** `/api/v1/` (para permitir futuras evoluções)
- **Autenticação:** JWT (Bearer Token)
- **Tratamento de Erros:** Respostas padronizadas com códigos de status HTTP apropriados e mensagens de erro claras.

---

*Esta seção foi adicionada para formalizar os padrões e garantir a consistência do projeto. Última atualização: 8 de Março de 2025*

