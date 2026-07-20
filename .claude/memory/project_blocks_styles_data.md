---
name: blocks-styles-data
description: Datos JSON del proyecto — 36 bloques, styles.json, attributes.json, highlight.json, config y HTML demo
type: reference
tags: [blocks, styles, attributes, highlight, json, demo, index.html]
---

# Datos JSON y estructura de archivos — Shou Editor

## Bloques (`blocks/`) — 36 total, 5 categorías

Manifiesto `blocks/_index.json` → `{categories:[{id,label,blocks:[ids]}]}`.

| Categoría | Nº | Bloques |
|---|---|---|
| **basic** | 5 | text, heading, image, link, divider |
| **layout** | 3 | container, row-2, row-3 |
| **bootstrap** | 15 | card, alert, button, table, accordion, carousel, modal, tabs, badge, progress, list-group, breadcrumb, pagination, spinner, toast |
| **forms** | 9 | form, input, textarea, select, checkbox, radio, file, range, switch |
| **sections** | 4 | navbar, hero, features, footer |

Estructura bloque JSON: `id`, `label`, `icon` (clave de `Icons`), `html` (requerido), `css` (opcional, ningún bloque de ejemplo lo usa), `settings[]`. Setting: `label` (clave i18n `setting.*`), `prop` (textContent/tagName…) o `attr`, `selector` (sub-elemento), `type` (text/select/checkbox/options), `options`, `all`.

## Estilos (`styles/`)

- **styles.json**: 9 secciones, ~82 props. dimensions(7), spacing(10), typography(12), background(6), borders(9), layout(11), flexbox(12), grid(7), transform(5). Cada prop: label, style (camelCase), type (text/color/select). Labels de sección i18n (`styles.*`).
- **attributes.json**: 59 tags HTML (a→video), `boolAttrs` (24), `common` (12: id, class, title, style, role, tabindex, lang, dir, hidden, draggable, contenteditable, spellcheck).
- **highlight.json**: tema "Default Dark", 13 tokens: comment #6a9955, tag #569cd6, attr #e5c07b, str #ce9178, kw #c586c0, num #b5cea8, bool #569cd6, fn #dcdcaa, prop #9cdcfe, punct #808080, unit #b5cea8, attrVal #ce9178, selector #d7ba7d.

## Config editor de imágenes (`js/image-editor-config.json`)

theme dark, width/height 100%, maxHistory 20, outputFormat png, outputQuality 0.92, lang en, preset null. tools.drawing: move, grupo select (selectRect/Ellipse/Poly/Free/Wand), pencil, eraser, eyedropper, fill, gradient, rect, circle, line, arrow, text. tools.transform: crop, resize, rotateLeft/Right, flipH/V. panels: layers/filters/statusBar true. filters: brightness, contrast, saturation, blur, grayscale, sepia, hue.

## Archivos HTML

- **index.html** (47KB): landing/marketing del SDK, NO el editor. Bootstrap CDN, mockups, código como texto. Botón "Try" → test-js-editor.html. Google Analytics G-D3K27Q5XDM. No carga app.min.js funcional.
- **test-js-editor.html** (3.4KB): demo real. Carga image-editor.min.js + app.min.js. `ShouEditor.init('#editor', {theme:'dark', width, height, defaultView:'visual', defaultDevice:'desktop'})`. Resto de opciones comentadas.
- **test-image-editor.html** (4.6KB): demo imágenes. Solo image-editor.min.js. 3 modos: embebido `JSImageEditor.init(container, {theme,lang:'es',onSave,onCancel})`, preset (800×600, 3 capas), modal `JSImageEditor.open(null, {...})`.

## Archivos legado (NO usados por los plugins single-file)

- **css/**: main.css (1062), editor.css (569), themes/dark.css (89), themes/light.css (88), css/components/ vacío. NO referenciados por index.html (el CSS real es inline en JS).
- **assets/icons/**: vacío (iconos SVG inline en objeto `Icons`).
- Corresponden a la estructura teórica del CLAUDE.md, no a la arquitectura single-file real.

Ver [[app-editor-features]], [[image-editor-features]], [[docs-desync]].
