# Extender el Editor

Guia para anadir nuevas funcionalidades a Shou Editor.

## Anadir Bloques Personalizados

La forma mas sencilla de extender el editor es anadir bloques nuevos:

### Via Configuracion

```javascript
const editor = ShouEditor.init('#editor', {
  customBlocks: {
    miCategoria: [
      {
        id: 'mi-bloque',
        label: 'Mi Bloque',
        icon: 'B',
        html: '<div class="mi-bloque"><h3>Titulo</h3><p>Contenido</p></div>'
      }
    ],
    otraCategoria: [
      {
        id: 'pricing-table',
        label: 'Precios',
        icon: '$',
        html: `<div class="container py-5">
          <div class="row">
            <div class="col-md-4">
              <div class="card"><div class="card-body">
                <h5>Basico</h5><p class="display-6">$9</p>
              </div></div>
            </div>
          </div>
        </div>`
      }
    ]
  }
});
```

### Estructura de un Bloque

```javascript
{
  id: 'identificador-unico',   // String, sin espacios
  label: 'Nombre Visible',     // Texto para el panel
  icon: 'X',                   // Texto/emoji para el icono
  html: '<div>HTML</div>'      // Codigo HTML que se inserta
}
```

## Acceder a los Bloques por Defecto

```javascript
// Consultar todos los bloques
console.log(ShouEditor.Blocks);

// Categorias disponibles: basic, layout, bootstrap, forms, sections
ShouEditor.Blocks.basic.forEach(block => {
  console.log(block.id, block.label);
});
```

## Usar la API para Integraciones

### Guardar en Base de Datos

```javascript
const editor = ShouEditor.init('#editor');

// Boton para guardar en servidor
document.getElementById('btn-save-db').addEventListener('click', async () => {
  const code = editor.getCode();
  await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(code)
  });
});
```

### Cargar desde Base de Datos

```javascript
async function loadProject(id) {
  const res = await fetch(`/api/project/${id}`);
  const code = await res.json();
  editor.setCode(code);
}
```

### Multiples Editores

```javascript
const editorHeader = ShouEditor.init('#editor-header', {
  storagePrefix: 'header-',
  height: '300px'
});

const editorFooter = ShouEditor.init('#editor-footer', {
  storagePrefix: 'footer-',
  height: '300px'
});

// Combinar contenido
function getFullPage() {
  return editorHeader.getHtml() + editorFooter.getHtml();
}
```

## Integracion con Frameworks

### React

```jsx
import { useEffect, useRef } from 'react';

function EditorComponent({ initialCode, onChange }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = ShouEditor.init(containerRef.current, {
        theme: 'dark',
        height: '600px'
      });
      if (initialCode) {
        editorRef.current.setCode(initialCode);
      }
    }
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  const handleSave = () => {
    const code = editorRef.current?.getCode();
    if (code && onChange) onChange(code);
  };

  return (
    <div>
      <div ref={containerRef} />
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}
```

### Vue 3

```vue
<template>
  <div ref="editorContainer"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const editorContainer = ref(null);
let editor = null;

onMounted(() => {
  editor = ShouEditor.init(editorContainer.value, {
    theme: 'dark',
    height: '600px'
  });
});

onBeforeUnmount(() => {
  editor?.destroy();
});

const getCode = () => editor?.getCode();
defineExpose({ getCode });
</script>
```

## Modificar el Codigo Fuente

Si necesitas hacer cambios mas profundos al editor, el archivo `js/app.js` esta organizado en secciones:

1. **Utilities** (~linea 26): Funciones helper
2. **DefaultBlocks** (~linea 61): Definicion de bloques
3. **Syntax Highlighting** (~linea 97): Resaltado de codigo
4. **Template HTML** (~linea 149): Estructura generada
5. **Embedded CSS** (~linea 289): Estilos del editor
6. **Editor Class** (~linea 377): Logica principal
7. **Public API** (~linea 930): Exportacion global

### Agregar una Seccion de Estilos

Para anadir mas propiedades al panel de estilos, edita `getEditorTemplate()` y anade dentro de `.jse-styles-editor`:

```html
<div class="jse-style-section">
  <div class="jse-section-header">
    <span>Mi Seccion</span>
    <span class="jse-chevron">V</span>
  </div>
  <div class="jse-section-body">
    <div class="jse-row">
      <label>Propiedad</label>
      <input type="text" data-style="miPropiedad">
    </div>
  </div>
</div>
```

Los inputs con `data-style` se conectan automaticamente al elemento seleccionado via los event listeners existentes.

### Agregar un Boton a la Toolbar

Edita `getEditorTemplate()` y anade en la zona correspondiente:

```html
<button class="jse-btn" data-action="mi-accion" title="Mi Accion">MA</button>
```

Luego en `bindEvents()`, el handler de `.jse-btn` ya escucha `data-action`, solo necesitas anadir el caso:

```javascript
if (action === 'mi-accion') this.miMetodo();
```

## Reglas del Proyecto

1. Solo JavaScript vanilla ES6+
2. Sin dependencias externas (npm, CDN)
3. Sin bundlers ni transpiladores
4. El editor debe funcionar con solo abrir `index.html`
5. Prefijo `jse-` para todas las clases CSS del editor
6. Prefijo `--jse-` para variables CSS
