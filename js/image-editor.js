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
      'layer.add': 'New layer',
      'layer.delete': 'Delete layer',
      'layer.duplicate': 'Duplicate layer',
      'layer.background': 'Background',
      'layer.group': 'New group',
      'opt.blendMode': 'Blend',
      'tool.move': 'Move',
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
      'sel.all': 'Select all',
      'sel.deselect': 'Deselect',
      'sel.invert': 'Invert',
      'sel.cropToSel': 'Crop to selection',
      'sel.delete': 'Delete',
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
      'layer.add': 'Nueva capa',
      'layer.delete': 'Eliminar capa',
      'layer.duplicate': 'Duplicar capa',
      'layer.background': 'Fondo',
      'layer.group': 'Nuevo grupo',
      'opt.blendMode': 'Mezcla',
      'tool.move': 'Mover',
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
      'sel.all': 'Seleccionar todo',
      'sel.deselect': 'Deseleccionar',
      'sel.invert': 'Invertir',
      'sel.cropToSel': 'Recortar a selección',
      'sel.delete': 'Eliminar',
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
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = td.color || '#000000';
      this.ctx.font = `${td.fontSize || 24}px ${td.fontFamily || 'Arial'}`;
      this.ctx.textBaseline = 'top';
      this.ctx.textAlign = td.align || 'left';
      const lineHeight = (td.fontSize || 24) * (td.lineHeight || 1.2);
      const lines = (td.text || '').split('\n');
      let xBase = td.x || 0;
      if (td.align === 'center') xBase = this.width / 2;
      else if (td.align === 'right') xBase = this.width;
      lines.forEach((line, i) => {
        this.ctx.fillText(line, xBase, (td.y || 0) + i * lineHeight);
      });
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

    _compositeLayer(layer, targetCtx) {
      if (!layer.visible || layer.opacity === 0) return;
      if (layer.type === 'group') {
        this._compositeGroup(layer, targetCtx);
      } else {
        targetCtx.globalAlpha = layer.opacity;
        targetCtx.globalCompositeOperation = this._getBlendOp(layer.blendMode);
        targetCtx.drawImage(layer.canvas, 0, 0);
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
  }

  // ── CSS ───────────────────────────────────────────
  function getImageEditorCSS() {
    return `
/* Base */
.jsie-editor{display:flex;flex-direction:column;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;overflow:hidden;user-select:none;background:var(--jsie-bg);color:var(--jsie-text)}

/* Theme vars */
.jsie-editor.theme-dark{--jsie-bg:#1e1e1e;--jsie-bg2:#252526;--jsie-bg3:#2d2d2d;--jsie-text:#d4d4d4;--jsie-text2:#858585;--jsie-border:#3c3c3c;--jsie-accent:#007acc;--jsie-hover:#2a2d2e;--jsie-btn:#3c3c3c;--jsie-btn-hover:#4c4c4c;--jsie-input-bg:#3c3c3c;--jsie-slider-track:#555;--jsie-slider-thumb:#007acc;--jsie-layer-active:#094771}
.jsie-editor.theme-light{--jsie-bg:#ffffff;--jsie-bg2:#f3f3f3;--jsie-bg3:#e8e8e8;--jsie-text:#1e1e1e;--jsie-text2:#666;--jsie-border:#e0e0e0;--jsie-accent:#007acc;--jsie-hover:#e8e8e8;--jsie-btn:#e0e0e0;--jsie-btn-hover:#d0d0d0;--jsie-input-bg:#fff;--jsie-slider-track:#ccc;--jsie-slider-thumb:#007acc;--jsie-layer-active:#c8e1ff}

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
.jsie-canvas-area{flex:1;display:flex;align-items:center;justify-content:center;overflow:auto;background:var(--jsie-bg3);position:relative}
.jsie-canvas-wrap{position:relative;display:inline-block;box-shadow:0 2px 12px rgba(0,0,0,0.3)}
.jsie-canvas-wrap canvas{display:block}
.jsie-canvas-wrap .jsie-interaction-canvas{position:absolute;top:0;left:0;z-index:5}

/* Right layers panel */
.jsie-layers-panel{width:220px;background:var(--jsie-bg2);border-left:1px solid var(--jsie-border);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}
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

    // Transform tool buttons (some are actions, some are tools)
    const actionTools = ['resize', 'rotateLeft', 'rotateRight', 'flipH', 'flipV'];
    const transBtns = transformTools.map(tool => {
      const attr = actionTools.includes(tool) ? `data-action="${tool}"` : `data-tool="${tool}"`;
      return `<button class="jsie-tool-btn" ${attr} title="${t('tool.' + tool)}">${Icons[tool] || ''}</button>`;
    }).join('');

    // Filter items
    const filterItems = filterList.map(f => {
      const d = filterDefaults[f] || { min: 0, max: 100, value: 0 };
      return `<div class="jsie-filter-item"><span>${t('filter.' + f)}</span><input type="range" data-filter="${f}" min="${d.min}" max="${d.max}" value="${d.value}"><span class="jsie-filter-val">${d.value}</span></div>`;
    }).join('');

    return `
<div class="jsie-options-bar">
  <div class="jsie-options-left">
    <button class="jsie-btn" data-action="undo" title="${t('tool.undo')}">${Icons.undo}</button>
    <button class="jsie-btn" data-action="redo" title="${t('tool.redo')}">${Icons.redo}</button>
    <div class="jsie-sep"></div>
    <div class="jsie-tool-options" id="jsie-tool-options"></div>
  </div>
  <div class="jsie-options-right">
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
  </div>

  <div class="jsie-canvas-area" id="jsie-canvas-area">
    <div class="jsie-canvas-wrap" id="jsie-canvas-wrap" style="display:none">
      <canvas id="jsie-main-canvas"></canvas>
    </div>
    <div class="jsie-empty" id="jsie-empty">
      ${Icons.upload}
      <span>${t('empty.loadImage')}</span>
      <input type="file" accept="image/*" id="jsie-file-input" style="display:none">
    </div>
  </div>

  ${showLayers ? `
  <div class="jsie-layers-panel" id="jsie-layers-panel">
    <div class="jsie-layers-header">${t('panel.layers')}</div>
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
    </div>
  </div>` : ''}
</div>

${showFilters ? `<div class="jsie-filters">${filterItems}</div>` : ''}
${showStatusBar ? `<div class="jsie-status-bar"><span id="jsie-status-dims"></span><span id="jsie-status-cursor"></span><span id="jsie-status-tool"></span></div>` : ''}`;
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
          drawing: ['move', { group: 'select', tools: ['selectRect', 'selectEllipse', 'selectPoly', 'selectFree'] }, 'pencil', 'eraser', 'eyedropper', 'fill', 'gradient', 'rect', 'circle', 'line', 'arrow', 'text'],
          transform: ['crop', 'resize', 'rotateLeft', 'rotateRight', 'flipH', 'flipV'],
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

      // Interaction canvas for mouse events (transparent overlay)
      this.interactionCanvas = document.createElement('canvas');
      this.interactionCanvas.className = 'jsie-interaction-canvas';
      this.interactionCanvas.style.cursor = 'default';
    }

    bindEvents() {
      const r = this.root;

      // Actions (undo, redo, transforms, save, cancel, reset)
      on(r, 'click', '[data-action]', (e, btn) => {
        const action = btn.dataset.action;
        if (action === 'undo') this.undo();
        else if (action === 'redo') this.redo();
        else if (action === 'rotateLeft') this.rotate(-90);
        else if (action === 'rotateRight') this.rotate(90);
        else if (action === 'flipH') this.flip('horizontal');
        else if (action === 'flipV') this.flip('vertical');
        else if (action === 'resize') this.showResizePanel();
        else if (action === 'reset') this.reset();
        else if (action === 'cancel') this._onCancel();
        else if (action === 'save') this._onSave();
      });

      // Tool selection (ignore clicks on group arrow)
      on(r, 'click', '.jsie-tool-btn[data-tool]', (e, btn) => {
        if (e.target.closest('.jsie-group-arrow')) return;
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

      // Close submenu on click outside
      this._closeGroupSubmenu = (e) => {
        if (!e.target.closest('.jsie-group-submenu') && !e.target.closest('.jsie-group-arrow')) {
          $$('.jsie-group-submenu', this.root).forEach(m => m.remove());
        }
      };
      document.addEventListener('click', this._closeGroupSubmenu);

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
        if (this.fileInput.files[0]) this.loadImage(this.fileInput.files[0]);
      });

      // Drag and drop image
      on(this.canvasArea, 'dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
      on(this.canvasArea, 'drop', e => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) this.loadImage(file);
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
        if (!this.currentTool || !this.layerManager) return;
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
          this._placeText(pos);
          this.drawing = false;
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

      // Double-click closes polygon selection
      ic.addEventListener('dblclick', e => {
        if (this.currentTool === 'selectPoly' && this._selectionPoints.length > 2) {
          this._finalizePolySelection();
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

      // Fit to container
      const area = this.canvasArea.getBoundingClientRect();
      const maxW = area.width - 40;
      const maxH = area.height - 40;
      const scale = Math.min(1, maxW / w, maxH / h);
      const cssW = Math.round(w * scale);
      const cssH = Math.round(h * scale);
      this.mainCanvas.style.width = cssW + 'px';
      this.mainCanvas.style.height = cssH + 'px';
      this.interactionCanvas.style.width = cssW + 'px';
      this.interactionCanvas.style.height = cssH + 'px';

      // Ensure interaction canvas is in the DOM
      if (!this.interactionCanvas.parentNode) {
        this.canvasWrap.appendChild(this.interactionCanvas);
      }
    }

    // ── Rendering ─────────────────────────────────
    _redraw() {
      if (!this.layerManager) return;
      this.layerManager.composite(this.mainCtx);
      this._applyFilters();
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
      const selTools = ['selectRect', 'selectEllipse', 'selectPoly', 'selectFree'];
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
      const cursors = { move: 'move', eyedropper: 'crosshair', fill: 'crosshair', gradient: 'crosshair', pencil: 'crosshair', eraser: 'crosshair', text: 'text', crop: 'default', selectRect: 'crosshair', selectEllipse: 'crosshair', selectPoly: 'crosshair', selectFree: 'crosshair' };
      this.interactionCanvas.style.cursor = tool ? (cursors[tool] || 'crosshair') : 'default';
      // Status
      this._updateStatusTool();
    }

    _getGroupTools(groupName) {
      const drawing = this.config.tools.drawing;
      for (const item of drawing) {
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
      // Create submenu
      const submenu = document.createElement('div');
      submenu.className = 'jsie-group-submenu';
      submenu.innerHTML = tools.map(toolId => {
        const isActive = this.currentTool === toolId;
        return `<button class="jsie-tool-btn${isActive ? ' active' : ''}" data-subtool="${toolId}" title="${t('tool.' + toolId)}">${Icons[toolId] || ''}</button>`;
      }).join('');
      groupDiv.appendChild(submenu);
      // Bind submenu clicks
      submenu.addEventListener('click', (e) => {
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
        html += `<label>${t('opt.color')}</label><input type="color" id="jsie-opt-color" value="${this.drawColor}">`;
        html += `<label>${t('opt.size')}</label><input type="range" id="jsie-opt-size" min="1" max="50" value="${this.strokeSize}">`;
        if (['rect', 'circle'].includes(tool)) {
          html += `<div class="jsie-opt-check"><input type="checkbox" id="jsie-opt-fill" ${this.fillEnabled ? 'checked' : ''}><label for="jsie-opt-fill">${t('opt.fill')}</label></div>`;
          html += `<input type="color" id="jsie-opt-fill-color" value="${this.fillColor}">`;
        }
      } else if (tool === 'text') {
        html += `<label>${t('opt.color')}</label><input type="color" id="jsie-opt-color" value="${this.drawColor}">`;
        html += `<label>${t('opt.font')}</label><select id="jsie-opt-font"><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Courier New">Courier New</option><option value="Times New Roman">Times New Roman</option><option value="Verdana">Verdana</option></select>`;
        html += `<label>${t('opt.fontSize')}</label><input type="number" id="jsie-opt-fontsize" value="${this.fontSize}" min="8" max="200">`;
      } else if (tool === 'fill') {
        html += `<label>${t('opt.color')}</label><input type="color" id="jsie-opt-color" value="${this.drawColor}">`;
        html += `<label>${t('opt.tolerance')}</label><input type="range" id="jsie-opt-tolerance" min="0" max="100" value="${this.fillTolerance}">`;
      } else if (tool === 'gradient') {
        html += `<label>${t('opt.color1')}</label><input type="color" id="jsie-opt-grad1" value="${this.gradientColor1}">`;
        html += `<label>${t('opt.color2')}</label><input type="color" id="jsie-opt-grad2" value="${this.gradientColor2}">`;
      } else if (tool === 'eyedropper') {
        html += `<label>${t('opt.color')}</label><input type="color" id="jsie-opt-color" value="${this.drawColor}" disabled>`;
      } else if (['selectRect', 'selectEllipse', 'selectPoly', 'selectFree'].includes(tool)) {
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

      if (optColor) on(optColor, 'input', () => { this.drawColor = optColor.value; });
      if (optSize) on(optSize, 'input', () => { this.strokeSize = parseInt(optSize.value); });
      if (optFill) on(optFill, 'change', () => { this.fillEnabled = optFill.checked; });
      if (optFillColor) on(optFillColor, 'input', () => { this.fillColor = optFillColor.value; });
      if (optFont) {
        optFont.value = this.fontFamily;
        on(optFont, 'change', () => { this.fontFamily = optFont.value; });
      }
      if (optFontSize) on(optFontSize, 'input', () => { this.fontSize = parseInt(optFontSize.value); });
      if (optTolerance) on(optTolerance, 'input', () => { this.fillTolerance = parseInt(optTolerance.value); });
      if (optGrad1) on(optGrad1, 'input', () => { this.gradientColor1 = optGrad1.value; });
      if (optGrad2) on(optGrad2, 'input', () => { this.gradientColor2 = optGrad2.value; });

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
      }
      this._selectionPath = path;
    }

    _clearSelection() {
      this.selection = null;
      this._selectionPath = null;
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
      }
    }

    _drawMarchingAnts() {
      if (!this._selectionPath || !this.interactionCanvas) return;
      const ic = this.interactionCanvas;
      const ictx = ic.getContext('2d');
      ictx.clearRect(0, 0, ic.width, ic.height);
      ictx.save();
      ictx.strokeStyle = '#ffffff';
      ictx.lineWidth = 1;
      ictx.setLineDash([4, 4]);
      ictx.lineDashOffset = -this._selectionAntsOffset;
      ictx.stroke(this._selectionPath);
      ictx.strokeStyle = '#000000';
      ictx.lineDashOffset = -(this._selectionAntsOffset + 4);
      ictx.stroke(this._selectionPath);
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
      // Update color input if visible
      const optColor = $('#jsie-opt-color', this.root);
      if (optColor) optColor.value = hex;
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
    _placeText(pos) {
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
      ta.rows = 1;
      ta.cols = 20;
      overlay.appendChild(ta);
      this.canvasWrap.appendChild(overlay);

      ta.focus();
      ta.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const text = ta.value;
          if (text && this.layerManager) {
            this._createTextLayer(text, pos);
          }
          overlay.remove();
        } else if (e.key === 'Escape') {
          overlay.remove();
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
        align: 'left',
        lineHeight: 1.2
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

    _editTextLayer(layer) {
      if (layer.type !== 'text' || !layer.textData) return;
      const td = layer.textData;

      const existing = $('.jsie-text-input-overlay', this.canvasWrap);
      if (existing) existing.remove();

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
      ta.value = td.text;
      ta.rows = 2;
      ta.cols = 20;
      overlay.appendChild(ta);
      this.canvasWrap.appendChild(overlay);

      ta.focus();
      ta.select();
      ta.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const text = ta.value;
          if (text) {
            td.text = text;
            td.color = this.drawColor;
            td.fontSize = this.fontSize;
            td.fontFamily = this.fontFamily;
            layer.name = 'T: ' + text.substring(0, 15);
            layer._renderText();
            this.pushHistory();
            this._redraw();
            this._renderLayersList();
          }
          overlay.remove();
        } else if (e.key === 'Escape') {
          overlay.remove();
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
