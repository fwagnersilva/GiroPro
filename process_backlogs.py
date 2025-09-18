
import re

def parse_task(task_block):
    task = {}
    lines = task_block.strip().split("\n")
    for line in lines:
        if line.startswith("- Tarefa:"):
            task["Tarefa"] = line.replace("- Tarefa:", "").strip()
        elif line.startswith("  - Quem:"):
            task["Quem"] = line.replace("  - Quem:", "").strip()
        elif line.startswith("  - O que:"):
            task["O que"] = line.replace("  - O que:", "").strip()
        elif line.startswith("  - Porquê:"):
            task["Porquê"] = line.replace("  - Porquê:", "").strip()
        elif line.startswith("  - Complexidade:"):
            task["Complexidade"] = line.replace("  - Complexidade:", "").strip()
        elif line.startswith("  - Concluído:"):
            task["Concluído"] = line.replace("  - Concluído:", "").strip()
        elif line.startswith("  - Como foi feita:"):
            task["Como foi feita"] = line.replace("  - Como foi feita:", "").strip()
        elif line.startswith("  - Hash do Commit:"):
            task["Hash do Commit"] = line.replace("  - Hash do Commit:", "").strip()
        elif line.startswith("  - Arquivos modificados:"):
            task["Arquivos modificados"] = line.replace("  - Arquivos modificados:", "").strip()
        elif line.startswith("  - Observações:"):
            task["Observações"] = line.replace("  - Observações:", "").strip()
    return task

def format_task(task):
    formatted_task = f"- Tarefa: {task.get('Tarefa', '')}\n"
    formatted_task += f"  - Quem: {task.get('Quem', '')}\n"
    formatted_task += f"  - O que: {task.get('O que', '')}\n"
    formatted_task += f"  - Porquê: {task.get('Porquê', '')}\n"
    formatted_task += f"  - Complexidade: {task.get('Complexidade', '')}\n"
    formatted_task += f"  - Concluído: {task.get('Concluído', '[ ]')}\n"
    if 'Como foi feita' in task:
        formatted_task += f"  - Como foi feita: {task.get('Como foi feita', '')}\n"
    if 'Hash do Commit' in task:
        formatted_task += f"  - Hash do Commit: {task.get('Hash do Commit', '')}\n"
    if 'Arquivos modificados' in task:
        formatted_task += f"  - Arquivos modificados: {task.get('Arquivos modificados', '')}\n"
    if 'Observações' in task:
        formatted_task += f"  - Observações: {task.get('Observações', '')}\n"
    return formatted_task

def process_backlog_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    tasks_content = re.split(r"\n(?=- Tarefa:)", content)
    header = tasks_content[0]
    tasks_blocks = tasks_content[1:]

    completed_tasks = []
    pending_tasks_content = header

    for block in tasks_blocks:
        task = parse_task(block)
        if task.get("Concluído") == "[x]":
            completed_tasks.append(task)
        else:
            pending_tasks_content += "\n" + block
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(pending_tasks_content.strip())
    
    return completed_tasks

def main():
    global_backlog_path = "docs/05_automacao_tarefas/04_tarefas_agentes/backlog_global.md"
    frontend_backlog_path = "docs/05_automacao_tarefas/04_tarefas_agentes/backlog_frontend.md"
    backend_backlog_path = "docs/05_automacao_tarefas/04_tarefas_agentes/backlog_backend.md"

    # Processar backlogs de frontend e backend
    completed_frontend_tasks = process_backlog_file(frontend_backlog_path)
    completed_backend_tasks = process_backlog_file(backend_backlog_path)

    all_completed_tasks = completed_frontend_tasks + completed_backend_tasks

    # Ler backlog global
    with open(global_backlog_path, "r", encoding="utf-8") as f:
        global_content = f.read()

    global_sections = re.split(r"\n## ", global_content)
    new_tasks_section = ""
    completed_demands_section = ""
    header = global_sections[0]

    for section in global_sections[1:]:
        if section.startswith("Novas Tarefas"):
            new_tasks_section = "## " + section
        elif section.startswith("Demandas Concluídas"):
            completed_demands_section = "## " + section

    # Adicionar tarefas concluídas ao backlog global
    for task in all_completed_tasks:
        if task.get("Hash do Commit") and task.get("Hash do Commit") != "[PENDENTE]" and task.get("Hash do Commit") != "[SIMULATED_HASH_1]" and task.get("Hash do Commit") != "[SIMULATED_HASH_2]":
            completed_demands_section += "\n\n" + format_task(task)
        else:
            # Mover de volta para o backlog original como pendente de checagem
            if task.get("Quem") == "Frontend":
                with open(frontend_backlog_path, "a", encoding="utf-8") as f:
                    f.write("\n" + format_task(task).replace("[x]", "[ ]"))
            elif task.get("Quem") == "Backend":
                with open(backend_backlog_path, "a", encoding="utf-8") as f:
                    f.write("\n" + format_task(task).replace("[x]", "[ ]"))

    # Reconstruir backlog global
    updated_global_content = header.strip() + "\n\n" + new_tasks_section.strip() + "\n\n" + completed_demands_section.strip()
    
    with open(global_backlog_path, "w", encoding="utf-8") as f:
        f.write(updated_global_content)

    print("Processamento de backlogs concluído.")

if __name__ == "__main__":
    main()


