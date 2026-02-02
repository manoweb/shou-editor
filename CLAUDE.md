# Shou Editor - Editor JavaScript Vanilla

## Descripción del Proyecto
Editor de código web para HTML, CSS y JavaScript puro (vanilla). Sin frameworks, sin compiladores, sin dependencias externas.

## Filosofía
- **Vanilla First**: Solo JavaScript nativo ES6+
- **Zero Dependencies**: Sin librerías externas
- **No Build Step**: Funciona directamente en el navegador
- **Modern Standards**: HTML5, CSS3, ES6+

## Estructura del Proyecto
```
js-editor/
├── index.html          # Punto de entrada principal
├── css/
│   ├── main.css        # Estilos principales
│   ├── editor.css      # Estilos del editor de código
│   ├── themes/         # Temas de color
│   │   ├── dark.css
│   │   └── light.css
│   └── components/     # Estilos de componentes
├── js/
│   ├── app.js          # Inicialización de la aplicación
│   ├── editor/
│   │   ├── core.js     # Núcleo del editor
│   │   ├── syntax.js   # Resaltado de sintaxis
│   │   ├── autocomplete.js
│   │   └── shortcuts.js
│   ├── utils/
│   │   ├── dom.js      # Utilidades DOM
│   │   ├── storage.js  # LocalStorage
│   │   └── events.js   # Sistema de eventos
│   └── components/
│       ├── tabs.js     # Sistema de pestañas
│       ├── preview.js  # Vista previa en vivo
│       ├── console.js  # Consola integrada
│       └── toolbar.js  # Barra de herramientas
├── assets/
│   └── icons/          # Iconos SVG inline
├── .claude/            # Configuración de Claude
└── CLAUDE.md           # Este archivo
```

## Reglas de Desarrollo

### JavaScript
```javascript
// ✅ CORRECTO - ES6+ nativo
const editor = {
  init() {
    document.querySelector('#app').innerHTML = this.render();
  },

  render() {
    return `<div class="editor-container">...</div>`;
  }
};

// ❌ INCORRECTO - No usar
import React from 'react';  // Frameworks prohibidos
$('#app').html(content);     // jQuery prohibido
```

### CSS
```css
/* ✅ CORRECTO - CSS nativo con variables */
:root {
  --editor-bg: #1e1e1e;
  --editor-text: #d4d4d4;
  --accent-color: #007acc;
}

.editor {
  background: var(--editor-bg);
  display: grid;
  grid-template-columns: 250px 1fr;
}

/* ❌ INCORRECTO - No usar */
@import 'tailwind';  /* Frameworks CSS prohibidos */
```

### HTML
```html
<!-- ✅ CORRECTO - HTML5 semántico -->
<main class="editor-main">
  <section class="code-panel" data-language="javascript">
    <textarea id="code-input"></textarea>
  </section>
</main>

<!-- ❌ INCORRECTO - No usar -->
<script src="https://cdn.example.com/lib.js"></script> <!-- CDN prohibido -->
```

## Características del Editor

### Core
- [ ] Editor de texto con números de línea
- [ ] Resaltado de sintaxis para HTML, CSS, JS
- [ ] Autocompletado básico
- [ ] Atajos de teclado (Ctrl+S, Ctrl+Z, etc.)
- [ ] Indentación automática

### Interfaz
- [ ] Sistema de pestañas (HTML, CSS, JS)
- [ ] Panel de vista previa en vivo
- [ ] Consola integrada para errores/logs
- [ ] Barra de herramientas
- [ ] Temas claro/oscuro
- [ ] Layout redimensionable (drag & drop)

### Funcionalidades
- [ ] Guardar en LocalStorage
- [ ] Exportar como HTML único
- [ ] Importar archivos
- [ ] Ejecutar código JavaScript
- [ ] Ver errores de sintaxis en tiempo real

## APIs del Navegador a Utilizar
- `document.querySelector/querySelectorAll` - Selección DOM
- `element.addEventListener` - Eventos
- `localStorage` - Persistencia
- `Blob/URL.createObjectURL` - Exportación de archivos
- `FileReader` - Importación de archivos
- `eval()` o `new Function()` - Ejecución de código (con precaución)
- `ResizeObserver` - Detección de cambios de tamaño
- `MutationObserver` - Observación de cambios DOM
- `requestAnimationFrame` - Animaciones suaves
- `CSS.highlights` - Resaltado de texto (si disponible)

## Comandos de Desarrollo
```bash
# Servir el proyecto localmente (cualquier servidor estático)
python3 -m http.server 8080
# o
npx serve .

# No hay comandos de build - es vanilla puro
```

## Compatibilidad
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notas para Claude
1. **Siempre** usar JavaScript vanilla ES6+
2. **Nunca** sugerir instalar npm packages
3. **Nunca** crear archivos de configuración de bundlers
4. El código debe funcionar con solo abrir index.html en un navegador
5. Usar módulos ES6 nativos (`<script type="module">`)
6. Preferir CSS Grid y Flexbox para layouts
7. Usar variables CSS para temas
8. Todo el código debe ser legible y bien comentado
