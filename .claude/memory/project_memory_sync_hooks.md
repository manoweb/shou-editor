---
name: memory-sync-hooks
description: Sistema de sincronización de memoria multi-máquina via Claude hooks
metadata:
  type: project
---

Para sincronizar la auto-memoria de Claude Code entre múltiples máquinas
se usan **Claude hooks** en lugar de git post-merge hooks o symlinks.

## Componentes

| Hook | Archivo | Disparo | Función |
|------|---------|---------|---------|
| SessionStart | `sync-memory-init.py` | Al iniciar cada sesión Claude | Copia `.claude/memory/` ↔ `~/.claude/projects/<encoded>/memory/` (bidireccional) |
| PostToolUse | `mirror-memory.py` | Tras cada Write/Edit en `.claude/memory/` | Espeja el archivo al harness path local |
| PreToolUse | `guard-memory-path.py` | Antes de Write/Edit | Bloquea con exit 2 si se intenta escribir al harness path directamente |
| UserPromptSubmit | `inject-memory.py` | Al enviar prompt | Inyecta memoria relevante usando FTS5 o grep |
| Wrapper | `_runpy.sh` | Llamado por settings.json | Detecta `python3`/`python`/`py` cross-platform |

## Por qué Claude hooks

- Viven en `.claude/settings.json` y `.claude/hooks/` del proyecto, versionados en git
- **Cero instalación por máquina**: `git clone` y los hooks ya están activos
- Un git post-merge hook habría requerido instalación manual en `.git/hooks/` de cada máquina
- Symlinks/junctions habrían requerido un comando manual por máquina

## Cómo aplicar

- La memoria debe escribirse SIEMPRE en `.claude/memory/` del proyecto (versionable en git)
- El hook PostToolUse espeja automáticamente al harness path
- Si los hooks fallan: verificar que Python 3 esté instalado y accesible

## Verificación

```bash
# Todos estos archivos deben existir y ser ejecutables:
ls -la .claude/hooks/*.py .claude/hooks/*.sh .claude/scripts/*.py
```
