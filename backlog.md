# Backlog - Tela de Login

## Épico: Melhorias na Tela de Login

### História de Usuário: Como usuário, quero poder fazer login de forma segura e eficiente para acessar o sistema.

#### Tarefas:

1.  **Implementar funcionalidade "Esqueceu sua senha?"**
    *   **Microtarefas:**
        *   Criar rota de API para solicitação de recuperação de senha (backend).
        *   Implementar lógica de envio de e-mail com token de recuperação (backend).
        *   Criar interface de usuário para solicitação de e-mail de recuperação (frontend).
        *   Criar interface de usuário para redefinição de senha com token (frontend).
        *   Integrar frontend com a API de recuperação de senha.
        *   Adicionar validações de formulário para e-mail e nova senha.
        *   Testar fluxo completo de recuperação de senha.

2.  **Melhorar feedback de erro no login**
    *   **Microtarefas:**
        *   Exibir mensagens de erro mais específicas para credenciais inválidas (ex: "Email ou senha incorretos").
        *   Limpar campos de senha após tentativa de login falha.
        *   Adicionar validação de formato de e-mail no frontend.

3.  **Adicionar opção "Lembrar-me" (Remember Me)**
    *   **Microtarefas:**
        *   Implementar armazenamento seguro de token de autenticação (ex: AsyncStorage, LocalStorage) no frontend.
        *   Configurar API para aceitar token de "Lembrar-me" para sessões estendidas.
        *   Testar persistência do login após fechar e reabrir o aplicativo/navegador.

4.  **Otimização de Performance da Tela de Login**
    *   **Microtarefas:**
        *   Analisar e otimizar o tempo de carregamento da tela.
        *   Reduzir o tamanho dos bundles JavaScript, se aplicável.
        *   Garantir que animações sejam suaves.

5.  **Refatorar código da tela de login (se necessário)**
    *   **Microtarefas:**
        *   Revisar a estrutura do código para melhor legibilidade e manutenção.
        *   Garantir que os componentes estejam seguindo os padrões de design do projeto.
        *   Remover código duplicado ou não utilizado.

6.  **Adicionar testes unitários e de integração para a tela de login**
    *   **Microtarefas:**
        *   Escrever testes unitários para os componentes da UI.
        *   Escrever testes de integração para o fluxo de login e autenticação.
        *   Configurar ambiente de CI/CD para rodar os testes automaticamente.

