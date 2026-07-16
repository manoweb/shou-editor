#!/usr/bin/env python3
"""
mirror-memory.py
Hook PostToolUse: tras Write/Edit en .claude/memory/, espeja el archivo al
harness path local (~/.claude/projects/<...>/memory/).

Descubrimiento del harness via sessions-index.json -> originalPath (universal).
Fallback a encoding calculado para primera sesion sin historial.

Tipo de hook: B (accion real). El espejo sucede sin que Claude decida nada.
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

    encoded = _encode(project_root)
    return os.path.join(projects_base, encoded, "memory")


def _encode(p: str) -> str:
    """Replica el encoding que usa Claude Code para nombrar el directorio del proyecto."""
    p = re.sub(r"^/([a-zA-Z])/", lambda m: m.group(1).lower() + ":/", p)
    p = p.replace("\\", "/")
    p = re.sub(r"^([A-Za-z]):", lambda m: m.group(1).lower() + ":", p)
    return re.sub(r"[/:._]", "-", p)


def normalize_for_compare(p: str) -> str:
    return p.replace("\\", "/").lower()


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0

    tool_input = data.get("tool_input") or {}
    file_path = tool_input.get("file_path") or tool_input.get("path") or ""

    if not file_path:
        return 0

    file_norm = normalize_for_compare(file_path)
    if "/.claude/memory/" not in file_norm:
        return 0

    project_root = os.path.normpath(
        os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    )
    project_memory = os.path.join(project_root, ".claude", "memory")
    project_memory_norm = normalize_for_compare(project_memory)

    harness_memory = find_harness_memory(project_root)
    if not harness_memory:
        return 0

    os.makedirs(harness_memory, exist_ok=True)

    marker = project_memory_norm + "/"
    if marker not in file_norm:
        return 0
    idx = file_norm.find(marker) + len(marker)
    rel = file_path.replace("\\", "/")[idx:]

    dest = os.path.join(harness_memory, rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(dest), exist_ok=True)

    try:
        shutil.copy2(file_path, dest)
    except Exception as e:
        print(f"WARN: mirror-memory fallo al copiar {file_path} -> {dest}: {e}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
