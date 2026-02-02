# Utilidades Internas

Documentacion de funciones de utilidad incluidas en Shou Editor.

## Selectores DOM

### `$(selector, context?)`
Atajo para `querySelector`.

```javascript
const el = $('#mi-elemento');
const child = $('.child', parentElement);
```

### `$$(selector, context?)`
Atajo para `querySelectorAll` (devuelve Array).

```javascript
const items = $$('.item');
items.forEach(item => item.classList.add('active'));
```

## Eventos

### `on(element, event, selectorOrFn, fn?)`
Anade event listener con soporte para delegacion.

```javascript
// Listener directo
on(button, 'click', () => console.log('click'));

// Delegacion de eventos
on(list, 'click', '.item', (e, target) => {
  console.log('Item clickeado:', target);
});
```

## Texto

### `escapeHtml(string)`
Escapa caracteres HTML para mostrar como texto.

```javascript
escapeHtml('<script>');
// '&lt;script&gt;'
```

## Cursor

### `getCaretPos(textarea)`
Obtiene la posicion del cursor en un textarea.

```javascript
const { start, end } = getCaretPos(textarea);
```

### `setCaretPos(textarea, start, end?)`
Establece la posicion del cursor.

```javascript
setCaretPos(textarea, 10);       // Cursor en posicion 10
setCaretPos(textarea, 5, 15);    // Seleccion de 5 a 15
```

## Resaltado de Sintaxis

### `highlight(code, lang)`
Resalta codigo y devuelve HTML con clases CSS.

```javascript
const html = highlight('<div>Hola</div>', 'html');
const css = highlight('body { color: red; }', 'css');
const js = highlight('const x = 42;', 'js');
```

Ver [Sistema de Sintaxis](./syntax.md) para mas detalles.

## Bloques por Defecto

El objeto `DefaultBlocks` contiene todos los bloques disponibles organizados por categoria:

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

Accesible como `ShouEditor.Blocks` para consultar los bloques disponibles.
