# Internal Utilities

Documentation of utility functions included in Shou Editor.

## DOM Selectors

### `$(selector, context?)`
Shortcut for `querySelector`.

```javascript
const el = $('#mi-elemento');
const child = $('.child', parentElement);
```

### `$$(selector, context?)`
Shortcut for `querySelectorAll` (returns Array).

```javascript
const items = $$('.item');
items.forEach(item => item.classList.add('active'));
```

## Events

### `on(element, event, selectorOrFn, fn?)`
Adds an event listener with delegation support.

```javascript
// Direct listener
on(button, 'click', () => console.log('click'));

// Event delegation
on(list, 'click', '.item', (e, target) => {
  console.log('Item clickeado:', target);
});
```

## Text

### `escapeHtml(string)`
Escapes HTML characters for display as text.

```javascript
escapeHtml('<script>');
// '&lt;script&gt;'
```

## Cursor

### `getCaretPos(textarea)`
Gets the cursor position in a textarea.

```javascript
const { start, end } = getCaretPos(textarea);
```

### `setCaretPos(textarea, start, end?)`
Sets the cursor position.

```javascript
setCaretPos(textarea, 10);       // Cursor at position 10
setCaretPos(textarea, 5, 15);    // Selection from 5 to 15
```

## Syntax Highlighting

### `highlight(code, lang)`
Highlights code and returns HTML with CSS classes.

```javascript
const html = highlight('<div>Hola</div>', 'html');
const css = highlight('body { color: red; }', 'css');
const js = highlight('const x = 42;', 'js');
```

See [Syntax System](./syntax.md) for more details.

## Default Blocks

The `DefaultBlocks` object contains all available blocks organized by category:

```javascript
const DefaultBlocks = {
  basic: [
    { id: 'text', label: 'Texto', icon: 'T', html: '<p>...</p>' },
    { id: 'heading', label: 'Titulo', icon: 'H', html: '<h2>...</h2>' },
    // ...
  ],
  layout: [...],
  bootstrap: [...],
  forms: [...],
  sections: [...]
};
```

Accessible as `ShouEditor.Blocks` to query the available blocks.
