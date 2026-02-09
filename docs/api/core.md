# Editor Core API

Documentation of the Shou Editor public API (`js/app.js`).

## ShouEditor (Global Object)

The plugin exposes the global `ShouEditor` object with the initialization API.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `version` | `string` | Plugin version (`'1.0.0'`) |
| `Editor` | `class` | Reference to the Editor class |
| `Blocks` | `object` | Available default blocks |

### `ShouEditor.init(containerOrConfig, config?)`

Creates a new editor instance.

```javascript
// With container + config
const editor = ShouEditor.init('#mi-editor', {
  theme: 'dark',
  width: '100%',
  height: '100vh'
});

// Config only (uses document.body)
const editor = ShouEditor.init({ theme: 'light' });

// With DOM element
const el = document.getElementById('editor');
const editor = ShouEditor.init(el, { theme: 'dark' });
```

## Editor Class

### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `string` | `'dark'` | `'dark'` or `'light'` |
| `width` | `string` | `'100%'` | CSS width of the editor |
| `height` | `string` | `'100vh'` | CSS height of the editor |
| `defaultView` | `string` | `'visual'` | `'visual'` or `'code'` |
| `defaultDevice` | `string` | `'desktop'` | `'desktop'`, `'tablet'` or `'mobile'` |
| `storagePrefix` | `string` | `'shou-editor-'` | Prefix for localStorage keys |
| `bootstrapCss` | `string` | CDN Bootstrap 5.3.2 | URL of Bootstrap CSS for the canvas |
| `customBlocks` | `object` | `{}` | Additional custom blocks |

### Methods - Get Code

#### `getHtml()`
Returns the current HTML from the canvas.

```javascript
const html = editor.getHtml();
```

#### `getCss()`
Returns the custom CSS.

```javascript
const css = editor.getCss();
```

#### `getJs()`
Returns the project JavaScript.

```javascript
const js = editor.getJs();
```

#### `getCode()`
Returns an object with all the code.

```javascript
const code = editor.getCode();
// { html: '...', css: '...', js: '...' }
```

### Methods - Set Code

#### `setHtml(html)`
Sets the HTML and updates the visual canvas.

```javascript
editor.setHtml('<h1>Hola Mundo</h1>');
```

#### `setCss(css)`
Sets the custom CSS.

```javascript
editor.setCss('h1 { color: red; }');
```

#### `setJs(js)`
Sets the JavaScript.

```javascript
editor.setJs('console.log("Hola");');
```

#### `setCode(code)`
Sets all the code at once.

```javascript
editor.setCode({
  html: '<div>Contenido</div>',
  css: '.clase { color: blue; }',
  js: 'alert("Hola");'
});
```

### Methods - Actions

#### `newProject()`
Creates an empty project (prompts the user for confirmation).

```javascript
editor.newProject();
```

#### `save()`
Downloads the project as an HTML file with Bootstrap.

```javascript
editor.save();
```

#### `preview()`
Opens the project in a new browser window.

```javascript
editor.preview();
```

#### `setTheme(theme)`
Changes the editor theme.

```javascript
editor.setTheme('light');
editor.setTheme('dark');
```

#### `toggleTheme()`
Toggles between light and dark themes.

```javascript
editor.toggleTheme();
```

#### `destroy()`
Destroys the editor instance and cleans up the DOM.

```javascript
editor.destroy();
```

## Internal Lifecycle

```
1. constructor()
   +-- getDefaultConfig()      Configuration merge
   +-- injectCSS()             Injects embedded styles in <head>
   +-- render()                Generates HTML from getEditorTemplate()
   +-- cacheElements()         Caches DOM references
   +-- bindEvents()            Binds all event listeners
   +-- initFrame()             Creates the canvas iframe
   +-- loadFromStorage()       Loads saved data

2. User interacts
   +-- selectElement()         On canvas click
   +-- createElementToolbar()  Shows mini toolbar
   +-- insertBlock()           On block click or drop
   +-- syncToCode()            Canvas -> Code editor
   +-- syncFromCode()          Code editor -> Canvas
   +-- saveToStorage()         Automatic persistence

3. destroy()
   +-- Clears container innerHTML
```

## Full Example

```javascript
// Initialize
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

// Load content
editor.setCode({
  html: '<h1>Mi Pagina</h1><p>Contenido</p>',
  css: 'h1 { color: navy; }',
  js: ''
});

// Later: get content
const code = editor.getCode();
console.log('HTML:', code.html);

// Clean up
editor.destroy();
```
