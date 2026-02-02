# API Core del Editor

Documentacion de la API publica de Shou Editor (`js/app.js`).

## ShouEditor (Objeto Global)

El plugin expone el objeto global `ShouEditor` con la API de inicializacion.

### Propiedades

| Propiedad | Tipo | Descripcion |
|-----------|------|-------------|
| `version` | `string` | Version del plugin (`'1.0.0'`) |
| `Editor` | `class` | Referencia a la clase Editor |
| `Blocks` | `object` | Bloques por defecto disponibles |

### `ShouEditor.init(containerOrConfig, config?)`

Crea una nueva instancia del editor.

```javascript
// Con contenedor + config
const editor = ShouEditor.init('#mi-editor', {
  theme: 'dark',
  width: '100%',
  height: '100vh'
});

// Solo config (usa document.body)
const editor = ShouEditor.init({ theme: 'light' });

// Con elemento DOM
const el = document.getElementById('editor');
const editor = ShouEditor.init(el, { theme: 'dark' });
```

## Clase Editor

### Configuracion

| Opcion | Tipo | Default | Descripcion |
|--------|------|---------|-------------|
| `theme` | `string` | `'dark'` | `'dark'` o `'light'` |
| `width` | `string` | `'100%'` | Ancho CSS del editor |
| `height` | `string` | `'100vh'` | Alto CSS del editor |
| `defaultView` | `string` | `'visual'` | `'visual'` o `'code'` |
| `defaultDevice` | `string` | `'desktop'` | `'desktop'`, `'tablet'` o `'mobile'` |
| `storagePrefix` | `string` | `'shou-editor-'` | Prefijo para claves en localStorage |
| `bootstrapCss` | `string` | CDN Bootstrap 5.3.2 | URL del CSS de Bootstrap para el canvas |
| `customBlocks` | `object` | `{}` | Bloques personalizados adicionales |

### Metodos - Obtener Codigo

#### `getHtml()`
Devuelve el HTML actual del canvas.

```javascript
const html = editor.getHtml();
```

#### `getCss()`
Devuelve el CSS personalizado.

```javascript
const css = editor.getCss();
```

#### `getJs()`
Devuelve el JavaScript del proyecto.

```javascript
const js = editor.getJs();
```

#### `getCode()`
Devuelve un objeto con todo el codigo.

```javascript
const code = editor.getCode();
// { html: '...', css: '...', js: '...' }
```

### Metodos - Establecer Codigo

#### `setHtml(html)`
Establece el HTML y actualiza el canvas visual.

```javascript
editor.setHtml('<h1>Hola Mundo</h1>');
```

#### `setCss(css)`
Establece el CSS personalizado.

```javascript
editor.setCss('h1 { color: red; }');
```

#### `setJs(js)`
Establece el JavaScript.

```javascript
editor.setJs('console.log("Hola");');
```

#### `setCode(code)`
Establece todo el codigo a la vez.

```javascript
editor.setCode({
  html: '<div>Contenido</div>',
  css: '.clase { color: blue; }',
  js: 'alert("Hola");'
});
```

### Metodos - Acciones

#### `newProject()`
Crea un proyecto vacio (solicita confirmacion al usuario).

```javascript
editor.newProject();
```

#### `save()`
Descarga el proyecto como archivo HTML con Bootstrap.

```javascript
editor.save();
```

#### `preview()`
Abre el proyecto en una nueva ventana del navegador.

```javascript
editor.preview();
```

#### `setTheme(theme)`
Cambia el tema del editor.

```javascript
editor.setTheme('light');
editor.setTheme('dark');
```

#### `toggleTheme()`
Alterna entre tema claro y oscuro.

```javascript
editor.toggleTheme();
```

#### `destroy()`
Destruye la instancia del editor y limpia el DOM.

```javascript
editor.destroy();
```

## Ciclo de Vida Interno

```
1. constructor()
   +-- getDefaultConfig()      Merge de configuracion
   +-- injectCSS()             Inyecta estilos embebidos en <head>
   +-- render()                Genera HTML desde getEditorTemplate()
   +-- cacheElements()         Cache de referencias DOM
   +-- bindEvents()            Bindea todos los event listeners
   +-- initFrame()             Crea el iframe del canvas
   +-- loadFromStorage()       Carga datos guardados

2. Usuario interactua
   +-- selectElement()         Al hacer click en el canvas
   +-- createElementToolbar()  Muestra mini toolbar
   +-- insertBlock()           Al click o drop de bloque
   +-- syncToCode()            Canvas -> Editor de codigo
   +-- syncFromCode()          Editor de codigo -> Canvas
   +-- saveToStorage()         Persistencia automatica

3. destroy()
   +-- Limpia innerHTML del contenedor
```

## Ejemplo Completo

```javascript
// Inicializar
const editor = ShouEditor.init('#editor', {
  theme: 'dark',
  width: '100%',
  height: '600px',
  defaultView: 'visual',
  customBlocks: {
    custom: [
      { id: 'banner', label: 'Banner', icon: 'B', html: '<div class="alert alert-warning">Banner</div>' }
    ]
  }
});

// Cargar contenido
editor.setCode({
  html: '<h1>Mi Pagina</h1><p>Contenido</p>',
  css: 'h1 { color: navy; }',
  js: ''
});

// Mas tarde: obtener contenido
const code = editor.getCode();
console.log('HTML:', code.html);

// Limpiar
editor.destroy();
```
