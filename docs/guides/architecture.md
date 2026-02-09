# Project Architecture

Guide to the architecture and organization of Shou Editor.

## Design Principles

1. **Vanilla First**: Native ES6+ JavaScript without frameworks
2. **Self-Contained Plugin**: A single file that generates everything (HTML + CSS)
3. **IIFE Pattern**: Encapsulation without polluting the global scope
4. **Zero Dependencies**: No external libraries

## File Structure

```
js-editor/
+-- index.html              # Plugin usage example (~40 lines)
+-- js/
|   +-- app.js              # Complete plugin (~1000 lines)
+-- css/
|   +-- main.css            # (legacy - not required by the plugin)
|   +-- editor.css           # (legacy - not required by the plugin)
|   +-- themes/
|       +-- dark.css         # Dark theme CSS variables (reference)
|       +-- light.css        # Light theme CSS variables (reference)
+-- docs/                    # Documentation
+-- assets/                  # Resources
+-- CLAUDE.md                # Project instructions
```

**Note**: The CSS files in `css/` are for reference only. The plugin embeds all its CSS directly in `app.js` via `getEditorCSS()`.

## Plugin Architecture

```
app.js (IIFE)
|
+-- Utilities
|   +-- $(), $$()             DOM selectors
|   +-- on()                  Event delegation
|   +-- escapeHtml()          HTML escaping
|   +-- getCaretPos()         Cursor position
|   +-- setCaretPos()         Set cursor
|
+-- DefaultBlocks             Draggable blocks
|   +-- basic []              Text, Heading, Image, Link, Divider
|   +-- layout []             Container, 2/3 Columns
|   +-- bootstrap []          Card, Alert, Button, Table
|   +-- forms []              Input, Textarea, Select
|   +-- sections []           Navbar, Hero, Features, Footer
|
+-- Syntax Highlighting
|   +-- highlightHTML()       HTML highlighting
|   +-- highlightCSS()        CSS highlighting
|   +-- highlightJS()         JavaScript highlighting
|   +-- highlight()           Dispatcher
|
+-- getEditorTemplate()       Generates the editor HTML structure
+-- getEditorCSS()            Generates the editor embedded CSS
|
+-- Editor Class
|   +-- constructor()         Initialization
|   +-- injectCSS()           Injects <style> into <head>
|   +-- render()              Generates HTML in the container
|   +-- cacheElements()       Caches DOM references
|   +-- bindEvents()          Event listeners (toolbar, panels, etc.)
|   +-- initFrame()           Creates the canvas iframe
|   +-- setupFrame()          Canvas events (click, drag, etc.)
|   +-- setupDragHandle()     Drag & drop from mini toolbar
|   +-- showDropIndicator()   Magnetic line (blocks panel)
|   +-- showMoveIndicator()   Magnetic line (drag handle)
|   +-- createElementToolbar() Mini toolbar over element
|   +-- selectElement()       Selection with outline
|   +-- updateLayers()        DOM tree in layers panel
|   +-- syncToCode()          Canvas -> Code editor
|   +-- syncFromCode()        Code editor -> Canvas
|   +-- toggleOutlines()      Show/hide outlines
|   +-- saveToStorage()       localStorage persistence
|   +-- loadFromStorage()     Load from localStorage
|   +-- generateFullHtml()    Full HTML for export
|   +-- importHtml()          Parse imported HTML
|   +-- Public API            getHtml, setHtml, save, etc.
|
+-- ShouEditor (Global API)
    +-- version               '1.0.0'
    +-- Editor                Reference to the class
    +-- Blocks                Default blocks
    +-- init()                Creates new instance
```

## Data Flow

```
+-------------+
| Blocks      |--- click/drag ---> insertBlock() / insertBlockAtPosition()
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
| (DOM panel) |                    | (local)  |
+-------------+                    +----------+
```

## Iframe Canvas

The visual canvas uses an isolated iframe that contains:
- Bootstrap 5 CSS (via CDN `<link>`)
- Editor styles (selection, hover, drop indicator, mini toolbar, outlines)
- The user's HTML in `<body>`
- User's custom CSS (injected as `<style id="jse-custom-css">`)

The iframe allows:
- Complete style isolation
- Bootstrap without affecting the editor
- Safe visual editing

## Communication

There is no EventBus or pub/sub. Communication is direct within the `Editor` class:

- DOM events call Editor methods
- Editor methods directly update the panels
- `syncToCode()` and `syncFromCode()` maintain visual <-> code consistency

## CSS Injection

The plugin injects a single `<style id="jse-styles">` into the host document's `<head>`. If it already exists (multiple instances), it does not duplicate it.

All CSS uses the `.jse-` prefix to avoid conflicts with the host site's styles.
