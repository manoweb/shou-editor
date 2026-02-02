# Interfaz del Editor

Guía completa de la interfaz de usuario de Shou Editor.

## Vista General

Shou Editor tiene un layout de 3 paneles con una barra de herramientas superior:

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOOLBAR                                                             │
│  Shou Editor  [Nuevo][Abrir][Guardar][Preview]  [⬚ Outlines]          │
│  [🖥️ Desktop][📱 Tablet][📲 Mobile]    [Visual | Código]    [🌙]    │
├──────────┬────────────────────────────────────────┬──────────────────┤
│ PANEL    │                                        │   PANEL          │
│ IZQUIERDO│                                        │   DERECHO        │
│ ──────── │                                        │   ────────       │
│ [Bloques]│         ┌──────────────────┐          │   ESTILOS        │
│ [Capas]  │         │                  │          │   Dimensiones    │
│          │         │  CANVAS VISUAL   │          │   Espaciado      │
│ □ Texto  │         │  (iframe con     │          │   Tipografía     │
│ □ Título │         │   Bootstrap 5)   │          │   Fondo          │
│ □ Imagen │         │                  │          │   Bordes         │
│ □ Card   │         │  [Mini Toolbar]  │          │   Display        │
│ □ Alert  │         │   ✥  ⧉  ✕       │          │   ────────       │
│ □ Hero   │         └──────────────────┘          │   SETTINGS       │
│          │                                        │   ID, clases     │
│ ──────── │   o bien:                              │                  │
│ CAPAS    │                                        │                  │
│ <div>    │   ┌──────────────────────────────┐    │                  │
│   <h1>   │   │  EDITOR DE CÓDIGO            │    │                  │
│   <p>    │   │  [HTML] [CSS] [JS]           │    │                  │
│          │   │  1│ <div class="container">  │    │                  │
│          │   │  2│   <h1>Hola</h1>          │    │                  │
│          │   └──────────────────────────────┘    │                  │
└──────────┴────────────────────────────────────────┴──────────────────┘
```

## Barra de Herramientas (Toolbar)

La toolbar ocupa la parte superior y se divide en zonas:

### Zona Izquierda - Acciones de Archivo

| Botón | Acción |
|-------|--------|
| **Nuevo** | Crear proyecto vacío (pide confirmación) |
| **Abrir** | Importar archivo HTML/HTM desde disco |
| **Guardar** | Descargar proyecto como `proyecto.html` |
| **Preview** | Abrir vista previa en nueva pestaña |

### Zona Central - Herramientas

| Botón | Acción |
|-------|--------|
| **Outlines** | Mostrar/ocultar contornos de contenedores invisibles |

### Zona de Dispositivos

| Botón | Ancho del Canvas |
|-------|-----------------|
| **Desktop** | 1200px |
| **Tablet** | 768px |
| **Mobile** | 375px |

### Zona Derecha - Vista y Tema

| Botón | Acción |
|-------|--------|
| **Visual** | Cambiar al canvas visual (WYSIWYG) |
| **Código** | Cambiar al editor de código |
| **Tema** (luna/sol) | Alternar entre tema oscuro y claro |

## Panel Izquierdo

Tiene dos pestañas:

### Pestaña Bloques

Muestra componentes organizados por categorías que puedes insertar en el canvas:

- **Básicos**: Texto, Título, Imagen, Enlace, Divisor
- **Layout**: Container, 2 Columnas, 3 Columnas
- **Bootstrap**: Card, Alerta, Botón, Tabla
- **Formularios**: Input, Textarea, Select
- **Secciones**: Navbar, Hero, Features, Footer

**Para insertar**: Haz clic en un bloque o arrástralo al canvas. Al arrastrar, aparece un indicador magnético (línea azul) que señala dónde se insertará.

### Pestaña Capas

Muestra el árbol DOM del contenido del canvas:

```
<div>.container
  <h1>
  <p>.lead
  <button>.btn
```

- Cada elemento muestra su tag HTML y su primera clase CSS
- Los elementos están separados por líneas divisorias
- **Click** en una capa selecciona ese elemento en el canvas
- La capa seleccionada se resalta en azul

## Canvas Visual (Centro)

El área central muestra el canvas visual cuando estás en modo "Visual":

- Es un **iframe** con Bootstrap 5 CSS cargado
- Muestra tu HTML renderizado en tiempo real
- Cambia de ancho según el dispositivo seleccionado

### Interacciones en el Canvas

| Acción | Resultado |
|--------|-----------|
| **Click** en un elemento | Lo selecciona (borde azul + mini toolbar) |
| **Doble click** en texto | Activa edición inline |
| **Delete** con elemento seleccionado | Elimina el elemento |
| **Escape** | Deselecciona el elemento |
| **Arrastrar bloque** desde el panel | Inserta con indicador magnético |

### Mini Toolbar

Al seleccionar un elemento, aparece una mini toolbar flotante encima de él:

```
┌────────────────┐
│  ✥  │  ⧉  ✕  │
└────────────────┘
```

| Botón | Función |
|-------|---------|
| **✥** (4 flechas) | **Drag handle** - Mantener pulsado y arrastrar para mover el elemento a otra posición. Aparece el indicador magnético al arrastrar. |
| **⧉** | **Duplicar** - Crea una copia del elemento justo después |
| **✕** | **Eliminar** - Elimina el elemento del canvas |

### Indicador Magnético

Al arrastrar un bloque (desde el panel o con el drag handle), una línea azul aparece entre los elementos del canvas indicando la posición de inserción:

```
┌──────────────┐
│  Elemento 1  │
├──────────────┤
│ ─── ● ────── │  ← Indicador magnético (línea azul con círculos)
├──────────────┤
│  Elemento 2  │
└──────────────┘
```

### Outlines (Contornos)

Al activar el botón **"Outlines"** en la toolbar, todos los contenedores (`div`, `section`, `header`, `footer`, `main`, `nav`, `article`, `aside`) muestran un borde punteado semitransparente. Esto permite visualizar elementos invisibles (sin fondo ni borde).

## Editor de Código (Centro)

Al cambiar a modo "Código", el centro muestra un editor de texto con:

### Pestañas de Lenguaje
- **HTML**: Código del body
- **CSS**: Estilos personalizados
- **JS**: JavaScript del proyecto

### Características del Editor
- Números de línea
- Resaltado de sintaxis con colores (keywords, strings, comentarios, etc.)
- Auto-indentación al pulsar Enter
- Inserción de 2 espacios con Tab
- Overlay transparente: el textarea captura input, un `<pre><code>` superpuesto muestra los colores

### Sincronización

- **Visual → Código**: Al cambiar a modo código, el HTML del canvas se copia al editor
- **Código → Visual**: Al cambiar a modo visual, el canvas se actualiza con el HTML editado y el CSS personalizado se inyecta en el iframe

## Panel Derecho

Muestra propiedades del elemento seleccionado en el canvas:

### Sección Estilos

| Grupo | Propiedades |
|-------|-------------|
| **Dimensiones** | width, height, min-width, max-width, min-height, max-height |
| **Espaciado** | margin (top, right, bottom, left), padding (top, right, bottom, left) |
| **Tipografía** | font-family, font-size, font-weight, color, text-align, line-height |
| **Fondo** | background-color, background-image, background-size |
| **Bordes** | border-width, border-style, border-color, border-radius |
| **Display** | display, position, overflow, z-index, opacity |

### Sección Settings

- **ID**: Identificador del elemento
- **Clases CSS**: Lista de clases del elemento

Los cambios se aplican en tiempo real al elemento seleccionado en el canvas.

## Persistencia

- El tema se guarda en `{prefijo}theme`
- El código HTML, CSS y JS se guarda automáticamente en localStorage
- Todo se restaura al reabrir el editor
