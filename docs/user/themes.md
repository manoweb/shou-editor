# Temas y Personalizacion

Guia para personalizar la apariencia de Shou Editor.

## Temas Incluidos

### Tema Oscuro (Dark)
Tema por defecto, ideal para largas sesiones.

- Fondo: Negro/Gris oscuro (`#1e1e1e`)
- Texto: Gris claro (`#d4d4d4`)
- Acentos: Azul (`#007acc`)

### Tema Claro (Light)
Optimo para ambientes con mucha luz.

- Fondo: Blanco (`#ffffff`)
- Texto: Gris oscuro (`#1e1e1e`)
- Acentos: Azul (`#007acc`)

## Cambiar Tema

### Desde la Interfaz
Click en el boton de tema (icono luna/sol) en la barra de herramientas.

### Desde la API
```javascript
editor.setTheme('light');
editor.setTheme('dark');
editor.toggleTheme(); // Alterna entre ambos
```

### Desde la Configuracion
```javascript
const editor = ShouEditor.init('#editor', {
  theme: 'light'
});
```

## Variables CSS del Plugin

El plugin usa variables CSS con prefijo `--jse-` que se definen segun el tema:

### Tema Oscuro
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

### Tema Claro
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

## Colores de Sintaxis

El resaltado de sintaxis usa las siguientes clases CSS (embebidas en el plugin):

| Clase | Elemento | Color Dark | Color Light |
|-------|----------|-----------|-------------|
| `.tok-comment` | Comentarios | `#6a9955` | `#6a9955` |
| `.tok-tag` | Tags HTML | `#569cd6` | `#569cd6` |
| `.tok-attr` | Atributos | `#9cdcfe` | `#9cdcfe` |
| `.tok-str` | Strings | `#ce9178` | `#ce9178` |
| `.tok-kw` | Keywords | `#c586c0` | `#c586c0` |
| `.tok-num` | Numeros | `#b5cea8` | `#b5cea8` |
| `.tok-bool` | Booleanos | `#569cd6` | `#569cd6` |
| `.tok-fn` | Funciones | `#dcdcaa` | `#dcdcaa` |
| `.tok-prop` | Propiedades CSS | `#9cdcfe` | `#9cdcfe` |
| `.tok-punct` | Puntuacion | `#808080` | `#808080` |

## Persistencia

El tema seleccionado se guarda automaticamente en LocalStorage con la clave `{prefijo}theme` y se restaura al reabrir el editor.
