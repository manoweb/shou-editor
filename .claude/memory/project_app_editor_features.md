---
name: app-editor-features
description: Inventario completo de features del editor de código / page builder (js/app.js)
type: project
tags: [app.js, editor, page-builder, bloques, drag-drop, code-folding, layers, guardado, i18n]
---

# Shou Editor — Editor visual / page builder (`js/app.js`)

~4178 líneas. Patrón IIFE, API global `ShouEditor`. Toda la lógica en clase `Editor` (líneas 809-4151). Versión `1.0.0`. Estilo GrapesJS. Vanilla JS, CSS inline vía `getEditorCSS()`, HTML vía `getEditorTemplate()`.

## Opciones de configuración (`getDefaultConfig`, línea 934)

| Opción | Default | Notas |
|---|---|---|
| `theme` | `'dark'` | dark/light. `_themeFromConfig` (822) evita que storage lo sobreescriba |
| `width` / `height` | `'100%'` / `'100vh'` | CSS |
| `defaultView` | `'visual'` | visual / code |
| `defaultDevice` | `'desktop'` | desktop/tablet/mobile |
| `storagePrefix` | `'shou-editor-'` | prefijo localStorage |
| `bootstrapCss` | CDN bootstrap@5.3.2 | inyectado en iframe y export |
| `blocksPath` | `'blocks/'` | ruta base de bloques JSON |
| `stylesPath` | `'styles/'` | **NO en getDefaultConfig**, se lee con `|| 'styles/'` (línea 905) |
| `lang` | `'en'` | en / es (solo estos 2) |
| `customBlocks` | `{}` | **NO en getDefaultConfig**, merge sobre cargados |
| `saveFormat` | `'html'` | html (página completa) / json ({html,css,js}) |
| `saveTarget` | `'local'` | local (descarga) / remote (POST) |
| `saveEndpoint` | `null` | URL para POST |
| `saveFilename` | `'proyecto'` | nombre base export |
| `onSaveSuccess` / `onSaveError` | `null` | callbacks POST remoto |

Constructor dual: `init('#sel', config)` o `init(config)` (usa document.body).

## API pública

Getters: `getHtml/getCss/getJs/getCode` (4073-4076). Setters: `setHtml/setCss/setJs/setCode` (4078-4091). `setTheme/toggleTheme` (4035-4042). `setLang` (4046, re-renderiza toda la UI preservando código) / `getLang` (4061). `setSaveFormat/setSaveTarget` (4063-4067). `save` (3924) / `preview` (3977, Blob URL nueva pestaña) / `exportHtml` (alias). `newProject` (3912). `importHtml` (4006). `bindToForm(sel, opts)` (4100) / `unbindForm` (4140) / `destroy` (4147). `undo/redo` (3780/3786).

## Sistema de bloques

`loadBlocks()` (855): fetch `_index.json` → `{categories:[{id,label,blocks:[ids]}]}`, carga cada `blocks/{cat}/{id}.json` con `Promise.allSettled`. Fallback a `DefaultBlocks` embebido (413-496) si falla. Merge de `customBlocks`. Bloque JSON: `{id,label,icon,html,css?,settings?}`. `_retagBlocks` (3374) re-etiqueta contenido viejo de storage sin `data-jse-block`. `injectBlockCSS` (3408) inyecta CSS del bloque con id único.

**Settings de bloque**: tipos `text`, `select`, `checkbox`, `options`, y compuestos: `slides` (carousel), `tabs`, `accordion`, `listgroup`, `breadcrumb`, `modal-toggle`. Cada setting: `selector`, `attr`, `prop` (textContent/innerHTML/tagName/options), `all`. Editores compuestos con reindexado: `syncSlidesToCarousel` (1407), `syncTabsToComponent` (1444), `syncAccordionToComponent` (1484), `syncListGroupToComponent` (1527), `syncBreadcrumbToComponent` (1551), `syncOptionsToSelect` (1347). Cambio de tag en caliente vía `prop:'tagName'` (h1→h2 preservando attrs/innerHTML, líneas 1270).

## Sistema de estilos (panel)

`DefaultStyles` (326-407): 9-10 secciones (dimensions, spacing, typography, background, borders, layout, flexbox, grid, transform). Carga externa `_loadStylesDef` (903) reemplaza con `styles.json`. `_buildStylesPanel` (3121) genera secciones plegables. Aplicación en vivo escribe en `selectedElement.style[prop]` (1203-1213).

## Atributos HTML

`BoolAttrs` (277, ~30 attrs → toggle switches). `TagAttributes` (279-320, tag→attrs con `_common`). Carga externa `attributes.json` añade boolAttrs/common/tags. Modo fallback genérico cuando el elemento no es un bloque con settings.

## Syntax highlighting

`highlightHTML/CSS/JS` (502-555). Tokens CSS con variables `--tok-*` (línea 744). Tema externo `highlight.json` → `_applyHighlightTheme` (925) aplica variables inline. Nota: token `attrVal` en highlight.json no tiene regla CSS (usa `tok-str`).

## Drag & drop

Bloques→canvas: `_resolveDropTarget` (2152), `_isHorizontalLayout` (2133, flex-row/grid), `_findBestGap` (2209, hueco por ratón, bordes 25%/20px), indicador con 3 variantes CSS (barra H, barra V `drop-horizontal`, caja `drop-inside`), `insertBlockAtPosition` (2370). Bloques→editor código: barra `.jse-code-drop-bar`, inserta HTML/CSS en cursor (1128-1199). Reordenar: drag handle en mini-toolbar (`setupDragHandle` 2532). Panel capas: drop en tercios before/after/inside (3461-3543). Teclado: Alt+Flechas → `_moveElementUp/Down/Out/Into` (2609).

## Editor de código

3 editores (html/css/js), overlay textarea transparente sobre `<pre>`. **Code folding** (2890-3119): `_detectFoldRegions` (2895, HTML por pares tags, CSS/JS por brackets), `_buildDisplayCode` (2983), atajos Ctrl+Shift+[ plegar / Ctrl+Shift+] desplegar. Teclas: Tab (2 espacios), Enter auto-indent tras `{([:`. **Sincronización**: `syncToCode` (3820, visual→código con `formatHtml` 3675 pretty-printer propio), `syncFromCode` (3831, código→visual + CSS custom `#jse-custom-css`). **Breadcrumb** `updateCanvasBreadcrumb` (2746, ancestros clicables en canvas y código). **Resaltado bidireccional** `_highlightInCodeEditor` (2790, selecciona rango del elemento en textarea). **Historial** `pushHistory` (max 50, debounce 800ms), undo/redo (3769-3818).

## Capas (Layers)

`updateLayers` (3432), `renderLayerNode` (3449, árbol recursivo 12px/nivel, ignora script/style/link), click-selecciona + drag reordena, `highlightLayerForElement` (3546).

## Selección + mini-toolbar flotante

`selectElement` (2719, marca `[data-selected]`). `createElementToolbar` (2392): drag handle, duplicar, eliminar, editar imagen (solo `<img>`), operaciones tabla (add/del row/col) en TD/TH/TR vía `_handleTableAction` (2462). `updateToolbarPosition` (2702, flip arriba/abajo). Bootstrap funcional sin bootstrap.js en modo edición: tabs (1949), modal (1971), accordion (1993). Atajos iframe: Ctrl+Z/Y/C/X/V (clipboard outerHTML), Delete, Escape, Alt+Flechas.

## Guardado + formularios

`save` (3924) → `_buildSaveData` (3933, html vía `generateFullHtml` 3987 / json limpiando `data-jse-block`). `_saveLocal` (3950, Blob download), `_saveRemote` (3954, POST + callbacks). `bindToForm` (4100): hidden inputs en submit, modo single (`opts.field`→JSON) o triple (`editor_html/css/js`). Persistencia localStorage: `saveToStorage` (3860), `loadFromStorage` (3882).

## Vista, temas, responsive

Preview Blob nueva pestaña. Temas dark/light variables `--jse-*`. Responsive desktop/tablet/mobile (`data-device`, anchos 1200/768/375px). Fullscreen `toggleFullscreen` (1834, detecta z-index más alto). Outlines toggle `toggleOutlines` (3851, bordes dashed contenedores, persistido). Resize paneles `_initPanelResize` (1856, min 150/max 500px).

## Integración editor de imágenes

`openImageEditor` (2674): abre `JSImageEditor` (dep opcional) en modal, callback `onSave` reemplaza `src` por base64. Botón solo en `<img>`. Comprueba `typeof JSImageEditor` para funcionar sin él.

Ver [[image-editor-features]], [[blocks-styles-data]], [[known-bugs]], [[docs-desync]].
