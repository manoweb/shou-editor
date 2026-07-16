#!/usr/bin/env python3
"""
sync-memory-init.py
Hook SessionStart: sincroniza .claude/memory/ entre proyecto y harness.

Descubrimiento del harness leyendo sessions-index.json -> originalPath,
que es el path del proyecto tal como lo registra Claude Code. Universal,
funciona en cualquier maquina y OS sin depender de re-calcular el encoding.

Sincronizacion bidireccional por mtime: el archivo mas reciente gana.
Nunca borra archivos.
"""
import json
import os
import re
import shutil
import sys


def find_harness_memory(project_root: str) -> str | None:
    """
    Busca el directorio memory/ del harness en dos pasos:
    1. Lee sessions-index.json -> originalPath (fiable, universal).
    2. Fallback: encoding calculado, para primera sesion en maquina nueva.
    """
    projects_base = os.path.join(os.path.expanduser("~"), ".claude", "projects")
    if not os.path.isdir(projects_base):
        return None

    # Estrategia 1: sessions-index.json -> originalPath
    norm = os.path.normcase(os.path.normpath(project_root))
    for entry in os.scandir(projects_base):
        if not entry.is_dir():
            continue
        si = os.path.join(entry.path, "sessions-index.json")
        if not os.path.isfile(si):
            continue
        try:
            with open(si) as f:
                data = json.load(f)
            original = os.path.normcase(os.path.normpath(data.get("originalPath", "")))
            if original == norm:
                return os.path.join(entry.path, "memory")
        except Exception:
            continue

    # Estrategia 2: encoding (primera sesion, sin historial aun)
    encoded = _encode(project_root)
    return os.path.join(projects_base, encoded, "memory")


def _encode(p: str) -> str:
    """Replica el encoding que usa Claude Code para nombrar el directorio del proyecto."""
    p = re.sub(r"^/([a-zA-Z])/", lambda m: m.group(1).lower() + ":/", p)
    p = p.replace("\\", "/")
    p = re.sub(r"^([A-Za-z]):", lambda m: m.group(1).lower() + ":", p)
    return re.sub(r"[/:._]", "-", p)


def get_all_files(base: str) -> dict[str, float]:
    """Devuelve {ruta_relativa: mtime} para todos los archivos bajo base."""
    result = {}
    if not os.path.isdir(base):
        return result
    for root, dirs, files in os.walk(base):
        for fname in files:
            full = os.path.join(root, fname)
            rel = os.path.relpath(full, base)
            try:
                result[rel] = os.path.getmtime(full)
            except OSError:
                pass
    return result


def sync_bidirectional(dir_a: str, dir_b: str) -> None:
    """Sincroniza dos directorios. El archivo mas reciente gana."""
    files_a = get_all_files(dir_a)
    files_b = get_all_files(dir_b)
    all_files = set(files_a.keys()) | set(files_b.keys())

    for rel in all_files:
        path_a = os.path.join(dir_a, rel)
        path_b = os.path.join(dir_b, rel)
        mtime_a = files_a.get(rel)
        mtime_b = files_b.get(rel)

        try:
            if mtime_a is None:
                # Solo existe en B -> copiar a A
                os.makedirs(os.path.dirname(path_a), exist_ok=True)
                shutil.copy2(path_b, path_a)
            elif mtime_b is None:
                # Solo existe en A -> copiar a B
                os.makedirs(os.path.dirname(path_b), exist_ok=True)
                shutil.copy2(path_a, path_b)
            elif mtime_a > mtime_b:
                # A es mas reciente -> copiar a B
                shutil.copy2(path_a, path_b)
            elif mtime_b > mtime_a:
                # B es mas reciente -> copiar a A
                shutil.copy2(path_b, path_a)
            # Si mtime igual, no hacer nada
        except Exception as e:
            print(f"WARN: sync failed for {rel}: {e}", file=sys.stderr)


def regenerate_fts_index(memory_dir: str) -> None:
    """Regenera el índice FTS5 si es necesario."""
    import subprocess
    script_path = os.path.join(os.path.dirname(memory_dir), "scripts", "index-memory.py")
    if os.path.isfile(script_path):
        try:
            subprocess.run([sys.executable, script_path], capture_output=True, timeout=30)
        except Exception:
            pass  # Silencioso, el hook de inject hará fallback a grep


def main() -> int:
    project_root = os.path.normpath(
        os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    )
    project_memory = os.path.join(project_root, ".claude", "memory")
    harness_memory = find_harness_memory(project_root)

    if not harness_memory:
        return 0

    # Asegurar que ambos directorios existen
    os.makedirs(project_memory, exist_ok=True)
    os.makedirs(harness_memory, exist_ok=True)

    sync_bidirectional(project_memory, harness_memory)

    # Regenerar índice FTS5 tras sincronizar
    regenerate_fts_index(project_memory)

    return 0


if __name__ == "__main__":
    sys.exit(main())
