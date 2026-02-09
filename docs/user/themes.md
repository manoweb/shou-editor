# Themes and Customization

Guide for customizing the appearance of Shou Editor.

## Included Themes

### Dark Theme
Default theme, ideal for long sessions.

- Background: Black/Dark gray (`#1e1e1e`)
- Text: Light gray (`#d4d4d4`)
- Accents: Blue (`#007acc`)

### Light Theme
Optimal for bright environments.

- Background: White (`#ffffff`)
- Text: Dark gray (`#1e1e1e`)
- Accents: Blue (`#007acc`)

## Change Theme

### From the Interface
Click the theme button (moon/sun icon) in the toolbar.

### From the API
```javascript
editor.setTheme('light');
editor.setTheme('dark');
editor.toggleTheme(); // Toggle between both
```

### From the Configuration
```javascript
const editor = ShouEditor.init('#editor', {
  theme: 'light'
});
```

## Plugin CSS Variables

The plugin uses CSS variables with the `--jse-` prefix, defined according to the theme:

### Dark Theme
```css
.jse-editor.theme-dark {
  --jse-bg: #1e1e1e;
  --jse-bg2: #252526;
  --jse-bg3: #323233;
  --jse-text: #d4d4d4;
  --jse-text2: #858585;
  --jse-border: #3c3c3c;
  --jse-accent: #007acc;
  --jse-hover: #2a2d2e;
}
```

### Light Theme
```css
.jse-editor.theme-light {
  --jse-bg: #fff;
  --jse-bg2: #f3f3f3;
  --jse-bg3: #f8f8f8;
  --jse-text: #1e1e1e;
  --jse-text2: #6e6e6e;
  --jse-border: #e0e0e0;
  --jse-accent: #007acc;
  --jse-hover: #e8e8e8;
}
```

## Syntax Colors

Syntax highlighting uses the following CSS classes (embedded in the plugin):

| Class | Element | Dark Color | Light Color |
|-------|---------|-----------|-------------|
| `.tok-comment` | Comments | `#6a9955` | `#6a9955` |
| `.tok-tag` | HTML Tags | `#569cd6` | `#569cd6` |
| `.tok-attr` | Attributes | `#9cdcfe` | `#9cdcfe` |
| `.tok-str` | Strings | `#ce9178` | `#ce9178` |
| `.tok-kw` | Keywords | `#c586c0` | `#c586c0` |
| `.tok-num` | Numbers | `#b5cea8` | `#b5cea8` |
| `.tok-bool` | Booleans | `#569cd6` | `#569cd6` |
| `.tok-fn` | Functions | `#dcdcaa` | `#dcdcaa` |
| `.tok-prop` | CSS Properties | `#9cdcfe` | `#9cdcfe` |
| `.tok-punct` | Punctuation | `#808080` | `#808080` |

## Persistence

The selected theme is automatically saved in LocalStorage with the key `{prefix}theme` and is restored when reopening the editor.
