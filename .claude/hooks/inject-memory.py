#!/usr/bin/env python3
"""
Hook UserPromptSubmit: Inyecta memoria relevante usando FTS5.

Busca en el índice SQLite FTS5 y devuelve las notas más relevantes.
Si el índice no existe, cae back a grep básico.
"""

import sys
import os
import json
import re
import sqlite3
from pathlib import Path

# Forzar UTF-8 en stdout (necesario en Windows cp1252 y Linux sin locale UTF-8)
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def get_project_root():
    """Obtiene el directorio raíz del proyecto."""
    project_dir = os.environ.get('CLAUDE_PROJECT_DIR', '')
    if project_dir:
        return Path(project_dir)
    return None

def get_memory_dir():
    """Obtiene el directorio de memoria del proyecto."""
    root = get_project_root()
    if root:
        return root / '.claude' / 'memory'
    return None

def extract_keywords(text):
    """Extrae keywords relevantes del mensaje del usuario."""
    text_lower = text.lower()

    stopwords = {
        'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
        'en', 'con', 'por', 'para', 'que', 'es', 'son', 'está', 'están', 'hay',
        'como', 'cuando', 'donde', 'quien', 'cual', 'esto', 'eso', 'aquí', 'ahí',
        'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
        'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
        'quiero', 'necesito', 'puedes', 'puede', 'hacer', 'haz', 'mira', 'ver',
        'cambiar', 'modificar', 'crear', 'añadir', 'agregar', 'eliminar', 'borrar',
        'archivo', 'archivos', 'código', 'codigo', 'file', 'files', 'code',
        'por', 'favor', 'please', 'thanks', 'gracias', 'esto', 'este', 'esta'
    }

    # Extraer palabras significativas
    words = re.findall(r'\b[a-záéíóúüñ_]{3,}\b', text_lower)
    keywords = [w for w in words if w not in stopwords]

    # Patrones específicos del proyecto (editor JS)
    patterns = []

    # Términos técnicos del editor
    tech_terms = ['editor', 'syntax', 'highlight', 'autocomplete', 'tabs', 'preview',
                  'console', 'toolbar', 'theme', 'canvas', 'layer', 'resize', 'zoom']
    for term in tech_terms:
        if term in text_lower:
            patterns.append(term)

    return list(set(keywords + patterns))[:15]  # Limitar a 15 keywords

def search_fts5(memory_dir, keywords):
    """Busca en el índice FTS5."""
    index_path = memory_dir / '_index.db'

    if not index_path.exists():
        return None  # Fallback a grep

    try:
        conn = sqlite3.connect(str(index_path))
        cursor = conn.cursor()

        # Construir query FTS5
        # Usamos OR para buscar cualquier keyword
        search_terms = ' OR '.join(keywords[:10])

        cursor.execute('''
            SELECT path, name, description, type,
                   snippet(memory_fts, 5, '**', '**', '...', 50) as snippet,
                   bm25(memory_fts) as score
            FROM memory_fts
            WHERE memory_fts MATCH ?
            ORDER BY score
            LIMIT 5
        ''', (search_terms,))

        results = cursor.fetchall()
        conn.close()

        return results
    except Exception as e:
        return None  # Fallback a grep

def search_grep(memory_dir, keywords):
    """Búsqueda fallback con grep (método anterior)."""
    relevant_notes = []

    for md_file in memory_dir.rglob('*.md'):
        if md_file.name in ['MEMORY.md', 'CONVENTIONS.md', 'README.md']:
            continue

        try:
            content = md_file.read_text(encoding='utf-8').lower()
            filename = md_file.name.lower()

            score = 0
            matched = []

            for kw in keywords:
                kw_lower = kw.lower()
                if kw_lower in filename:
                    score += 3
                    matched.append(kw)
                elif kw_lower in content:
                    score += 1
                    matched.append(kw)

            if score >= 2:
                relevant_notes.append({
                    'file': md_file,
                    'score': score,
                    'keywords': matched
                })
        except:
            continue

    relevant_notes.sort(key=lambda x: x['score'], reverse=True)
    return relevant_notes[:3]

def format_fts5_output(memory_dir, results):
    """Formatea resultados de FTS5."""
    if not results:
        return None

    project_root = memory_dir.parent.parent
    output = ["📚 **MEMORIA RELEVANTE** (consulta antes de actuar):\n"]

    for path, name, description, type_, snippet, score in results[:3]:
        try:
            # Path en el índice es relativo al root del proyecto.
            # Path() normaliza separadores cross-platform (\ en Win, / en Linux).
            full_path = project_root / Path(path)
            content = full_path.read_text(encoding='utf-8')

            # Extraer body (sin frontmatter)
            if '---' in content:
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    content = parts[2].strip()

            # Limitar longitud
            if len(content) > 500:
                content = content[:500] + '...'

            output.append(f"### [{path}]")
            if description:
                output.append(f"*{description}*")
            output.append(content)
            output.append("")
        except:
            continue

    return '\n'.join(output) if len(output) > 1 else None

def format_grep_output(notes):
    """Formatea resultados de grep (fallback)."""
    if not notes:
        return None

    output = ["📚 **MEMORIA RELEVANTE** (consulta antes de actuar):\n"]

    for note in notes:
        try:
            content = note['file'].read_text(encoding='utf-8')

            if '---' in content:
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    content = parts[2].strip()

            if len(content) > 500:
                content = content[:500] + '...'

            rel_path = note['file'].relative_to(note['file'].parent.parent)
            output.append(f"### [{rel_path}]")
            output.append(f"Keywords: {', '.join(note['keywords'][:5])}")
            output.append(content)
            output.append("")
        except:
            continue

    return '\n'.join(output) if len(output) > 1 else None

def main():
    try:
        input_data = json.loads(sys.stdin.read())
    except:
        sys.exit(0)

    user_message = input_data.get('user_prompt', '') or input_data.get('prompt', '')
    if not user_message or len(user_message) < 10 or user_message.startswith('/'):
        sys.exit(0)

    keywords = extract_keywords(user_message)
    if not keywords:
        sys.exit(0)

    memory_dir = get_memory_dir()
    if not memory_dir or not memory_dir.exists():
        sys.exit(0)

    # Intentar FTS5 primero
    fts_results = search_fts5(memory_dir, keywords)

    if fts_results:
        output = format_fts5_output(memory_dir, fts_results)
    else:
        # Fallback a grep
        grep_results = search_grep(memory_dir, keywords)
        output = format_grep_output(grep_results)

    if output:
        print(output)

    sys.exit(0)

if __name__ == '__main__':
    main()
