# Contributing to the Project

Guide for contributing to the development of Shou Editor.

## Fundamental Rules

### What IS allowed
- Native ES6+ JavaScript
- CSS3 with CSS variables
- Semantic HTML5
- Native browser APIs
- Native ES6 modules

### What is NOT allowed
- JS frameworks (React, Vue, Angular, Svelte, etc.)
- External libraries (jQuery, Lodash, etc.)
- CSS preprocessors (Sass, Less, etc.)
- Bundlers (Webpack, Vite, Rollup, etc.)
- Transpilers (Babel, TypeScript, etc.)
- External CDNs

## Setting Up the Development Environment

```bash
# Clone repository
git clone https://github.com/tu-usuario/js-editor.git
cd js-editor

# Start local server
python3 -m http.server 8080

# Open in browser
# http://localhost:8080
```

There is no `npm install` because there are no dependencies.

## Commit Structure

```
type: brief description

[optional body with more details]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (does not affect logic)
- `refactor`: Refactoring
- `perf`: Performance improvement
- `test`: Adding tests

Examples:
```
feat: add CSS autocomplete
fix: fix line numbers scroll
docs: document events API
```

## Code Style

### JavaScript
```javascript
// ✅ Correct
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

// ❌ Incorrect
var miVariable = "valor"

function mi_funcion(param){
    if(param){
        return hacerAlgo(param)
    }
}
```

### CSS
```css
/* ✅ Correct */
.mi-componente {
  display: flex;
  padding: var(--spacing-md);
  background: var(--bg-primary);
}

.mi-componente__elemento {
  margin-top: var(--spacing-sm);
}

/* ❌ Incorrect */
.miComponente {
  display: flex;
  padding: 16px;
  background: #1e1e1e;
}
```

### HTML
```html
<!-- ✅ Correct -->
<section class="editor-panel" data-language="javascript">
  <header class="panel-header">
    <h2>JavaScript</h2>
  </header>
  <div class="panel-content">
    <textarea id="shou-editor"></textarea>
  </div>
</section>

<!-- ❌ Incorrect -->
<div class="editorPanel">
  <div class="header">
    <span>JavaScript</span>
  </div>
  <div>
    <textarea id="jsEditor"></textarea>
  </div>
</div>
```

## Adding New Features

1. **Create a branch**
   ```bash
   git checkout -b feat/mi-funcionalidad
   ```

2. **Implement**
   - Follow the existing architecture
   - Use EventBus for communication
   - Document complex code

3. **Test**
   - Test in Chrome, Firefox, Safari
   - Verify that existing functionality is not broken

4. **Document**
   - Update docs if needed
   - Add JSDoc comments

5. **Pull Request**
   - Clear description of changes
   - Screenshots if there are visual changes

## Reporting Bugs

Include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots or example code

## Questions

Open an Issue with the `question` label.
