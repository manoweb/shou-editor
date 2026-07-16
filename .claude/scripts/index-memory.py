#!/usr/bin/env python3
"""
Indexa todos los .md de memoria en SQLite FTS5 para búsqueda rápida.

Uso:
    python index-memory.py [--force]

El índice se regenera si:
- No existe _index.db
- Algún .md es más reciente que _index.db
- Se pasa --force
"""

import os
import sys
import sqlite3
import re
from pathlib import Path
from datetime import datetime

def get_project_root():
    """Obtiene el directorio raíz del proyecto."""
    script_dir = Path(__file__).parent
    return script_dir.parent.parent  # .claude/scripts -> .claude -> proyecto

def get_memory_dir():
    """Obtiene el directorio de memoria."""
    return get_project_root() / '.claude' / 'memory'

def get_docs_paths():
    """Obtiene todos los paths de documentación a indexar."""
    root = get_project_root()
    return [
        ('memory', root / '.claude' / 'memory'),
    ]

def extract_frontmatter(content):
    """Extrae metadatos del frontmatter YAML."""
    metadata = {
        'name': '',
        'description': '',
        'type': '',
        'tags': ''
    }

    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            for line in frontmatter.strip().split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip().lower()
                    value = value.strip().strip('"\'')
                    if key in metadata:
                        metadata[key] = value

    return metadata

def extract_body(content):
    """Extrae el cuerpo (sin frontmatter)."""
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            return parts[2].strip()
    return content

def needs_reindex(memory_dir, index_path):
    """Verifica si hay que regenerar el índice."""
    if not index_path.exists():
        return True

    index_mtime = index_path.stat().st_mtime

    for md_file in memory_dir.rglob('*.md'):
        if md_file.name in ['MEMORY.md', 'CONVENTIONS.md', 'README.md']:
            continue
        if md_file.stat().st_mtime > index_mtime:
            return True

    return False

def create_index(memory_dir, index_path):
    """Crea o recrea el índice FTS5 con memoria."""
    # Eliminar índice anterior si existe
    if index_path.exists():
        index_path.unlink()

    conn = sqlite3.connect(str(index_path))
    cursor = conn.cursor()

    # Crear tabla FTS5 con campo source para distinguir tipo
    cursor.execute('''
        CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
            path,
            name,
            description,
            type,
            tags,
            body,
            source,
            tokenize='porter unicode61'
        )
    ''')

    count = 0
    root = get_project_root()
    ignore_files = ['MEMORY.md', 'CONVENTIONS.md', 'README.md', 'INDEX.md']

    for source_type, base_path in get_docs_paths():
        if not base_path.exists():
            continue

        pattern = '**/*.md'

        for md_file in base_path.glob(pattern):
            if md_file.name in ignore_files:
                continue
            if not md_file.is_file():
                continue

            try:
                content = md_file.read_text(encoding='utf-8')
                metadata = extract_frontmatter(content)
                body = extract_body(content)

                # Path relativo desde raíz del proyecto
                try:
                    rel_path = str(md_file.relative_to(root))
                except ValueError:
                    rel_path = str(md_file)

                # Usar nombre del archivo como name si no hay frontmatter
                name = metadata['name'] or md_file.stem

                cursor.execute('''
                    INSERT INTO memory_fts (path, name, description, type, tags, body, source)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    rel_path,
                    name,
                    metadata['description'],
                    metadata['type'] or source_type,
                    metadata['tags'],
                    body[:5000],
                    source_type
                ))
                count += 1
            except Exception as e:
                print(f"Error indexando {md_file}: {e}", file=sys.stderr)

    conn.commit()
    conn.close()

    return count

def main():
    force = '--force' in sys.argv

    memory_dir = get_memory_dir()
    index_path = memory_dir / '_index.db'

    if not memory_dir.exists():
        print("Error: directorio de memoria no existe", file=sys.stderr)
        sys.exit(1)

    if force or needs_reindex(memory_dir, index_path):
        count = create_index(memory_dir, index_path)
        print(f"Indexadas {count} notas en {index_path.name}")
    else:
        print("Índice actualizado, no se requiere regenerar")

if __name__ == '__main__':
    main()
