# Shou Editor Documentation

Welcome to the Shou Editor documentation, a visual web page editor in the style of GrapesJS built with vanilla JavaScript. It is a standalone plugin that generates its own HTML and CSS interface.

## Table of Contents

### Quick Start
- [Installation](./INSTALLATION.md)
- [Getting Started](./QUICKSTART.md)

### Developer Guides
- [Project Architecture](./guides/architecture.md)
- [Contributing to the Project](./guides/contributing.md)
- [Extending the Editor](./guides/extending.md)

### API Reference
- [Editor Core](./api/core.md)
- [Syntax System](./api/syntax.md)
- [Event System](./api/events.md)
- [Utilities](./api/utils.md)

### User Manual
- [Editor Interface](./user/interface.md)
- [Keyboard Shortcuts](./user/shortcuts.md)
- [Themes and Customization](./user/themes.md)
- [Export and Import](./user/export-import.md)

## Main Features

### Visual Editor (GrapesJS-style)
- **Blocks Panel**: Draggable components organized by categories
  - Basic (text, headings, images, links)
  - Layout (containers, rows, columns)
  - Bootstrap (cards, alerts, buttons, tables)
  - Forms (inputs, textareas, selects)
  - Sections (navbar, hero, features, pricing, footer)

- **Visual Canvas**: Real-time preview with iframe
  - Full Bootstrap 5 support
  - Responsive view (Desktop/Tablet/Mobile)
  - Visual element selection
  - Inline editing with double-click
  - Magnetic indicator when dragging blocks
  - Mini toolbar with drag & drop for reordering elements

- **CSS Styles Panel**: Visual property editor
  - Dimensions (width, height, min/max)
  - Spacing (margin, padding)
  - Typography (font, size, color, align)
  - Background (color, image)
  - Borders (width, style, color, radius)
  - Display and positioning

- **Layers Panel**: Visual DOM tree
  - Hierarchical element navigation with separators
  - Selection from the tree (click to select)
  - Displays tag + CSS class for each element

- **Container Visualization**: "Outlines" button to show/hide outlines of invisible divs

### Code Editor
- Syntax highlighting for HTML, CSS, JavaScript
- Line numbers
- Auto-indentation
- Tabs for HTML, CSS, and JS
- Bidirectional synchronization with the visual canvas

### Image Editor (Photoshop-like)
- **Layer System**: Layers with opacity, blend modes, visibility, drag-and-drop reordering, groups with folders
- **Selection Tools**: Rectangular, elliptical, polygon, freehand, and magic wand with marching ants animation
- **Drawing Tools**: Pencil, eraser, rectangle, circle, line, arrow, gradient, fill, eyedropper
- **Text Layers**: Re-editable text with 80+ Google Fonts via CDN, weight, style, spacing, decoration, alignment
- **Layer Styles**: Drop shadow, inner shadow, outer glow, stroke, color overlay with live preview
- **Import/Export**: Import images as layers (button + drag & drop). Export to PNG, JPEG, WebP with quality slider
- **Visual Resize**: 8 resize handles + proportional scaling with Shift. Zoom in/out, pan, scrollbars
- **Color Palette**: Color picker with hex input, web color palette, and swatches
- **Filters**: Brightness, contrast, saturation, blur, grayscale, sepia, hue in real time
- **Transforms**: Crop, resize, rotate, flip
- **Context Menu**: Right-click on layers for styles, resize, duplicate, delete
- **Undo/Redo**: Full history with keyboard shortcuts

### Other Features
- No external dependencies (vanilla JS)
- Standalone plugin: `app.js` (web editor) + `image-editor.js` (image editor)
- Automatically embedded CSS
- Light and dark themes
- Auto-save to LocalStorage
- Export to complete HTML with Bootstrap
- Import existing HTML files
- Minified versions available (`.min.js`)

## Requirements

- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection (only for loading Bootstrap CSS in the canvas)
- No additional software installation required

## Quick Interface Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│ Shou Editor  [New][Open][Save][Preview]  [🖥️📱💻]  [Visual|Code]     │
├──────────┬────────────────────────────────────────┬──────────────────┤
│ BLOCKS   │                                        │   STYLES         │
│ ──────── │                                        │   ────────       │
│ □ Text   │         ┌──────────────────┐          │   Dimensions     │
│ □ Title  │         │                  │          │   Spacing        │
│ □ Image  │         │  VISUAL CANVAS   │          │   Typography     │
│ □ Card   │         │  (Bootstrap 5)   │          │   Background     │
│ □ Alert  │         │                  │          │   Borders        │
│ □ Button │         └──────────────────┘          │   Display        │
│ □ Hero   │                                        │   ────────       │
│ □ Footer │     [Mini Toolbar: ✥ ⧉ ✕]             │   SETTINGS       │
│ ──────── │                                        │                  │
│ LAYERS   │                                        │                  │
│ <div>    │                                        │                  │
│ <h1>     │                                        │                  │
└──────────┴────────────────────────────────────────┴──────────────────┘
```

## Basic Usage

### Web Editor
```html
<script src="js/app.min.js"></script>
<script>
  const editor = ShouEditor.init('#editor', {
    theme: 'dark',
    width: '100%',
    height: '100vh'
  });
</script>
```

### Image Editor
```html
<script src="js/image-editor.min.js"></script>
<script>
  const imgEditor = JSImageEditor.init('#container', {
    theme: 'dark',
    lang: 'en',
    preset: { width: 800, height: 600 },
    onSave: (base64) => console.log('Saved!', base64)
  });
</script>
```

## License

MIT License - See the LICENSE file for more details.
