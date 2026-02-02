# Contribuir al Proyecto

Guía para contribuir al desarrollo de Shou Editor.

## Reglas Fundamentales

### Lo que SÍ está permitido
- JavaScript ES6+ nativo
- CSS3 con variables CSS
- HTML5 semántico
- APIs nativas del navegador
- Módulos ES6 nativos

### Lo que NO está permitido
- Frameworks JS (React, Vue, Angular, Svelte, etc.)
- Librerías externas (jQuery, Lodash, etc.)
- Preprocesadores CSS (Sass, Less, etc.)
- Bundlers (Webpack, Vite, Rollup, etc.)
- Transpiladores (Babel, TypeScript, etc.)
- CDN externos

## Configurar Entorno de Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/js-editor.git
cd js-editor

# Iniciar servidor local
python3 -m http.server 8080

# Abrir en navegador
# http://localhost:8080
```

No hay `npm install` porque no hay dependencias.

## Estructura de Commits

```
tipo: descripción breve

[cuerpo opcional con más detalles]
```

Tipos:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (no afecta lógica)
- `refactor`: Refactorización
- `perf`: Mejora de rendimiento
- `test`: Añadir tests

Ejemplos:
```
feat: añadir autocompletado para CSS
fix: corregir scroll en números de línea
docs: documentar API de eventos
```

## Estilo de Código

### JavaScript
```javascript
// ✅ Correcto
const miVariable = 'valor';

function miFuncion(param) {
  if (param) {
    return hacerAlgo(param);
  }
  return null;
}

class MiClase {
  #privateProp = 'valor';

  constructor(options) {
    this.options = options;
  }

  metodoPublico() {
    return this.#metodoPrivado();
  }

  #metodoPrivado() {
    return this.#privateProp;
  }
}

// ❌ Incorrecto
var miVariable = "valor"

function mi_funcion(param){
    if(param){
        return hacerAlgo(param)
    }
}
```

### CSS
```css
/* ✅ Correcto */
.mi-componente {
  display: flex;
  padding: var(--spacing-md);
  background: var(--bg-primary);
}

.mi-componente__elemento {
  margin-top: var(--spacing-sm);
}

/* ❌ Incorrecto */
.miComponente {
  display: flex;
  padding: 16px;
  background: #1e1e1e;
}
```

### HTML
```html
<!-- ✅ Correcto -->
<section class="editor-panel" data-language="javascript">
  <header class="panel-header">
    <h2>JavaScript</h2>
  </header>
  <div class="panel-content">
    <textarea id="shou-editor"></textarea>
  </div>
</section>

<!-- ❌ Incorrecto -->
<div class="editorPanel">
  <div class="header">
    <span>JavaScript</span>
  </div>
  <div>
    <textarea id="jsEditor"></textarea>
  </div>
</div>
```

## Añadir Nueva Funcionalidad

1. **Crear rama**
   ```bash
   git checkout -b feat/mi-funcionalidad
   ```

2. **Implementar**
   - Seguir la arquitectura existente
   - Usar EventBus para comunicación
   - Documentar código complejo

3. **Probar**
   - Probar en Chrome, Firefox, Safari
   - Verificar que no rompe funcionalidad existente

4. **Documentar**
   - Actualizar docs si es necesario
   - Añadir comentarios JSDoc

5. **Pull Request**
   - Descripción clara de cambios
   - Screenshots si hay cambios visuales

## Reportar Bugs

Incluir:
1. Navegador y versión
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Screenshots o código de ejemplo

## Preguntas

Abrir un Issue con la etiqueta `question`.
