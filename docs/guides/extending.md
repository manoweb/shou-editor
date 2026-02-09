# Extending the Editor

Guide to adding new features to Shou Editor.

## Adding Custom Blocks

The simplest way to extend the editor is to add new blocks:

### Via Configuration

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

### Block Structure

```javascript
{
  id: 'identificador-unico',   // String, no spaces
  label: 'Nombre Visible',     // Text for the panel
  icon: 'X',                   // Text/emoji for the icon
  html: '<div>HTML</div>'      // HTML code that gets inserted
}
```

## Accessing Default Blocks

```javascript
// Query all blocks
console.log(ShouEditor.Blocks);

// Available categories: basic, layout, bootstrap, forms, sections
ShouEditor.Blocks.basic.forEach(block => {
  console.log(block.id, block.label);
});
```

## Using the API for Integrations

### Save to Database

```javascript
const editor = ShouEditor.init('#editor');

// Button to save to server
document.getElementById('btn-save-db').addEventListener('click', async () => {
  const code = editor.getCode();
  await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(code)
  });
});
```

### Load from Database

```javascript
async function loadProject(id) {
  const res = await fetch(`/api/project/${id}`);
  const code = await res.json();
  editor.setCode(code);
}
```

### Multiple Editors

```javascript
const editorHeader = ShouEditor.init('#editor-header', {
  storagePrefix: 'header-',
  height: '300px'
});

const editorFooter = ShouEditor.init('#editor-footer', {
  storagePrefix: 'footer-',
  height: '300px'
});

// Combine content
function getFullPage() {
  return editorHeader.getHtml() + editorFooter.getHtml();
}
```

## Framework Integration

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

## Modifying the Source Code

If you need to make deeper changes to the editor, the `js/app.js` file is organized into sections:

1. **Utilities** (~line 26): Helper functions
2. **DefaultBlocks** (~line 61): Block definitions
3. **Syntax Highlighting** (~line 97): Code highlighting
4. **Template HTML** (~line 149): Generated structure
5. **Embedded CSS** (~line 289): Editor styles
6. **Editor Class** (~line 377): Main logic
7. **Public API** (~line 930): Global export

### Adding a Style Section

To add more properties to the styles panel, edit `getEditorTemplate()` and add inside `.jse-styles-editor`:

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

Inputs with `data-style` are automatically connected to the selected element via the existing event listeners.

### Adding a Toolbar Button

Edit `getEditorTemplate()` and add in the corresponding area:

```html
<button class="jse-btn" data-action="mi-accion" title="Mi Accion">MA</button>
```

Then in `bindEvents()`, the `.jse-btn` handler already listens for `data-action`, you just need to add the case:

```javascript
if (action === 'mi-accion') this.miMetodo();
```

## Project Rules

1. Vanilla ES6+ JavaScript only
2. No external dependencies (npm, CDN)
3. No bundlers or transpilers
4. The editor must work by simply opening `index.html`
5. `jse-` prefix for all editor CSS classes
6. `--jse-` prefix for CSS variables
