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
├── src/
│   ├── components/     # Componentes reutilizáveis (inclui ui/)
│   │   └── ui/         # Componentes de UI (Button, Card, Input, etc.)
│   ├── contexts/       # Contextos (AuthContext.tsx)
│   ├── styles/         # Sistema de Design (designSystem.ts)
│   ├── utils/          # Utilitários (apiErrorHandler.ts)
│   └── App.tsx         # Componente raiz da aplicação web
├── web-app-improved.tsx # Ponto de entrada da aplicação web
├── index.html          # Arquivo HTML principal
├── public/             # Arquivos públicos (manifest.json)
├── .env.development    # Variáveis de ambiente de desenvolvimento
├── .env.production     # Variáveis de ambiente de produção
└── package.json        # Dependências
```

**Status Atual:** Aplicação web funcional com roteamento, telas de Veículos, Despesas e Abastecimentos, tratamento de erros e sistema de design. PWA configurado.

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

### **1. Nova Tela (Frontend React/TypeScript):**
```typescript
// 1. Criar arquivo em frontend/src/components/ ou frontend/src/screens/
// Ex: frontend/src/components/NovaTela.tsx
import React from 'react';
import { Card, Button, typography, spacing, colors } from './ui'; // Importar componentes do Design System

interface NovaTelaProps {
  onBack?: () => void;
}

const NovaTela: React.FC<NovaTelaProps> = ({ onBack }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.neutral.background,
      padding: spacing.xl
    }}>
      <Card style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: typography.fontSize['3xl'], color: colors.primary.main }}>Nova Tela</h1>
        <p style={{ color: colors.neutral.text.primary }}>Conteúdo da nova tela aqui.</p>
        {onBack && <Button variant="secondary" onClick={onBack}>Voltar</Button>}
      </Card>
    </div>
  );
};

export default NovaTela;

// 2. Adicionar rota em web-app-improved.tsx
// Importar o componente
// import NovaTela from './src/components/NovaTela';

// Adicionar a rota dentro de <Routes>
// <Route path="/nova-tela" element={<NovaTela onBack={() => navigate(-1)} />} />

// 3. Adicionar botão de navegação no Dashboard (opcional)
// <Button variant="primary" onClick={() => navigate("/nova-tela")}>Nova Tela</Button>
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
npm run db:migrate
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

### **Testes via Interface:**
1. Acesse http://localhost:19006/elegant-login.html
2. Preencha os campos de registro
3. Clique em "Registrar"
4. Teste o login com as credenciais criadas

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
npm cache clean --force
rm -rf node_modules package-lock.json

# 2. Reinstalar com versões compatíveis
npm install --legacy-peer-deps

# 3. Testar build
npx expo start --web
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
cd backend && rm -rf node_modules && npm install
```

### **Frontend com tela branca:**
```bash
# Usar a versão HTML diretamente
http://localhost:19006/elegant-login.html

# Verificar console do navegador (F12)
# Reinstalar dependências
cd frontend && npm install --legacy-peer-deps
```

### **Erro de CORS:**
```javascript
// Adicionar no backend (já configurado)
app.use(cors({
  origin: ['http://localhost:19006', 'http://localhost:3000'],
  credentials: true
}));
```

---

**Guia criado em:** 05 de Setembro de 2025  
**Última atualização:** 20 de Setembro de 2025  
**Versão:** 1.1  
**Próxima atualização:** Após implementação de novas funcionalidades

