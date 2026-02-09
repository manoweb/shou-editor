# Shou Editor Installation

Shou Editor is a vanilla JavaScript plugin that creates a GrapesJS-style visual web page editor. It is 100% self-contained and generates its own HTML and CSS structure.

## Quick Installation

### 1. Include the Script

```html
<!-- Local file (minified versions recommended) -->
<script src="js/app.min.js"></script>

<!-- Or unminified versions for development -->
<script src="js/app.js"></script>

<!-- Or from CDN -->
<script src="https://cdn.example.com/js-editor/app.min.js"></script>
```

### 2. Image Editor (optional)

The image editor is an independent plugin. If included, an "Edit image" button appears when selecting an `<IMG>`. If not included, the editor works normally without that functionality.

```html
<!-- Optional: include BEFORE app.js -->
<script src="js/image-editor.min.js"></script>
<script src="js/app.min.js"></script>
```

### 3. Initialize the Editor

```html
<div id="editor"></div>

<script>
  // Initialize in a specific container
  const editor = ShouEditor.init('#editor', {
    theme: 'dark'
  });
</script>
```

Or on the entire body:

```html
<script>
  // Initialize on document.body
  const editor = ShouEditor.init({ theme: 'dark' });
</script>
```

---

## CDN Usage

The plugin works from any CDN. Just note that `blocksPath` uses relative paths by default, so when using a CDN it is best to use an absolute path:

```html
<script src="https://cdn.example.com/js-editor/image-editor.min.js"></script>
<script src="https://cdn.example.com/js-editor/app.min.js"></script>
<script>
  const editor = ShouEditor.init('#editor', {
    blocksPath: 'https://cdn.example.com/js-editor/blocks/'
  });
</script>
```

> If you don't configure `blocksPath`, the editor uses `'blocks/'` relative to the current HTML file. If it cannot find the JSON files, it falls back to the built-in default blocks (`DefaultBlocks`), which include all basic, layout, Bootstrap, and form blocks.

---

## Complete Example

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Editor</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
  </style>
</head>
<body>
  <div id="mi-editor"></div>

  <script src="js/image-editor.min.js"></script> <!-- Opcional -->
  <script src="js/app.min.js"></script>
  <script>
    const editor = ShouEditor.init('#mi-editor', {
      theme: 'dark',
      width: '100%',
      height: '100vh',
      defaultView: 'visual',
      defaultDevice: 'desktop'
    });
  </script>
</body>
</html>
```

---

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `'dark' \| 'light'` | `'dark'` | Color theme |
| `width` | `string` | `'100%'` | Editor width |
| `height` | `string` | `'100vh'` | Editor height |
| `defaultView` | `'visual' \| 'code'` | `'visual'` | Initial view |
| `defaultDevice` | `'desktop' \| 'tablet' \| 'mobile'` | `'desktop'` | Initial device |
| `storagePrefix` | `string` | `'shou-editor-'` | Prefix for localStorage |
| `bootstrapCss` | `string` | Bootstrap 5.3.2 CDN | Bootstrap CSS URL |
| `blocksPath` | `string` | `'blocks/'` | Path to the JSON blocks folder (local or remote URL) |
| `customBlocks` | `object` | `{}` | Custom blocks (inline, merged with the JSON blocks) |
| `lang` | `'en' \| 'es'` | `'en'` | Editor interface language |
| `saveFormat` | `'html' \| 'json'` | `'html'` | Save format: full HTML page or JSON with separate html/css/js |
| `saveTarget` | `'local' \| 'remote'` | `'local'` | Destination: local download or POST to an endpoint |
| `saveEndpoint` | `string \| null` | `null` | URL for POST when saveTarget is 'remote' |
| `saveFilename` | `string` | `'proyecto'` | Base name of the downloaded file |
| `onSaveSuccess` | `function \| null` | `null` | Callback after successful POST: `(response) => {}` |
| `onSaveError` | `function \| null` | `null` | Callback after failed POST: `(error) => {}` |
| `stylesPath` | `string` | `'styles/'` | Path to the styles and attributes JSON files |

---

## CSS Styles Panel

The styles panel is dynamically generated from `styles/styles.json`. It contains 9 sections with ~80 CSS properties:

| Section | Properties |
|---------|------------|
| **Dimensions** | width, height, min/max width, min/max height, overflow |
| **Spacing** | margin (top/right/bottom/left), padding (top/right/bottom/left) |
| **Typography** | font-family, font-size, font-weight, font-style, line-height, letter-spacing, text-align, text-decoration, text-transform, white-space, word-break, color |
| **Background** | background-color, background-image, background-size, background-position, background-repeat, opacity |
| **Borders** | border (top/right/bottom/left), border-color, border-radius, outline, box-shadow |
| **Layout** | display, position, top/right/bottom/left, z-index, float, clear, visibility, cursor |
| **Flexbox** | flex-direction, flex-wrap, justify-content, align-items, align-content, gap, flex, flex-grow/shrink/basis, align-self, order |
| **Grid** | grid-template-columns/rows, grid-column/row, gap, place-items, place-content |
| **Transform** | transform, transform-origin, transition, animation, filter |

### Customizing Styles

Edit `styles/styles.json` to add/remove sections or properties. The format is:

```json
{
  "sections": [
    {
      "id": "mi-seccion",
      "label": "styles.miSeccion",
      "props": [
        { "label": "Mi Prop", "style": "miPropiedad", "type": "text" },
        { "label": "Opciones", "style": "otraProp", "type": "select", "options": ["", "valor1", "valor2"] },
        { "label": "Color", "style": "colorProp", "type": "color" }
      ]
    }
  ]
}
```

Supported types: `text`, `color`, `select`.

## HTML Attributes by Tag

The editable attributes for each HTML tag are defined in `styles/attributes.json`. It includes 50+ HTML5 tags with their specific attributes, plus 12 common attributes (id, class, title, style, role, tabindex, lang, dir, hidden, draggable, contenteditable, spellcheck).

To customize, edit `styles/attributes.json`.

---

## Internationalization (i18n)

The editor supports multiple languages. By default it displays in English (`en`). Available languages: `en` (English), `es` (Spanish).

### Configure Language

```javascript
const editor = ShouEditor.init('#editor', {
  lang: 'es'  // Interfaz en español
});
```

### Change Language at Runtime

```javascript
editor.setLang('es');  // Cambiar a español
editor.setLang('en');  // Cambiar a inglés

const lang = editor.getLang();  // Obtener idioma actual
```

### Settings Labels i18n

The `label` fields in block JSON settings use i18n keys (e.g., `"setting.label"`, `"setting.name"`). The editor translates them automatically based on the active language. If a label has no i18n key, it is displayed as-is (fallback).

```json
{
  "settings": [
    { "label": "setting.label", "prop": "textContent", "selector": "label", "type": "text" },
    { "label": "setting.name", "attr": "name", "selector": "input", "type": "text" },
    { "label": "Mi campo custom", "attr": "data-custom", "type": "text" }
  ]
}
```

---

## Editor API

### Get Code

```javascript
const editor = ShouEditor.init('#editor');

// Get individual code
const html = editor.getHtml();
const css = editor.getCss();
const js = editor.getJs();

// Get all code
const code = editor.getCode();
console.log(code.html, code.css, code.js);
```

### Set Code

```javascript
// Set individual code
editor.setHtml('<h1>Hola Mundo</h1>');
editor.setCss('h1 { color: red; }');
editor.setJs('console.log("Hola");');

// Set all code
editor.setCode({
  html: '<div>Contenido</div>',
  css: '.clase { color: blue; }',
  js: 'alert("Hola");'
});
```

### Actions

```javascript
// Create new project
editor.newProject();

// Save (local or remote depending on config)
editor.save();

// Preview in new window
editor.preview();

// Change theme
editor.setTheme('light');
editor.toggleTheme();

// Change language
editor.setLang('es');
editor.getLang(); // 'es'

// Change save format
editor.setSaveFormat('json');  // 'html' | 'json'

// Change save target
editor.setSaveTarget('remote', 'https://api.example.com/save');

// Bind to a form
editor.bindToForm('#form');                        // 3 fields: editor_html, editor_css, editor_js
editor.bindToForm('#form', { field: 'desc' });     // 1 JSON field
editor.unbindForm();                               // Unbind

// Destroy the editor
editor.destroy();
```

---

## Save Configuration

The editor supports two save modes and two destinations.

### Save Format

- **`'html'`** (default): Generates a complete HTML page with `<!DOCTYPE>`, `<head>`, Bootstrap CDN, included styles and scripts.
- **`'json'`**: Generates a JSON object with `{ html, css, js }` separated. Only the edited content, without `<html>`, `<head>`, `<body>` tags.

### Save Destination

- **`'local'`** (default): Downloads the file to the user's disk.
- **`'remote'`**: Sends the content via POST to a configured endpoint.

### Examples

```javascript
// Save as downloadable JSON
const editor = ShouEditor.init('#editor', {
  saveFormat: 'json',
  saveFilename: 'mi-proyecto'
});

// Save via POST to a server
const editor = ShouEditor.init('#editor', {
  saveFormat: 'json',
  saveTarget: 'remote',
  saveEndpoint: 'https://api.example.com/projects/save',
  onSaveSuccess: (response) => {
    console.log('Guardado exitoso:', response);
  },
  onSaveError: (error) => {
    alert('Error al guardar: ' + error.message);
  }
});
```

### Remote POST Format

When `saveTarget: 'remote'`, the editor performs `fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })`.

- With `saveFormat: 'json'`: the body is `{"html":"...","css":"...","js":"..."}`
- With `saveFormat: 'html'`: the body is `{"html":"<!DOCTYPE html>..."}`

### Change at Runtime

```javascript
editor.setSaveFormat('json');
editor.setSaveTarget('remote', 'https://api.example.com/save');
editor.save(); // Now performs POST with JSON
```

---

## Form Integration

To integrate the editor inside an HTML form (for example, the "description" field of a product), use `bindToForm()`. The editor automatically creates `<input type="hidden">` fields and populates them on submit.

### Basic Usage (3 separate fields)

```html
<form id="form-producto" method="POST" action="/api/productos">
  <input type="text" name="nombre">
  <input type="text" name="precio">
  <div id="editor-descripcion"></div>
  <button type="submit">Guardar</button>
</form>

<script src="js/app.js"></script>
<script>
  const editor = ShouEditor.init('#editor-descripcion', {
    theme: 'dark',
    height: '400px'
  });

  // Bind to the form: creates fields editor_html, editor_css, editor_js
  editor.bindToForm('#form-producto');
</script>
```

The server receives: `nombre`, `precio`, `editor_html`, `editor_css`, `editor_js`.

### Single JSON Field

```javascript
// A single field with all content as JSON
editor.bindToForm('#form-producto', { field: 'descripcion' });
```

The server receives: `nombre`, `precio`, `descripcion` (JSON string: `{"html":"...","css":"...","js":"..."}`).

### Custom Field Names

```javascript
editor.bindToForm('#form-producto', {
  htmlField: 'contenido_html',
  cssField: 'contenido_css',
  jsField: 'contenido_js'
});
```

### Load Content from Database

#### Backend Renders the HTML (PHP, Django, Rails, etc.)

If the backend injects values directly into the page:

```html
<!-- PHP example with 3 separate fields -->
<script>
  const editor = ShouEditor.init('#editor', { theme: 'dark' });

  editor.setCode({
    html: `<?= htmlspecialchars($producto['editor_html'], ENT_QUOTES) ?>`,
    css: `<?= htmlspecialchars($producto['editor_css'], ENT_QUOTES) ?>`,
    js: `<?= htmlspecialchars($producto['editor_js'], ENT_QUOTES) ?>`
  });
</script>

<!-- PHP example with single JSON field -->
<script>
  const editor = ShouEditor.init('#editor', { theme: 'dark' });

  const data = JSON.parse('<?= addslashes($producto["descripcion"]) ?>');
  editor.setCode(data);
</script>
```

#### Load via AJAX / fetch

If the data is obtained from an API:

```javascript
const editor = ShouEditor.init('#editor', { theme: 'dark' });

fetch('/api/productos/123')
  .then(r => r.json())
  .then(producto => {
    // With 3 separate fields:
    editor.setCode({
      html: producto.editor_html,
      css: producto.editor_css,
      js: producto.editor_js
    });

    // Or with single JSON field:
    // editor.setCode(JSON.parse(producto.descripcion));
  });
```

#### Complete Example: Edit an Existing Product

```html
<form id="form-producto" method="POST" action="/api/productos/123">
  <input type="text" name="nombre" value="Mi Producto">
  <input type="text" name="precio" value="99.99">
  <div id="editor-descripcion"></div>
  <button type="submit">Guardar</button>
</form>

<script src="js/app.js"></script>
<script>
  const editor = ShouEditor.init('#editor-descripcion', {
    theme: 'dark',
    height: '400px'
  });

  // 1. Bind to the form (creates hidden inputs automatically)
  editor.bindToForm('#form-producto');

  // 2. Load existing content from the server
  fetch('/api/productos/123')
    .then(r => r.json())
    .then(p => {
      editor.setCode({ html: p.editor_html, css: p.editor_css, js: p.editor_js });
    });

  // 3. On submit, the form sends nombre + precio + editor_html + editor_css + editor_js
</script>
```

> In all cases, `editor.setCode({ html, css, js })` restores the complete editor (visual + code).

### Unbind

```javascript
editor.unbindForm(); // Removes the form listener
```

> **Note:** `bindToForm()` only binds one form at a time. If you call it again with a different form, the previous one is automatically unbound. Calling `editor.destroy()` also unbinds the form.

---

## JSON Block System

Blocks are loaded from JSON files organized in folders by category. The editor loads them dynamically on initialization.

### Folder Structure

```
blocks/
├── _index.json          ← Manifest (list of categories and blocks)
├── basic/
│   ├── text.json
│   ├── heading.json
│   ├── image.json
│   ├── link.json
│   └── divider.json
├── layout/
│   ├── container.json
│   ├── row-2.json
│   └── row-3.json
├── bootstrap/
│   ├── card.json
│   ├── alert.json
│   ├── button.json
│   ├── table.json
│   ├── accordion.json
│   ├── carousel.json
│   ├── modal.json
│   ├── tabs.json
│   ├── badge.json
│   ├── progress.json
│   ├── list-group.json
│   ├── breadcrumb.json
│   ├── pagination.json
│   ├── spinner.json
│   └── toast.json
├── forms/
│   ├── form.json
│   ├── input.json
│   ├── textarea.json
│   ├── select.json
│   ├── checkbox.json
│   ├── radio.json
│   ├── file.json
│   ├── range.json
│   └── switch.json
└── sections/
    ├── navbar.json
    ├── hero.json
    ├── features.json
    └── footer.json
```

### Manifest `_index.json`

Defines the order of categories and blocks:

```json
{
  "categories": [
    {
      "id": "basic",
      "label": "Basic",
      "blocks": ["text", "heading", "image", "link", "divider"]
    }
  ]
}
```

### JSON Block Format

```json
{
  "id": "hero",
  "label": "Hero",
  "icon": "hero",
  "html": "<section class=\"py-5 bg-primary\">...</section>",
  "css": ".hero-custom { min-height: 400px; }",
  "settings": [
    { "label": "setting.title", "prop": "textContent", "selector": "h1", "type": "text" },
    { "label": "setting.buttonUrl", "attr": "href", "selector": ".btn", "type": "text" }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique block identifier |
| `label` | `string` | Yes | Visible name in the panel |
| `icon` | `string` | Yes | Icon key (`text`, `hero`, `card`, etc.) |
| `html` | `string` | Yes | HTML inserted into the canvas |
| `css` | `string` | No | Custom CSS injected into the iframe |
| `settings` | `array` | No | Editable properties in the Settings panel |

### Settings: Editable Properties per Block

Each entry in `settings` defines an editable field that appears in the "Settings" panel when selecting an element from this block.

```json
{ "label": "setting.label", "attr": "name", "selector": "input", "type": "text" }
```

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | i18n key or visible field name (e.g., `"setting.label"`) |
| `attr` | `string` | HTML attribute to edit (e.g., `href`, `src`, `class`) |
| `prop` | `string` | Alternative JS property: `textContent`, `innerHTML`, `tagName` |
| `selector` | `string` | CSS selector of the sub-element to edit (if omitted, edits the root) |
| `type` | `string` | Input type: `text`, `checkbox`, `select`, `options` |
| `options` | `array` | For `type: "select"`: list of possible values |
| `all` | `boolean` | Apply the change to all elements matching `selector` |

**Available types:**
- `text` — Free text field
- `checkbox` — Toggle switch with theme colors for boolean attributes (`required`, `disabled`, etc.)
- `select` — Dropdown with predefined options (`options: [...]`)
- `options` — Visual options editor for `<select>` with add/remove buttons per row (value + text)

### Configure Blocks Path

```javascript
// Local path (default)
const editor = ShouEditor.init('#editor', {
  blocksPath: 'blocks/'
});

// Remote path
const editor = ShouEditor.init('#editor', {
  blocksPath: 'https://cdn.example.com/blocks/'
});
```

If the JSON files cannot be loaded (e.g., `file://`), the editor uses the built-in default blocks.

### Create a Custom Block

1. Create a JSON file in the appropriate category subfolder:

```json
// blocks/basic/video.json
{
  "id": "video",
  "label": "Video",
  "icon": "image",
  "html": "<video controls class=\"w-100\"><source src=\"video.mp4\" type=\"video/mp4\"></video>"
}
```

2. Add the ID to the `_index.json` manifest:

```json
{
  "categories": [
    {
      "id": "basic",
      "label": "Basic",
      "blocks": ["text", "heading", "image", "link", "divider", "video"]
    }
  ]
}
```

### Inline Blocks (without JSON)

You can also pass blocks directly in the configuration using `customBlocks`:

```javascript
const editor = ShouEditor.init('#editor', {
  customBlocks: {
    miCategoria: [
      {
        id: 'mi-bloque',
        label: 'Mi Bloque',
        icon: 'B',
        html: '<div class="mi-bloque">Contenido personalizado</div>'
      }
    ]
  }
});
```

### Block Structure (inline)

```javascript
{
  id: 'identificador-unico',  // ID único del bloque
  label: 'Nombre Visible',    // Nombre que se muestra en el panel
  icon: 'X',                  // Texto corto para el icono
  html: '<div>HTML</div>'     // Código HTML que se inserta
}
```

---

## Included Blocks

### Basic
- Text, Heading, Image, Link, Divider

### Layout
- Container, 2 Columns, 3 Columns

### Bootstrap
- Card, Alert, Button, Table

### Forms
- Input, Textarea, Select, Checkbox, Radio, File, Range, Switch

### Sections
- Navbar, Hero, Features, Footer

---

## Multiple Instances

```javascript
// Create multiple editors on the same page
const editor1 = ShouEditor.init('#editor1', {
  storagePrefix: 'editor1-',
  theme: 'dark'
});

const editor2 = ShouEditor.init('#editor2', {
  storagePrefix: 'editor2-',
  theme: 'light'
});
```

---

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';

function EditorComponent() {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = ShouEditor.init(containerRef.current, {
        theme: 'dark',
        height: '600px'
      });
    }
    return () => editorRef.current?.destroy();
  }, []);

  return <div ref={containerRef} />;
}
```

### Vue

```vue
<template>
  <div ref="editorContainer"></div>
</template>

<script>
export default {
  data() {
    return { editor: null };
  },
  mounted() {
    this.editor = ShouEditor.init(this.$refs.editorContainer, {
      theme: 'dark',
      height: '600px'
    });
  },
  beforeUnmount() {
    this.editor?.destroy();
  }
};
</script>
```

---

## LocalStorage

The editor automatically saves to localStorage:

```javascript
// Keys used (with default prefix 'shou-editor-'):
// shou-editor-html    - HTML code
// shou-editor-css     - CSS code
// shou-editor-js      - JavaScript code
// shou-editor-theme   - Current theme

// Clear saved data
localStorage.removeItem('shou-editor-html');
localStorage.removeItem('shou-editor-css');
localStorage.removeItem('shou-editor-js');
localStorage.removeItem('shou-editor-theme');
```

---

## No Dependencies

The plugin is **100% vanilla JavaScript**:
- Does not require npm/yarn
- Does not require bundlers (webpack, vite)
- Does not require frameworks (React, Vue)
- Works by simply including the script
- CSS is automatically embedded

Bootstrap 5 is loaded from CDN only inside the canvas iframe for the preview.

---

## Code Folding

The code editor includes VS Code-style block folding.

### How It Works

- **HTML**: Folds tag pairs (`<div>...</div>`, `<section>...</section>`, etc.). Ignores void elements (img, br, hr, input...)
- **CSS**: Folds `{ }` blocks (CSS rules)
- **JS**: Folds multiline `{ }`, `( )`, and `[ ]` blocks

### Usage

- **Click on the arrow icons** in the line gutter to fold/unfold
- **Ctrl+Shift+[** folds the block at the cursor position
- **Ctrl+Shift+]** unfolds the block at the cursor position

### Internal Architecture

The textarea cannot hide lines, so a virtual code system is used:

- `this.code[lang]` = full REAL code (never modified by folding)
- `this._foldState[lang]` = Set of collapsed start lines
- `this._foldRegions[lang]` = Array of `{start, end}` detected regions
- `this._displayCode[lang]` = visible code in textarea with collapsed regions
- `this._displayToRealMap[lang]` = mapping from display line to real line

Main methods:
- `_detectFoldRegions(code, lang)` -- detects foldable regions
- `_buildDisplayCode(lang)` -- generates display code
- `_displayToRealCode(lang, text)` -- reconstructs real code from display
- `_renderFoldableLines(lang)` -- renders gutter with fold icons
- `_toggleFold(lang, line)` -- toggles folding of a region
- `_refreshCodeEditor(lang)` -- refreshes everything after a fold

---

## Block Movement System

### Enhanced Drag & Drop

The drop algorithm automatically detects horizontal layouts (flex-row, grid) and uses the X axis for positioning. For vertical layouts it uses the Y axis.

- `_isHorizontalLayout(parent)` -- detects if a container is horizontal
- `_findBestGap()` -- calculates gaps on both axes based on direction
- The drop indicator shows a vertical bar for horizontal insertions

### Keyboard Movement

With a selected element:
- **Alt+Up Arrow** move up (before the previous sibling)
- **Alt+Down Arrow** move down (after the next sibling)
- **Alt+Left Arrow** move out of the container (to the parent level)
- **Alt+Right Arrow** move into an adjacent container

### Drag & Drop in the Layers Panel

Layers are draggable. When dragging over another layer:
- **Top third** = insert before
- **Middle third** = insert inside (as child)
- **Bottom third** = insert after

---

## Navigation Breadcrumb

When selecting an element, a breadcrumb bar appears in:
- **Visual editor** -- bottom of the canvas
- **Code editor** -- bottom of the editor

It shows the parent chain: `div.container > table > tbody > tr > td`

Click on any ancestor to select it directly. Useful for selecting tables, carousels, or other deeply nested containers.

---

## Visual <-> Code Synchronization

When selecting an element (from the canvas, layers, or breadcrumbs), the HTML code editor automatically:
1. Selects (highlights) the complete HTML block of the element
2. Scrolls to that position

---

## Customizable Syntax Highlighting

The code editor includes syntax highlighting for HTML, CSS, and JS. Colors can be customized with a JSON file.

### Available Tokens

| Token | Description | Default |
|-------|-------------|---------|
| `comment` | Comments | `#6a9955` |
| `tag` | HTML tag names | `#569cd6` |
| `attr` | HTML attribute names | `#9cdcfe` |
| `str` | Strings / attribute values | `#ce9178` |
| `kw` | Keywords (JS: const, let, if... / CSS: @media...) | `#c586c0` |
| `num` | Numbers and hex colors | `#b5cea8` |
| `bool` | Booleans (true/false/null) | `#569cd6` |
| `fn` | JS function names | `#dcdcaa` |
| `prop` | CSS properties | `#9cdcfe` |
| `punct` | Punctuation (`<`, `>`, `=`, `:`, `;`) | `#808080` |
| `unit` | CSS units (px, em, rem, %, vh, vw, s, ms, deg) | `#b5cea8` |
| `selector` | CSS selectors (.class, #id, tag) | `#d7ba7d` |

### Customize Colors

Create/edit `styles/highlight.json`:

```json
{
  "name": "Mi Tema",
  "tokens": {
    "comment":  "#6a9955",
    "tag":      "#ff7b72",
    "attr":     "#79c0ff",
    "str":      "#a5d6ff",
    "kw":       "#ff7b72",
    "num":      "#79c0ff",
    "bool":     "#79c0ff",
    "fn":       "#d2a8ff",
    "prop":     "#79c0ff",
    "punct":    "#8b949e",
    "unit":     "#79c0ff",
    "selector": "#ffa657"
  }
}
```

It is not necessary to include all tokens -- any tokens not present in the JSON will use the default color.

### Architecture

- Colors are applied as CSS custom properties (`--tok-comment`, `--tok-tag`, etc.)
- They are loaded from `styles/highlight.json` on initialization (with fallback if the file does not exist)
- The `stylesPath` option configures the base path for the JSON file

---

## Image Editor (Standalone)

The image editor can be used independently as a Photoshop-like editor in the browser.

### Initialization

```html
<script src="js/image-editor.min.js"></script>
<script>
  // Embedded mode
  const imgEditor = JSImageEditor.init('#container', {
    theme: 'dark',
    lang: 'en',
    preset: { width: 800, height: 600 },
    onSave: (base64) => uploadImage(base64)
  });

  // Or modal mode
  JSImageEditor.open(existingImageUrl, {
    onSave: (base64) => updateAvatar(base64)
  });
</script>
```

### JSON Configuration

You can use `js/image-editor-config.json` to configure tools, panels, and filters:

```json
{
  "theme": "dark",
  "lang": "en",
  "tools": {
    "drawing": ["move", "pencil", "eraser", "eyedropper", "fill", "gradient",
                "rect", "circle", "line", "arrow", "text",
                {"group": "select", "tools": ["selectRect", "selectEllipse", "selectPoly", "selectFree", "selectWand"]}],
    "transform": ["crop", "resize", "rotateLeft", "rotateRight", "flipH", "flipV"]
  },
  "panels": { "layers": true, "filters": true, "statusBar": true },
  "filters": ["brightness", "contrast", "saturation", "blur", "grayscale", "sepia", "hue"]
}
```

### Selection Tools

5 selection tools with marching ants animation:

| Tool | Description |
|------|-------------|
| **selectRect** | Rectangular selection |
| **selectEllipse** | Elliptical selection |
| **selectPoly** | Polygonal selection (click to add points, double-click to close) |
| **selectFree** | Freehand selection |
| **selectWand** | Magic wand (selects by similar color, with configurable tolerance) |

Selection actions: Copy (`Ctrl+C`), Cut (`Ctrl+X`), Paste as new layer (`Ctrl+V`), Select all (`Ctrl+A`), Deselect (`Ctrl+D`), Invert (`Ctrl+Shift+I`).

### Text Layers with Google Fonts

- 80+ Google Fonts preloaded, loaded via CDN
- Search dialog with font preview
- Custom font support
- Advanced properties: weight, style, letter spacing, line height, decoration, alignment

### Layer Styles (Blending Options)

Each layer can have Photoshop-style effects:

| Effect | Properties |
|--------|------------|
| **Drop Shadow** | offsetX, offsetY, blur, color, opacity |
| **Inner Shadow** | offsetX, offsetY, blur, color, opacity |
| **Outer Glow** | blur, color, opacity |
| **Stroke** | size, color, position (inside/center/outside) |
| **Color Overlay** | color, opacity, blendMode |

Accessible via double-click on a layer or right-click then "Layer Styles".

### Import / Export

**Import**: "Import" button or drag an image onto the canvas. If layers already exist, the image is added as a new layer.

**Export**: Dialog with format selection (PNG/JPEG/WebP), quality slider for JPEG/WebP, and file size estimation.

### Color Palette

All color selectors include:
- Native `<input type="color">` input
- Editable hex field (`#RRGGBB` format)
- Palette button with 60 predefined web colors
- Custom input for any hex color

### Resize Handles

- 8 resize handles (corners + edge centers)
- Central handle for moving
- Shift + drag for proportional scaling
- Contextual cursor based on handle position

### Image Editor Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+C` | Copy selection |
| `Ctrl+X` | Cut selection |
| `Ctrl+V` | Paste as new layer |
| `Ctrl+A` | Select all |
| `Ctrl+D` | Deselect |
| `Ctrl+Shift+I` | Invert selection |
| `Ctrl++` | Zoom in |
| `Ctrl+-` | Zoom out |
| `Ctrl+0` | Fit to screen |
| `Delete` | Delete selection |

---

## Minified Versions

The `.min.js` files are generated with [terser](https://github.com/terser/terser):

```bash
npx terser js/image-editor.js -o js/image-editor.min.js --compress --mangle
npx terser js/app.js -o js/app.min.js --compress --mangle
```

The demo HTML files (`test-js-editor.html`, `test-image-editor.html`) reference the `.min.js` versions. The unminified `.js` files are the development source.

---

## Compatibility

| Browser | Minimum Version |
|---------|-----------------|
| Chrome  | 90+             |
| Firefox | 88+             |
| Safari  | 14+             |
| Edge    | 90+             |
