import sys
import os
import subprocess as s

def run_projects(projects: list) -> None:
    """
    Function to run all project/some parts of it.

    Parameters:
        projects(list) - unique list with parameters that should be runned
    """
    cwd = os.path.dirname(__file__)
    
    python_path = os.path.join(cwd)
    os.environ['PYTHONPATH'] = python_path

    project_mapping = {
        'd': ["start", "cmd", "/k", "py", "app/discord/run.py"],
        't': ["start", "cmd", "/k", "py", "app/telegram/run.py"],
        'f': ["start", "cmd", "/k", "cd app/site/frontend && npm run dev"],
        'b': ["start", "cmd", "/k", "uvicorn app.site.backend.run:app --host localhost --port 4300 --reload"]
    }

    if projects:
        if 'site' in projects:
            projects.pop(projects.index('site'))
            projects += ['b', 'f']
        if 'bot' in projects:
            projects.pop(projects.index('bot'))
            projects += ['d', 't']
    else:
        projects = project_mapping.keys()

    for project in set(projects):
        s.Popen(
            project_mapping[project], shell=True, 
            cwd=cwd if project != "f" else None,
            stdin=s.PIPE, stdout=s.PIPE, stderr=s.PIPE
        )

if __name__ == "__main__":
    """
    Options:
        b - backend ; f - frontend ; t - telegram ; d - discord;
        site - backend and frontend ; bot - telegram and discord;
    
    Options should be entered in terminal, for instance:
        py main.py site
    
    if none of them are entered, then all possible options are run    
    """
    projects_to_run = sys.argv[1:]
    run_projects(list(set(projects_to_run)))
