# Documentación de Shou Editor

Bienvenido a la documentación de Shou Editor, un editor visual de páginas web estilo GrapesJS construido con JavaScript vanilla. Es un plugin autónomo que genera su propia interfaz HTML y CSS.

## Índice

### Inicio Rápido
- [Instalación](./INSTALLATION.md)
- [Primeros Pasos](./QUICKSTART.md)

### Guías para Desarrolladores
- [Arquitectura del Proyecto](./guides/architecture.md)
- [Contribuir al Proyecto](./guides/contributing.md)
- [Extender el Editor](./guides/extending.md)

### Referencia de API
- [Core del Editor](./api/core.md)
- [Sistema de Sintaxis](./api/syntax.md)
- [Sistema de Eventos](./api/events.md)
- [Utilidades](./api/utils.md)

### Manual de Usuario
- [Interfaz del Editor](./user/interface.md)
- [Atajos de Teclado](./user/shortcuts.md)
- [Temas y Personalización](./user/themes.md)
- [Exportar e Importar](./user/export-import.md)

## Características Principales

### Editor Visual (GrapesJS-style)
- **Panel de Bloques**: Componentes arrastrables organizados por categorías
  - Básicos (texto, títulos, imágenes, enlaces)
  - Layout (contenedores, filas, columnas)
  - Bootstrap (cards, alertas, botones, tablas)
  - Formularios (inputs, textareas, selects)
  - Secciones (navbar, hero, features, pricing, footer)

- **Canvas Visual**: Vista previa en tiempo real con iframe
  - Soporte completo para Bootstrap 5
  - Vista responsive (Desktop/Tablet/Mobile)
  - Selección visual de elementos
  - Edición inline con doble clic
  - Indicador magnético al arrastrar bloques
  - Mini toolbar con drag & drop para reordenar elementos

- **Panel de Estilos CSS**: Editor visual de propiedades
  - Dimensiones (width, height, min/max)
  - Espaciado (margin, padding)
  - Tipografía (font, size, color, align)
  - Fondo (color, imagen)
  - Bordes (width, style, color, radius)
  - Display y posicionamiento

- **Panel de Capas**: Árbol DOM visual
  - Navegación jerárquica de elementos con separadores
  - Selección desde el árbol (click para seleccionar)
  - Muestra tag + clase CSS de cada elemento

- **Visualización de Contenedores**: Botón "Outlines" para mostrar/ocultar contornos de divs invisibles

### Editor de Código
- Resaltado de sintaxis para HTML, CSS, JavaScript
- Números de línea
- Auto-indentación
- Pestañas para HTML, CSS y JS
- Sincronización bidireccional con el canvas visual

### Editor de Imágenes (Photoshop-like)
- **Layer System**: Capas con opacidad, modos de fusión, visibilidad, reorden drag-and-drop, grupos con carpetas
- **Selection Tools**: Rectangular, elíptica, polígono, mano alzada y varita mágica con animación marching ants
- **Drawing Tools**: Lápiz, borrador, rectángulo, círculo, línea, flecha, degradado, relleno, cuentagotas
- **Text Layers**: Texto re-editable con 80+ Google Fonts via CDN, peso, estilo, espaciado, decoración, alineación
- **Layer Styles**: Drop shadow, inner shadow, outer glow, stroke, color overlay con vista previa en vivo
- **Import/Export**: Importar imágenes como layers (botón + drag & drop). Exportar a PNG, JPEG, WebP con slider de calidad
- **Visual Resize**: 8 handles de redimensión + escalado proporcional con Shift. Zoom in/out, pan, scrollbars
- **Color Palette**: Selector de color con input hex, paleta de colores web y swatches
- **Filters**: Brillo, contraste, saturación, desenfoque, escala de grises, sepia, tono en tiempo real
- **Transforms**: Recortar, redimensionar, rotar, voltear
- **Context Menu**: Click derecho en layers para estilos, redimensión, duplicar, eliminar
- **Undo/Redo**: Historial completo con atajos de teclado

### Otras Características
- Sin dependencias externas (vanilla JS)
- Plugin autónomo: `app.js` (web editor) + `image-editor.js` (image editor)
- CSS embebido automáticamente
- Temas claro y oscuro
- Guardado automático en LocalStorage
- Exportar a HTML completo con Bootstrap
- Importar archivos HTML existentes
- Versiones minificadas disponibles (`.min.js`)

## Requisitos

- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Conexión a Internet (solo para cargar Bootstrap CSS en el canvas)
- No requiere instalación de software adicional

## Vista Rápida de la Interfaz

```
┌──────────────────────────────────────────────────────────────────────┐
│ Shou Editor  [Nuevo][Abrir][Guardar][Preview]  [🖥️📱💻]  [Visual|Código] │
├──────────┬────────────────────────────────────────┬──────────────────┤
│ BLOQUES  │                                        │   ESTILOS        │
│ ──────── │                                        │   ────────       │
│ □ Texto  │         ┌──────────────────┐          │   Dimensiones    │
│ □ Título │         │                  │          │   Espaciado      │
│ □ Imagen │         │  CANVAS VISUAL   │          │   Tipografía     │
│ □ Card   │         │  (Bootstrap 5)   │          │   Fondo          │
│ □ Alert  │         │                  │          │   Bordes         │
│ □ Button │         └──────────────────┘          │   Display        │
│ □ Hero   │                                        │   ────────       │
│ □ Footer │     [Mini Toolbar: ✥ ⧉ ✕]             │   SETTINGS       │
│ ──────── │                                        │                  │
│ CAPAS    │                                        │                  │
│ <div>    │                                        │                  │
│ <h1>     │                                        │                  │
└──────────┴────────────────────────────────────────┴──────────────────┘
```

## Uso Básico

### Web Editor
```html
<script src="js/app.min.js"></script>
<script>
  const editor = ShouEditor.init('#editor', {
    theme: 'dark',
    width: '100%',
    height: '100vh'
  });
</script>
```

### Image Editor
```html
<script src="js/image-editor.min.js"></script>
<script>
  const imgEditor = JSImageEditor.init('#container', {
    theme: 'dark',
    lang: 'en',
    preset: { width: 800, height: 600 },
    onSave: (base64) => console.log('Saved!', base64)
  });
</script>
```

## Licencia

MIT License - Ver archivo LICENSE para más detalles.
