# 🚀 GiroPro - LEIA PRIMEIRO

Este documento serve como um ponto de partida rápido para entender e configurar o projeto GiroPro. Para detalhes mais aprofundados, consulte os documentos específicos.

## ⚡ Configuração Rápida

Para um setup completo do ambiente de desenvolvimento, incluindo backend e frontend, por favor, consulte o [Guia de Setup Completo](./01_setup_completo.md).

## 🎯 DECISÃO ESTRATÉGICA - Banco de Dados

**IMPORTANTE:** Atualmente, o projeto utiliza um **banco de dados em memória** para o ambiente de desenvolvimento. Esta escolha visa otimizar a velocidade, garantir a limpeza automática a cada reinicialização, evitar conflitos de arquivos e facilitar os testes, proporcionando um banco de dados limpo para cada execução.

### Configuração Atual (.env)
```env
SQLITE_DB_PATH=:memory:
JWT_SECRET=minha_chave_secreta_super_segura_para_desenvolvimento
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### Migração Futura para SQLite Persistente
Quando for necessário persistir os dados em desenvolvimento, altere a configuração no arquivo `.env` para:
```env
SQLITE_DB_PATH=./giropro.db
```

## 📚 Documentação Essencial

Para uma visão geral da arquitetura e dos requisitos do sistema, consulte:

*   **Arquitetura Geral**: [Arquitetura Geral do Sistema](./01_arquitetura_geral.md)
*   **Requisitos do Sistema**: [Requisitos do Sistema](./02_requisitos_do_sistema.md)

## 🔗 URLs Importantes

*   **Backend Health**: `http://localhost:3000/health`
*   **Backend Test**: `http://localhost:3000/api/test`
*   **Frontend**: `http://localhost:19006`

---

**Última atualização**: 01/10/2025  
**Versão**: 1.1

