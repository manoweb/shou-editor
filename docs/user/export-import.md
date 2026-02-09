# Exportar e Importar

Guia para guardar y cargar proyectos en Shou Editor.

## Guardado Automatico

El editor guarda automaticamente tu codigo mientras trabajas:
- Se guarda en LocalStorage del navegador
- Persiste entre sesiones
- Se restaura al abrir el editor

**Nota**: El guardado automatico es local a tu navegador. Si cambias de navegador o limpias datos, se perdera.

## Exportar Proyecto

### Exportar como HTML

1. Click en **Exportar** en la barra de herramientas
2. Se descargara `proyecto.html`

El archivo generado incluye:
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

### Vista Previa

Click en **Preview** para abrir tu proyecto en una nueva pestana del navegador sin descargar archivo.

## Importar Proyecto

### Importar Archivo HTML

1. Click en **Abrir** en la barra de herramientas
2. Selecciona un archivo `.html` o `.htm`
3. El editor extraera automaticamente:
   - HTML del `<body>`
   - CSS de `<style>` tags
   - JS de `<script>` tags (sin src)

## API Programatica

### Obtener Codigo

```javascript
const editor = ShouEditor.init('#editor');

const html = editor.getHtml();
const css = editor.getCss();
const js = editor.getJs();
const code = editor.getCode(); // { html, css, js }
```

### Establecer Codigo

```javascript
editor.setHtml('<h1>Hola</h1>');
editor.setCss('h1 { color: red; }');
editor.setJs('console.log("hola")');
editor.setCode({ html: '...', css: '...', js: '...' });
```

### Acciones

```javascript
editor.newProject();  // Nuevo proyecto (con confirmacion)
editor.save();        // Descargar HTML
editor.preview();     // Vista previa en nueva ventana
```

## LocalStorage

Claves utilizadas (con prefijo por defecto `shou-editor-`):

| Clave | Contenido |
|-------|-----------|
| `shou-editor-html` | Codigo HTML |
| `shou-editor-css` | Codigo CSS |
| `shou-editor-js` | Codigo JavaScript |
| `shou-editor-theme` | Tema actual (dark/light) |

### Limpiar Datos

```javascript
localStorage.removeItem('shou-editor-html');
localStorage.removeItem('shou-editor-css');
localStorage.removeItem('shou-editor-js');
localStorage.removeItem('shou-editor-theme');
```

## Compartir Proyecto

1. Exporta como HTML
2. Comparte el archivo `.html`
3. El receptor solo necesita abrir en un navegador (Bootstrap se carga desde CDN)

---

## Editor de Imágenes - Import / Export

### Importar Imagen como Layer

1. Click en **Import** en la barra de herramientas del editor de imágenes
2. Selecciona un archivo de imagen (PNG, JPEG, WebP, GIF, BMP, SVG)
3. La imagen se añade como un **nuevo layer** encima del layer activo

**Drag & Drop**: También puedes arrastrar una imagen directamente al canvas:
- Si ya hay layers, se añade como nuevo layer
- Si el canvas está vacío, se carga como imagen base

### Exportar Imagen

1. Click en **Export** en la barra de herramientas
2. Se abre un diálogo con opciones:

| Opción | Descripción |
|--------|-------------|
| **Formato** | PNG (sin pérdida), JPEG (con compresión), WebP (moderno) |
| **Calidad** | Slider 0-100% (solo para JPEG y WebP) |
| **Dimensiones** | Muestra ancho × alto del canvas |
| **Tamaño estimado** | Estimación del tamaño del archivo resultante |

3. Click en **Download** para descargar la imagen

### API Programática (Image Editor)

```javascript
const imgEditor = JSImageEditor.init('#container', { theme: 'dark' });

// Obtener imagen como base64
const base64 = imgEditor.getImage();       // PNG por defecto
const jpeg = imgEditor.getImage('jpeg', 0.8); // JPEG calidad 80%

// Obtener como Blob
const blob = await imgEditor.getBlob();    // PNG por defecto
const webp = await imgEditor.getBlob('webp', 0.9); // WebP calidad 90%

// Importar imagen como layer
imgEditor.importAsLayer('path/to/image.png');

// Cargar imagen (reemplaza todo)
imgEditor.loadImage('path/to/image.png');
```

---

## Limites

- **LocalStorage**: ~5-10MB dependiendo del navegador
- **Codificacion**: UTF-8
- **Image Editor**: El tamaño máximo de imagen depende de la memoria del navegador (típicamente hasta ~4000×4000px)
