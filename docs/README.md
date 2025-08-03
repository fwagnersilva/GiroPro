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
│   └── tsconfig.json
├── frontend/                # App React Native
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── screens/         # Telas do aplicativo
│   │   ├── services/        # Serviços de API
│   │   ├── contexts/        # Contextos React
│   │   └── __tests__/       # Testes de componentes
│   ├── app.json             # Configuração do Expo
│   ├── eas.json             # Configuração do EAS Build
│   └── package.json
├── docs/                    # Documentação
│   ├── API_DATA_MODELS.md
│   ├── CONTRIBUTING.md
│   ├── DEVELOPMENT_PRINCIPLES.md
│   ├── PRICING_STRATEGY.md
│   ├── ROADMAP.md
│   ├── SETUP_GUIDE.md
│   ├── TECHNICAL_SPECIFICATIONS.md
│   └── UX_IMPROVEMENTS.md
├── CODE_OF_CONDUCT.md
└── README.md
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- Expo CLI instalado globalmente

### Backend
- Node.js 18+ instalado
- SQLite3

```bash
cd backend
npm install
cp .env.example .env  # Configure as variáveis de ambiente (JWT_SECRET, SQLITE_DB_PATH)
npm run dev
```
### Frontend
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


