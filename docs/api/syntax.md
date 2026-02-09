# Syntax System

Documentation of the syntax highlighting built into Shou Editor.

## Highlighting Functions

The plugin includes three highlighting functions, one per language:

### `highlightHTML(code)`
Highlights HTML code. Detects:
- Comments (`<!-- ... -->`)
- Tags (`<div>`, `</p>`)
- Attributes (`class`, `id`, `href`)
- Attribute values (`"value"`)

### `highlightCSS(code)`
Highlights CSS code. Detects:
- Comments (`/* ... */`)
- At-rules (`@media`, `@import`)
- Properties (`color`, `margin`)
- Values with units (`16px`, `2em`)

### `highlightJS(code)`
Highlights JavaScript code. Detects:
- Keywords (`const`, `let`, `function`, `return`, `if`, `else`, etc.)
- Strings (double quotes, single quotes, and template literals)
- Line comments (`// ...`)
- Booleans (`true`, `false`, `null`, `undefined`)
- Numbers
- Function names

### `highlight(code, lang)`
Wrapper that selects the highlighter based on the language.

```javascript
// Internal usage
const html = highlight(code, 'html');
const css = highlight(code, 'css');
const js = highlight(code, 'js');
```

## Generated CSS Classes

| Class | Element | Color (dark theme) |
|-------|---------|-------------------|
| `.tok-comment` | Comments | `#6a9955` (green) |
| `.tok-tag` | HTML tags | `#569cd6` (blue) |
| `.tok-attr` | HTML attributes | `#9cdcfe` (cyan) |
| `.tok-str` | Strings | `#ce9178` (orange) |
| `.tok-kw` | Keywords | `#c586c0` (pink) |
| `.tok-num` | Numbers | `#b5cea8` (light green) |
| `.tok-bool` | Booleans | `#569cd6` (blue) |
| `.tok-fn` | Functions | `#dcdcaa` (yellow) |
| `.tok-prop` | CSS properties | `#9cdcfe` (cyan) |
| `.tok-punct` | Punctuation | `#808080` (gray) |
| `.tok-unit` | CSS units | `#b5cea8` (light green) |

## Implementation

The highlighting works by:

1. The `<textarea>` text is transparent
2. An overlaid `<pre><code>` displays the highlighted HTML
3. Both share the same font and scroll position
4. The textarea captures input, the pre displays the colors

```
+--------------------+
|  <textarea>        |  <- Input (transparent text, visible caret)
|  z-index: 2        |
+--------------------+
|  <pre><code>       |  <- Display (HTML with colored spans)
|  z-index: 1        |
+--------------------+
```
