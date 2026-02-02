# Arquitectura del Proyecto

Guia de la arquitectura y organizacion de Shou Editor.

## Principios de Diseno

1. **Vanilla First**: JavaScript nativo ES6+ sin frameworks
2. **Plugin Autonomo**: Un solo archivo que genera todo (HTML + CSS)
3. **IIFE Pattern**: Encapsulacion sin contaminar el scope global
4. **Zero Dependencies**: Sin librerias externas

## Estructura de Archivos

```
js-editor/
+-- index.html              # Ejemplo de uso del plugin (~40 lineas)
+-- js/
|   +-- app.js              # Plugin completo (~1000 lineas)
+-- css/
|   +-- main.css            # (legacy - no requerido por el plugin)
|   +-- editor.css           # (legacy - no requerido por el plugin)
|   +-- themes/
|       +-- dark.css         # Variables CSS tema oscuro (referencia)
|       +-- light.css        # Variables CSS tema claro (referencia)
+-- docs/                    # Documentacion
+-- assets/                  # Recursos
+-- CLAUDE.md                # Instrucciones del proyecto
```

**Nota**: Los archivos CSS en `css/` son de referencia. El plugin embebe todo su CSS directamente en `app.js` via `getEditorCSS()`.

## Arquitectura del Plugin

```
app.js (IIFE)
|
+-- Utilities
|   +-- $(), $$()             Selectores DOM
|   +-- on()                  Delegacion de eventos
|   +-- escapeHtml()          Escape HTML
|   +-- getCaretPos()         Posicion del cursor
|   +-- setCaretPos()         Establecer cursor
|
+-- DefaultBlocks             Bloques arrastrables
|   +-- basic []              Texto, Titulo, Imagen, Enlace, Divisor
|   +-- layout []             Container, 2/3 Columnas
|   +-- bootstrap []          Card, Alerta, Boton, Tabla
|   +-- forms []              Input, Textarea, Select
|   +-- sections []           Navbar, Hero, Features, Footer
|
+-- Syntax Highlighting
|   +-- highlightHTML()       Resaltado HTML
|   +-- highlightCSS()        Resaltado CSS
|   +-- highlightJS()         Resaltado JavaScript
|   +-- highlight()           Dispatcher
|
+-- getEditorTemplate()       Genera estructura HTML del editor
+-- getEditorCSS()            Genera CSS embebido del editor
|
+-- Editor Class
|   +-- constructor()         Inicializacion
|   +-- injectCSS()           Inyecta <style> en <head>
|   +-- render()              Genera HTML en el contenedor
|   +-- cacheElements()       Cache de referencias DOM
|   +-- bindEvents()          Event listeners (toolbar, panels, etc.)
|   +-- initFrame()           Crea iframe del canvas
|   +-- setupFrame()          Eventos del canvas (click, drag, etc.)
|   +-- setupDragHandle()     Drag & drop desde mini toolbar
|   +-- showDropIndicator()   Linea magnetica (bloques panel)
|   +-- showMoveIndicator()   Linea magnetica (drag handle)
|   +-- createElementToolbar() Mini toolbar sobre elemento
|   +-- selectElement()       Seleccion con outline
|   +-- updateLayers()        Arbol DOM en panel capas
|   +-- syncToCode()          Canvas -> Editor de codigo
|   +-- syncFromCode()        Editor de codigo -> Canvas
|   +-- toggleOutlines()      Mostrar/ocultar contornos
|   +-- saveToStorage()       Persistencia localStorage
|   +-- loadFromStorage()     Carga desde localStorage
|   +-- generateFullHtml()    HTML completo para exportar
|   +-- importHtml()          Parsea HTML importado
|   +-- API Publica           getHtml, setHtml, save, etc.
|
+-- ShouEditor (API Global)
    +-- version               '1.0.0'
    +-- Editor                Referencia a la clase
    +-- Blocks                Bloques por defecto
    +-- init()                Crea nueva instancia
```

## Flujo de Datos

```
+-------------+
| Bloques     |--- click/drag ---> insertBlock() / insertBlockAtPosition()
+-------------+                          |
                                         v
+-------------+     syncToCode()    +----------+
| Canvas      |-------------------->| Code     |
| (iframe)    |<--------------------| Editor   |
+-------------+     syncFromCode()  +----------+
      |                                  |
      v                                  v
+-------------+                    +----------+
| Layers      |                    | Storage  |
| (panel DOM) |                    | (local)  |
+-------------+                    +----------+
```

## Iframe Canvas

El canvas visual usa un iframe aislado que contiene:
- Bootstrap 5 CSS (via CDN `<link>`)
- Estilos del editor (seleccion, hover, drop indicator, mini toolbar, outlines)
- El HTML del usuario en `<body>`
- CSS personalizado del usuario (inyectado como `<style id="jse-custom-css">`)

El iframe permite:
- Aislamiento completo de estilos
- Bootstrap sin afectar al editor
- Edicion visual segura

## Comunicacion

No hay EventBus ni pub/sub. La comunicacion es directa dentro de la clase `Editor`:

- Los eventos del DOM llaman metodos del Editor
- Los metodos del Editor actualizan directamente los paneles
- `syncToCode()` y `syncFromCode()` mantienen la coherencia visual <-> codigo

## Inyeccion de CSS

El plugin inyecta un solo `<style id="jse-styles">` en el `<head>` del documento host. Si ya existe (multiples instancias), no lo duplica.

Todo el CSS usa el prefijo `.jse-` para evitar conflictos con estilos del sitio host.
