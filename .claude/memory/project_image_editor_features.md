---
name: image-editor-features
description: Inventario completo de features del editor de imágenes (js/image-editor.js, JSImageEditor)
type: project
tags: [image-editor, capas, layers, canvas, filtros, texto, google-fonts, seleccion, efectos, shoimg]
---

# Shou Editor — Editor de imágenes (`js/image-editor.js`)

~5497 líneas. IIFE `global.JSImageEditor`. Versión `3.0.0`. Tipo Photoshop. Estructura: utilidades DOM (10-23), `Lang`/`t()` (26-324), `Icons` (327-372), `class Layer` (377-642), `class LayerManager` (645-1146), `getImageEditorCSS()` (1149), `getImageEditorTemplate()` (1345), `class ImageEditor` (1494-5447), objeto público (5450).

## Configuración (`getDefaultConfig`, 1547)

| Opción | Default | Notas |
|---|---|---|
| `theme` | `'dark'` | theme-dark/theme-light |
| `width`/`height` | `'100%'` | |
| `maxHistory` | `20` | estados de historial |
| `outputFormat` | `'png'` | png/jpeg/webp |
| `outputQuality` | `0.92` | 0-1 (jpeg/webp) |
| `lang` | `'en'` | en/es |
| `tools` | `{drawing:[...],transform:[...]}` | listas, soporta grupos `{group,tools:[]}` |
| `panels` | `{layers,filters,statusBar:true}` | |
| `filters` | `[brightness,contrast,saturation,blur,grayscale,sepia,hue]` | |
| `preset` | `null` | `{width,height,background,layers:[{name,opacity,fill}]}` |
| `onSave`/`onCancel` | `null` | callbacks (nunca de JSON) |

Config externa: `ImageEditor.loadConfig(url)` estático (1570) cachea en `_externalConfig`. Default url: `js/image-editor-config.json`.

## API pública (`JSImageEditor`, 5450)

`version` `3.0.0`. `loadConfig(url)`. `init(container, config)`. `open(src, config)` (modal fullscreen `.jsie-modal-overlay`, envuelve callbacks para cerrar). Métodos de instancia: `loadImage(File|url)` (2445), `importAsLayer(src)` (4328), `getImage()` (4189, dataURL aplanado+filtros), `getBlob()` (4196, Promise), `setTool` (2775), `undo/redo` (4146/4152), `rotate(deg)` (4073), `flip(dir)` (4105), `showResizePanel()` (4015), `reset()` (4305), `saveProject`/`openProject` (.shoimg, 4959/5009), `destroy()` (5426).

## Sistema de capas

`class Layer` (377): tipos `raster`(def)/`text`/`group`. Props: id, name, visible, opacity, locked, blendMode, effects(7), width, height, textData, children, collapsed, parentId, canvas+ctx propios. `_renderText` (426, fuente/estilo/peso/letterSpacing con fallback manual/lineHeight/decoración). `getThumbnail` (506, fondo damero). Serialización doble: `serialize`/`deserialize` (ImageData, historial) y `serializeForProject`/`deserializeFromProject` (dataURL PNG, .shoimg, async).

`class LayerManager` (645): `layers[]` abajo-arriba, getters `activeLayer`/`activeIndex`. `initFromImage`/`initFromPreset`, `addLayer/deleteLayer/duplicateLayer/moveLayer/setActive/toggleVisibility/setOpacity`. Grupos: `addGroup/moveToGroup/removeFromGroup`. Composición: `_applyLayerEffects` (825), `composite`/`flatten` (1095/1107).

**Blend modes** (12): normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion.

## Herramientas

`setTool` (2775), opciones `_renderToolOptions` (2875), eventos `_bindCanvasEvents` (2101). **move** (mueve pixeles/textData), **pan** (scroll), **pencil**/**eraser** (source-over/destination-out, color+size 1-50), **eyedropper** (`_pickColor` 3359), **fill** (`_floodFill` scanline + tolerancia, 3372), **gradient** (lineal color1→color2, preview punteado, 3572-3586), **rect/circle** (opción fill+fillColor), **line/arrow** (punta calculada por ángulo), **text** (§texto), **crop** (§recorte). Shift fuerza cuadrado/círculo. Preview en vivo con `_shapeSnapshot`+putImageData.

## Canvas / zoom / pan

Doble canvas: `mainCanvas` (composite) + `interactionCanvas` (overlay z-5). `_canvasPos` (2434). Zoom `_zoom` (2525, clamp 0.05-32), `_zoomFit` (2531), rueda ratón zoom (factor 1.1/0.9). Status bar `_updateStatusDims/Cursor/Tool` (4289).

## Selecciones (2151-3356)

Tipos: rect, ellipse, poly, free, wand, inverted. Poligonal cierra <8px o dblclick. Varita mágica `_magicWandSelect` (3440, flood-fill máscara Uint8Array + contorno). **Marching ants** animados (`requestAnimationFrame`+`lineDashOffset`, 3155). `_buildSelectionPath` Path2D (3053). Ops: selectAll (Ctrl+A), clearSelection (Ctrl+D), invertSelection (Ctrl+Shift+I). Portapapeles: copy/cut/delete/paste (crea capa "Pasted") / cropToSelection.

## Handles de redimensión de capa (visual)

`_getLayerContentBounds` (2574, bbox pixeles no transparentes), `_drawLayerBounds` (2594, marco azul + 9 handles), `_hitTestHandle` (2636, 7px), `_startVisualResize` (2648, preview 0.6 alpha, Shift proporción, mc mueve). **IMPORTANTE: handles se comprueban ANTES de `if (!this.currentTool)` en mousedown (2107)** — funcionan sin herramienta activa. Diálogo numérico `_showResizeLayerDialog` (5159).

## Texto

Edición inline con `<textarea>` superpuesto: `_placeText` (3647), `_editTextLayer` (3755). Enter guarda, Shift+Enter salto, Escape cancela, clic fuera guarda (patrón `_activeTextEdit`+`outsideHandler`, `_finishActiveTextEdit` 3748). Props: fontSize(24), fontFamily(Arial), fontWeight, fontStyle, letterSpacing, lineHeight(1.2), textAlign, textDecoration. `_loadTextLayerProps`/`_syncTextLayerProps` (3598/3613). Doble clic reedita.

**Google Fonts** (4368-4548): `_loadedGoogleFonts` Set persistente. `_googleFontsList` (~95 fuentes). `_loadGoogleFont` inyecta `<link>` + `document.fonts.load()` para forzar descarga. `_showGoogleFontsDialog` (modal búsqueda + custom + chips). Fuentes base del select (14): Arial, Helvetica, Verdana, etc.

## Filtros

`this.filters` (1508): brightness/contrast/saturation (0-200, def 100), blur (0-20), grayscale/sepia (0-100), hue (0-360). `_applyFilters` (2562) usa CSS `filter` sobre mainCanvas (NO destructivo). Se aplican al aplanar en export. Documento completo, no por capa.

## Efectos de capa (`_applyLayerEffects` 825, diálogo `_showLayerStylesDialog` 5237)

7 efectos (enabled + params): dropShadow, innerShadow, outerGlow, stroke (position outside/center/inside), colorOverlay (blendMode), border (style/radius), gradientOverlay (linear/radial, angle). Modal dos paneles. Cancelar restaura `originalEffects`. No para grupos.

## Color picker

`_colorInputHtml` (4564): input color + hex + botón paleta `▦`. `_bindColorCombos` (4630). `_showColorPalette` (4568, 60 swatches `_webColors` + hex custom).

## Importar / exportar

Importar: `loadImage` (2445, File/url, drag&drop, detecta .shoimg), `importAsLayer` (4328), crossOrigin anonymous con fallback. Exportar: `_showExportDialog` (5069, PNG/JPEG/WebP, slider calidad, tamaño estimado en vivo). `getImage/getBlob` programáticos. **Proyecto `.shoimg`** (4958): JSON `{format:'shoimg',version:1,timestamp,capas dataURL+effects,filtros,zoom,theme}`, File System Access API + fallback anchor.

## Historial (4131)

`pushHistory` `{layerState,filters}`, trunca futuro, respeta maxHistory. Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z. `reset()` estado 0.

## Menús / atajos / iconos

Barra menús (`_getMenuDefinition` 4654): File, Edit, Image, Layer, Select, View (toggle paneles con checkmarks), Help. Submenús hover con reposición. Atajos (`_keyHandler` 1830): Ctrl+Z/Y, Ctrl+A/D/Shift+I, Ctrl+C/X/V, Delete, Escape, rueda zoom. `Icons` (327, ~45 SVG monocromo). Grupos de herramientas con submenú (flecha o long-press >1s, `_toggleGroupSubmenu` 2832). Panel derecho pestañas Layers/Image. Panel capas completo: miniaturas, visibilidad, grupos, renombrar dblclick, drag reordena+agrupa, menú contextual, opacidad, blend mode. Empty state drop zone.

Ver [[app-editor-features]], [[blocks-styles-data]], [[known-bugs]].
