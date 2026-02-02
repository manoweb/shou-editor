# Progreso del Proyecto Shou Editor

## Última Actualización: 2026-01-29

## Estado Actual: Plugin Universal Completado

### Refactorización a Plugin (COMPLETADA)

Shou Editor ahora es un **plugin 100% autónomo** que:
- Genera su propio HTML dinámicamente
- Inyecta sus propios estilos CSS
- No requiere estructura HTML previa
- Se instala con una sola línea de código

#### Uso Básico

```html
<script src="js/app.js"></script>
<script>
  const editor = ShouEditor.init('#mi-contenedor', {
    theme: 'dark',
    width: '100%',
    height: '100vh'
  });
</script>
```

### Arquitectura del Plugin

```
js/app.js (IIFE Pattern - ~1600+ líneas)
├── Utilities ($, $$, on, escapeHtml, etc.)
├── Lang (i18n: en, es) + t() translator
├── Icons (SVG monocromo)
├── DefaultBlocks (fallback con settings, i18n keys)
├── Syntax Highlighting (HTML, CSS, JS)
├── getEditorTemplate() - Genera estructura HTML
├── getEditorCSS() - Estilos embebidos (scrollbars temáticos, toggle switches)
├── Editor Class
│   ├── constructor() → async _init()
│   ├── loadBlocks() - Carga JSON desde blocksPath (async, fallback DefaultBlocks)
│   ├── injectCSS() - Inyección de estilos
│   ├── render() - Renderiza el template
│   ├── cacheElements() - Cache de elementos DOM
│   ├── bindEvents() - Event listeners (incluye settings handlers)
│   ├── initFrame() - Inicializa iframe canvas
│   ├── setupFrame() - Configura eventos del canvas
│   ├── _findBlockRoot() - Busca data-jse-block en ancestros
│   ├── _retagBlocks() - Re-tagging de contenido viejo sin data-jse-block
│   ├── _htmlToElement() - Crea DOM element desde HTML string
│   ├── injectBlockCSS() - Inyecta CSS de bloque en iframe
│   ├── updateAttrInputs() - Renderiza settings de bloque o fallback genérico
│   ├── generateFullHtml() - Exporta HTML limpio (sin data-jse-block)
│   └── API Pública (getHtml, setHtml, etc.)
└── ShouEditor (API global)
```

### Opciones de Configuración

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `theme` | `'dark' \| 'light'` | `'dark'` | Tema de colores |
| `width` | `string` | `'100%'` | Ancho del editor |
| `height` | `string` | `'100vh'` | Alto del editor |
| `defaultView` | `'visual' \| 'code'` | `'visual'` | Vista inicial |
| `defaultDevice` | `'desktop' \| 'tablet' \| 'mobile'` | `'desktop'` | Dispositivo inicial |
| `storagePrefix` | `string` | `'shou-editor-'` | Prefijo localStorage |
| `bootstrapCss` | `string` | CDN Bootstrap 5 | URL CSS Bootstrap |
| `blocksPath` | `string` | `'blocks/'` | Ruta a bloques JSON (local o remota) |
| `customBlocks` | `object` | `{}` | Bloques personalizados (merge con JSON) |
| `lang` | `'en' \| 'es'` | `'en'` | Idioma de la interfaz |
| `saveFormat` | `'html' \| 'json'` | `'html'` | Formato: página completa o JSON {html,css,js} |
| `saveTarget` | `'local' \| 'remote'` | `'local'` | Destino: descarga o POST a endpoint |
| `saveEndpoint` | `string \| null` | `null` | URL para POST remoto |
| `saveFilename` | `string` | `'proyecto'` | Nombre base del archivo |
| `onSaveSuccess` | `function \| null` | `null` | Callback POST exitoso |
| `onSaveError` | `function \| null` | `null` | Callback POST fallido |

### API Pública

```javascript
const editor = ShouEditor.init('#container', config);

// Getters
editor.getHtml()   // Obtener HTML
editor.getCss()    // Obtener CSS
editor.getJs()     // Obtener JavaScript
editor.getCode()   // Obtener { html, css, js }

// Setters
editor.setHtml(html)
editor.setCss(css)
editor.setJs(js)
editor.setCode({ html, css, js })

// Acciones
editor.newProject()   // Nuevo proyecto
editor.save()         // Guardar (local o remoto segun config)
editor.preview()      // Vista previa
editor.setTheme('dark')
editor.toggleTheme()
editor.setLang('es')  // Cambiar idioma
editor.getLang()      // Obtener idioma actual
editor.setSaveFormat('json')  // Cambiar formato de guardado
editor.setSaveTarget('remote', 'https://...') // Cambiar destino
editor.bindToForm('#form')  // Vincular a formulario (hidden inputs automaticos)
editor.bindToForm('#form', { field: 'desc' }) // Campo unico JSON
editor.unbindForm()   // Desvincular formulario
editor.destroy()      // Destruir editor
```

### Bloques Incluidos

**Básicos:** Texto, Título, Imagen, Enlace, Divisor
**Layout:** Container, 2/3 Columnas
**Bootstrap:** Card, Alerta, Botón, Tabla, Accordion, Carousel, Modal, Tabs, Badge, Progress, List Group, Breadcrumb, Pagination, Spinner, Toast
**Formularios:** Input, Textarea, Select, Checkbox, Radio, File, Range, Switch
**Secciones:** Navbar, Hero, Features, Footer

### Archivos Principales

```
index.html          - Ejemplo de uso del plugin (muy simple)
js/app.js           - Plugin completo (~2500+ líneas)
js/image-editor.js  - Editor de imágenes standalone (~750 líneas)
blocks/             - Bloques JSON por categoría (36 archivos)
  _index.json       - Manifiesto de categorías y bloques
  basic/            - text, heading, image, link, divider
  layout/           - container, row-2, row-3
  bootstrap/        - card, alert, button, table, accordion, carousel, modal, tabs, badge, progress, list-group, breadcrumb, pagination, spinner, toast
  forms/            - form, input, textarea, select, checkbox, radio, file, range, switch
  sections/         - navbar, hero, features, footer
styles/             - Estilos CSS y atributos HTML (JSON externos)
  styles.json       - 9 secciones, ~80 propiedades CSS
  attributes.json   - 50+ tags HTML5 con atributos específicos
docs/               - Documentación actualizada
  INSTALLATION.md   - Guía de instalación completa
  QUICKSTART.md     - Inicio rápido
  README.md         - Documentación general
```

### Características Técnicas

- **100% Vanilla JavaScript** (sin dependencias)
- **CSS embebido** via getEditorCSS()
- **HTML generado** via getEditorTemplate()
- **IIFE Pattern** para evitar conflictos globales
- **LocalStorage** para persistencia automática
- **Bootstrap 5** solo en iframe canvas (CDN)
- **Soporte módulos ES6** y CommonJS
- **Scrollbars temáticos** vía CSS variables
- **Toggle switches** custom para checkboxes del panel settings
- **Async init** con `_init()` → `loadBlocks()` antes de render
- **Re-tagging** de contenido viejo en localStorage sin `data-jse-block`
- **Export limpio** `generateFullHtml()` elimina `data-jse-block` del HTML exportado
- **i18n** Sistema multiidioma con `Lang` object (en, es), función `t(key)`, fallback chain
- **Settings labels i18n** Bloques JSON y DefaultBlocks usan claves i18n (`setting.label`, etc.)

### Decisiones de Diseño del Usuario

1. **Iconos**: SVGs flat monocromo con `currentColor`, sin emojis ni colores. Estilo editor profesional.
2. **Mini toolbar**: Un único botón drag handle (4 flechas) para arrastrar + duplicar + eliminar. NO 4 botones de flechas separados.
3. **Indicador de drop**: Marco/outline del elemento target (NO línea horizontal a todo ancho). Borde dashed azul que enmarca el elemento, con clase `drop-before` o `drop-after` para indicar posición.
4. **Panel derecho "Ajustes"**: Editor dinámico de atributos HTML por tag (src, href, alt, etc.), NO selector de tema estático.
5. **Mini toolbar flip**: Cuando el elemento está pegado arriba del canvas, la toolbar aparece debajo en vez de esconderse fuera del borde.
6. **Outlines**: Botón toggle para mostrar contornos punteados de contenedores invisibles (div, section, etc.).
7. **Capas**: Panel con árbol DOM, cada capa muestra tag + primera clase CSS, click para seleccionar, separadores entre capas.
8. **Sincronización bidireccional**: Visual→Código al cambiar a código, Código→Visual al cambiar a visual (incluyendo CSS custom en iframe).
9. **Código formateado**: `formatHtml()` para indentar el HTML generado por el canvas visual.
10. **Copiar/Cortar/Pegar**: Ctrl+C/X/V en el editor visual con clipboard interno (outerHTML).
11. **Imágenes placeholder**: Usar `https://picsum.photos/1900/1000` (NO via.placeholder.com).
12. **Bloques JSON**: Sistema de bloques cargados desde archivos JSON en carpetas por categoría. Manifiesto `_index.json`. Opción `blocksPath` configurable (local o remoto). Fallback a DefaultBlocks si fetch falla. Cada bloque puede tener CSS propio.
13. **Settings por bloque**: Cada bloque JSON define sus propias propiedades editables en `settings[]`. Soporta: `text`, `checkbox`, `select` (con opciones), `options` (editor visual de opciones de `<select>` con add/remove), `prop: tagName` (cambiar tag). Los elementos insertados se marcan con `data-jse-block` para identificar el bloque de origen. Checkboxes de settings usan toggle switches custom con colores del tema.
14. **Scrollbars temáticos**: Barras de scroll estilizadas con CSS variables del tema (webkit + scrollbar-color).
15. **Export limpio**: `generateFullHtml()` elimina `data-jse-block` del HTML exportado para output limpio.
16. **Backwards compat**: `_retagBlocks()` re-identifica bloques de contenido viejo en localStorage que no tiene `data-jse-block`.
17. **i18n**: Sistema multiidioma. Default inglés (`en`). Configurable con `lang: 'es'`. Objeto `Lang` con traducciones planas (clave→string). Función `t(key)` con fallback: `Lang[currentLang][key]` → `Lang.en[key]` → key. Settings labels usan claves i18n en DefaultBlocks y JSON blocks. API: `setLang(lang)`, `getLang()`.
18. **Save configurable**: Dos opciones: `saveFormat` (`'html'` página completa | `'json'` solo contenido editado sin html/head/body) y `saveTarget` (`'local'` descarga | `'remote'` POST a `saveEndpoint`). Callbacks `onSaveSuccess`/`onSaveError`. API: `setSaveFormat()`, `setSaveTarget()`. El JSON format exporta `{html, css, js}` limpio (sin `data-jse-block`). El POST remoto envía siempre `Content-Type: application/json`.
19. **bindToForm**: `editor.bindToForm('#form')` vincula el editor a un formulario HTML. Al submit, crea/rellena hidden inputs automaticamente. 3 modos: campos separados (`editor_html`, `editor_css`, `editor_js`), campo unico JSON (`{ field: 'desc' }`), o campos custom (`{ htmlField, cssField, jsField }`). Solo un form a la vez (re-bind desvincula anterior). `unbindForm()` desvincula. `destroy()` desvincula tambien. El HTML exportado es limpio (sin `data-jse-block`).
20. **CDN compatible**: El plugin funciona desde CDN. Solo necesita `blocksPath` absoluto si los JSON no estan en ruta relativa. Sin image-editor.js, el editor funciona normal (guarda en `openImageEditor` comprueba `typeof JSImageEditor`).
21. **Estilos CSS dinámicos (JSON)**: Panel de estilos generado desde `styles/styles.json` con `_buildStylesPanel()`. 9 secciones (~80 props): dimensions, spacing, typography, background, borders, layout, flexbox, grid, transform. Soporta tipos: text, color, select. `DefaultStyles` como fallback inline. Se carga bajo demanda con `_loadStylesDef()`. Handler soporta `input[data-style]` y `select[data-style]`.
22. **Atributos HTML expandidos (JSON)**: `styles/attributes.json` define 50+ tags HTML5 con atributos específicos. `TagAttributes` expandido de 17 a 50+ tags. `BoolAttrs` expandido con autofocus, allowfullscreen, playsinline, etc. `_common` expandido: id, class, title, style, role, tabindex, lang, dir, hidden, draggable, contenteditable, spellcheck. Se cargan bajo demanda, fallback a constantes inline.
23. **Bootstrap blocks expandidos**: 11 nuevos bloques: accordion, carousel, modal, tabs, badge, progress, list-group, breadcrumb, pagination, spinner, toast. Total 15 bloques Bootstrap. Cada uno con iconos SVG, JSON en `blocks/bootstrap/`, y entrada en DefaultBlocks.
24. **Drag to code editor**: Al arrastrar un bloque al editor de código, se inserta el HTML/CSS en la posición del cursor. Barra indicadora azul (`jse-code-drop-bar`) muestra la línea exacta de inserción. Calcula posición por línea teniendo en cuenta scroll.

25. **Code Folding**: Plegado de código en el editor de texto. Detecta regiones plegables: HTML (pares de tags), CSS (bloques `{}`), JS (bloques `{}`, `()`, `[]`). Sistema virtual: `code[lang]` = real, `_displayCode[lang]` = visible. Gutter con iconos ▼/▶. Click en icono pliega/despliega. Atajos: Ctrl+Shift+[ fold, Ctrl+Shift+] unfold. Input handler convierte display→real automáticamente.
26. **Movimiento de bloques mejorado**: `_isHorizontalLayout()` detecta flex-row/grid. `_findBestGap()` usa mouseX para layouts horizontales y mouseY para verticales. Indicador de drop vertical para columnas. Alt+Flechas: ↑↓ reordenar, ←→ sacar/meter en contenedor. Layers panel arrastrables con drop en tercios (before/inside/after).
27. **Breadcrumb de navegación**: Barra breadcrumb en el canvas visual y el editor de código. Muestra cadena de padres clickable (`div › table › tbody › tr › td`). Permite seleccionar ancestros directamente. Panel lateral derecho muestra solo `<tag> .clase`.
28. **Sincronización visual↔código**: Al seleccionar un elemento, el editor HTML resalta y hace scroll al bloque correspondiente. `_highlightInCodeEditor()` busca el outerHTML del elemento en el código y selecciona el rango.
29. **Outline mejorado**: Selección naranja `#f97316` 3px con `box-shadow:inset` (no `outline`) para garantizar visibilidad en todos los elementos, incluso dentro de padres con `overflow:hidden`. Hover azul dashed con outline.
30. **Syntax highlighting personalizable**: Archivo `styles/highlight.json` define colores de tokens. CSS usa variables `--tok-*` con fallbacks. Colores por defecto optimizados para contraste: tags azul (`#569cd6`), atributos amarillo/gold (`#e5c07b`), strings naranja (`#ce9178`), keywords púrpura (`#c586c0`). `_applyHighlightTheme()` aplica los colores como CSS variables en el contenedor.

### Cambios vs Versión Anterior

1. **index.html**: Ahora solo tiene ~40 líneas (antes ~630)
2. **CSS externos eliminados**: Todo embebido en app.js
3. **Inicialización simplificada**: `ShouEditor.init('#el', config)`
4. **API consistente**: Métodos claros y documentados
