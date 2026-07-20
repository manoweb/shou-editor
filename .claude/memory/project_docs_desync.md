---
name: docs-desync
description: Desajustes entre la documentación (docs/) y el código/datos reales del proyecto
type: project
tags: [documentacion, desajustes, docs, bloques, highlight]
---

# Desajustes documentación ↔ código real (análisis julio 2026)

`docs/` (README.md, QUICKSTART.md, INSTALLATION.md 30KB el más completo, subcarpetas api/ guides/ user/) fechado 2026-02-09, en inglés.

## CORREGIDO (jul 2026) — commit de docs

1. ✅ **Secciones inexistentes**: quitados "Pricing", "Testimonials", "Contact" de README.md y QUICKSTART.md. Solo: navbar, hero, features, footer.
2. ✅ **Layouts inexistentes**: "columns (2,3,4)"/"row-4" → "2 Columns, 3 Columns" en QUICKSTART.md.
3. ✅ **Bootstrap infra-listado**: los 15 bloques Bootstrap listados ahora en INSTALLATION.md, README.md, QUICKSTART.md, user/interface.md, guides/architecture.md. También completados los listados de forms (8 bloques).
4. ✅ **highlight.json**: `attr` corregido a #e5c07b en INSTALLATION.md y api/syntax.md; añadida fila `attrVal` (#ce9178) con nota de que los valores se renderizan hoy con `str`.

Archivos tocados: docs/README.md, docs/QUICKSTART.md, docs/INSTALLATION.md, docs/api/syntax.md, docs/guides/architecture.md, docs/user/interface.md.

Nota: `docs/guides/extending.md` menciona un bloque `pricing-table` — es un EJEMPLO de bloque custom vía `customBlocks`, no un desajuste. Se conserva.

## PENDIENTE

5. **CLAUDE.md desactualizado**: describe estructura teórica (css/ externos, assets/icons/, js/editor/core.js, js/components/) que NO refleja la arquitectura single-file real (todo inline en app.js e image-editor.js). Requiere decisión del usuario por ser el documento de instrucciones del proyecto.
- El progress.md interno (2026-01-29) también describe algunos bloques Bootstrap como "nuevos" que ya están consolidados.

Ver [[blocks-styles-data]], [[app-editor-features]].
