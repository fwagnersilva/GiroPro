
"""
Script para automatizar a rotina diária do Agente 41 (Scrum Master).

Este script é responsável por:
1.  Ler os arquivos de tarefas dos agentes.
2.  Analisar o status das tarefas (concluídas, bloqueadas, solicitações de ajuda).
3.  Quebrar novas demandas do backlog global em microtarefas.
4.  Distribuir microtarefas para os agentes apropriados.
5.  Gerenciar dependências de tarefas.
6.  Sincronizar o repositório Git (pull antes, add/commit/push depois).
7.  Gerar relatórios de progresso.
"""

import os
import re
import datetime
import subprocess

# --- Configurações --- #
REPO_PATH = "/home/ubuntu/GiroPro"
DOCS_PATH = os.path.join(REPO_PATH, "docs/05_automacao_tarefas")
BACKLOG_GLOBAL_PATH = os.path.join(DOCS_PATH, "backlog_global.md")
AGENTS_TASKS_DIR = os.path.join(DOCS_PATH, "tarefas_agentes")
COMMUNICATION_DIR = os.path.join(DOCS_PATH, "comunicacao")
DEPENDENCIES_PATH = os.path.join(COMMUNICATION_DIR, "dependencias_tarefas.md")
MESSAGES_PATH = os.path.join(COMMUNICATION_DIR, "mensagens_entre_agentes.md")

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

def append_file(file_path, content):
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(content)

def parse_backlog_global(content):
    new_demands = []
    current_section = None
    lines = content.splitlines()
    for i, line in enumerate(lines):
        if line.startswith("## Novas Demandas"): # This is the section we care about
            current_section = "new_demands"
            continue
        if current_section == "new_demands" and line.startswith("##"): # End of new demands section
            current_section = None
            break
        
        if current_section == "new_demands":
            match = re.match(r'^- \[ ] \*\*(P\d) - (.*?)\*\*', line)
            if match:
                priority = match.group(1)
                title = match.group(2).strip()
                description = ""
                # Look for description in subsequent lines
                for j in range(i + 1, len(lines)):
                    desc_match = re.match(r'^  - Descrição: (.*)', lines[j])
                    if desc_match:
                        description = desc_match.group(1).strip()
                        break
                new_demands.append({'priority': priority, 'title': title, 'description': description, 'line_index': i})
    return new_demands

def generate_microtasks(demand):
    # Esta é uma execução real de tarefas. Em um cenário real, um LLM seria usado para quebrar a tarefa.
    microtasks = []
    title = demand['title']
    description = demand['description']
    priority = demand['priority']

    if "Implementar funcionalidade de Adicionar Despesa Manualmente" in title:
        microtasks.append({'agent': 'backend', 'task': "Verificar/atualizar schema do banco de dados", 'priority': priority})
        microtasks.append({'agent': 'backend', 'task': "Criar rota POST /expenses", 'priority': priority})
        microtasks.append({'agent': 'backend', 'task': "Implementar ExpensesController", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Criar componente FormInput", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Criar tela AddExpenseScreen", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Implementar estado para o formulário", 'priority': priority})
        microtasks.append({'agent': 'testes', 'task': "Criar testes unitários para FormInput", 'priority': priority})
        microtasks.append({'agent': 'testes', 'task': "Criar testes de integração para o fluxo", 'priority': priority})
        microtasks.append({'agent': 'testes', 'task': "Criar testes E2E para o fluxo completo", 'priority': priority})
    elif "Corrigir renderização do Dashboard após login (Web)" in title:
        microtasks.append({'agent': 'frontend', 'task': "Investigar AuthProvider e useAuth hook", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Debug do fluxo React", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Verificar renderização condicional do componente Dashboard", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Implementar navegação entre estados após login", 'priority': priority})
    elif "Corrigir interatividade do formulário de login no frontend React (Web)" in title:
        microtasks.append({'agent': 'frontend', 'task': "Investigar problema de eventos JavaScript", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Testar versão HTML pura para isolar o problema", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Verificar se o Vite está compilando corretamente o TypeScript", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Debug do fluxo de eventos", 'priority': priority})
        microtasks.append({'agent': 'frontend', 'task': "Criar versão HTML pura funcional de login com JavaScript vanilla como fallback", 'priority': priority})
    # Adicionar mais casos para outras demandas conforme necessário
    else:
        print(f"Nenhuma regra de microtarefa definida para: {title}")
        microtasks.append({'agent': 'scrum_master', 'task': f"Definir microtarefas para '{title}'", 'priority': priority})
    return microtasks

def delegate_microtasks(microtasks):
    for microtask in microtasks:
        agent_type = microtask['agent']
        task_description = microtask['task']
        priority = microtask['priority']

        # Encontrar o arquivo de tarefas do agente correspondente
        # Por simplicidade, vamos usar um arquivo genérico por tipo de agente por enquanto
        # Em um cenário real, haveria um mapeamento mais complexo para agentes específicos (Agent_09, Agent_11, etc.)
        agent_task_file = os.path.join(AGENTS_TASKS_DIR, agent_type, f"agent_{agent_type}_tasks.md")
        
        # Criar o arquivo se não existir (com cabeçalho de aviso)
        if not os.path.exists(agent_task_file):
            write_file(agent_task_file, f"# Agente de {agent_type.capitalize()}: Tarefas\n\n<!-- ATENÇÃO: Não modifique ou remova este cabeçalho e a estrutura geral deste arquivo. Ele é essencial para o funcionamento do sistema. -->\n\n## Tarefas Adicionadas pelo Scrum Master\n\n")

        # Adicionar a microtarefa ao arquivo do agente
        append_file(agent_task_file, f"- [ ] **{priority} - {task_description}**\n")
        print(f"Delegada: {task_description} para Agente de {agent_type.capitalize()}")


# --- Lógica Principal do Scrum Master --- #
def scrum_master_daily_routine():
    print("Iniciando rotina diária do Scrum Master...")

    # 1. Sincronizar com o repositório Git (pull)
    run_git_command("git pull origin main")

    # 2. Ler o Backlog Global
    backlog_content = read_file(BACKLOG_GLOBAL_PATH)
    new_demands = parse_backlog_global(backlog_content)
    print(f"Backlog Global lido. Novas demandas identificadas: {len(new_demands)}")

    updated_backlog_content = backlog_content
    for demand in new_demands:
        print(f"  - {demand['priority']}: {demand['title']}")
        
        # Gerar microtarefas
        microtasks = generate_microtasks(demand)
        
        # Delegar microtarefas
        delegate_microtasks(microtasks)

        # Marcar a demanda principal como em andamento no backlog global
        original_line = f"- [ ] **{demand['priority']} - {demand['title']}**"
        updated_backlog_content = updated_backlog_content.replace(original_line, original_line.replace("[ ]", "[x]")) # Marca como concluída no backlog global
    
    # Escrever o backlog global atualizado
    write_file(BACKLOG_GLOBAL_PATH, updated_backlog_content)
    print("Backlog Global atualizado com status das demandas.")

    # 3. Analisar tarefas dos agentes (futuro)
    # Esta parte será implementada nas próximas fases.

    # 4. Sincronizar com o repositório Git (add, commit, push)
    run_git_command("git add .")
    run_git_command(f"git commit -m \"[Scrum Master] Rotina diária executada em {datetime.date.today()}\"")
    run_git_command("git push origin main")

    print("Rotina diária do Scrum Master concluída.")

if __name__ == "__main__":
    scrum_master_daily_routine()


