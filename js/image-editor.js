/**
 * JSImageEditor - Standalone Image Editor Plugin
 * 100% Vanilla JavaScript, no dependencies
 * Uses HTML5 Canvas API
 * Features: Layer system, Photoshop-like layout, JSON config
 */
(function(global) {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function on(el, evt, selOrFn, fn) {
    if (!el) return;
    if (typeof selOrFn === 'function') {
      el.addEventListener(evt, selOrFn);
    } else {
      el.addEventListener(evt, e => {
        const t = e.target.closest(selOrFn);
        if (t && el.contains(t)) fn.call(t, e, t);
      });
    }
  }

  // ── i18n ──────────────────────────────────────────
  const Lang = {
    en: {
      'tool.undo': 'Undo',
      'tool.redo': 'Redo',
      'tool.crop': 'Crop',
      'tool.resize': 'Resize',
      'tool.rotateLeft': 'Rotate left',
      'tool.rotateRight': 'Rotate right',
      'tool.flipH': 'Flip horizontal',
      'tool.flipV': 'Flip vertical',
      'tool.pencil': 'Pencil',
      'tool.rect': 'Rectangle',
      'tool.circle': 'Circle',
      'tool.line': 'Line',
      'tool.arrow': 'Arrow',
      'tool.text': 'Text',
      'tool.eraser': 'Eraser',
      'btn.save': 'Save',
      'btn.cancel': 'Cancel',
      'btn.reset': 'Reset',
      'btn.apply': 'Apply',
      'filter.brightness': 'Brightness',
      'filter.contrast': 'Contrast',
      'filter.saturation': 'Saturation',
      'filter.blur': 'Blur',
      'filter.grayscale': 'Grayscale',
      'filter.sepia': 'Sepia',
      'filter.hue': 'Hue',
      'opt.color': 'Color',
      'opt.fill': 'Fill',
      'opt.size': 'Size',
      'opt.font': 'Font',
      'opt.fontSize': 'Font size',
      'opt.width': 'Width',
      'opt.height': 'Height',
      'opt.lockRatio': 'Lock ratio',
      'opt.opacity': 'Opacity',
      'empty.loadImage': 'Drop an image here or click to load',
      'confirm.reset': 'Reset to original image?',
      'panel.layers': 'Layers',
      'panel.image': 'Image',
      'layer.add': 'New layer',
      'layer.delete': 'Delete layer',
      'layer.duplicate': 'Duplicate layer',
      'layer.background': 'Background',
      'layer.group': 'New group',
      'opt.blendMode': 'Blend',
      'tool.move': 'Move',
      'tool.pan': 'Pan',
      'tool.eyedropper': 'Eyedropper',
      'tool.fill': 'Fill',
      'tool.gradient': 'Gradient',
      'opt.tolerance': 'Tolerance',
      'opt.color1': 'Color 1',
      'opt.color2': 'Color 2',
      'opt.align': 'Align',
      'tool.selectRect': 'Rectangle select',
      'tool.selectEllipse': 'Ellipse select',
      'tool.selectPoly': 'Polygon select',
      'tool.selectFree': 'Free select',
      'tool.selectWand': 'Magic wand',
      'opt.tolerance': 'Tolerance',
      'sel.all': 'Select all',
      'sel.deselect': 'Deselect',
      'sel.invert': 'Invert',
      'sel.cropToSel': 'Crop to selection',
      'sel.delete': 'Delete',
      'tool.zoomIn': 'Zoom in',
      'tool.zoomOut': 'Zoom out',
      'tool.zoomFit': 'Fit to window',
      'opt.fontWeight': 'Weight',
      'opt.fontStyle': 'Style',
      'opt.letterSpacing': 'Spacing',
      'opt.lineHeight': 'Line height',
      'opt.textDecoration': 'Decoration',
      'opt.align': 'Align',
      'layer.resize': 'Resize Layer',
      'btn.import': 'Import',
      'btn.export': 'Export',
      'export.title': 'Export Image',
      'export.format': 'Format',
      'export.quality': 'Quality',
      'export.dimensions': 'Dimensions',
      'export.fileSize': 'Estimated Size',
      'export.download': 'Download',
      'layer.styles': 'Layer Styles',
      'effect.dropShadow': 'Drop Shadow',
      'effect.innerShadow': 'Inner Shadow',
      'effect.outerGlow': 'Outer Glow',
      'effect.stroke': 'Stroke',
      'effect.colorOverlay': 'Color Overlay',
      'effect.border': 'Border',
      'effect.gradientOverlay': 'Gradient Overlay',
      'effect.borderStyle': 'Style',
      'effect.borderRadius': 'Radius',
      'effect.gradientType': 'Type',
      'effect.gradientAngle': 'Angle',
      'effect.color1': 'Color 1',
      'effect.color2': 'Color 2',
      'effect.linear': 'Linear',
      'effect.radial': 'Radial',
      'effect.solid': 'Solid',
      'effect.dashed': 'Dashed',
      'effect.dotted': 'Dotted',
      'effect.color': 'Color',
      'effect.opacity': 'Opacity',
      'effect.blur': 'Blur',
      'effect.offsetX': 'Offset X',
      'effect.offsetY': 'Offset Y',
      'effect.size': 'Size',
      'effect.position': 'Position',
      'effect.blendMode': 'Blend Mode',
      'fonts.title': 'Google Fonts',
      'fonts.search': 'Search fonts…',
      'fonts.custom': 'Custom font name',
      'fonts.load': 'Load',
      'fonts.loading': 'Loading…',
      'fonts.loaded': 'Loaded fonts',
      'fonts.popular': 'Popular fonts',
      'menu.file': 'File',
      'menu.edit': 'Edit',
      'menu.image': 'Image',
      'menu.layer': 'Layer',
      'menu.select': 'Select',
      'menu.view': 'View',
      'menu.help': 'Help',
      'menu.about': 'About Shou Editor',
      'menu.shortcuts': 'Keyboard Shortcuts',
      'menu.newLayer': 'New Layer',
      'menu.deleteLayer': 'Delete Layer',
      'menu.duplicateLayer': 'Duplicate Layer',
      'menu.newGroup': 'New Group',
      'menu.layerStyles': 'Layer Styles',
      'menu.resizeLayer': 'Resize Layer',
      'menu.transform': 'Transform',
      'menu.filters': 'Filters',
      'menu.panels': 'Panels',
      'menu.showLayers': 'Layers Panel',
      'menu.showFilters': 'Filters Panel',
      'menu.showStatusBar': 'Status Bar',
      'menu.cut': 'Cut',
      'menu.copy': 'Copy',
      'menu.paste': 'Paste',
      'menu.delete': 'Delete',
      'menu.saveProject': 'Save Project',
      'menu.openProject': 'Open Project',
    },
    es: {
      'tool.undo': 'Deshacer',
      'tool.redo': 'Rehacer',
      'tool.crop': 'Recortar',
      'tool.resize': 'Redimensionar',
      'tool.rotateLeft': 'Rotar izquierda',
      'tool.rotateRight': 'Rotar derecha',
      'tool.flipH': 'Voltear horizontal',
      'tool.flipV': 'Voltear vertical',
      'tool.pencil': 'Lápiz',
      'tool.rect': 'Rectángulo',
      'tool.circle': 'Círculo',
      'tool.line': 'Línea',
      'tool.arrow': 'Flecha',
      'tool.text': 'Texto',
      'tool.eraser': 'Borrador',
      'btn.save': 'Guardar',
      'btn.cancel': 'Cancelar',
      'btn.reset': 'Restablecer',
      'btn.apply': 'Aplicar',
      'filter.brightness': 'Brillo',
      'filter.contrast': 'Contraste',
      'filter.saturation': 'Saturación',
      'filter.blur': 'Desenfoque',
      'filter.grayscale': 'Escala de grises',
      'filter.sepia': 'Sepia',
      'filter.hue': 'Tono',
      'opt.color': 'Color',
      'opt.fill': 'Relleno',
      'opt.size': 'Tamaño',
      'opt.font': 'Fuente',
      'opt.fontSize': 'Tamaño fuente',
      'opt.width': 'Ancho',
      'opt.height': 'Alto',
      'opt.lockRatio': 'Mantener proporción',
      'opt.opacity': 'Opacidad',
      'empty.loadImage': 'Arrastra una imagen aquí o haz clic para cargar',
      'confirm.reset': '¿Restablecer imagen original?',
      'panel.layers': 'Capas',
      'panel.image': 'Imagen',
      'layer.add': 'Nueva capa',
      'layer.delete': 'Eliminar capa',
      'layer.duplicate': 'Duplicar capa',
      'layer.background': 'Fondo',
      'layer.group': 'Nuevo grupo',
      'opt.blendMode': 'Mezcla',
      'tool.move': 'Mover',
      'tool.pan': 'Desplazar',
      'tool.eyedropper': 'Cuentagotas',
      'tool.fill': 'Relleno',
      'tool.gradient': 'Degradado',
      'opt.tolerance': 'Tolerancia',
      'opt.color1': 'Color 1',
      'opt.color2': 'Color 2',
      'opt.align': 'Alinear',
      'tool.selectRect': 'Selección rectangular',
      'tool.selectEllipse': 'Selección elíptica',
      'tool.selectPoly': 'Selección poligonal',
      'tool.selectFree': 'Selección libre',
      'tool.selectWand': 'Varita mágica',
      'opt.tolerance': 'Tolerancia',
      'sel.all': 'Seleccionar todo',
      'sel.deselect': 'Deseleccionar',
      'sel.invert': 'Invertir',
      'sel.cropToSel': 'Recortar a selección',
      'sel.delete': 'Eliminar',
      'tool.zoomIn': 'Ampliar',
      'tool.zoomOut': 'Reducir',
      'tool.zoomFit': 'Ajustar a ventana',
      'opt.fontWeight': 'Grosor',
      'opt.fontStyle': 'Estilo',
      'opt.letterSpacing': 'Espaciado',
      'opt.lineHeight': 'Interlineado',
      'opt.textDecoration': 'Decoración',
      'opt.align': 'Alinear',
      'layer.resize': 'Redimensionar capa',
      'btn.import': 'Importar',
      'btn.export': 'Exportar',
      'export.title': 'Exportar Imagen',
      'export.format': 'Formato',
      'export.quality': 'Calidad',
      'export.dimensions': 'Dimensiones',
      'export.fileSize': 'Tamaño estimado',
      'export.download': 'Descargar',
      'layer.styles': 'Estilos de Capa',
      'effect.dropShadow': 'Sombra Paralela',
      'effect.innerShadow': 'Sombra Interior',
      'effect.outerGlow': 'Resplandor Exterior',
      'effect.stroke': 'Trazo',
      'effect.colorOverlay': 'Superposición de Color',
      'effect.border': 'Borde',
      'effect.gradientOverlay': 'Degradado',
      'effect.borderStyle': 'Estilo',
      'effect.borderRadius': 'Radio',
      'effect.gradientType': 'Tipo',
      'effect.gradientAngle': 'Ángulo',
      'effect.color1': 'Color 1',
      'effect.color2': 'Color 2',
      'effect.linear': 'Lineal',
      'effect.radial': 'Radial',
      'effect.solid': 'Sólido',
      'effect.dashed': 'Discontinuo',
      'effect.dotted': 'Punteado',
      'effect.color': 'Color',
      'effect.opacity': 'Opacidad',
      'effect.blur': 'Desenfoque',
      'effect.offsetX': 'Desplazamiento X',
      'effect.offsetY': 'Desplazamiento Y',
      'effect.size': 'Tamaño',
      'effect.position': 'Posición',
      'effect.blendMode': 'Modo de Fusión',
      'fonts.title': 'Google Fonts',
      'fonts.search': 'Buscar fuentes…',
      'fonts.custom': 'Nombre de fuente personalizado',
      'fonts.load': 'Cargar',
      'fonts.loading': 'Cargando…',
      'fonts.loaded': 'Fuentes cargadas',
      'fonts.popular': 'Fuentes populares',
      'menu.file': 'Archivo',
      'menu.edit': 'Editar',
      'menu.image': 'Imagen',
      'menu.layer': 'Capa',
      'menu.select': 'Selección',
      'menu.view': 'Vista',
      'menu.help': 'Ayuda',
      'menu.about': 'Acerca de Shou Editor',
      'menu.shortcuts': 'Atajos de teclado',
      'menu.newLayer': 'Nueva capa',
      'menu.deleteLayer': 'Eliminar capa',
      'menu.duplicateLayer': 'Duplicar capa',
      'menu.newGroup': 'Nuevo grupo',
      'menu.layerStyles': 'Estilos de capa',
      'menu.resizeLayer': 'Redimensionar capa',
      'menu.transform': 'Transformar',
      'menu.filters': 'Filtros',
      'menu.panels': 'Paneles',
      'menu.showLayers': 'Panel de capas',
      'menu.showFilters': 'Panel de filtros',
      'menu.showStatusBar': 'Barra de estado',
      'menu.cut': 'Cortar',
      'menu.copy': 'Copiar',
      'menu.paste': 'Pegar',
      'menu.delete': 'Eliminar',
      'menu.saveProject': 'Guardar proyecto',
      'menu.openProject': 'Abrir proyecto',
    }
  };

  let currentLang = 'en';
  function t(key) {
    return (Lang[currentLang] && Lang[currentLang][key]) || Lang.en[key] || key;
  }

  // ── Icons (SVG monocromo) ─────────────────────────
  const Icons = {
    undo:        '<svg viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>',
    redo:        '<svg viewBox="0 0 24 24"><path d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.97 7.22L3.9 16c1.05-3.19 4.06-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>',
    crop:        '<svg viewBox="0 0 24 24"><path d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z"/></svg>',
    resize:      '<svg viewBox="0 0 24 24"><path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"/></svg>',
    rotateLeft:  '<svg viewBox="0 0 24 24"><path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zM7.1 18.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/></svg>',
    rotateRight: '<svg viewBox="0 0 24 24"><path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/></svg>',
    flipH:       '<svg viewBox="0 0 24 24"><path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8-2h2v22h-2V1zm8 10h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-4h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2z"/></svg>',
    flipV:       '<svg viewBox="0 0 24 24"><path d="M21 15v2h-2v-2h2zm-12 4v2H7v-2h2zM5 3c-1.1 0-2 .9-2 2h2V3zm14 0v2h2c0-1.1-.9-2-2-2zM1 11v2h22v-2H1zm10-8v2h-2V3h2zm0 18h-2v2h2v-2zM3 19c0 1.1.9 2 2 2v-2H3zm0-4h2v-2H3v2zm0-8h2V5H3v2zm16 4h2v-2h-2v2zm0 8v-2h2c0 1.1-.9 2-2 2zm0-4h2v-2h-2v2z"/></svg>',
    pencil:      '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>',
    rect:        '<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/></svg>',
    circle:      '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>',
    line:        '<svg viewBox="0 0 24 24"><path d="M4.22 19.78a.75.75 0 010-1.06L18.72 4.22a.75.75 0 011.06 1.06L5.28 19.78a.75.75 0 01-1.06 0z"/></svg>',
    arrow:       '<svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
    text:        '<svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4z"/></svg>',
    eraser:      '<svg viewBox="0 0 24 24"><path d="M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.77-.78 2.04 0 2.83l3.85 3.85h7.49l8.48-8.48c.78-.78.78-2.05 0-2.83l-5.86-5.86A2.006 2.006 0 0015.14 3zM5.04 18.96l-1.42-1.42 5.14-5.14 1.41 1.41-5.13 5.15z"/></svg>',
    save:        '<svg viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
    cancel:      '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    reset:       '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>',
    upload:      '<svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>',
    eye:         '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',
    eyeOff:      '<svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>',
    layerAdd:    '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    layerDelete: '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
    layerDup:    '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
    move:        '<svg viewBox="0 0 24 24"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>',
    pan:         '<svg viewBox="0 0 24 24"><path d="M18 24h-6.55c-1.08 0-2.14-.45-2.89-1.23l-5.5-6.04.84-.72c.5-.43 1.21-.51 1.77-.22L9 17.89V3.5a1.5 1.5 0 013 0v5h.5a1.5 1.5 0 013 0V9a1.5 1.5 0 013 0v1.5a1.5 1.5 0 013 0V19c0 2.76-2.24 5-5 5zM5.96 17.27l4.09 4.49c.43.47 1.03.74 1.65.74H18c1.65 0 3-1.35 3-3v-7.5a.5.5 0 00-1 0V14h-1v-3.5a.5.5 0 00-1 0V14h-1v-4a.5.5 0 00-1 0v4h-1V3.5a.5.5 0 00-1 0v10.26l-4.42-2.45c-.18-.1-.4-.08-.56.05l-.23.19 4.17 5.45H11V17l-5.04-2.73V17.27z"/></svg>',
    eyedropper:  '<svg viewBox="0 0 24 24"><path d="M20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0l-3.12 3.12-1.42-1.42-1.41 1.42 1.41 1.41L3.71 16.53c-.2.19-.31.45-.31.72V21h3.75c.27 0 .52-.11.71-.29l8.72-8.72 1.41 1.41 1.42-1.41-1.42-1.42 3.12-3.12a1 1 0 000-1.42zM6.92 19H5v-1.92l8.06-8.06 1.92 1.92L6.92 19z"/></svg>',
    fill:  '<svg viewBox="0 0 24 24"><path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15a1.49 1.49 0 000 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/></svg>',
    gradient:    '<svg viewBox="0 0 24 24"><path d="M11 9h2v2h-2V9zm-2 2h2v2H9v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2V9zM7 9h2v2H7V9zm12-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V5h14v6z"/></svg>',
    folder:      '<svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
    folderOpen:  '<svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>',
    chevronRight:'<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>',
    selectRect:  '<svg viewBox="0 0 24 24"><path d="M3 3h4v2H5v2H3V3zm8 0h2v2h-2V3zm6 0h4v4h-2V5h-2V3zM3 11h2v2H3v-2zm16 0h2v2h-2v-2zM3 17h2v2h2v2H3v-4zm8 2h2v2h-2v-2zm6 0h2v2h2v-2h-2zm2-2h2v-2h-2v2z"/></svg>',
    selectEllipse:'<svg viewBox="0 0 24 24"><path d="M12 4c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm0 2c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/><path d="M12 2c-.6 0-1.19.05-1.76.16l.35 1.97A8.1 8.1 0 0112 4c.47 0 .94.04 1.39.13l.37-1.97C13.19 2.05 12.6 2 12 2z" opacity=".5"/></svg>',
    selectPoly:  '<svg viewBox="0 0 24 24"><path d="M2 4l5 16h10l5-12-8-7L2 4zm3.09 1.63L12 3.2l6.18 5.41L14.27 18H7.73L3.09 5.63z"/></svg>',
    selectFree:  '<svg viewBox="0 0 24 24"><path d="M15.5 2C13 2 10.7 3.2 9.3 5.1c-.8-.1-1.5-.1-2.3-.1C3.6 5 1 7.6 1 11c0 2.9 2 5.4 4.8 5.9l.4-2C4.3 14.5 3 13 3 11c0-2.2 1.8-4 4-4 .3 0 .5 0 .8.1C8.6 9.4 10.8 11 13.5 11c.5 0 1-.1 1.5-.2l-.5-2c-.3.1-.7.2-1 .2-1.9 0-3.5-1.1-4.2-2.7C10.4 4.3 12.7 3 15.5 3 18.5 3 21 5.5 21 8.5S18.5 14 15.5 14v2c3.6 0 6.5-2.9 6.5-6.5S19.1 2 15.5 2z"/></svg>',
    selectWand:  '<svg viewBox="0 0 24 24"><path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7l2.5-1.4zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14l-2.5 1.4zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5L22 2zM14.37 7.29L12.4 9.27l2.34 2.34 1.98-1.98c.39-.39.39-1.02 0-1.41l-.93-.93c-.39-.39-1.03-.39-1.42 0zM11.34 10.34l-7.26 7.26c-.39.39-.39 1.02 0 1.41l.93.93c.39.39 1.02.39 1.41 0l7.26-7.26-2.34-2.34z"/></svg>',
    zoomIn:      '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z"/></svg>',
    zoomOut:     '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>',
    zoomFit:     '<svg viewBox="0 0 24 24"><path d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/></svg>',
    download:    '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
    importImg:   '<svg viewBox="0 0 24 24"><path d="M21 15v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-4h2v4h14v-4h2zM7 10l1.41 1.41L11 8.83V16h2V8.83l2.59 2.58L17 10l-5-5-5 5z"/></svg>',
    layerStyles: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
  };

  // ── Layer Class ─────────────────────────────────────
  let _layerNextId = 1;

  class Layer {
    constructor(options = {}) {
      this.id = _layerNextId++;
      this.name = options.name || `Layer ${this.id}`;
      this.visible = options.visible !== undefined ? options.visible : true;
      this.opacity = options.opacity !== undefined ? options.opacity : 1.0;
      this.locked = false;
      this.blendMode = options.blendMode || 'normal';
      this.effects = options.effects ? JSON.parse(JSON.stringify(options.effects)) : {
        dropShadow:   { enabled: false, offsetX: 5, offsetY: 5, blur: 10, color: '#000000', opacity: 0.75 },
        innerShadow:  { enabled: false, offsetX: 5, offsetY: 5, blur: 10, color: '#000000', opacity: 0.75 },
        outerGlow:    { enabled: false, blur: 10, color: '#ffffff', opacity: 0.75 },
        stroke:       { enabled: false, size: 3, color: '#000000', position: 'outside' },
        colorOverlay: { enabled: false, color: '#ff0000', opacity: 0.5, blendMode: 'normal' },
        border:       { enabled: false, size: 2, color: '#000000', style: 'solid', radius: 0, opacity: 1 },
        gradientOverlay: { enabled: false, color1: '#000000', color2: '#ffffff', type: 'linear', angle: 0, opacity: 0.75 }
      };
      this.width = options.width || 0;
      this.height = options.height || 0;

      // Type: 'raster' | 'text' | 'group'
      this.type = options.type || 'raster';

      // Text layer data
      this.textData = options.textData || null;

      // Group layer data
      this.children = [];
      this.collapsed = false;
      this.parentId = options.parentId || null;

      // Canvas (not used for groups)
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext('2d');

      // Fill if specified
      if (options.fill) {
        this.ctx.fillStyle = options.fill;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }

      // Render text if textData provided
      if (this.type === 'text' && this.textData) {
        this._renderText();
      }
    }

    _renderText() {
      if (!this.textData) return;
      const td = this.textData;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = td.color || '#000000';
      const fStyle = td.fontStyle || 'normal';
      const fWeight = td.fontWeight || 'normal';
      const fSize = td.fontSize || 24;
      const fFamily = td.fontFamily || 'Arial';
      ctx.font = `${fStyle} ${fWeight} ${fSize}px ${fFamily}`;
      ctx.textBaseline = 'top';
      ctx.textAlign = td.align || 'left';
      const lSpacing = td.letterSpacing || 0;
      if (typeof ctx.letterSpacing !== 'undefined') {
        ctx.letterSpacing = lSpacing + 'px';
      }
      const lineH = fSize * (td.lineHeight || 1.2);
      const lines = (td.text || '').split('\n');
      let xBase = td.x || 0;
      if (td.align === 'center') xBase = this.width / 2;
      else if (td.align === 'right') xBase = this.width;
      const deco = td.textDecoration || 'none';
      lines.forEach((line, i) => {
        const yPos = (td.y || 0) + i * lineH;
        // Manual letter spacing fallback if API not supported
        if (lSpacing !== 0 && typeof ctx.letterSpacing === 'undefined') {
          let cx = xBase;
          const align = td.align || 'left';
          if (align === 'center' || align === 'right') {
            let totalW = 0;
            for (let c = 0; c < line.length; c++) totalW += ctx.measureText(line[c]).width + (c < line.length - 1 ? lSpacing : 0);
            if (align === 'center') cx -= totalW / 2;
            else cx -= totalW;
          }
          const savedAlign = ctx.textAlign;
          ctx.textAlign = 'left';
          for (let c = 0; c < line.length; c++) {
            ctx.fillText(line[c], cx, yPos);
            cx += ctx.measureText(line[c]).width + lSpacing;
          }
          ctx.textAlign = savedAlign;
        } else {
          ctx.fillText(line, xBase, yPos);
        }
        // Text decoration
        if (deco !== 'none' && line.length > 0) {
          const metrics = ctx.measureText(line);
          let lx = xBase;
          const tw = metrics.width;
          const align = td.align || 'left';
          if (align === 'center') lx -= tw / 2;
          else if (align === 'right') lx -= tw;
          let dy = 0;
          if (deco === 'underline') dy = yPos + fSize * 0.95;
          else if (deco === 'line-through') dy = yPos + fSize * 0.55;
          ctx.fillRect(lx, dy, tw, Math.max(1, fSize / 16));
        }
      });
      // Reset letterSpacing
      if (typeof ctx.letterSpacing !== 'undefined') ctx.letterSpacing = '0px';
    }

    resize(w, h) {
      const temp = document.createElement('canvas');
      temp.width = w;
      temp.height = h;
      const tctx = temp.getContext('2d');
      tctx.drawImage(this.canvas, 0, 0, w, h);
      this.canvas.width = w;
      this.canvas.height = h;
      this.width = w;
      this.height = h;
      this.ctx.drawImage(temp, 0, 0);
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    getThumbnail(thumbW = 40, thumbH = 30) {
      const tc = document.createElement('canvas');
      tc.width = thumbW;
      tc.height = thumbH;
      const tctx = tc.getContext('2d');
      // Checkerboard background for transparency
      tctx.fillStyle = '#ccc';
      tctx.fillRect(0, 0, thumbW, thumbH);
      for (let y = 0; y < thumbH; y += 4) {
        for (let x = 0; x < thumbW; x += 4) {
          if ((Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0) {
            tctx.fillStyle = '#fff';
            tctx.fillRect(x, y, 4, 4);
          }
        }
      }
      // Scale image to fit
      const scale = Math.min(thumbW / this.width, thumbH / this.height);
      const dw = this.width * scale;
      const dh = this.height * scale;
      const dx = (thumbW - dw) / 2;
      const dy = (thumbH - dh) / 2;
      tctx.drawImage(this.canvas, dx, dy, dw, dh);
      return tc.toDataURL();
    }

    serialize() {
      const s = {
        id: this.id,
        name: this.name,
        visible: this.visible,
        opacity: this.opacity,
        locked: this.locked,
        blendMode: this.blendMode,
        width: this.width,
        height: this.height,
        type: this.type,
        textData: this.textData ? { ...this.textData } : null,
        parentId: this.parentId,
        collapsed: this.collapsed,
      };
      if (this.type === 'group') {
        s.children = this.children.map(c => c.serialize());
      } else {
        s.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
      }
      return s;
    }

    serializeForProject() {
      const s = {
        id: this.id,
        name: this.name,
        visible: this.visible,
        opacity: this.opacity,
        locked: this.locked,
        blendMode: this.blendMode,
        width: this.width,
        height: this.height,
        type: this.type,
        textData: this.textData ? { ...this.textData } : null,
        parentId: this.parentId,
        collapsed: this.collapsed,
        effects: JSON.parse(JSON.stringify(this.effects)),
      };
      if (this.type === 'group') {
        s.children = this.children.map(c => c.serializeForProject());
      } else {
        s.imageDataURL = this.canvas.toDataURL('image/png');
      }
      return s;
    }

    static deserializeFromProject(data) {
      return new Promise(resolve => {
        const layer = new Layer({
          name: data.name,
          width: data.width,
          height: data.height,
          visible: data.visible,
          opacity: data.opacity,
          blendMode: data.blendMode,
          type: data.type || 'raster',
          textData: data.textData ? { ...data.textData } : null,
          parentId: data.parentId || null,
          effects: data.effects || undefined,
        });
        layer.id = data.id;
        layer.locked = data.locked;
        layer.collapsed = !!data.collapsed;
        if (data.type === 'group' && data.children) {
          Promise.all(data.children.map(c => Layer.deserializeFromProject(c))).then(children => {
            layer.children = children;
            resolve(layer);
          });
        } else if (data.imageDataURL) {
          const img = new Image();
          img.onload = () => {
            layer.ctx.drawImage(img, 0, 0);
            if (layer.type === 'text' && layer.textData) layer._renderText();
            resolve(layer);
          };
          img.onerror = () => resolve(layer);
          img.src = data.imageDataURL;
        } else {
          if (layer.type === 'text' && layer.textData) layer._renderText();
          resolve(layer);
        }
      });
    }

    static deserialize(data) {
      const layer = new Layer({
        name: data.name,
        width: data.width,
        height: data.height,
        visible: data.visible,
        opacity: data.opacity,
        blendMode: data.blendMode,
        type: data.type || 'raster',
        textData: data.textData ? { ...data.textData } : null,
        parentId: data.parentId || null,
      });
      layer.id = data.id;
      layer.locked = data.locked;
      layer.collapsed = !!data.collapsed;
      if (data.type === 'group' && data.children) {
        layer.children = data.children.map(c => Layer.deserialize(c));
      } else if (data.imageData) {
        layer.ctx.putImageData(data.imageData, 0, 0);
      }
      if (layer.type === 'text' && layer.textData) {
        layer._renderText();
      }
      return layer;
    }
  }

  // ── LayerManager Class ──────────────────────────────
  class LayerManager {
    constructor() {
      this.layers = [];        // bottom-to-top order
      this.activeLayerId = null;
      this.docWidth = 0;
      this.docHeight = 0;
    }

    get activeLayer() {
      return this.layers.find(l => l.id === this.activeLayerId) || null;
    }

    get activeIndex() {
      return this.layers.findIndex(l => l.id === this.activeLayerId);
    }

    initFromImage(img) {
      this.docWidth = img.width;
      this.docHeight = img.height;
      this.layers = [];
      const bgLayer = new Layer({
        name: t('layer.background'),
        width: img.width,
        height: img.height
      });
      bgLayer.ctx.drawImage(img, 0, 0);
      this.layers.push(bgLayer);
      this.activeLayerId = bgLayer.id;
    }

    initFromPreset(preset) {
      this.docWidth = preset.width || 800;
      this.docHeight = preset.height || 600;
      this.layers = [];

      if (preset.layers && preset.layers.length > 0) {
        for (const def of preset.layers) {
          const layer = new Layer({
            name: def.name || `Layer ${_layerNextId}`,
            width: this.docWidth,
            height: this.docHeight,
            opacity: def.opacity !== undefined ? def.opacity : 1,
            fill: def.fill || null
          });
          this.layers.push(layer);
        }
      } else {
        // Default: one background layer
        const bg = new Layer({
          name: t('layer.background'),
          width: this.docWidth,
          height: this.docHeight,
          fill: preset.background || '#ffffff'
        });
        this.layers.push(bg);
      }
      this.activeLayerId = this.layers[this.layers.length - 1].id;
    }

    addLayer(name) {
      const layer = new Layer({
        name: name || `Layer ${_layerNextId}`,
        width: this.docWidth,
        height: this.docHeight
      });
      const idx = this.activeIndex;
      this.layers.splice(idx + 1, 0, layer);
      this.activeLayerId = layer.id;
      return layer;
    }

    deleteLayer(id) {
      if (this.layers.length <= 1) return false;
      const idx = this.layers.findIndex(l => l.id === id);
      if (idx === -1) return false;
      this.layers.splice(idx, 1);
      if (this.activeLayerId === id) {
        const newIdx = Math.min(idx, this.layers.length - 1);
        this.activeLayerId = this.layers[newIdx].id;
      }
      return true;
    }

    duplicateLayer(id) {
      const src = this.layers.find(l => l.id === id);
      if (!src) return null;
      const dup = new Layer({
        name: src.name + ' copy',
        width: src.width,
        height: src.height,
        opacity: src.opacity,
        visible: src.visible
      });
      dup.ctx.drawImage(src.canvas, 0, 0);
      const idx = this.layers.indexOf(src);
      this.layers.splice(idx + 1, 0, dup);
      this.activeLayerId = dup.id;
      return dup;
    }

    moveLayer(fromIdx, toIdx) {
      if (fromIdx === toIdx) return;
      const [layer] = this.layers.splice(fromIdx, 1);
      this.layers.splice(toIdx, 0, layer);
    }

    setActive(id) {
      this.activeLayerId = id;
    }

    toggleVisibility(id) {
      const layer = this.layers.find(l => l.id === id);
      if (layer) layer.visible = !layer.visible;
    }

    setOpacity(id, opacity) {
      const layer = this.layers.find(l => l.id === id);
      if (layer) layer.opacity = Math.max(0, Math.min(1, opacity));
    }

    addGroup(name) {
      const group = new Layer({
        name: name || t('layer.group'),
        width: this.docWidth,
        height: this.docHeight,
        type: 'group',
      });
      const idx = this.activeIndex;
      this.layers.splice(idx + 1, 0, group);
      this.activeLayerId = group.id;
      return group;
    }

    moveToGroup(layerId, groupId) {
      if (layerId === groupId) return false;
      const layer = this.layers.find(l => l.id === layerId);
      const group = this.layers.find(l => l.id === groupId && l.type === 'group');
      if (!layer || !group) return false;
      // Remove from current location
      const idx = this.layers.indexOf(layer);
      if (idx !== -1) this.layers.splice(idx, 1);
      // Remove from any existing group
      for (const g of this.layers) {
        if (g.type === 'group') {
          const ci = g.children.indexOf(layer);
          if (ci !== -1) g.children.splice(ci, 1);
        }
      }
      layer.parentId = groupId;
      group.children.push(layer);
      return true;
    }

    removeFromGroup(layerId) {
      for (const g of this.layers) {
        if (g.type === 'group') {
          const ci = g.children.findIndex(c => c.id === layerId);
          if (ci !== -1) {
            const child = g.children.splice(ci, 1)[0];
            child.parentId = null;
            const gIdx = this.layers.indexOf(g);
            this.layers.splice(gIdx + 1, 0, child);
            return true;
          }
        }
      }
      return false;
    }

    _getBlendOp(blendMode) {
      return blendMode === 'normal' ? 'source-over' : blendMode;
    }

    _hexToRgba(hex, opacity) {
      const r = parseInt(hex.substr(1, 2), 16);
      const g = parseInt(hex.substr(3, 2), 16);
      const b = parseInt(hex.substr(5, 2), 16);
      return `rgba(${r},${g},${b},${opacity})`;
    }

    _applyLayerEffects(layer) {
      const fx = layer.effects;
      const src = layer.canvas;
      const w = src.width, h = src.height;

      const result = document.createElement('canvas');
      result.width = w; result.height = h;
      const rctx = result.getContext('2d');

      // 1. Drop Shadow (behind)
      if (fx.dropShadow && fx.dropShadow.enabled) {
        const ds = fx.dropShadow;
        rctx.save();
        rctx.shadowOffsetX = ds.offsetX;
        rctx.shadowOffsetY = ds.offsetY;
        rctx.shadowBlur = ds.blur;
        rctx.shadowColor = this._hexToRgba(ds.color, ds.opacity);
        rctx.drawImage(src, 0, 0);
        rctx.restore();
        // Clear original pixels, keep only shadow
        rctx.save();
        rctx.globalCompositeOperation = 'destination-out';
        rctx.drawImage(src, 0, 0);
        rctx.restore();
      }

      // 2. Outer Glow (behind)
      if (fx.outerGlow && fx.outerGlow.enabled) {
        const og = fx.outerGlow;
        rctx.save();
        rctx.shadowOffsetX = 0;
        rctx.shadowOffsetY = 0;
        rctx.shadowBlur = og.blur;
        rctx.shadowColor = this._hexToRgba(og.color, og.opacity);
        rctx.drawImage(src, 0, 0);
        rctx.restore();
        rctx.save();
        rctx.globalCompositeOperation = 'destination-out';
        rctx.drawImage(src, 0, 0);
        rctx.restore();
      }

      // Draw original on top
      rctx.drawImage(src, 0, 0);

      // 3. Stroke
      if (fx.stroke && fx.stroke.enabled) {
        const st = fx.stroke;
        const strokeC = document.createElement('canvas');
        strokeC.width = w; strokeC.height = h;
        const sctx = strokeC.getContext('2d');
        // Dilate alpha mask
        const imgData = layer.ctx.getImageData(0, 0, w, h);
        const alpha = imgData.data;
        const dilated = new ImageData(w, h);
        const dd = dilated.data;
        const sz = st.size;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            let maxA = 0;
            for (let dy = -sz; dy <= sz; dy++) {
              for (let dx = -sz; dx <= sz; dx++) {
                if (dx * dx + dy * dy <= sz * sz) {
                  const nx = x + dx, ny = y + dy;
                  if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                    maxA = Math.max(maxA, alpha[(ny * w + nx) * 4 + 3]);
                  }
                }
              }
            }
            const idx = (y * w + x) * 4;
            dd[idx] = dd[idx + 1] = dd[idx + 2] = 255;
            dd[idx + 3] = maxA;
          }
        }
        sctx.putImageData(dilated, 0, 0);
        sctx.globalCompositeOperation = 'source-in';
        sctx.fillStyle = st.color;
        sctx.fillRect(0, 0, w, h);

        if (st.position === 'outside') {
          // Remove original shape from stroke
          sctx.globalCompositeOperation = 'destination-out';
          sctx.drawImage(src, 0, 0);
          sctx.globalCompositeOperation = 'source-over';
          // Draw stroke behind
          const tmp = document.createElement('canvas');
          tmp.width = w; tmp.height = h;
          const tctx = tmp.getContext('2d');
          tctx.drawImage(strokeC, 0, 0);
          tctx.drawImage(result, 0, 0);
          rctx.clearRect(0, 0, w, h);
          rctx.drawImage(tmp, 0, 0);
        } else if (st.position === 'inside') {
          sctx.globalCompositeOperation = 'destination-in';
          sctx.drawImage(src, 0, 0);
          // Subtract original opaque pixels, keep edge
          const edgeC = document.createElement('canvas');
          edgeC.width = w; edgeC.height = h;
          const ectx = edgeC.getContext('2d');
          ectx.drawImage(strokeC, 0, 0);
          ectx.globalCompositeOperation = 'destination-out';
          // Shrink: draw original offset inward
          const shrunk = document.createElement('canvas');
          shrunk.width = w; shrunk.height = h;
          const shctx = shrunk.getContext('2d');
          // Simply mask to original and draw on top
          rctx.drawImage(strokeC, 0, 0);
        } else { // center
          rctx.drawImage(strokeC, 0, 0);
          rctx.drawImage(src, 0, 0);
        }
      }

      // 4. Inner Shadow (on top, masked)
      if (fx.innerShadow && fx.innerShadow.enabled) {
        const is = fx.innerShadow;
        const isC = document.createElement('canvas');
        isC.width = w; isC.height = h;
        const ictx = isC.getContext('2d');
        ictx.fillStyle = this._hexToRgba(is.color, is.opacity);
        ictx.fillRect(0, 0, w, h);
        ictx.globalCompositeOperation = 'destination-out';
        ictx.shadowOffsetX = -is.offsetX;
        ictx.shadowOffsetY = -is.offsetY;
        ictx.shadowBlur = is.blur;
        ictx.shadowColor = 'rgba(0,0,0,1)';
        ictx.drawImage(src, 0, 0);
        ictx.globalCompositeOperation = 'destination-in';
        ictx.shadowOffsetX = 0;
        ictx.shadowOffsetY = 0;
        ictx.shadowBlur = 0;
        ictx.drawImage(src, 0, 0);
        rctx.drawImage(isC, 0, 0);
      }

      // 5. Color Overlay (on top, masked)
      if (fx.colorOverlay && fx.colorOverlay.enabled) {
        const co = fx.colorOverlay;
        const coC = document.createElement('canvas');
        coC.width = w; coC.height = h;
        const cctx = coC.getContext('2d');
        cctx.drawImage(src, 0, 0);
        cctx.globalCompositeOperation = 'source-in';
        cctx.fillStyle = co.color;
        cctx.fillRect(0, 0, w, h);
        rctx.globalAlpha = co.opacity;
        rctx.globalCompositeOperation = co.blendMode === 'normal' ? 'source-over' : co.blendMode;
        rctx.drawImage(coC, 0, 0);
        rctx.globalAlpha = 1;
        rctx.globalCompositeOperation = 'source-over';
      }

      // 6. Gradient Overlay (on top, masked to layer content)
      if (fx.gradientOverlay && fx.gradientOverlay.enabled) {
        const go = fx.gradientOverlay;
        const goC = document.createElement('canvas');
        goC.width = w; goC.height = h;
        const gctx = goC.getContext('2d');
        let grad;
        if (go.type === 'radial') {
          const cx = w / 2, cy = h / 2, r = Math.max(w, h) / 2;
          grad = gctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        } else {
          const angle = (go.angle || 0) * Math.PI / 180;
          const cx = w / 2, cy = h / 2;
          const len = Math.max(w, h) / 2;
          const x1 = cx - Math.cos(angle) * len;
          const y1 = cy - Math.sin(angle) * len;
          const x2 = cx + Math.cos(angle) * len;
          const y2 = cy + Math.sin(angle) * len;
          grad = gctx.createLinearGradient(x1, y1, x2, y2);
        }
        grad.addColorStop(0, go.color1);
        grad.addColorStop(1, go.color2);
        gctx.fillStyle = grad;
        gctx.fillRect(0, 0, w, h);
        // Mask to layer content
        gctx.globalCompositeOperation = 'destination-in';
        gctx.drawImage(src, 0, 0);
        rctx.globalAlpha = go.opacity;
        rctx.drawImage(goC, 0, 0);
        rctx.globalAlpha = 1;
      }

      // 7. Border (on top, drawn around layer bounds)
      if (fx.border && fx.border.enabled) {
        const bd = fx.border;
        rctx.save();
        rctx.globalAlpha = bd.opacity;
        // Find bounding box of non-transparent pixels
        const imgData = src.getContext('2d').getImageData(0, 0, w, h);
        const alpha = imgData.data;
        let minX = w, minY = h, maxX = 0, maxY = 0;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (alpha[(y * w + x) * 4 + 3] > 0) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX >= minX && maxY >= minY) {
          const bw = maxX - minX + 1;
          const bh = maxY - minY + 1;
          rctx.strokeStyle = bd.color;
          rctx.lineWidth = bd.size;
          if (bd.style === 'dashed') rctx.setLineDash([bd.size * 3, bd.size * 2]);
          else if (bd.style === 'dotted') rctx.setLineDash([bd.size, bd.size]);
          else rctx.setLineDash([]);
          const half = bd.size / 2;
          if (bd.radius > 0) {
            const r = Math.min(bd.radius, bw / 2, bh / 2);
            const rx = minX - half, ry = minY - half, rw = bw + bd.size, rh = bh + bd.size;
            rctx.beginPath();
            rctx.moveTo(rx + r, ry);
            rctx.lineTo(rx + rw - r, ry);
            rctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
            rctx.lineTo(rx + rw, ry + rh - r);
            rctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
            rctx.lineTo(rx + r, ry + rh);
            rctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
            rctx.lineTo(rx, ry + r);
            rctx.quadraticCurveTo(rx, ry, rx + r, ry);
            rctx.closePath();
            rctx.stroke();
          } else {
            rctx.strokeRect(minX - half, minY - half, bw + bd.size, bh + bd.size);
          }
          rctx.setLineDash([]);
        }
        rctx.restore();
      }

      return result;
    }

    _compositeLayer(layer, targetCtx) {
      if (!layer.visible || layer.opacity === 0) return;
      if (layer.type === 'group') {
        this._compositeGroup(layer, targetCtx);
      } else {
        const hasEffects = layer.effects && Object.values(layer.effects).some(fx => fx.enabled);
        const sourceCanvas = hasEffects ? this._applyLayerEffects(layer) : layer.canvas;
        targetCtx.globalAlpha = layer.opacity;
        targetCtx.globalCompositeOperation = this._getBlendOp(layer.blendMode);
        targetCtx.drawImage(sourceCanvas, 0, 0);
        targetCtx.globalAlpha = 1;
        targetCtx.globalCompositeOperation = 'source-over';
      }
    }

    _compositeGroup(group, targetCtx) {
      if (!group.visible || group.opacity === 0 || group.children.length === 0) return;
      const temp = document.createElement('canvas');
      temp.width = this.docWidth;
      temp.height = this.docHeight;
      const tctx = temp.getContext('2d');
      for (const child of group.children) {
        this._compositeLayer(child, tctx);
      }
      tctx.globalAlpha = 1.0;
      tctx.globalCompositeOperation = 'source-over';
      targetCtx.globalAlpha = group.opacity;
      targetCtx.globalCompositeOperation = this._getBlendOp(group.blendMode);
      targetCtx.drawImage(temp, 0, 0);
    }

    composite(targetCtx) {
      const w = this.docWidth;
      const h = this.docHeight;
      targetCtx.clearRect(0, 0, w, h);

      for (const layer of this.layers) {
        this._compositeLayer(layer, targetCtx);
      }
      targetCtx.globalAlpha = 1.0;
      targetCtx.globalCompositeOperation = 'source-over';
    }

    flatten() {
      const canvas = document.createElement('canvas');
      canvas.width = this.docWidth;
      canvas.height = this.docHeight;
      this.composite(canvas.getContext('2d'));
      return canvas;
    }

    serialize() {
      return {
        docWidth: this.docWidth,
        docHeight: this.docHeight,
        activeLayerId: this.activeLayerId,
        layers: this.layers.map(l => l.serialize())
      };
    }

    restore(data) {
      this.docWidth = data.docWidth;
      this.docHeight = data.docHeight;
      this.activeLayerId = data.activeLayerId;
      this.layers = data.layers.map(d => Layer.deserialize(d));
    }

    serializeForProject() {
      return {
        docWidth: this.docWidth,
        docHeight: this.docHeight,
        activeLayerId: this.activeLayerId,
        layers: this.layers.map(l => l.serializeForProject())
      };
    }

    async restoreFromProject(data) {
      this.docWidth = data.docWidth;
      this.docHeight = data.docHeight;
      this.activeLayerId = data.activeLayerId;
      this.layers = await Promise.all(data.layers.map(d => Layer.deserializeFromProject(d)));
    }
  }

  // ── CSS ───────────────────────────────────────────
  function getImageEditorCSS() {
    return `
/* Base */
.jsie-editor{display:flex;flex-direction:column;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;overflow:hidden;user-select:none;background:var(--jsie-bg);color:var(--jsie-text)}

/* Theme vars */
.jsie-editor.theme-dark{--jsie-bg:#1e1e1e;--jsie-bg2:#252526;--jsie-bg3:#2d2d2d;--jsie-text:#d4d4d4;--jsie-text2:#858585;--jsie-border:#3c3c3c;--jsie-accent:#007acc;--jsie-hover:#2a2d2e;--jsie-btn:#3c3c3c;--jsie-btn-hover:#4c4c4c;--jsie-input-bg:#3c3c3c;--jsie-slider-track:#555;--jsie-slider-thumb:#007acc;--jsie-layer-active:#094771}
.jsie-editor.theme-light{--jsie-bg:#ffffff;--jsie-bg2:#f3f3f3;--jsie-bg3:#e8e8e8;--jsie-text:#1e1e1e;--jsie-text2:#666;--jsie-border:#e0e0e0;--jsie-accent:#007acc;--jsie-hover:#e8e8e8;--jsie-btn:#e0e0e0;--jsie-btn-hover:#d0d0d0;--jsie-input-bg:#fff;--jsie-slider-track:#ccc;--jsie-slider-thumb:#007acc;--jsie-layer-active:#c8e1ff}

/* Menu bar */
.jsie-menubar{display:flex;align-items:center;padding:0 4px;background:var(--jsie-bg2);border-bottom:1px solid var(--jsie-border);height:26px;gap:0;position:relative;z-index:10004;flex-shrink:0}
.jsie-menu-item{padding:3px 10px;cursor:pointer;font-size:12px;color:var(--jsie-text);border-radius:3px;white-space:nowrap;user-select:none;position:relative}
.jsie-menu-item:hover{background:var(--jsie-hover)}
.jsie-menu-item.open{background:var(--jsie-accent);color:#fff}
.jsie-menu-dropdown{position:absolute;top:100%;left:0;min-width:220px;background:var(--jsie-bg2);border:1px solid var(--jsie-border);border-radius:4px;box-shadow:0 6px 20px rgba(0,0,0,.35);z-index:10005;padding:4px 0;margin-top:1px}
.jsie-menu-entry{display:flex;align-items:center;padding:5px 12px 5px 10px;cursor:pointer;font-size:12px;color:var(--jsie-text);gap:8px;white-space:nowrap;position:relative}
.jsie-menu-entry:hover{background:var(--jsie-hover)}
.jsie-menu-entry.disabled{opacity:.4;pointer-events:none}
.jsie-menu-entry svg{width:16px;height:16px;fill:currentColor;flex-shrink:0}
.jsie-menu-entry-icon{width:16px;height:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.jsie-menu-entry-label{flex:1}
.jsie-menu-shortcut{margin-left:auto;font-size:11px;color:var(--jsie-text2);padding-left:20px}
.jsie-menu-separator{height:1px;background:var(--jsie-border);margin:4px 8px}
.jsie-menu-sub-arrow{margin-left:auto;font-size:10px;color:var(--jsie-text2)}
.jsie-menu-has-sub{position:relative}
.jsie-menu-submenu{position:absolute;left:100%;top:-4px;min-width:180px;background:var(--jsie-bg2);border:1px solid var(--jsie-border);border-radius:4px;box-shadow:0 6px 20px rgba(0,0,0,.35);z-index:10006;padding:4px 0}
.jsie-menu-check{width:16px;text-align:center;font-size:12px;flex-shrink:0}

/* Options bar (top) */
.jsie-options-bar{display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:var(--jsie-bg2);border-bottom:1px solid var(--jsie-border);min-height:38px;gap:4px}
.jsie-options-left,.jsie-options-right{display:flex;align-items:center;gap:4px}
.jsie-options-left .jsie-sep{width:1px;height:24px;background:var(--jsie-border);margin:0 4px}
.jsie-tool-options{display:flex;align-items:center;gap:8px;font-size:12px}
.jsie-tool-options label{color:var(--jsie-text2);font-size:11px;white-space:nowrap}
.jsie-tool-options input[type="color"]{width:28px;height:24px;border:1px solid var(--jsie-border);border-radius:3px;padding:1px;cursor:pointer;background:transparent}
.jsie-tool-options input[type="range"]{width:70px;height:4px;-webkit-appearance:none;appearance:none;background:var(--jsie-slider-track);border-radius:2px;outline:none;cursor:pointer}
.jsie-tool-options input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:var(--jsie-slider-thumb);cursor:pointer;border:2px solid var(--jsie-bg)}
.jsie-tool-options input[type="range"]::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:var(--jsie-slider-thumb);cursor:pointer;border:2px solid var(--jsie-bg)}
.jsie-tool-options input[type="number"]{width:50px;height:24px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 4px;font-size:11px}
.jsie-tool-options select{height:24px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 4px;font-size:11px}
.jsie-tool-options .jsie-opt-check{display:flex;align-items:center;gap:3px}
.jsie-tool-options .jsie-opt-check input[type="checkbox"]{width:auto;height:auto}
.jsie-text-opts{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px}
.jsie-text-opts label{color:var(--jsie-text2);font-size:10px;white-space:nowrap}
.jsie-text-opts select{height:22px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 4px;font-size:10px;max-width:120px}
.jsie-text-opts input[type="color"]{width:24px;height:22px;border:1px solid var(--jsie-border);border-radius:3px;padding:1px;cursor:pointer;background:transparent}
.jsie-text-opts input[type="number"]{width:46px;height:22px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 4px;font-size:10px}
.jsie-text-opts .jsie-sep-v{width:1px;height:16px;background:var(--jsie-border);display:inline-block}
.jsie-text-opts .jsie-align-btn{width:24px;height:22px;border:1px solid var(--jsie-border);background:var(--jsie-input-bg);color:var(--jsie-text);border-radius:3px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}
.jsie-text-opts .jsie-align-btn.active{background:var(--jsie-accent);color:#fff;border-color:var(--jsie-accent)}
.jsie-text-opts .jsie-align-btn svg{width:14px;height:14px;fill:currentColor}
.jsie-gf-trigger{width:22px;height:22px;border:1px solid var(--jsie-border);background:var(--jsie-input-bg);color:var(--jsie-accent);border-radius:3px;cursor:pointer;font-weight:700;font-size:11px;display:inline-flex;align-items:center;justify-content:center;padding:0;margin-left:4px;flex-shrink:0}
.jsie-gf-trigger:hover{background:var(--jsie-accent);color:#fff}
.jsie-gf-chip{padding:4px 10px;border:1px solid var(--jsie-border);background:var(--jsie-input-bg);color:var(--jsie-text);border-radius:4px;cursor:pointer;font-size:12px;white-space:nowrap;transition:background .15s,border-color .15s}
.jsie-gf-chip:hover{border-color:var(--jsie-accent);background:rgba(0,120,255,.1)}
.jsie-gf-chip.loaded{border-color:var(--jsie-accent);color:var(--jsie-accent)}
.jsie-gf-chip:disabled{opacity:.5;cursor:wait}
.jsie-color-combo{display:inline-flex;align-items:center;gap:3px}
.jsie-hex-input{width:62px;height:22px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 4px;font-size:10px;font-family:monospace}
.jsie-palette-btn{width:22px;height:22px;border:1px solid var(--jsie-border);background:var(--jsie-input-bg);color:var(--jsie-text2);border-radius:3px;cursor:pointer;font-size:12px;display:inline-flex;align-items:center;justify-content:center;padding:0;line-height:1}
.jsie-palette-btn:hover{border-color:var(--jsie-accent);color:var(--jsie-accent)}
.jsie-color-palette{position:absolute;z-index:10002;background:var(--jsie-bg);border:1px solid var(--jsie-border);border-radius:6px;padding:8px;display:flex;flex-wrap:wrap;gap:3px;width:214px;box-shadow:0 4px 12px rgba(0,0,0,.3)}
.jsie-swatch{width:20px;height:20px;border-radius:3px;cursor:pointer;border:1px solid rgba(255,255,255,.1);transition:transform .1s}
.jsie-swatch:hover{transform:scale(1.3);z-index:1;border-color:var(--jsie-accent)}

/* Buttons */
.jsie-btn{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border:none;background:transparent;color:var(--jsie-text);border-radius:4px;cursor:pointer;padding:0;transition:background .15s}
.jsie-btn:hover{background:var(--jsie-hover)}
.jsie-btn.active{background:var(--jsie-accent);color:#fff}
.jsie-btn svg{width:18px;height:18px;fill:currentColor}
.jsie-btn-text{display:flex;align-items:center;gap:4px;height:28px;padding:0 10px;border:none;background:var(--jsie-accent);color:#fff;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;white-space:nowrap}
.jsie-btn-text:hover{opacity:.9}
.jsie-btn-text.secondary{background:var(--jsie-btn);color:var(--jsie-text)}
.jsie-btn-text.secondary:hover{background:var(--jsie-btn-hover)}
.jsie-btn-text svg{width:14px;height:14px;fill:currentColor}

/* Main body: 3-column layout */
.jsie-main-body{display:flex;flex:1;overflow:hidden}

/* Left toolbox */
.jsie-toolbox{width:40px;background:var(--jsie-bg2);border-right:1px solid var(--jsie-border);display:flex;flex-direction:column;align-items:center;padding:4px 0;gap:1px;flex-shrink:0}
.jsie-tool-btn{width:32px;height:32px;border:none;background:transparent;color:var(--jsie-text);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:background .15s}
.jsie-tool-btn:hover{background:var(--jsie-hover)}
.jsie-tool-btn.active{background:var(--jsie-accent);color:#fff}
.jsie-tool-btn svg{width:18px;height:18px;fill:currentColor}
.jsie-tool-sep{width:24px;height:1px;background:var(--jsie-border);margin:3px 0}
.jsie-tool-group{position:relative}
.jsie-group-arrow{position:absolute;bottom:0;right:0;width:12px;height:12px;cursor:pointer;display:flex;align-items:flex-end;justify-content:flex-end;padding:2px}
.jsie-group-arrow::after{content:'';width:0;height:0;border-left:4px solid transparent;border-top:4px solid currentColor}
.jsie-group-submenu{position:absolute;left:calc(100% + 2px);top:0;background:var(--jsie-bg2);border:1px solid var(--jsie-border);border-radius:4px;padding:4px;display:flex;flex-direction:column;gap:2px;z-index:100;box-shadow:0 2px 8px rgba(0,0,0,.3)}
.jsie-group-submenu .jsie-tool-btn{width:32px;height:32px}
.jsie-group-submenu .jsie-tool-btn.active{background:var(--jsie-accent);color:#fff}

/* Center canvas */
.jsie-canvas-area{flex:1;display:flex;overflow:auto;background:var(--jsie-bg3);position:relative}
.jsie-canvas-wrap{position:relative;display:inline-block;box-shadow:0 2px 12px rgba(0,0,0,0.3);margin:auto;flex-shrink:0;background-color:#fff;background-image:linear-gradient(45deg,#d0d0d0 25%,transparent 25%,transparent 75%,#d0d0d0 75%),linear-gradient(45deg,#d0d0d0 25%,transparent 25%,transparent 75%,#d0d0d0 75%);background-size:16px 16px;background-position:0 0,8px 8px}
.jsie-canvas-wrap canvas{display:block}
.jsie-canvas-wrap .jsie-interaction-canvas{position:absolute;top:0;left:0;z-index:5}

/* Right layers panel */
.jsie-layers-panel{width:220px;background:var(--jsie-bg2);border-left:1px solid var(--jsie-border);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}
.jsie-rpanel-tabs{display:flex;border-bottom:1px solid var(--jsie-border);flex-shrink:0}
.jsie-rpanel-tab{flex:1;padding:7px 0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;text-align:center;color:var(--jsie-text2);cursor:pointer;background:none;border:none;border-bottom:2px solid transparent;transition:color .15s,border-color .15s}
.jsie-rpanel-tab:hover{color:var(--jsie-text)}
.jsie-rpanel-tab.active{color:var(--jsie-accent);border-bottom-color:var(--jsie-accent)}
.jsie-rpanel-content{display:none;flex-direction:column;flex:1;overflow:hidden}
.jsie-rpanel-content.active{display:flex}
.jsie-filters-vertical{flex:1;overflow-y:auto;padding:8px 10px;display:flex;flex-direction:column;gap:10px}
.jsie-filters-vertical .jsie-filter-item{display:flex;flex-direction:column;gap:3px;font-size:11px;color:var(--jsie-text2)}
.jsie-filters-vertical .jsie-filter-item .jsie-filter-row{display:flex;align-items:center;gap:6px}
.jsie-filters-vertical .jsie-filter-item input[type="range"]{flex:1;height:4px;-webkit-appearance:none;appearance:none;background:var(--jsie-slider-track);border-radius:2px;outline:none;cursor:pointer}
.jsie-filters-vertical .jsie-filter-item input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--jsie-slider-thumb);cursor:pointer;border:2px solid var(--jsie-bg)}
.jsie-filters-vertical .jsie-filter-item input[type="range"]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--jsie-slider-thumb);cursor:pointer;border:2px solid var(--jsie-bg)}
.jsie-filters-vertical .jsie-filter-val{width:30px;text-align:right;font-variant-numeric:tabular-nums}
.jsie-layers-header{padding:8px 10px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--jsie-border);color:var(--jsie-text2)}
.jsie-layers-controls{padding:6px 10px;display:flex;align-items:center;gap:6px;border-bottom:1px solid var(--jsie-border);font-size:11px}
.jsie-layers-controls label{color:var(--jsie-text2);white-space:nowrap;font-size:10px}
.jsie-layers-controls input[type="range"]{flex:1;height:4px;-webkit-appearance:none;appearance:none;background:var(--jsie-slider-track);border-radius:2px;outline:none;cursor:pointer}
.jsie-layers-controls input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:var(--jsie-slider-thumb);cursor:pointer;border:2px solid var(--jsie-bg)}
.jsie-layers-controls input[type="range"]::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:var(--jsie-slider-thumb);cursor:pointer;border:2px solid var(--jsie-bg)}
.jsie-layer-opacity-val{width:30px;text-align:right;font-size:10px;font-variant-numeric:tabular-nums;color:var(--jsie-text2)}
.jsie-blend-select{flex:1;height:22px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 4px;font-size:10px}

/* Group layers */
.jsie-layer-item.group-item{background:var(--jsie-bg3)}
.jsie-layer-group-toggle{width:16px;height:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;opacity:.7}
.jsie-layer-group-toggle:hover{opacity:1}
.jsie-layer-group-toggle svg{width:14px;height:14px;fill:currentColor}
.jsie-layer-item.group-child{padding-left:22px}
.jsie-layer-text-icon{width:40px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid var(--jsie-border);border-radius:2px;background:var(--jsie-bg3);font-weight:700;font-size:16px;flex-shrink:0;color:var(--jsie-text)}

/* Layer list */
.jsie-layers-list{flex:1;overflow-y:auto;padding:2px 0}
.jsie-layer-item{display:flex;align-items:center;gap:6px;padding:4px 6px;cursor:pointer;border:2px solid transparent;min-height:40px;transition:background .1s}
.jsie-layer-item:hover{background:var(--jsie-hover)}
.jsie-layer-item.active{background:var(--jsie-layer-active);border-color:var(--jsie-accent)}
.jsie-layer-item.drag-over{border-top:2px solid var(--jsie-accent)}
.jsie-layer-vis{width:18px;height:18px;cursor:pointer;opacity:.7;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.jsie-layer-vis:hover{opacity:1}
.jsie-layer-vis.hidden{opacity:.3}
.jsie-layer-vis svg{width:16px;height:16px;fill:currentColor}
.jsie-layer-thumb{width:40px;height:30px;border:1px solid var(--jsie-border);border-radius:2px;background:repeating-conic-gradient(#808080 0% 25%,#a0a0a0 0% 50%) 50%/8px 8px;flex-shrink:0;overflow:hidden}
.jsie-layer-thumb img{width:100%;height:100%;object-fit:contain}
.jsie-layer-name{flex:1;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jsie-layer-name-input{flex:1;font-size:11px;background:var(--jsie-input-bg);border:1px solid var(--jsie-accent);color:var(--jsie-text);border-radius:2px;padding:1px 4px;outline:none}

/* Layer actions */
.jsie-layers-actions{display:flex;justify-content:center;gap:2px;padding:4px;border-top:1px solid var(--jsie-border)}
.jsie-layers-actions .jsie-btn{width:28px;height:28px}
.jsie-layers-actions .jsie-btn svg{width:16px;height:16px}

/* Filters bar */
.jsie-filters{display:flex;gap:12px;padding:6px 12px;background:var(--jsie-bg2);border-top:1px solid var(--jsie-border);flex-wrap:wrap;align-items:center}
.jsie-filter-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--jsie-text2)}
.jsie-filter-item input[type="range"]{width:80px;height:4px;-webkit-appearance:none;appearance:none;background:var(--jsie-slider-track);border-radius:2px;outline:none;cursor:pointer}
.jsie-filter-item input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--jsie-slider-thumb);cursor:pointer;border:2px solid var(--jsie-bg)}
.jsie-filter-item input[type="range"]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--jsie-slider-thumb);cursor:pointer;border:2px solid var(--jsie-bg)}
.jsie-filter-item .jsie-filter-val{width:30px;text-align:right;font-variant-numeric:tabular-nums}

/* Status bar */
.jsie-status-bar{display:flex;align-items:center;gap:16px;padding:2px 10px;background:var(--jsie-bg2);border-top:1px solid var(--jsie-border);font-size:10px;color:var(--jsie-text2);min-height:20px}

/* Empty state */
.jsie-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--jsie-text2);cursor:pointer;border:2px dashed var(--jsie-border);border-radius:8px;padding:40px;margin:20px;text-align:center}
.jsie-empty svg{width:48px;height:48px;fill:var(--jsie-text2);opacity:.5}
.jsie-empty:hover{border-color:var(--jsie-accent);color:var(--jsie-accent)}
.jsie-empty:hover svg{fill:var(--jsie-accent);opacity:.7}

/* Crop overlay */
.jsie-crop-overlay{position:absolute;top:0;left:0;width:100%;height:100%;z-index:10}
.jsie-crop-overlay .jsie-crop-rect{position:absolute;border:2px solid #fff;box-shadow:0 0 0 9999px rgba(0,0,0,0.5);cursor:move}
.jsie-crop-overlay .jsie-crop-handle{position:absolute;width:10px;height:10px;background:#fff;border:1px solid #333}
.jsie-crop-overlay .jsie-crop-handle.tl{top:-5px;left:-5px;cursor:nw-resize}
.jsie-crop-overlay .jsie-crop-handle.tr{top:-5px;right:-5px;cursor:ne-resize}
.jsie-crop-overlay .jsie-crop-handle.bl{bottom:-5px;left:-5px;cursor:sw-resize}
.jsie-crop-overlay .jsie-crop-handle.br{bottom:-5px;right:-5px;cursor:se-resize}

/* Resize panel */
.jsie-resize-panel{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--jsie-bg2);border:1px solid var(--jsie-border);border-radius:8px;padding:16px;z-index:10;display:flex;flex-direction:column;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.4)}
.jsie-resize-panel label{font-size:12px;color:var(--jsie-text)}
.jsie-resize-panel input[type="number"]{width:80px;height:28px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 6px;font-size:12px}
.jsie-resize-panel .jsie-row{display:flex;gap:8px;align-items:center}
.jsie-resize-panel .jsie-checkbox-row{display:flex;align-items:center;gap:6px}
.jsie-resize-panel .jsie-checkbox-row input[type="checkbox"]{width:auto;height:auto}

/* Text input overlay */
.jsie-text-input-overlay{position:absolute;z-index:10}
.jsie-text-input-overlay textarea{background:transparent;border:1px dashed var(--jsie-accent);color:var(--jsie-text);font-family:inherit;padding:2px 4px;resize:both;min-width:60px;min-height:24px;outline:none}

/* Modal */
.jsie-modal-overlay{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.jsie-modal-content{width:90vw;height:90vh;border-radius:8px;overflow:hidden}
`;
  }

  // ── Template ──────────────────────────────────────
  function getImageEditorTemplate(config) {
    const tools = config.tools || {};
    const drawingTools = tools.drawing || ['move', 'pencil', 'eraser', 'eyedropper', 'fill', 'gradient', 'rect', 'circle', 'line', 'arrow', 'text'];
    const transformTools = tools.transform || ['crop', 'resize', 'rotateLeft', 'rotateRight', 'flipH', 'flipV'];
    const panels = config.panels || {};
    const showLayers = panels.layers !== false;
    const showFilters = panels.filters !== false;
    const showStatusBar = panels.statusBar !== false;
    const filterList = config.filters || ['brightness', 'contrast', 'saturation', 'blur', 'grayscale', 'sepia', 'hue'];

    const filterDefaults = {
      brightness: { min: 0, max: 200, value: 100 },
      contrast: { min: 0, max: 200, value: 100 },
      saturation: { min: 0, max: 200, value: 100 },
      blur: { min: 0, max: 20, value: 0 },
      grayscale: { min: 0, max: 100, value: 0 },
      sepia: { min: 0, max: 100, value: 0 },
      hue: { min: 0, max: 360, value: 0 },
    };

    // Drawing tool buttons (supports tool groups)
    const drawBtns = drawingTools.map(tool => {
      if (typeof tool === 'object' && tool.group) {
        const defaultTool = tool.tools[0];
        return `<div class="jsie-tool-group" data-group="${tool.group}">
          <button class="jsie-tool-btn" data-tool="${defaultTool}" data-group="${tool.group}" title="${t('tool.' + defaultTool)}">
            ${Icons[defaultTool] || ''}
            <span class="jsie-group-arrow"></span>
          </button>
        </div>`;
      }
      return `<button class="jsie-tool-btn" data-tool="${tool}" title="${t('tool.' + tool)}">${Icons[tool] || ''}</button>`;
    }).join('');

    // Transform tool buttons (some are actions, some are tools, some are groups)
    const actionTools = ['resize', 'rotateLeft', 'rotateRight', 'flipH', 'flipV'];
    const transBtns = transformTools.map(tool => {
      if (typeof tool === 'object' && tool.group) {
        const first = tool.tools[0];
        return `<div class="jsie-tool-group jsie-action-group" data-group="${tool.group}">
          <button class="jsie-tool-btn" data-action="${first}" data-group="${tool.group}" title="${t('tool.' + first)}">
            ${Icons[first] || ''}
            <span class="jsie-group-arrow"></span>
          </button>
        </div>`;
      }
      const attr = actionTools.includes(tool) ? `data-action="${tool}"` : `data-tool="${tool}"`;
      return `<button class="jsie-tool-btn" ${attr} title="${t('tool.' + tool)}">${Icons[tool] || ''}</button>`;
    }).join('');

    return `
<div class="jsie-menubar">
  <div class="jsie-menu-item" data-menu="file">${t('menu.file')}</div>
  <div class="jsie-menu-item" data-menu="edit">${t('menu.edit')}</div>
  <div class="jsie-menu-item" data-menu="image">${t('menu.image')}</div>
  <div class="jsie-menu-item" data-menu="layer">${t('menu.layer')}</div>
  <div class="jsie-menu-item" data-menu="select">${t('menu.select')}</div>
  <div class="jsie-menu-item" data-menu="view">${t('menu.view')}</div>
  <div class="jsie-menu-item" data-menu="help">${t('menu.help')}</div>
</div>
<div class="jsie-options-bar">
  <div class="jsie-options-left">
    <button class="jsie-btn" data-action="undo" title="${t('tool.undo')}">${Icons.undo}</button>
    <button class="jsie-btn" data-action="redo" title="${t('tool.redo')}">${Icons.redo}</button>
    <div class="jsie-sep"></div>
    <div class="jsie-tool-options" id="jsie-tool-options"></div>
  </div>
  <div class="jsie-options-right">
    <button class="jsie-btn-text secondary" data-action="import">${Icons.importImg} ${t('btn.import')}</button>
    <button class="jsie-btn-text secondary" data-action="export">${Icons.download} ${t('btn.export')}</button>
    <div class="jsie-sep"></div>
    <button class="jsie-btn-text secondary" data-action="reset">${Icons.reset} ${t('btn.reset')}</button>
    <button class="jsie-btn-text secondary" data-action="cancel">${Icons.cancel} ${t('btn.cancel')}</button>
    <button class="jsie-btn-text" data-action="save">${Icons.save} ${t('btn.save')}</button>
  </div>
</div>

<div class="jsie-main-body">
  <div class="jsie-toolbox">
    ${drawBtns}
    <div class="jsie-tool-sep"></div>
    ${transBtns}
    <div class="jsie-tool-sep"></div>
    <button class="jsie-tool-btn" data-action="zoomIn" title="${t('tool.zoomIn')}">${Icons.zoomIn}</button>
    <button class="jsie-tool-btn" data-action="zoomOut" title="${t('tool.zoomOut')}">${Icons.zoomOut}</button>
    <button class="jsie-tool-btn" data-action="zoomFit" title="${t('tool.zoomFit')}">${Icons.zoomFit}</button>
  </div>

  <div class="jsie-canvas-area" id="jsie-canvas-area">
    <div class="jsie-canvas-wrap" id="jsie-canvas-wrap" style="display:none">
      <canvas id="jsie-main-canvas"></canvas>
    </div>
    <div class="jsie-empty" id="jsie-empty">
      ${Icons.upload}
      <span>${t('empty.loadImage')}</span>
      <input type="file" accept="image/*,.shoimg" id="jsie-file-input" style="display:none">
    </div>
  </div>

  ${showLayers || showFilters ? `
  <div class="jsie-layers-panel" id="jsie-layers-panel">
    ${showLayers && showFilters ? `<div class="jsie-rpanel-tabs">
      <button type="button" class="jsie-rpanel-tab active" data-rpanel="layers">${t('panel.layers')}</button>
      <button type="button" class="jsie-rpanel-tab" data-rpanel="image">${t('panel.image')}</button>
    </div>` : ''}
    ${showLayers ? `<div class="jsie-rpanel-content${!showFilters || (showLayers && showFilters) ? ' active' : ''}" data-rpanel-content="layers">
    <div class="jsie-layers-controls">
      <label>${t('opt.blendMode')}</label>
      <select id="jsie-layer-blend" class="jsie-blend-select">
        <option value="normal">Normal</option>
        <option value="multiply">Multiply</option>
        <option value="screen">Screen</option>
        <option value="overlay">Overlay</option>
        <option value="darken">Darken</option>
        <option value="lighten">Lighten</option>
        <option value="color-dodge">Color Dodge</option>
        <option value="color-burn">Color Burn</option>
        <option value="hard-light">Hard Light</option>
        <option value="soft-light">Soft Light</option>
        <option value="difference">Difference</option>
        <option value="exclusion">Exclusion</option>
      </select>
    </div>
    <div class="jsie-layers-controls">
      <label>${t('opt.opacity')}</label>
      <input type="range" id="jsie-layer-opacity" min="0" max="100" value="100">
      <span id="jsie-layer-opacity-val" class="jsie-layer-opacity-val">100%</span>
    </div>
    <div class="jsie-layers-list" id="jsie-layers-list"></div>
    <div class="jsie-layers-actions">
      <button class="jsie-btn" data-layer-action="add" title="${t('layer.add')}">${Icons.layerAdd}</button>
      <button class="jsie-btn" data-layer-action="group" title="${t('layer.group')}">${Icons.folder}</button>
      <button class="jsie-btn" data-layer-action="delete" title="${t('layer.delete')}">${Icons.layerDelete}</button>
      <button class="jsie-btn" data-layer-action="duplicate" title="${t('layer.duplicate')}">${Icons.layerDup}</button>
      <button class="jsie-btn" data-action="layerStyles" title="${t('layer.styles')}">${Icons.layerStyles}</button>
    </div>
    </div>` : ''}
    ${showFilters ? `<div class="jsie-rpanel-content${!showLayers ? ' active' : ''}" data-rpanel-content="image">
      <div class="jsie-filters-vertical">${filterList.map(f => {
        const d = filterDefaults[f] || { min: 0, max: 100, value: 0 };
        return `<div class="jsie-filter-item"><span>${t('filter.' + f)}</span><div class="jsie-filter-row"><input type="range" data-filter="${f}" min="${d.min}" max="${d.max}" value="${d.value}"><span class="jsie-filter-val">${d.value}</span></div></div>`;
      }).join('')}</div>
    </div>` : ''}
  </div>` : ''}
</div>
${showStatusBar ? `<div class="jsie-status-bar"><span id="jsie-status-dims"></span><span id="jsie-status-cursor"></span><span id="jsie-status-tool"></span><span id="jsie-status-zoom" style="margin-left:auto"></span></div>` : ''}`;
  }

  // ── ImageEditor Class ─────────────────────────────
  class ImageEditor {
    constructor(containerOrConfig, config = {}) {
      if (typeof containerOrConfig === 'string' || containerOrConfig instanceof Element) {
        this.container = typeof containerOrConfig === 'string' ? $(containerOrConfig) : containerOrConfig;
        this.config = { ...this.getDefaultConfig(), ...config };
      } else {
        this.container = document.body;
        this.config = { ...this.getDefaultConfig(), ...containerOrConfig };
      }

      currentLang = this.config.lang || 'en';
      this.layerManager = null;
      this.currentTool = null;
      this.drawing = false;
      this.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hue: 0 };
      this.drawColor = '#ff0000';
      this.fillColor = '#ff0000';
      this.fillEnabled = false;
      this.strokeSize = 3;
      this.fontSize = 24;
      this.fontFamily = 'Arial';
      this.fontWeight = 'normal';
      this.fontStyle = 'normal';
      this.letterSpacing = 0;
      this.lineHeight = 1.2;
      this.textAlign = 'left';
      this.textDecoration = 'none';
      this.history = [];
      this.historyIndex = -1;
      this.shapeStart = null;
      this._shapeSnapshot = null;
      this._thumbTimer = null;
      this.fillTolerance = 30;
      this.gradientColor1 = '#ff0000';
      this.gradientColor2 = '#0000ff';
      this._moveSnapshot = null;
      this._moveStart = null;
      // Selection state
      this.selection = null;
      this._selectionPath = null;
      this._selectionPoints = [];
      this._selectionAnimFrame = null;
      this._selectionAntsOffset = 0;
      this._selectionStart = null;
      this._selectionPreview = null;
      this._clipboard = null;
      this._toolGroupSelection = {};
      this.wandTolerance = 30;
      this.zoomLevel = 1.0;
      this._fitScale = 1.0;
      this._init();
    }

    getDefaultConfig() {
      // Use cached external config if loaded, with fallback inline defaults
      const base = ImageEditor._externalConfig || {
        theme: 'dark',
        width: '100%',
        height: '100%',
        maxHistory: 20,
        outputFormat: 'png',
        outputQuality: 0.92,
        lang: 'en',
        tools: {
          drawing: ['move', 'pan', { group: 'select', tools: ['selectRect', 'selectEllipse', 'selectPoly', 'selectFree', 'selectWand'] }, 'pencil', 'eraser', 'eyedropper', 'fill', 'gradient', { group: 'shapes', tools: ['rect', 'circle', 'line', 'arrow'] }, 'text'],
          transform: ['crop', 'resize', { group: 'orient', tools: ['rotateLeft', 'rotateRight', 'flipH', 'flipV'] }],
        },
        panels: { layers: true, filters: true, statusBar: true },
        filters: ['brightness', 'contrast', 'saturation', 'blur', 'grayscale', 'sepia', 'hue'],
        preset: null,
      };
      // Callbacks can't come from JSON, always set to null as defaults
      return { ...base, onSave: null, onCancel: null };
    }

    // Load config from external JSON file
    static async loadConfig(url) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          ImageEditor._externalConfig = await res.json();
        }
      } catch (e) {
        console.warn('JSImageEditor: Could not load config from', url, '- using defaults');
      }
    }

    _init() {
      this.injectCSS();
      this.render();
      this.cacheElements();
      this.bindEvents();

      // Initialize from preset if provided
      if (this.config.preset) {
        this._initFromPreset(this.config.preset);
      }
    }

    injectCSS() {
      if (!$('#jsie-styles')) {
        const style = document.createElement('style');
        style.id = 'jsie-styles';
        style.textContent = getImageEditorCSS();
        document.head.appendChild(style);
      }
    }

    render() {
      this.root = document.createElement('div');
      this.root.className = `jsie-editor theme-${this.config.theme}`;
      this.root.style.width = this.config.width;
      this.root.style.height = this.config.height;
      this.root.innerHTML = getImageEditorTemplate(this.config);
      this.container.appendChild(this.root);
    }

    cacheElements() {
      this.mainCanvas = $('#jsie-main-canvas', this.root);
      this.mainCtx = this.mainCanvas.getContext('2d');
      this.canvasWrap = $('#jsie-canvas-wrap', this.root);
      this.canvasArea = $('#jsie-canvas-area', this.root);
      this.emptyState = $('#jsie-empty', this.root);
      this.fileInput = $('#jsie-file-input', this.root);
      this.toolOptions = $('#jsie-tool-options', this.root);
      this.layersList = $('#jsie-layers-list', this.root);
      this.layerOpacitySlider = $('#jsie-layer-opacity', this.root);
      this.layerOpacityVal = $('#jsie-layer-opacity-val', this.root);
      this.layerBlendSelect = $('#jsie-layer-blend', this.root);
      this.statusDims = $('#jsie-status-dims', this.root);
      this.statusCursor = $('#jsie-status-cursor', this.root);
      this.statusTool = $('#jsie-status-tool', this.root);
      this.statusZoom = $('#jsie-status-zoom', this.root);

      // Interaction canvas for mouse events (transparent overlay)
      this.interactionCanvas = document.createElement('canvas');
      this.interactionCanvas.className = 'jsie-interaction-canvas';
      this.interactionCanvas.style.cursor = 'default';
    }

    bindEvents() {
      const r = this.root;

      // ── Menu bar events ──
      on(r, 'click', '.jsie-menu-item', (e, item) => {
        const menuId = item.dataset.menu;
        if (this._menuOpen === menuId) {
          this._closeMenus();
        } else {
          this._openMenu(menuId, item);
        }
        e.stopPropagation();
      });

      on(r, 'mouseenter', '.jsie-menu-item', (e, item) => {
        if (this._menuOpen && this._menuOpen !== item.dataset.menu) {
          this._openMenu(item.dataset.menu, item);
        }
      });

      on(r, 'click', '.jsie-menu-entry[data-maction]', (e, entry) => {
        e.stopPropagation();
        this._handleMenuAction(entry.dataset.maction, entry.dataset.mparam);
      });

      on(r, 'click', '.jsie-menu-entry[data-mtool]', (e, entry) => {
        e.stopPropagation();
        const tool = entry.dataset.mtool;
        this.setTool(tool);
        this._closeMenus();
      });

      // Submenu hover
      on(r, 'mouseenter', '.jsie-menu-has-sub', (e, entry) => {
        // Remove any existing submenus
        $$('.jsie-menu-submenu', r).forEach(s => s.remove());
        const submenuId = entry.dataset.submenu;
        const html = this._buildMenuDropdown(submenuId);
        if (!html) return;
        const sub = document.createElement('div');
        sub.className = 'jsie-menu-submenu';
        sub.innerHTML = html;
        entry.appendChild(sub);
        // Adjust if off-screen
        const rect = sub.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          sub.style.left = 'auto';
          sub.style.right = '100%';
        }
        if (rect.bottom > window.innerHeight) {
          sub.style.top = 'auto';
          sub.style.bottom = '0';
        }
      });

      // Close menus on click outside
      this._closeMenuOnOutside = (e) => {
        if (this._menuOpen && !e.target.closest('.jsie-menubar')) {
          this._closeMenus();
        }
      };
      document.addEventListener('mousedown', this._closeMenuOnOutside);

      // Close menus on Escape (handled via existing key handler, but also here)
      on(r, 'keydown', (e) => {
        if (e.key === 'Escape' && this._menuOpen) {
          this._closeMenus();
        }
      });

      // Actions (undo, redo, transforms, save, cancel, reset)
      on(r, 'click', '[data-action]', (e, btn) => {
        if (e.target.closest('.jsie-group-arrow')) return;
        if (btn._longPressed) { btn._longPressed = false; return; }
        const action = btn.dataset.action;
        if (action === 'undo') this.undo();
        else if (action === 'redo') this.redo();
        else if (action === 'rotateLeft') this.rotate(-90);
        else if (action === 'rotateRight') this.rotate(90);
        else if (action === 'flipH') this.flip('horizontal');
        else if (action === 'flipV') this.flip('vertical');
        else if (action === 'resize') this.showResizePanel();
        else if (action === 'zoomIn') this._zoom(1.25);
        else if (action === 'zoomOut') this._zoom(0.8);
        else if (action === 'zoomFit') this._zoomFit();
        else if (action === 'import') this._triggerImport();
        else if (action === 'export') this._showExportDialog();
        else if (action === 'layerStyles') this._showLayerStylesDialog();
        else if (action === 'reset') this.reset();
        else if (action === 'cancel') this._onCancel();
        else if (action === 'save') this._onSave();
      });

      // Tool selection (ignore clicks on group arrow or after long-press)
      on(r, 'click', '.jsie-tool-btn[data-tool]', (e, btn) => {
        if (e.target.closest('.jsie-group-arrow')) return;
        if (btn._longPressed) { btn._longPressed = false; return; }
        const tool = btn.dataset.tool;
        this.setTool(tool === this.currentTool ? null : tool);
      });

      // Tool group submenu arrow
      on(r, 'click', '.jsie-group-arrow', (e, arrow) => {
        e.stopPropagation();
        const groupDiv = arrow.closest('.jsie-tool-group');
        if (!groupDiv) return;
        this._toggleGroupSubmenu(groupDiv.dataset.group, groupDiv);
      });

      // Long-press on tool group button opens submenu (>1s)
      on(r, 'mousedown', '.jsie-tool-group > .jsie-tool-btn', (e, btn) => {
        if (e.target.closest('.jsie-group-arrow')) return;
        const groupDiv = btn.closest('.jsie-tool-group');
        if (!groupDiv) return;
        btn._longPressTimer = setTimeout(() => {
          btn._longPressed = true;
          this._toggleGroupSubmenu(groupDiv.dataset.group, groupDiv);
        }, 1000);
      });
      on(r, 'mouseup', '.jsie-tool-group > .jsie-tool-btn', (e, btn) => {
        clearTimeout(btn._longPressTimer);
      });
      on(r, 'mouseleave', '.jsie-tool-group > .jsie-tool-btn', (e, btn) => {
        clearTimeout(btn._longPressTimer);
      });

      // Close submenu on click outside
      this._closeGroupSubmenu = (e) => {
        if (!e.target.closest('.jsie-group-submenu') && !e.target.closest('.jsie-group-arrow')) {
          $$('.jsie-group-submenu', this.root).forEach(m => m.remove());
        }
      };
      document.addEventListener('click', this._closeGroupSubmenu);

      // Right panel tabs
      on(r, 'click', '.jsie-rpanel-tab', (e, tab) => {
        const panel = tab.dataset.rpanel;
        $$('.jsie-rpanel-tab', r).forEach(t => t.classList.toggle('active', t === tab));
        $$('.jsie-rpanel-content', r).forEach(c => c.classList.toggle('active', c.dataset.rpanelContent === panel));
      });

      // Filter sliders
      on(r, 'input', 'input[data-filter]', (e, inp) => {
        const filter = inp.dataset.filter;
        this.filters[filter] = parseFloat(inp.value);
        inp.nextElementSibling.textContent = inp.value;
        this._applyFilters();
      });

      // Empty state / file input
      on(this.emptyState, 'click', () => this.fileInput.click());
      on(this.fileInput, 'change', () => {
        const file = this.fileInput.files[0];
        if (file && file.name.endsWith('.shoimg')) {
          this.openProject(file);
        } else if (file) {
          this.loadImage(file);
        }
      });

      // Drag and drop image
      on(this.canvasArea, 'dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
      on(this.canvasArea, 'drop', e => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.name.endsWith('.shoimg')) {
          this.openProject(file);
        } else if (file && file.type.startsWith('image/')) {
          if (this.layerManager) {
            this.importAsLayer(file);
          } else {
            this.loadImage(file);
          }
        }
      });

      // Layer panel events
      this._bindLayerEvents();

      // Canvas drawing events
      this._bindCanvasEvents();

      // Keyboard shortcuts
      this._keyHandler = (e) => {
        if (!this.layerManager) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        const ctrl = e.ctrlKey || e.metaKey;

        if (ctrl && e.key === 'z' && !e.shiftKey) {
          e.preventDefault(); this.undo();
        } else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
          e.preventDefault(); this.redo();
        } else if (ctrl && e.key === 'a') {
          e.preventDefault(); this._selectAll();
        } else if (ctrl && e.key === 'd') {
          e.preventDefault(); this._clearSelection();
        } else if (ctrl && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
          e.preventDefault(); this._invertSelection();
        } else if (ctrl && e.key === 'c') {
          if (this.selection) { e.preventDefault(); this._copySelection(); }
        } else if (ctrl && e.key === 'x') {
          if (this.selection) { e.preventDefault(); this._cutSelection(); }
        } else if (ctrl && e.key === 'v') {
          if (this._clipboard) { e.preventDefault(); this._pasteSelection(); }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (this.selection) { e.preventDefault(); this._deleteSelection(); }
        } else if (e.key === 'Escape') {
          if (this.selection) { this._clearSelection(); }
          else if (this._selectionPoints.length > 0) { this._selectionPoints = []; this._stopMarchingAnts(); }
        }
      };
      document.addEventListener('keydown', this._keyHandler);
    }

    // ── Layer Panel Events ─────────────────────────
    _bindLayerEvents() {
      if (!this.layersList) return;

      // Click layer item -> set active
      on(this.layersList, 'click', '.jsie-layer-item', (e, item) => {
        // Don't activate if clicking visibility toggle or group toggle
        if (e.target.closest('.jsie-layer-vis') || e.target.closest('.jsie-layer-group-toggle')) return;
        const id = parseInt(item.dataset.layerId);
        this.layerManager.setActive(id);
        this._renderLayersList();
        this._updateLayerOpacityUI();
        this._redraw();
        // If text layer selected, switch to text tool and load properties
        const layer = this._findLayerById(id);
        if (layer && layer.type === 'text' && layer.textData) {
          this.setTool('text');
          this._loadTextLayerProps(layer);
        }
      });

      // Right-click context menu on layers
      this.layersList.addEventListener('contextmenu', e => {
        e.preventDefault();
        const item = e.target.closest('.jsie-layer-item');
        if (!item) return;
        const id = parseInt(item.dataset.layerId);
        const layer = this._findLayerById(id);
        if (!layer) return;
        // Remove any existing context menu
        const old = $('.jsie-layer-ctx', this.root);
        if (old) old.remove();
        // Activate this layer
        this.layerManager.setActive(id);
        this._renderLayersList();
        this._updateLayerOpacityUI();
        // Build menu
        const menu = document.createElement('div');
        menu.className = 'jsie-layer-ctx';
        menu.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;z-index:10002;background:var(--jsie-bg);border:1px solid var(--jsie-border);border-radius:4px;padding:4px 0;min-width:150px;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:12px`;
        const notGroup = layer.type !== 'group';
        const items = [
          { label: t('layer.styles'), action: 'styles', disabled: !notGroup },
          { label: t('layer.resize'), action: 'resizeLayer', disabled: !notGroup },
          { label: t('layer.duplicate'), action: 'duplicate' },
          { label: t('layer.delete'), action: 'delete' },
        ];
        items.forEach(mi => {
          const btn = document.createElement('div');
          btn.textContent = mi.label;
          btn.style.cssText = `padding:6px 14px;cursor:pointer;color:var(--jsie-text)${mi.disabled ? ';opacity:0.4;pointer-events:none' : ''}`;
          btn.addEventListener('mouseenter', () => { if (!mi.disabled) btn.style.background = 'var(--jsie-hover)'; });
          btn.addEventListener('mouseleave', () => btn.style.background = '');
          btn.addEventListener('click', () => {
            menu.remove();
            if (mi.action === 'styles') this._showLayerStylesDialog();
            else if (mi.action === 'resizeLayer') this._showResizeLayerDialog(layer);
            else if (mi.action === 'duplicate') { this.layerManager.duplicateLayer(id); this.pushHistory(); this._redraw(); this._renderLayersList(); }
            else if (mi.action === 'delete') { this.layerManager.removeLayer(id); this.pushHistory(); this._redraw(); this._renderLayersList(); this._updateLayerOpacityUI(); }
          });
          menu.appendChild(btn);
        });
        this.root.appendChild(menu);
        // Close on click outside
        const closeCtx = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('mousedown', closeCtx, true); } };
        setTimeout(() => document.addEventListener('mousedown', closeCtx, true), 0);
      });

      // Toggle visibility
      on(this.layersList, 'click', '.jsie-layer-vis', (e, vis) => {
        e.stopPropagation();
        const id = parseInt(vis.dataset.layerVis);
        const layer = this._findLayerById(id);
        if (layer) {
          layer.visible = !layer.visible;
          this._redraw();
          this._renderLayersList();
        }
      });

      // Toggle group expand/collapse
      on(this.layersList, 'click', '.jsie-layer-group-toggle', (e, toggle) => {
        e.stopPropagation();
        const id = parseInt(toggle.dataset.groupToggle);
        const group = this.layerManager.layers.find(l => l.id === id);
        if (group && group.type === 'group') {
          group.collapsed = !group.collapsed;
          this._renderLayersList();
        }
      });

      // Double-click on text layer to re-edit
      on(this.layersList, 'dblclick', '.jsie-layer-text-icon', (e, icon) => {
        const item = icon.closest('.jsie-layer-item');
        const id = parseInt(item.dataset.layerId);
        // Find layer (could be in groups too)
        const layer = this._findLayerById(id);
        if (layer && layer.type === 'text') {
          this.layerManager.setActive(id);
          this._editTextLayer(layer);
        }
      });

      // Double-click layer name to rename
      on(this.layersList, 'dblclick', '.jsie-layer-name', (e, nameEl) => {
        const item = nameEl.closest('.jsie-layer-item');
        const id = parseInt(item.dataset.layerId);
        const layer = this._findLayerById(id);
        if (!layer) return;

        const input = document.createElement('input');
        input.className = 'jsie-layer-name-input';
        input.value = layer.name;
        nameEl.replaceWith(input);
        input.focus();
        input.select();

        const finish = () => {
          layer.name = input.value || layer.name;
          this._renderLayersList();
        };
        input.addEventListener('blur', finish);
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') finish();
          if (e.key === 'Escape') this._renderLayersList();
        });
      });

      // Blend mode select
      if (this.layerBlendSelect) {
        on(this.layerBlendSelect, 'change', () => {
          if (this.layerManager && this.layerManager.activeLayer) {
            this.layerManager.activeLayer.blendMode = this.layerBlendSelect.value;
            this._redraw();
          }
        });
      }

      // Opacity slider
      if (this.layerOpacitySlider) {
        on(this.layerOpacitySlider, 'input', () => {
          const val = parseInt(this.layerOpacitySlider.value);
          if (this.layerManager && this.layerManager.activeLayer) {
            this.layerManager.setOpacity(this.layerManager.activeLayerId, val / 100);
            this.layerOpacityVal.textContent = val + '%';
            this._redraw();
            this._scheduleThumbnailUpdate();
          }
        });
      }

      // Layer action buttons
      on(this.root, 'click', '[data-layer-action]', (e, btn) => {
        if (!this.layerManager) return;
        const action = btn.dataset.layerAction;
        if (action === 'add') {
          this.layerManager.addLayer();
          this.pushHistory();
          this._redraw();
          this._renderLayersList();
        } else if (action === 'group') {
          this.layerManager.addGroup();
          this.pushHistory();
          this._redraw();
          this._renderLayersList();
        } else if (action === 'delete') {
          this.layerManager.deleteLayer(this.layerManager.activeLayerId);
          this.pushHistory();
          this._redraw();
          this._renderLayersList();
        } else if (action === 'duplicate') {
          this.layerManager.duplicateLayer(this.layerManager.activeLayerId);
          this.pushHistory();
          this._redraw();
          this._renderLayersList();
        }
      });

      // Drag and drop reorder
      this._bindLayerDragEvents();
    }

    _bindLayerDragEvents() {
      if (!this.layersList) return;
      let dragId = null;

      this.layersList.addEventListener('dragstart', e => {
        const item = e.target.closest('.jsie-layer-item');
        if (!item) return;
        dragId = parseInt(item.dataset.layerId);
        e.dataTransfer.effectAllowed = 'move';
        requestAnimationFrame(() => item.style.opacity = '0.4');
      });

      this.layersList.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const item = e.target.closest('.jsie-layer-item');
        this.layersList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        if (item) item.classList.add('drag-over');
      });

      this.layersList.addEventListener('drop', e => {
        e.preventDefault();
        this.layersList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        const item = e.target.closest('.jsie-layer-item');
        if (!item || dragId === null) return;

        const dropId = parseInt(item.dataset.layerId);
        const dropLayer = this._findLayerById(dropId);
        const layers = this.layerManager.layers;

        // If dropping onto a group, move into it
        if (dropLayer && dropLayer.type === 'group' && dragId !== dropId) {
          this.layerManager.moveToGroup(dragId, dropId);
          this.pushHistory();
          this._redraw();
          this._renderLayersList();
        } else {
          const fromIdx = layers.findIndex(l => l.id === dragId);
          const dropIdx = layers.findIndex(l => l.id === dropId);

          if (fromIdx !== -1 && dropIdx !== -1 && fromIdx !== dropIdx) {
            this.layerManager.moveLayer(fromIdx, dropIdx);
            this.pushHistory();
            this._redraw();
            this._renderLayersList();
          }
        }
        dragId = null;
      });

      this.layersList.addEventListener('dragend', () => {
        this.layersList.querySelectorAll('.jsie-layer-item').forEach(el => el.style.opacity = '');
        dragId = null;
      });
    }

    // ── Canvas Events ─────────────────────────────
    _bindCanvasEvents() {
      const ic = this.interactionCanvas;

      ic.addEventListener('mousedown', e => {
        if (!this.layerManager) return;

        // Visual resize handles — always check first, regardless of active tool
        {
          const hpos = this._canvasPos(e);
          if (this.layerManager.activeLayer) {
            const fb = this._getLayerContentBounds(this.layerManager.activeLayer);
            if (fb) this._lastLayerBounds = fb;
          }
          const handleHit = this._hitTestHandle(hpos);
          if (handleHit) {
            this._startVisualResize(handleHit, hpos, e);
            return;
          }
        }

        if (!this.currentTool) return;

        // Pan tool — scrolls the canvas area, no layer needed
        if (this.currentTool === 'pan') {
          e.preventDefault();
          const area = this.canvasArea;
          const startX = e.clientX, startY = e.clientY;
          const scrollL = area.scrollLeft, scrollT = area.scrollTop;
          ic.style.cursor = 'grabbing';
          const onMove = ev => {
            area.scrollLeft = scrollL - (ev.clientX - startX);
            area.scrollTop = scrollT - (ev.clientY - startY);
          };
          const onUp = () => {
            ic.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          };
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
          return;
        }

        const active = this.layerManager.activeLayer;
        if (!active) return;

        this.drawing = true;
        const pos = this._canvasPos(e);
        const ctx = active.ctx;

        if (this.currentTool === 'selectRect' || this.currentTool === 'selectEllipse') {
          this.drawing = true;
          this._selectionStart = pos;
          this._selectionPreview = null;
          return;
        } else if (this.currentTool === 'selectPoly') {
          this.drawing = false;
          if (this._selectionPoints.length > 2) {
            const first = this._selectionPoints[0];
            const dist = Math.hypot(pos.x - first.x, pos.y - first.y);
            if (dist < 8) {
              this._finalizePolySelection();
              return;
            }
          }
          this._selectionPoints.push({ x: pos.x, y: pos.y });
          this._drawPolyPreview(pos);
          return;
        } else if (this.currentTool === 'selectFree') {
          this.drawing = true;
          this._selectionPoints = [{ x: pos.x, y: pos.y }];
          return;
        } else if (this.currentTool === 'selectWand') {
          this.drawing = false;
          this._magicWandSelect(pos.x, pos.y);
          return;
        } else if (this.currentTool === 'move') {
          this._moveStart = pos;
          this._moveSnapshot = ctx.getImageData(0, 0, active.width, active.height);
        } else if (this.currentTool === 'eyedropper') {
          this.drawing = false;
          this._pickColor(pos);
        } else if (this.currentTool === 'fill') {
          this.drawing = false;
          this._floodFill(active, Math.round(pos.x), Math.round(pos.y), this.drawColor, this.fillTolerance);
          this.pushHistory();
          this._redraw();
          this._scheduleThumbnailUpdate();
        } else if (this.currentTool === 'gradient') {
          this.shapeStart = pos;
          this._shapeSnapshot = ctx.getImageData(0, 0, active.width, active.height);
        } else if (this.currentTool === 'pencil' || this.currentTool === 'eraser') {
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
          ctx.strokeStyle = this.drawColor;
          ctx.lineWidth = this.strokeSize;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        } else if (this.currentTool === 'text') {
          this.drawing = false;
          const hitText = this._findTextLayerAt(pos);
          if (hitText) {
            // Single click: select text layer and load its properties
            this.layerManager.setActive(hitText.id);
            this._loadTextLayerProps(hitText);
            this._renderLayersList();
            this._redraw();
          } else {
            this._placeText(pos);
          }
        } else if (this.currentTool === 'crop') {
          this.drawing = false;
        } else {
          // Shape tools
          this.shapeStart = pos;
          this._shapeSnapshot = ctx.getImageData(0, 0, active.width, active.height);
        }
      });

      ic.addEventListener('mousemove', e => {
        const pos = this._canvasPos(e);
        this._updateStatusCursor(pos);

        // Resize handles: show appropriate cursor on hover
        const hoverHandle = this._hitTestHandle(pos);
        if (hoverHandle && !this.drawing) {
          const cursors = { tl: 'nw-resize', tc: 'n-resize', tr: 'ne-resize', ml: 'w-resize', mc: 'move', mr: 'e-resize', bl: 'sw-resize', bc: 's-resize', br: 'se-resize' };
          ic.style.cursor = cursors[hoverHandle] || 'default';
        } else if (!this.drawing) {
          ic.style.cursor = '';
        }

        // Polygon tool: rubber-band preview even when not dragging
        if (this.currentTool === 'selectPoly' && this._selectionPoints.length > 0) {
          this._drawPolyPreview(pos);
          return;
        }

        if (!this.drawing || !this.currentTool) return;

        // Selection tools: preview on interaction canvas
        if (this.currentTool === 'selectRect' && this._selectionStart) {
          const x = Math.min(this._selectionStart.x, pos.x);
          const y = Math.min(this._selectionStart.y, pos.y);
          const w = Math.abs(pos.x - this._selectionStart.x);
          const h = Math.abs(pos.y - this._selectionStart.y);
          if (e.shiftKey) { const sz = Math.max(w, h); this._selectionPreview = { type: 'rect', x, y, width: sz, height: sz }; }
          else { this._selectionPreview = { type: 'rect', x, y, width: w, height: h }; }
          const path = new Path2D();
          path.rect(this._selectionPreview.x, this._selectionPreview.y, this._selectionPreview.width, this._selectionPreview.height);
          this._drawSelectionPreview(path);
          return;
        }
        if (this.currentTool === 'selectEllipse' && this._selectionStart) {
          const cx = (this._selectionStart.x + pos.x) / 2;
          const cy = (this._selectionStart.y + pos.y) / 2;
          let rx = Math.abs(pos.x - this._selectionStart.x) / 2;
          let ry = Math.abs(pos.y - this._selectionStart.y) / 2;
          if (e.shiftKey) { const r = Math.max(rx, ry); rx = r; ry = r; }
          this._selectionPreview = { type: 'ellipse', cx, cy, rx, ry };
          const path = new Path2D();
          path.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
          this._drawSelectionPreview(path);
          return;
        }
        if (this.currentTool === 'selectFree') {
          this._selectionPoints.push({ x: pos.x, y: pos.y });
          const path = new Path2D();
          path.moveTo(this._selectionPoints[0].x, this._selectionPoints[0].y);
          for (let i = 1; i < this._selectionPoints.length; i++) {
            path.lineTo(this._selectionPoints[i].x, this._selectionPoints[i].y);
          }
          this._drawSelectionPreview(path);
          return;
        }

        const active = this.layerManager.activeLayer;
        if (!active) return;
        const ctx = active.ctx;

        if (this.currentTool === 'move') {
          if (this._moveSnapshot && this._moveStart) {
            const dx = pos.x - this._moveStart.x;
            const dy = pos.y - this._moveStart.y;
            ctx.clearRect(0, 0, active.width, active.height);
            ctx.putImageData(this._moveSnapshot, dx, dy);
            this._redraw();
          }
        } else if (this.currentTool === 'gradient') {
          if (this._shapeSnapshot && this.shapeStart) {
            ctx.putImageData(this._shapeSnapshot, 0, 0);
            this._drawGradientPreview(ctx, this.shapeStart, pos);
            this._redraw();
          }
        } else if (this.currentTool === 'pencil' || this.currentTool === 'eraser') {
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
          this._redraw();
        } else if (this.shapeStart) {
          ctx.putImageData(this._shapeSnapshot, 0, 0);
          this._drawShape(this.currentTool, this.shapeStart, pos, ctx);
          this._redraw();
        }
      });

      ic.addEventListener('mouseup', e => {
        // Selection tools: finalize
        if (this.currentTool === 'selectRect' && this.drawing && this._selectionPreview) {
          this.drawing = false;
          if (this._selectionPreview.width > 1 && this._selectionPreview.height > 1) {
            this.selection = this._selectionPreview;
            this._buildSelectionPath();
            this._startMarchingAnts();
          }
          this._selectionPreview = null;
          this._selectionStart = null;
          return;
        }
        if (this.currentTool === 'selectEllipse' && this.drawing && this._selectionPreview) {
          this.drawing = false;
          if (this._selectionPreview.rx > 1 && this._selectionPreview.ry > 1) {
            this.selection = this._selectionPreview;
            this._buildSelectionPath();
            this._startMarchingAnts();
          }
          this._selectionPreview = null;
          this._selectionStart = null;
          return;
        }
        if (this.currentTool === 'selectFree' && this.drawing) {
          this.drawing = false;
          if (this._selectionPoints.length > 2) {
            this.selection = { type: 'free', points: [...this._selectionPoints] };
            this._selectionPoints = [];
            this._buildSelectionPath();
            this._startMarchingAnts();
          } else {
            this._selectionPoints = [];
            this._stopMarchingAnts();
          }
          return;
        }

        if (!this.drawing) return;
        this.drawing = false;
        const active = this.layerManager ? this.layerManager.activeLayer : null;
        if (!active) return;

        if (this.currentTool === 'move') {
          // Update textData position if this is a text layer
          if (active.type === 'text' && active.textData && this._moveStart) {
            const pos = this._canvasPos(e);
            const dx = pos.x - this._moveStart.x;
            const dy = pos.y - this._moveStart.y;
            active.textData.x = (active.textData.x || 0) + dx;
            active.textData.y = (active.textData.y || 0) + dy;
          }
          this._moveSnapshot = null;
          this._moveStart = null;
          this.pushHistory();
          this._redraw();
          this._scheduleThumbnailUpdate();
        } else if (this.currentTool === 'gradient') {
          if (this._shapeSnapshot && this.shapeStart) {
            const pos = this._canvasPos(e);
            active.ctx.putImageData(this._shapeSnapshot, 0, 0);
            this._applyGradient(active.ctx, this.shapeStart, pos);
            this.shapeStart = null;
            this._shapeSnapshot = null;
            this.pushHistory();
            this._redraw();
            this._scheduleThumbnailUpdate();
          }
        } else if (this.currentTool === 'pencil' || this.currentTool === 'eraser') {
          active.ctx.globalCompositeOperation = 'source-over';
          this.pushHistory();
          this._redraw();
          this._scheduleThumbnailUpdate();
        } else if (this.shapeStart) {
          const pos = this._canvasPos(e);
          active.ctx.putImageData(this._shapeSnapshot, 0, 0);
          this._drawShape(this.currentTool, this.shapeStart, pos, active.ctx);
          this.shapeStart = null;
          this._shapeSnapshot = null;
          this.pushHistory();
          this._redraw();
          this._scheduleThumbnailUpdate();
        }
      });

      ic.addEventListener('mouseleave', () => {
        if (this.drawing && (this.currentTool === 'pencil' || this.currentTool === 'eraser')) {
          this.drawing = false;
          const active = this.layerManager ? this.layerManager.activeLayer : null;
          if (active) active.ctx.globalCompositeOperation = 'source-over';
          this.pushHistory();
          this._redraw();
          this._scheduleThumbnailUpdate();
        }
        if (this.drawing && this.currentTool === 'move') {
          this.drawing = false;
          this._moveSnapshot = null;
          this._moveStart = null;
          this.pushHistory();
          this._redraw();
          this._scheduleThumbnailUpdate();
        }
      });

      // Mouse wheel zoom
      ic.addEventListener('wheel', e => {
        e.preventDefault();
        this._zoom(e.deltaY < 0 ? 1.1 : 0.9);
      }, { passive: false });

      // Double-click closes polygon selection
      ic.addEventListener('dblclick', e => {
        if (this.currentTool === 'selectPoly' && this._selectionPoints.length > 2) {
          this._finalizePolySelection();
          return;
        }
        const pos = this._canvasPos(e);
        const hitText = this._findTextLayerAt(pos);
        if (hitText) {
          this.layerManager.setActive(hitText.id);
          this._renderLayersList();
          this.setTool('text');
          this._editTextLayer(hitText);
        }
      });
    }

    _canvasPos(e) {
      const rect = this.interactionCanvas.getBoundingClientRect();
      const scaleX = this.interactionCanvas.width / rect.width;
      const scaleY = this.interactionCanvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }

    // ── Image Loading ─────────────────────────────
    loadImage(src) {
      if (src instanceof File) {
        const reader = new FileReader();
        reader.onload = e => this._loadFromUrl(e.target.result);
        reader.readAsDataURL(src);
      } else {
        this._loadFromUrl(src);
      }
    }

    _loadFromUrl(url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => this._onImageLoaded(img);
      img.onerror = () => {
        const img2 = new Image();
        img2.onload = () => this._onImageLoaded(img2);
        img2.src = url;
      };
      img.src = url;
    }

    _onImageLoaded(img) {
      this.layerManager = new LayerManager();
      this.layerManager.initFromImage(img);
      this._activateCanvas();
    }

    _initFromPreset(preset) {
      this.layerManager = new LayerManager();
      this.layerManager.initFromPreset(preset);
      this._activateCanvas();
    }

    _activateCanvas() {
      const lm = this.layerManager;
      this._setupCanvas(lm.docWidth, lm.docHeight);
      this._redraw();
      this.emptyState.style.display = 'none';
      this.canvasWrap.style.display = 'inline-block';
      this.history = [];
      this.historyIndex = -1;
      this.pushHistory();
      this._renderLayersList();
      this._updateLayerOpacityUI();
      this._updateStatusDims();
    }

    _setupCanvas(w, h) {
      this.mainCanvas.width = w;
      this.mainCanvas.height = h;
      this.interactionCanvas.width = w;
      this.interactionCanvas.height = h;

      // Calculate fit scale and set as initial zoom
      const area = this.canvasArea.getBoundingClientRect();
      const maxW = area.width - 40;
      const maxH = area.height - 40;
      this._fitScale = Math.min(1, maxW / w, maxH / h);
      this.zoomLevel = this._fitScale;
      this._applyZoom();

      // Ensure interaction canvas is in the DOM
      if (!this.interactionCanvas.parentNode) {
        this.canvasWrap.appendChild(this.interactionCanvas);
      }
    }

    _applyZoom() {
      const w = this.mainCanvas.width;
      const h = this.mainCanvas.height;
      const cssW = Math.round(w * this.zoomLevel) + 'px';
      const cssH = Math.round(h * this.zoomLevel) + 'px';
      this.mainCanvas.style.width = cssW;
      this.mainCanvas.style.height = cssH;
      this.interactionCanvas.style.width = cssW;
      this.interactionCanvas.style.height = cssH;
      if (this.statusZoom) this.statusZoom.textContent = Math.round(this.zoomLevel * 100) + '%';
    }

    _zoom(factor) {
      if (!this.layerManager) return;
      this.zoomLevel = Math.max(0.05, Math.min(32, this.zoomLevel * factor));
      this._applyZoom();
    }

    _zoomFit() {
      if (!this.layerManager) return;
      const area = this.canvasArea.getBoundingClientRect();
      const maxW = area.width - 40;
      const maxH = area.height - 40;
      this._fitScale = Math.min(1, maxW / this.mainCanvas.width, maxH / this.mainCanvas.height);
      this.zoomLevel = this._fitScale;
      this._applyZoom();
    }

    // ── Rendering ─────────────────────────────────
    _redraw() {
      if (!this.layerManager) return;
      this.layerManager.composite(this.mainCtx);
      this._applyFilters();
      // Always keep _lastLayerBounds fresh for resize handles
      if (this.layerManager.activeLayer && this.layerManager.activeLayer.visible) {
        const fb = this._getLayerContentBounds(this.layerManager.activeLayer);
        if (fb) this._lastLayerBounds = fb;
        else this._lastLayerBounds = null;
      } else {
        this._lastLayerBounds = null;
      }
      // Draw layer bounds when no selection is active (no marching ants to conflict with)
      if (!this._selectionAnimFrame && this.interactionCanvas) {
        const ictx = this.interactionCanvas.getContext('2d');
        ictx.clearRect(0, 0, this.interactionCanvas.width, this.interactionCanvas.height);
        this._drawLayerBounds(ictx);
      }
    }

    _applyFilters() {
      const f = this.filters;
      const hasFilter = f.brightness !== 100 || f.contrast !== 100 || f.saturation !== 100 ||
                        f.blur !== 0 || f.grayscale !== 0 || f.sepia !== 0 || f.hue !== 0;
      if (hasFilter) {
        this.mainCanvas.style.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hue}deg)`;
      } else {
        this.mainCanvas.style.filter = '';
      }
    }

    // ── Layer bounds ──────────────────────────────
    _getLayerContentBounds(layer) {
      if (!layer || layer.type === 'group') return null;
      const w = layer.width, h = layer.height;
      if (!w || !h) return null;
      const data = layer.ctx.getImageData(0, 0, w, h).data;
      let minX = w, minY = h, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (data[(y * w + x) * 4 + 3] > 0) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < 0) return null;
      return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
    }

    _drawLayerBounds(ictx) {
      if (!this.layerManager) return;
      const layer = this.layerManager.activeLayer;
      if (!layer || !layer.visible) return;
      const bounds = this._getLayerContentBounds(layer);
      if (!bounds) return;
      this._lastLayerBounds = bounds;
      const bx = bounds.x, by = bounds.y, bw = bounds.width, bh = bounds.height;
      ictx.save();
      ictx.strokeStyle = 'rgba(0,150,255,0.7)';
      ictx.lineWidth = 1;
      ictx.setLineDash([4, 4]);
      ictx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
      ictx.setLineDash([]);
      // Draw 9 handles
      const hs = 5; // half-size
      const handles = this._getResizeHandles(bounds);
      ictx.fillStyle = '#ffffff';
      ictx.strokeStyle = 'rgba(0,150,255,1)';
      ictx.lineWidth = 1.5;
      handles.forEach(h => {
        ictx.fillRect(h.x - hs, h.y - hs, hs * 2, hs * 2);
        ictx.strokeRect(h.x - hs, h.y - hs, hs * 2, hs * 2);
      });
      ictx.restore();
    }

    _getResizeHandles(b) {
      const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      return [
        { id: 'tl', x: b.x, y: b.y },
        { id: 'tc', x: cx, y: b.y },
        { id: 'tr', x: b.x + b.width, y: b.y },
        { id: 'ml', x: b.x, y: cy },
        { id: 'mc', x: cx, y: cy },
        { id: 'mr', x: b.x + b.width, y: cy },
        { id: 'bl', x: b.x, y: b.y + b.height },
        { id: 'bc', x: cx, y: b.y + b.height },
        { id: 'br', x: b.x + b.width, y: b.y + b.height },
      ];
    }

    _hitTestHandle(pos) {
      if (!this._lastLayerBounds) return null;
      const handles = this._getResizeHandles(this._lastLayerBounds);
      const threshold = 7;
      for (const h of handles) {
        if (Math.abs(pos.x - h.x) <= threshold && Math.abs(pos.y - h.y) <= threshold) {
          return h.id;
        }
      }
      return null;
    }

    _startVisualResize(handleId, startPos, e) {
      const layer = this.layerManager.activeLayer;
      if (!layer) return;
      const bounds = { ...this._lastLayerBounds };
      const ic = this.interactionCanvas;
      const ictx = ic.getContext('2d');

      // Snapshot the layer content within bounds
      const snap = document.createElement('canvas');
      snap.width = bounds.width;
      snap.height = bounds.height;
      snap.getContext('2d').drawImage(layer.canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);

      const origBounds = { ...bounds };
      let curBounds = { ...bounds };

      const cursors = { tl: 'nw-resize', tc: 'n-resize', tr: 'ne-resize', ml: 'w-resize', mc: 'move', mr: 'e-resize', bl: 'sw-resize', bc: 's-resize', br: 'se-resize' };
      ic.style.cursor = cursors[handleId] || 'default';

      const drawPreview = () => {
        ictx.clearRect(0, 0, ic.width, ic.height);
        this._drawLayerBoundsCustom(ictx, curBounds);
        // Draw scaled preview on interaction canvas
        ictx.save();
        ictx.globalAlpha = 0.6;
        ictx.drawImage(snap, 0, 0, snap.width, snap.height, curBounds.x, curBounds.y, curBounds.width, curBounds.height);
        ictx.restore();
      };

      const onMove = (ev) => {
        const pos = this._canvasPos(ev);
        const dx = pos.x - startPos.x;
        const dy = pos.y - startPos.y;
        const shift = ev.shiftKey;
        const ratio = origBounds.width / origBounds.height;

        let nx = origBounds.x, ny = origBounds.y;
        let nw = origBounds.width, nh = origBounds.height;

        if (handleId === 'mc') {
          // Move
          nx = origBounds.x + dx;
          ny = origBounds.y + dy;
        } else if (handleId === 'br') {
          nw = Math.max(4, origBounds.width + dx);
          nh = Math.max(4, origBounds.height + dy);
          if (shift) nh = nw / ratio;
        } else if (handleId === 'bl') {
          nw = Math.max(4, origBounds.width - dx);
          nh = Math.max(4, origBounds.height + dy);
          if (shift) nh = nw / ratio;
          nx = origBounds.x + origBounds.width - nw;
        } else if (handleId === 'tr') {
          nw = Math.max(4, origBounds.width + dx);
          nh = Math.max(4, origBounds.height - dy);
          if (shift) nh = nw / ratio;
          ny = origBounds.y + origBounds.height - nh;
        } else if (handleId === 'tl') {
          nw = Math.max(4, origBounds.width - dx);
          nh = Math.max(4, origBounds.height - dy);
          if (shift) nh = nw / ratio;
          nx = origBounds.x + origBounds.width - nw;
          ny = origBounds.y + origBounds.height - nh;
        } else if (handleId === 'mr') {
          nw = Math.max(4, origBounds.width + dx);
          if (shift) { nh = nw / ratio; ny = origBounds.y + (origBounds.height - nh) / 2; }
        } else if (handleId === 'ml') {
          nw = Math.max(4, origBounds.width - dx);
          if (shift) { nh = nw / ratio; ny = origBounds.y + (origBounds.height - nh) / 2; }
          nx = origBounds.x + origBounds.width - nw;
        } else if (handleId === 'bc') {
          nh = Math.max(4, origBounds.height + dy);
          if (shift) { nw = nh * ratio; nx = origBounds.x + (origBounds.width - nw) / 2; }
        } else if (handleId === 'tc') {
          nh = Math.max(4, origBounds.height - dy);
          if (shift) { nw = nh * ratio; nx = origBounds.x + (origBounds.width - nw) / 2; }
          ny = origBounds.y + origBounds.height - nh;
        }

        curBounds = { x: Math.round(nx), y: Math.round(ny), width: Math.round(nw), height: Math.round(nh) };
        drawPreview();
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        ic.style.cursor = '';

        // Apply the resize
        if (curBounds.width !== origBounds.width || curBounds.height !== origBounds.height || curBounds.x !== origBounds.x || curBounds.y !== origBounds.y) {
          layer.ctx.clearRect(0, 0, layer.width, layer.height);
          layer.ctx.drawImage(snap, 0, 0, snap.width, snap.height, curBounds.x, curBounds.y, curBounds.width, curBounds.height);
          if (layer.type === 'text' && layer.textData) {
            layer.textData.x = curBounds.x;
            layer.textData.y = curBounds.y;
          }
          this.pushHistory();
        }
        this._redraw();
        this._renderLayersList();
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      drawPreview();
    }

    _drawLayerBoundsCustom(ictx, b) {
      ictx.save();
      ictx.strokeStyle = 'rgba(0,150,255,0.7)';
      ictx.lineWidth = 1;
      ictx.setLineDash([4, 4]);
      ictx.strokeRect(b.x + 0.5, b.y + 0.5, b.width - 1, b.height - 1);
      ictx.setLineDash([]);
      const hs = 5;
      const handles = this._getResizeHandles(b);
      ictx.fillStyle = '#ffffff';
      ictx.strokeStyle = 'rgba(0,150,255,1)';
      ictx.lineWidth = 1.5;
      handles.forEach(h => {
        ictx.fillRect(h.x - hs, h.y - hs, hs * 2, hs * 2);
        ictx.strokeRect(h.x - hs, h.y - hs, hs * 2, hs * 2);
      });
      ictx.restore();
    }

    // ── Tools ─────────────────────────────────────
    setTool(tool) {
      const prevTool = this.currentTool;
      this.currentTool = tool;
      // Update toolbox UI — standalone buttons
      $$('.jsie-tool-btn[data-tool]:not([data-group])', this.root).forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === tool);
      });
      // Update toolbox UI — group buttons
      $$('.jsie-tool-group .jsie-tool-btn[data-group]', this.root).forEach(btn => {
        const group = btn.dataset.group;
        const groupTools = this._getGroupTools(group);
        if (groupTools && groupTools.includes(tool)) {
          btn.dataset.tool = tool;
          btn.innerHTML = (Icons[tool] || '') + '<span class="jsie-group-arrow"></span>';
          btn.title = t('tool.' + tool);
          btn.classList.add('active');
          this._toolGroupSelection[group] = tool;
        } else {
          btn.classList.remove('active');
        }
      });
      // Options bar
      this._renderToolOptions();
      // Crop
      if (tool === 'crop' && this.layerManager) {
        this._showCropOverlay();
      } else {
        this._hideCropOverlay();
      }
      // Selection: clear poly points when switching away, manage marching ants
      const selTools = ['selectRect', 'selectEllipse', 'selectPoly', 'selectFree', 'selectWand'];
      if (!selTools.includes(tool)) {
        this._selectionPoints = [];
        if (this.selection && this._selectionPath) {
          this._stopMarchingAnts();
          this._drawMarchingAnts();
        }
      } else if (this.selection && this._selectionPath) {
        this._startMarchingAnts();
      }
      // Cursor
      const cursors = { move: 'move', pan: 'grab', eyedropper: 'crosshair', fill: 'crosshair', gradient: 'crosshair', pencil: 'crosshair', eraser: 'crosshair', text: 'text', crop: 'default', selectRect: 'crosshair', selectEllipse: 'crosshair', selectPoly: 'crosshair', selectFree: 'crosshair', selectWand: 'crosshair' };
      this.interactionCanvas.style.cursor = tool ? (cursors[tool] || 'crosshair') : 'default';
      // Status
      this._updateStatusTool();
    }

    _getGroupTools(groupName) {
      const all = [...(this.config.tools.drawing || []), ...(this.config.tools.transform || [])];
      for (const item of all) {
        if (typeof item === 'object' && item.group === groupName) {
          return item.tools;
        }
      }
      return null;
    }

    _toggleGroupSubmenu(groupName, groupDiv) {
      // Close existing submenu
      const existing = groupDiv.querySelector('.jsie-group-submenu');
      if (existing) { existing.remove(); return; }
      // Close all other submenus
      $$('.jsie-group-submenu', this.root).forEach(m => m.remove());
      // Get tools for this group
      const tools = this._getGroupTools(groupName);
      if (!tools) return;
      const isActionGroup = groupDiv.classList.contains('jsie-action-group');
      // Create submenu
      const submenu = document.createElement('div');
      submenu.className = 'jsie-group-submenu';
      submenu.innerHTML = tools.map(toolId => {
        if (isActionGroup) {
          return `<button class="jsie-tool-btn" data-subaction="${toolId}" title="${t('tool.' + toolId)}">${Icons[toolId] || ''}</button>`;
        }
        const isActive = this.currentTool === toolId;
        return `<button class="jsie-tool-btn${isActive ? ' active' : ''}" data-subtool="${toolId}" title="${t('tool.' + toolId)}">${Icons[toolId] || ''}</button>`;
      }).join('');
      groupDiv.appendChild(submenu);
      // Bind submenu clicks
      submenu.addEventListener('click', (e) => {
        if (isActionGroup) {
          const btn = e.target.closest('[data-subaction]');
          if (!btn) return;
          const action = btn.dataset.subaction;
          if (action === 'rotateLeft') this.rotate(-90);
          else if (action === 'rotateRight') this.rotate(90);
          else if (action === 'flipH') this.flip('horizontal');
          else if (action === 'flipV') this.flip('vertical');
          submenu.remove();
          return;
        }
        const btn = e.target.closest('[data-subtool]');
        if (!btn) return;
        const toolId = btn.dataset.subtool;
        this._toolGroupSelection[groupName] = toolId;
        this.setTool(toolId);
        submenu.remove();
      });
    }

    _renderToolOptions() {
      if (!this.toolOptions) return;
      this.toolOptions.innerHTML = '';
      const tool = this.currentTool;
      if (!tool) return;

      let html = '';
      if (['pencil', 'rect', 'circle', 'line', 'arrow', 'eraser'].includes(tool)) {
        html += `<label>${t('opt.color')}</label>${this._colorInputHtml('jsie-opt-color', this.drawColor)}`;
        html += `<label>${t('opt.size')}</label><input type="range" id="jsie-opt-size" min="1" max="50" value="${this.strokeSize}">`;
        if (['rect', 'circle'].includes(tool)) {
          html += `<div class="jsie-opt-check"><input type="checkbox" id="jsie-opt-fill" ${this.fillEnabled ? 'checked' : ''}><label for="jsie-opt-fill">${t('opt.fill')}</label></div>`;
          html += this._colorInputHtml('jsie-opt-fill-color', this.fillColor);
        }
      } else if (tool === 'text') {
        const baseFonts = ['Arial','Helvetica','Verdana','Tahoma','Trebuchet MS','Georgia','Times New Roman','Courier New','Lucida Console','Impact','Comic Sans MS','Palatino','Garamond','Bookman'];
        const fonts = [...new Set([...this._loadedGoogleFonts, ...baseFonts])];
        const fontOpts = fonts.map(f => `<option value="${f}"${f === this.fontFamily ? ' selected' : ''}>${f}</option>`).join('');
        html += `<div class="jsie-text-opts">`;
        html += `<div class="jsie-text-row"><label>${t('opt.color')}</label>${this._colorInputHtml('jsie-opt-color', this.drawColor)}</div>`;
        html += `<div class="jsie-text-row"><label>${t('opt.font')}</label><select id="jsie-opt-font">${fontOpts}</select><button type="button" id="jsie-gf-btn" class="jsie-gf-trigger" title="Google Fonts">G</button></div>`;
        html += `<div class="jsie-text-row"><label>${t('opt.fontWeight')}</label><select id="jsie-opt-weight"><option value="300"${this.fontWeight==='300'?' selected':''}>Light</option><option value="normal"${this.fontWeight==='normal'?' selected':''}>Regular</option><option value="500"${this.fontWeight==='500'?' selected':''}>Medium</option><option value="bold"${this.fontWeight==='bold'?' selected':''}>Bold</option><option value="900"${this.fontWeight==='900'?' selected':''}>Black</option></select></div>`;
        html += `<div class="jsie-text-row"><label>${t('opt.fontStyle')}</label><select id="jsie-opt-style"><option value="normal"${this.fontStyle==='normal'?' selected':''}>Normal</option><option value="italic"${this.fontStyle==='italic'?' selected':''}>Italic</option></select></div>`;
        html += `<div class="jsie-text-row"><label>${t('opt.fontSize')}</label><input type="number" id="jsie-opt-fontsize" value="${this.fontSize}" min="8" max="200" style="width:56px"></div>`;
        html += `<div class="jsie-text-row"><label>${t('opt.letterSpacing')}</label><input type="number" id="jsie-opt-spacing" value="${this.letterSpacing}" min="-5" max="20" step="0.5" style="width:56px"></div>`;
        html += `<div class="jsie-text-row"><label>${t('opt.lineHeight')}</label><input type="number" id="jsie-opt-lineheight" value="${this.lineHeight}" min="0.5" max="3" step="0.1" style="width:56px"></div>`;
        html += `<div class="jsie-text-row"><label>${t('opt.textDecoration')}</label><select id="jsie-opt-decoration"><option value="none"${this.textDecoration==='none'?' selected':''}>None</option><option value="underline"${this.textDecoration==='underline'?' selected':''}>Underline</option><option value="line-through"${this.textDecoration==='line-through'?' selected':''}>Strikethrough</option></select></div>`;
        const svgAL = '<svg width="14" height="14" viewBox="0 0 14 14"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" stroke-width="1.5"/><line x1="1" y1="7" x2="9" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="1" y1="11" x2="11" y2="11" stroke="currentColor" stroke-width="1.5"/></svg>';
        const svgAC = '<svg width="14" height="14" viewBox="0 0 14 14"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="7" x2="11" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="11" x2="12" y2="11" stroke="currentColor" stroke-width="1.5"/></svg>';
        const svgAR = '<svg width="14" height="14" viewBox="0 0 14 14"><line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="11" x2="13" y2="11" stroke="currentColor" stroke-width="1.5"/></svg>';
        html += `<div class="jsie-text-row"><label>${t('opt.align')}</label><span class="jsie-align-btns"><button type="button" class="jsie-align-btn${this.textAlign==='left'?' active':''}" data-align="left" title="Left">${svgAL}</button><button type="button" class="jsie-align-btn${this.textAlign==='center'?' active':''}" data-align="center" title="Center">${svgAC}</button><button type="button" class="jsie-align-btn${this.textAlign==='right'?' active':''}" data-align="right" title="Right">${svgAR}</button></span></div>`;
        html += `</div>`;
      } else if (tool === 'fill') {
        html += `<label>${t('opt.color')}</label>${this._colorInputHtml('jsie-opt-color', this.drawColor)}`;
        html += `<label>${t('opt.tolerance')}</label><input type="range" id="jsie-opt-tolerance" min="0" max="100" value="${this.fillTolerance}">`;
      } else if (tool === 'gradient') {
        html += `<label>${t('opt.color1')}</label>${this._colorInputHtml('jsie-opt-grad1', this.gradientColor1)}`;
        html += `<label>${t('opt.color2')}</label>${this._colorInputHtml('jsie-opt-grad2', this.gradientColor2)}`;
      } else if (tool === 'eyedropper') {
        html += `<label>${t('opt.color')}</label>${this._colorInputHtml('jsie-opt-color', this.drawColor)}`;
      } else if (['selectRect', 'selectEllipse', 'selectPoly', 'selectFree', 'selectWand'].includes(tool)) {
        if (tool === 'selectWand') {
          html += `<label>${t('opt.tolerance')}</label><input type="range" id="jsie-opt-wand-tolerance" min="0" max="100" value="${this.wandTolerance}"><span id="jsie-wand-tol-val" style="min-width:24px;text-align:center">${this.wandTolerance}</span>`;
          html += `<span style="width:1px;height:16px;background:var(--jsie-border);margin:0 4px;display:inline-block"></span>`;
        }
        html += `<button class="jsie-btn-text secondary" id="jsie-sel-all">${t('sel.all')}</button>`;
        html += `<button class="jsie-btn-text secondary" id="jsie-sel-deselect">${t('sel.deselect')}</button>`;
        html += `<button class="jsie-btn-text secondary" id="jsie-sel-invert">${t('sel.invert')}</button>`;
        html += `<span style="width:1px;height:16px;background:var(--jsie-border);margin:0 4px;display:inline-block"></span>`;
        html += `<button class="jsie-btn-text secondary" id="jsie-sel-crop">${t('sel.cropToSel')}</button>`;
        html += `<button class="jsie-btn-text secondary" id="jsie-sel-delete">${t('sel.delete')}</button>`;
      }

      this.toolOptions.innerHTML = html;
      this._bindToolOptionEvents();
    }

    _bindToolOptionEvents() {
      const optColor = $('#jsie-opt-color', this.root);
      const optSize = $('#jsie-opt-size', this.root);
      const optFill = $('#jsie-opt-fill', this.root);
      const optFillColor = $('#jsie-opt-fill-color', this.root);
      const optFont = $('#jsie-opt-font', this.root);
      const optFontSize = $('#jsie-opt-fontsize', this.root);
      const optTolerance = $('#jsie-opt-tolerance', this.root);
      const optGrad1 = $('#jsie-opt-grad1', this.root);
      const optGrad2 = $('#jsie-opt-grad2', this.root);

      const syncText = () => this._syncTextLayerProps();
      if (optColor) on(optColor, 'input', () => { this.drawColor = optColor.value; syncText(); });
      if (optSize) on(optSize, 'input', () => { this.strokeSize = parseInt(optSize.value); });
      if (optFill) on(optFill, 'change', () => { this.fillEnabled = optFill.checked; });
      if (optFillColor) on(optFillColor, 'input', () => { this.fillColor = optFillColor.value; });
      if (optFont) {
        optFont.value = this.fontFamily;
        on(optFont, 'change', () => { this.fontFamily = optFont.value; syncText(); });
      }
      const gfBtn = $('#jsie-gf-btn', this.root);
      if (gfBtn) on(gfBtn, 'click', () => this._showGoogleFontsDialog());
      if (optFontSize) on(optFontSize, 'input', () => { this.fontSize = parseInt(optFontSize.value); syncText(); });

      // Text advanced options
      const optWeight = $('#jsie-opt-weight', this.root);
      const optStyle = $('#jsie-opt-style', this.root);
      const optSpacing = $('#jsie-opt-spacing', this.root);
      const optLineH = $('#jsie-opt-lineheight', this.root);
      const optDeco = $('#jsie-opt-decoration', this.root);
      if (optWeight) on(optWeight, 'change', () => { this.fontWeight = optWeight.value; syncText(); });
      if (optStyle) on(optStyle, 'change', () => { this.fontStyle = optStyle.value; syncText(); });
      if (optSpacing) on(optSpacing, 'input', () => { this.letterSpacing = parseFloat(optSpacing.value); syncText(); });
      if (optLineH) on(optLineH, 'input', () => { this.lineHeight = parseFloat(optLineH.value); syncText(); });
      if (optDeco) on(optDeco, 'change', () => { this.textDecoration = optDeco.value; syncText(); });
      // Align buttons
      const alignBtns = $$('.jsie-align-btn', this.root);
      alignBtns.forEach(btn => {
        on(btn, 'click', () => {
          this.textAlign = btn.dataset.align;
          alignBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          syncText();
        });
      });
      if (optTolerance) on(optTolerance, 'input', () => { this.fillTolerance = parseInt(optTolerance.value); });
      if (optGrad1) on(optGrad1, 'input', () => { this.gradientColor1 = optGrad1.value; });
      if (optGrad2) on(optGrad2, 'input', () => { this.gradientColor2 = optGrad2.value; });

      // Wand tolerance
      const wandTol = $('#jsie-opt-wand-tolerance', this.root);
      const wandTolVal = $('#jsie-wand-tol-val', this.root);
      if (wandTol) on(wandTol, 'input', () => { this.wandTolerance = parseInt(wandTol.value); if (wandTolVal) wandTolVal.textContent = wandTol.value; });

      // Selection buttons
      const selAll = $('#jsie-sel-all', this.root);
      const selDeselect = $('#jsie-sel-deselect', this.root);
      const selInvert = $('#jsie-sel-invert', this.root);
      const selCrop = $('#jsie-sel-crop', this.root);
      const selDelete = $('#jsie-sel-delete', this.root);
      if (selAll) on(selAll, 'click', () => this._selectAll());
      if (selDeselect) on(selDeselect, 'click', () => this._clearSelection());
      if (selInvert) on(selInvert, 'click', () => this._invertSelection());
      if (selCrop) on(selCrop, 'click', () => this._cropToSelection());
      if (selDelete) on(selDelete, 'click', () => this._deleteSelection());

      // Color combos (hex input + palette)
      this._bindColorCombos();
    }

    // ── Shapes ────────────────────────────────────
    _drawShape(type, start, end, ctx) {
      ctx.strokeStyle = this.drawColor;
      ctx.lineWidth = this.strokeSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (type === 'rect') {
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const w = Math.abs(end.x - start.x);
        const h = Math.abs(end.y - start.y);
        if (this.fillEnabled) {
          ctx.fillStyle = this.fillColor;
          ctx.fillRect(x, y, w, h);
        }
        ctx.strokeRect(x, y, w, h);
      } else if (type === 'circle') {
        const cx = (start.x + end.x) / 2;
        const cy = (start.y + end.y) / 2;
        const rx = Math.abs(end.x - start.x) / 2;
        const ry = Math.abs(end.y - start.y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
        if (this.fillEnabled) {
          ctx.fillStyle = this.fillColor;
          ctx.fill();
        }
        ctx.stroke();
      } else if (type === 'line') {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else if (type === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = Math.max(this.strokeSize * 4, 15);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    }

    // ── Selection helpers ─────────────────────────────
    _buildSelectionPath() {
      if (!this.selection) { this._selectionPath = null; return; }
      const s = this.selection;
      const path = new Path2D();
      if (s.type === 'rect') {
        path.rect(s.x, s.y, s.width, s.height);
      } else if (s.type === 'ellipse') {
        path.ellipse(s.cx, s.cy, Math.max(1, s.rx), Math.max(1, s.ry), 0, 0, Math.PI * 2);
      } else if (s.type === 'poly' || s.type === 'free') {
        if (s.points.length > 2) {
          path.moveTo(s.points[0].x, s.points[0].y);
          for (let i = 1; i < s.points.length; i++) {
            path.lineTo(s.points[i].x, s.points[i].y);
          }
          path.closePath();
        }
      } else if (s.type === 'wand' && s.mask) {
        // Convert bitmap mask to Path2D using horizontal run-length scanning
        const w = s.width;
        const h = s.height;
        const mask = s.mask;
        for (let y = 0; y < h; y++) {
          let x = 0;
          while (x < w) {
            if (mask[y * w + x]) {
              const startX = x;
              while (x < w && mask[y * w + x]) x++;
              path.rect(startX, y, x - startX, 1);
            } else {
              x++;
            }
          }
        }
      }
      this._selectionPath = path;
    }

    _clearSelection() {
      this.selection = null;
      this._selectionPath = null;
      this._selectionContourPath = null;
      this._selectionPoints = [];
      this._selectionPreview = null;
      this._selectionStart = null;
      this._stopMarchingAnts();
    }

    _getSelectionBounds() {
      if (!this.selection) return null;
      const s = this.selection;
      if (s.type === 'rect') {
        return { x: Math.round(Math.min(s.x, s.x + s.width)), y: Math.round(Math.min(s.y, s.y + s.height)), width: Math.round(Math.abs(s.width)), height: Math.round(Math.abs(s.height)) };
      } else if (s.type === 'ellipse') {
        return { x: Math.round(s.cx - s.rx), y: Math.round(s.cy - s.ry), width: Math.round(s.rx * 2), height: Math.round(s.ry * 2) };
      } else if (s.type === 'poly' || s.type === 'free') {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of s.points) {
          minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
        }
        return { x: Math.round(minX), y: Math.round(minY), width: Math.round(maxX - minX), height: Math.round(maxY - minY) };
      } else if (s.type === 'wand' && s.mask) {
        let minX = s.width, minY = s.height, maxX = 0, maxY = 0;
        for (let y = 0; y < s.height; y++) {
          for (let x = 0; x < s.width; x++) {
            if (s.mask[y * s.width + x]) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX >= minX && maxY >= minY) {
          return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
        }
        return null;
      } else if (s.type === 'inverted') {
        return { x: 0, y: 0, width: s.docWidth, height: s.docHeight };
      }
      return null;
    }

    _selectAll() {
      if (!this.layerManager) return;
      this.selection = { type: 'rect', x: 0, y: 0, width: this.layerManager.docWidth, height: this.layerManager.docHeight };
      this._buildSelectionPath();
      this._startMarchingAnts();
    }

    _invertSelection() {
      if (!this.selection || !this._selectionPath || !this.layerManager) return;
      const lm = this.layerManager;
      const fullPath = new Path2D();
      fullPath.rect(0, 0, lm.docWidth, lm.docHeight);
      fullPath.addPath(this._selectionPath);
      this._selectionPath = fullPath;
      this.selection = { type: 'inverted', original: this.selection, docWidth: lm.docWidth, docHeight: lm.docHeight };
      this._startMarchingAnts();
    }

    // ── Marching ants ────────────────────────────────
    _startMarchingAnts() {
      this._stopMarchingAnts();
      const animate = () => {
        this._selectionAntsOffset = (this._selectionAntsOffset + 1) % 16;
        this._drawMarchingAnts();
        this._selectionAnimFrame = requestAnimationFrame(animate);
      };
      this._selectionAnimFrame = requestAnimationFrame(animate);
    }

    _stopMarchingAnts() {
      if (this._selectionAnimFrame) {
        cancelAnimationFrame(this._selectionAnimFrame);
        this._selectionAnimFrame = null;
      }
      if (this.interactionCanvas) {
        const ictx = this.interactionCanvas.getContext('2d');
        ictx.clearRect(0, 0, this.interactionCanvas.width, this.interactionCanvas.height);
        this._drawLayerBounds(ictx);
      }
    }

    _drawMarchingAnts() {
      if (!this._selectionPath || !this.interactionCanvas) return;
      const ic = this.interactionCanvas;
      const ictx = ic.getContext('2d');
      ictx.clearRect(0, 0, ic.width, ic.height);
      this._drawLayerBounds(ictx);
      ictx.save();
      if (this._selectionContourPath) {
        // Wand: static double-line contour (no animation — avoids flicker on many short segments)
        ictx.lineWidth = 2;
        ictx.strokeStyle = '#000000';
        ictx.stroke(this._selectionContourPath);
        ictx.lineWidth = 1;
        ictx.strokeStyle = '#ffffff';
        ictx.stroke(this._selectionContourPath);
      } else {
        // Other selections: classic marching ants
        ictx.strokeStyle = '#ffffff';
        ictx.lineWidth = 1;
        ictx.setLineDash([4, 4]);
        ictx.lineDashOffset = -this._selectionAntsOffset;
        ictx.stroke(this._selectionPath);
        ictx.strokeStyle = '#000000';
        ictx.lineDashOffset = -(this._selectionAntsOffset + 4);
        ictx.stroke(this._selectionPath);
      }
      ictx.restore();
    }

    _drawSelectionPreview(path) {
      if (!this.interactionCanvas) return;
      const ic = this.interactionCanvas;
      const ictx = ic.getContext('2d');
      ictx.clearRect(0, 0, ic.width, ic.height);
      ictx.save();
      ictx.strokeStyle = '#ffffff';
      ictx.lineWidth = 1;
      ictx.setLineDash([4, 4]);
      ictx.lineDashOffset = 0;
      ictx.stroke(path);
      ictx.strokeStyle = '#000000';
      ictx.lineDashOffset = -4;
      ictx.stroke(path);
      ictx.restore();
    }

    _finalizePolySelection() {
      if (this._selectionPoints.length < 3) {
        this._selectionPoints = [];
        this._stopMarchingAnts();
        return;
      }
      this.selection = { type: 'poly', points: [...this._selectionPoints] };
      this._selectionPoints = [];
      this._buildSelectionPath();
      this._startMarchingAnts();
    }

    _drawPolyPreview(cursorPos) {
      if (!this.interactionCanvas || this._selectionPoints.length === 0) return;
      const ic = this.interactionCanvas;
      const ictx = ic.getContext('2d');
      ictx.clearRect(0, 0, ic.width, ic.height);
      ictx.save();
      ictx.setLineDash([4, 4]);
      ictx.lineWidth = 1;
      // White pass
      ictx.strokeStyle = '#ffffff';
      ictx.lineDashOffset = 0;
      ictx.beginPath();
      ictx.moveTo(this._selectionPoints[0].x, this._selectionPoints[0].y);
      for (let i = 1; i < this._selectionPoints.length; i++) {
        ictx.lineTo(this._selectionPoints[i].x, this._selectionPoints[i].y);
      }
      if (cursorPos) ictx.lineTo(cursorPos.x, cursorPos.y);
      ictx.stroke();
      // Black pass
      ictx.strokeStyle = '#000000';
      ictx.lineDashOffset = -4;
      ictx.beginPath();
      ictx.moveTo(this._selectionPoints[0].x, this._selectionPoints[0].y);
      for (let i = 1; i < this._selectionPoints.length; i++) {
        ictx.lineTo(this._selectionPoints[i].x, this._selectionPoints[i].y);
      }
      if (cursorPos) ictx.lineTo(cursorPos.x, cursorPos.y);
      ictx.stroke();
      // Draw closing indicator - small circle on first point
      if (this._selectionPoints.length > 2 && cursorPos) {
        const first = this._selectionPoints[0];
        const dist = Math.hypot(cursorPos.x - first.x, cursorPos.y - first.y);
        if (dist < 8) {
          ictx.setLineDash([]);
          ictx.strokeStyle = '#ff6600';
          ictx.lineWidth = 2;
          ictx.beginPath();
          ictx.arc(first.x, first.y, 6, 0, Math.PI * 2);
          ictx.stroke();
        }
      }
      ictx.restore();
    }

    // ── Selection operations ─────────────────────────
    _copySelection() {
      if (!this.selection || !this._selectionPath || !this.layerManager) return;
      const lm = this.layerManager;
      const temp = document.createElement('canvas');
      temp.width = lm.docWidth;
      temp.height = lm.docHeight;
      const tctx = temp.getContext('2d');
      tctx.save();
      tctx.clip(this._selectionPath, 'evenodd');
      lm.composite(tctx);
      tctx.restore();
      this._clipboard = { canvas: temp, bounds: this._getSelectionBounds() };
    }

    _cutSelection() {
      this._copySelection();
      this._deleteSelection();
    }

    _deleteSelection() {
      if (!this.selection || !this._selectionPath || !this.layerManager) return;
      const active = this.layerManager.activeLayer;
      if (!active || active.locked) return;
      active.ctx.save();
      active.ctx.clip(this._selectionPath, 'evenodd');
      active.ctx.clearRect(0, 0, active.width, active.height);
      active.ctx.restore();
      this.pushHistory();
      this._redraw();
      this._scheduleThumbnailUpdate();
    }

    _pasteSelection() {
      if (!this._clipboard || !this.layerManager) return;
      const lm = this.layerManager;
      const layer = lm.addLayer('Pasted');
      layer.ctx.drawImage(this._clipboard.canvas, 0, 0);
      this.pushHistory();
      this._redraw();
      this._renderLayersList();
      this._updateLayerOpacityUI();
      this.setTool('move');
    }

    _cropToSelection() {
      if (!this.selection || !this.layerManager) return;
      const bounds = this._getSelectionBounds();
      if (!bounds || bounds.width < 1 || bounds.height < 1) return;
      const { x, y, width, height } = bounds;
      const lm = this.layerManager;
      for (const layer of lm.layers) {
        if (layer.type === 'group') continue;
        const temp = document.createElement('canvas');
        temp.width = width;
        temp.height = height;
        const tctx = temp.getContext('2d');
        tctx.drawImage(layer.canvas, x, y, width, height, 0, 0, width, height);
        layer.canvas.width = width;
        layer.canvas.height = height;
        layer.width = width;
        layer.height = height;
        layer.ctx.drawImage(temp, 0, 0);
      }
      lm.docWidth = width;
      lm.docHeight = height;
      this._clearSelection();
      this.mainCanvas.width = width;
      this.mainCanvas.height = height;
      this.interactionCanvas.width = width;
      this.interactionCanvas.height = height;
      this._redraw();
      this.pushHistory();
      this._renderLayersList();
      // Update status bar dims
      const dimEl = $('#jsie-status-dims', this.root);
      if (dimEl) dimEl.textContent = `${width} × ${height}`;
    }

    // ── Eyedropper ─────────────────────────────────
    _pickColor(pos) {
      // Read from composite (mainCanvas)
      const pixel = this.mainCtx.getImageData(Math.round(pos.x), Math.round(pos.y), 1, 1).data;
      const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
      this.drawColor = hex;
      // Update color input + hex field if visible
      const optColor = $('#jsie-opt-color', this.root);
      if (optColor) optColor.value = hex;
      const hexInput = $('.jsie-hex-input[data-for="jsie-opt-color"]', this.root);
      if (hexInput) hexInput.value = hex;
    }

    // ── Flood Fill (scanline) ────────────────────────
    _floodFill(layer, startX, startY, fillColorHex, tolerance) {
      const w = layer.width;
      const h = layer.height;
      if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;

      const imgData = layer.ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const idx = (startY * w + startX) * 4;
      const targetR = data[idx], targetG = data[idx + 1], targetB = data[idx + 2], targetA = data[idx + 3];

      // Parse fill color
      const fc = this._hexToRgb(fillColorHex);
      if (fc.r === targetR && fc.g === targetG && fc.b === targetB && targetA === 255) return;

      const tol = tolerance * tolerance;
      const visited = new Uint8Array(w * h);

      const match = (i) => {
        const dr = data[i] - targetR;
        const dg = data[i + 1] - targetG;
        const db = data[i + 2] - targetB;
        const da = data[i + 3] - targetA;
        return (dr * dr + dg * dg + db * db + da * da) <= tol * 4;
      };

      const stack = [[startX, startY]];
      while (stack.length > 0) {
        let [x, y] = stack.pop();
        let pi = y * w + x;
        if (visited[pi]) continue;

        // Scan left
        while (x >= 0 && match((y * w + x) * 4)) x--;
        x++;
        let spanAbove = false, spanBelow = false;
        while (x < w && match((y * w + x) * 4)) {
          const ci = (y * w + x) * 4;
          data[ci] = fc.r;
          data[ci + 1] = fc.g;
          data[ci + 2] = fc.b;
          data[ci + 3] = 255;
          visited[y * w + x] = 1;

          if (y > 0) {
            const aboveMatch = match(((y - 1) * w + x) * 4);
            if (!spanAbove && aboveMatch && !visited[(y - 1) * w + x]) {
              stack.push([x, y - 1]);
              spanAbove = true;
            } else if (!aboveMatch) {
              spanAbove = false;
            }
          }
          if (y < h - 1) {
            const belowMatch = match(((y + 1) * w + x) * 4);
            if (!spanBelow && belowMatch && !visited[(y + 1) * w + x]) {
              stack.push([x, y + 1]);
              spanBelow = true;
            } else if (!belowMatch) {
              spanBelow = false;
            }
          }
          x++;
        }
      }
      layer.ctx.putImageData(imgData, 0, 0);
    }

    // ── Magic Wand Selection ──────────────────────────
    _magicWandSelect(startX, startY) {
      const lm = this.layerManager;
      if (!lm) return;
      const w = lm.docWidth;
      const h = lm.docHeight;
      startX = Math.round(startX);
      startY = Math.round(startY);
      if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;

      // Get composite image data from all visible layers
      const flat = lm.flatten();
      const imgData = flat.getContext('2d').getImageData(0, 0, w, h);
      const data = imgData.data;

      const idx = (startY * w + startX) * 4;
      const targetR = data[idx], targetG = data[idx + 1], targetB = data[idx + 2], targetA = data[idx + 3];

      // Map tolerance 0-100 → 0-255
      const tol = Math.round(this.wandTolerance * 2.55);
      const mask = new Uint8Array(w * h);
      const visited = new Uint8Array(w * h);

      const match = (i) => {
        const dr = Math.abs(data[i] - targetR);
        const dg = Math.abs(data[i + 1] - targetG);
        const db = Math.abs(data[i + 2] - targetB);
        const da = Math.abs(data[i + 3] - targetA);
        return Math.max(dr, dg, db, da) <= tol;
      };

      // Scanline flood fill — builds mask instead of painting pixels
      const stack = [[startX, startY]];
      while (stack.length > 0) {
        let [x, y] = stack.pop();
        if (visited[y * w + x]) continue;

        // Scan left
        while (x >= 0 && match((y * w + x) * 4)) x--;
        x++;
        let spanAbove = false, spanBelow = false;
        while (x < w && match((y * w + x) * 4)) {
          const pi = y * w + x;
          mask[pi] = 1;
          visited[pi] = 1;

          if (y > 0) {
            const aboveMatch = match(((y - 1) * w + x) * 4);
            if (!spanAbove && aboveMatch && !visited[(y - 1) * w + x]) {
              stack.push([x, y - 1]);
              spanAbove = true;
            } else if (!aboveMatch) {
              spanAbove = false;
            }
          }
          if (y < h - 1) {
            const belowMatch = match(((y + 1) * w + x) * 4);
            if (!spanBelow && belowMatch && !visited[(y + 1) * w + x]) {
              stack.push([x, y + 1]);
              spanBelow = true;
            } else if (!belowMatch) {
              spanBelow = false;
            }
          }
          x++;
        }
      }

      this.selection = { type: 'wand', mask, width: w, height: h };
      this._buildSelectionPath();
      // Build contour-only path for marching ants (the rect-based _selectionPath is for clip)
      this._selectionContourPath = this._buildWandContour(mask, w, h);
      this._startMarchingAnts();
    }

    _buildWandContour(mask, w, h) {
      const path = new Path2D();
      for (let y = 0; y < h; y++) {
        // Horizontal top edges: merge consecutive segments
        let rx = -1;
        for (let x = 0; x <= w; x++) {
          const sel = x < w && mask[y * w + x];
          const above = y > 0 && x < w && mask[(y - 1) * w + x];
          if (sel && !above) {
            if (rx < 0) rx = x;
          } else {
            if (rx >= 0) { path.moveTo(rx, y); path.lineTo(x, y); rx = -1; }
          }
        }
        // Horizontal bottom edges
        rx = -1;
        for (let x = 0; x <= w; x++) {
          const sel = x < w && mask[y * w + x];
          const below = y < h - 1 && x < w && mask[(y + 1) * w + x];
          if (sel && !below) {
            if (rx < 0) rx = x;
          } else {
            if (rx >= 0) { path.moveTo(rx, y + 1); path.lineTo(x, y + 1); rx = -1; }
          }
        }
      }
      // Vertical left & right edges: merge consecutive segments
      for (let x = 0; x < w; x++) {
        let ry = -1;
        for (let y = 0; y <= h; y++) {
          const sel = y < h && mask[y * w + x];
          const left = x > 0 && y < h && mask[y * w + x - 1];
          if (sel && !left) {
            if (ry < 0) ry = y;
          } else {
            if (ry >= 0) { path.moveTo(x, ry); path.lineTo(x, y); ry = -1; }
          }
        }
        ry = -1;
        for (let y = 0; y <= h; y++) {
          const sel = y < h && mask[y * w + x];
          const right = x < w - 1 && y < h && mask[y * w + x + 1];
          if (sel && !right) {
            if (ry < 0) ry = y;
          } else {
            if (ry >= 0) { path.moveTo(x + 1, ry); path.lineTo(x + 1, y); ry = -1; }
          }
        }
      }
      return path;
    }

    _hexToRgb(hex) {
      const val = parseInt(hex.replace('#', ''), 16);
      return { r: (val >> 16) & 255, g: (val >> 8) & 255, b: val & 255 };
    }

    // ── Gradient ─────────────────────────────────────
    _drawGradientPreview(ctx, start, end) {
      // Just draw a dashed line for preview
      const ic = this.interactionCanvas.getContext('2d');
      ic.clearRect(0, 0, this.interactionCanvas.width, this.interactionCanvas.height);
      ic.setLineDash([5, 5]);
      ic.strokeStyle = '#fff';
      ic.lineWidth = 1;
      ic.beginPath();
      ic.moveTo(start.x, start.y);
      ic.lineTo(end.x, end.y);
      ic.stroke();
      ic.setLineDash([]);
    }

    _applyGradient(ctx, start, end) {
      const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      grad.addColorStop(0, this.gradientColor1);
      grad.addColorStop(1, this.gradientColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // Clear interaction canvas preview
      const ic = this.interactionCanvas.getContext('2d');
      ic.clearRect(0, 0, this.interactionCanvas.width, this.interactionCanvas.height);
    }

    // ── Text Tool ─────────────────────────────────
    _loadTextLayerProps(layer) {
      if (!layer || layer.type !== 'text' || !layer.textData) return;
      const td = layer.textData;
      this.drawColor = td.color || this.drawColor;
      this.fontFamily = td.fontFamily || this.fontFamily;
      this.fontSize = td.fontSize || this.fontSize;
      this.fontWeight = td.fontWeight || 'normal';
      this.fontStyle = td.fontStyle || 'normal';
      this.letterSpacing = td.letterSpacing || 0;
      this.lineHeight = td.lineHeight || 1.2;
      this.textAlign = td.align || 'left';
      this.textDecoration = td.textDecoration || 'none';
      this._renderToolOptions();
    }

    _syncTextLayerProps() {
      if (!this.layerManager) return;
      const layer = this.layerManager.activeLayer;
      if (!layer || layer.type !== 'text' || !layer.textData) return;
      const td = layer.textData;
      td.color = this.drawColor;
      td.fontSize = this.fontSize;
      td.fontFamily = this.fontFamily;
      td.fontWeight = this.fontWeight;
      td.fontStyle = this.fontStyle;
      td.letterSpacing = this.letterSpacing;
      td.lineHeight = this.lineHeight;
      td.align = this.textAlign;
      td.textDecoration = this.textDecoration;
      layer._renderText();
      this._redraw();
    }

    _findTextLayerAt(pos) {
      if (!this.layerManager) return null;
      const layers = this.layerManager.layers;
      // Search from top to bottom (last = topmost)
      for (let i = layers.length - 1; i >= 0; i--) {
        const l = layers[i];
        if (l.type !== 'text' || !l.visible || !l.textData) continue;
        const bounds = this._getLayerContentBounds(l);
        if (!bounds) continue;
        if (pos.x >= bounds.x && pos.x <= bounds.x + bounds.width &&
            pos.y >= bounds.y && pos.y <= bounds.y + bounds.height) {
          return l;
        }
      }
      return null;
    }
    _placeText(pos) {
      // Finish any active edit first
      this._finishActiveTextEdit();

      const existing = $('.jsie-text-input-overlay', this.canvasWrap);
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.className = 'jsie-text-input-overlay';
      const rect = this.interactionCanvas.getBoundingClientRect();
      const scaleX = rect.width / this.interactionCanvas.width;
      const scaleY = rect.height / this.interactionCanvas.height;
      overlay.style.left = (pos.x * scaleX) + 'px';
      overlay.style.top = (pos.y * scaleY) + 'px';

      const ta = document.createElement('textarea');
      ta.style.fontSize = (this.fontSize * scaleY) + 'px';
      ta.style.fontFamily = this.fontFamily;
      ta.style.color = this.drawColor;
      ta.style.fontWeight = this.fontWeight;
      ta.style.fontStyle = this.fontStyle;
      ta.style.letterSpacing = this.letterSpacing + 'px';
      ta.style.textDecoration = this.textDecoration;
      ta.style.textAlign = this.textAlign;
      ta.style.lineHeight = this.lineHeight;
      ta.rows = 1;
      ta.cols = 20;
      overlay.appendChild(ta);
      this.canvasWrap.appendChild(overlay);

      let finished = false;
      const finish = (save) => {
        if (finished) return;
        finished = true;
        this._activeTextEdit = null;
        document.removeEventListener('mousedown', outsideHandler, true);
        if (save) {
          const text = ta.value;
          if (text && this.layerManager) {
            this._createTextLayer(text, pos);
          }
        }
        overlay.remove();
      };

      this._activeTextEdit = finish;

      const outsideHandler = (e) => {
        if (!overlay.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          finish(true);
        }
      };
      setTimeout(() => {
        if (!finished) document.addEventListener('mousedown', outsideHandler, true);
      }, 0);

      ta.focus();
      ta.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          finish(true);
        } else if (e.key === 'Escape') {
          finish(false);
        }
      });
    }

    _createTextLayer(text, pos) {
      const lm = this.layerManager;
      const textData = {
        text: text,
        x: pos.x,
        y: pos.y,
        color: this.drawColor,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        align: this.textAlign,
        lineHeight: this.lineHeight,
        fontWeight: this.fontWeight,
        fontStyle: this.fontStyle,
        letterSpacing: this.letterSpacing,
        textDecoration: this.textDecoration
      };
      const layer = new Layer({
        name: 'T: ' + text.substring(0, 15),
        width: lm.docWidth,
        height: lm.docHeight,
        type: 'text',
        textData: textData
      });
      const idx = lm.activeIndex;
      lm.layers.splice(idx + 1, 0, layer);
      lm.activeLayerId = layer.id;
      this.pushHistory();
      this._redraw();
      this._renderLayersList();
      this._updateLayerOpacityUI();
    }

    _finishActiveTextEdit() {
      if (this._activeTextEdit) {
        this._activeTextEdit(true);
        this._activeTextEdit = null;
      }
    }

    _editTextLayer(layer) {
      if (layer.type !== 'text' || !layer.textData) return;
      const td = layer.textData;

      // Finish any previous edit first
      this._finishActiveTextEdit();

      const existing = $('.jsie-text-input-overlay', this.canvasWrap);
      if (existing) existing.remove();

      // Load props into panel
      this._loadTextLayerProps(layer);

      const rect = this.interactionCanvas.getBoundingClientRect();
      const scaleX = rect.width / this.interactionCanvas.width;
      const scaleY = rect.height / this.interactionCanvas.height;

      const overlay = document.createElement('div');
      overlay.className = 'jsie-text-input-overlay';
      overlay.style.left = (td.x * scaleX) + 'px';
      overlay.style.top = (td.y * scaleY) + 'px';

      const ta = document.createElement('textarea');
      ta.style.fontSize = (td.fontSize * scaleY) + 'px';
      ta.style.fontFamily = td.fontFamily;
      ta.style.color = td.color;
      ta.style.fontWeight = td.fontWeight || 'normal';
      ta.style.fontStyle = td.fontStyle || 'normal';
      ta.style.letterSpacing = (td.letterSpacing || 0) + 'px';
      ta.style.textDecoration = td.textDecoration || 'none';
      ta.style.textAlign = td.align || 'left';
      ta.style.lineHeight = td.lineHeight || 1.2;
      ta.value = td.text;
      ta.rows = 2;
      ta.cols = 20;
      overlay.appendChild(ta);
      this.canvasWrap.appendChild(overlay);

      // Hide the rendered layer to avoid double text
      layer.ctx.clearRect(0, 0, layer.width, layer.height);
      this._redraw();

      let finished = false;
      const finishEdit = (save) => {
        if (finished) return;
        finished = true;
        this._activeTextEdit = null;
        document.removeEventListener('mousedown', outsideHandler, true);
        overlay.remove();
        if (save) {
          const text = ta.value;
          if (text) {
            td.text = text;
            td.color = this.drawColor;
            td.fontSize = this.fontSize;
            td.fontFamily = this.fontFamily;
            td.fontWeight = this.fontWeight;
            td.fontStyle = this.fontStyle;
            td.letterSpacing = this.letterSpacing;
            td.lineHeight = this.lineHeight;
            td.align = this.textAlign;
            td.textDecoration = this.textDecoration;
            layer.name = 'T: ' + text.substring(0, 15);
          }
        }
        // Re-render the text layer
        layer._renderText();
        this.pushHistory();
        this._redraw();
        this._renderLayersList();
      };

      this._activeTextEdit = finishEdit;

      // Click outside overlay → save and close
      const outsideHandler = (e) => {
        if (!overlay.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          finishEdit(true);
        }
      };
      // Use setTimeout so the current click doesn't trigger it
      setTimeout(() => {
        if (!finished) document.addEventListener('mousedown', outsideHandler, true);
      }, 0);

      ta.focus();
      ta.select();
      ta.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          finishEdit(true);
        } else if (e.key === 'Escape') {
          finishEdit(false);
        }
      });
    }

    // ── Crop ──────────────────────────────────────
    _showCropOverlay() {
      this._hideCropOverlay();
      const wrap = this.canvasWrap;
      const overlay = document.createElement('div');
      overlay.className = 'jsie-crop-overlay';

      const w = parseFloat(this.mainCanvas.style.width);
      const h = parseFloat(this.mainCanvas.style.height);
      const margin = 0.1;
      const cx = w * margin, cy = h * margin;
      const cw = w * (1 - 2 * margin), ch = h * (1 - 2 * margin);

      overlay.innerHTML = `
        <div class="jsie-crop-rect" style="left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px">
          <div class="jsie-crop-handle tl"></div>
          <div class="jsie-crop-handle tr"></div>
          <div class="jsie-crop-handle bl"></div>
          <div class="jsie-crop-handle br"></div>
        </div>
      `;
      wrap.appendChild(overlay);

      const applyBtn = document.createElement('button');
      applyBtn.className = 'jsie-btn-text';
      applyBtn.style.cssText = 'position:absolute;bottom:10px;right:10px;z-index:11';
      applyBtn.textContent = t('btn.apply');
      applyBtn.addEventListener('click', () => this._applyCrop());
      wrap.appendChild(applyBtn);
      this._cropApplyBtn = applyBtn;

      this._cropOverlay = overlay;
      this._setupCropDrag(overlay);
    }

    _hideCropOverlay() {
      if (this._cropOverlay) {
        this._cropOverlay.remove();
        this._cropOverlay = null;
      }
      if (this._cropApplyBtn) {
        this._cropApplyBtn.remove();
        this._cropApplyBtn = null;
      }
    }

    _setupCropDrag(overlay) {
      const cropRect = overlay.querySelector('.jsie-crop-rect');
      let mode = null;
      let startX, startY, startRect;

      const getRect = () => ({
        left: parseFloat(cropRect.style.left),
        top: parseFloat(cropRect.style.top),
        width: parseFloat(cropRect.style.width),
        height: parseFloat(cropRect.style.height),
      });

      const onDown = e => {
        e.preventDefault();
        const handle = e.target.closest('.jsie-crop-handle');
        if (handle) {
          mode = handle.classList.contains('tl') ? 'tl' : handle.classList.contains('tr') ? 'tr' : handle.classList.contains('bl') ? 'bl' : 'br';
        } else if (e.target === cropRect || cropRect.contains(e.target)) {
          mode = 'move';
        } else {
          return;
        }
        startX = e.clientX;
        startY = e.clientY;
        startRect = getRect();
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      };

      const onMove = e => {
        if (!mode) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const maxW = parseFloat(this.mainCanvas.style.width);
        const maxH = parseFloat(this.mainCanvas.style.height);

        if (mode === 'move') {
          let l = Math.max(0, Math.min(maxW - startRect.width, startRect.left + dx));
          let tp = Math.max(0, Math.min(maxH - startRect.height, startRect.top + dy));
          cropRect.style.left = l + 'px';
          cropRect.style.top = tp + 'px';
        } else {
          let { left, top, width, height } = startRect;
          if (mode === 'br') { width = Math.max(20, width + dx); height = Math.max(20, height + dy); }
          else if (mode === 'bl') { left += dx; width = Math.max(20, width - dx); height = Math.max(20, height + dy); }
          else if (mode === 'tr') { top += dy; width = Math.max(20, width + dx); height = Math.max(20, height - dy); }
          else if (mode === 'tl') { left += dx; top += dy; width = Math.max(20, width - dx); height = Math.max(20, height - dy); }
          cropRect.style.left = Math.max(0, left) + 'px';
          cropRect.style.top = Math.max(0, top) + 'px';
          cropRect.style.width = Math.min(width, maxW) + 'px';
          cropRect.style.height = Math.min(height, maxH) + 'px';
        }
      };

      const onUp = () => {
        mode = null;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      overlay.addEventListener('mousedown', onDown);
    }

    _applyCrop() {
      if (!this._cropOverlay || !this.layerManager) return;
      const cropRect = this._cropOverlay.querySelector('.jsie-crop-rect');
      const cssW = parseFloat(this.mainCanvas.style.width);
      const cssH = parseFloat(this.mainCanvas.style.height);
      const lm = this.layerManager;
      const canW = lm.docWidth;
      const canH = lm.docHeight;

      const scaleX = canW / cssW;
      const scaleY = canH / cssH;
      const cx = Math.round(parseFloat(cropRect.style.left) * scaleX);
      const cy = Math.round(parseFloat(cropRect.style.top) * scaleY);
      const cw = Math.round(parseFloat(cropRect.style.width) * scaleX);
      const ch = Math.round(parseFloat(cropRect.style.height) * scaleY);

      // Crop all layers
      for (const layer of lm.layers) {
        const temp = document.createElement('canvas');
        temp.width = cw;
        temp.height = ch;
        const tctx = temp.getContext('2d');
        tctx.drawImage(layer.canvas, cx, cy, cw, ch, 0, 0, cw, ch);
        layer.canvas.width = cw;
        layer.canvas.height = ch;
        layer.width = cw;
        layer.height = ch;
        layer.ctx.drawImage(temp, 0, 0);
      }
      lm.docWidth = cw;
      lm.docHeight = ch;

      this.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hue: 0 };
      this._resetFilterSliders();
      this._setupCanvas(cw, ch);
      this._redraw();
      this._hideCropOverlay();
      this.setTool(null);
      this.pushHistory();
      this._renderLayersList();
      this._updateStatusDims();
    }

    _resetFilterSliders() {
      $$('input[data-filter]', this.root).forEach(inp => {
        const f = inp.dataset.filter;
        inp.value = this.filters[f];
        inp.nextElementSibling.textContent = this.filters[f];
      });
    }

    // ── Resize ────────────────────────────────────
    showResizePanel() {
      if (!this.layerManager) return;
      const existing = $('.jsie-resize-panel', this.canvasWrap);
      if (existing) { existing.remove(); return; }

      const w = this.layerManager.docWidth;
      const h = this.layerManager.docHeight;
      const ratio = w / h;

      const panel = document.createElement('div');
      panel.className = 'jsie-resize-panel';
      panel.innerHTML = `
        <div class="jsie-row"><label>${t('opt.width')}</label><input type="number" id="jsie-rw" value="${w}" min="1"></div>
        <div class="jsie-row"><label>${t('opt.height')}</label><input type="number" id="jsie-rh" value="${h}" min="1"></div>
        <div class="jsie-checkbox-row"><input type="checkbox" id="jsie-lock" checked><label for="jsie-lock">${t('opt.lockRatio')}</label></div>
        <button class="jsie-btn-text">${t('btn.apply')}</button>
      `;
      this.canvasWrap.appendChild(panel);

      const wInput = panel.querySelector('#jsie-rw');
      const hInput = panel.querySelector('#jsie-rh');
      const lockCb = panel.querySelector('#jsie-lock');

      wInput.addEventListener('input', () => {
        if (lockCb.checked) hInput.value = Math.round(parseInt(wInput.value) / ratio);
      });
      hInput.addEventListener('input', () => {
        if (lockCb.checked) wInput.value = Math.round(parseInt(hInput.value) * ratio);
      });

      panel.querySelector('.jsie-btn-text').addEventListener('click', () => {
        const nw = parseInt(wInput.value);
        const nh = parseInt(hInput.value);
        if (nw > 0 && nh > 0) this._applyResize(nw, nh);
        panel.remove();
      });
    }

    _applyResize(newW, newH) {
      if (!this.layerManager) return;
      const lm = this.layerManager;

      for (const layer of lm.layers) {
        layer.resize(newW, newH);
      }
      lm.docWidth = newW;
      lm.docHeight = newH;

      this.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hue: 0 };
      this._resetFilterSliders();
      this._setupCanvas(newW, newH);
      this._redraw();
      this.pushHistory();
      this._renderLayersList();
      this._updateStatusDims();
    }

    // ── Rotate/Flip ───────────────────────────────
    rotate(degrees) {
      if (!this.layerManager) return;
      const lm = this.layerManager;
      const rad = degrees * Math.PI / 180;
      const is90 = Math.abs(degrees) === 90 || Math.abs(degrees) === 270;
      const newW = is90 ? lm.docHeight : lm.docWidth;
      const newH = is90 ? lm.docWidth : lm.docHeight;

      for (const layer of lm.layers) {
        const temp = document.createElement('canvas');
        temp.width = newW;
        temp.height = newH;
        const tctx = temp.getContext('2d');
        tctx.translate(newW / 2, newH / 2);
        tctx.rotate(rad);
        tctx.drawImage(layer.canvas, -layer.width / 2, -layer.height / 2);
        layer.canvas.width = newW;
        layer.canvas.height = newH;
        layer.width = newW;
        layer.height = newH;
        layer.ctx.drawImage(temp, 0, 0);
      }
      lm.docWidth = newW;
      lm.docHeight = newH;

      this._setupCanvas(newW, newH);
      this._redraw();
      this.pushHistory();
      this._renderLayersList();
      this._updateStatusDims();
    }

    flip(direction) {
      if (!this.layerManager) return;
      const lm = this.layerManager;

      for (const layer of lm.layers) {
        const temp = document.createElement('canvas');
        temp.width = layer.width;
        temp.height = layer.height;
        const tctx = temp.getContext('2d');
        if (direction === 'horizontal') {
          tctx.translate(layer.width, 0);
          tctx.scale(-1, 1);
        } else {
          tctx.translate(0, layer.height);
          tctx.scale(1, -1);
        }
        tctx.drawImage(layer.canvas, 0, 0);
        layer.ctx.clearRect(0, 0, layer.width, layer.height);
        layer.ctx.drawImage(temp, 0, 0);
      }

      this._redraw();
      this.pushHistory();
      this._renderLayersList();
    }

    // ── History ───────────────────────────────────
    pushHistory() {
      if (!this.layerManager) return;
      this.history = this.history.slice(0, this.historyIndex + 1);
      const state = {
        layerState: this.layerManager.serialize(),
        filters: { ...this.filters }
      };
      this.history.push(state);
      if (this.history.length > this.config.maxHistory) {
        this.history.shift();
      }
      this.historyIndex = this.history.length - 1;
    }

    undo() {
      if (this.historyIndex <= 0) return;
      this.historyIndex--;
      this._restoreHistory(this.history[this.historyIndex]);
    }

    redo() {
      if (this.historyIndex >= this.history.length - 1) return;
      this.historyIndex++;
      this._restoreHistory(this.history[this.historyIndex]);
    }

    _restoreHistory(state) {
      this.layerManager.restore(state.layerState);
      this.filters = { ...state.filters };
      this._resetFilterSliders();
      this._setupCanvas(this.layerManager.docWidth, this.layerManager.docHeight);
      this._redraw();
      this._renderLayersList();
      this._updateLayerOpacityUI();
      this._updateStatusDims();
    }

    // ── Export ─────────────────────────────────────
    _flatten() {
      if (!this.layerManager) return null;
      const canvas = this.layerManager.flatten();
      // Apply filters to flattened result for export
      const f = this.filters;
      const hasFilter = f.brightness !== 100 || f.contrast !== 100 || f.saturation !== 100 ||
                        f.blur !== 0 || f.grayscale !== 0 || f.sepia !== 0 || f.hue !== 0;
      if (hasFilter) {
        const temp = document.createElement('canvas');
        temp.width = canvas.width;
        temp.height = canvas.height;
        const ctx = temp.getContext('2d');
        ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hue}deg)`;
        ctx.drawImage(canvas, 0, 0);
        return temp;
      }
      return canvas;
    }

    getImage() {
      const canvas = this._flatten();
      if (!canvas) return null;
      const format = this.config.outputFormat === 'jpeg' ? 'image/jpeg' : this.config.outputFormat === 'webp' ? 'image/webp' : 'image/png';
      return canvas.toDataURL(format, this.config.outputQuality);
    }

    getBlob() {
      return new Promise(resolve => {
        const canvas = this._flatten();
        if (!canvas) { resolve(null); return; }
        const format = this.config.outputFormat === 'jpeg' ? 'image/jpeg' : this.config.outputFormat === 'webp' ? 'image/webp' : 'image/png';
        canvas.toBlob(blob => resolve(blob), format, this.config.outputQuality);
      });
    }

    // ── Layer Panel Rendering ─────────────────────
    _findLayerById(id) {
      for (const l of this.layerManager.layers) {
        if (l.id === id) return l;
        if (l.type === 'group') {
          const child = l.children.find(c => c.id === id);
          if (child) return child;
        }
      }
      return null;
    }

    _renderLayerItem(layer, container, isChild = false) {
      const item = document.createElement('div');
      const isActive = layer.id === this.layerManager.activeLayerId;
      let cls = 'jsie-layer-item';
      if (isActive) cls += ' active';
      if (layer.type === 'group') cls += ' group-item';
      if (isChild) cls += ' group-child';
      item.className = cls;
      item.dataset.layerId = layer.id;
      item.draggable = true;

      const visClass = layer.visible ? '' : ' hidden';
      const visIcon = layer.visible ? Icons.eye : Icons.eyeOff;

      let thumbHtml;
      if (layer.type === 'text') {
        thumbHtml = `<div class="jsie-layer-text-icon">T</div>`;
      } else if (layer.type === 'group') {
        const toggleIcon = layer.collapsed ? Icons.chevronRight : Icons.chevronDown;
        thumbHtml = `<span class="jsie-layer-group-toggle" data-group-toggle="${layer.id}">${toggleIcon}</span>`;
      } else {
        thumbHtml = `<div class="jsie-layer-thumb"><img src="${layer.getThumbnail()}" alt=""></div>`;
      }

      item.innerHTML = `
        <span class="jsie-layer-vis${visClass}" data-layer-vis="${layer.id}">${visIcon}</span>
        ${thumbHtml}
        <span class="jsie-layer-name">${layer.name}</span>
      `;
      container.appendChild(item);

      // Render group children if expanded
      if (layer.type === 'group' && !layer.collapsed) {
        const children = [...layer.children].reverse();
        for (const child of children) {
          this._renderLayerItem(child, container, true);
        }
      }
    }

    _renderLayersList() {
      if (!this.layersList || !this.layerManager) return;
      this.layersList.innerHTML = '';

      // Render top-to-bottom (reverse of array)
      const layers = [...this.layerManager.layers].reverse();
      for (const layer of layers) {
        this._renderLayerItem(layer, this.layersList);
      }
    }

    _updateLayerOpacityUI() {
      if (!this.layerManager) return;
      const active = this.layerManager.activeLayer;
      if (active) {
        if (this.layerOpacitySlider) {
          const val = Math.round(active.opacity * 100);
          this.layerOpacitySlider.value = val;
          this.layerOpacityVal.textContent = val + '%';
        }
        if (this.layerBlendSelect) {
          this.layerBlendSelect.value = active.blendMode || 'normal';
        }
      }
    }

    _scheduleThumbnailUpdate() {
      clearTimeout(this._thumbTimer);
      this._thumbTimer = setTimeout(() => this._renderLayersList(), 300);
    }

    // ── Status Bar ────────────────────────────────
    _updateStatusDims() {
      if (!this.statusDims || !this.layerManager) return;
      this.statusDims.textContent = `${this.layerManager.docWidth} × ${this.layerManager.docHeight}`;
    }

    _updateStatusCursor(pos) {
      if (!this.statusCursor) return;
      this.statusCursor.textContent = `X: ${Math.round(pos.x)}  Y: ${Math.round(pos.y)}`;
    }

    _updateStatusTool() {
      if (!this.statusTool) return;
      this.statusTool.textContent = this.currentTool ? t('tool.' + this.currentTool) : '';
    }

    // ── Actions ───────────────────────────────────
    reset() {
      if (!this.layerManager) return;
      if (!confirm(t('confirm.reset'))) return;
      if (this.history.length > 0) {
        this.historyIndex = 0;
        this._restoreHistory(this.history[0]);
      }
    }

    // ── Import as Layer ───────────────────────────
    _triggerImport() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      input.onchange = () => {
        if (input.files[0]) this.importAsLayer(input.files[0]);
        input.remove();
      };
      document.body.appendChild(input);
      input.click();
    }

    importAsLayer(src) {
      if (!this.layerManager) {
        this.loadImage(src);
        return;
      }
      if (src instanceof File) {
        const reader = new FileReader();
        reader.onload = e => this._importImageAsLayer(e.target.result);
        reader.readAsDataURL(src);
      } else {
        this._importImageAsLayer(src);
      }
    }

    _importImageAsLayer(url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const lm = this.layerManager;
        const layer = new Layer({
          name: 'Imported',
          width: lm.docWidth,
          height: lm.docHeight
        });
        const x = Math.max(0, Math.floor((lm.docWidth - img.width) / 2));
        const y = Math.max(0, Math.floor((lm.docHeight - img.height) / 2));
        layer.ctx.drawImage(img, x, y, Math.min(img.width, lm.docWidth), Math.min(img.height, lm.docHeight));
        const idx = lm.activeIndex;
        lm.layers.splice(idx + 1, 0, layer);
        lm.activeLayerId = layer.id;
        // Clear any active selection so handles are immediately visible
        this._clearSelection();
        this.pushHistory();
        this._redraw();
        this._renderLayersList();
        this._updateLayerOpacityUI();
      };
      img.src = url;
    }

    // ── Google Fonts ─────────────────────────────
    _loadedGoogleFonts = new Set();

    _googleFontsList() {
      return [
        'Roboto','Open Sans','Lato','Montserrat','Oswald','Raleway','Poppins','Nunito',
        'Ubuntu','Merriweather','Playfair Display','Rubik','Inter','Noto Sans','Work Sans',
        'Fira Sans','Quicksand','Barlow','Mulish','Inconsolata','Karla','Cabin','Arimo',
        'Dosis','Bitter','Josefin Sans','Anton','Lobster','Pacifico','Dancing Script',
        'Caveat','Permanent Marker','Satisfy','Shadows Into Light','Indie Flower',
        'Amatic SC','Comfortaa','Bebas Neue','Archivo','Manrope','Sora','Space Grotesk',
        'DM Sans','Plus Jakarta Sans','Outfit','Lexend','Jost','Urbanist','Figtree',
        'Geist','Nunito Sans','Titillium Web','PT Sans','Source Sans 3','Hind',
        'Libre Franklin','Exo 2','Rajdhani','Kanit','Prompt','Sarabun','Heebo',
        'Overpass','Yanone Kaffeesatz','Righteous','Alfa Slab One','Bungee',
        'Press Start 2P','Silkscreen','VT323','Special Elite','Orbitron',
        'Cinzel','Cormorant Garamond','EB Garamond','Spectral','Crimson Text',
        'Source Serif 4','Zilla Slab','IBM Plex Sans','IBM Plex Mono','Fira Code',
        'JetBrains Mono','Source Code Pro','Roboto Mono','Space Mono'
      ];
    }

    _loadGoogleFont(fontName) {
      return new Promise((resolve, reject) => {
        if (this._loadedGoogleFonts.has(fontName)) { resolve(); return; }
        const encoded = fontName.replace(/ /g, '+');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;700;900&display=swap`;
        link.onload = () => {
          // Force actual font file download for all weights
          const weights = ['300', '400', '500', '700', '900'];
          const loads = weights.map(w => document.fonts.load(`${w} 16px "${fontName}"`));
          Promise.all(loads).then(() => {
            this._loadedGoogleFonts.add(fontName);
            resolve();
          }).catch(() => {
            // Fallback: at least the CSS is loaded
            this._loadedGoogleFonts.add(fontName);
            resolve();
          });
        };
        link.onerror = () => reject(new Error(`Failed to load font: ${fontName}`));
        document.head.appendChild(link);
      });
    }

    _showGoogleFontsDialog() {
      const allFonts = this._googleFontsList();
      const modal = document.createElement('div');
      modal.className = 'jsie-modal-overlay';
      modal.style.zIndex = '10001';
      const box = document.createElement('div');
      box.style.cssText = 'background:var(--jsie-bg);padding:24px;border-radius:8px;width:520px;max-width:90vw;max-height:80vh;color:var(--jsie-text);display:flex;flex-direction:column';
      box.innerHTML = `
        <h3 style="margin:0 0 12px;font-size:16px">${t('fonts.title')}</h3>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <input type="text" id="jsie-gf-search" placeholder="${t('fonts.search')}" style="flex:1;height:28px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:4px;padding:0 8px;font-size:12px">
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
          <input type="text" id="jsie-gf-custom" placeholder="${t('fonts.custom')}" style="flex:1;height:28px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:4px;padding:0 8px;font-size:12px">
          <button id="jsie-gf-custom-btn" class="jsie-btn-text" style="height:28px;padding:0 12px;font-size:11px">${t('fonts.load')}</button>
        </div>
        ${this._loadedGoogleFonts.size > 0 ? `<div style="font-size:10px;color:var(--jsie-text2);margin-bottom:4px">${t('fonts.loaded')}</div>
        <div id="jsie-gf-loaded" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--jsie-border)"></div>` : ''}
        <div style="font-size:10px;color:var(--jsie-text2);margin-bottom:4px">${t('fonts.popular')}</div>
        <div id="jsie-gf-list" style="flex:1;overflow-y:auto;display:flex;flex-wrap:wrap;gap:4px;align-content:flex-start"></div>
        <div style="display:flex;justify-content:flex-end;margin-top:12px">
          <button id="jsie-gf-close" class="jsie-btn-text secondary" style="height:28px;padding:0 16px;font-size:11px">Cancel</button>
        </div>`;
      modal.appendChild(box);
      this.root.appendChild(modal);

      const searchInput = box.querySelector('#jsie-gf-search');
      const listDiv = box.querySelector('#jsie-gf-list');
      const loadedDiv = box.querySelector('#jsie-gf-loaded');
      const customInput = box.querySelector('#jsie-gf-custom');
      const customBtn = box.querySelector('#jsie-gf-custom-btn');

      const makeChip = (name, isLoaded) => {
        const chip = document.createElement('button');
        chip.className = 'jsie-gf-chip' + (isLoaded ? ' loaded' : '');
        chip.textContent = name;
        if (isLoaded) chip.style.fontFamily = `'${name}', sans-serif`;
        chip.onclick = () => selectFont(name, chip);
        return chip;
      };

      const renderList = (filter) => {
        listDiv.innerHTML = '';
        const q = (filter || '').toLowerCase();
        allFonts.filter(f => !q || f.toLowerCase().includes(q)).forEach(f => {
          listDiv.appendChild(makeChip(f, this._loadedGoogleFonts.has(f)));
        });
      };

      const renderLoaded = () => {
        if (!loadedDiv) return;
        loadedDiv.innerHTML = '';
        this._loadedGoogleFonts.forEach(f => {
          loadedDiv.appendChild(makeChip(f, true));
        });
      };

      const selectFont = async (name, chip) => {
        if (this._loadedGoogleFonts.has(name)) {
          this.fontFamily = name;
          this._syncTextLayerProps();
          this._redraw();
          this._addFontToDropdown(name);
          close();
          return;
        }
        chip.textContent = t('fonts.loading');
        chip.disabled = true;
        try {
          await this._loadGoogleFont(name);
          this.fontFamily = name;
          this._syncTextLayerProps();
          this._redraw();
          this._addFontToDropdown(name);
          close();
        } catch (err) {
          chip.textContent = name + ' ✗';
          chip.disabled = false;
        }
      };

      const loadCustom = async () => {
        const name = customInput.value.trim();
        if (!name) return;
        customBtn.textContent = t('fonts.loading');
        customBtn.disabled = true;
        try {
          await this._loadGoogleFont(name);
          this.fontFamily = name;
          this._syncTextLayerProps();
          this._redraw();
          this._addFontToDropdown(name);
          close();
        } catch (err) {
          customBtn.textContent = t('fonts.load') + ' ✗';
          customBtn.disabled = false;
          setTimeout(() => { customBtn.textContent = t('fonts.load'); }, 2000);
        }
      };

      on(searchInput, 'input', () => renderList(searchInput.value));
      on(customBtn, 'click', loadCustom);
      on(customInput, 'keydown', e => { if (e.key === 'Enter') loadCustom(); });

      const close = () => { modal.remove(); this._renderToolOptions(); };
      on(box.querySelector('#jsie-gf-close'), 'click', close);
      on(modal, 'click', e => { if (e.target === modal) close(); });

      renderList('');
      if (loadedDiv) renderLoaded();

      // Lazy-load font previews for loaded fonts
      requestAnimationFrame(() => {
        listDiv.querySelectorAll('.jsie-gf-chip.loaded').forEach(chip => {
          chip.style.fontFamily = `'${chip.textContent}', sans-serif`;
        });
      });

      searchInput.focus();
    }

    _addFontToDropdown(fontName) {
      const optFont = $('#jsie-opt-font', this.root);
      if (!optFont) return;
      // Check if already in dropdown
      const exists = Array.from(optFont.options).some(o => o.value === fontName);
      if (!exists) {
        const opt = document.createElement('option');
        opt.value = fontName;
        opt.textContent = fontName;
        optFont.insertBefore(opt, optFont.firstChild);
      }
      optFont.value = fontName;
    }

    // ── Color Palette ─────────────────────────────
    _webColors() {
      return [
        '#000000','#333333','#555555','#777777','#999999','#bbbbbb','#dddddd','#ffffff',
        '#ff0000','#ff4444','#ff6600','#ff9900','#ffcc00','#ffff00','#ccff00','#66ff00',
        '#00ff00','#00ff66','#00ffcc','#00ffff','#00ccff','#0099ff','#0066ff','#0000ff',
        '#6600ff','#9900ff','#cc00ff','#ff00ff','#ff0099','#ff0066','#ff3366','#ff6699',
        '#990000','#994400','#996600','#999900','#669900','#009900','#009966','#009999',
        '#006699','#003399','#000099','#330099','#660099','#990099','#990066','#993333',
        '#ffcccc','#ffe0cc','#ffffcc','#ccffcc','#ccffe0','#ccffff','#cce0ff','#ccccff',
        '#e0ccff','#ffccff','#ffcce0','#ffd7b5'
      ];
    }

    _colorInputHtml(id, value) {
      return `<span class="jsie-color-combo"><input type="color" id="${id}" value="${value}"><input type="text" class="jsie-hex-input" data-for="${id}" value="${value}" maxlength="7" spellcheck="false"><button type="button" class="jsie-palette-btn" data-for="${id}" title="Palette">▦</button></span>`;
    }

    _showColorPalette(targetId, triggerEl) {
      // Remove any existing palette
      const existing = this.root.querySelector('.jsie-color-palette');
      if (existing) existing.remove();

      const palette = document.createElement('div');
      palette.className = 'jsie-color-palette';
      const colors = this._webColors();
      colors.forEach(c => {
        const swatch = document.createElement('span');
        swatch.className = 'jsie-swatch';
        swatch.style.background = c;
        swatch.dataset.color = c;
        swatch.title = c;
        palette.appendChild(swatch);
      });
      // Custom input at bottom
      const customRow = document.createElement('div');
      customRow.style.cssText = 'display:flex;gap:4px;padding:4px 0 0;border-top:1px solid var(--jsie-border);margin-top:4px';
      customRow.innerHTML = `<input type="text" class="jsie-palette-custom" placeholder="#ffcc00" maxlength="7" spellcheck="false" style="flex:1;height:22px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 6px;font-size:11px;font-family:monospace">`;
      palette.appendChild(customRow);
      const customInput = customRow.querySelector('input');

      // Position near trigger
      const rect = triggerEl.getBoundingClientRect();
      const rootRect = this.root.getBoundingClientRect();
      palette.style.top = (rect.bottom - rootRect.top + 4) + 'px';
      palette.style.left = Math.min(rect.left - rootRect.left, rootRect.width - 220) + 'px';

      this.root.appendChild(palette);

      const applyColor = (color) => {
        const colorInput = $(`#${targetId}`, this.root);
        const hexInput = $(`.jsie-hex-input[data-for="${targetId}"]`, this.root);
        if (colorInput) { colorInput.value = color; colorInput.dispatchEvent(new Event('input', { bubbles: true })); }
        if (hexInput) hexInput.value = color;
        palette.remove();
      };

      on(palette, 'click', e => {
        const swatch = e.target.closest('.jsie-swatch');
        if (swatch) applyColor(swatch.dataset.color);
      });

      on(customInput, 'keydown', e => {
        if (e.key === 'Enter') {
          let v = customInput.value.trim();
          if (v && !v.startsWith('#')) v = '#' + v;
          if (/^#[0-9a-fA-F]{3,6}$/.test(v)) applyColor(v);
        }
      });

      // Close on click outside
      const outsideHandler = (e) => {
        if (!palette.contains(e.target) && e.target !== triggerEl) {
          palette.remove();
          document.removeEventListener('mousedown', outsideHandler);
        }
      };
      setTimeout(() => document.addEventListener('mousedown', outsideHandler), 0);
    }

    _bindColorCombos() {
      const combos = $$('.jsie-color-combo', this.root);
      combos.forEach(combo => {
        const colorInput = combo.querySelector('input[type="color"]');
        const hexInput = combo.querySelector('.jsie-hex-input');
        const paletteBtn = combo.querySelector('.jsie-palette-btn');
        if (colorInput && hexInput) {
          on(colorInput, 'input', () => { hexInput.value = colorInput.value; });
          on(hexInput, 'input', () => {
            let v = hexInput.value.trim();
            if (v && !v.startsWith('#')) v = '#' + v;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
              colorInput.value = v;
              colorInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          });
        }
        if (paletteBtn) {
          on(paletteBtn, 'click', () => this._showColorPalette(paletteBtn.dataset.for, paletteBtn));
        }
      });
    }

    // ── Menu Bar ────────────────────────────
    _getMenuDefinition() {
      const isMac = /Mac/.test(navigator.platform);
      const mod = isMac ? '⌘' : 'Ctrl';
      return {
        file: [
          { label: t('btn.import'), icon: Icons.importImg, action: 'import' },
          { label: t('btn.export'), icon: Icons.download, action: 'export' },
          { type: 'separator' },
          { label: t('menu.openProject'), action: 'openProject' },
          { label: t('menu.saveProject'), action: 'saveProject' },
          { type: 'separator' },
          { label: t('btn.reset'), icon: Icons.reset, action: 'reset' },
          { type: 'separator' },
          { label: t('btn.save'), icon: Icons.save, action: 'save' },
          { label: t('btn.cancel'), icon: Icons.cancel, action: 'cancel' },
        ],
        edit: [
          { label: t('tool.undo'), icon: Icons.undo, action: 'undo', shortcut: `${mod}+Z` },
          { label: t('tool.redo'), icon: Icons.redo, action: 'redo', shortcut: `${mod}+Y` },
          { type: 'separator' },
          { label: t('menu.cut'), action: 'cut', shortcut: `${mod}+X` },
          { label: t('menu.copy'), action: 'copy', shortcut: `${mod}+C` },
          { label: t('menu.paste'), action: 'paste', shortcut: `${mod}+V` },
          { label: t('menu.delete'), action: 'deletesel', shortcut: 'Del' },
          { type: 'separator' },
          { label: t('sel.all'), action: 'selectAll', shortcut: `${mod}+A` },
        ],
        image: [
          { label: t('tool.resize'), icon: Icons.resize, action: 'resize' },
          { label: t('tool.crop'), icon: Icons.crop, tool: 'crop' },
          { type: 'separator' },
          { label: t('tool.rotateLeft'), icon: Icons.rotateLeft, action: 'rotateLeft' },
          { label: t('tool.rotateRight'), icon: Icons.rotateRight, action: 'rotateRight' },
          { label: t('tool.flipH'), icon: Icons.flipH, action: 'flipH' },
          { label: t('tool.flipV'), icon: Icons.flipV, action: 'flipV' },
          { type: 'separator' },
          { label: t('menu.filters'), submenu: 'filters' },
        ],
        layer: [
          { label: t('menu.newLayer'), icon: Icons.layerAdd, action: 'addLayer' },
          { label: t('menu.duplicateLayer'), icon: Icons.layerDup, action: 'dupLayer' },
          { label: t('menu.deleteLayer'), icon: Icons.layerDelete, action: 'delLayer' },
          { type: 'separator' },
          { label: t('menu.newGroup'), icon: Icons.folder, action: 'addGroup' },
          { type: 'separator' },
          { label: t('menu.layerStyles'), icon: Icons.layerStyles, action: 'layerStyles' },
          { label: t('menu.resizeLayer'), action: 'resizeLayer' },
        ],
        select: [
          { label: t('sel.all'), action: 'selectAll', shortcut: `${mod}+A` },
          { label: t('sel.deselect'), action: 'deselect', shortcut: `${mod}+D` },
          { label: t('sel.invert'), action: 'invertSel', shortcut: `${mod}+Shift+I` },
          { type: 'separator' },
          { label: t('sel.cropToSel'), action: 'cropToSel' },
          { label: t('sel.delete'), action: 'deleteSel', shortcut: 'Del' },
        ],
        view: [
          { label: t('tool.zoomIn'), icon: Icons.zoomIn, action: 'zoomIn', shortcut: '+' },
          { label: t('tool.zoomOut'), icon: Icons.zoomOut, action: 'zoomOut', shortcut: '-' },
          { label: t('tool.zoomFit'), icon: Icons.zoomFit, action: 'zoomFit' },
          { type: 'separator' },
          { label: t('menu.panels'), submenu: 'panels' },
        ],
        help: [
          { label: t('menu.shortcuts'), action: 'showShortcuts' },
          { type: 'separator' },
          { label: t('menu.about'), action: 'showAbout' },
        ],
        // Submenus
        filters: (this.config.filters || ['brightness', 'contrast', 'saturation', 'blur', 'grayscale', 'sepia', 'hue']).map(f => ({
          label: t('filter.' + f), action: 'showFilter', param: f,
        })),
        panels: [
          { label: t('menu.showLayers'), action: 'toggleLayers', check: true },
          { label: t('menu.showFilters'), action: 'toggleFilters', check: true },
          { label: t('menu.showStatusBar'), action: 'toggleStatusBar', check: true },
        ],
      };
    }

    _buildMenuDropdown(menuId) {
      const menus = this._getMenuDefinition();
      const items = menus[menuId];
      if (!items) return '';
      let html = '';
      for (const item of items) {
        if (item.type === 'separator') {
          html += '<div class="jsie-menu-separator"></div>';
          continue;
        }
        if (item.submenu) {
          html += `<div class="jsie-menu-entry jsie-menu-has-sub" data-submenu="${item.submenu}">
            <span class="jsie-menu-entry-icon"></span>
            <span class="jsie-menu-entry-label">${item.label}</span>
            <span class="jsie-menu-sub-arrow">▶</span>
          </div>`;
          continue;
        }
        const iconHtml = item.icon ? `<span class="jsie-menu-entry-icon">${item.icon}</span>` : (item.check !== undefined ? `<span class="jsie-menu-check" data-check="${item.action}"></span>` : '<span class="jsie-menu-entry-icon"></span>');
        const shortcutHtml = item.shortcut ? `<span class="jsie-menu-shortcut">${item.shortcut}</span>` : '';
        const actionAttr = item.action ? `data-maction="${item.action}"` : '';
        const toolAttr = item.tool ? `data-mtool="${item.tool}"` : '';
        const paramAttr = item.param ? `data-mparam="${item.param}"` : '';
        html += `<div class="jsie-menu-entry" ${actionAttr} ${toolAttr} ${paramAttr}>
          ${iconHtml}
          <span class="jsie-menu-entry-label">${item.label}</span>
          ${shortcutHtml}
        </div>`;
      }
      return html;
    }

    _openMenu(menuId, anchorEl) {
      // Close any existing
      this._closeMenus();
      const dropdown = document.createElement('div');
      dropdown.className = 'jsie-menu-dropdown';
      dropdown.dataset.menuDropdown = menuId;
      dropdown.innerHTML = this._buildMenuDropdown(menuId);
      anchorEl.classList.add('open');
      anchorEl.appendChild(dropdown);
      this._menuOpen = menuId;

      // Update panel check marks
      this._updateMenuChecks(dropdown);

      // Position adjustment if off-screen right
      const rect = dropdown.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        dropdown.style.left = 'auto';
        dropdown.style.right = '0';
      }
    }

    _closeMenus() {
      if (!this.root) return;
      $$('.jsie-menu-dropdown', this.root).forEach(d => d.remove());
      $$('.jsie-menu-submenu', this.root).forEach(d => d.remove());
      $$('.jsie-menu-item.open', this.root).forEach(el => el.classList.remove('open'));
      this._menuOpen = null;
    }

    _updateMenuChecks(container) {
      const checks = $$('[data-check]', container);
      for (const c of checks) {
        const action = c.dataset.check;
        let visible = false;
        if (action === 'toggleLayers') {
          const lp = $('#jsie-layers-panel', this.root);
          visible = lp && lp.style.display !== 'none';
        } else if (action === 'toggleFilters') {
          const tab = $('[data-rpanel="image"]', this.root);
          visible = tab && tab.classList.contains('active');
        } else if (action === 'toggleStatusBar') {
          const sb = $('.jsie-status-bar', this.root);
          visible = sb && sb.style.display !== 'none';
        }
        c.textContent = visible ? '✓' : '';
      }
    }

    _handleMenuAction(action, param) {
      this._closeMenus();
      switch (action) {
        // File
        case 'import': this._triggerImport(); break;
        case 'export': this._showExportDialog(); break;
        case 'openProject': this._triggerOpenProject(); break;
        case 'saveProject': this.saveProject(); break;
        case 'reset': this.reset(); break;
        case 'save': this._onSave(); break;
        case 'cancel': this._onCancel(); break;
        // Edit
        case 'undo': this.undo(); break;
        case 'redo': this.redo(); break;
        case 'cut': this._cutSelection(); break;
        case 'copy': this._copySelection(); break;
        case 'paste': this._pasteSelection(); break;
        case 'deletesel':
        case 'deleteSel': this._deleteSelection(); break;
        case 'selectAll': this._selectAll(); break;
        // Image
        case 'resize': this.showResizePanel(); break;
        case 'rotateLeft': this.rotate(-90); break;
        case 'rotateRight': this.rotate(90); break;
        case 'flipH': this.flip('horizontal'); break;
        case 'flipV': this.flip('vertical'); break;
        // Layer
        case 'addLayer':
          if (this.layerManager) this.layerManager.addLayer('Layer');
          this._redraw();
          break;
        case 'dupLayer':
          if (this.layerManager) this.layerManager.duplicateLayer(this.layerManager.activeLayerId);
          this._redraw();
          break;
        case 'delLayer':
          if (this.layerManager) this.layerManager.deleteLayer(this.layerManager.activeLayerId);
          this._redraw();
          break;
        case 'addGroup':
          if (this.layerManager) this.layerManager.addGroup('Group');
          this._redraw();
          break;
        case 'layerStyles': this._showLayerStylesDialog(); break;
        case 'resizeLayer':
          if (this.layerManager) {
            const layer = this.layerManager.getActive();
            if (layer) this._showResizeLayerDialog(layer);
          }
          break;
        // Select
        case 'deselect': this._clearSelection(); break;
        case 'invertSel': this._invertSelection(); break;
        case 'cropToSel': this._cropToSelection(); break;
        // View
        case 'zoomIn': this._zoom(1.25); break;
        case 'zoomOut': this._zoom(0.8); break;
        case 'zoomFit': this._zoomFit(); break;
        case 'toggleLayers': {
          const lp = $('#jsie-layers-panel', this.root);
          if (lp) lp.style.display = lp.style.display === 'none' ? '' : 'none';
          break;
        }
        case 'toggleFilters': {
          const tab = $('[data-rpanel="image"]', this.root);
          if (tab) tab.click();
          break;
        }
        case 'toggleStatusBar': {
          const sb = $('.jsie-status-bar', this.root);
          if (sb) sb.style.display = sb.style.display === 'none' ? '' : 'none';
          break;
        }
        case 'showFilter': {
          // Switch to Image tab and focus the filter
          const tab = $('[data-rpanel="image"]', this.root);
          if (tab && !tab.classList.contains('active')) tab.click();
          if (param) {
            const inp = $(`input[data-filter="${param}"]`, this.root);
            if (inp) inp.focus();
          }
          break;
        }
        // Help
        case 'showShortcuts': this._showShortcutsDialog(); break;
        case 'showAbout': this._showAboutDialog(); break;
      }
    }

    _showShortcutsDialog() {
      const isMac = /Mac/.test(navigator.platform);
      const mod = isMac ? '⌘' : 'Ctrl';
      const shortcuts = [
        [t('tool.undo'), `${mod}+Z`],
        [t('tool.redo'), `${mod}+Y`],
        [t('sel.all'), `${mod}+A`],
        [t('sel.deselect'), `${mod}+D`],
        [t('sel.invert'), `${mod}+Shift+I`],
        [t('menu.cut'), `${mod}+X`],
        [t('menu.copy'), `${mod}+C`],
        [t('menu.paste'), `${mod}+V`],
        [t('menu.delete'), 'Del / Backspace'],
        [t('tool.zoomIn'), '+ / Wheel up'],
        [t('tool.zoomOut'), '- / Wheel down'],
        [t('tool.zoomFit'), `${mod}+0`],
      ];
      const rows = shortcuts.map(([label, key]) =>
        `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--jsie-border)">
          <span>${label}</span><span style="color:var(--jsie-text2)">${key}</span>
        </div>`
      ).join('');
      const overlay = document.createElement('div');
      overlay.className = 'jsie-modal-overlay';
      overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:10010;display:flex;align-items:center;justify-content:center';
      overlay.innerHTML = `<div style="background:var(--jsie-bg2);border:1px solid var(--jsie-border);border-radius:8px;padding:20px;min-width:320px;max-width:400px;box-shadow:0 8px 30px rgba(0,0,0,.4)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <strong style="font-size:14px">${t('menu.shortcuts')}</strong>
          <button class="jsie-btn jsie-modal-close" style="width:24px;height:24px">${Icons.cancel}</button>
        </div>
        <div style="font-size:12px">${rows}</div>
      </div>`;
      overlay.addEventListener('click', e => {
        if (e.target === overlay || e.target.closest('.jsie-modal-close')) overlay.remove();
      });
      this.root.appendChild(overlay);
    }

    _showAboutDialog() {
      const overlay = document.createElement('div');
      overlay.className = 'jsie-modal-overlay';
      overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:10010;display:flex;align-items:center;justify-content:center';
      overlay.innerHTML = `<div style="background:var(--jsie-bg2);border:1px solid var(--jsie-border);border-radius:8px;padding:24px;min-width:280px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.4)">
        <div style="font-size:24px;font-weight:700;margin-bottom:4px;color:var(--jsie-accent)">Shou Editor</div>
        <div style="font-size:12px;color:var(--jsie-text2);margin-bottom:12px">Image Editor</div>
        <div style="font-size:11px;color:var(--jsie-text2);margin-bottom:16px">Vanilla JavaScript ES6+ — Zero Dependencies</div>
        <button class="jsie-btn-text jsie-modal-close" style="margin:0 auto">OK</button>
      </div>`;
      overlay.addEventListener('click', e => {
        if (e.target === overlay || e.target.closest('.jsie-modal-close')) overlay.remove();
      });
      this.root.appendChild(overlay);
    }

    // ── Project Save / Open (.shoimg) ────────────────
    saveProject() {
      if (!this.layerManager) return;
      const project = {
        format: 'shoimg',
        version: 1,
        timestamp: Date.now(),
        layerManager: this.layerManager.serializeForProject(),
        filters: { ...this.filters },
        zoom: this.zoom || 1,
        theme: this.config.theme || 'dark',
      };
      const json = JSON.stringify(project);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this._projectName || 'project') + '.shoimg';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 200);
    }

    async openProject(file) {
      const text = await file.text();
      let project;
      try {
        project = JSON.parse(text);
      } catch (e) {
        console.error('Invalid .shoimg file');
        return;
      }
      if (!project.format || project.format !== 'shoimg' || !project.layerManager) {
        console.error('Not a valid .shoimg project file');
        return;
      }

      // Store project name from filename
      this._projectName = file.name.replace(/\.shoimg$/i, '');

      // Restore filters
      if (project.filters) {
        this.filters = { ...this.filters, ...project.filters };
        this._resetFilterSliders();
      }

      // Restore layers
      await this.layerManager.restoreFromProject(project.layerManager);

      // Setup canvas with project dimensions
      this._setupCanvas(this.layerManager.docWidth, this.layerManager.docHeight);

      // Show canvas, hide empty screen
      const wrap = $('#jsie-canvas-wrap', this.root);
      const empty = $('#jsie-empty', this.root);
      if (wrap) wrap.style.display = '';
      if (empty) empty.style.display = 'none';

      this._applyFilters();
      this._redraw();
      this._renderLayersList();
      this._updateLayerOpacityUI();
      this._updateStatusDims();

      // Reset history with new state
      this.history = [];
      this.historyIndex = -1;
      this.pushHistory();
    }

    _triggerOpenProject() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.shoimg';
      input.addEventListener('change', () => {
        if (input.files && input.files[0]) {
          this.openProject(input.files[0]);
        }
      });
      input.click();
    }

    // ── Export Dialog ────────────────────────────
    _showExportDialog() {
      if (!this.layerManager) return;
      const lm = this.layerManager;

      const modal = document.createElement('div');
      modal.className = 'jsie-modal-overlay';
      modal.style.zIndex = '10001';
      const box = document.createElement('div');
      box.style.cssText = 'background:var(--jsie-bg);padding:24px;border-radius:8px;width:380px;max-width:90vw;color:var(--jsie-text)';
      box.innerHTML = `
        <h3 style="margin:0 0 20px;font-size:16px">${t('export.title')}</h3>
        <div style="margin-bottom:14px">
          <label style="display:block;margin-bottom:4px;color:var(--jsie-text2);font-size:12px">${t('export.format')}</label>
          <select id="jsie-exp-fmt" style="width:100%;height:30px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:4px;padding:0 8px;font-size:13px">
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
        <div id="jsie-exp-qrow" style="margin-bottom:14px;display:none">
          <label style="display:block;margin-bottom:4px;color:var(--jsie-text2);font-size:12px">${t('export.quality')}: <span id="jsie-exp-qval">92</span>%</label>
          <input type="range" id="jsie-exp-quality" min="1" max="100" value="92" style="width:100%">
        </div>
        <div style="margin-bottom:20px;padding:12px;background:var(--jsie-bg2);border-radius:4px;font-size:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="color:var(--jsie-text2)">${t('export.dimensions')}</span>
            <span>${lm.docWidth} × ${lm.docHeight}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="color:var(--jsie-text2)">${t('export.fileSize')}</span>
            <span id="jsie-exp-size">…</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="jsie-btn-text secondary" id="jsie-exp-cancel">${t('btn.cancel')}</button>
          <button class="jsie-btn-text" id="jsie-exp-dl">${Icons.download} ${t('export.download')}</button>
        </div>
      `;
      modal.appendChild(box);
      this.root.appendChild(modal);

      const fmt = box.querySelector('#jsie-exp-fmt');
      const qrow = box.querySelector('#jsie-exp-qrow');
      const qinput = box.querySelector('#jsie-exp-quality');
      const qval = box.querySelector('#jsie-exp-qval');
      const sizeSpan = box.querySelector('#jsie-exp-size');

      const updateSize = () => {
        const format = fmt.value;
        const quality = parseInt(qinput.value) / 100;
        qrow.style.display = format === 'png' ? 'none' : 'block';
        sizeSpan.textContent = '…';
        const canvas = this._flatten();
        const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        canvas.toBlob(blob => {
          if (blob) {
            const kb = (blob.size / 1024).toFixed(1);
            const mb = (blob.size / 1048576).toFixed(2);
            sizeSpan.textContent = blob.size > 1048576 ? mb + ' MB' : kb + ' KB';
          }
        }, mime, quality);
      };

      fmt.addEventListener('change', updateSize);
      qinput.addEventListener('input', () => { qval.textContent = qinput.value; updateSize(); });
      box.querySelector('#jsie-exp-cancel').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

      box.querySelector('#jsie-exp-dl').addEventListener('click', () => {
        const format = fmt.value;
        const quality = parseInt(qinput.value) / 100;
        const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        const canvas = this._flatten();
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`;
            a.click();
            URL.revokeObjectURL(url);
            modal.remove();
          }
        }, mime, quality);
      });

      updateSize();
    }

    // ── Layer Styles Dialog ─────────────────────
    _showResizeLayerDialog(layer) {
      if (!layer || layer.type === 'group') return;
      const bounds = this._getLayerContentBounds(layer);
      if (!bounds) return;

      const origW = bounds.width;
      const origH = bounds.height;
      const ratio = origW / origH;

      const modal = document.createElement('div');
      modal.className = 'jsie-modal-overlay';
      modal.style.zIndex = '10001';
      const box = document.createElement('div');
      box.style.cssText = 'background:var(--jsie-bg);padding:20px;border-radius:8px;width:300px;max-width:90vw;color:var(--jsie-text)';
      box.innerHTML = `
        <h3 style="margin:0 0 16px;font-size:15px">${t('layer.resize')}: ${layer.name}</h3>
        <div style="margin-bottom:8px;font-size:11px;color:var(--jsie-text2)">Current: ${origW} × ${origH}px</div>
        <div class="jsie-row" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <label style="font-size:12px;min-width:44px">${t('opt.width')}</label>
          <input type="number" id="jsie-rlw" value="${origW}" min="1" max="9999" style="width:80px;height:28px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 6px;font-size:12px">
        </div>
        <div class="jsie-row" style="display:flex;gap:8px;align-items:center;margin-bottom:10px">
          <label style="font-size:12px;min-width:44px">${t('opt.height')}</label>
          <input type="number" id="jsie-rlh" value="${origH}" min="1" max="9999" style="width:80px;height:28px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 6px;font-size:12px">
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px">
          <input type="checkbox" id="jsie-rl-lock" checked><label for="jsie-rl-lock" style="font-size:12px">${t('opt.lockRatio')}</label>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="jsie-btn-text secondary" id="jsie-rl-cancel">${t('btn.cancel')}</button>
          <button class="jsie-btn-text" id="jsie-rl-apply">${t('btn.apply')}</button>
        </div>
      `;
      modal.appendChild(box);
      this.root.appendChild(modal);

      const wI = box.querySelector('#jsie-rlw');
      const hI = box.querySelector('#jsie-rlh');
      const lock = box.querySelector('#jsie-rl-lock');
      wI.addEventListener('input', () => { if (lock.checked) hI.value = Math.round(parseInt(wI.value) / ratio) || 1; });
      hI.addEventListener('input', () => { if (lock.checked) wI.value = Math.round(parseInt(hI.value) * ratio) || 1; });

      box.querySelector('#jsie-rl-cancel').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

      box.querySelector('#jsie-rl-apply').addEventListener('click', () => {
        const nw = parseInt(wI.value);
        const nh = parseInt(hI.value);
        if (nw > 0 && nh > 0 && (nw !== origW || nh !== origH)) {
          // Extract content, scale it, and place back
          const lm = this.layerManager;
          const temp = document.createElement('canvas');
          temp.width = bounds.width;
          temp.height = bounds.height;
          temp.getContext('2d').drawImage(layer.canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);

          layer.ctx.clearRect(0, 0, layer.width, layer.height);
          // Center the resized content at same center point
          const cx = bounds.x + bounds.width / 2;
          const cy = bounds.y + bounds.height / 2;
          const nx = Math.round(cx - nw / 2);
          const ny = Math.round(cy - nh / 2);
          layer.ctx.drawImage(temp, 0, 0, bounds.width, bounds.height, nx, ny, nw, nh);

          // Update textData position if text layer
          if (layer.type === 'text' && layer.textData) {
            layer.textData.x = nx;
            layer.textData.y = ny;
          }

          this.pushHistory();
          this._redraw();
          this._renderLayersList();
        }
        modal.remove();
      });
    }

    _showLayerStylesDialog() {
      if (!this.layerManager || !this.layerManager.activeLayer) return;
      const layer = this.layerManager.activeLayer;
      if (layer.type === 'group') return;

      // Ensure new effect keys exist for layers created before these effects were added
      if (!layer.effects.border) layer.effects.border = { enabled: false, size: 2, color: '#000000', style: 'solid', radius: 0, opacity: 1 };
      if (!layer.effects.gradientOverlay) layer.effects.gradientOverlay = { enabled: false, color1: '#000000', color2: '#ffffff', type: 'linear', angle: 0, opacity: 0.75 };

      const originalEffects = JSON.parse(JSON.stringify(layer.effects));
      const work = layer.effects;
      let selectedFx = 'dropShadow';

      const modal = document.createElement('div');
      modal.className = 'jsie-modal-overlay';
      modal.style.zIndex = '10001';

      const box = document.createElement('div');
      box.style.cssText = 'background:var(--jsie-bg);border-radius:8px;width:560px;max-width:92vw;height:460px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;color:var(--jsie-text)';

      const header = document.createElement('div');
      header.style.cssText = 'padding:14px 18px;border-bottom:1px solid var(--jsie-border);font-size:15px;font-weight:600';
      header.textContent = t('layer.styles') + ': ' + layer.name;

      const body = document.createElement('div');
      body.style.cssText = 'flex:1;display:flex;overflow:hidden';

      const effectDefs = [
        { key: 'dropShadow', label: t('effect.dropShadow') },
        { key: 'innerShadow', label: t('effect.innerShadow') },
        { key: 'outerGlow', label: t('effect.outerGlow') },
        { key: 'stroke', label: t('effect.stroke') },
        { key: 'colorOverlay', label: t('effect.colorOverlay') },
        { key: 'border', label: t('effect.border') },
        { key: 'gradientOverlay', label: t('effect.gradientOverlay') }
      ];

      // Left panel
      const left = document.createElement('div');
      left.style.cssText = 'width:170px;border-right:1px solid var(--jsie-border);overflow-y:auto;background:var(--jsie-bg2)';
      left.innerHTML = effectDefs.map(e =>
        `<div class="jsie-fx-item" data-fx="${e.key}" style="padding:8px 12px;cursor:pointer;display:flex;align-items:center;gap:6px;border-bottom:1px solid var(--jsie-border);font-size:12px">
          <input type="checkbox" ${work[e.key].enabled ? 'checked' : ''} style="margin:0;cursor:pointer">
          <span style="flex:1">${e.label}</span>
        </div>`
      ).join('');

      // Right panel
      const right = document.createElement('div');
      right.style.cssText = 'flex:1;overflow-y:auto;padding:16px';

      const makeSlider = (label, prop, val, min, max, step) =>
        `<div style="margin-bottom:10px">
          <label style="display:block;margin-bottom:3px;color:var(--jsie-text2);font-size:11px">${label}: <span data-vl="${prop}">${prop === 'opacity' ? Math.round(val * 100) : val}</span>${prop === 'opacity' ? '%' : 'px'}</label>
          <input type="range" data-pr="${prop}" min="${min}" max="${max}" step="${step || 1}" value="${prop === 'opacity' ? val * 100 : val}" style="width:100%">
        </div>`;
      const makeColor = (label, prop, val) =>
        `<div style="margin-bottom:10px">
          <label style="display:block;margin-bottom:3px;color:var(--jsie-text2);font-size:11px">${label}</label>
          <input type="color" data-pr="${prop}" value="${val}" style="width:100%;height:30px;border:1px solid var(--jsie-border);border-radius:3px;cursor:pointer">
        </div>`;
      const makeSelect = (label, prop, options, val) =>
        `<div style="margin-bottom:10px">
          <label style="display:block;margin-bottom:3px;color:var(--jsie-text2);font-size:11px">${label}</label>
          <select data-pr="${prop}" style="width:100%;height:28px;background:var(--jsie-input-bg);border:1px solid var(--jsie-border);color:var(--jsie-text);border-radius:3px;padding:0 6px;font-size:12px">
            ${options.map(o => `<option value="${o.v}"${o.v === val ? ' selected' : ''}>${o.l}</option>`).join('')}
          </select>
        </div>`;

      const renderProps = (fxKey) => {
        selectedFx = fxKey;
        const fx = work[fxKey];
        $$('.jsie-fx-item', left).forEach(it => it.style.background = it.dataset.fx === fxKey ? 'var(--jsie-layer-active)' : '');
        let html = `<h4 style="margin:0 0 14px;font-size:13px;font-weight:600">${effectDefs.find(e => e.key === fxKey).label}</h4>`;
        if (fxKey === 'dropShadow' || fxKey === 'innerShadow') {
          html += makeColor(t('effect.color'), 'color', fx.color);
          html += makeSlider(t('effect.opacity'), 'opacity', fx.opacity, 0, 100, 1);
          html += makeSlider(t('effect.offsetX'), 'offsetX', fx.offsetX, -50, 50, 1);
          html += makeSlider(t('effect.offsetY'), 'offsetY', fx.offsetY, -50, 50, 1);
          html += makeSlider(t('effect.blur'), 'blur', fx.blur, 0, 50, 1);
        } else if (fxKey === 'outerGlow') {
          html += makeColor(t('effect.color'), 'color', fx.color);
          html += makeSlider(t('effect.opacity'), 'opacity', fx.opacity, 0, 100, 1);
          html += makeSlider(t('effect.blur'), 'blur', fx.blur, 0, 50, 1);
        } else if (fxKey === 'stroke') {
          html += makeColor(t('effect.color'), 'color', fx.color);
          html += makeSlider(t('effect.size'), 'size', fx.size, 1, 20, 1);
          html += makeSelect(t('effect.position'), 'position', [
            { v: 'outside', l: 'Outside' }, { v: 'center', l: 'Center' }, { v: 'inside', l: 'Inside' }
          ], fx.position);
        } else if (fxKey === 'colorOverlay') {
          html += makeColor(t('effect.color'), 'color', fx.color);
          html += makeSlider(t('effect.opacity'), 'opacity', fx.opacity, 0, 100, 1);
          html += makeSelect(t('effect.blendMode'), 'blendMode', [
            { v: 'normal', l: 'Normal' }, { v: 'multiply', l: 'Multiply' },
            { v: 'screen', l: 'Screen' }, { v: 'overlay', l: 'Overlay' }
          ], fx.blendMode);
        } else if (fxKey === 'border') {
          html += makeColor(t('effect.color'), 'color', fx.color);
          html += makeSlider(t('effect.size'), 'size', fx.size, 1, 30, 1);
          html += makeSlider(t('effect.opacity'), 'opacity', fx.opacity, 0, 100, 1);
          html += makeSlider(t('effect.borderRadius'), 'radius', fx.radius, 0, 100, 1);
          html += makeSelect(t('effect.borderStyle'), 'style', [
            { v: 'solid', l: t('effect.solid') }, { v: 'dashed', l: t('effect.dashed') }, { v: 'dotted', l: t('effect.dotted') }
          ], fx.style);
        } else if (fxKey === 'gradientOverlay') {
          html += makeColor(t('effect.color1'), 'color1', fx.color1);
          html += makeColor(t('effect.color2'), 'color2', fx.color2);
          html += makeSlider(t('effect.opacity'), 'opacity', fx.opacity, 0, 100, 1);
          html += makeSlider(t('effect.gradientAngle'), 'angle', fx.angle, 0, 360, 1);
          html += makeSelect(t('effect.gradientType'), 'type', [
            { v: 'linear', l: t('effect.linear') }, { v: 'radial', l: t('effect.radial') }
          ], fx.type);
        }
        right.innerHTML = html;
        // Bind
        $$('[data-pr]', right).forEach(inp => {
          inp.addEventListener('input', () => {
            const prop = inp.dataset.pr;
            let val = inp.value;
            if (prop === 'opacity') val = parseFloat(val) / 100;
            else if (['offsetX', 'offsetY', 'blur', 'size', 'radius', 'angle'].includes(prop)) val = parseFloat(val);
            work[fxKey][prop] = val;
            const vlSpan = right.querySelector(`[data-vl="${prop}"]`);
            if (vlSpan) vlSpan.textContent = prop === 'opacity' ? Math.round(val * 100) : val;
            this._redraw();
          });
          inp.addEventListener('change', () => this._redraw());
        });
      };

      // Left panel clicks
      left.addEventListener('click', e => {
        const item = e.target.closest('.jsie-fx-item');
        if (!item) return;
        if (e.target.type === 'checkbox') {
          work[item.dataset.fx].enabled = e.target.checked;
          this._redraw();
        } else {
          renderProps(item.dataset.fx);
        }
      });

      body.appendChild(left);
      body.appendChild(right);

      const footer = document.createElement('div');
      footer.style.cssText = 'padding:10px 18px;border-top:1px solid var(--jsie-border);display:flex;gap:8px;justify-content:flex-end';
      footer.innerHTML = `<button class="jsie-btn-text secondary" id="jsie-ls-cancel">${t('btn.cancel')}</button><button class="jsie-btn-text" id="jsie-ls-ok">OK</button>`;

      box.appendChild(header);
      box.appendChild(body);
      box.appendChild(footer);
      modal.appendChild(box);
      this.root.appendChild(modal);

      renderProps('dropShadow');

      footer.querySelector('#jsie-ls-cancel').addEventListener('click', () => {
        layer.effects = originalEffects;
        this._redraw();
        modal.remove();
      });
      footer.querySelector('#jsie-ls-ok').addEventListener('click', () => {
        this.pushHistory();
        modal.remove();
      });
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          layer.effects = originalEffects;
          this._redraw();
          modal.remove();
        }
      });
    }

    _onSave() {
      const base64 = this.getImage();
      if (this.config.onSave) {
        this.config.onSave(base64);
      }
    }

    _onCancel() {
      if (this.config.onCancel) {
        this.config.onCancel();
      }
    }

    destroy() {
      if (this._keyHandler) {
        document.removeEventListener('keydown', this._keyHandler);
        this._keyHandler = null;
      }
      if (this._closeGroupSubmenu) {
        document.removeEventListener('click', this._closeGroupSubmenu);
        this._closeGroupSubmenu = null;
      }
      if (this._closeMenuOnOutside) {
        document.removeEventListener('mousedown', this._closeMenuOnOutside);
        this._closeMenuOnOutside = null;
      }
      this._stopMarchingAnts();
      if (this.root && this.root.parentNode) {
        this.root.remove();
      }
      this.layerManager = null;
      this.history = [];
      this._clipboard = null;
    }
  }

  // ── Public API ──────────────────────────────────
  const JSImageEditor = {
    version: '3.0.0',
    ImageEditor,

    // Pre-load config from JSON before creating editors
    async loadConfig(url = 'js/image-editor-config.json') {
      return ImageEditor.loadConfig(url);
    },

    init(containerOrConfig, config) {
      return new ImageEditor(containerOrConfig, config);
    },

    open(src, config = {}) {
      const modal = document.createElement('div');
      modal.className = 'jsie-modal-overlay';
      const content = document.createElement('div');
      content.className = 'jsie-modal-content';
      modal.appendChild(content);
      document.body.appendChild(modal);

      const originalOnSave = config.onSave;
      const originalOnCancel = config.onCancel;

      const editor = new ImageEditor(content, {
        ...config,
        onSave: (base64) => {
          modal.remove();
          if (originalOnSave) originalOnSave(base64);
        },
        onCancel: () => {
          modal.remove();
          if (originalOnCancel) originalOnCancel();
        }
      });

      if (src) editor.loadImage(src);
      return editor;
    }
  };

  // Module export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSImageEditor;
  } else {
    global.JSImageEditor = JSImageEditor;
  }
})(window);
