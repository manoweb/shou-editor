# Editor Interface

Complete guide to the Shou Editor user interface.

## Overview

Shou Editor has a 3-panel layout with a top toolbar:

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOOLBAR                                                             │
│  Shou Editor  [New][Open][Save][Preview]  [⬚ Outlines]               │
│  [🖥️ Desktop][📱 Tablet][📲 Mobile]    [Visual | Code]    [🌙]      │
├──────────┬────────────────────────────────────────┬──────────────────┤
│ LEFT     │                                        │   RIGHT          │
│ PANEL    │                                        │   PANEL          │
│ ──────── │                                        │   ────────       │
│ [Blocks] │         ┌──────────────────┐          │   STYLES         │
│ [Layers] │         │                  │          │   Dimensions     │
│          │         │  VISUAL CANVAS   │          │   Spacing        │
│ □ Text   │         │  (iframe with    │          │   Typography     │
│ □ Title  │         │   Bootstrap 5)   │          │   Background     │
│ □ Image  │         │                  │          │   Borders        │
│ □ Card   │         │  [Mini Toolbar]  │          │   Display        │
│ □ Alert  │         │   ✥  ⧉  ✕       │          │   ────────       │
│ □ Hero   │         └──────────────────┘          │   SETTINGS       │
│          │                                        │   ID, classes    │
│ ──────── │   or alternatively:                    │                  │
│ LAYERS   │                                        │                  │
│ <div>    │   ┌──────────────────────────────┐    │                  │
│   <h1>   │   │  CODE EDITOR                 │    │                  │
│   <p>    │   │  [HTML] [CSS] [JS]           │    │                  │
│          │   │  1│ <div class="container">  │    │                  │
│          │   │  2│   <h1>Hola</h1>          │    │                  │
│          │   └──────────────────────────────┘    │                  │
└──────────┴────────────────────────────────────────┴──────────────────┘
```

## Toolbar

The toolbar occupies the top area and is divided into zones:

### Left Zone - File Actions

| Button | Action |
|--------|--------|
| **New** | Create an empty project (prompts for confirmation) |
| **Open** | Import an HTML/HTM file from disk |
| **Save** | Download the project as `proyecto.html` |
| **Preview** | Open a preview in a new tab |

### Center Zone - Tools

| Button | Action |
|--------|--------|
| **Outlines** | Show/hide outlines of invisible containers |

### Device Zone

| Button | Canvas Width |
|--------|-------------|
| **Desktop** | 1200px |
| **Tablet** | 768px |
| **Mobile** | 375px |

### Right Zone - View and Theme

| Button | Action |
|--------|--------|
| **Visual** | Switch to the visual canvas (WYSIWYG) |
| **Code** | Switch to the code editor |
| **Theme** (moon/sun) | Toggle between dark and light theme |

## Left Panel

It has two tabs:

### Blocks Tab

Displays components organized by category that you can insert into the canvas:

- **Basic**: Text, Title, Image, Link, Divider
- **Layout**: Container, 2 Columns, 3 Columns
- **Bootstrap**: Card, Alert, Button, Table, Accordion, Carousel, Modal, Tabs, Badge, Progress, List Group, Breadcrumb, Pagination, Spinner, Toast
- **Forms**: Input, Textarea, Select, Checkbox, Radio, File, Range, Switch
- **Sections**: Navbar, Hero, Features, Footer

**To insert**: Click on a block or drag it onto the canvas. When dragging, a magnetic indicator (blue line) appears showing where the block will be inserted.

### Layers Tab

Displays the DOM tree of the canvas content:

```
<div>.container
  <h1>
  <p>.lead
  <button>.btn
```

- Each element displays its HTML tag and its first CSS class
- Elements are separated by divider lines
- **Click** on a layer to select that element on the canvas
- The selected layer is highlighted in blue

## Visual Canvas (Center)

The center area displays the visual canvas when in "Visual" mode:

- It is an **iframe** with Bootstrap 5 CSS loaded
- It shows your HTML rendered in real time
- Its width changes based on the selected device

### Canvas Interactions

| Action | Result |
|--------|--------|
| **Click** on an element | Selects it (blue border + mini toolbar) |
| **Double click** on text | Activates inline editing |
| **Delete** with an element selected | Deletes the element |
| **Escape** | Deselects the element |
| **Drag a block** from the panel | Inserts with magnetic indicator |

### Mini Toolbar

When you select an element, a floating mini toolbar appears above it:

```
┌────────────────┐
│  ✥  │  ⧉  ✕  │
└────────────────┘
```

| Button | Function |
|--------|----------|
| **✥** (4 arrows) | **Drag handle** - Hold and drag to move the element to another position. The magnetic indicator appears while dragging. |
| **⧉** | **Duplicate** - Creates a copy of the element right after it |
| **✕** | **Delete** - Removes the element from the canvas |

### Magnetic Indicator

When dragging a block (from the panel or with the drag handle), a blue line appears between canvas elements indicating the insertion position:

```
┌──────────────┐
│  Element 1   │
├──────────────┤
│ ─── ● ────── │  ← Magnetic indicator (blue line with circles)
├──────────────┤
│  Element 2   │
└──────────────┘
```

### Outlines

When the **"Outlines"** button is activated in the toolbar, all containers (`div`, `section`, `header`, `footer`, `main`, `nav`, `article`, `aside`) display a semi-transparent dashed border. This helps visualize invisible elements (those without a background or border).

## Code Editor (Center)

When switching to "Code" mode, the center area displays a text editor with:

### Language Tabs
- **HTML**: Body code
- **CSS**: Custom styles
- **JS**: Project JavaScript

### Editor Features
- Line numbers
- Syntax highlighting with colors (keywords, strings, comments, etc.)
- Auto-indentation when pressing Enter
- Insertion of 2 spaces with Tab
- Transparent overlay: the textarea captures input, while a superimposed `<pre><code>` displays the colors

### Synchronization

- **Visual -> Code**: When switching to code mode, the canvas HTML is copied to the editor
- **Code -> Visual**: When switching to visual mode, the canvas is updated with the edited HTML and the custom CSS is injected into the iframe

## Right Panel

Displays properties of the selected element on the canvas:

### Styles Section

| Group | Properties |
|-------|------------|
| **Dimensions** | width, height, min-width, max-width, min-height, max-height |
| **Spacing** | margin (top, right, bottom, left), padding (top, right, bottom, left) |
| **Typography** | font-family, font-size, font-weight, color, text-align, line-height |
| **Background** | background-color, background-image, background-size |
| **Borders** | border-width, border-style, border-color, border-radius |
| **Display** | display, position, overflow, z-index, opacity |

### Settings Section

- **ID**: Element identifier
- **CSS Classes**: List of the element's classes

Changes are applied in real time to the selected element on the canvas.

## Persistence

- The theme is saved in `{prefix}theme`
- The HTML, CSS, and JS code is automatically saved in localStorage
- Everything is restored when reopening the editor
