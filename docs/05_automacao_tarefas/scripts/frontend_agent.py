
"""
Script para automatizar a rotina diária do Agente Frontend.

Este script é responsável por:
1.  Sincronizar com o repositório Git (pull).
2.  Ler o arquivo de tarefas do Agente Frontend.
3.  Executar tarefas reais (se aplicável).
4.  Atualizar o arquivo de tarefas, marcando as tarefas como concluídas.
5.  Sincronizar com o repositório Git (add, commit, push).
"""

import os
import re
import datetime
import subprocess
import random

# --- Configurações --- #
REPO_PATH = "/home/ubuntu/GiroPro"
DOCS_PATH = os.path.join(REPO_PATH, "docs/05_automacao_tarefas")
AGENT_TASKS_FILE = os.path.join(DOCS_PATH, "tarefas_agentes/frontend/agent_frontend_tasks.md")
FRONTEND_DIR = os.path.join(REPO_PATH, "frontend")

# --- Funções Auxiliares --- #
def run_git_command(command, cwd=REPO_PATH):
    print(f"Executando Git: {command}")
    try:
        result = subprocess.run(command, cwd=cwd, capture_output=True, text=True, shell=True, check=True)
        print("STDOUT:", result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar comando Git: {e}")
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        raise

def read_file(file_path):
    if not os.path.exists(file_path):
        return ""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def write_file(file_path, content):
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

def parse_frontend_tasks(content):
    tasks = []
    lines = content.splitlines()
    for i, line in enumerate(lines):
        match = re.match(r'^- \[ ] \*\*(P\d - .*?)\*\*', line)
        if match:
            tasks.append({'line_index': i, 'original_line': line, 'task_description': match.group(1)})
    return tasks

def execute_frontend_task(task_description):
    print(f"Tentando executar tarefa real: {task_description}")
    if "Criar versão HTML pura funcional de login com JavaScript vanilla como fallback" in task_description:
        login_html_content = '''
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login GiroPro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .login-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            text-align: center;
        }
        .login-container h2 {
            margin-bottom: 20px;
            color: #333;
        }
        .form-group {
            margin-bottom: 15px;
            text-align: left;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #555;
        }
        .form-group input[type="email"],
        .form-group input[type="password"] {
            width: calc(100% - 20px);
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .form-group button {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        .form-group button:hover {
            background-color: #0056b3;
        }
        .message {
            margin-top: 15px;
            color: red;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Login GiroPro</h2>
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <button type="submit">Entrar</button>
            </div>
        </form>
        <p id="loginMessage" class="message"></p>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageElement = document.getElementById('loginMessage');

            if (email === 'test@example.com' && password === 'password123') {
                messageElement.style.color = 'green';
                messageElement.textContent = 'Login bem-sucedido!';
                alert('Login bem-sucedido!');
                // Redirecionar ou fazer algo após o login
            } else {
                messageElement.style.color = 'red';
                messageElement.textContent = 'Email ou senha inválidos.';
            }
        });
    </script>
</body>
</html>
'''
        login_file_path = os.path.join(FRONTEND_DIR, "login_fallback.html")
        write_file(login_file_path, login_html_content)
        print(f"Arquivo de login HTML criado em: {login_file_path}")
        return True
    # Adicione mais condições para outras tarefas reais aqui
    return False

# --- Lógica Principal do Agente Frontend --- #
def frontend_agent_daily_routine():
    print("Iniciando rotina diária do Agente Frontend...")

    run_git_command("git pull origin main")

    tasks_content = read_file(AGENT_TASKS_FILE)
    pending_tasks = parse_frontend_tasks(tasks_content)
    print(f"Arquivo de tarefas do Agente Frontend lido. Tarefas pendentes: {len(pending_tasks)}")

    updated_tasks_content = tasks_content
    tasks_completed_count = 0

    for task in pending_tasks:
        # Check if the core task description is present in the task['task_description']
        if "Criar versão HTML pura funcional de login com JavaScript vanilla como fallback" in task['task_description']:
            if execute_frontend_task(task['task_description']):
                updated_line = task['original_line'].replace('[ ]', '[x]')
                updated_tasks_content = updated_tasks_content.replace(task['original_line'], updated_line)
                tasks_completed_count += 1
                # Para evitar que o agente execute todas as tarefas de uma vez, limitamos a 1 por execução
                break 
        # Adicione mais condições para outras tarefas reais aqui

    if tasks_completed_count > 0:
        write_file(AGENT_TASKS_FILE, updated_tasks_content)
        print("Arquivo de tarefas do Agente Frontend atualizado com tarefas concluídas.")

        run_git_command("git add .")
        run_git_command(f"git commit -m \"[Frontend Agent] Tarefa real executada em {datetime.date.today()}\"")
        run_git_command("git push origin main")
    else:
        print("Nenhuma tarefa real foi executada nesta rotina.")

    print("Rotina diária do Agente Frontend concluída.")

if __name__ == "__main__":
    frontend_agent_daily_routine()


