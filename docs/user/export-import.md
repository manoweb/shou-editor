# Export and Import

Guide for saving and loading projects in Shou Editor.

## Auto Save

The editor automatically saves your code as you work:
- Saved in the browser's LocalStorage
- Persists between sessions
- Restored when opening the editor

**Note**: Auto save is local to your browser. If you switch browsers or clear data, it will be lost.

## Export Project

### Export as HTML

1. Click on **Export** in the toolbar
2. The file `proyecto.html` will be downloaded

The generated file includes:
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Mi Proyecto</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    /* Tu CSS aqui */
  </style>
</head>
<body>
  <!-- Tu HTML aqui -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    // Tu JavaScript aqui
  </script>
</body>
</html>
```

### Preview

Click on **Preview** to open your project in a new browser tab without downloading a file.

## Import Project

### Import HTML File

1. Click on **Open** in the toolbar
2. Select an `.html` or `.htm` file
3. The editor will automatically extract:
   - HTML from the `<body>`
   - CSS from `<style>` tags
   - JS from `<script>` tags (without src)

## Programmatic API

### Get Code

```javascript
const editor = ShouEditor.init('#editor');

const html = editor.getHtml();
const css = editor.getCss();
const js = editor.getJs();
const code = editor.getCode(); // { html, css, js }
```

### Set Code

```javascript
editor.setHtml('<h1>Hola</h1>');
editor.setCss('h1 { color: red; }');
editor.setJs('console.log("hola")');
editor.setCode({ html: '...', css: '...', js: '...' });
```

### Actions

```javascript
editor.newProject();  // New project (with confirmation)
editor.save();        // Download HTML
editor.preview();     // Preview in new window
```

## LocalStorage

Keys used (with default prefix `shou-editor-`):

| Key | Content |
|-----|---------|
| `shou-editor-html` | HTML code |
| `shou-editor-css` | CSS code |
| `shou-editor-js` | JavaScript code |
| `shou-editor-theme` | Current theme (dark/light) |

### Clear Data

```javascript
localStorage.removeItem('shou-editor-html');
localStorage.removeItem('shou-editor-css');
localStorage.removeItem('shou-editor-js');
localStorage.removeItem('shou-editor-theme');
```

## Share Project

1. Export as HTML
2. Share the `.html` file
3. The recipient only needs to open it in a browser (Bootstrap is loaded from CDN)

---

## Image Editor - Import / Export

### Import Image as Layer

1. Click on **Import** in the image editor toolbar
2. Select an image file (PNG, JPEG, WebP, GIF, BMP, SVG)
3. The image is added as a **new layer** above the active layer

**Drag & Drop**: You can also drag an image directly onto the canvas:
- If layers already exist, it is added as a new layer
- If the canvas is empty, it is loaded as the base image

### Export Image

1. Click on **Export** in the toolbar
2. A dialog opens with options:

| Option | Description |
|--------|-------------|
| **Format** | PNG (lossless), JPEG (with compression), WebP (modern) |
| **Quality** | Slider 0-100% (only for JPEG and WebP) |
| **Dimensions** | Shows canvas width x height |
| **Estimated size** | Estimate of the resulting file size |

3. Click on **Download** to download the image

### Programmatic API (Image Editor)

```javascript
const imgEditor = JSImageEditor.init('#container', { theme: 'dark' });

// Get image as base64
const base64 = imgEditor.getImage();       // PNG by default
const jpeg = imgEditor.getImage('jpeg', 0.8); // JPEG quality 80%

// Get as Blob
const blob = await imgEditor.getBlob();    // PNG by default
const webp = await imgEditor.getBlob('webp', 0.9); // WebP quality 90%

// Import image as layer
imgEditor.importAsLayer('path/to/image.png');

// Load image (replaces everything)
imgEditor.loadImage('path/to/image.png');
```

---

## Limits

- **LocalStorage**: ~5-10MB depending on the browser
- **Encoding**: UTF-8
- **Image Editor**: Maximum image size depends on browser memory (typically up to ~4000x4000px)
