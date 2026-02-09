# Getting Started

A quick guide to start using Shou Editor, the visual web page editor.

## 1. Open the Editor

Open `index.html` in your browser or start a local server (see [Installation](./INSTALLATION.md)).

## 2. Visual Mode (Default)

### Insert Components

1. **From the Blocks Panel** (left):
   - Click a block to insert it at the end of the canvas
   - Or drag the block and drop it where you want
   - A **magnetic indicator** (blue line) shows you where the block will be inserted

2. **Available categories**:
   - **Basic**: Text, headings, images, links, dividers
   - **Layout**: Containers, rows, columns (2, 3, 4)
   - **Bootstrap**: Cards, alerts, buttons, badges, lists, tables
   - **Forms**: Inputs, textareas, selects, checkboxes
   - **Sections**: Navbar, Hero, Features, Pricing, Testimonials, Contact, Footer

### Edit Elements

1. **Select**: Click on any element in the canvas
2. **Edit text**: Double-click for inline editing
3. **Modify styles**: Use the right panel (Styles)
4. **Delete**: Select the element and press `Delete`

### Mini Toolbar

When selecting an element, a floating mini toolbar appears above it:

| Button | Action |
|--------|--------|
| ✥ (Drag handle) | Hold and drag to move the element |
| ⧉ (Duplicate) | Creates a copy of the element |
| ✕ (Delete) | Deletes the element |

When dragging with the drag handle, the **magnetic indicator** appears showing where the element will be relocated.

### Edit CSS Styles

With an element selected, the right panel displays:
- **Dimensions**: Width, Height, Min/Max
- **Spacing**: Margin, Padding
- **Typography**: Font, Size, Weight, Color, Align
- **Background**: Color, Image, Size
- **Borders**: Width, Style, Color, Radius
- **Display**: Display, Position, Overflow

### Responsive View

Use the device icons in the top bar:
- **Desktop** (1200px)
- **Tablet** (768px)
- **Mobile** (375px)

### Visualize Invisible Containers

Click the **"Outlines"** button in the toolbar to show/hide dotted outlines on divs and invisible containers. This makes it easier to identify and select elements without borders or backgrounds.

## 3. Layers Panel

In the left panel, under the **"Layers"** tab:
- View your page's DOM structure as a tree
- Each layer displays the HTML tag and its first CSS class
- Click on a layer to select that element in the canvas
- Layers are visually separated with divider lines

## 4. Code Mode

Click the **"Code"** button to switch to the code editor:

### HTML
```html
<div class="container py-5">
  <h1>Hola Mundo</h1>
  <button class="btn btn-primary" id="btn">Click me</button>
</div>
```

### CSS
```css
.container {
  text-align: center;
}

h1 {
  color: #333;
}
```

### JavaScript
```javascript
document.getElementById('btn').addEventListener('click', () => {
  alert('¡Hola desde Shou Editor!');
  console.log('Botón clickeado');
});
```

## 5. Visual <-> Code Synchronization

- When switching from **visual to code**: the canvas HTML is copied to the code editor
- When switching from **code to visual**: the canvas is updated with your HTML and custom CSS is applied to the iframe

## 6. Save Your Work

### Auto-Save
The code is automatically saved to LocalStorage every time you make changes.

### Export HTML
1. Click **"Save"** in the toolbar (or `Ctrl+S`)
2. A `proyecto.html` file will be downloaded containing:
   - Bootstrap 5 CSS (CDN)
   - Your HTML
   - Your CSS
   - Your JavaScript

### Preview in New Window
Click **"Preview"** to open your project in a new tab.

## 7. Useful Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save (download file) |
| `Ctrl + O` | Open HTML file |
| `Tab` | Insert indentation (in code editor) |
| `Enter` | New line with auto-indentation |
| `Delete` | Delete selected element |
| `Escape` | Deselect element |

## Quick Example: Landing Page

1. Insert a **Navbar** block (Sections)
2. Insert a **Hero** block (Sections)
3. Insert a **Features** block (Sections)
4. Insert a **Footer** block (Sections)
5. Customize colors and text using the styles editor
6. Enable **Outlines** to see the structure
7. Save your project with `Ctrl+S`

## Next Step

Check the [User Manual](./user/interface.md) to learn about all the features.
