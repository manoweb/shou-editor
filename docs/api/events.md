# Internal Event System

Documentation of event handling in Shou Editor.

## Architecture

Shou Editor does not use an external EventBus. Events are handled internally in the `Editor` class through native DOM event listeners.

## Event Delegation

The plugin uses an `on()` helper function for event delegation:

```javascript
// Signature
on(element, event, selectorOrCallback, callback?)

// Example: direct listener
on(button, 'click', () => console.log('click'));

// Example: delegation
on(panel, 'click', '.jse-block', (e, target) => {
  console.log('Bloque clickeado:', target);
});
```

## Canvas Events (iframe)

The following events are listened on the iframe `<body>`:

| Event | Behavior |
|-------|----------|
| `click` | Selects the clicked element |
| `mouseover` | Shows a dashed outline on hover |
| `mouseout` | Removes the hover outline |
| `dragover` | Shows the drop indicator (magnetic line) |
| `dragleave` | Hides the drop indicator |
| `drop` | Inserts the dragged block |
| `dblclick` | Activates contentEditable on the element |
| `blur` | Deactivates contentEditable, syncs code |
| `keydown` | Handles Delete and Escape |

## Toolbar Events

Managed through delegation from the root element:

| Selector | Event | Action |
|----------|-------|--------|
| `.jse-btn[data-action]` | click | new, open, save, preview, export, theme |
| `.jse-device-btn` | click | Changes device (desktop/tablet/mobile) |
| `.jse-view-btn` | click | Changes view (visual/code) |
| `.jse-toggle-btn` | click | Toggle outlines |
| `.jse-panel-tab` | click | Changes panel tab |
| `.jse-cat-header` | click | Collapses/expands block category |
| `.jse-section-header` | click | Collapses/expands style section |
| `.jse-code-tab` | click | Changes language in code editor |

## Mini Toolbar Events

The mini toolbar inside the iframe handles:

| Element | Event | Action |
|---------|-------|--------|
| `.jse-drag-handle` | mousedown | Starts element drag & drop |
| `document` (iframe) | mousemove | Shows magnetic line during drag |
| `document` (iframe) | mouseup | Drops element at new position |
| `button[data-action]` | click | Duplicate or delete |

## Code Editor Events

| Element | Event | Action |
|---------|-------|--------|
| `.jse-textarea` | input | Updates code and highlighting |
| `.jse-textarea` | scroll | Syncs highlight and line numbers scroll |
| `.jse-textarea` | keydown | Handles Tab (indentation) and Enter (auto-indent) |

## Synchronization Flow

```
Visual Editor -> syncToCode() -> Updates textarea + highlight + storage
Code Editor -> syncFromCode() -> Updates iframe body + CSS + layers
```
