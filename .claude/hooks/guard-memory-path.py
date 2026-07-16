#!/usr/bin/env python3
"""
guard-memory-path.py
Hook PreToolUse: bloquea Write/Edit que apunten al harness memory path.
La memoria SIEMPRE va a .claude/memory/ del proyecto (versionable en git).

El mirror-memory.py (PostToolUse) ya espeja automaticamente al harness path,
asi que nunca hay razon para escribir alli directamente.

Tipo de hook: B (bloqueo con exit 2). El harness aborta la herramienta si
Claude se equivoca de path.
"""
import json
import sys


HARNESS_PATTERN = "/.claude/projects/"
MEMORY_SEGMENT = "/memory/"


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0

    tool_input = data.get("tool_input") or {}
    file_path = tool_input.get("file_path") or tool_input.get("path") or ""
    if not file_path:
        return 0

    # Normalizar case-insensitive porque Windows admite mayusculas/minusculas
    # intercambiables en drive letter y paths
    normalized = file_path.replace("\\", "/").lower()

    # Detectar path al harness memory: contiene /.claude/projects/<algo>/memory/
    if HARNESS_PATTERN in normalized and MEMORY_SEGMENT in normalized:
        idx_projects = normalized.find(HARNESS_PATTERN)
        idx_memory = normalized.find(MEMORY_SEGMENT, idx_projects)
        if idx_memory > idx_projects:
            print(
                f"ERROR: no escribas directamente al harness memory path.\n"
                f"  Path bloqueado: {file_path}\n\n"
                f"La memoria debe ir SIEMPRE a .claude/memory/ del proyecto "
                f"(versionable en git).\n"
                f"El hook PostToolUse 'mirror-memory.py' espeja automaticamente "
                f"al harness path.\n\n"
                f"Reintenta apuntando a $CLAUDE_PROJECT_DIR/.claude/memory/<archivo>",
                file=sys.stderr,
            )
            return 2  # Exit 2 BLOQUEA la herramienta

    return 0


if __name__ == "__main__":
    sys.exit(main())
