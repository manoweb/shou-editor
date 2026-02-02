# Sistema de Sintaxis

Documentacion del resaltado de sintaxis integrado en Shou Editor.

## Funciones de Resaltado

El plugin incluye tres funciones de resaltado, una por lenguaje:

### `highlightHTML(code)`
Resalta codigo HTML. Detecta:
- Comentarios (`<!-- ... -->`)
- Tags (`<div>`, `</p>`)
- Atributos (`class`, `id`, `href`)
- Valores de atributos (`"valor"`)

### `highlightCSS(code)`
Resalta codigo CSS. Detecta:
- Comentarios (`/* ... */`)
- At-rules (`@media`, `@import`)
- Propiedades (`color`, `margin`)
- Valores con unidades (`16px`, `2em`)

### `highlightJS(code)`
Resalta codigo JavaScript. Detecta:
- Keywords (`const`, `let`, `function`, `return`, `if`, `else`, etc.)
- Strings (comillas dobles, simples y template literals)
- Comentarios de linea (`// ...`)
- Booleanos (`true`, `false`, `null`, `undefined`)
- Numeros
- Nombres de funciones

### `highlight(code, lang)`
Wrapper que selecciona el resaltador segun el lenguaje.

```javascript
// Uso interno
const html = highlight(code, 'html');
const css = highlight(code, 'css');
const js = highlight(code, 'js');
```

## Clases CSS Generadas

| Clase | Elemento | Color (tema oscuro) |
|-------|----------|---------------------|
| `.tok-comment` | Comentarios | `#6a9955` (verde) |
| `.tok-tag` | Tags HTML | `#569cd6` (azul) |
| `.tok-attr` | Atributos HTML | `#9cdcfe` (cyan) |
| `.tok-str` | Strings | `#ce9178` (naranja) |
| `.tok-kw` | Keywords | `#c586c0` (rosa) |
| `.tok-num` | Numeros | `#b5cea8` (verde claro) |
| `.tok-bool` | Booleanos | `#569cd6` (azul) |
| `.tok-fn` | Funciones | `#dcdcaa` (amarillo) |
| `.tok-prop` | Propiedades CSS | `#9cdcfe` (cyan) |
| `.tok-punct` | Puntuacion | `#808080` (gris) |
| `.tok-unit` | Unidades CSS | `#b5cea8` (verde claro) |

## Implementacion

El resaltado funciona mediante:

1. El texto del `<textarea>` es transparente
2. Un `<pre><code>` superpuesto muestra el HTML resaltado
3. Ambos comparten la misma fuente y posicion de scroll
4. El textarea captura la entrada, el pre muestra los colores

```
+--------------------+
|  <textarea>        |  <- Input (texto transparente, caret visible)
|  z-index: 2        |
+--------------------+
|  <pre><code>       |  <- Display (HTML con spans de color)
|  z-index: 1        |
+--------------------+
```
