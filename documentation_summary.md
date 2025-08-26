## Resumo de Tecnologias e Dependências do Projeto GiroPro

### Backend

**Linguagem:** TypeScript, JavaScript

**Frameworks/Bibliotecas Principais:**
- Express.js
- Drizzle ORM
- Jest (para testes)
- TypeScript

**Dependências Notáveis:**
- `bcrypt`: Para hash de senhas.
- `compression`: Para compressão de respostas HTTP.
- `cors`: Para habilitar CORS.
- `date-fns`: Para manipulação de datas.
- `dotenv`: Para carregar variáveis de ambiente.
- `express-rate-limit`, `express-slow-down`: Para controle de taxa e lentidão.
- `helmet`: Para segurança de cabeçalhos HTTP.
- `ioredis`: Para Redis.
- `jsonwebtoken`: Para tokens JWT.
- `pg`: Driver PostgreSQL.
- `uuid`: Para geração de UUIDs.
- `zod`: Para validação de esquemas.

### Frontend

**Linguagem:** TypeScript, JavaScript

**Frameworks/Bibliotecas Principais:**
- React Native
- Expo
- React Navigation
- TanStack React Query
- Jest (para testes)

**Dependências Notáveis:**
- `@react-native-async-storage/async-storage`: Para armazenamento assíncrono.
- `@react-native-picker/picker`: Para componentes de seleção.
- `axios`: Para requisições HTTP.
- `expo-status-bar`: Para controle da barra de status.
- `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens`, `react-native-reanimated`: Para UI e navegação.

### Banco de Dados

- **PostgreSQL:** Utilizado como banco de dados relacional, conforme `docker-compose.yml`.

### Orquestração/Contêineres

- **Docker e Docker Compose:** Utilizados para orquestrar os serviços (backend e banco de dados).

### Requisitos de Ambiente

- **Node.js:** Necessário para executar tanto o backend (TypeScript/JavaScript) quanto o frontend (React Native/Expo).
- **npm/Yarn:** Gerenciadores de pacotes para as dependências Node.js.
- **Docker:** Necessário para rodar o banco de dados PostgreSQL e potencialmente o backend em contêineres.
- **Expo CLI:** Para desenvolvimento e execução do frontend React Native.


