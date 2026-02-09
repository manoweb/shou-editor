# Instalación de Shou Editor

Shou Editor es un plugin JavaScript vanilla que crea un editor visual de páginas web estilo GrapesJS. Es 100% autónomo y genera su propia estructura HTML y CSS.

## Instalación Rápida

### 1. Incluir el Script

```html
<!-- Archivo local (versiones minificadas recomendadas) -->
<script src="js/app.min.js"></script>

<!-- O versiones sin minificar para desarrollo -->
<script src="js/app.js"></script>

<!-- O desde CDN -->
<script src="https://cdn.example.com/js-editor/app.min.js"></script>
```

### 2. Editor de Imagenes (opcional)

El editor de imagenes es un plugin independiente. Si se incluye, aparece un boton "Editar imagen" al seleccionar un `<IMG>`. Si no se incluye, el editor funciona normalmente sin esa funcionalidad.

```html
<!-- Opcional: incluir ANTES de app.js -->
<script src="js/image-editor.min.js"></script>
<script src="js/app.min.js"></script>
```

### 3. Inicializar el Editor

```html
<div id="editor"></div>

<script>
  // Inicializar en un contenedor específico
  const editor = ShouEditor.init('#editor', {
    theme: 'dark'
  });
</script>
```

O en todo el body:

```html
<script>
  // Inicializar en document.body
  const editor = ShouEditor.init({ theme: 'dark' });
</script>
```

---

## Uso desde CDN

El plugin funciona desde cualquier CDN. Solo hay que tener en cuenta que `blocksPath` usa rutas relativas por defecto, asi que desde CDN conviene usar una ruta absoluta:

```html
<script src="https://cdn.example.com/js-editor/image-editor.min.js"></script>
<script src="https://cdn.example.com/js-editor/app.min.js"></script>
<script>
  const editor = ShouEditor.init('#editor', {
    blocksPath: 'https://cdn.example.com/js-editor/blocks/'
  });
</script>
```

> Si no configuras `blocksPath`, el editor usa `'blocks/'` relativo al HTML actual. Si no encuentra los JSON, usa los bloques por defecto integrados (`DefaultBlocks`), que incluyen todos los bloques basicos, layout, Bootstrap y formularios.

---

## Ejemplo Completo

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

## Opciones de Configuración

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `theme` | `'dark' \| 'light'` | `'dark'` | Tema de colores |
| `width` | `string` | `'100%'` | Ancho del editor |
| `height` | `string` | `'100vh'` | Alto del editor |
| `defaultView` | `'visual' \| 'code'` | `'visual'` | Vista inicial |
| `defaultDevice` | `'desktop' \| 'tablet' \| 'mobile'` | `'desktop'` | Dispositivo inicial |
| `storagePrefix` | `string` | `'shou-editor-'` | Prefijo para localStorage |
| `bootstrapCss` | `string` | CDN Bootstrap 5.3.2 | URL del CSS de Bootstrap |
| `blocksPath` | `string` | `'blocks/'` | Ruta a la carpeta de bloques JSON (local o URL remota) |
| `customBlocks` | `object` | `{}` | Bloques personalizados (inline, se mergean con los JSON) |
| `lang` | `'en' \| 'es'` | `'en'` | Idioma de la interfaz del editor |
| `saveFormat` | `'html' \| 'json'` | `'html'` | Formato de guardado: página completa o JSON con html/css/js separados |
| `saveTarget` | `'local' \| 'remote'` | `'local'` | Destino: descarga local o POST a endpoint |
| `saveEndpoint` | `string \| null` | `null` | URL para POST cuando saveTarget es 'remote' |
| `saveFilename` | `string` | `'proyecto'` | Nombre base del archivo descargado |
| `onSaveSuccess` | `function \| null` | `null` | Callback tras POST exitoso: `(response) => {}` |
| `onSaveError` | `function \| null` | `null` | Callback tras POST fallido: `(error) => {}` |
| `stylesPath` | `string` | `'styles/'` | Ruta a los JSON de estilos y atributos |

---

## Panel de Estilos CSS

El panel de estilos se genera dinámicamente desde `styles/styles.json`. Contiene 9 secciones con ~80 propiedades CSS:

| Sección | Propiedades |
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

### Personalizar estilos

Edita `styles/styles.json` para añadir/quitar secciones o propiedades. El formato es:

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

Tipos soportados: `text`, `color`, `select`.

## Atributos HTML por Tag

Los atributos editables de cada tag HTML se definen en `styles/attributes.json`. Incluye 50+ tags HTML5 con sus atributos específicos, más 12 atributos comunes (id, class, title, style, role, tabindex, lang, dir, hidden, draggable, contenteditable, spellcheck).

Para personalizar, edita `styles/attributes.json`.

---

## Internacionalización (i18n)

El editor soporta múltiples idiomas. Por defecto se muestra en inglés (`en`). Idiomas disponibles: `en` (inglés), `es` (español).

### Configurar idioma

```javascript
const editor = ShouEditor.init('#editor', {
  lang: 'es'  // Interfaz en español
});
```

### Cambiar idioma en runtime

```javascript
editor.setLang('es');  // Cambiar a español
editor.setLang('en');  // Cambiar a inglés

const lang = editor.getLang();  // Obtener idioma actual
```

### Settings labels i18n

Los `label` de los settings en bloques JSON usan claves i18n (ej: `"setting.label"`, `"setting.name"`). El editor los traduce automáticamente según el idioma activo. Si un label no tiene clave i18n, se muestra tal cual (fallback).

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

## API del Editor

### Obtener Código

```javascript
const editor = ShouEditor.init('#editor');

// Obtener código individual
const html = editor.getHtml();
const css = editor.getCss();
const js = editor.getJs();

// Obtener todo el código
const code = editor.getCode();
console.log(code.html, code.css, code.js);
```

### Establecer Código

```javascript
// Establecer código individual
editor.setHtml('<h1>Hola Mundo</h1>');
editor.setCss('h1 { color: red; }');
editor.setJs('console.log("Hola");');

// Establecer todo el código
editor.setCode({
  html: '<div>Contenido</div>',
  css: '.clase { color: blue; }',
  js: 'alert("Hola");'
});
```

### Acciones

```javascript
// Crear nuevo proyecto
editor.newProject();

// Guardar (local o remoto segun config)
editor.save();

// Vista previa en nueva ventana
editor.preview();

// Cambiar tema
editor.setTheme('light');
editor.toggleTheme();

// Cambiar idioma
editor.setLang('es');
editor.getLang(); // 'es'

// Cambiar formato de guardado
editor.setSaveFormat('json');  // 'html' | 'json'

// Cambiar destino de guardado
editor.setSaveTarget('remote', 'https://api.example.com/save');

// Vincular a formulario
editor.bindToForm('#form');                        // 3 campos: editor_html, editor_css, editor_js
editor.bindToForm('#form', { field: 'desc' });     // 1 campo JSON
editor.unbindForm();                               // Desvincular

// Destruir el editor
editor.destroy();
```

---

## Configuración de Guardado

El editor soporta dos modos de guardado y dos destinos.

### Formato de guardado

- **`'html'`** (por defecto): Genera una página HTML completa con `<!DOCTYPE>`, `<head>`, Bootstrap CDN, estilos y scripts incluidos.
- **`'json'`**: Genera un JSON con `{ html, css, js }` separados. Solo el contenido editado, sin tags `<html>`, `<head>`, `<body>`.

### Destino de guardado

- **`'local'`** (por defecto): Descarga el archivo al disco del usuario.
- **`'remote'`**: Envía el contenido via POST a un endpoint configurado.

### Ejemplos

```javascript
// Guardar como JSON descargable
const editor = ShouEditor.init('#editor', {
  saveFormat: 'json',
  saveFilename: 'mi-proyecto'
});

// Guardar via POST a un servidor
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

### Formato del POST remoto

Cuando `saveTarget: 'remote'`, el editor hace `fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })`.

- Con `saveFormat: 'json'`: el body es `{"html":"...","css":"...","js":"..."}`
- Con `saveFormat: 'html'`: el body es `{"html":"<!DOCTYPE html>..."}`

### Cambiar en runtime

```javascript
editor.setSaveFormat('json');
editor.setSaveTarget('remote', 'https://api.example.com/save');
editor.save(); // Ahora hace POST del JSON
```

---

## Integración con Formularios

Para integrar el editor dentro de un formulario HTML (por ejemplo, el campo "descripción" de un producto), usa `bindToForm()`. El editor crea automáticamente campos `<input type="hidden">` y los rellena al hacer submit.

### Uso básico (3 campos separados)

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

  // Vincula al formulario: crea campos editor_html, editor_css, editor_js
  editor.bindToForm('#form-producto');
</script>
```

El servidor recibe: `nombre`, `precio`, `editor_html`, `editor_css`, `editor_js`.

### Campo único JSON

```javascript
// Un solo campo con todo el contenido como JSON
editor.bindToForm('#form-producto', { field: 'descripcion' });
```

El servidor recibe: `nombre`, `precio`, `descripcion` (JSON string: `{"html":"...","css":"...","js":"..."}`).

### Nombres de campos personalizados

```javascript
editor.bindToForm('#form-producto', {
  htmlField: 'contenido_html',
  cssField: 'contenido_css',
  jsField: 'contenido_js'
});
```

### Cargar contenido desde base de datos

#### Backend renderiza el HTML (PHP, Django, Rails, etc.)

Si el backend inyecta los valores directamente en la pagina:

```html
<!-- PHP ejemplo con 3 campos separados -->
<script>
  const editor = ShouEditor.init('#editor', { theme: 'dark' });

  editor.setCode({
    html: `<?= htmlspecialchars($producto['editor_html'], ENT_QUOTES) ?>`,
    css: `<?= htmlspecialchars($producto['editor_css'], ENT_QUOTES) ?>`,
    js: `<?= htmlspecialchars($producto['editor_js'], ENT_QUOTES) ?>`
  });
</script>

<!-- PHP ejemplo con campo unico JSON -->
<script>
  const editor = ShouEditor.init('#editor', { theme: 'dark' });

  const data = JSON.parse('<?= addslashes($producto["descripcion"]) ?>');
  editor.setCode(data);
</script>
```

#### Carga via AJAX / fetch

Si los datos se obtienen de una API:

```javascript
const editor = ShouEditor.init('#editor', { theme: 'dark' });

fetch('/api/productos/123')
  .then(r => r.json())
  .then(producto => {
    // Con 3 campos separados:
    editor.setCode({
      html: producto.editor_html,
      css: producto.editor_css,
      js: producto.editor_js
    });

    // O con campo unico JSON:
    // editor.setCode(JSON.parse(producto.descripcion));
  });
```

#### Ejemplo completo: editar producto existente

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

  // 1. Vincular al formulario (crea hidden inputs automaticamente)
  editor.bindToForm('#form-producto');

  // 2. Cargar contenido existente desde el servidor
  fetch('/api/productos/123')
    .then(r => r.json())
    .then(p => {
      editor.setCode({ html: p.editor_html, css: p.editor_css, js: p.editor_js });
    });

  // 3. Al submit, el formulario envia nombre + precio + editor_html + editor_css + editor_js
</script>
```

> En todos los casos, `editor.setCode({ html, css, js })` restaura el editor completo (visual + codigo).

### Desvincular

```javascript
editor.unbindForm(); // Elimina el listener del formulario
```

> **Nota:** `bindToForm()` solo vincula un formulario a la vez. Si llamas de nuevo con otro formulario, se desvincula el anterior automáticamente. Al llamar `editor.destroy()` se desvincula también.

---

## Sistema de Bloques JSON

Los bloques se cargan desde archivos JSON organizados en carpetas por categoría. El editor los carga dinámicamente al inicializar.

### Estructura de carpetas

```
blocks/
├── _index.json          ← Manifiesto (lista de categorías y bloques)
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

### Manifiesto `_index.json`

Define el orden de categorías y bloques:

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

### Formato de un Bloque JSON

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

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | Si | Identificador único del bloque |
| `label` | `string` | Si | Nombre visible en el panel |
| `icon` | `string` | Si | Clave del icono (`text`, `hero`, `card`, etc.) |
| `html` | `string` | Si | HTML que se inserta en el canvas |
| `css` | `string` | No | CSS personalizado que se inyecta en el iframe |
| `settings` | `array` | No | Propiedades editables en el panel Ajustes |

### Settings: Propiedades editables por bloque

Cada entrada en `settings` define un campo editable que aparece en el panel "Ajustes" al seleccionar un elemento de este bloque.

```json
{ "label": "setting.label", "attr": "name", "selector": "input", "type": "text" }
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `label` | `string` | Clave i18n o nombre visible del campo (ej: `"setting.label"`) |
| `attr` | `string` | Atributo HTML a editar (ej: `href`, `src`, `class`) |
| `prop` | `string` | Propiedad JS alternativa: `textContent`, `innerHTML`, `tagName` |
| `selector` | `string` | Selector CSS del sub-elemento a editar (si omitido, edita la raíz) |
| `type` | `string` | Tipo de input: `text`, `checkbox`, `select`, `options` |
| `options` | `array` | Para `type: "select"`: lista de valores posibles |
| `all` | `boolean` | Aplicar cambio a todos los elementos que coincidan con `selector` |

**Tipos disponibles:**
- `text` — Campo de texto libre
- `checkbox` — Toggle switch con colores del tema para atributos booleanos (`required`, `disabled`, etc.)
- `select` — Desplegable con opciones predefinidas (`options: [...]`)
- `options` — Editor visual de opciones para `<select>` con botones de añadir/eliminar por fila (valor + texto)

### Configurar ruta de bloques

```javascript
// Ruta local (por defecto)
const editor = ShouEditor.init('#editor', {
  blocksPath: 'blocks/'
});

// Ruta remota
const editor = ShouEditor.init('#editor', {
  blocksPath: 'https://cdn.example.com/blocks/'
});
```

Si los JSON no se pueden cargar (ej: `file://`), el editor usa los bloques por defecto embebidos.

### Crear un bloque personalizado

1. Crear un archivo JSON en la subcarpeta de categoría:

```json
// blocks/basic/video.json
{
  "id": "video",
  "label": "Video",
  "icon": "image",
  "html": "<video controls class=\"w-100\"><source src=\"video.mp4\" type=\"video/mp4\"></video>"
}
```

2. Añadir el ID al manifiesto `_index.json`:

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

### Bloques inline (sin JSON)

También puedes pasar bloques directamente en la configuración con `customBlocks`:

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

### Estructura de un Bloque (inline)

```javascript
{
  id: 'identificador-unico',  // ID único del bloque
  label: 'Nombre Visible',    // Nombre que se muestra en el panel
  icon: 'X',                  // Texto corto para el icono
  html: '<div>HTML</div>'     // Código HTML que se inserta
}
```

---

## Bloques Incluidos

### Basic
- Texto, Título, Imagen, Enlace, Divisor

### Layout
- Container, 2 Columnas, 3 Columnas

### Bootstrap
- Card, Alerta, Botón, Tabla

### Forms
- Input, Textarea, Select, Checkbox, Radio, File, Range, Switch

### Sections
- Navbar, Hero, Features, Footer

---

## Múltiples Instancias

```javascript
// Crear varios editores en la misma página
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

## Integración con Frameworks

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

El editor guarda automáticamente en localStorage:

```javascript
// Claves utilizadas (con prefijo por defecto 'shou-editor-'):
// shou-editor-html    - Código HTML
// shou-editor-css     - Código CSS
// shou-editor-js      - Código JavaScript
// shou-editor-theme   - Tema actual

// Limpiar datos guardados
localStorage.removeItem('shou-editor-html');
localStorage.removeItem('shou-editor-css');
localStorage.removeItem('shou-editor-js');
localStorage.removeItem('shou-editor-theme');
```

---

## Sin Dependencias

El plugin es **100% vanilla JavaScript**:
- No requiere npm/yarn
- No requiere bundlers (webpack, vite)
- No requiere frameworks (React, Vue)
- Funciona con solo incluir el script
- CSS embebido automáticamente

Bootstrap 5 se carga desde CDN solo dentro del iframe del canvas para la vista previa.

---

## Code Folding (Plegado de Código)

El editor de código incluye plegado de bloques estilo VS Code.

### Funcionamiento

- **HTML**: Pliega pares de tags (`<div>...</div>`, `<section>...</section>`, etc.). Ignora void elements (img, br, hr, input...)
- **CSS**: Pliega bloques `{ }` (reglas CSS)
- **JS**: Pliega bloques `{ }`, `( )` y `[ ]` multilínea

### Uso

- **Click en ▼/▶** en el gutter de líneas para plegar/desplegar
- **Ctrl+Shift+[** pliega el bloque en la posición del cursor
- **Ctrl+Shift+]** despliega el bloque en la posición del cursor

### Arquitectura Interna

El textarea no puede ocultar líneas, así que se usa un sistema de código virtual:

- `this.code[lang]` = código REAL completo (nunca modificado por folding)
- `this._foldState[lang]` = Set de líneas inicio colapsadas
- `this._foldRegions[lang]` = Array de `{start, end}` regiones detectadas
- `this._displayCode[lang]` = código visible en textarea con regiones colapsadas
- `this._displayToRealMap[lang]` = mapeo de línea display → línea real

Métodos principales:
- `_detectFoldRegions(code, lang)` — detecta regiones plegables
- `_buildDisplayCode(lang)` — genera código display
- `_displayToRealCode(lang, text)` — reconstruye código real desde display
- `_renderFoldableLines(lang)` — renderiza gutter con iconos ▼/▶
- `_toggleFold(lang, line)` — alterna plegado de una región
- `_refreshCodeEditor(lang)` — refresca todo después de un fold

---

## Sistema de Movimiento de Bloques

### Drag & Drop Mejorado

El algoritmo de drop detecta automáticamente layouts horizontales (flex-row, grid) y usa el eje X para posicionar. Para layouts verticales usa el eje Y.

- `_isHorizontalLayout(parent)` — detecta si un contenedor es horizontal
- `_findBestGap()` — calcula gaps en ambos ejes según dirección
- El indicador de drop muestra barra vertical para inserciones horizontales

### Mover con Teclado

Con un elemento seleccionado:
- **Alt+↑** mover arriba (antes del hermano anterior)
- **Alt+↓** mover abajo (después del hermano siguiente)
- **Alt+←** sacar del contenedor (al nivel del padre)
- **Alt+→** meter en contenedor adyacente

### Drag & Drop en Panel de Capas

Las capas son arrastrables. Al arrastrar sobre otra capa:
- **Tercio superior** = insertar antes
- **Tercio central** = insertar dentro (como hijo)
- **Tercio inferior** = insertar después

---

## Breadcrumb de Navegación

Al seleccionar un elemento, aparece una barra breadcrumb en:
- **Editor visual** — parte inferior del canvas
- **Editor de código** — parte inferior del editor

Muestra la cadena de padres: `div.container › table › tbody › tr › td`

Click en cualquier ancestro para seleccionarlo directamente. Útil para seleccionar tablas, carousels u otros contenedores profundamente anidados.

---

## Sincronización Visual ↔ Código

Al seleccionar un elemento (desde el canvas, capas, o breadcrumbs), el editor de código HTML automáticamente:
1. Selecciona (resalta) el bloque HTML completo del elemento
2. Hace scroll hasta ese punto

---

## Syntax Highlighting Personalizable

El editor de código incluye syntax highlighting para HTML, CSS y JS. Los colores se pueden personalizar con un archivo JSON.

### Tokens disponibles

| Token | Descripción | Default |
|-------|-------------|---------|
| `comment` | Comentarios | `#6a9955` |
| `tag` | Nombre de tags HTML | `#569cd6` |
| `attr` | Nombre de atributos HTML | `#9cdcfe` |
| `str` | Strings / valores de atributos | `#ce9178` |
| `kw` | Keywords (JS: const, let, if... / CSS: @media...) | `#c586c0` |
| `num` | Números y colores hex | `#b5cea8` |
| `bool` | Booleanos (true/false/null) | `#569cd6` |
| `fn` | Nombres de funciones JS | `#dcdcaa` |
| `prop` | Propiedades CSS | `#9cdcfe` |
| `punct` | Puntuación (`<`, `>`, `=`, `:`, `;`) | `#808080` |
| `unit` | Unidades CSS (px, em, rem, %, vh, vw, s, ms, deg) | `#b5cea8` |
| `selector` | Selectores CSS (.clase, #id, tag) | `#d7ba7d` |

### Personalizar colores

Crear/editar `styles/highlight.json`:

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

No es necesario incluir todos los tokens — los que no estén en el JSON usarán el color por defecto.

### Arquitectura

- Los colores se aplican como CSS custom properties (`--tok-comment`, `--tok-tag`, etc.)
- Se cargan desde `styles/highlight.json` al inicializar (con fallback si no existe)
- Opción `stylesPath` configura la ruta base para el JSON

---

## Editor de Imágenes (Standalone)

El editor de imágenes puede usarse de forma independiente como un editor Photoshop-like en el navegador.

### Inicialización

```html
<script src="js/image-editor.min.js"></script>
<script>
  // Modo embebido
  const imgEditor = JSImageEditor.init('#container', {
    theme: 'dark',
    lang: 'en',
    preset: { width: 800, height: 600 },
    onSave: (base64) => uploadImage(base64)
  });

  // O modo modal
  JSImageEditor.open(existingImageUrl, {
    onSave: (base64) => updateAvatar(base64)
  });
</script>
```

### Configuración JSON

Se puede usar `js/image-editor-config.json` para configurar herramientas, paneles y filtros:

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

### Herramientas de Selección

5 herramientas de selección con animación marching ants:

| Herramienta | Descripción |
|-------------|-------------|
| **selectRect** | Selección rectangular |
| **selectEllipse** | Selección elíptica |
| **selectPoly** | Selección poligonal (click para añadir puntos, doble-click para cerrar) |
| **selectFree** | Selección a mano alzada |
| **selectWand** | Varita mágica (selecciona por color similar, con tolerancia configurable) |

Acciones de selección: Copiar (`Ctrl+C`), Cortar (`Ctrl+X`), Pegar como nuevo layer (`Ctrl+V`), Seleccionar todo (`Ctrl+A`), Deseleccionar (`Ctrl+D`), Invertir (`Ctrl+Shift+I`).

### Text Layers con Google Fonts

- 80+ fuentes Google Fonts precargadas, cargadas via CDN
- Diálogo de búsqueda con vista previa de fuentes
- Soporte para fuentes personalizadas
- Propiedades avanzadas: peso, estilo, espaciado de letras, altura de línea, decoración, alineación

### Layer Styles (Opciones de Fusión)

Cada capa puede tener efectos de estilo tipo Photoshop:

| Efecto | Propiedades |
|--------|-------------|
| **Drop Shadow** | offsetX, offsetY, blur, color, opacity |
| **Inner Shadow** | offsetX, offsetY, blur, color, opacity |
| **Outer Glow** | blur, color, opacity |
| **Stroke** | size, color, position (inside/center/outside) |
| **Color Overlay** | color, opacity, blendMode |

Accesible via doble-click en layer o click derecho → "Layer Styles".

### Import / Export

**Importar**: Botón "Import" o arrastrar imagen al canvas. Si ya hay layers, la imagen se añade como nuevo layer.

**Exportar**: Diálogo con selección de formato (PNG/JPEG/WebP), slider de calidad para JPEG/WebP, y estimación de tamaño de archivo.

### Color Palette

Todos los selectores de color incluyen:
- Input nativo `<input type="color">`
- Campo hex editable (formato `#RRGGBB`)
- Botón de paleta con 60 colores web predefinidos
- Input personalizado para cualquier color hex

### Resize Handles

- 8 handles de redimensión (esquinas + centros de aristas)
- Handle central para mover
- Shift + arrastre para escalado proporcional
- Cursor contextual según posición del handle

### Atajos del Image Editor

| Atajo | Acción |
|-------|--------|
| `Ctrl+Z` | Deshacer |
| `Ctrl+Shift+Z` | Rehacer |
| `Ctrl+C` | Copiar selección |
| `Ctrl+X` | Cortar selección |
| `Ctrl+V` | Pegar como nuevo layer |
| `Ctrl+A` | Seleccionar todo |
| `Ctrl+D` | Deseleccionar |
| `Ctrl+Shift+I` | Invertir selección |
| `Ctrl++` | Zoom in |
| `Ctrl+-` | Zoom out |
| `Ctrl+0` | Ajustar a pantalla |
| `Delete` | Borrar selección |

---

## Versiones Minificadas

Los archivos `.min.js` se generan con [terser](https://github.com/terser/terser):

```bash
npx terser js/image-editor.js -o js/image-editor.min.js --compress --mangle
npx terser js/app.js -o js/app.min.js --compress --mangle
```

Los archivos HTML de demo (`test-js-editor.html`, `test-image-editor.html`) referencian las versiones `.min.js`. Los archivos `.js` sin minificar son la fuente de desarrollo.

---

## Compatibilidad

| Navegador | Versión Mínima |
|-----------|----------------|
| Chrome    | 90+            |
| Firefox   | 88+            |
| Safari    | 14+            |
| Edge      | 90+            |
