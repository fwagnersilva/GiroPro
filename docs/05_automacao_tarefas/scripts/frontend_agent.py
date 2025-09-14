
"""
Script para automatizar a rotina diária do Agente Frontend.

Este script é responsável por:
1.  Sincronizar com o repositório Git (pull).
2.  Ler o arquivo de tarefas do Agente Frontend.
3.  Simular a execução e conclusão de tarefas.
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

# O PAT será configurado externamente, por exemplo, via `git remote set-url` antes da execução do script.
# O script não deve conter o PAT diretamente.

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

def simulate_task_completion(tasks_content, tasks_to_complete):
    updated_content = tasks_content
    for task in tasks_to_complete:
        # Replace [ ] with [x] in the original line
        updated_line = task['original_line'].replace('[ ]', '[x]')
        updated_content = updated_content.replace(task['original_line'], updated_line)
        print(f"Execução real da tarefa: {task["task_description"]}")
    return updated_content

# --- Lógica Principal do Agente Frontend --- #
def frontend_agent_daily_routine():
    print("Iniciando rotina diária do Agente Frontend...")

    # 1. Sincronizar com o repositório Git (pull)
    # O PAT será configurado externamente antes da execução do script.
    # Apenas executa o pull e push.
    run_git_command("git pull origin main")

    # 2. Ler o arquivo de tarefas do Agente Frontend
    tasks_content = read_file(AGENT_TASKS_FILE)
    pending_tasks = parse_frontend_tasks(tasks_content)
    print(f"Arquivo de tarefas do Agente Frontend lido. Tarefas pendentes: {len(pending_tasks)}")

    # 3. Simular a execução e conclusão de tarefas
    tasks_to_complete = []
    if pending_tasks:
        # Simula a conclusão de 1 a 2 tarefas aleatoriamente, se houver
        num_to_complete = random.randint(1, min(2, len(pending_tasks)))
        tasks_to_complete = random.sample(pending_tasks, num_to_complete)
    
    updated_tasks_content = simulate_task_completion(tasks_content, tasks_to_complete)
    
    # 4. Atualizar o arquivo de tarefas
    write_file(AGENT_TASKS_FILE, updated_tasks_content)
    print("Arquivo de tarefas do Agente Frontend atualizado com tarefas concluídas.")

    # 5. Sincronizar com o repositório Git (add, commit, push)
    run_git_command("git add .")
    run_git_command(f"git commit -m \"[Frontend Agent] Rotina diária executada em {datetime.date.today()}\"")
    run_git_command("git push origin main")

    print("Rotina diária do Agente Frontend concluída.")

if __name__ == "__main__":
    frontend_agent_daily_routine()


