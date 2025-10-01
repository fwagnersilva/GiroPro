# 🛠️ GiroPro - Guia de Desenvolvimento

Para um setup completo do ambiente de desenvolvimento, consulte o [Guia de Setup Completo](docs/01_tutoriais/01_setup_completo.md).

---

## 📁 **Estrutura do Projeto**

### **Backend (`/backend`):**
```
backend/
├── src/
│   ├── controllers/     # Controladores das APIs
│   ├── db/             # Configuração do banco
│   ├── utils/          # Utilitários e validações
│   └── app.ts          # Aplicação principal
├── .env                # Variáveis de ambiente
├── giropro.db          # Banco SQLite
└── package.json        # Dependências
```

### **Frontend (`/frontend`):**
```
frontend/
├── app/                # Estrutura de roteamento Expo Router
│   ├── (auth)/         # Rotas protegidas (Dashboard, Jornadas, etc.)
│   │   ├── _layout.tsx # Layout para rotas autenticadas (inclui Drawer Navigation)
│   │   ├── dashboard.tsx # Tela principal após login
│   │   ├── jornadas.tsx # Tela de Jornadas
│   │   ├── abastecimentos.tsx # Tela de Abastecimentos
│   │   ├── despesas.tsx # Tela de Despesas
│   │   ├── vehicles.tsx # Tela de Veículos
│   │   └── settings/   # Grupo de rotas para configurações
│   │       ├── _layout.tsx # Layout para rotas de configurações
│   │       ├── index.tsx # Redirecionamento para Perfil
│   │       ├── perfil.tsx # Tela de Perfil
│   │       ├── style.tsx # Tela de Estilo
│   │       └── cadastro-plataformas.tsx # Tela de Cadastro de Plataformas
│   ├── index.tsx       # Redirecionamento inicial para login
│   └── login.tsx       # Tela de Login
├── src/
│   ├── components/     # Componentes reutilizáveis (inclui ui/)
│   │   ├── ToastNotification/ # Componente de notificação
│   │   └── ui/         # Componentes de UI (Button, Card, Input, etc.)
│   ├── contexts/       # Contextos (AuthContext.tsx)
│   ├── hooks/          # Hooks personalizados (useAuth, useVehicleService)
│   ├── services/       # Chamadas de API (authService.ts, vehicleService.ts)
│   ├── styles/         # Sistema de Design (designSystem.ts)
│   ├── utils/          # Utilitários (apiErrorHandler.ts)
│   └── App.tsx         # Componente raiz da aplicação web (se aplicável)
├── assets/             # Ativos da aplicação (ícones, imagens)
├── public/             # Arquivos públicos (favicon, manifest.json)
├── .env.development    # Variáveis de ambiente de desenvolvimento
├── .env.production     # Variáveis de ambiente de produção
├── app.config.ts       # Configuração do Expo
├── babel.config.js     # Configuração do Babel
├── package.json        # Dependências e scripts
└── pnpm-lock.yaml      # Lockfile do pnpm
```

**Status Atual:** Aplicação web funcional com roteamento `expo-router`, telas de Dashboard, Jornadas, Abastecimentos, Despesas, Veículos e um menu de Configurações aninhado (Perfil, Style, Cadastro de Plataformas). Implementado sistema de `ToastNotification` e integração com `AuthContext` e `vehicleService`. PWA configurado.

---

## 🚀 **Instalação e Inicialização do Sistema**

### **Pré-requisitos:**
*   Node.js (versão 18 ou superior)
*   pnpm (gerenciador de pacotes)
*   Git

### **1. Clonar o Repositório:**
```bash
git clone https://github.com/fwagnersilva/GiroPro.git
cd GiroPro
```

### **2. Configurar o Backend:**
```bash
cd backend
pnpm install
cp .env.example .env # Se existir um .env.example
# Edite o arquivo .env com suas configurações (ex: JWT_SECRET, DB_PATH, PORT)
pnpm start
```
O backend será iniciado na porta configurada (padrão: 3000).

### **3. Configurar e Iniciar o Frontend:**
```bash
cd ../frontend
pnpm install
cp .env.development.example .env.development # Se existir um .env.development.example
# Edite o arquivo .env.development com suas configurações (ex: API_URL, SECRET_KEY)
pnpm exec cross-env APP_ENV=development expo start --web
```
O frontend será iniciado e acessível via navegador (geralmente em `http://localhost:8081`).

**Nota:** O projeto frontend utiliza `expo-router` e `React Native Web`, o que permite o desenvolvimento multiplataforma. As variáveis de ambiente são gerenciadas via `cross-env` e arquivos `.env.<APP_ENV>`.

---

## 🎨 **Padrões de Design**

### **Cores Principais:**
```css
/* Paleta GiroPro */
--primary: #007AFF;           /* Azul principal */
--gradient-start: #667eea;    /* Início do gradiente */
--gradient-end: #764ba2;      /* Fim do gradiente */
--background: #F2F2F7;        /* Fundo claro */
--text: #333333;              /* Texto escuro */
--text-light: #8E8E93;        /* Texto claro */
--error: #FF3B30;             /* Erro */
--success: #34C759;           /* Sucesso */
```

### **Tipografia:**
```css
/* Fontes do sistema */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Tamanhos */
--title: 36px;      /* Títulos principais */
--subtitle: 18px;   /* Subtítulos */
--body: 16px;       /* Texto normal */
--small: 14px;      /* Texto pequeno */
--tiny: 12px;       /* Texto muito pequeno */
```

### **Espaçamentos:**
```css
/* Sistema de espaçamento 8px */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-xxl: 48px;
```

---

## 🔧 **APIs Disponíveis**

Para a documentação completa das APIs, consulte:

- [Documentação da API](docs/04_referencias/02_api_documentation.md)
- [API Endpoints](docs/04_referencias/02_api_endpoints.md)

---

## 🎯 **Como Adicionar Novas Funcionalidades**

### **1. Nova Tela (Frontend Expo Router / React Native Web):**
```typescript
// 1. Criar arquivo de tela em frontend/app/(auth)/ ou em um subdiretório apropriado
// Ex: frontend/app/(auth)/minha-nova-tela.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const MinhaNovaTelaScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Nova Tela</Text>
      <Text style={styles.text}>Conteúdo da minha nova tela aqui.</Text>
      <Link href="/dashboard" style={styles.link}>Voltar para o Dashboard</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default MinhaNovaTelaScreen;

// 2. Adicionar a rota no layout apropriado (ex: frontend/app/(auth)/_layout.tsx)
// <Drawer.Screen name="minha-nova-tela" options={{ headerShown: false, title: 'Minha Nova Tela' }} />

// 3. Adicionar um item de navegação no menu lateral (CustomDrawerContent em _layout.tsx)
// <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('minha-nova-tela')}>
//   <Text style={styles.drawerItemText}>Minha Nova Tela</Text>
// </TouchableOpacity>
```

### **2. Nova API (Backend):**
```typescript
// 1. Criar controller em src/controllers/
export const novaFuncao = async (req: Request, res: Response) => {
  try {
    // Lógica da função
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Adicionar rota em src/app.ts
app.post('/api/v1/nova-rota', novaFuncao);
```

### **3. Nova Tabela (Banco):**
```typescript
// 1. Definir schema em src/db/schema.ts
export const novaTabela = sqliteTable('nova_tabela', {
  id: text('id').primaryKey(),
  campo: text('campo').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 2. Executar migração
pnpm run db:migrate
```

---

## 🧪 **Como Testar**

### **Testes Manuais:**
```bash
# 1. Testar Backend
curl http://localhost:3000/health

# 2. Testar Registro
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@exemplo.com","senha":"Teste123!"}'

# 3. Testar Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","senha":"Teste123!"}'
```

### **Testes via Interface (Frontend):**
1.  Certifique-se de que o backend e o frontend estão rodando.
2.  Acesse `http://localhost:8081` no seu navegador.
3.  Na tela de login, você pode usar as credenciais de teste (ex: `test@example.com` / `password123`) ou registrar um novo usuário se a funcionalidade estiver disponível.
4.  Navegue pelas telas usando o menu lateral para verificar as funcionalidades.

---

## 🚀 **Deploy e Produção**

### **Backend (Recomendações):**
- **Heroku:** Para deploy rápido
- **Vercel:** Para APIs serverless
- **DigitalOcean:** Para VPS tradicional
- **Railway:** Para deploy moderno

### **Frontend (Recomendações):**
- **Vercel:** Deploy automático via Git
- **Netlify:** Hospedagem estática
- **GitHub Pages:** Para projetos open source
- **Surge.sh:** Deploy rápido via CLI

### **Banco de Dados:**
- **Desenvolvimento:** SQLite (atual)
- **Produção:** PostgreSQL ou MySQL
- **Cloud:** Supabase, PlanetScale, ou Neon

---

## 🔒 **Segurança**

### **Variáveis de Ambiente:**
```bash
# backend/.env
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
DB_PATH=./giropro.db
PORT=3000
```

### **Validações:**
- ✅ Email válido obrigatório
- ✅ Senha mínima: 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
- ✅ Sanitização de inputs
- ✅ Rate limiting (recomendado para produção)

---

## 📱 **Preparação para Mobile**

### **Quando Resolver Dependências React Native:**
```bash
# 1. Limpar cache
pnpm cache clean --force
rm -rf node_modules pnpm-lock.yaml

# 2. Reinstalar com versões compatíveis
pnpm install

# 3. Testar build
pnpm exec expo start --web
```

### **Estrutura Mobile Futura:**
```
src/
├── screens/           # Telas do app
├── components/        # Componentes reutilizáveis
├── contexts/          # Context API (AuthContext, etc.)
├── services/          # Chamadas de API
├── utils/             # Utilitários
└── types/             # Tipos TypeScript
```

---

## 🎯 **Próximos Passos Sugeridos**

### **Curto Prazo (1-2 semanas):**
1. **Tela de Registro:** Criar elegant-register.html
2. **Dashboard:** Tela principal pós-login
3. **Navegação:** Sistema de rotas entre telas
4. **Validações:** Melhorar feedback de erros

### **Médio Prazo (3-4 semanas):**
1. **PWA:** Service Worker e manifest
2. **Offline:** Cache e sincronização
3. **Notificações:** Push notifications
4. **Performance:** Otimizações de carregamento

### **Longo Prazo (1-2 meses):**
1. **Mobile Nativo:** Resolver React Native
2. **Lojas:** Publicar Android/iOS
3. **Analytics:** Métricas de uso
4. **Monetização:** Planos e pagamentos

---

## 🆘 **Solução de Problemas**

### **Backend não inicia:**
```bash
# Verificar se a porta 3000 está livre
lsof -i :3000

# Verificar arquivo .env
ls -la backend/.env

# Reinstalar dependências
cd backend && rm -rf node_modules && pnpm install
```

### **Frontend com tela branca ou erros de inicialização:**
```bash
# Verificar console do navegador (F12) para erros específicos.
# Limpar cache e reinstalar dependências do frontend:
cd frontend && pnpm cache clean --force && rm -rf node_modules pnpm-lock.yaml && pnpm install
# Tentar iniciar novamente:
pnpm exec cross-env APP_ENV=development expo start --web
```

### **Erro de CORS:**
```javascript
// Adicionar no backend (já configurado)
app.use(cors({
  origin: ['http://localhost:19006', 'http://localhost:8081'], // Atualizado para porta padrão do Expo Web
  credentials: true
}));
```

---

**Guia criado em:** 05 de Setembro de 2025  
**Última atualização:** 30 de Setembro de 2025  
**Versão:** 1.2  
**Próxima atualização:** Após implementação de novas funcionalidades



---

## 🎯 **Funcionalidades Detalhadas**

Para uma descrição completa e detalhada das funcionalidades do sistema, incluindo backend e frontend, consulte:

- [Funcionalidades Detalhadas](docs/04_referencias/06_funcionalidades_detalhadas.md)

