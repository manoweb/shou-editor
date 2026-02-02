# Primeros Pasos

Guía rápida para comenzar a usar Shou Editor, el editor visual de páginas web.

## 1. Abrir el Editor

Abre `index.html` en tu navegador o inicia un servidor local (ver [Instalación](./INSTALLATION.md)).

## 2. Modo Visual (Por defecto)

### Insertar Componentes

1. **Desde el Panel de Bloques** (izquierda):
   - Haz clic en un bloque para insertarlo al final del canvas
   - O arrastra el bloque y suéltalo donde quieras
   - Un **indicador magnético** (línea azul) te muestra dónde se insertará el bloque

2. **Categorías disponibles**:
   - **Básicos**: Texto, títulos, imágenes, enlaces, divisores
   - **Layout**: Contenedores, filas, columnas (2, 3, 4)
   - **Bootstrap**: Cards, alertas, botones, badges, listas, tablas
   - **Formularios**: Inputs, textareas, selects, checkboxes
   - **Secciones**: Navbar, Hero, Features, Precios, Testimonios, Contacto, Footer

### Editar Elementos

1. **Seleccionar**: Haz clic en cualquier elemento del canvas
2. **Editar texto**: Doble clic para edición inline
3. **Modificar estilos**: Usa el panel derecho (Estilos)
4. **Eliminar**: Selecciona el elemento y pulsa `Delete`

### Mini Toolbar

Al seleccionar un elemento aparece una mini toolbar flotante encima:

| Botón | Acción |
|-------|--------|
| ✥ (Drag handle) | Mantener pulsado y arrastrar para mover el elemento |
| ⧉ (Duplicar) | Crea una copia del elemento |
| ✕ (Eliminar) | Elimina el elemento |

Al arrastrar con el drag handle, aparece el **indicador magnético** que muestra dónde se reubicará el elemento.

### Editar Estilos CSS

Con un elemento seleccionado, el panel derecho muestra:
- **Dimensiones**: Width, Height, Min/Max
- **Espaciado**: Margin, Padding
- **Tipografía**: Font, Size, Weight, Color, Align
- **Fondo**: Color, Imagen, Size
- **Bordes**: Width, Style, Color, Radius
- **Display**: Display, Position, Overflow

### Vista Responsive

Usa los iconos de dispositivos en la barra superior:
- **Desktop** (1200px)
- **Tablet** (768px)
- **Mobile** (375px)

### Visualizar Contenedores Invisibles

Haz clic en el botón **"Outlines"** en la barra de herramientas para mostrar/ocultar contornos punteados en divs y contenedores invisibles. Esto facilita identificar y seleccionar elementos sin borde ni fondo.

## 3. Panel de Capas

En el panel izquierdo, pestaña **"Capas"**:
- Visualiza la estructura DOM de tu página como un árbol
- Cada capa muestra el tag HTML y su primera clase CSS
- Haz clic en una capa para seleccionar ese elemento en el canvas
- Las capas están separadas visualmente con líneas divisorias

## 4. Modo Código

Haz clic en el botón **"Código"** para cambiar al editor de código:

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

## 5. Sincronización Visual ↔ Código

- Al cambiar de **visual a código**: el HTML del canvas se copia al editor de código
- Al cambiar de **código a visual**: el canvas se actualiza con tu HTML y el CSS personalizado se aplica al iframe

## 6. Guardar tu Trabajo

### Guardado Automático
El código se guarda automáticamente en LocalStorage cada vez que haces cambios.

### Exportar HTML
1. Click en **"Guardar"** en la barra de herramientas (o `Ctrl+S`)
2. Se descargará un archivo `proyecto.html` con:
   - Bootstrap 5 CSS (CDN)
   - Tu HTML
   - Tu CSS
   - Tu JavaScript

### Vista Previa en Nueva Ventana
Click en **"Preview"** para abrir tu proyecto en una nueva pestaña.

## 7. Atajos Útiles

| Atajo | Acción |
|-------|--------|
| `Ctrl + S` | Guardar (descargar archivo) |
| `Ctrl + O` | Abrir archivo HTML |
| `Tab` | Insertar indentación (en editor de código) |
| `Enter` | Nueva línea con auto-indentación |
| `Delete` | Eliminar elemento seleccionado |
| `Escape` | Deseleccionar elemento |

## Ejemplo Rápido: Landing Page

1. Inserta un bloque **Navbar** (Secciones)
2. Inserta un bloque **Hero** (Secciones)
3. Inserta un bloque **Features** (Secciones)
4. Inserta un bloque **Footer** (Secciones)
5. Personaliza colores y textos usando el editor de estilos
6. Activa **Outlines** para ver la estructura
7. Guarda tu proyecto con `Ctrl+S`

## Siguiente Paso

Consulta el [Manual de Usuario](./user/interface.md) para conocer todas las funcionalidades.
