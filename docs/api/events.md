# Sistema de Eventos Interno

Documentacion del manejo de eventos en Shou Editor.

## Arquitectura

Shou Editor no usa un EventBus externo. Los eventos se manejan internamente en la clase `Editor` mediante event listeners nativos del DOM.

## Delegacion de Eventos

El plugin usa una funcion helper `on()` para delegacion de eventos:

```javascript
// Firma
on(elemento, evento, selectorOCallback, callback?)

// Ejemplo: listener directo
on(button, 'click', () => console.log('click'));

// Ejemplo: delegacion
on(panel, 'click', '.jse-block', (e, target) => {
  console.log('Bloque clickeado:', target);
});
```

## Eventos del Canvas (iframe)

Los siguientes eventos se escuchan en el `<body>` del iframe:

| Evento | Comportamiento |
|--------|---------------|
| `click` | Selecciona el elemento clickeado |
| `mouseover` | Muestra outline dashed en hover |
| `mouseout` | Elimina outline de hover |
| `dragover` | Muestra drop indicator (linea magnetica) |
| `dragleave` | Oculta drop indicator |
| `drop` | Inserta el bloque arrastrado |
| `dblclick` | Activa contentEditable en el elemento |
| `blur` | Desactiva contentEditable, sincroniza codigo |
| `keydown` | Gestiona Delete y Escape |

## Eventos de la Toolbar

Se gestionan mediante delegacion desde el elemento root:

| Selector | Evento | Accion |
|----------|--------|--------|
| `.jse-btn[data-action]` | click | new, open, save, preview, export, theme |
| `.jse-device-btn` | click | Cambia dispositivo (desktop/tablet/mobile) |
| `.jse-view-btn` | click | Cambia vista (visual/code) |
| `.jse-toggle-btn` | click | Toggle outlines |
| `.jse-panel-tab` | click | Cambia pestana de panel |
| `.jse-cat-header` | click | Colapsa/expande categoria de bloques |
| `.jse-section-header` | click | Colapsa/expande seccion de estilos |
| `.jse-code-tab` | click | Cambia lenguaje en editor de codigo |

## Eventos de la Mini Toolbar

La mini toolbar dentro del iframe gestiona:

| Elemento | Evento | Accion |
|----------|--------|--------|
| `.jse-drag-handle` | mousedown | Inicia drag & drop del elemento |
| `document` (iframe) | mousemove | Muestra linea magnetica durante drag |
| `document` (iframe) | mouseup | Suelta elemento en nueva posicion |
| `button[data-action]` | click | Duplicar o eliminar |

## Eventos del Editor de Codigo

| Elemento | Evento | Accion |
|----------|--------|--------|
| `.jse-textarea` | input | Actualiza codigo y resaltado |
| `.jse-textarea` | scroll | Sincroniza scroll del highlight y numeros |
| `.jse-textarea` | keydown | Gestiona Tab (indentacion) y Enter (auto-indent) |

## Flujo de Sincronizacion

```
Editor Visual -> syncToCode() -> Actualiza textarea + highlight + storage
Editor Codigo -> syncFromCode() -> Actualiza iframe body + CSS + capas
```
