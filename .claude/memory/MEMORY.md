# Shou Editor - Project Memory

## Índice de notas de features (.claude/memory/)
- [app-editor-features](project_app_editor_features.md) — features completas de js/app.js (editor código/page builder)
- [image-editor-features](project_image_editor_features.md) — features completas de js/image-editor.js (JSImageEditor)
- [blocks-styles-data](project_blocks_styles_data.md) — 36 bloques, styles.json, attributes.json, highlight.json, HTML demo
- [known-bugs](project_known_bugs.md) — bugs e inconsistencias detectados (jul 2026)
- [docs-desync](project_docs_desync.md) — desajustes docs/ ↔ código real
- [memory-sync-hooks](project_memory_sync_hooks.md) — sistema de sincronización de memoria multi-máquina

## Build: Minification (IMPORTANT)
After ANY change to JS files, ALWAYS regenerate minified versions:
```bash
npx terser js/image-editor.js -o js/image-editor.min.js --compress --mangle && npx terser js/app.js -o js/app.min.js --compress --mangle
```
- HTML files reference `.min.js` versions (test-js-editor.html, test-image-editor.html)
- Original `.js` files are the source of truth for development
- `.min.js` are the production files served to users

## Architecture
- Single-file image editor: `js/image-editor.js` (~4500 lines, ~210KB)
- Single-file code editor: `js/app.js` (~208KB)
- Vanilla JS ES6+, zero dependencies, no build step
- All CSS is inline in the JS files (injected via template literals)

## Key Patterns
- i18n: EN block (~line 50-130), ES block (~line 130-230) in image-editor.js
- Icons: SVG strings in `Icons` object (~line 260-300)
- Layer system: `Layer` class (line ~230), `LayerManager` class (line ~450)
- Canvas events: `_bindCanvasEvents()` (line ~1716)
- Tool options: `_renderToolOptions()` / `_bindToolOptionEvents()`
- Resize handles: check BEFORE `currentTool` in mousedown (handles work without active tool)
- Google Fonts: loaded via CDN, `_loadedGoogleFonts` Set persists per session
- Color picker: combo of native input + hex field + palette popup

## Known Issues / Fixes Applied
- Resize handles: must check before `if (!this.currentTool)` in mousedown handler
- `_lastLayerBounds`: kept fresh in `_redraw()` always, not just when no selection
- Import: calls `_clearSelection()` before redraw so handles appear immediately
- Google Fonts: use `document.fonts.load()` to force download, not just `document.fonts.ready`
- Text editing: `_activeTextEdit` pattern with outsideHandler for click-outside auto-save
