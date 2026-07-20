---
name: known-bugs
description: Bugs e inconsistencias detectados en el análisis de app.js e image-editor.js (julio 2026)
type: project
tags: [bugs, inconsistencias, layermanager, highlight, dead-code]
---

# Bugs e inconsistencias detectados (análisis julio 2026)

## image-editor.js

1. **`layerManager.removeLayer(id)` (línea 1920) no existe** — el nombre real es `deleteLayer`. Bug latente en el menú contextual de capa.
2. **`layerManager.getActive()` (línea 4861) no existe** — el real es el getter `activeLayer`. Bug latente en la acción de menú `resizeLayer`.
3. **`this.zoom` en `saveProject` (línea 4969) no existe** — la propiedad real es `this.zoomLevel`. El `.shoimg` guarda siempre zoom 1.
4. **Atajos +/-/Ctrl+0** aparecen en el diálogo de atajos (`_showShortcutsDialog` 4904) pero NO están cableados en `_keyHandler` (1830).
5. **Clave i18n `opt.tolerance` duplicada** en bloques en (87) y es (233).

## app.js

6. **`insertBlockAt()` (línea 3339)** parece código muerto/redundante con `insertBlock` e `insertBlockAtPosition`. Sin llamadas detectadas.
7. **Token `attrVal`** existe en highlight.json pero NO tiene regla CSS ni lo emite `highlightHTML` (usa `tok-str` para valores de atributo). Inconsistencia menor.
8. **Header JSDoc desactualizado** (líneas 9-17): no menciona blocksPath, lang, saveFormat, saveTarget, saveEndpoint, saveFilename, customBlocks, stylesPath ni callbacks.
9. **`stylesPath` y `customBlocks` no están en `getDefaultConfig()`** pero sí se consumen (lectura defensiva `config.x || default`). Convendría documentarlos.

## Recordatorio de build

Tras editar los .js originales, SIEMPRE regenerar minificados (ver MEMORY.md):
```bash
npx terser js/image-editor.js -o js/image-editor.min.js --compress --mangle && npx terser js/app.js -o js/app.min.js --compress --mangle
```
Los .min.js NO se han regenerado tras estos hallazgos (son solo análisis, sin cambios de código).

Ver [[app-editor-features]], [[image-editor-features]].
