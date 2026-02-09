/**
 * Shou Editor - Editor Visual Plugin
 * Plugin universal para crear un editor visual estilo GrapesJS
 *
 * USO:
 *   ShouEditor.init('#mi-contenedor', { theme: 'dark' });
 *   ShouEditor.init({ theme: 'light' }); // usa document.body
 *
 * CONFIGURACIÓN:
 *   - container: selector o elemento DOM donde montar el editor
 *   - theme: 'dark' | 'light' (default: 'dark')
 *   - width: ancho del editor (default: '100%')
 *   - height: alto del editor (default: '100vh')
 *   - defaultView: 'visual' | 'code' (default: 'visual')
 *   - defaultDevice: 'desktop' | 'tablet' | 'mobile' (default: 'desktop')
 *   - storagePrefix: prefijo para localStorage (default: 'shou-editor-')
 *   - bootstrapCss: URL del CSS de Bootstrap (default: CDN)
 */

(function(global) {
  'use strict';

  // ============================================
  // UTILIDADES
  // ============================================

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

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function getCaretPos(ta) {
    return { start: ta.selectionStart, end: ta.selectionEnd };
  }

  function setCaretPos(ta, s, e = s) {
    ta.focus();
    ta.setSelectionRange(s, e);
  }

  // ============================================
  // i18n — TRADUCCIONES
  // ============================================

  let currentLang = 'en';

  const Lang = {
    en: {
      'btn.new': 'New', 'btn.open': 'Open', 'btn.save': 'Save',
      'btn.export': 'Export', 'btn.theme': 'Theme', 'btn.fullscreen': 'Fullscreen',
      'btn.toggleOutlines': 'Show container outlines',
      'view.code': 'Code',
      'panel.blocks': 'Blocks', 'panel.layers': 'Layers',
      'panel.styles': 'Styles', 'panel.settings': 'Settings',
      'empty.dragElements': 'Drag elements',
      'empty.selectElement': 'Select an element',
      'styles.dimensions': 'Dimensions', 'styles.spacing': 'Spacing',
      'styles.typography': 'Typography', 'styles.background': 'Background',
      'styles.borders': 'Borders', 'styles.layout': 'Layout',
      'styles.flexbox': 'Flexbox', 'styles.grid': 'Grid',
      'styles.transform': 'Transform & Effects',
      'toolbar.drag': 'Drag to move', 'toolbar.duplicate': 'Duplicate',
      'toolbar.delete': 'Delete',
      'toolbar.editImage': 'Edit image',
      'toolbar.moveUp': 'Move up', 'toolbar.moveDown': 'Move down',
      'toolbar.moveOut': 'Move to parent', 'toolbar.moveInto': 'Move into container',
      'confirm.newProject': 'Create new project?',
      'options.add': '+ Option',
      'options.valuePlaceholder': 'value', 'options.textPlaceholder': 'text',
      'setting.label': 'Label', 'setting.name': 'Name', 'setting.type': 'Type',
      'setting.placeholder': 'Placeholder', 'setting.value': 'Value',
      'setting.required': 'Required', 'setting.readonly': 'Readonly',
      'setting.disabled': 'Disabled', 'setting.classes': 'Classes',
      'setting.id': 'ID', 'setting.options': 'Options',
      'setting.checked': 'Checked', 'setting.text': 'Text',
      'setting.multiple': 'Multiple', 'setting.accept': 'Accept',
      'setting.min': 'Min', 'setting.max': 'Max', 'setting.step': 'Step',
      'setting.rows': 'Rows', 'setting.title': 'Title',
      'setting.subtitle': 'Subtitle', 'setting.content': 'Content',
      'setting.buttonText': 'Button text', 'setting.buttonUrl': 'Button URL',
      'setting.variant': 'Variant', 'setting.brand': 'Brand',
      'setting.links': 'Links', 'setting.level': 'Level',
      'setting.width': 'Width', 'setting.height': 'Height',
      'setting.src': 'Source', 'setting.alt': 'Alt text',
      'setting.url': 'URL', 'setting.target': 'Target',
      'setting.action': 'Action', 'setting.method': 'Method',
      'setting.footerText': 'Footer text',
      'setting.slides': 'Slides', 'setting.addSlide': '+ Add slide',
      'setting.slideUrl': 'Image URL', 'setting.slideAlt': 'Alt text',
      'setting.tabs': 'Tabs', 'setting.addTab': '+ Add tab',
      'setting.tabTitle': 'Tab title', 'setting.tabContent': 'Content',
      'setting.modalSize': 'Size', 'setting.modalCentered': 'Vertically centered',
      'setting.modalScrollable': 'Scrollable', 'setting.modalStaticBackdrop': 'Static backdrop',
      'setting.closeButton': 'Close button', 'setting.saveButton': 'Save button',
      'setting.showCloseBtn': 'Show close', 'setting.showSaveBtn': 'Show save',
      'setting.accordion': 'Sections', 'setting.addSection': '+ Add section',
      'setting.sectionTitle': 'Section title',
      'setting.listItems': 'Items', 'setting.addItem': '+ Add item',
      'setting.itemText': 'Text',
      'setting.breadcrumbLinks': 'Links', 'setting.addLink': '+ Add link',
      'setting.linkText': 'Text', 'setting.linkUrl': 'URL',
    },
    es: {
      'btn.new': 'Nuevo', 'btn.open': 'Abrir', 'btn.save': 'Guardar',
      'btn.export': 'Exportar', 'btn.theme': 'Tema', 'btn.fullscreen': 'Pantalla completa',
      'btn.toggleOutlines': 'Mostrar contornos de contenedores',
      'view.code': 'Código',
      'panel.blocks': 'Bloques', 'panel.layers': 'Capas',
      'panel.styles': 'Estilos', 'panel.settings': 'Ajustes',
      'empty.dragElements': 'Arrastra elementos',
      'empty.selectElement': 'Selecciona un elemento',
      'styles.dimensions': 'Dimensiones', 'styles.spacing': 'Espaciado',
      'styles.typography': 'Tipografía', 'styles.background': 'Fondo',
      'styles.borders': 'Bordes', 'styles.layout': 'Diseño',
      'styles.flexbox': 'Flexbox', 'styles.grid': 'Grid',
      'styles.transform': 'Transformaciones y Efectos',
      'toolbar.drag': 'Arrastrar para mover', 'toolbar.duplicate': 'Duplicar',
      'toolbar.delete': 'Eliminar',
      'toolbar.editImage': 'Editar imagen',
      'toolbar.moveUp': 'Mover arriba', 'toolbar.moveDown': 'Mover abajo',
      'toolbar.moveOut': 'Sacar del contenedor', 'toolbar.moveInto': 'Meter en contenedor',
      'confirm.newProject': '¿Crear nuevo proyecto?',
      'options.add': '+ Opción',
      'options.valuePlaceholder': 'valor', 'options.textPlaceholder': 'texto',
      'setting.label': 'Etiqueta', 'setting.name': 'Nombre', 'setting.type': 'Tipo',
      'setting.placeholder': 'Placeholder', 'setting.value': 'Valor',
      'setting.required': 'Requerido', 'setting.readonly': 'Readonly',
      'setting.disabled': 'Deshabilitado', 'setting.classes': 'Clases',
      'setting.id': 'ID', 'setting.options': 'Opciones',
      'setting.checked': 'Checked', 'setting.text': 'Texto',
      'setting.multiple': 'Múltiple', 'setting.accept': 'Aceptar',
      'setting.min': 'Mín', 'setting.max': 'Máx', 'setting.step': 'Paso',
      'setting.rows': 'Filas', 'setting.title': 'Título',
      'setting.subtitle': 'Subtítulo', 'setting.content': 'Contenido',
      'setting.buttonText': 'Botón texto', 'setting.buttonUrl': 'Botón URL',
      'setting.variant': 'Variante', 'setting.brand': 'Marca',
      'setting.links': 'Enlaces', 'setting.level': 'Nivel',
      'setting.width': 'Ancho', 'setting.height': 'Alto',
      'setting.src': 'Fuente', 'setting.alt': 'Texto alt',
      'setting.url': 'URL', 'setting.target': 'Target',
      'setting.action': 'Acción', 'setting.method': 'Método',
      'setting.footerText': 'Texto pie',
      'setting.slides': 'Slides', 'setting.addSlide': '+ Añadir slide',
      'setting.slideUrl': 'URL imagen', 'setting.slideAlt': 'Texto alt',
      'setting.tabs': 'Pestañas', 'setting.addTab': '+ Añadir pestaña',
      'setting.tabTitle': 'Título', 'setting.tabContent': 'Contenido',
      'setting.modalSize': 'Tamaño', 'setting.modalCentered': 'Centrado vertical',
      'setting.modalScrollable': 'Scrollable', 'setting.modalStaticBackdrop': 'Fondo estático',
      'setting.closeButton': 'Botón cerrar', 'setting.saveButton': 'Botón guardar',
      'setting.showCloseBtn': 'Mostrar cerrar', 'setting.showSaveBtn': 'Mostrar guardar',
      'setting.accordion': 'Secciones', 'setting.addSection': '+ Añadir sección',
      'setting.sectionTitle': 'Título sección',
      'setting.listItems': 'Elementos', 'setting.addItem': '+ Añadir elemento',
      'setting.itemText': 'Texto',
      'setting.breadcrumbLinks': 'Enlaces', 'setting.addLink': '+ Añadir enlace',
      'setting.linkText': 'Texto', 'setting.linkUrl': 'URL',
    }
  };

  function t(key) {
    return (Lang[currentLang] && Lang[currentLang][key]) || Lang.en[key] || key;
  }

  // ============================================
  // ICONOS SVG (flat, monocromo, currentColor)
  // ============================================

  const svg = (d, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${d}</svg>`;

  const Icons = {
    // Toolbar
    fileNew:    svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6zm5-5v-2h2v2h2v2h-2v2h-2v-2H9v-2h2z"/>'),
    folderOpen: svg('<path d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm0 12H4V8h16v10z"/>'),
    save:       svg('<path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H7V5h8v4z"/>'),
    desktop:    svg('<path d="M21 2H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h7v2H8v2h8v-2h-2v-2h7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 12H4V4h16v10z"/>'),
    tablet:     svg('<path d="M18 0H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-3 22H9v-1h6v1zm3-3H6V3h12v16z"/>'),
    mobile:     svg('<path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm-3 20h-4v-1h4v1zm3-3H7V4h10v14z"/>'),
    preview:    svg('<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>'),
    download:   svg('<path d="M19 9h-4V3H9v6H5l7 7 7-7zm-14 9v2h14v-2H5z"/>'),
    theme:      svg('<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 16V5a7 7 0 0 1 0 14z"/>'),
    outlines:   svg('<path d="M3 3h18v18H3V3zm2 2v14h14V5H5z" fill-rule="evenodd"/><path d="M7 7h4v4H7zm6 0h4v4h-4zm-6 6h4v4H7zm6 0h4v4h-4z" opacity=".3"/>'),
    fullscreen: svg('<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>'),
    exitFullscreen: svg('<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>'),

    // Blocks - Basic
    text:       svg('<path d="M5 4v3h5.5v12h3V7H19V4H5z"/>'),
    heading:    svg('<path d="M5 4v16h3v-6h8v6h3V4h-3v7H8V4H5z"/>'),
    image:      svg('<path d="M21 3H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 16H4V5h16v14z"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M4 18l4-5 3 3 4-5 5 7H4z"/>'),
    link:       svg('<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 0-10z"/>'),
    divider:    svg('<path d="M2 11h20v2H2z"/>'),

    // Blocks - Layout
    container:  svg('<path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/>'),
    columns2:   svg('<path d="M3 3h18v18H3V3zm2 2v14h6V5H5zm8 0v14h6V5h-6z"/>'),
    columns3:   svg('<path d="M3 3h18v18H3V3zm2 2v14h4V5H5zm6 0v14h2V5h-2zm4 0v14h4V5h-4z"/>'),

    // Blocks - Bootstrap
    card:       svg('<path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm0 4h14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/><line x1="5" y1="9" x2="19" y2="9" stroke="currentColor" stroke-width="1.5"/>'),
    alert:      svg('<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>'),
    button:     svg('<rect x="3" y="7" width="18" height="10" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12h8" stroke="currentColor" stroke-width="2" fill="none"/>'),
    table:      svg('<path d="M3 3h18v18H3V3zm2 2v4h6V5H5zm8 0v4h6V5h-6zM5 11v4h6v-4H5zm8 0v4h6v-4h-6zM5 17v2h6v-2H5zm8 0v2h6v-2h-6z"/>'),
    accordion:  svg('<path d="M3 3h18v4H3V3zm0 6h18v2H3V9zm0 4h18v2H3v-2zm0 4h18v4H3v-4z" fill="none" stroke="currentColor" stroke-width="1.5"/>'),
    carousel:   svg('<path d="M2 6h20v12H2V6zm2 2v8h16V8H4z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 12l3-3v6l-3-3zm10 0l-3-3v6l3-3z"/>'),
    modal:      svg('<path d="M3 5h18v14H3V5zm2 2v10h14V7H5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 7h14v3H5V7z" fill="currentColor" opacity="0.3"/><line x1="17" y1="8" x2="19" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="19" y1="8" x2="17" y2="10" stroke="currentColor" stroke-width="1.5"/>'),
    tabs:       svg('<path d="M3 7h5V3h8v4h5v14H3V7z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="3" x2="8" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="3" x2="16" y2="7" stroke="currentColor" stroke-width="1.5"/>'),
    badge:      svg('<rect x="4" y="8" width="16" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/>'),
    progress:   svg('<rect x="2" y="9" width="20" height="6" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="2" y="9" width="12" height="6" rx="3" fill="currentColor" opacity="0.4"/>'),
    listGroup:  svg('<path d="M4 4h16v3H4V4zm0 5h16v3H4V9zm0 5h16v3H4v-3zm0 5h16v3H4v-3z" fill="none" stroke="currentColor" stroke-width="1.2"/>'),
    breadcrumb: svg('<path d="M3 12h3l3-3v6l-3-3h-3zm7 0h3l3-3v6l-3-3h-3zm7 0h4" stroke="currentColor" stroke-width="2" fill="none"/>'),
    pagination: svg('<rect x="1" y="8" width="6" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="8" width="6" height="8" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="17" y="8" width="6" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>'),
    spinner:    svg('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.2"/><path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'),
    toast:      svg('<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="7" x2="19" y2="8" stroke="currentColor" stroke-width="1.2"/><line x1="19" y1="7" x2="18" y2="8" stroke="currentColor" stroke-width="1.2"/>'),

    // Blocks - Forms
    input:      svg('<rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 10v4" stroke="currentColor" stroke-width="2"/>'),
    textarea:   svg('<rect x="2" y="3" width="20" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 7h12M6 11h12M6 15h8" stroke="currentColor" stroke-width="1.5" fill="none"/>'),
    select:     svg('<rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 10l-4 4-4-4" fill="none" stroke="currentColor" stroke-width="2"/>'),

    // Blocks - Sections
    navbar:     svg('<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>'),
    hero:       svg('<path d="M12 2L2 7v2h20V7L12 2zm-8 9v6l8 5 8-5v-6l-8 4-8-4z"/>'),
    features:   svg('<path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"/>'),
    footer:     svg('<path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm0 11h14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/><line x1="5" y1="16" x2="19" y2="16" stroke="currentColor" stroke-width="1.5"/>'),

    // Mini toolbar
    drag:       svg('<path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>'),
    duplicate:  svg('<path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>'),
    delete:     svg('<path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>'),

    // Image edit
    editImage:  svg('<path d="M21.28 6.4l-3.68-3.68a1.5 1.5 0 0 0-2.12 0L3 15.2V21h5.8L21.28 8.52a1.5 1.5 0 0 0 0-2.12zM8.27 19H5v-3.27L16.03 4.7l3.27 3.27L8.27 19z"/>'),

    // Move actions
    moveUp:     svg('<path d="M7 14l5-5 5 5z"/>'),
    moveDown:   svg('<path d="M7 10l5 5 5-5z"/>'),
    moveOut:    svg('<path d="M14 7l-5 5 5 5z"/>'),
    moveInto:   svg('<path d="M10 7l5 5-5 5z"/>'),

    // Chevron
    chevron:    svg('<path d="M7 10l5 5 5-5z"/>'),
  };

  // ============================================
  // ATRIBUTOS HTML POR TAG
  // ============================================

  const BoolAttrs = new Set(['required','disabled','checked','selected','controls','autoplay','loop','muted','async','defer','reversed','hidden','readonly','multiple','novalidate','open','autofocus','allowfullscreen','playsinline','default','formnovalidate','draggable','contenteditable','spellcheck']);

  const TagAttributes = {
    _common: ['id','class','title','style','role','tabindex','lang','dir','hidden','draggable','contenteditable','spellcheck'],
    a:          ['href','target','rel','download','hreflang','type'],
    abbr:       [],
    area:       ['shape','coords','href','target','alt','rel'],
    audio:      ['src','controls','autoplay','loop','muted','preload','crossorigin'],
    blockquote: ['cite'],
    button:     ['type','disabled','name','value','form','autofocus'],
    canvas:     ['width','height'],
    col:        ['span'],
    colgroup:   ['span'],
    del:        ['cite','datetime'],
    details:    ['open'],
    dialog:     ['open'],
    embed:      ['src','type','width','height'],
    fieldset:   ['disabled','name','form'],
    form:       ['action','method','novalidate','enctype','target','autocomplete','name'],
    iframe:     ['src','width','height','name','sandbox','allow','loading','allowfullscreen'],
    img:        ['src','alt','width','height','loading','srcset','sizes','crossorigin','decoding','usemap'],
    input:      ['type','name','placeholder','value','required','disabled','readonly','checked','min','max','step','pattern','minlength','maxlength','autocomplete','autofocus','form','list','multiple','accept','size'],
    ins:        ['cite','datetime'],
    label:      ['for'],
    li:         ['value'],
    map:        ['name'],
    meter:      ['value','min','max','low','high','optimum'],
    object:     ['data','type','width','height','name','form'],
    ol:         ['type','start','reversed'],
    optgroup:   ['label','disabled'],
    option:     ['value','selected','disabled','label'],
    output:     ['for','name','form'],
    progress:   ['value','max'],
    q:          ['cite'],
    select:     ['name','required','multiple','disabled','size','autocomplete','autofocus','form'],
    source:     ['src','type','srcset','sizes','media'],
    table:      ['border'],
    td:         ['colspan','rowspan','headers'],
    textarea:   ['name','placeholder','rows','cols','required','readonly','disabled','minlength','maxlength','wrap','autocomplete','autofocus','form'],
    th:         ['colspan','rowspan','scope','headers','abbr'],
    time:       ['datetime'],
    track:      ['src','kind','srclang','label','default'],
    video:      ['src','controls','autoplay','loop','muted','poster','width','height','preload','playsinline','crossorigin'],
  };

  // ============================================
  // ESTILOS CSS - Definición de secciones
  // ============================================

  const DefaultStyles = {sections:[
    {id:'dimensions',label:'styles.dimensions',props:[
      {label:'Width',style:'width',type:'text'},{label:'Height',style:'height',type:'text'},
      {label:'Min Width',style:'minWidth',type:'text'},{label:'Max Width',style:'maxWidth',type:'text'},
      {label:'Min Height',style:'minHeight',type:'text'},{label:'Max Height',style:'maxHeight',type:'text'},
      {label:'Overflow',style:'overflow',type:'select',options:['','visible','hidden','scroll','auto']}
    ]},
    {id:'spacing',label:'styles.spacing',props:[
      {label:'Margin',style:'margin',type:'text'},
      {label:'Margin Top',style:'marginTop',type:'text'},{label:'Margin Right',style:'marginRight',type:'text'},
      {label:'Margin Bottom',style:'marginBottom',type:'text'},{label:'Margin Left',style:'marginLeft',type:'text'},
      {label:'Padding',style:'padding',type:'text'},
      {label:'Padding Top',style:'paddingTop',type:'text'},{label:'Padding Right',style:'paddingRight',type:'text'},
      {label:'Padding Bottom',style:'paddingBottom',type:'text'},{label:'Padding Left',style:'paddingLeft',type:'text'}
    ]},
    {id:'typography',label:'styles.typography',props:[
      {label:'Font Family',style:'fontFamily',type:'text'},{label:'Font Size',style:'fontSize',type:'text'},
      {label:'Font Weight',style:'fontWeight',type:'select',options:['','100','200','300','400','500','600','700','800','900','bold','normal']},
      {label:'Font Style',style:'fontStyle',type:'select',options:['','normal','italic']},
      {label:'Line Height',style:'lineHeight',type:'text'},{label:'Letter Spacing',style:'letterSpacing',type:'text'},
      {label:'Text Align',style:'textAlign',type:'select',options:['','left','center','right','justify']},
      {label:'Text Decoration',style:'textDecoration',type:'select',options:['','none','underline','line-through','overline']},
      {label:'Text Transform',style:'textTransform',type:'select',options:['','none','uppercase','lowercase','capitalize']},
      {label:'White Space',style:'whiteSpace',type:'select',options:['','normal','nowrap','pre','pre-wrap','pre-line']},
      {label:'Word Break',style:'wordBreak',type:'select',options:['','normal','break-all','keep-all','break-word']},
      {label:'Color',style:'color',type:'color'}
    ]},
    {id:'background',label:'styles.background',props:[
      {label:'BG Color',style:'backgroundColor',type:'color'},
      {label:'BG Image',style:'backgroundImage',type:'text',placeholder:'url(...)'},
      {label:'BG Size',style:'backgroundSize',type:'select',options:['','cover','contain','auto','100% 100%']},
      {label:'BG Position',style:'backgroundPosition',type:'select',options:['','center','top','bottom','left','right','center center','top center','bottom center']},
      {label:'BG Repeat',style:'backgroundRepeat',type:'select',options:['','repeat','no-repeat','repeat-x','repeat-y']},
      {label:'Opacity',style:'opacity',type:'text',placeholder:'0-1'}
    ]},
    {id:'borders',label:'styles.borders',props:[
      {label:'Border',style:'border',type:'text'},
      {label:'Border Top',style:'borderTop',type:'text'},{label:'Border Right',style:'borderRight',type:'text'},
      {label:'Border Bottom',style:'borderBottom',type:'text'},{label:'Border Left',style:'borderLeft',type:'text'},
      {label:'Border Color',style:'borderColor',type:'color'},
      {label:'Radius',style:'borderRadius',type:'text'},
      {label:'Outline',style:'outline',type:'text'},
      {label:'Box Shadow',style:'boxShadow',type:'text',placeholder:'0 2px 4px rgba(0,0,0,.2)'}
    ]},
    {id:'layout',label:'styles.layout',props:[
      {label:'Display',style:'display',type:'select',options:['','block','inline','inline-block','flex','inline-flex','grid','inline-grid','none']},
      {label:'Position',style:'position',type:'select',options:['','static','relative','absolute','fixed','sticky']},
      {label:'Top',style:'top',type:'text'},{label:'Right',style:'right',type:'text'},
      {label:'Bottom',style:'bottom',type:'text'},{label:'Left',style:'left',type:'text'},
      {label:'Z-Index',style:'zIndex',type:'text'},
      {label:'Float',style:'float',type:'select',options:['','none','left','right']},
      {label:'Clear',style:'clear',type:'select',options:['','none','left','right','both']},
      {label:'Visibility',style:'visibility',type:'select',options:['','visible','hidden','collapse']},
      {label:'Cursor',style:'cursor',type:'select',options:['','auto','default','pointer','move','text','wait','crosshair','not-allowed','grab','grabbing']}
    ]},
    {id:'flexbox',label:'styles.flexbox',props:[
      {label:'Flex Direction',style:'flexDirection',type:'select',options:['','row','row-reverse','column','column-reverse']},
      {label:'Flex Wrap',style:'flexWrap',type:'select',options:['','nowrap','wrap','wrap-reverse']},
      {label:'Justify Content',style:'justifyContent',type:'select',options:['','flex-start','flex-end','center','space-between','space-around','space-evenly']},
      {label:'Align Items',style:'alignItems',type:'select',options:['','stretch','flex-start','flex-end','center','baseline']},
      {label:'Align Content',style:'alignContent',type:'select',options:['','stretch','flex-start','flex-end','center','space-between','space-around']},
      {label:'Gap',style:'gap',type:'text'},
      {label:'Flex',style:'flex',type:'text'},{label:'Flex Grow',style:'flexGrow',type:'text'},
      {label:'Flex Shrink',style:'flexShrink',type:'text'},{label:'Flex Basis',style:'flexBasis',type:'text'},
      {label:'Align Self',style:'alignSelf',type:'select',options:['','auto','flex-start','flex-end','center','baseline','stretch']},
      {label:'Order',style:'order',type:'text'}
    ]},
    {id:'grid',label:'styles.grid',props:[
      {label:'Grid Columns',style:'gridTemplateColumns',type:'text',placeholder:'1fr 1fr 1fr'},
      {label:'Grid Rows',style:'gridTemplateRows',type:'text'},
      {label:'Grid Column',style:'gridColumn',type:'text'},{label:'Grid Row',style:'gridRow',type:'text'},
      {label:'Grid Gap',style:'gap',type:'text'},
      {label:'Place Items',style:'placeItems',type:'text'},{label:'Place Content',style:'placeContent',type:'text'}
    ]},
    {id:'transform',label:'styles.transform',props:[
      {label:'Transform',style:'transform',type:'text',placeholder:'rotate(0deg) scale(1)'},
      {label:'Transform Origin',style:'transformOrigin',type:'text'},
      {label:'Transition',style:'transition',type:'text',placeholder:'all 0.3s ease'},
      {label:'Animation',style:'animation',type:'text'},
      {label:'Filter',style:'filter',type:'text',placeholder:'blur(0px) brightness(100%)'}
    ]}
  ]};

  // ============================================
  // BLOQUES / COMPONENTES
  // ============================================

  const DefaultBlocks = {
    basic: [
      { id: 'text', label: 'Texto', icon: Icons.text, html: '<p>Escribe tu texto aquí...</p>',
        settings: [{label:'setting.id',attr:'id',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'heading', label: 'Título', icon: Icons.heading, html: '<h2>Título de sección</h2>',
        settings: [{label:'setting.level',prop:'tagName',type:'select',options:['H1','H2','H3','H4','H5','H6']},{label:'setting.id',attr:'id',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'image', label: 'Imagen', icon: Icons.image, html: '<img src="https://picsum.photos/1900/1000" alt="Imagen" class="img-fluid">',
        settings: [{label:'setting.src',attr:'src',type:'text'},{label:'setting.alt',attr:'alt',type:'text'},{label:'setting.width',attr:'width',type:'text'},{label:'setting.height',attr:'height',type:'text'},{label:'Loading',attr:'loading',type:'select',options:['','lazy','eager']},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'link', label: 'Enlace', icon: Icons.link, html: '<a href="#">Enlace de ejemplo</a>',
        settings: [{label:'setting.url',attr:'href',type:'text'},{label:'setting.target',attr:'target',type:'select',options:['','_blank','_self','_parent','_top']},{label:'Rel',attr:'rel',type:'text'},{label:'setting.id',attr:'id',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'divider', label: 'Divisor', icon: Icons.divider, html: '<hr class="my-4">',
        settings: [{label:'setting.classes',attr:'class',type:'text'}] },
    ],
    layout: [
      { id: 'container', label: 'Container', icon: Icons.container, html: '<div class="container py-4"><p>Contenido...</p></div>',
        settings: [{label:'setting.type',attr:'class',type:'select',options:['container py-4','container-fluid py-4','container-sm py-4','container-md py-4','container-lg py-4','container-xl py-4']},{label:'setting.id',attr:'id',type:'text'}] },
      { id: 'row-2', label: '2 Columnas', icon: Icons.columns2, html: '<div class="row"><div class="col-6"><div class="p-3 bg-light">Col 1</div></div><div class="col-6"><div class="p-3 bg-light">Col 2</div></div></div>',
        settings: [{label:'setting.classes',attr:'class',type:'text'},{label:'setting.id',attr:'id',type:'text'}] },
      { id: 'row-3', label: '3 Columnas', icon: Icons.columns3, html: '<div class="row"><div class="col-4"><div class="p-3 bg-light">1</div></div><div class="col-4"><div class="p-3 bg-light">2</div></div><div class="col-4"><div class="p-3 bg-light">3</div></div></div>',
        settings: [{label:'setting.classes',attr:'class',type:'text'},{label:'setting.id',attr:'id',type:'text'}] },
    ],
    bootstrap: [
      { id: 'card', label: 'Card', icon: Icons.card, html: '<div class="card"><div class="card-body"><h5 class="card-title">Card</h5><p class="card-text">Contenido de la card.</p><a href="#" class="btn btn-primary">Acción</a></div></div>',
        settings: [{label:'setting.title',prop:'textContent',selector:'.card-title',type:'text'},{label:'setting.text',prop:'textContent',selector:'.card-text',type:'text'},{label:'setting.buttonText',prop:'textContent',selector:'.btn',type:'text'},{label:'setting.buttonUrl',attr:'href',selector:'.btn',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'alert', label: 'Alerta', icon: Icons.alert, html: '<div class="alert alert-primary">Mensaje de alerta</div>',
        settings: [{label:'setting.variant',attr:'class',type:'select',options:['alert alert-primary','alert alert-secondary','alert alert-success','alert alert-danger','alert alert-warning','alert alert-info','alert alert-light','alert alert-dark']},{label:'setting.id',attr:'id',type:'text'}] },
      { id: 'button', label: 'Botón', icon: Icons.button, html: '<button class="btn btn-primary">Botón</button>',
        settings: [{label:'setting.variant',attr:'class',type:'select',options:['btn btn-primary','btn btn-secondary','btn btn-success','btn btn-danger','btn btn-warning','btn btn-info','btn btn-light','btn btn-dark','btn btn-outline-primary','btn btn-outline-secondary','btn btn-outline-success','btn btn-outline-danger']},{label:'setting.type',attr:'type',type:'select',options:['button','submit','reset']},{label:'setting.disabled',attr:'disabled',type:'checkbox'}] },
      { id: 'table', label: 'Tabla', icon: Icons.table, html: '<table class="table"><thead><tr><th>#</th><th>Nombre</th></tr></thead><tbody><tr><td>1</td><td>Ejemplo</td></tr></tbody></table>',
        settings: [{label:'setting.classes',attr:'class',type:'text'},{label:'setting.id',attr:'id',type:'text'}] },
      { id: 'accordion', label: 'Accordion', icon: Icons.accordion, html: '<div class="shou-accordion-wrapper"><div class="accordion" id="acc1"><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#acc1-c1">Sección 1</button></h2><div id="acc1-c1" class="accordion-collapse collapse show" data-bs-parent="#acc1"><div class="accordion-body">Contenido de la primera sección.</div></div></div><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acc1-c2">Sección 2</button></h2><div id="acc1-c2" class="accordion-collapse collapse" data-bs-parent="#acc1"><div class="accordion-body">Contenido de la segunda sección.</div></div></div><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acc1-c3">Sección 3</button></h2><div id="acc1-c3" class="accordion-collapse collapse" data-bs-parent="#acc1"><div class="accordion-body">Contenido de la tercera sección.</div></div></div></div></div>',
        settings: [{label:'setting.accordion',type:'accordion'},{label:'setting.id',attr:'id',selector:'.accordion',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'carousel', label: 'Carousel', icon: Icons.carousel, html: '<div id="carousel1" class="carousel slide" data-bs-ride="carousel"><div class="carousel-indicators"><button type="button" data-bs-target="#carousel1" data-bs-slide-to="0" class="active"></button><button type="button" data-bs-target="#carousel1" data-bs-slide-to="1"></button><button type="button" data-bs-target="#carousel1" data-bs-slide-to="2"></button></div><div class="carousel-inner"><div class="carousel-item active"><img src="https://picsum.photos/1200/500?random=1" class="d-block w-100" alt="Slide 1"></div><div class="carousel-item"><img src="https://picsum.photos/1200/500?random=2" class="d-block w-100" alt="Slide 2"></div><div class="carousel-item"><img src="https://picsum.photos/1200/500?random=3" class="d-block w-100" alt="Slide 3"></div></div><button class="carousel-control-prev" type="button" data-bs-target="#carousel1" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button><button class="carousel-control-next" type="button" data-bs-target="#carousel1" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button></div>',
        settings: [{label:'setting.slides',type:'slides'},{label:'setting.id',attr:'id',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'modal', label: 'Modal', icon: Icons.modal, html: '<div class="shou-modal-wrapper"><button type="button" class="btn btn-primary shou-modal-trigger">Abrir modal</button><div class="modal fade show shou-modal-overlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:1050;background:rgba(0,0,0,0.5)"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Título del modal</h5><button type="button" class="btn-close shou-modal-close-x"></button></div><div class="modal-body" style="min-height:100px"><p class="text-muted">Arrastra bloques aquí</p></div><div class="modal-footer"><button type="button" class="btn btn-secondary shou-modal-close">Cerrar</button><button type="button" class="btn btn-primary shou-modal-save">Guardar</button></div></div></div></div></div>',
        settings: [{label:'setting.title',prop:'textContent',selector:'.modal-title',type:'text'},{label:'setting.buttonText',prop:'textContent',selector:'.shou-modal-trigger',type:'text'},{label:'setting.modalSize',attr:'class',selector:'.modal-dialog',type:'select',options:['modal-dialog','modal-dialog modal-sm','modal-dialog modal-lg','modal-dialog modal-xl','modal-dialog modal-fullscreen']},{label:'setting.modalCentered',type:'modal-toggle',prop:'centered'},{label:'setting.modalScrollable',type:'modal-toggle',prop:'scrollable'},{label:'setting.closeButton',prop:'textContent',selector:'.shou-modal-close',type:'text'},{label:'setting.showCloseBtn',type:'modal-toggle',prop:'showClose'},{label:'setting.saveButton',prop:'textContent',selector:'.shou-modal-save',type:'text'},{label:'setting.showSaveBtn',type:'modal-toggle',prop:'showSave'},{label:'setting.id',attr:'id',type:'text'}] },
      { id: 'tabs', label: 'Tabs', icon: Icons.tabs, html: '<div class="shou-tabs-wrapper"><ul class="nav nav-tabs" id="tabs1" role="tablist"><li class="nav-item" role="presentation"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabs1-1" type="button" role="tab">Pestaña 1</button></li><li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabs1-2" type="button" role="tab">Pestaña 2</button></li><li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabs1-3" type="button" role="tab">Pestaña 3</button></li></ul><div class="tab-content p-3 border border-top-0 rounded-bottom"><div class="tab-pane fade show active" id="tabs1-1" role="tabpanel">Contenido de la pestaña 1.</div><div class="tab-pane fade" id="tabs1-2" role="tabpanel">Contenido de la pestaña 2.</div><div class="tab-pane fade" id="tabs1-3" role="tabpanel">Contenido de la pestaña 3.</div></div></div>',
        settings: [{label:'setting.tabs',type:'tabs'},{label:'setting.id',attr:'id',selector:'.nav-tabs',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'badge', label: 'Badge', icon: Icons.badge, html: '<span class="badge bg-primary">Badge</span>',
        settings: [{label:'setting.variant',attr:'class',type:'select',options:['badge bg-primary','badge bg-secondary','badge bg-success','badge bg-danger','badge bg-warning text-dark','badge bg-info text-dark','badge bg-light text-dark','badge bg-dark','badge rounded-pill bg-primary','badge rounded-pill bg-secondary','badge rounded-pill bg-success','badge rounded-pill bg-danger']}] },
      { id: 'progress', label: 'Progress', icon: Icons.progress, html: '<div class="progress" role="progressbar" style="height:20px"><div class="progress-bar" style="width:50%">50%</div></div>',
        settings: [{label:'setting.value',attr:'style',selector:'.progress-bar',type:'text'},{label:'setting.text',prop:'textContent',selector:'.progress-bar',type:'text'},{label:'setting.variant',attr:'class',selector:'.progress-bar',type:'select',options:['progress-bar','progress-bar bg-success','progress-bar bg-info','progress-bar bg-warning','progress-bar bg-danger','progress-bar progress-bar-striped','progress-bar progress-bar-striped progress-bar-animated']},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'list-group', label: 'List Group', icon: Icons.listGroup, html: '<div class="shou-listgroup-wrapper"><ul class="list-group"><li class="list-group-item">Elemento 1</li><li class="list-group-item">Elemento 2</li><li class="list-group-item">Elemento 3</li></ul></div>',
        settings: [{label:'setting.listItems',type:'listgroup'},{label:'setting.variant',attr:'class',selector:'.list-group',type:'select',options:['list-group','list-group list-group-flush','list-group list-group-numbered']},{label:'setting.id',attr:'id',selector:'.list-group',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'breadcrumb', label: 'Breadcrumb', icon: Icons.breadcrumb, html: '<div class="shou-breadcrumb-wrapper"><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#">Inicio</a></li><li class="breadcrumb-item"><a href="#">Sección</a></li><li class="breadcrumb-item active" aria-current="page">Página actual</li></ol></nav></div>',
        settings: [{label:'setting.breadcrumbLinks',type:'breadcrumb'},{label:'setting.classes',attr:'class',selector:'.breadcrumb',type:'text'},{label:'setting.id',attr:'id',type:'text'}] },
      { id: 'pagination', label: 'Pagination', icon: Icons.pagination, html: '<nav aria-label="Paginación"><ul class="pagination"><li class="page-item"><a class="page-link" href="#">&laquo;</a></li><li class="page-item active"><a class="page-link" href="#">1</a></li><li class="page-item"><a class="page-link" href="#">2</a></li><li class="page-item"><a class="page-link" href="#">3</a></li><li class="page-item"><a class="page-link" href="#">&raquo;</a></li></ul></nav>',
        settings: [{label:'setting.variant',attr:'class',selector:'.pagination',type:'select',options:['pagination','pagination pagination-sm','pagination pagination-lg','pagination justify-content-center','pagination justify-content-end']},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'spinner', label: 'Spinner', icon: Icons.spinner, html: '<div class="text-center p-3"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>',
        settings: [{label:'setting.variant',attr:'class',selector:'[role="status"]',type:'select',options:['spinner-border text-primary','spinner-border text-secondary','spinner-border text-success','spinner-border text-danger','spinner-border text-warning','spinner-border text-info','spinner-grow text-primary','spinner-grow text-secondary','spinner-grow text-success','spinner-grow text-danger']},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'toast', label: 'Toast', icon: Icons.toast, html: '<div class="toast show" role="alert"><div class="toast-header"><strong class="me-auto">Notificación</strong><small>Ahora</small><button type="button" class="btn-close" data-bs-dismiss="toast"></button></div><div class="toast-body">Este es un mensaje de notificación.</div></div>',
        settings: [{label:'setting.title',prop:'textContent',selector:'.me-auto',type:'text'},{label:'setting.text',prop:'textContent',selector:'.toast-body',type:'text'},{label:'setting.time',prop:'textContent',selector:'small',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
    ],
    forms: [
      { id: 'form', label: 'Form', icon: Icons.container, html: '<form class="p-4 border rounded"><div class="mb-3"><label class="form-label">Nombre</label><input type="text" class="form-control" name="nombre" placeholder="Tu nombre"></div><div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" name="email" placeholder="tu@email.com"></div><button type="submit" class="btn btn-primary">Enviar</button></form>',
        settings: [{label:'setting.action',attr:'action',type:'text'},{label:'setting.method',attr:'method',type:'select',options:['','GET','POST']},{label:'setting.buttonText',prop:'textContent',selector:'button',type:'text'},{label:'setting.id',attr:'id',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'input', label: 'Input', icon: Icons.input, html: '<div class="mb-3"><label class="form-label">Campo</label><input type="text" class="form-control" name="campo"></div>',
        settings: [{label:'setting.label',prop:'textContent',selector:'label',type:'text'},{label:'setting.type',attr:'type',selector:'input',type:'select',options:['text','email','password','number','tel','url','date','time','datetime-local','month','week','color','hidden']},{label:'setting.name',attr:'name',selector:'input',type:'text'},{label:'setting.placeholder',attr:'placeholder',selector:'input',type:'text'},{label:'setting.value',attr:'value',selector:'input',type:'text'},{label:'setting.required',attr:'required',selector:'input',type:'checkbox'},{label:'setting.readonly',attr:'readonly',selector:'input',type:'checkbox'},{label:'setting.disabled',attr:'disabled',selector:'input',type:'checkbox'}] },
      { id: 'textarea', label: 'Textarea', icon: Icons.textarea, html: '<div class="mb-3"><label class="form-label">Descripción</label><textarea class="form-control" rows="3" name="descripcion"></textarea></div>',
        settings: [{label:'setting.label',prop:'textContent',selector:'label',type:'text'},{label:'setting.name',attr:'name',selector:'textarea',type:'text'},{label:'setting.placeholder',attr:'placeholder',selector:'textarea',type:'text'},{label:'setting.rows',attr:'rows',selector:'textarea',type:'text'},{label:'setting.required',attr:'required',selector:'textarea',type:'checkbox'},{label:'setting.readonly',attr:'readonly',selector:'textarea',type:'checkbox'},{label:'setting.disabled',attr:'disabled',selector:'textarea',type:'checkbox'}] },
      { id: 'select', label: 'Select', icon: Icons.select, html: '<div class="mb-3"><label class="form-label">Selecciona</label><select class="form-select" name="seleccion"><option value="1">Opción 1</option><option value="2">Opción 2</option><option value="3">Opción 3</option></select></div>',
        settings: [{label:'setting.label',prop:'textContent',selector:'label',type:'text'},{label:'setting.name',attr:'name',selector:'select',type:'text'},{label:'setting.options',prop:'options',selector:'select',type:'options'},{label:'setting.required',attr:'required',selector:'select',type:'checkbox'},{label:'setting.disabled',attr:'disabled',selector:'select',type:'checkbox'}] },
      { id: 'checkbox', label: 'Checkbox', icon: Icons.input, html: '<div class="mb-3 form-check"><input type="checkbox" class="form-check-input" id="check1" name="check1"><label class="form-check-label" for="check1">Opción</label></div>',
        settings: [{label:'setting.name',attr:'name',selector:'input',type:'text'},{label:'setting.id',attr:'id',selector:'input',type:'text'},{label:'setting.text',prop:'textContent',selector:'label',type:'text'},{label:'setting.checked',attr:'checked',selector:'input',type:'checkbox'},{label:'setting.required',attr:'required',selector:'input',type:'checkbox'},{label:'setting.disabled',attr:'disabled',selector:'input',type:'checkbox'}] },
      { id: 'radio', label: 'Radio', icon: Icons.input, html: '<div class="mb-3"><div class="form-check"><input class="form-check-input" type="radio" name="radio1" id="radio1" value="1"><label class="form-check-label" for="radio1">Opción 1</label></div><div class="form-check"><input class="form-check-input" type="radio" name="radio1" id="radio2" value="2"><label class="form-check-label" for="radio2">Opción 2</label></div><div class="form-check"><input class="form-check-input" type="radio" name="radio1" id="radio3" value="3"><label class="form-check-label" for="radio3">Opción 3</label></div></div>',
        settings: [{label:'setting.name',attr:'name',selector:'input',type:'text',all:true},{label:'setting.disabled',attr:'disabled',selector:'input',type:'checkbox',all:true},{label:'setting.required',attr:'required',selector:'input',type:'checkbox'}] },
      { id: 'file', label: 'File', icon: Icons.input, html: '<div class="mb-3"><label class="form-label">Archivo</label><input type="file" class="form-control" name="archivo"></div>',
        settings: [{label:'setting.label',prop:'textContent',selector:'label',type:'text'},{label:'setting.name',attr:'name',selector:'input',type:'text'},{label:'setting.accept',attr:'accept',selector:'input',type:'text'},{label:'setting.multiple',attr:'multiple',selector:'input',type:'checkbox'},{label:'setting.required',attr:'required',selector:'input',type:'checkbox'},{label:'setting.disabled',attr:'disabled',selector:'input',type:'checkbox'}] },
      { id: 'range', label: 'Range', icon: Icons.input, html: '<div class="mb-3"><label class="form-label">Rango</label><input type="range" class="form-range" name="rango" min="0" max="100" step="1" value="50"></div>',
        settings: [{label:'setting.label',prop:'textContent',selector:'label',type:'text'},{label:'setting.name',attr:'name',selector:'input',type:'text'},{label:'setting.min',attr:'min',selector:'input',type:'text'},{label:'setting.max',attr:'max',selector:'input',type:'text'},{label:'setting.step',attr:'step',selector:'input',type:'text'},{label:'setting.value',attr:'value',selector:'input',type:'text'},{label:'setting.disabled',attr:'disabled',selector:'input',type:'checkbox'}] },
      { id: 'switch', label: 'Switch', icon: Icons.input, html: '<div class="mb-3 form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="switch1" name="switch1"><label class="form-check-label" for="switch1">Activar</label></div>',
        settings: [{label:'setting.name',attr:'name',selector:'input',type:'text'},{label:'setting.id',attr:'id',selector:'input',type:'text'},{label:'setting.text',prop:'textContent',selector:'label',type:'text'},{label:'setting.checked',attr:'checked',selector:'input',type:'checkbox'},{label:'setting.required',attr:'required',selector:'input',type:'checkbox'},{label:'setting.disabled',attr:'disabled',selector:'input',type:'checkbox'}] },
    ],
    sections: [
      { id: 'navbar', label: 'Navbar', icon: Icons.navbar, html: '<nav class="navbar navbar-expand-lg navbar-dark bg-dark"><div class="container"><a class="navbar-brand" href="#">Logo</a><ul class="navbar-nav ms-auto"><li class="nav-item"><a class="nav-link" href="#">Inicio</a></li><li class="nav-item"><a class="nav-link" href="#">Contacto</a></li></ul></div></nav>',
        settings: [{label:'setting.brand',prop:'textContent',selector:'.navbar-brand',type:'text'},{label:'setting.url',attr:'href',selector:'.navbar-brand',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'hero', label: 'Hero', icon: Icons.hero, html: '<section class="py-5 bg-primary text-white text-center"><div class="container py-5"><h1 class="display-4">Bienvenido</h1><p class="lead">Descripción del sitio</p><a href="#" class="btn btn-light btn-lg">Comenzar</a></div></section>',
        settings: [{label:'setting.title',prop:'textContent',selector:'h1',type:'text'},{label:'setting.subtitle',prop:'textContent',selector:'.lead',type:'text'},{label:'setting.buttonText',prop:'textContent',selector:'.btn',type:'text'},{label:'setting.buttonUrl',attr:'href',selector:'.btn',type:'text'},{label:'setting.classes',attr:'class',type:'text'}] },
      { id: 'features', label: 'Features', icon: Icons.features, html: '<section class="py-5"><div class="container"><h2 class="text-center mb-5">Características</h2><div class="row g-4"><div class="col-md-4 text-center"><h5>Rápido</h5><p>Descripción</p></div><div class="col-md-4 text-center"><h5>Seguro</h5><p>Descripción</p></div><div class="col-md-4 text-center"><h5>Simple</h5><p>Descripción</p></div></div></div></section>',
        settings: [{label:'setting.title',prop:'textContent',selector:'h2',type:'text'},{label:'setting.classes',attr:'class',type:'text'},{label:'setting.id',attr:'id',type:'text'}] },
      { id: 'footer', label: 'Footer', icon: Icons.footer, html: '<footer class="py-4 bg-dark text-white text-center"><div class="container"><p class="mb-0">&copy; 2024 Mi Sitio</p></div></footer>',
        settings: [{label:'setting.footerText',prop:'innerHTML',selector:'p',type:'text'},{label:'setting.classes',attr:'class',type:'text'},{label:'setting.id',attr:'id',type:'text'}] },
    ],
  };

  // ============================================
  // SYNTAX HIGHLIGHTING
  // ============================================

  function highlightHTML(code) {
    if (!code) return '';
    let r = escapeHtml(code);
    r = r.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-comment">$1</span>');
    r = r.replace(/(&lt;\/?)([\w-]+)((?:\s+[\s\S]*?)?)(\/?&gt;)/g, (m, o, tag, attrs, c) => {
      let a = attrs.replace(/([\w-:@]+)(=)("(?:[^"]*?)"|'(?:[^']*?)'|&quot;(?:.*?)&quot;|&#39;(?:.*?)&#39;)/g,
        (m2, name, eq, val) => '<span class="tok-attr">' + name + '</span><span class="tok-punct">' + eq + '</span><span class="tok-str">' + val + '</span>');
      // Also highlight boolean attrs (no value) like disabled, checked
      a = a.replace(/(?<=\s)([\w-:@]+)(?=\s|$)(?![^<]*<\/span>)/g, '<span class="tok-attr">$1</span>');
      return `<span class="tok-punct">${o}</span><span class="tok-tag">${tag}</span>${a}<span class="tok-punct">${c}</span>`;
    });
    return r;
  }

  function highlightCSS(code) {
    if (!code) return '';
    let r = escapeHtml(code);
    r = r.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>');
    r = r.replace(/(@[\w-]+)/g, '<span class="tok-kw">$1</span>');
    // Highlight selectors (text before { )
    r = r.replace(/^([^{}\/\n][^{}\n]*?)(\{)/gm, (m, sel, br) => {
      return `<span class="tok-selector">${sel}</span><span class="tok-punct">${br}</span>`;
    });
    r = r.replace(/([\w-]+)(\s*:\s*)([^;{}]+)(;?)/g, (m, p, c, v, s) => {
      let hv = v.replace(/(-?\d+\.?\d*)(px|em|rem|%|vh|vw|s|ms|deg)/g, '<span class="tok-num">$1</span><span class="tok-unit">$2</span>');
      hv = hv.replace(/(#[0-9a-fA-F]{3,8})/g, '<span class="tok-num">$1</span>');
      return `<span class="tok-prop">${p}</span><span class="tok-punct">${c}</span>${hv}<span class="tok-punct">${s}</span>`;
    });
    return r;
  }

  function highlightJS(code) {
    if (!code) return '';
    const kw = ['const','let','var','function','return','if','else','for','while','class','new','this','async','await','import','export','from','of','in'];
    let r = escapeHtml(code);
    const ph = []; let i = 0;
    r = r.replace(/(`[\s\S]*?`)/g, m => { const p = `__P${i++}__`; ph.push({ p, v: `<span class="tok-str">${m}</span>` }); return p; });
    r = r.replace(/(&quot;[^&]*?&quot;)/g, m => { const p = `__P${i++}__`; ph.push({ p, v: `<span class="tok-str">${m}</span>` }); return p; });
    r = r.replace(/(&#39;[^&]*?&#39;)/g, m => { const p = `__P${i++}__`; ph.push({ p, v: `<span class="tok-str">${m}</span>` }); return p; });
    r = r.replace(/(\/\/.*$)/gm, m => { const p = `__P${i++}__`; ph.push({ p, v: `<span class="tok-comment">${m}</span>` }); return p; });
    r = r.replace(new RegExp(`\\b(${kw.join('|')})\\b`, 'g'), '<span class="tok-kw">$1</span>');
    r = r.replace(/\b(true|false|null|undefined)\b/g, '<span class="tok-bool">$1</span>');
    r = r.replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');
    r = r.replace(/\b([a-zA-Z_$][\w$]*)\s*(?=\()/g, '<span class="tok-fn">$1</span>');
    ph.forEach(({ p, v }) => r = r.replace(p, v));
    return r;
  }

  function highlight(code, lang) {
    if (lang === 'html') return highlightHTML(code);
    if (lang === 'css') return highlightCSS(code);
    if (lang === 'js') return highlightJS(code);
    return escapeHtml(code);
  }

  // ============================================
  // TEMPLATE HTML
  // ============================================

  function getEditorTemplate(config) {
    const cats = Object.entries(config.blocks).map(([id, blocks]) => `
      <div class="jse-category open" data-cat="${id}">
        <div class="jse-cat-header"><span>${id.charAt(0).toUpperCase() + id.slice(1)}</span><span class="jse-chevron">${Icons.chevron}</span></div>
        <div class="jse-cat-blocks">
          ${blocks.map(b => `<div class="jse-block" data-block="${b.id}" draggable="true"><span class="jse-block-icon">${b.icon}</span><span>${b.label}</span></div>`).join('')}
        </div>
      </div>
    `).join('');

    return `
<div class="jse-editor theme-${config.theme}" style="width:${config.width};height:${config.height}">
  <!-- TOOLBAR -->
  <header class="jse-toolbar">
    <div class="jse-toolbar-left">
      <span class="jse-logo">Shou Editor</span>
      <button type="button" class="jse-btn" data-action="new" title="${t('btn.new')}">${Icons.fileNew}</button>
      <button type="button" class="jse-btn" data-action="open" title="${t('btn.open')}">${Icons.folderOpen}</button>
      <button type="button" class="jse-btn" data-action="save" title="${t('btn.save')}">${Icons.save}</button>
    </div>
    <div class="jse-toolbar-center">
      <div class="jse-device-switcher">
        <button type="button" class="jse-device-btn active" data-device="desktop" title="Desktop">${Icons.desktop}</button>
        <button type="button" class="jse-device-btn" data-device="tablet" title="Tablet">${Icons.tablet}</button>
        <button type="button" class="jse-device-btn" data-device="mobile" title="Mobile">${Icons.mobile}</button>
      </div>
      <div class="jse-view-switcher">
        <button type="button" class="jse-view-btn ${config.defaultView === 'visual' ? 'active' : ''}" data-view="visual">Visual</button>
        <button type="button" class="jse-view-btn ${config.defaultView === 'code' ? 'active' : ''}" data-view="code">${t('view.code')}</button>
      </div>
      <div class="jse-toolbar-toggle">
        <button type="button" class="jse-toggle-btn" data-toggle="outlines" title="${t('btn.toggleOutlines')}">${Icons.outlines} Outlines</button>
      </div>
    </div>
    <div class="jse-toolbar-right">
      <button type="button" class="jse-btn" data-action="preview" title="Preview">${Icons.preview}</button>
      <button type="button" class="jse-btn" data-action="export" title="${t('btn.export')}">${Icons.download}</button>
      <button type="button" class="jse-btn" data-action="theme" title="${t('btn.theme')}">${Icons.theme}</button>
      <button type="button" class="jse-btn jse-fullscreen-btn" data-action="fullscreen" title="${t('btn.fullscreen')}">${Icons.fullscreen}</button>
    </div>
  </header>

  <!-- MAIN LAYOUT -->
  <main class="jse-main">
    <!-- LEFT PANEL: Blocks -->
    <aside class="jse-panel jse-panel-left">
      <div class="jse-panel-tabs">
        <button type="button" class="jse-panel-tab active" data-panel="blocks">${t('panel.blocks')}</button>
        <button type="button" class="jse-panel-tab" data-panel="layers">${t('panel.layers')}</button>
      </div>
      <div class="jse-panel-body active" id="jse-blocks">${cats}</div>
      <div class="jse-panel-body" id="jse-layers"><div class="jse-empty">${t('empty.dragElements')}</div></div>
    </aside>
    <div class="jse-resize-handle jse-resize-left" title="Resize"></div>

    <!-- CANVAS -->
    <section class="jse-canvas-wrap">
      <div class="jse-visual-canvas ${config.defaultView === 'visual' ? 'active' : ''}" data-device="${config.defaultDevice}">
        <iframe class="jse-frame"></iframe>
        <div class="jse-canvas-breadcrumb"></div>
      </div>
      <div class="jse-code-canvas ${config.defaultView === 'code' ? 'active' : ''}">
        <div class="jse-code-tabs">
          <button type="button" class="jse-code-tab active" data-lang="html">HTML</button>
          <button type="button" class="jse-code-tab" data-lang="css">CSS</button>
          <button type="button" class="jse-code-tab" data-lang="js">JS</button>
        </div>
        <div class="jse-code-editors">
          <div class="jse-code-editor active" data-lang="html">
            <div class="jse-lines"></div>
            <textarea class="jse-textarea" spellcheck="false"></textarea>
            <pre class="jse-highlight"><code></code></pre>
          </div>
          <div class="jse-code-editor" data-lang="css">
            <div class="jse-lines"></div>
            <textarea class="jse-textarea" spellcheck="false"></textarea>
            <pre class="jse-highlight"><code></code></pre>
          </div>
          <div class="jse-code-editor" data-lang="js">
            <div class="jse-lines"></div>
            <textarea class="jse-textarea" spellcheck="false"></textarea>
            <pre class="jse-highlight"><code></code></pre>
          </div>
        </div>
        <div class="jse-canvas-breadcrumb jse-code-breadcrumb"></div>
      </div>
    </section>
    <div class="jse-resize-handle jse-resize-right" title="Resize"></div>

    <!-- RIGHT PANEL: Styles -->
    <aside class="jse-panel jse-panel-right">
      <div class="jse-panel-tabs">
        <button type="button" class="jse-panel-tab active" data-panel="styles">${t('panel.styles')}</button>
        <button type="button" class="jse-panel-tab" data-panel="settings">${t('panel.settings')}</button>
      </div>
      <div class="jse-panel-body active" id="jse-styles">
        <div class="jse-selected-info"><span class="jse-no-sel">${t('empty.selectElement')}</span></div>
        <div class="jse-styles-editor"></div>
      </div>
      <div class="jse-panel-body" id="jse-settings">
        <div class="jse-selected-info" id="jse-attrs-info"><span class="jse-no-sel">${t('empty.selectElement')}</span></div>
        <div id="jse-attrs-editor"></div>
      </div>
    </aside>
  </main>
</div>
<input type="file" class="jse-file-input" accept=".html,.htm" style="display:none">
`;
  }

  // ============================================
  // EMBEDDED CSS
  // ============================================

  function getEditorCSS() {
    return `
.jse-editor{display:flex;flex-direction:column;font-family:system-ui,sans-serif;font-size:14px;background:var(--jse-bg);color:var(--jse-text);overflow:hidden;isolation:isolate}
.jse-editor.theme-dark{--jse-bg:#1e1e1e;--jse-bg2:#252526;--jse-bg3:#323233;--jse-text:#d4d4d4;--jse-text2:#858585;--jse-border:#3c3c3c;--jse-accent:#007acc;--jse-hover:#2a2d2e}
.jse-editor.theme-light{--jse-bg:#fff;--jse-bg2:#f3f3f3;--jse-bg3:#f8f8f8;--jse-text:#1e1e1e;--jse-text2:#6e6e6e;--jse-border:#e0e0e0;--jse-accent:#007acc;--jse-hover:#e8e8e8}
.jse-toolbar{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;background:var(--jse-bg3);border-bottom:1px solid var(--jse-border);gap:16px}
.jse-toolbar-left,.jse-toolbar-center,.jse-toolbar-right{display:flex;align-items:center;gap:8px}
.jse-logo{font-weight:700;color:var(--jse-accent);margin-right:12px}
.jse-btn{padding:6px 10px;border:none;border-radius:6px;background:var(--jse-bg2);color:var(--jse-text);cursor:pointer;transition:background .15s;display:inline-flex;align-items:center;justify-content:center}
.jse-btn:hover{background:var(--jse-hover)}
.jse-btn svg{width:16px;height:16px;fill:currentColor}
.jse-device-switcher,.jse-view-switcher{display:flex;background:var(--jse-bg2);border-radius:8px;padding:3px;gap:2px}
.jse-device-btn,.jse-view-btn{padding:6px 10px;border:none;border-radius:6px;background:transparent;color:var(--jse-text2);cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;justify-content:center}
.jse-device-btn svg{width:16px;height:16px;fill:currentColor}
.jse-device-btn:hover,.jse-view-btn:hover{color:var(--jse-text)}
.jse-device-btn.active,.jse-view-btn.active{background:var(--jse-accent);color:#fff}
.jse-main{display:flex;flex:1;overflow:hidden}
.jse-panel{width:260px;min-width:200px;display:flex;flex-direction:column;background:var(--jse-bg2);border-color:var(--jse-border);overflow:hidden}
.jse-panel-left{border-right:1px solid var(--jse-border)}
.jse-panel-right{border-left:1px solid var(--jse-border)}
.jse-panel-tabs{display:flex;background:var(--jse-bg3);border-bottom:1px solid var(--jse-border)}
.jse-panel-tab{flex:1;padding:10px;border:none;background:transparent;color:var(--jse-text2);font-size:12px;font-weight:600;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent}
.jse-panel-tab:hover{color:var(--jse-text)}
.jse-panel-tab.active{color:var(--jse-accent);border-bottom-color:var(--jse-accent)}
.jse-panel-body{flex:1;overflow-y:auto;padding:12px;display:none;min-height:0}
.jse-panel-body.active{display:block}
.jse-category{margin-bottom:12px}
.jse-cat-header{display:flex;justify-content:space-between;align-items:center;padding:8px;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--jse-text2);cursor:pointer;border-bottom:1px solid var(--jse-border)}
.jse-cat-header:hover{color:var(--jse-text)}
.jse-chevron{display:inline-flex;transition:transform .2s}
.jse-chevron svg{width:12px;height:12px;fill:currentColor}
.jse-category:not(.open) .jse-chevron{transform:rotate(-90deg)}
.jse-category:not(.open) .jse-cat-blocks{display:none}
.jse-cat-blocks{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:8px 0}
.jse-block{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;background:var(--jse-bg);border:1px solid var(--jse-border);border-radius:8px;cursor:grab;transition:all .15s;font-size:11px}
.jse-block:hover{border-color:var(--jse-accent);background:var(--jse-hover)}
.jse-block.dragging{opacity:.5}
.jse-block-icon{display:flex;align-items:center;justify-content:center;width:22px;height:22px}
.jse-block-icon svg{width:20px;height:20px;fill:currentColor}
.jse-empty{padding:20px;text-align:center;color:var(--jse-text2)}
.jse-canvas-wrap{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:400px}
.jse-visual-canvas,.jse-code-canvas{display:none;flex:1;flex-direction:column;overflow:hidden}
.jse-visual-canvas.active,.jse-code-canvas.active{display:flex}
.jse-visual-canvas{align-items:center;justify-content:center;padding:20px;background:#141414;background-image:linear-gradient(45deg,#1a1a1a 25%,transparent 25%),linear-gradient(-45deg,#1a1a1a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1a1a1a 75%),linear-gradient(-45deg,transparent 75%,#1a1a1a 75%);background-size:20px 20px;position:relative}
.jse-canvas-breadcrumb{display:none;align-items:center;gap:2px;padding:4px 10px;background:var(--jse-bg2);border-top:1px solid var(--jse-border);font-size:12px;font-family:monospace;overflow-x:auto;white-space:nowrap;flex-shrink:0;width:100%}
.jse-canvas-breadcrumb.visible{display:flex}
.jse-canvas-breadcrumb .jse-breadcrumb{cursor:pointer;padding:2px 6px;border-radius:4px;color:var(--jse-text2);transition:background .15s,color .15s}
.jse-canvas-breadcrumb .jse-breadcrumb:hover{background:var(--jse-hover);color:var(--jse-text)}
.jse-canvas-breadcrumb .jse-breadcrumb.active{background:var(--jse-accent);color:#fff;font-weight:600}
.jse-canvas-breadcrumb .jse-bc-sep{color:var(--jse-text2);opacity:0.5;font-size:10px}
.jse-frame{width:100%;height:100%;max-width:1200px;background:#fff;border:none;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,.2);transition:max-width .3s}
.jse-visual-canvas[data-device="tablet"] .jse-frame{max-width:768px}
.jse-visual-canvas[data-device="mobile"] .jse-frame{max-width:375px}
.jse-code-tabs{display:flex;background:var(--jse-bg3);border-bottom:1px solid var(--jse-border);padding:0 8px}
.jse-code-tab{padding:10px 16px;border:none;background:transparent;color:var(--jse-text2);font-size:13px;cursor:pointer;border-bottom:2px solid transparent}
.jse-code-tab:hover{color:var(--jse-text)}
.jse-code-tab.active{color:var(--jse-accent);border-bottom-color:var(--jse-accent)}
.jse-code-editors{flex:1;position:relative}
.jse-code-editor{display:none;position:absolute;inset:0}
.jse-code-editor.active{display:flex}
.jse-lines{min-width:45px;padding:12px 8px;background:var(--jse-bg);border-right:1px solid var(--jse-border);font:13px/1.6 monospace;color:var(--jse-text2);text-align:right;user-select:none;overflow:hidden}
.jse-lines>span{display:block}
.jse-fold{cursor:pointer;color:var(--jse-accent);transition:color .15s;font-size:10px;margin-right:2px}
.jse-fold:hover{color:var(--jse-text)}
.jse-textarea,.jse-highlight{position:absolute;top:0;left:45px;right:0;bottom:0;padding:12px;font:13px/1.6 monospace;tab-size:2;white-space:pre-wrap;word-wrap:break-word;overflow:auto}
.jse-textarea{background:transparent;color:transparent;caret-color:var(--jse-text);border:none;outline:none;resize:none;z-index:2}
.jse-highlight{background:var(--jse-bg);color:var(--jse-text);z-index:1;pointer-events:none;margin:0}
.jse-highlight code{display:block;font:inherit}
.jse-code-drop-bar{position:absolute;left:45px;right:0;height:2px;background:var(--jse-accent);z-index:10;pointer-events:none;box-shadow:0 0 6px var(--jse-accent)}
.tok-comment{color:var(--tok-comment,#6a9955);font-style:italic}.tok-tag{color:var(--tok-tag,#569cd6)}.tok-attr{color:var(--tok-attr,#e5c07b)}.tok-str{color:var(--tok-str,#ce9178)}.tok-kw{color:var(--tok-kw,#c586c0)}.tok-num{color:var(--tok-num,#b5cea8)}.tok-bool{color:var(--tok-bool,#569cd6)}.tok-fn{color:var(--tok-fn,#dcdcaa)}.tok-prop{color:var(--tok-prop,#9cdcfe)}.tok-punct{color:var(--tok-punct,#808080)}.tok-unit{color:var(--tok-unit,#b5cea8)}.tok-selector{color:var(--tok-selector,#d7ba7d)}
.jse-selected-info{padding:8px 12px;background:var(--jse-bg);border-radius:8px;margin-bottom:12px;font-size:12px;display:flex;flex-wrap:wrap;align-items:center;gap:2px}
.jse-no-sel{color:var(--jse-text2)}
.jse-breadcrumb{cursor:pointer;padding:2px 6px;border-radius:4px;color:var(--jse-text2);transition:background .15s,color .15s}
.jse-breadcrumb:hover{background:var(--jse-hover);color:var(--jse-text)}
.jse-breadcrumb.active{background:var(--jse-accent);color:#fff;font-weight:600}
.jse-bc-sep{color:var(--jse-text2);opacity:0.5;font-size:10px}
.jse-style-section{margin-bottom:8px}
.jse-section-header{display:flex;justify-content:space-between;align-items:center;padding:8px;font-size:11px;font-weight:600;color:var(--jse-text2);cursor:pointer;border-bottom:1px solid var(--jse-border)}
.jse-section-header:hover{color:var(--jse-text)}
.jse-style-section:not(.open) .jse-section-body{display:none}
.jse-section-body{padding:12px 0}
.jse-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.jse-row label{flex:0 0 70px;font-size:12px;color:var(--jse-text2)}
.jse-row input,.jse-row select{flex:1;padding:6px 8px;border:1px solid var(--jse-border);border-radius:4px;background:var(--jse-bg);color:var(--jse-text);font-size:12px}
.jse-row input:focus,.jse-row select:focus{outline:none;border-color:var(--jse-accent)}
.jse-row input[type="color"]{width:32px;height:32px;padding:2px;cursor:pointer}
.jse-row input[type="checkbox"]{flex:0 0 auto;width:0;height:0;min-width:0;opacity:0;position:absolute;pointer-events:none;overflow:visible}
.jse-toggle{flex:0 0 28px;width:28px;height:16px;min-width:28px;border-radius:8px;background:var(--jse-border);position:relative;cursor:pointer;transition:background .2s;overflow:visible}
.jse-toggle::after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:var(--jse-text2);transition:transform .2s,background .2s}
input[type="checkbox"]:checked+.jse-toggle{background:var(--jse-accent)}
input[type="checkbox"]:checked+.jse-toggle::after{transform:translateX(12px);background:#fff}
.jse-setting{display:flex;align-items:center;justify-content:space-between;padding:8px 0}
.jse-setting label{font-size:13px}
.jse-setting select{padding:6px 8px;border:1px solid var(--jse-border);border-radius:4px;background:var(--jse-bg);color:var(--jse-text)}
.jse-row input,.jse-row select{flex:1;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.jse-panel-right .jse-section-body{overflow-x:hidden}
.jse-layer{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--jse-border);cursor:pointer;font-size:12px;font-family:monospace;flex-shrink:0}
.jse-layer:hover{background:var(--jse-hover)}
.jse-layer-dragging{opacity:0.4}
.jse-layer-drop-before{border-top:2px solid var(--jse-accent)!important}
.jse-layer-drop-after{border-bottom:2px solid var(--jse-accent)!important}
.jse-layer-drop-inside{background:rgba(0,122,204,0.15)!important}
.jse-layer.selected{background:var(--jse-accent);color:#fff}
.jse-layer-tag{color:var(--jse-accent);font-weight:600}
.jse-layer.selected .jse-layer-tag{color:#fff}
.jse-layer-indent{display:inline-block}
.jse-toolbar-toggle{display:flex;gap:4px;margin-left:8px}
.jse-toggle-btn{padding:4px 8px;border:1px solid var(--jse-border);border-radius:4px;background:var(--jse-bg);color:var(--jse-text2);cursor:pointer;font-size:11px;transition:all .15s;display:inline-flex;align-items:center;gap:4px}
.jse-toggle-btn svg{width:14px;height:14px;fill:currentColor}
.jse-toggle-btn:hover{border-color:var(--jse-accent);color:var(--jse-text)}
.jse-toggle-btn.active{background:var(--jse-accent);color:#fff;border-color:var(--jse-accent)}
.jse-editor *::-webkit-scrollbar{width:8px;height:8px}
.jse-editor *::-webkit-scrollbar-track{background:var(--jse-bg)}
.jse-editor *::-webkit-scrollbar-thumb{background:var(--jse-bg3);border-radius:4px}
.jse-editor *::-webkit-scrollbar-thumb:hover{background:var(--jse-text2)}
.jse-editor *::-webkit-scrollbar-corner{background:var(--jse-bg)}
.jse-editor{scrollbar-color:var(--jse-bg3) var(--jse-bg)}
.jse-editor *{scrollbar-color:var(--jse-bg3) var(--jse-bg);scrollbar-width:thin}
@media(max-width:992px){.jse-panel,.jse-resize-handle{display:none}.jse-canvas-wrap{min-width:0}}
.jse-image-modal{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.jse-image-modal-content{width:90vw;height:90vh;border-radius:8px;overflow:hidden}
/* Fullscreen mode */
.jse-editor.jse-fullscreen{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;box-shadow:none!important}
/* Resize handles */
.jse-resize-handle{width:5px;cursor:col-resize;background:transparent;flex-shrink:0;position:relative;z-index:10;transition:background .15s}
.jse-resize-handle:hover,.jse-resize-handle.dragging{background:var(--jse-accent)}
.jse-resize-handle::after{content:'';position:absolute;inset:-2px -4px;z-index:1}
    `;
  }

  // ============================================
  // EDITOR CLASS
  // ============================================

  class Editor {
    constructor(containerOrConfig, config = {}) {
      // Handle both signatures: init('#el', config) or init(config)
      if (typeof containerOrConfig === 'string' || containerOrConfig instanceof Element) {
        this.container = typeof containerOrConfig === 'string' ? $(containerOrConfig) : containerOrConfig;
        this.config = { ...this.getDefaultConfig(), ...config };
      } else {
        this.container = document.body;
        this.config = { ...this.getDefaultConfig(), ...containerOrConfig };
      }

      // Track if theme was explicitly provided by user config
      const userCfg = typeof containerOrConfig === 'string' || containerOrConfig instanceof Element ? config : containerOrConfig;
      this._themeFromConfig = userCfg && userCfg.theme !== undefined;

      this.blocks = { ...DefaultBlocks, ...(this.config.customBlocks || {}) };
      this.config.blocks = this.blocks;
      this.selectedElement = null;
      this.clipboard = null;
      this.currentLang = 'html';
      this.code = { html: '', css: '', js: '' };
      this.history = [];
      this.historyIndex = -1;
      this.maxHistory = 50;
      // Code folding state
      this._foldState = { html: new Set(), css: new Set(), js: new Set() };
      this._foldRegions = { html: [], css: [], js: [] };
      this._displayCode = { html: '', css: '', js: '' };
      this._displayToRealMap = { html: [], css: [], js: [] };

      currentLang = this.config.lang || 'en';
      this._init();
    }

    async _init() {
      await this.loadBlocks();
      await this._loadStylesDef();
      this.injectCSS();
      this.render();
      this._applyHighlightTheme();
      this.cacheElements();
      this.bindEvents();
      this.initFrame();
      this.loadFromStorage();
    }

    async loadBlocks() {
      const base = this.config.blocksPath;
      try {
        const resp = await fetch(base + '_index.json');
        if (!resp.ok) throw new Error('No index');
        const index = await resp.json();

        const allIds = [];
        for (const cat of index.categories) {
          for (const blockId of cat.blocks) {
            allIds.push({ catId: cat.id, blockId });
          }
        }

        const results = await Promise.allSettled(
          allIds.map(({ catId, blockId }) =>
            fetch(`${base}${catId}/${blockId}.json`).then(r => r.json())
          )
        );

        const blocks = {};
        let i = 0;
        for (const cat of index.categories) {
          blocks[cat.id] = [];
          for (const blockId of cat.blocks) {
            const result = results[i++];
            if (result.status === 'fulfilled') {
              const b = result.value;
              blocks[cat.id].push({
                id: b.id,
                label: b.label,
                icon: Icons[b.icon] || b.icon,
                html: b.html,
                css: b.css || '',
                settings: b.settings || []
              });
            }
          }
        }

        this.blocks = { ...blocks, ...(this.config.customBlocks || {}) };
      } catch (e) {
        console.warn('ShouEditor: Could not load blocks from', base, '- using defaults');
        this.blocks = { ...DefaultBlocks, ...(this.config.customBlocks || {}) };
      }
      this.config.blocks = this.blocks;
    }

    async _loadStylesDef() {
      this.stylesDef = DefaultStyles;
      const base = this.config.stylesPath || 'styles/';
      try {
        const [sResp, aResp, hResp] = await Promise.allSettled([
          fetch(base + 'styles.json').then(r => r.ok ? r.json() : Promise.reject()),
          fetch(base + 'attributes.json').then(r => r.ok ? r.json() : Promise.reject()),
          fetch(base + 'highlight.json').then(r => r.ok ? r.json() : Promise.reject())
        ]);
        if (sResp.status === 'fulfilled') this.stylesDef = sResp.value;
        if (aResp.status === 'fulfilled') {
          const a = aResp.value;
          if (a.boolAttrs) a.boolAttrs.forEach(b => BoolAttrs.add(b));
          if (a.common) TagAttributes._common = a.common;
          if (a.tags) Object.assign(TagAttributes, a.tags);
        }
        if (hResp.status === 'fulfilled' && hResp.value.tokens) {
          this._highlightTheme = hResp.value.tokens;
        }
      } catch (e) { /* use defaults */ }
    }

    _applyHighlightTheme() {
      const theme = this._highlightTheme;
      if (!theme) return;
      const root = this.container || document.documentElement;
      for (const [token, color] of Object.entries(theme)) {
        root.style.setProperty(`--tok-${token}`, color);
      }
    }

    getDefaultConfig() {
      return {
        theme: 'dark',
        width: '100%',
        height: '100vh',
        defaultView: 'visual',
        defaultDevice: 'desktop',
        storagePrefix: 'shou-editor-',
        bootstrapCss: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
        blocksPath: 'blocks/',
        lang: 'en',
        blocks: DefaultBlocks,
        saveFormat: 'html',
        saveTarget: 'local',
        saveEndpoint: null,
        saveFilename: 'proyecto',
        onSaveSuccess: null,
        onSaveError: null
      };
    }

    injectCSS() {
      if (!$('#jse-styles')) {
        const style = document.createElement('style');
        style.id = 'jse-styles';
        style.textContent = getEditorCSS();
        document.head.appendChild(style);
      }
    }

    render() {
      this.container.innerHTML = getEditorTemplate(this.config);
      this.root = $('.jse-editor', this.container);
    }

    cacheElements() {
      this.frame = $('.jse-frame', this.root);
      this.visualCanvas = $('.jse-visual-canvas', this.root);
      this.canvasBreadcrumb = $('.jse-canvas-breadcrumb:not(.jse-code-breadcrumb)', this.root);
      this.codeBreadcrumb = $('.jse-code-breadcrumb', this.root);
      this.codeCanvas = $('.jse-code-canvas', this.root);
      this.blocksPanel = $('#jse-blocks', this.root);
      this.layersPanel = $('#jse-layers', this.root);
      this.stylesPanel = $('#jse-styles', this.root);
      this.selectedInfo = $('.jse-selected-info', this.root);
      this.attrsPanel = $('#jse-attrs-editor', this.root);
      this.attrsInfo = $('#jse-attrs-info', this.root);
      this.fileInput = $('.jse-file-input', this.container);

      this.codeEditors = {};
      ['html', 'css', 'js'].forEach(lang => {
        const ed = $(`.jse-code-editor[data-lang="${lang}"]`, this.root);
        if (ed) {
          this.codeEditors[lang] = {
            wrapper: ed,
            textarea: $('.jse-textarea', ed),
            highlight: $('.jse-highlight code', ed),
            lines: $('.jse-lines', ed)
          };
        }
      });
    }

    bindEvents() {
      const r = this.root;

      // Prevent all button clicks from bubbling to parent forms/page (AJAX compat)
      r.addEventListener('click', e => {
        if (e.target.closest('button')) e.preventDefault();
      });

      // Escape to exit fullscreen
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.root.classList.contains('jse-fullscreen')) {
          this.toggleFullscreen();
        }
      });

      // Toolbar actions
      on(r, 'click', '.jse-btn', (e, btn) => {
        const action = btn.dataset.action;
        if (action === 'new') this.newProject();
        if (action === 'open') this.fileInput?.click();
        if (action === 'save') this.save();
        if (action === 'preview') this.preview();
        if (action === 'export') this.exportHtml();
        if (action === 'theme') this.toggleTheme();
        if (action === 'fullscreen') this.toggleFullscreen();
      });

      // Device switcher
      on(r, 'click', '.jse-device-btn', (e, btn) => {
        $$('.jse-device-btn', r).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.visualCanvas) this.visualCanvas.dataset.device = btn.dataset.device;
      });

      // View switcher
      on(r, 'click', '.jse-view-btn', (e, btn) => {
        $$('.jse-view-btn', r).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        this.visualCanvas?.classList.toggle('active', view === 'visual');
        this.codeCanvas?.classList.toggle('active', view === 'code');
        if (view === 'code') this.syncToCode();
        if (view === 'visual') this.syncFromCode();
      });

      // Panel tabs
      on(r, 'click', '.jse-panel-tab', (e, tab) => {
        const panel = tab.closest('.jse-panel');
        $$('.jse-panel-tab', panel).forEach(t => t.classList.remove('active'));
        $$('.jse-panel-body', panel).forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        const target = $(`#jse-${tab.dataset.panel}`, panel);
        if (target) target.classList.add('active');
      });

      // Block categories
      on(r, 'click', '.jse-cat-header', (e, h) => {
        h.closest('.jse-category')?.classList.toggle('open');
      });

      // Style sections
      on(r, 'click', '.jse-section-header', (e, h) => {
        h.closest('.jse-style-section')?.classList.toggle('open');
      });

      // Panel resize handles
      this._initPanelResize();

      // Block drag & drop
      on(this.blocksPanel, 'dragstart', '.jse-block', (e, block) => {
        e.dataTransfer.setData('text/plain', block.dataset.block);
        e.dataTransfer.effectAllowed = 'copy';
        block.classList.add('dragging');
      });
      on(this.blocksPanel, 'dragend', '.jse-block', (e, block) => {
        block.classList.remove('dragging');
      });
      on(this.blocksPanel, 'click', '.jse-block', (e, block) => {
        this.insertBlock(block.dataset.block);
      });

      // Toggle buttons (outlines)
      on(r, 'click', '.jse-toggle-btn', (e, btn) => {
        btn.classList.toggle('active');
        const toggle = btn.dataset.toggle;
        if (toggle === 'outlines') {
          this.toggleOutlines(btn.classList.contains('active'));
        }
      });

      // Code tabs
      on(r, 'click', '.jse-code-tab', (e, tab) => {
        $$('.jse-code-tab', r).forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.setCodeLang(tab.dataset.lang);
      });

      // Code editors
      Object.entries(this.codeEditors).forEach(([lang, ed]) => {
        if (!ed.textarea) return;
        on(ed.textarea, 'input', () => {
          // Convert display code back to real code if folds are active
          if (this._foldState[lang].size > 0) {
            this.code[lang] = this._displayToRealCode(lang, ed.textarea.value);
          } else {
            this.code[lang] = ed.textarea.value;
          }
          this.updateCodeEditor(lang);
          this.saveToStorage();
          clearTimeout(this._historyTimer);
          this._historyTimer = setTimeout(() => this.pushHistory(), 800);
        });
        on(ed.textarea, 'scroll', () => {
          if (ed.highlight) ed.highlight.parentElement.scrollTop = ed.textarea.scrollTop;
          if (ed.lines) ed.lines.scrollTop = ed.textarea.scrollTop;
        });
        on(ed.textarea, 'keydown', e => this.handleCodeKeydown(e, lang));

        // Fold icon clicks in gutter
        if (ed.lines) {
          on(ed.lines, 'click', '.jse-fold', (e, el) => {
            e.stopPropagation();
            const line = parseInt(el.dataset.foldLine);
            if (!isNaN(line)) {
              this._toggleFold(lang, line);
              // Update textarea value to reflect fold
              if (ed.textarea) ed.textarea.value = this._displayCode[lang];
            }
          });
        }

        // Drop indicator bar for code editor
        let dropBar = null;
        const getDropLine = (e) => {
          const ta = ed.textarea;
          const rect = ta.getBoundingClientRect();
          const lineH = parseFloat(getComputedStyle(ta).lineHeight) || 20.8;
          const pad = 12;
          const y = e.clientY - rect.top + ta.scrollTop - pad;
          return Math.max(0, Math.round(y / lineH));
        };
        const showCodeDropBar = (e) => {
          const ta = ed.textarea;
          const wrapper = ed.wrapper;
          if (!dropBar) {
            dropBar = document.createElement('div');
            dropBar.className = 'jse-code-drop-bar';
            wrapper.appendChild(dropBar);
          }
          const lineH = parseFloat(getComputedStyle(ta).lineHeight) || 20.8;
          const pad = 12;
          const line = getDropLine(e);
          const top = pad + line * lineH - ta.scrollTop;
          dropBar.style.top = top + 'px';
          dropBar.style.display = '';
        };
        const hideCodeDropBar = () => {
          if (dropBar) dropBar.style.display = 'none';
        };
        const lineToPos = (ta, line) => {
          const lines = ta.value.split('\n');
          let pos = 0;
          for (let i = 0; i < Math.min(line, lines.length); i++) pos += lines[i].length + 1;
          return pos;
        };

        ed.textarea.addEventListener('dragover', e => {
          if (!e.dataTransfer.types.includes('text/plain')) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          showCodeDropBar(e);
        });
        ed.textarea.addEventListener('dragleave', e => {
          if (!ed.wrapper.contains(e.relatedTarget)) hideCodeDropBar();
        });
        ed.textarea.addEventListener('drop', e => {
          hideCodeDropBar();
          const id = e.dataTransfer.getData('text/plain');
          const block = id ? this.getBlockById(id) : null;
          if (!block) return;
          e.preventDefault();
          let code = '';
          if (lang === 'html') {
            code = block.html;
          } else if (lang === 'css' && block.css) {
            code = block.css;
          }
          if (!code) return;
          const ta = ed.textarea;
          const line = getDropLine(e);
          const pos = lineToPos(ta, line);
          const before = ta.value.substring(0, pos);
          const after = ta.value.substring(pos);
          const nl = before.length && !before.endsWith('\n') ? '\n' : '';
          ta.value = before + nl + code + '\n' + after;
          this.code[lang] = ta.value;
          this.updateCodeEditor(lang);
          this.saveToStorage();
          this.pushHistory();
          const newPos = pos + nl.length + code.length + 1;
          ta.setSelectionRange(newPos, newPos);
          ta.focus();
        });
      });

      // Style inputs (text + color)
      on(this.stylesPanel, 'input', '[data-style]', (e, el) => {
        if (!this.selectedElement) return;
        this.selectedElement.style[el.dataset.style] = el.value;
        this.syncToCode();
      });
      // Style selects
      on(this.stylesPanel, 'change', 'select[data-style]', (e, sel) => {
        if (!this.selectedElement) return;
        this.selectedElement.style[sel.dataset.style] = sel.value;
        this.syncToCode();
      });

      // File input
      on(this.fileInput, 'change', e => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = ev => this.importHtml(ev.target.result);
          reader.readAsText(file);
          e.target.value = '';
        }
      });

      // Attribute inputs
      // Generic attr inputs (fallback mode)
      on($('#jse-settings', r), 'input', 'input[data-attr]', (e, inp) => {
        if (!this.selectedElement) return;
        const attr = inp.dataset.attr;
        if (inp.type === 'checkbox') {
          if (inp.checked) this.selectedElement.setAttribute(attr, '');
          else this.selectedElement.removeAttribute(attr);
        } else {
          if (inp.value) this.selectedElement.setAttribute(attr, inp.value);
          else this.selectedElement.removeAttribute(attr);
        }
        this.syncToCode();
      });

      // Block-specific settings inputs
      const settingsEl = $('#jse-settings', r);
      const handleSettingChange = (inp) => {
        if (!this.selectedElement) return;
        const blockRoot = this._findBlockRoot(this.selectedElement);
        if (!blockRoot) return;
        const blockId = blockRoot.getAttribute('data-jse-block');
        const block = blockId ? this.getBlockById(blockId) : null;
        if (!block || !block.settings) return;
        const idx = parseInt(inp.dataset.sidx, 10);
        const s = block.settings[idx];
        if (!s) return;
        const target = s.selector ? blockRoot.querySelector(s.selector) : blockRoot;
        if (!target) return;

        if (s.type === 'checkbox') {
          if (s.attr) {
            if (inp.checked) {
              target.setAttribute(s.attr, '');
              if (s.all) blockRoot.querySelectorAll(s.selector).forEach(t => t.setAttribute(s.attr, ''));
            } else {
              target.removeAttribute(s.attr);
              if (s.all) blockRoot.querySelectorAll(s.selector).forEach(t => t.removeAttribute(s.attr));
            }
          }
        } else if (s.type === 'select') {
          const val = inp.value;
          if (s.attr) {
            target.setAttribute(s.attr, val);
          } else if (s.prop === 'tagName' && val !== target.tagName) {
            // Change tag name (e.g., h1->h2)
            const doc = this.frame.contentDocument;
            const newEl = doc.createElement(val);
            newEl.innerHTML = target.innerHTML;
            for (const a of target.attributes) newEl.setAttribute(a.name, a.value);
            target.replaceWith(newEl);
            // If target was the selected element itself, update reference
            if (target === this.selectedElement) this.selectedElement = newEl;
          }
        } else if (s.type === 'options') {
          // Handled by separate click/input handlers below
          return;
        } else {
          // text input
          const val = inp.value;
          if (s.attr) {
            if (val) target.setAttribute(s.attr, val);
            else target.removeAttribute(s.attr);
            if (s.all) {
              blockRoot.querySelectorAll(s.selector).forEach(t => {
                if (val) t.setAttribute(s.attr, val);
                else t.removeAttribute(s.attr);
              });
            }
          } else if (s.prop === 'textContent') {
            target.textContent = val;
          } else if (s.prop === 'innerHTML') {
            target.innerHTML = val;
          }
        }
        this.syncToCode();
      };

      on(settingsEl, 'input', 'input[data-sidx]', (e, inp) => handleSettingChange(inp));
      on(settingsEl, 'change', 'input[data-sidx]', (e, inp) => handleSettingChange(inp));
      on(settingsEl, 'change', 'select[data-sidx]', (e, sel) => handleSettingChange(sel));

      // Toggle switches click → toggle hidden checkbox
      settingsEl.addEventListener('click', e => {
        const toggle = e.target.closest('.jse-toggle');
        if (!toggle) return;
        const cb = toggle.previousElementSibling;
        if (cb && cb.type === 'checkbox') {
          cb.checked = !cb.checked;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      // Modal toggle handlers
      settingsEl.addEventListener('change', e => {
        const cb = e.target;
        if (!cb.dataset.modalProp) return;
        const blockRoot = this._currentBlockRoot;
        if (!blockRoot) return;
        const dialog = blockRoot.querySelector('.modal-dialog');
        const closeBtn = blockRoot.querySelector('.shou-modal-close');
        const saveBtn = blockRoot.querySelector('.shou-modal-save');

        switch (cb.dataset.modalProp) {
          case 'centered':
            dialog?.classList.toggle('modal-dialog-centered', cb.checked);
            break;
          case 'scrollable':
            dialog?.classList.toggle('modal-dialog-scrollable', cb.checked);
            break;
          case 'showClose':
            if (closeBtn) closeBtn.style.display = cb.checked ? '' : 'none';
            break;
          case 'showSave':
            if (saveBtn) saveBtn.style.display = cb.checked ? '' : 'none';
            break;
        }
        this.syncToCode();
      });

      // Visual options editor for <select> elements
      const syncOptionsToSelect = (editorEl) => {
        if (!this.selectedElement) return;
        const blockRoot = this._findBlockRoot(this.selectedElement);
        if (!blockRoot) return;
        const blockId = blockRoot.getAttribute('data-jse-block');
        const block = blockId ? this.getBlockById(blockId) : null;
        if (!block) return;
        const idx = parseInt(editorEl.dataset.sidx, 10);
        const s = block.settings[idx];
        if (!s) return;
        const selectEl = s.selector ? blockRoot.querySelector(s.selector) : blockRoot;
        if (!selectEl) return;

        const rows = editorEl.querySelectorAll('.jse-opt-row');
        selectEl.innerHTML = Array.from(rows).map(row => {
          const valInp = row.querySelector('input[data-opt-val]');
          const txtInp = row.querySelector('input[data-opt-txt]');
          const v = valInp ? valInp.value : '';
          const t = txtInp ? txtInp.value : '';
          return v ? `<option value="${v}">${t || v}</option>` : `<option>${t}</option>`;
        }).join('');
        this.syncToCode();
      };

      // Edit option value/text
      settingsEl.addEventListener('input', e => {
        if (e.target.dataset.optVal !== undefined || e.target.dataset.optTxt !== undefined) {
          const editor = e.target.closest('[data-opt-editor]');
          if (editor) syncOptionsToSelect(editor);
        }
      });

      // Delete option
      settingsEl.addEventListener('click', e => {
        const delBtn = e.target.closest('[data-opt-del]');
        if (delBtn) {
          const row = delBtn.closest('.jse-opt-row');
          const editor = delBtn.closest('[data-opt-editor]');
          if (row) row.remove();
          if (editor) syncOptionsToSelect(editor);
          return;
        }
        const addBtn = e.target.closest('[data-opt-add]');
        if (addBtn) {
          const editor = addBtn.closest('[data-opt-editor]');
          if (!editor) return;
          const count = editor.querySelectorAll('.jse-opt-row').length;
          const newRow = document.createElement('div');
          newRow.className = 'jse-opt-row';
          newRow.style.cssText = 'display:flex;gap:4px;margin-bottom:4px;align-items:center';
          newRow.innerHTML = `<input type="text" data-opt-val="${count}" value="${count + 1}" placeholder="${t('options.valuePlaceholder')}" style="flex:1;padding:4px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px"><input type="text" data-opt-txt="${count}" value="Option ${count + 1}" placeholder="${t('options.textPlaceholder')}" style="flex:2;padding:4px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px"><button data-opt-del="${count}" style="padding:2px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);cursor:pointer;font-size:11px;line-height:1" title="${t('toolbar.delete')}">&times;</button>`;
          addBtn.before(newRow);
          syncOptionsToSelect(editor);
        }
      });

      // ============================================
      // CAROUSEL SLIDES HANDLERS
      // ============================================

      const syncSlidesToCarousel = () => {
        // Use stored reference to current block being edited
        const blockRoot = this._currentBlockRoot;
        if (!blockRoot) return;
        const carouselId = blockRoot.getAttribute('id') || 'carousel1';
        const carouselInner = blockRoot.querySelector('.carousel-inner');
        const indicators = blockRoot.querySelector('.carousel-indicators');
        if (!carouselInner) return;

        const slideRows = settingsEl.querySelectorAll('.jse-slide-row');
        const slidesData = Array.from(slideRows).map(row => {
          const srcInp = row.querySelector('[data-slide-src]');
          const altInp = row.querySelector('[data-slide-alt]');
          return {
            src: srcInp ? srcInp.value : '',
            alt: altInp ? altInp.value : ''
          };
        });

        // Rebuild carousel-inner
        carouselInner.innerHTML = slidesData.map((s, i) =>
          `<div class="carousel-item${i === 0 ? ' active' : ''}"><img src="${s.src}" class="d-block w-100" alt="${s.alt}"></div>`
        ).join('');

        // Rebuild indicators
        if (indicators) {
          indicators.innerHTML = slidesData.map((_, i) =>
            `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}"${i === 0 ? ' class="active"' : ''}></button>`
          ).join('');
        }

        this.syncToCode();
      };

      // ============================================
      // BOOTSTRAP TABS SYNC FUNCTION
      // ============================================
      const syncTabsToComponent = () => {
        // Use stored reference to current block being edited
        const blockRoot = this._currentBlockRoot;
        if (!blockRoot) return;

        const navTabs = blockRoot.querySelector('.nav-tabs');
        const tabContent = blockRoot.querySelector('.tab-content');
        if (!navTabs || !tabContent) return;
        const tabsId = navTabs.getAttribute('id') || 'tabs1';

        // Get current panes to preserve their HTML content
        const existingPanes = Array.from(tabContent.querySelectorAll('.tab-pane'));

        const tabRows = settingsEl.querySelectorAll('.jse-tab-row');
        const tabsData = Array.from(tabRows).map((row, i) => {
          const titleInp = row.querySelector('[data-tab-title]');
          // Preserve existing pane content if it exists
          const existingPane = existingPanes[i];
          return {
            title: titleInp ? titleInp.value : `Tab ${i + 1}`,
            content: existingPane ? existingPane.innerHTML : ''
          };
        });

        // Rebuild nav-tabs (only titles change)
        navTabs.innerHTML = tabsData.map((tab, i) =>
          `<li class="nav-item" role="presentation"><button class="nav-link${i === 0 ? ' active' : ''}" data-bs-toggle="tab" data-bs-target="#${tabsId}-${i + 1}" type="button" role="tab">${tab.title}</button></li>`
        ).join('');

        // Rebuild tab-content preserving HTML content
        tabContent.innerHTML = tabsData.map((tab, i) =>
          `<div class="tab-pane fade${i === 0 ? ' show active' : ''}" id="${tabsId}-${i + 1}" role="tabpanel">${tab.content}</div>`
        ).join('');

        this.syncToCode();
      };

      // ============================================
      // BOOTSTRAP ACCORDION SYNC FUNCTION
      // ============================================
      const syncAccordionToComponent = () => {
        const blockRoot = this._currentBlockRoot;
        if (!blockRoot) return;

        const accordion = blockRoot.querySelector('.accordion');
        if (!accordion) return;
        const accId = accordion.getAttribute('id') || 'acc1';

        // Get existing items to preserve their body content
        const existingItems = Array.from(accordion.querySelectorAll('.accordion-item'));

        const accRows = settingsEl.querySelectorAll('.jse-accordion-row');
        const accData = Array.from(accRows).map((row, i) => {
          const titleInp = row.querySelector('[data-acc-title]');
          const existingItem = existingItems[i];
          const existingBody = existingItem?.querySelector('.accordion-body');
          return {
            title: titleInp ? titleInp.value : `Sección ${i + 1}`,
            content: existingBody ? existingBody.innerHTML : `Contenido de la sección ${i + 1}.`,
            isOpen: existingItem?.querySelector('.accordion-collapse.show') !== null
          };
        });

        // Rebuild accordion preserving content
        accordion.innerHTML = accData.map((item, i) => {
          const isFirst = i === 0;
          const isOpen = item.isOpen || (accData.every(d => !d.isOpen) && isFirst);
          return `<div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button${isOpen ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${accId}-c${i + 1}">${item.title}</button>
            </h2>
            <div id="${accId}-c${i + 1}" class="accordion-collapse collapse${isOpen ? ' show' : ''}" data-bs-parent="#${accId}">
              <div class="accordion-body">${item.content}</div>
            </div>
          </div>`;
        }).join('');

        this.syncToCode();
      };

      // ============================================
      // BOOTSTRAP LIST GROUP SYNC FUNCTION
      // ============================================
      const syncListGroupToComponent = () => {
        const blockRoot = this._currentBlockRoot;
        if (!blockRoot) return;

        const listGroup = blockRoot.querySelector('.list-group');
        if (!listGroup) return;

        const itemRows = settingsEl.querySelectorAll('.jse-listitem-row');
        const itemsData = Array.from(itemRows).map((row, i) => {
          const textInp = row.querySelector('[data-listitem-text]');
          return textInp ? textInp.value : `Elemento ${i + 1}`;
        });

        // Rebuild list group
        listGroup.innerHTML = itemsData.map(text =>
          `<li class="list-group-item">${text}</li>`
        ).join('');

        this.syncToCode();
      };

      // ============================================
      // BOOTSTRAP BREADCRUMB SYNC FUNCTION
      // ============================================
      const syncBreadcrumbToComponent = () => {
        const blockRoot = this._currentBlockRoot;
        if (!blockRoot) return;

        const breadcrumbOl = blockRoot.querySelector('.breadcrumb');
        if (!breadcrumbOl) return;

        const bcRows = settingsEl.querySelectorAll('.jse-breadcrumb-row');
        const bcData = Array.from(bcRows).map((row, i) => {
          const textInp = row.querySelector('[data-bc-text]');
          const urlInp = row.querySelector('[data-bc-url]');
          return {
            text: textInp ? textInp.value : `Link ${i + 1}`,
            url: urlInp ? urlInp.value : '#'
          };
        });

        // Rebuild breadcrumb - last item is always active (no link)
        breadcrumbOl.innerHTML = bcData.map((item, i) => {
          const isLast = i === bcData.length - 1;
          if (isLast) {
            return `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
          }
          return `<li class="breadcrumb-item"><a href="${item.url}">${item.text}</a></li>`;
        }).join('');

        this.syncToCode();
      };

      // Edit slide src/alt OR tab title OR accordion title OR listgroup item OR breadcrumb
      settingsEl.addEventListener('input', e => {
        if (e.target.dataset.slideSrc !== undefined || e.target.dataset.slideAlt !== undefined) {
          syncSlidesToCarousel();
        } else if (e.target.dataset.tabTitle !== undefined) {
          syncTabsToComponent();
        } else if (e.target.dataset.accTitle !== undefined) {
          syncAccordionToComponent();
        } else if (e.target.dataset.listitemText !== undefined) {
          syncListGroupToComponent();
        } else if (e.target.dataset.bcText !== undefined || e.target.dataset.bcUrl !== undefined) {
          syncBreadcrumbToComponent();
        }
      });

      // Delete/Add slide OR tab
      settingsEl.addEventListener('click', e => {
        const delBtn = e.target.closest('[data-slide-del]');
        if (delBtn) {
          const row = delBtn.closest('.jse-slide-row');
          if (row) {
            row.remove();
            // Reindex remaining rows
            settingsEl.querySelectorAll('.jse-slide-row').forEach((r, i) => {
              r.dataset.slideIdx = i;
              r.querySelector('strong').textContent = `Slide ${i + 1}`;
              const srcInp = r.querySelector('[data-slide-src]');
              const altInp = r.querySelector('[data-slide-alt]');
              const delB = r.querySelector('[data-slide-del]');
              if (srcInp) srcInp.dataset.slideSrc = i;
              if (altInp) altInp.dataset.slideAlt = i;
              if (delB) delB.dataset.slideDel = i;
            });
            syncSlidesToCarousel();
          }
          return;
        }

        const addBtn = e.target.closest('[data-slide-add]');
        if (addBtn) {
          const editor = addBtn.closest('[data-slides-editor]');
          if (!editor) return;
          const count = editor.querySelectorAll('.jse-slide-row').length;
          const newRow = document.createElement('div');
          newRow.className = 'jse-slide-row';
          newRow.dataset.slideIdx = count;
          newRow.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-bottom:8px;padding:8px;border:1px solid var(--jse-border);border-radius:4px;background:var(--jse-bg-alt)';
          newRow.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <strong style="font-size:11px;color:var(--jse-text-muted)">Slide ${count + 1}</strong>
              <button type="button" data-slide-del="${count}" style="padding:2px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);cursor:pointer;font-size:11px;line-height:1" title="${t('toolbar.delete')}">&times;</button>
            </div>
            <input type="text" data-slide-src="${count}" value="https://picsum.photos/1200/500?random=${count + 10}" placeholder="${t('setting.slideUrl')}" style="width:100%;padding:4px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px">
            <input type="text" data-slide-alt="${count}" value="Slide ${count + 1}" placeholder="${t('setting.slideAlt')}" style="width:100%;padding:4px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px">
          `;
          addBtn.before(newRow);
          syncSlidesToCarousel();
          return;
        }

        // Tab delete button
        const tabDelBtn = e.target.closest('[data-tab-del]');
        if (tabDelBtn) {
          const row = tabDelBtn.closest('.jse-tab-row');
          if (row) {
            row.remove();
            // Reindex remaining rows
            settingsEl.querySelectorAll('.jse-tab-row').forEach((r, i) => {
              r.dataset.tabIdx = i;
              const titleInp = r.querySelector('[data-tab-title]');
              const delB = r.querySelector('[data-tab-del]');
              if (titleInp) titleInp.dataset.tabTitle = i;
              if (delB) delB.dataset.tabDel = i;
            });
            syncTabsToComponent();
            // Refresh settings panel to show updated tab list
            this.updateAttrInputs();
          }
          return;
        }

        // Tab add button
        const tabAddBtn = e.target.closest('[data-tab-add]');
        if (tabAddBtn) {
          // Add new tab directly to the component
          const blockRoot = this._currentBlockRoot;
          if (!blockRoot) return;
          const navTabs = blockRoot.querySelector('.nav-tabs');
          const tabContent = blockRoot.querySelector('.tab-content');
          if (!navTabs || !tabContent) return;

          const tabsId = navTabs.getAttribute('id') || 'tabs1';
          const count = navTabs.querySelectorAll('.nav-link').length;

          // Add new nav item
          const newNavItem = document.createElement('li');
          newNavItem.className = 'nav-item';
          newNavItem.setAttribute('role', 'presentation');
          newNavItem.innerHTML = `<button class="nav-link" data-bs-toggle="tab" data-bs-target="#${tabsId}-${count + 1}" type="button" role="tab">Tab ${count + 1}</button>`;
          navTabs.appendChild(newNavItem);

          // Add new pane with placeholder
          const newPane = document.createElement('div');
          newPane.className = 'tab-pane fade';
          newPane.id = `${tabsId}-${count + 1}`;
          newPane.setAttribute('role', 'tabpanel');
          newPane.innerHTML = '<p class="text-muted">Arrastra bloques aquí</p>';
          tabContent.appendChild(newPane);

          this.syncToCode();
          // Refresh settings panel to show new tab
          this.updateAttrInputs();
        }

        // Accordion delete button
        const accDelBtn = e.target.closest('[data-acc-del]');
        if (accDelBtn) {
          const row = accDelBtn.closest('.jse-accordion-row');
          if (row) {
            row.remove();
            // Reindex remaining rows
            settingsEl.querySelectorAll('.jse-accordion-row').forEach((r, i) => {
              r.dataset.accIdx = i;
              const titleInp = r.querySelector('[data-acc-title]');
              const delB = r.querySelector('[data-acc-del]');
              if (titleInp) titleInp.dataset.accTitle = i;
              if (delB) delB.dataset.accDel = i;
            });
            syncAccordionToComponent();
            this.updateAttrInputs();
          }
          return;
        }

        // Accordion add button
        const accAddBtn = e.target.closest('[data-acc-add]');
        if (accAddBtn) {
          const blockRoot = this._currentBlockRoot;
          if (!blockRoot) return;
          const accordion = blockRoot.querySelector('.accordion');
          if (!accordion) return;

          const accId = accordion.getAttribute('id') || 'acc1';
          const count = accordion.querySelectorAll('.accordion-item').length;

          // Add new accordion item (collapsed by default)
          const newItem = document.createElement('div');
          newItem.className = 'accordion-item';
          newItem.innerHTML = `
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${accId}-c${count + 1}">Sección ${count + 1}</button>
            </h2>
            <div id="${accId}-c${count + 1}" class="accordion-collapse collapse" data-bs-parent="#${accId}">
              <div class="accordion-body"><p class="text-muted">Arrastra bloques aquí</p></div>
            </div>
          `;
          accordion.appendChild(newItem);

          this.syncToCode();
          this.updateAttrInputs();
        }

        // List Group delete button
        const listitemDelBtn = e.target.closest('[data-listitem-del]');
        if (listitemDelBtn) {
          const row = listitemDelBtn.closest('.jse-listitem-row');
          if (row) {
            row.remove();
            // Reindex remaining rows
            settingsEl.querySelectorAll('.jse-listitem-row').forEach((r, i) => {
              r.dataset.listitemIdx = i;
              const textInp = r.querySelector('[data-listitem-text]');
              const delB = r.querySelector('[data-listitem-del]');
              if (textInp) textInp.dataset.listitemText = i;
              if (delB) delB.dataset.listitemDel = i;
            });
            syncListGroupToComponent();
            this.updateAttrInputs();
          }
          return;
        }

        // List Group add button
        const listitemAddBtn = e.target.closest('[data-listitem-add]');
        if (listitemAddBtn) {
          const blockRoot = this._currentBlockRoot;
          if (!blockRoot) return;
          const listGroup = blockRoot.querySelector('.list-group');
          if (!listGroup) return;

          const count = listGroup.querySelectorAll('.list-group-item').length;

          // Add new list item
          const newItem = document.createElement('li');
          newItem.className = 'list-group-item';
          newItem.textContent = `Elemento ${count + 1}`;
          listGroup.appendChild(newItem);

          this.syncToCode();
          this.updateAttrInputs();
        }

        // Breadcrumb delete button
        const bcDelBtn = e.target.closest('[data-bc-del]');
        if (bcDelBtn) {
          const row = bcDelBtn.closest('.jse-breadcrumb-row');
          if (row) {
            row.remove();
            // Reindex remaining rows
            settingsEl.querySelectorAll('.jse-breadcrumb-row').forEach((r, i) => {
              r.dataset.bcIdx = i;
              const textInp = r.querySelector('[data-bc-text]');
              const urlInp = r.querySelector('[data-bc-url]');
              const delB = r.querySelector('[data-bc-del]');
              if (textInp) textInp.dataset.bcText = i;
              if (urlInp) urlInp.dataset.bcUrl = i;
              if (delB) delB.dataset.bcDel = i;
            });
            syncBreadcrumbToComponent();
            this.updateAttrInputs();
          }
          return;
        }

        // Breadcrumb add button
        const bcAddBtn = e.target.closest('[data-bc-add]');
        if (bcAddBtn) {
          const blockRoot = this._currentBlockRoot;
          if (!blockRoot) return;
          const breadcrumbOl = blockRoot.querySelector('.breadcrumb');
          if (!breadcrumbOl) return;

          // Insert new link BEFORE the last (active) item
          const items = breadcrumbOl.querySelectorAll('.breadcrumb-item');
          const count = items.length;
          const newItem = document.createElement('li');
          newItem.className = 'breadcrumb-item';
          newItem.innerHTML = `<a href="#">Enlace ${count}</a>`;

          // The last item is active - convert it back if needed, and insert before it
          const lastItem = items[items.length - 1];
          if (lastItem) {
            breadcrumbOl.insertBefore(newItem, lastItem);
          } else {
            breadcrumbOl.appendChild(newItem);
          }

          this.syncToCode();
          this.updateAttrInputs();
        }
      });

    }

    toggleFullscreen() {
      const isFs = this.root.classList.toggle('jse-fullscreen');
      const btn = this.root.querySelector('.jse-fullscreen-btn');
      if (btn) btn.innerHTML = isFs ? Icons.exitFullscreen : Icons.fullscreen;
      if (btn) btn.title = isFs ? 'Exit fullscreen' : t('btn.fullscreen');
      if (isFs) {
        this._origWidth = this.root.style.width;
        this._origHeight = this.root.style.height;
        // Detect highest z-index on the page and go above it
        let maxZ = 0;
        for (const el of document.querySelectorAll('*')) {
          const z = parseInt(getComputedStyle(el).zIndex, 10);
          if (z > maxZ) maxZ = z;
        }
        this.root.style.zIndex = maxZ + 10;
      } else {
        this.root.style.width = this._origWidth || '';
        this.root.style.height = this._origHeight || '';
        this.root.style.zIndex = '';
      }
    }

    _initPanelResize() {
      const leftHandle = this.root.querySelector('.jse-resize-left');
      const rightHandle = this.root.querySelector('.jse-resize-right');
      const leftPanel = this.root.querySelector('.jse-panel-left');
      const rightPanel = this.root.querySelector('.jse-panel-right');

      const startResize = (handle, panel, direction) => {
        if (!handle || !panel) return;
        handle.addEventListener('mousedown', e => {
          e.preventDefault();
          const startX = e.clientX;
          const startW = panel.offsetWidth;
          handle.classList.add('dragging');
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
          // Cover iframe so mousemove doesn't get swallowed
          const overlay = document.createElement('div');
          overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;cursor:col-resize';
          document.body.appendChild(overlay);

          const onMove = ev => {
            const delta = direction === 'left' ? ev.clientX - startX : startX - ev.clientX;
            const newW = Math.max(150, Math.min(500, startW + delta));
            panel.style.width = newW + 'px';
            panel.style.minWidth = newW + 'px';
          };
          const onUp = () => {
            handle.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            overlay.remove();
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          };
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      };

      startResize(leftHandle, leftPanel, 'left');
      startResize(rightHandle, rightPanel, 'right');
    }

    initFrame() {
      if (!this.frame) return;
      const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="${this.config.bootstrapCss}" rel="stylesheet">
<style>
body{min-height:100vh;padding:10px}
[data-selected]{outline:none!important;box-shadow:inset 0 0 0 3px #f97316!important;position:relative;z-index:1}
[data-hover]:not([data-selected]){outline:2px dashed #007acc!important;outline-offset:-2px}
.jse-drop-indicator{position:absolute;pointer-events:none;z-index:9999;left:0;height:3px;background:#007acc;border-radius:2px;box-shadow:0 0 8px rgba(0,122,204,0.6);transition:top .08s ease,left .08s ease,width .08s ease}
.jse-drop-indicator::before,.jse-drop-indicator::after{content:'';position:absolute;top:-4px;width:11px;height:11px;border-radius:50%;background:#007acc;box-shadow:0 0 4px rgba(0,122,204,0.5)}
.jse-drop-indicator::before{left:-2px}
.jse-drop-indicator::after{right:-2px}
.jse-drop-indicator.drop-inside{height:auto;background:rgba(0,122,204,0.06);border:2px dashed #007acc;border-radius:4px;box-shadow:none}
.jse-drop-indicator.drop-inside::before,.jse-drop-indicator.drop-inside::after{display:none}
.jse-drop-indicator.drop-horizontal{width:3px!important;height:auto;border-radius:2px}
.jse-drop-indicator.drop-horizontal::before,.jse-drop-indicator.drop-horizontal::after{left:-4px;top:auto;width:11px;height:11px}
.jse-drop-indicator.drop-horizontal::before{top:-2px}
.jse-drop-indicator.drop-horizontal::after{top:auto;bottom:-2px;right:auto;left:-4px}
.jse-element-toolbar{position:absolute;display:flex;gap:2px;padding:3px;background:#007acc;border-radius:5px;box-shadow:0 2px 8px rgba(0,0,0,0.3);z-index:9998;align-items:center}
.jse-element-toolbar button{width:24px;height:24px;border:none;background:rgba(255,255,255,0.15);color:#fff;border-radius:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;padding:0}
.jse-element-toolbar button:hover{background:rgba(255,255,255,0.35)}
.jse-element-toolbar button svg{width:14px;height:14px;fill:currentColor}
.jse-drag-handle{cursor:grab!important;width:26px!important;height:26px!important;background:rgba(255,255,255,0.25)!important;border-radius:4px!important}
.jse-drag-handle:active{cursor:grabbing!important}
.jse-drag-handle svg{width:16px;height:16px;fill:currentColor;pointer-events:none}
.jse-tb-sep{width:1px;height:18px;background:rgba(255,255,255,0.25);margin:0 2px}
.jse-element-dragging{opacity:0.4!important;outline:2px dashed #007acc!important}
.jse-show-outlines div,.jse-show-outlines section,.jse-show-outlines article,.jse-show-outlines header,.jse-show-outlines footer,.jse-show-outlines nav,.jse-show-outlines aside,.jse-show-outlines main{outline:1px dashed rgba(0,122,204,0.4)!important;outline-offset:-1px}
.jse-show-outlines div:hover,.jse-show-outlines section:hover{outline-color:rgba(0,122,204,0.8)!important}
</style>
</head><body></body></html>`;
      this.frame.srcdoc = html;
      this.frame.onload = () => this.setupFrame();
    }

    setupFrame() {
      const doc = this.frame?.contentDocument;
      if (!doc) return;
      const body = doc.body;
      this.dropIndicator = null;
      this.dropTarget = null;
      this.elementToolbar = null;

      body.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        // Handle Bootstrap tabs click - switch active tab/pane
        const tabBtn = e.target.closest('[data-bs-toggle="tab"]');
        if (tabBtn) {
          const targetSelector = tabBtn.getAttribute('data-bs-target');
          if (targetSelector) {
            const tabsWrapper = tabBtn.closest('.shou-tabs-wrapper');
            if (tabsWrapper) {
              // Remove active from all tabs and panes
              tabsWrapper.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
              tabsWrapper.querySelectorAll('.tab-pane').forEach(p => {
                p.classList.remove('show', 'active');
              });
              // Activate clicked tab and its pane
              tabBtn.classList.add('active');
              const pane = tabsWrapper.querySelector(targetSelector);
              if (pane) {
                pane.classList.add('show', 'active');
              }
            }
          }
        }

        // Handle Modal open/close
        const modalTrigger = e.target.closest('.shou-modal-trigger');
        if (modalTrigger) {
          const wrapper = modalTrigger.closest('.shou-modal-wrapper');
          if (wrapper) {
            const modal = wrapper.querySelector('.shou-modal-overlay');
            if (modal) {
              modal.style.display = 'block';
            }
          }
        }

        // Close modal when clicking close buttons or backdrop (but not modal content)
        const modalCloseBtn = e.target.closest('.shou-modal-close, .shou-modal-close-x');
        const clickedOnBackdrop = e.target.classList.contains('shou-modal-overlay');
        if (modalCloseBtn || clickedOnBackdrop) {
          const modal = modalCloseBtn ? modalCloseBtn.closest('.shou-modal-overlay') : e.target;
          if (modal) {
            modal.style.display = 'none';
          }
        }

        // Handle Bootstrap accordion click - toggle sections
        const accordionBtn = e.target.closest('[data-bs-toggle="collapse"]');
        if (accordionBtn) {
          const accordionWrapper = accordionBtn.closest('.shou-accordion-wrapper');
          if (accordionWrapper) {
            const targetId = accordionBtn.getAttribute('data-bs-target');
            const collapseEl = targetId ? accordionWrapper.querySelector(targetId) : null;
            if (collapseEl) {
              const isOpen = collapseEl.classList.contains('show');
              const accordion = accordionBtn.closest('.accordion');
              const parentSelector = collapseEl.getAttribute('data-bs-parent');

              // If accordion parent is set, close other sections first
              if (parentSelector && accordion) {
                accordion.querySelectorAll('.accordion-collapse.show').forEach(c => {
                  if (c !== collapseEl) {
                    c.classList.remove('show');
                    const btn = accordion.querySelector(`[data-bs-target="#${c.id}"]`);
                    if (btn) btn.classList.add('collapsed');
                  }
                });
              }

              // Toggle current section
              if (isOpen) {
                collapseEl.classList.remove('show');
                accordionBtn.classList.add('collapsed');
              } else {
                collapseEl.classList.add('show');
                accordionBtn.classList.remove('collapsed');
              }

              this.syncToCode();
            }
          }
        }

        this.selectElement(e.target === body ? null : e.target);
      });
      // Double-click selects the parent element (to reach table, div, etc.)
      body.addEventListener('dblclick', e => {
        e.preventDefault();
        e.stopPropagation();
        if (this.selectedElement && this.selectedElement.parentNode && this.selectedElement.parentNode !== body) {
          this.selectElement(this.selectedElement.parentNode);
        }
      });
      body.addEventListener('mouseover', e => {
        if (e.target !== body && e.target !== this.selectedElement && !e.target.classList.contains('jse-drop-indicator') && !e.target.closest('.jse-element-toolbar')) {
          e.target.setAttribute('data-hover', 'true');
        }
      });
      body.addEventListener('mouseout', e => e.target.removeAttribute('data-hover'));

      // Drag & drop with indicator
      body.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.showDropIndicator(e, doc);
      });
      body.addEventListener('dragleave', e => {
        if (e.target === body || !body.contains(e.relatedTarget)) {
          this.hideDropIndicator(doc);
        }
      });
      body.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        if (id && this.dropTarget) {
          this.insertBlockAtPosition(id, this.dropTarget.element, this.dropTarget.position);
        }
        this.hideDropIndicator(doc);
      });

      body.addEventListener('dblclick', e => {
        if (e.target !== body && !e.target.closest('.jse-element-toolbar')) {
          e.target.contentEditable = 'true';
          e.target.focus();
        }
      });
      body.addEventListener('blur', e => {
        if (e.target.contentEditable === 'true') {
          e.target.contentEditable = 'false';
          this.syncToCode();
        }
      }, true);
      body.addEventListener('keydown', e => {
        const mod = e.ctrlKey || e.metaKey;
        if (mod && e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) this.redo(); else this.undo();
          return;
        } else if (mod && e.key === 'y') {
          e.preventDefault();
          this.redo();
          return;
        } else if (mod && e.key === 'c' && this.selectedElement) {
          e.preventDefault();
          this.clipboard = this.selectedElement.outerHTML;
        } else if (mod && e.key === 'x' && this.selectedElement) {
          e.preventDefault();
          this.clipboard = this.selectedElement.outerHTML;
          this.deleteSelected();
        } else if (mod && e.key === 'v' && this.clipboard) {
          e.preventDefault();
          if (this.selectedElement) {
            this.selectedElement.insertAdjacentHTML('afterend', this.clipboard);
          } else {
            body.insertAdjacentHTML('beforeend', this.clipboard);
          }
          this.syncToCode();
          this.updateLayers();
        } else if (this.selectedElement && e.key === 'Delete') {
          this.deleteSelected();
        } else if (this.selectedElement && e.key === 'Escape') {
          this.selectElement(null);
        } else if (this.selectedElement && e.altKey && e.key === 'ArrowUp') {
          e.preventDefault();
          this._moveElementUp();
        } else if (this.selectedElement && e.altKey && e.key === 'ArrowDown') {
          e.preventDefault();
          this._moveElementDown();
        } else if (this.selectedElement && e.altKey && e.key === 'ArrowLeft') {
          e.preventDefault();
          this._moveElementOut();
        } else if (this.selectedElement && e.altKey && e.key === 'ArrowRight') {
          e.preventDefault();
          this._moveElementInto();
        }
      });

      this.updateLayers();

      // Re-apply outlines if they were active
      if (this._outlinesActive) {
        body.classList.add('jse-show-outlines');
      }
    }

    // Detect if a parent lays out its children horizontally
    _isHorizontalLayout(parent) {
      const win = parent.ownerDocument.defaultView;
      if (!win) return false;
      const style = win.getComputedStyle(parent);
      const display = style.display;
      if (display === 'flex' || display === 'inline-flex') {
        const dir = style.flexDirection;
        return dir === 'row' || dir === 'row-reverse' || dir === '';
      }
      if (display === 'grid' || display === 'inline-grid') {
        const cols = style.gridTemplateColumns;
        return cols && cols.split(' ').filter(c => c && c !== 'none').length > 1;
      }
      return false;
    }

    // Determine drop target and position based on mouse coordinates.
    // Returns { element, position } where position is 'before'|'after'|'inside'|'append'.
    // Strategy: walk up from elementFromPoint to find the best insertion gap.
    _resolveDropTarget(doc, mouseX, mouseY, draggedEl) {
      const body = doc.body;
      let hit = doc.elementFromPoint(mouseX, mouseY);

      // Skip our own UI elements
      if (!hit || hit.classList.contains('jse-drop-indicator')) return null;
      if (hit.closest('.jse-element-toolbar')) return null;
      if (draggedEl && (hit === draggedEl || hit.closest('.jse-element-dragging'))) return null;

      // If body itself, append at end
      if (hit === body) return { element: body, position: 'append' };

      // Try to find the right insertion point by scanning the parent's children
      // Start from the hit element and walk up, checking at each level
      let current = hit;
      while (current && current !== body) {
        const parent = current.parentNode;
        if (!parent || parent.nodeType !== 1 && parent !== body) break;

        // Get visible siblings at this level
        const siblings = this._getDropChildren(parent, draggedEl);
        if (siblings.length === 0) {
          current = parent;
          continue;
        }

        // Detect layout direction and find best gap
        const horiz = this._isHorizontalLayout(parent);
        const result = this._findBestGap(siblings, parent, mouseX, mouseY, horiz, draggedEl);
        if (result) return result;

        current = parent;
      }

      // Fallback: simple before/after on the hit element
      const rect = hit.getBoundingClientRect();
      const parentHoriz = hit.parentNode ? this._isHorizontalLayout(hit.parentNode) : false;
      if (parentHoriz) {
        const relX = mouseX - rect.left;
        return { element: hit, position: relX < rect.width / 2 ? 'before' : 'after', horizontal: true };
      }
      const relY = mouseY - rect.top;
      return { element: hit, position: relY < rect.height / 2 ? 'before' : 'after' };
    }

    // Get filtered children of a container (excluding UI elements and dragged element)
    _getDropChildren(parent, draggedEl) {
      return Array.from(parent.children).filter(c =>
        !c.classList.contains('jse-drop-indicator') &&
        !c.classList.contains('jse-element-toolbar') &&
        c !== draggedEl &&
        !c.classList.contains('jse-element-dragging')
      );
    }

    // Find the best insertion gap among siblings.
    // Uses mouseX for horizontal layouts (flex-row, grid) and mouseY for vertical.
    _findBestGap(siblings, parent, mouseX, mouseY, horizontal, draggedEl) {
      if (siblings.length === 0) {
        return { element: parent, position: 'inside' };
      }

      // Choose primary axis based on layout direction
      const mouse = horizontal ? mouseX : mouseY;

      // Build list of gaps between siblings
      const gaps = [];
      for (let i = 0; i <= siblings.length; i++) {
        let gapPos;
        if (i === 0) {
          const r = siblings[0].getBoundingClientRect();
          gapPos = horizontal ? r.left : r.top;
        } else if (i === siblings.length) {
          const r = siblings[siblings.length - 1].getBoundingClientRect();
          gapPos = horizontal ? r.right : r.bottom;
        } else {
          const rPrev = siblings[i - 1].getBoundingClientRect();
          const rNext = siblings[i].getBoundingClientRect();
          const prevEnd = horizontal ? rPrev.right : rPrev.bottom;
          const nextStart = horizontal ? rNext.left : rNext.top;
          gapPos = (prevEnd + nextStart) / 2;
        }
        gaps.push({
          pos: gapPos,
          index: i,
          element: i < siblings.length ? siblings[i] : siblings[siblings.length - 1],
          position: i < siblings.length ? 'before' : 'after'
        });
      }

      // Find closest gap to mouse
      let bestGap = null;
      let bestDist = Infinity;
      for (const gap of gaps) {
        const dist = Math.abs(mouse - gap.pos);
        if (dist < bestDist) {
          bestDist = dist;
          bestGap = gap;
        }
      }
      if (bestGap && horizontal) bestGap.horizontal = true;

      // Check if mouse is clearly inside a child
      for (const child of siblings) {
        const cr = child.getBoundingClientRect();
        const insideX = mouseX >= cr.left && mouseX <= cr.right;
        const insideY = mouseY >= cr.top && mouseY <= cr.bottom;
        if (insideX && insideY) {
          const canContain = !['IMG','BR','HR','INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(child.tagName);

          // Check edges on the primary axis
          const distStart = horizontal ? (mouseX - cr.left) : (mouseY - cr.top);
          const distEnd = horizontal ? (cr.right - mouseX) : (cr.bottom - mouseY);
          const size = horizontal ? cr.width : cr.height;
          const edgeThreshold = Math.min(size * 0.25, 20);

          // Near start edge = before this child
          if (distStart < edgeThreshold) {
            return { element: child, position: 'before', horizontal };
          }
          // Near end edge = after this child
          if (distEnd < edgeThreshold) {
            return { element: child, position: 'after', horizontal };
          }

          // Deep inside a container - recurse into its children
          if (canContain && child.children.length > 0) {
            const innerChildren = this._getDropChildren(child, draggedEl);
            if (innerChildren.length > 0) {
              const innerHoriz = this._isHorizontalLayout(child);
              return this._findBestGap(innerChildren, child, mouseX, mouseY, innerHoriz, draggedEl);
            }
          }

          // Deep inside a leaf or empty container
          if (canContain) {
            return { element: child, position: 'inside' };
          }
          const mid = horizontal ? (cr.left + cr.right) / 2 : (cr.top + cr.bottom) / 2;
          return { element: child, position: mouse < mid ? 'before' : 'after', horizontal };
        }
      }

      // Mouse is in a gap area between children
      return bestGap;
    }

    showDropIndicator(e, doc) {
      if (!this.dropIndicator) {
        this.dropIndicator = doc.createElement('div');
        this.dropIndicator.className = 'jse-drop-indicator';
      }

      const result = this._resolveDropTarget(doc, e.clientX, e.clientY, null);
      if (!result) return;

      this.dropTarget = result;
      this._positionIndicator(result, doc);
    }

    hideDropIndicator(doc) {
      if (this.dropIndicator && this.dropIndicator.parentNode) {
        this.dropIndicator.remove();
      }
      this.dropTarget = null;
    }

    _positionIndicator(result, doc) {
      const body = doc.body;
      const scrollTop = doc.documentElement.scrollTop || body.scrollTop;
      const scrollLeft = doc.documentElement.scrollLeft || body.scrollLeft;
      const { element, position, horizontal } = result;

      // Reset orientation classes
      this.dropIndicator.classList.remove('drop-horizontal', 'drop-inside');

      if (position === 'append') {
        const bRect = body.getBoundingClientRect();
        this.dropIndicator.className = 'jse-drop-indicator';
        this.dropIndicator.style.top = (body.scrollHeight - 4) + 'px';
        this.dropIndicator.style.left = '4px';
        this.dropIndicator.style.width = (bRect.width - 8) + 'px';
        this.dropIndicator.style.height = '';
      } else if (position === 'inside') {
        const rect = element.getBoundingClientRect();
        this.dropIndicator.className = 'jse-drop-indicator drop-inside';
        this.dropIndicator.style.left = (rect.left + scrollLeft) + 'px';
        this.dropIndicator.style.top = (rect.top + scrollTop) + 'px';
        this.dropIndicator.style.width = rect.width + 'px';
        this.dropIndicator.style.height = rect.height + 'px';
      } else if (horizontal) {
        // Vertical bar for horizontal layouts (before/after in flex-row, grid)
        const rect = element.getBoundingClientRect();
        this.dropIndicator.className = 'jse-drop-indicator drop-horizontal';
        const x = position === 'before' ? rect.left : rect.right;
        this.dropIndicator.style.left = (x + scrollLeft - 2) + 'px';
        this.dropIndicator.style.top = (rect.top + scrollTop) + 'px';
        this.dropIndicator.style.width = '3px';
        this.dropIndicator.style.height = rect.height + 'px';
      } else {
        // Horizontal bar for vertical layouts (default)
        const rect = element.getBoundingClientRect();
        this.dropIndicator.className = 'jse-drop-indicator';
        this.dropIndicator.style.left = (rect.left + scrollLeft) + 'px';
        this.dropIndicator.style.width = rect.width + 'px';
        this.dropIndicator.style.height = '';
        if (position === 'before') {
          this.dropIndicator.style.top = (rect.top + scrollTop - 2) + 'px';
        } else {
          this.dropIndicator.style.top = (rect.bottom + scrollTop - 1) + 'px';
        }
      }

      if (!this.dropIndicator.parentNode) {
        body.appendChild(this.dropIndicator);
      }
    }

    insertBlockAtPosition(id, element, position) {
      const block = this.getBlockById(id);
      if (!block || !this.frame?.contentDocument) return;
      if (block.css) this.injectBlockCSS(block);
      const body = this.frame.contentDocument.body;
      const el = this._htmlToElement(block.html);
      if (!el) return;
      el.setAttribute('data-jse-block', block.id);

      if (position === 'append' || element === body) {
        body.appendChild(el);
      } else if (position === 'inside') {
        element.appendChild(el);
      } else if (position === 'before') {
        element.before(el);
      } else {
        element.after(el);
      }
      this.syncToCode();
      this.updateLayers();
    }

    createElementToolbar(doc) {
      if (this.elementToolbar) {
        this.elementToolbar.remove();
      }
      const toolbar = doc.createElement('div');
      toolbar.className = 'jse-element-toolbar';
      const isImg = this.selectedElement && this.selectedElement.tagName === 'IMG';
      toolbar.innerHTML = `
        <button type="button" class="jse-drag-handle" title="${t('toolbar.drag')}">${Icons.drag}</button>
        <span class="jse-tb-sep"></span>
        ${isImg ? `<button type="button" data-action="edit-image" title="${t('toolbar.editImage')}">${Icons.editImage}</button>` : ''}
        <button type="button" data-action="duplicate" title="${t('toolbar.duplicate')}">${Icons.duplicate}</button>
        <button type="button" data-action="delete" title="${t('toolbar.delete')}">${Icons.delete}</button>
      `;

      // Drag handle for moving elements
      const handle = toolbar.querySelector('.jse-drag-handle');
      this.setupDragHandle(handle, doc);

      // Action buttons
      toolbar.addEventListener('click', e => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === 'duplicate') {
          this.selectedElement.insertAdjacentHTML('afterend', this.selectedElement.outerHTML);
          this.syncToCode();
          this.updateLayers();
        } else if (action === 'delete') {
          this.deleteSelected();
        } else if (action === 'edit-image' && this.selectedElement?.tagName === 'IMG') {
          this.openImageEditor(this.selectedElement);
        }
      });

      this.elementToolbar = toolbar;
      return toolbar;
    }

    setupDragHandle(handle, doc) {
      let dragging = false;
      let draggedEl = null;

      handle.addEventListener('mousedown', e => {
        e.preventDefault();
        e.stopPropagation();
        if (!this.selectedElement) return;

        dragging = true;
        draggedEl = this.selectedElement;
        draggedEl.classList.add('jse-element-dragging');

        // Hide toolbar while dragging
        if (this.elementToolbar) this.elementToolbar.style.display = 'none';

        const onMouseMove = ev => {
          if (!dragging) return;
          this.showMoveIndicator(ev, doc, draggedEl);
        };

        const onMouseUp = ev => {
          if (!dragging) return;
          dragging = false;
          draggedEl.classList.remove('jse-element-dragging');

          // Perform the move
          if (this.dropTarget && this.dropTarget.element !== draggedEl) {
            this.moveElementToPosition(draggedEl, this.dropTarget.element, this.dropTarget.position);
          }

          this.hideDropIndicator(doc);

          // Re-show toolbar
          if (this.elementToolbar) this.elementToolbar.style.display = 'flex';
          this.updateToolbarPosition();

          doc.removeEventListener('mousemove', onMouseMove);
          doc.removeEventListener('mouseup', onMouseUp);
        };

        doc.addEventListener('mousemove', onMouseMove);
        doc.addEventListener('mouseup', onMouseUp);
      });
    }

    showMoveIndicator(e, doc, draggedEl) {
      if (!this.dropIndicator) {
        this.dropIndicator = doc.createElement('div');
        this.dropIndicator.className = 'jse-drop-indicator';
      }

      const result = this._resolveDropTarget(doc, e.clientX, e.clientY, draggedEl);
      if (!result) return;

      this.dropTarget = result;
      this._positionIndicator(result, doc);
    }

    moveElementToPosition(el, target, position) {
      const body = this.frame?.contentDocument?.body;
      if (!body) return;

      if (position === 'append' || target === body) {
        body.appendChild(el);
      } else if (position === 'inside') {
        target.appendChild(el);
      } else if (position === 'before') {
        target.parentNode.insertBefore(el, target);
      } else {
        target.parentNode.insertBefore(el, target.nextSibling);
      }
      this.syncToCode();
      this.updateLayers();
    }

    // Move selected element before its previous sibling
    _moveElementUp() {
      const el = this.selectedElement;
      if (!el) return;
      const prev = el.previousElementSibling;
      if (prev && !prev.classList.contains('jse-element-toolbar') && !prev.classList.contains('jse-drop-indicator')) {
        el.parentNode.insertBefore(el, prev);
        this.syncToCode();
        this.updateLayers();
        this.updateToolbarPosition();
      }
    }

    // Move selected element after its next sibling
    _moveElementDown() {
      const el = this.selectedElement;
      if (!el) return;
      const next = el.nextElementSibling;
      if (next && !next.classList.contains('jse-element-toolbar') && !next.classList.contains('jse-drop-indicator')) {
        el.parentNode.insertBefore(next, el);
        this.syncToCode();
        this.updateLayers();
        this.updateToolbarPosition();
      }
    }

    // Move selected element out of its container (to parent level, after the container)
    _moveElementOut() {
      const el = this.selectedElement;
      if (!el) return;
      const parent = el.parentNode;
      const body = this.frame?.contentDocument?.body;
      if (!parent || parent === body) return; // Already at top level
      // Place after the parent container
      parent.parentNode.insertBefore(el, parent.nextSibling);
      this.syncToCode();
      this.updateLayers();
      this.updateToolbarPosition();
    }

    // Move selected element into its next sibling container (append inside)
    _moveElementInto() {
      const el = this.selectedElement;
      if (!el) return;
      // Try next sibling first, then previous sibling
      const next = el.nextElementSibling;
      const prev = el.previousElementSibling;
      const canContain = (node) => node && node.nodeType === 1 &&
        !['IMG','BR','HR','INPUT','TEXTAREA','SELECT','BUTTON'].includes(node.tagName) &&
        !node.classList.contains('jse-element-toolbar') &&
        !node.classList.contains('jse-drop-indicator');

      if (canContain(next)) {
        // Insert as first child of next sibling
        next.insertBefore(el, next.firstChild);
      } else if (canContain(prev)) {
        // Append to previous sibling
        prev.appendChild(el);
      } else {
        return; // No container to move into
      }
      this.syncToCode();
      this.updateLayers();
      this.updateToolbarPosition();
    }

    openImageEditor(imgEl) {
      if (!imgEl || imgEl.tagName !== 'IMG') return;
      if (typeof JSImageEditor === 'undefined') return;

      const modal = document.createElement('div');
      modal.className = 'jse-image-modal';
      modal.innerHTML = '<div class="jse-image-modal-content"></div>';
      this.root.appendChild(modal);

      const content = modal.querySelector('.jse-image-modal-content');
      const editor = JSImageEditor.init(content, {
        theme: this.config.theme,
        width: '100%',
        height: '100%',
        lang: this.config.lang,
        onSave: (base64) => {
          imgEl.src = base64;
          this.syncToCode();
          this.saveToStorage();
          modal.remove();
        },
        onCancel: () => {
          modal.remove();
        }
      });
      editor.loadImage(imgEl.src);
    }

    updateToolbarPosition() {
      if (!this.elementToolbar || !this.selectedElement) return;
      const rect = this.selectedElement.getBoundingClientRect();
      const doc = this.frame?.contentDocument;
      if (!doc) return;
      const scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
      this.elementToolbar.style.left = rect.left + 'px';
      if (rect.top < 36) {
        this.elementToolbar.style.top = (rect.bottom + scrollTop + 6) + 'px';
        this.elementToolbar.style.transform = 'none';
      } else {
        this.elementToolbar.style.top = (rect.top + scrollTop) + 'px';
        this.elementToolbar.style.transform = 'translateY(-100%)';
        this.elementToolbar.style.marginTop = '-6px';
      }
    }

    selectElement(el) {
      const doc = this.frame?.contentDocument;
      if (!doc) return;
      doc.querySelectorAll('[data-selected]').forEach(e => e.removeAttribute('data-selected'));

      // Remove old toolbar
      if (this.elementToolbar) {
        this.elementToolbar.remove();
        this.elementToolbar = null;
      }

      this.selectedElement = el;
      if (el) {
        el.setAttribute('data-selected', 'true');
        // Show mini toolbar
        const toolbar = this.createElementToolbar(doc);
        doc.body.appendChild(toolbar);
        this.updateToolbarPosition();
      }
      this.updateSelectedInfo();
      this.updateCanvasBreadcrumb();
      this.updateStyleInputs();
      this.updateAttrInputs();
      this.highlightLayerForElement(el);
      this._highlightInCodeEditor(el);
    }

    updateCanvasBreadcrumb() {
      const bars = [this.canvasBreadcrumb, this.codeBreadcrumb].filter(Boolean);
      if (!bars.length) return;
      if (!this.selectedElement) {
        bars.forEach(b => { b.classList.remove('visible'); b.innerHTML = ''; });
        return;
      }
      const body = this.frame?.contentDocument?.body;
      const chain = [];
      let node = this.selectedElement;
      while (node && node !== body) {
        chain.unshift(node);
        node = node.parentNode;
      }
      const html = chain.map((n, i) => {
        const tag = n.tagName.toLowerCase();
        const cls = n.className ? '.' + String(n.className).split(' ')[0] : '';
        const isCurrent = i === chain.length - 1;
        return `<span class="jse-breadcrumb${isCurrent ? ' active' : ''}" data-bc-idx="${i}">${tag}${cls}</span>`;
      }).join('<span class="jse-bc-sep"> › </span>');

      bars.forEach(bar => {
        bar.innerHTML = html;
        bar.classList.add('visible');
        bar.querySelectorAll('.jse-breadcrumb').forEach(bc => {
          bc.addEventListener('click', () => {
            const idx = parseInt(bc.dataset.bcIdx);
            if (chain[idx]) this.selectElement(chain[idx]);
          });
        });
      });
    }

    updateSelectedInfo() {
      if (!this.selectedInfo) return;
      if (!this.selectedElement) {
        this.selectedInfo.innerHTML = '<span class="jse-no-sel">' + t('empty.selectElement') + '</span>';
        return;
      }
      const tag = this.selectedElement.tagName.toLowerCase();
      const cls = this.selectedElement.className ? `.${String(this.selectedElement.className).split(' ').slice(0, 2).join('.')}` : '';
      this.selectedInfo.innerHTML = `<strong>&lt;${tag}&gt;</strong> ${cls}`;
    }

    _highlightInCodeEditor(el) {
      const ed = this.codeEditors.html;
      if (!ed?.textarea) return;
      // Clear highlight overlay
      if (this._codeHighlightEl) {
        this._codeHighlightEl.remove();
        this._codeHighlightEl = null;
      }
      if (!el) return;

      // Build opening tag to search for in code
      const tag = el.tagName.toLowerCase();
      const html = el.outerHTML;
      // Extract opening tag: everything up to first >
      const openEnd = html.indexOf('>');
      if (openEnd < 0) return;
      // Clean internal attributes from the opening tag
      let openTag = html.substring(0, openEnd + 1)
        .replace(/\s*data-jse-block="[^"]*"/g, '')
        .replace(/\s*data-selected="[^"]*"/g, '')
        .replace(/\s*data-hover="[^"]*"/g, '');

      // Find in code (try exact match first)
      const code = this.code.html;
      let idx = code.indexOf(openTag);

      // If not found, try matching just tag + class
      if (idx < 0) {
        const cls = el.getAttribute('class');
        const search = cls ? `<${tag} class="${cls}"` : `<${tag}`;
        // Find Nth occurrence matching this element's position
        const body = this.frame?.contentDocument?.body;
        if (!body) return;
        const allSame = body.querySelectorAll(cls ? `${tag}.${cls.split(' ')[0]}` : tag);
        let nth = 0;
        for (let i = 0; i < allSame.length; i++) {
          if (allSame[i] === el) { nth = i; break; }
        }
        let pos = -1;
        for (let n = 0; n <= nth; n++) {
          pos = code.indexOf(search, pos + 1);
          if (pos < 0) return;
        }
        idx = pos;
      }
      if (idx < 0) return;

      // Find the full element end (closing tag or self-closing)
      const voidTags = new Set(['img','br','hr','input','meta','link','area','base','col','embed','source','track','wbr']);
      let endIdx;
      if (voidTags.has(tag)) {
        endIdx = code.indexOf('>', idx) + 1;
      } else {
        // Find matching closing tag (simple: find </tag> counting nesting)
        let depth = 0;
        let i = idx;
        const openRe = new RegExp(`<${tag}[\\s>/]`, 'gi');
        const closeRe = new RegExp(`</${tag}>`, 'gi');
        // Find closing tag position
        openRe.lastIndex = idx;
        closeRe.lastIndex = idx;
        depth = 1;
        const startAfter = code.indexOf('>', idx) + 1;
        openRe.lastIndex = startAfter;
        closeRe.lastIndex = startAfter;
        while (depth > 0) {
          const om = openRe.exec(code);
          const cm = closeRe.exec(code);
          if (!cm) { endIdx = code.length; break; }
          if (om && om.index < cm.index) {
            depth++;
            closeRe.lastIndex = om.index + 1;
            openRe.lastIndex = om.index + 1;
          } else {
            depth--;
            if (depth === 0) {
              endIdx = cm.index + cm[0].length;
            } else {
              openRe.lastIndex = cm.index + 1;
              closeRe.lastIndex = cm.index + 1;
            }
          }
        }
      }
      if (!endIdx) endIdx = code.indexOf('>', idx) + 1;

      // Select range in textarea and scroll to it
      const ta = ed.textarea;
      ta.focus();
      ta.setSelectionRange(idx, endIdx);

      // Scroll to the selection
      const linesBefore = code.substring(0, idx).split('\n').length - 1;
      const lineH = parseFloat(getComputedStyle(ta).lineHeight) || 20.8;
      const scrollTo = linesBefore * lineH - ta.clientHeight / 3;
      ta.scrollTop = Math.max(0, scrollTo);
      if (ed.highlight?.parentElement) ed.highlight.parentElement.scrollTop = ta.scrollTop;
      if (ed.lines) ed.lines.scrollTop = ta.scrollTop;
    }

    // ============================================
    // CODE FOLDING
    // ============================================

    // Detect foldable regions in code by language
    _detectFoldRegions(code, lang) {
      const lines = code.split('\n');
      const regions = [];

      if (lang === 'html') {
        // HTML: match opening/closing tag pairs that span multiple lines
        const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
        const stack = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // Find opening tags
          const openRe = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(?:\/)?>/g;
          let m;
          while ((m = openRe.exec(line))) {
            const tag = m[1].toLowerCase();
            if (voidTags.has(tag)) continue;
            // Check if self-closing
            if (m[0].endsWith('/>')) continue;
            stack.push({ tag, line: i });
          }
          // Find closing tags
          const closeRe = /<\/([a-zA-Z][a-zA-Z0-9]*)\s*>/g;
          while ((m = closeRe.exec(line))) {
            const tag = m[1].toLowerCase();
            // Find matching opening tag in stack (search from top)
            for (let j = stack.length - 1; j >= 0; j--) {
              if (stack[j].tag === tag) {
                const start = stack[j].line;
                if (i > start) {
                  regions.push({ start, end: i });
                }
                stack.splice(j, 1);
                break;
              }
            }
          }
        }
      } else {
        // CSS / JS: match bracket pairs { } that span multiple lines
        // Also ( ) and [ ] for JS
        const openers = lang === 'js' ? ['{', '(', '['] : ['{'];
        const closers = lang === 'js' ? ['}', ')', ']'] : ['}'];
        const stack = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // Skip strings and comments (simplified)
          let inStr = false, strCh = '';
          for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (inStr) {
              if (ch === strCh && line[c - 1] !== '\\') inStr = false;
              continue;
            }
            if (ch === '"' || ch === "'" || ch === '`') {
              inStr = true;
              strCh = ch;
              continue;
            }
            // Single-line comment
            if (ch === '/' && line[c + 1] === '/') break;
            const oi = openers.indexOf(ch);
            if (oi >= 0) {
              stack.push({ bracket: ch, closer: closers[oi], line: i });
            } else {
              const ci = closers.indexOf(ch);
              if (ci >= 0) {
                for (let j = stack.length - 1; j >= 0; j--) {
                  if (stack[j].closer === ch) {
                    const start = stack[j].line;
                    if (i > start) {
                      regions.push({ start, end: i });
                    }
                    stack.splice(j, 1);
                    break;
                  }
                }
              }
            }
          }
        }
      }

      // Sort by start line, then by largest span first (for nesting)
      regions.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
      return regions;
    }

    // Build display code with folded regions collapsed
    _buildDisplayCode(lang) {
      const lines = this.code[lang].split('\n');
      const folded = this._foldState[lang];
      const regions = this._foldRegions[lang];
      const result = [];
      const lineMap = []; // lineMap[displayLine] = realLine
      let i = 0;
      while (i < lines.length) {
        const region = regions.find(r => r.start === i);
        if (region && folded.has(i)) {
          // Collapsed: show first line + marker
          result.push(lines[i] + ' \u25B8\u2026');
          lineMap.push(i);
          i = region.end + 1;
        } else {
          result.push(lines[i]);
          lineMap.push(i);
          i++;
        }
      }
      this._displayToRealMap[lang] = lineMap;
      this._displayCode[lang] = result.join('\n');
      return this._displayCode[lang];
    }

    // Reconstruct real code from display code (after user edits)
    _displayToRealCode(lang, displayText) {
      const displayLines = displayText.split('\n');
      const realLines = this.code[lang].split('\n');
      const map = this._displayToRealMap[lang];
      const folded = this._foldState[lang];
      const regions = this._foldRegions[lang];
      const result = [];
      let di = 0;

      for (let ri = 0; ri < realLines.length; ri++) {
        // Check if this real line is the start of a folded region
        const region = regions.find(r => r.start === ri && folded.has(ri));
        if (region) {
          // This display line has the fold marker — strip it and use as the opening line
          if (di < displayLines.length) {
            let dLine = displayLines[di];
            // Remove fold marker suffix
            dLine = dLine.replace(/\s*\u25B8\u2026$/, '');
            result.push(dLine);
          } else {
            result.push(realLines[ri]);
          }
          // Keep hidden lines from real code unchanged
          for (let h = ri + 1; h <= region.end; h++) {
            result.push(realLines[h]);
          }
          ri = region.end;
          di++;
        } else {
          // Normal visible line
          if (di < displayLines.length) {
            result.push(displayLines[di]);
          }
          di++;
        }
      }
      // Handle new lines added at the end by user
      while (di < displayLines.length) {
        result.push(displayLines[di]);
        di++;
      }
      return result.join('\n');
    }

    // Render line numbers with fold icons
    _renderFoldableLines(lang) {
      const ed = this.codeEditors[lang];
      if (!ed?.lines) return;
      const map = this._displayToRealMap[lang];
      const regions = this._foldRegions[lang];
      const folded = this._foldState[lang];
      const lineCount = (this._displayCode[lang] || this.code[lang]).split('\n').length;

      const spans = [];
      for (let di = 0; di < lineCount; di++) {
        const realLine = map[di] !== undefined ? map[di] : di;
        const region = regions.find(r => r.start === realLine);
        const lineNum = realLine + 1;
        if (region) {
          const isFolded = folded.has(realLine);
          const arrow = isFolded ? '\u25B6' : '\u25BC';
          spans.push(`<span><span class="jse-fold" data-fold-line="${realLine}" title="${isFolded ? 'Unfold' : 'Fold'}">${arrow}</span>${lineNum}</span>`);
        } else {
          spans.push(`<span>${lineNum}</span>`);
        }
      }
      ed.lines.innerHTML = spans.join('\n');
    }

    // Toggle fold at a given real line
    _toggleFold(lang, realLine) {
      const state = this._foldState[lang];
      if (state.has(realLine)) {
        state.delete(realLine);
      } else {
        state.add(realLine);
      }
      this._refreshCodeEditor(lang);
    }

    // Central refresh after fold change or code change
    _refreshCodeEditor(lang) {
      // Re-detect regions
      this._foldRegions[lang] = this._detectFoldRegions(this.code[lang], lang);
      // Clean stale folds
      for (const s of this._foldState[lang]) {
        if (!this._foldRegions[lang].some(r => r.start === s)) {
          this._foldState[lang].delete(s);
        }
      }
      // Build display code
      const display = this._buildDisplayCode(lang);
      const ed = this.codeEditors[lang];
      if (!ed) return;

      // Save cursor position
      const ta = ed.textarea;
      const cursorPos = ta ? ta.selectionStart : 0;

      if (ta) ta.value = display;
      if (ed.highlight) {
        ed.highlight.innerHTML = highlight(display, lang) || '<br>';
      }
      this._renderFoldableLines(lang);

      // Restore cursor
      if (ta) {
        const safePos = Math.min(cursorPos, display.length);
        ta.setSelectionRange(safePos, safePos);
      }
    }

    _buildStylesPanel() {
      const container = $('.jse-styles-editor', this.stylesPanel);
      if (!container || container.children.length) return;
      const sections = (this.stylesDef || DefaultStyles).sections;
      container.innerHTML = sections.map((sec, i) => {
        const rows = sec.props.map(p => {
          let input;
          if (p.type === 'color') {
            input = `<input type="color" data-style="${p.style}">`;
          } else if (p.type === 'select') {
            const opts = (p.options || []).map(o => `<option value="${o}">${o || '(none)'}</option>`).join('');
            input = `<select data-style="${p.style}">${opts}</select>`;
          } else {
            input = `<input type="text" data-style="${p.style}"${p.placeholder ? ` placeholder="${p.placeholder}"` : ''}>`;
          }
          return `<div class="jse-row"><label>${p.label}</label>${input}</div>`;
        }).join('');
        return `<div class="jse-style-section${i === 0 ? ' open' : ''}">
          <div class="jse-section-header"><span>${t(sec.label)}</span><span class="jse-chevron">${Icons.chevron}</span></div>
          <div class="jse-section-body">${rows}</div>
        </div>`;
      }).join('');
    }

    updateStyleInputs() {
      if (!this.selectedElement) return;
      this._buildStylesPanel();
      $$('[data-style]', this.stylesPanel).forEach(el => {
        const prop = el.dataset.style;
        const val = this.selectedElement.style[prop] || '';
        if (el.tagName === 'SELECT') {
          el.value = val;
        } else {
          el.value = val;
        }
      });
    }

    updateAttrInputs() {
      const container = this.attrsPanel;
      const info = this.attrsInfo;
      if (!container) return;
      if (!this.selectedElement) {
        container.innerHTML = '';
        if (info) info.innerHTML = '<span class="jse-no-sel">' + t('empty.selectElement') + '</span>';
        return;
      }
      const el = this.selectedElement;
      const tag = el.tagName.toLowerCase();
      const cls = el.className ? `.${String(el.className).split(' ').slice(0, 2).join('.')}` : '';
      if (info) info.innerHTML = `<strong>&lt;${tag}&gt;</strong> ${cls}`;

      // Check for block-specific settings (on element or ancestors)
      const blockRoot = this._findBlockRoot(el);
      const blockId = blockRoot ? blockRoot.getAttribute('data-jse-block') : null;
      const block = blockId ? this.getBlockById(blockId) : null;

      // Store reference to current block being edited (for tabs/slides sync)
      this._currentBlockRoot = blockRoot;

      if (block && block.settings?.length) {
        container.innerHTML = block.settings.map((s, idx) => {
          const target = s.selector ? blockRoot.querySelector(s.selector) : blockRoot;
          if (!target) return '';

          if (s.type === 'checkbox') {
            const checked = s.attr ? target.hasAttribute(s.attr) : false;
            return `<div class="jse-row"><label>${t(s.label)}</label><input type="checkbox" data-sidx="${idx}" ${checked ? 'checked' : ''}><label class="jse-toggle" data-for-sidx="${idx}"></label></div>`;
          }
          if (s.type === 'select') {
            const val = s.attr ? (target.getAttribute(s.attr) || '') : (s.prop === 'tagName' ? target.tagName : '');
            const opts = (s.options || []).map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o || '(none)'}</option>`).join('');
            return `<div class="jse-row"><label>${t(s.label)}</label><select data-sidx="${idx}">${opts}</select></div>`;
          }
          if (s.type === 'modal-toggle') {
            // Special toggles for modal settings
            const dialog = blockRoot.querySelector('.modal-dialog');
            const closeBtn = blockRoot.querySelector('.shou-modal-close');
            const saveBtn = blockRoot.querySelector('.shou-modal-save');
            let checked = false;
            if (s.prop === 'centered') checked = dialog?.classList.contains('modal-dialog-centered');
            else if (s.prop === 'scrollable') checked = dialog?.classList.contains('modal-dialog-scrollable');
            else if (s.prop === 'showClose') checked = !closeBtn || closeBtn.style.display !== 'none';
            else if (s.prop === 'showSave') checked = !saveBtn || saveBtn.style.display !== 'none';
            return `<div class="jse-row"><label>${t(s.label)}</label><input type="checkbox" data-sidx="${idx}" data-modal-prop="${s.prop}" ${checked ? 'checked' : ''}><label class="jse-toggle" data-for-sidx="${idx}"></label></div>`;
          }
          if (s.type === 'options') {
            const opts = Array.from(target.querySelectorAll('option'));
            const rows = opts.map((o, oi) => {
              const v = (o.getAttribute('value') || '').replace(/"/g, '&quot;');
              const tx = (o.textContent || '').replace(/"/g, '&quot;');
              return `<div class="jse-opt-row" style="display:flex;gap:4px;margin-bottom:4px;align-items:center"><input type="text" data-opt-val="${oi}" value="${v}" placeholder="${t('options.valuePlaceholder')}" style="flex:1;padding:4px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px"><input type="text" data-opt-txt="${oi}" value="${tx}" placeholder="${t('options.textPlaceholder')}" style="flex:2;padding:4px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px"><button data-opt-del="${oi}" style="padding:2px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);cursor:pointer;font-size:11px;line-height:1" title="${t('toolbar.delete')}">&times;</button></div>`;
            }).join('');
            return `<div class="jse-row" style="flex-direction:column;align-items:stretch"><label>${t(s.label)}</label><div data-sidx="${idx}" data-opt-editor="true" style="margin-top:4px">${rows}<button data-opt-add style="width:100%;padding:4px;border:1px dashed var(--jse-border);border-radius:3px;background:transparent;color:var(--jse-accent);cursor:pointer;font-size:11px;margin-top:2px"${t('options.add')}</button></div></div>`;
          }
          if (s.type === 'slides') {
            // Carousel slides editor
            const carouselInner = blockRoot.querySelector('.carousel-inner');
            const slides = carouselInner ? Array.from(carouselInner.querySelectorAll('.carousel-item')) : [];
            const rows = slides.map((slide, si) => {
              const img = slide.querySelector('img');
              const src = img ? (img.getAttribute('src') || '').replace(/"/g, '&quot;') : '';
              const alt = img ? (img.getAttribute('alt') || '').replace(/"/g, '&quot;') : '';
              return `<div class="jse-slide-row" data-slide-idx="${si}" style="display:flex;flex-direction:column;gap:4px;margin-bottom:8px;padding:8px;border:1px solid var(--jse-border);border-radius:4px;background:var(--jse-bg-alt)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                  <strong style="font-size:11px;color:var(--jse-text-muted)">Slide ${si + 1}</strong>
                  <button type="button" data-slide-del="${si}" style="padding:2px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);cursor:pointer;font-size:11px;line-height:1" title="${t('toolbar.delete')}">&times;</button>
                </div>
                <input type="text" data-slide-src="${si}" value="${src}" placeholder="${t('setting.slideUrl')}" style="width:100%;padding:4px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px">
                <input type="text" data-slide-alt="${si}" value="${alt}" placeholder="${t('setting.slideAlt')}" style="width:100%;padding:4px 6px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px">
              </div>`;
            }).join('');
            return `<div class="jse-row" style="flex-direction:column;align-items:stretch"><label>${t(s.label)}</label><div data-sidx="${idx}" data-slides-editor="true" style="margin-top:4px">${rows}<button data-slide-add style="width:100%;padding:6px;border:1px dashed var(--jse-border);border-radius:3px;background:transparent;color:var(--jse-accent);cursor:pointer;font-size:11px;margin-top:2px">${t('setting.addSlide')}</button></div></div>`;
          }
          if (s.type === 'tabs') {
            // Bootstrap Tabs editor - only titles, content is edited visually in canvas
            const navTabs = blockRoot.querySelector('.nav-tabs');
            const tabButtons = navTabs ? Array.from(navTabs.querySelectorAll('.nav-link')) : [];
            const rows = tabButtons.map((btn, ti) => {
              const title = (btn.textContent || '').replace(/"/g, '&quot;');
              return `<div class="jse-tab-row" data-tab-idx="${ti}" style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
                <input type="text" data-tab-title="${ti}" value="${title}" placeholder="${t('setting.tabTitle')}" style="flex:1;padding:6px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:12px">
                <button type="button" data-tab-del="${ti}" style="padding:4px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);cursor:pointer;font-size:12px;line-height:1" title="${t('toolbar.delete')}">&times;</button>
              </div>`;
            }).join('');
            return `<div class="jse-row" style="flex-direction:column;align-items:stretch"><label>${t(s.label)}</label><div data-sidx="${idx}" data-tabs-editor="true" style="margin-top:6px">${rows}<button data-tab-add style="width:100%;padding:8px;border:1px dashed var(--jse-border);border-radius:3px;background:transparent;color:var(--jse-accent);cursor:pointer;font-size:12px;margin-top:4px">${t('setting.addTab')}</button></div><p style="font-size:10px;color:var(--jse-text-muted);margin-top:6px;margin-bottom:0">Edita el contenido de cada pestaña directamente en el canvas</p></div>`;
          }
          if (s.type === 'accordion') {
            // Bootstrap Accordion editor - only titles, content is edited visually in canvas
            const accordion = blockRoot.querySelector('.accordion');
            const items = accordion ? Array.from(accordion.querySelectorAll('.accordion-item')) : [];
            const rows = items.map((item, ai) => {
              const btn = item.querySelector('.accordion-button');
              const title = (btn?.textContent || '').replace(/"/g, '&quot;');
              return `<div class="jse-accordion-row" data-acc-idx="${ai}" style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
                <input type="text" data-acc-title="${ai}" value="${title}" placeholder="${t('setting.sectionTitle')}" style="flex:1;padding:6px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:12px">
                <button type="button" data-acc-del="${ai}" style="padding:4px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);cursor:pointer;font-size:12px;line-height:1" title="${t('toolbar.delete')}">&times;</button>
              </div>`;
            }).join('');
            return `<div class="jse-row" style="flex-direction:column;align-items:stretch"><label>${t(s.label)}</label><div data-sidx="${idx}" data-accordion-editor="true" style="margin-top:6px">${rows}<button data-acc-add style="width:100%;padding:8px;border:1px dashed var(--jse-border);border-radius:3px;background:transparent;color:var(--jse-accent);cursor:pointer;font-size:12px;margin-top:4px">${t('setting.addSection')}</button></div><p style="font-size:10px;color:var(--jse-text-muted);margin-top:6px;margin-bottom:0">Haz click en una sección para editarla en el canvas</p></div>`;
          }
          if (s.type === 'listgroup') {
            // Bootstrap List Group editor - edit item text
            const listGroup = blockRoot.querySelector('.list-group');
            const items = listGroup ? Array.from(listGroup.querySelectorAll('.list-group-item')) : [];
            const rows = items.map((item, li) => {
              const text = (item.textContent || '').replace(/"/g, '&quot;');
              return `<div class="jse-listitem-row" data-listitem-idx="${li}" style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
                <input type="text" data-listitem-text="${li}" value="${text}" placeholder="${t('setting.itemText')}" style="flex:1;padding:6px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:12px">
                <button type="button" data-listitem-del="${li}" style="padding:4px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);cursor:pointer;font-size:12px;line-height:1" title="${t('toolbar.delete')}">&times;</button>
              </div>`;
            }).join('');
            return `<div class="jse-row" style="flex-direction:column;align-items:stretch"><label>${t(s.label)}</label><div data-sidx="${idx}" data-listgroup-editor="true" style="margin-top:6px">${rows}<button data-listitem-add style="width:100%;padding:8px;border:1px dashed var(--jse-border);border-radius:3px;background:transparent;color:var(--jse-accent);cursor:pointer;font-size:12px;margin-top:4px">${t('setting.addItem')}</button></div></div>`;
          }
          if (s.type === 'breadcrumb') {
            // Bootstrap Breadcrumb editor - text + URL per link, last is active
            const breadcrumbOl = blockRoot.querySelector('.breadcrumb');
            const items = breadcrumbOl ? Array.from(breadcrumbOl.querySelectorAll('.breadcrumb-item')) : [];
            const rows = items.map((item, bi) => {
              const isActive = item.classList.contains('active');
              const link = item.querySelector('a');
              const text = (isActive ? item.textContent : link?.textContent || '').replace(/"/g, '&quot;');
              const href = (link?.getAttribute('href') || '#').replace(/"/g, '&quot;');
              return `<div class="jse-breadcrumb-row" data-bc-idx="${bi}" style="display:flex;flex-direction:column;gap:4px;margin-bottom:8px;padding:8px;border:1px solid var(--jse-border);border-radius:4px;background:var(--jse-bg-alt)">
                <div style="display:flex;gap:6px;align-items:center">
                  <input type="text" data-bc-text="${bi}" value="${text}" placeholder="${t('setting.linkText')}" style="flex:1;padding:5px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:12px">
                  <button type="button" data-bc-del="${bi}" style="padding:4px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);cursor:pointer;font-size:12px;line-height:1" title="${t('toolbar.delete')}">&times;</button>
                </div>
                ${!isActive ? `<input type="text" data-bc-url="${bi}" value="${href}" placeholder="${t('setting.linkUrl')}" style="width:100%;padding:5px 8px;border:1px solid var(--jse-border);border-radius:3px;background:var(--jse-bg);color:var(--jse-text);font-size:11px">` : `<span style="font-size:10px;color:var(--jse-text-muted);padding:2px 0">Página actual (sin enlace)</span>`}
              </div>`;
            }).join('');
            return `<div class="jse-row" style="flex-direction:column;align-items:stretch"><label>${t(s.label)}</label><div data-sidx="${idx}" data-breadcrumb-editor="true" style="margin-top:6px">${rows}<button data-bc-add style="width:100%;padding:8px;border:1px dashed var(--jse-border);border-radius:3px;background:transparent;color:var(--jse-accent);cursor:pointer;font-size:12px;margin-top:4px">${t('setting.addLink')}</button></div><p style="font-size:10px;color:var(--jse-text-muted);margin-top:6px;margin-bottom:0">El último enlace se muestra como página actual</p></div>`;
          }

          // Default: text input
          let val = '';
          if (s.attr) {
            val = target.getAttribute(s.attr) || '';
          } else if (s.prop === 'textContent') {
            val = target.textContent || '';
          } else if (s.prop === 'innerHTML') {
            val = target.innerHTML || '';
          }
          return `<div class="jse-row"><label>${t(s.label)}</label><input type="text" data-sidx="${idx}" value="${String(val).replace(/"/g, '&quot;')}"></div>`;
        }).join('');
      } else {
        // Fallback: generic tag-based attributes
        const attrs = [...(TagAttributes._common || []), ...(TagAttributes[tag] || [])];
        if (!attrs.length) { container.innerHTML = ''; return; }

        container.innerHTML = attrs.map(attr => {
          if (BoolAttrs.has(attr)) {
            const checked = el.hasAttribute(attr) ? 'checked' : '';
            return `<div class="jse-row"><label>${attr}</label><input type="checkbox" data-attr="${attr}" ${checked}><label class="jse-toggle" data-for-attr="${attr}"></label></div>`;
          }
          const val = el.getAttribute(attr) || '';
          return `<div class="jse-row"><label>${attr}</label><input type="text" data-attr="${attr}" value="${val.replace(/"/g, '&quot;')}"></div>`;
        }).join('');
      }
    }

    insertBlock(id) {
      const block = this.getBlockById(id);
      if (!block || !this.frame?.contentDocument) return;
      if (block.css) this.injectBlockCSS(block);
      const body = this.frame.contentDocument.body;
      const el = this._htmlToElement(block.html);
      if (!el) return;
      el.setAttribute('data-jse-block', block.id);
      if (this.selectedElement) {
        this.selectedElement.after(el);
      } else {
        body.appendChild(el);
      }
      this.syncToCode();
      this.updateLayers();
    }

    insertBlockAt(id, target) {
      const block = this.getBlockById(id);
      if (!block || !this.frame?.contentDocument) return;
      if (block.css) this.injectBlockCSS(block);
      const el = this._htmlToElement(block.html);
      if (!el) return;
      el.setAttribute('data-jse-block', block.id);
      const body = this.frame.contentDocument.body;
      if (target === body) {
        body.appendChild(el);
      } else {
        target.after(el);
      }
      this.syncToCode();
      this.updateLayers();
    }

    getBlockById(id) {
      for (const cat of Object.values(this.blocks)) {
        const b = cat.find(x => x.id === id);
        if (b) return b;
      }
      return null;
    }

    _findBlockRoot(el) {
      let node = el;
      while (node && node !== this.frame?.contentDocument?.body) {
        if (node.getAttribute && node.getAttribute('data-jse-block')) return node;
        node = node.parentElement;
      }
      return null;
    }

    // Re-tag elements loaded from old storage that lack data-jse-block
    _retagBlocks() {
      const body = this.frame?.contentDocument?.body;
      if (!body) return;
      // Collect all block HTML signatures (first tag + key attrs)
      const allBlocks = [];
      for (const cat of Object.values(this.blocks)) {
        for (const b of cat) allBlocks.push(b);
      }
      // For each direct child of body without data-jse-block, try to match
      for (const child of body.children) {
        if (child.getAttribute('data-jse-block')) continue;
        for (const b of allBlocks) {
          // Quick match: compare normalized tag + key classes
          const tmp = document.createElement('div');
          tmp.innerHTML = b.html.trim();
          const tmpl = tmp.firstElementChild;
          if (!tmpl) continue;
          if (tmpl.tagName === child.tagName &&
              tmpl.className === child.className) {
            child.setAttribute('data-jse-block', b.id);
            break;
          }
        }
      }
    }

    _htmlToElement(html) {
      const doc = this.frame?.contentDocument;
      if (!doc) return null;
      const tmp = doc.createElement('div');
      tmp.innerHTML = html.trim();
      return tmp.firstChild;
    }

    injectBlockCSS(block) {
      const doc = this.frame?.contentDocument;
      if (!doc) return;
      const styleId = 'jse-block-css-' + block.id;
      if (doc.getElementById(styleId)) return;
      const style = doc.createElement('style');
      style.id = styleId;
      style.textContent = block.css;
      doc.head.appendChild(style);
    }

    deleteSelected() {
      if (!this.selectedElement) return;
      if (this.elementToolbar) {
        this.elementToolbar.remove();
        this.elementToolbar = null;
      }
      this.selectedElement.remove();
      this.selectedElement = null;
      this.updateSelectedInfo();
      this.syncToCode();
      this.updateLayers();
    }

    updateLayers() {
      if (!this.layersPanel || !this.frame?.contentDocument) return;
      const body = this.frame.contentDocument.body;
      // Re-apply outlines class if active (body.innerHTML resets it)
      if (this._outlinesActive && !body.classList.contains('jse-show-outlines')) {
        body.classList.add('jse-show-outlines');
      }
      if (!body.children.length) {
        this.layersPanel.innerHTML = '<div class="jse-empty">' + t('empty.dragElements') + '</div>';
        return;
      }
      this.layerIndex = 0;
      this.layerElements = [];
      this.layersPanel.innerHTML = this.renderLayerNode(body, 0);
      this.bindLayerEvents();
    }

    renderLayerNode(node, depth) {
      if (node.nodeType !== 1 || ['SCRIPT', 'STYLE', 'LINK'].includes(node.tagName)) return '';
      if (node.classList.contains('jse-drop-indicator') || node.classList.contains('jse-element-toolbar')) return '';
      const tag = node.tagName.toLowerCase();
      const cls = node.className ? `.${String(node.className).split(' ')[0]}` : '';
      const idx = this.layerIndex++;
      this.layerElements.push(node);
      const indent = depth > 0 ? `<span class="jse-layer-indent" style="width:${depth * 12}px"></span>` : '';
      const children = Array.from(node.children).map(c => this.renderLayerNode(c, depth + 1)).join('');
      return `<div class="jse-layer" data-layer-idx="${idx}" draggable="true">${indent}<span class="jse-layer-tag">&lt;${tag}&gt;</span>${cls ? `<span style="opacity:0.6">${cls}</span>` : ''}</div>${children}`;
    }

    bindLayerEvents() {
      let dragSrcIdx = null;

      $$('.jse-layer', this.layersPanel).forEach(layer => {
        // Click to select
        layer.addEventListener('click', () => {
          const idx = parseInt(layer.dataset.layerIdx);
          const el = this.layerElements[idx];
          if (el) this.selectElement(el);
        });

        // Drag start
        layer.addEventListener('dragstart', e => {
          dragSrcIdx = parseInt(layer.dataset.layerIdx);
          layer.classList.add('jse-layer-dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', dragSrcIdx);
        });

        // Drag over
        layer.addEventListener('dragover', e => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          const rect = layer.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const third = rect.height / 3;
          layer.classList.remove('jse-layer-drop-before', 'jse-layer-drop-after', 'jse-layer-drop-inside');
          if (y < third) {
            layer.classList.add('jse-layer-drop-before');
          } else if (y > third * 2) {
            layer.classList.add('jse-layer-drop-after');
          } else {
            layer.classList.add('jse-layer-drop-inside');
          }
        });

        // Drag leave
        layer.addEventListener('dragleave', () => {
          layer.classList.remove('jse-layer-drop-before', 'jse-layer-drop-after', 'jse-layer-drop-inside');
        });

        // Drop
        layer.addEventListener('drop', e => {
          e.preventDefault();
          layer.classList.remove('jse-layer-drop-before', 'jse-layer-drop-after', 'jse-layer-drop-inside');
          const targetIdx = parseInt(layer.dataset.layerIdx);
          if (dragSrcIdx === null || dragSrcIdx === targetIdx) return;

          const srcEl = this.layerElements[dragSrcIdx];
          const targetEl = this.layerElements[targetIdx];
          if (!srcEl || !targetEl) return;
          // Don't allow dropping into own descendants
          if (srcEl.contains(targetEl)) return;

          const rect = layer.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const third = rect.height / 3;

          if (y < third) {
            targetEl.parentNode.insertBefore(srcEl, targetEl);
          } else if (y > third * 2) {
            targetEl.parentNode.insertBefore(srcEl, targetEl.nextSibling);
          } else {
            // Drop inside container
            const canContain = !['IMG','BR','HR','INPUT','TEXTAREA','SELECT','BUTTON'].includes(targetEl.tagName);
            if (canContain) {
              targetEl.appendChild(srcEl);
            } else {
              targetEl.parentNode.insertBefore(srcEl, targetEl.nextSibling);
            }
          }

          this.syncToCode();
          this.updateLayers();
          this.selectElement(srcEl);
        });

        // Drag end
        layer.addEventListener('dragend', () => {
          layer.classList.remove('jse-layer-dragging');
          dragSrcIdx = null;
        });
      });
    }

    highlightLayerForElement(el) {
      $$('.jse-layer', this.layersPanel).forEach(layer => layer.classList.remove('selected'));
      if (!el) return;
      const idx = this.layerElements?.indexOf(el);
      if (idx >= 0) {
        const layer = $(`.jse-layer[data-layer-idx="${idx}"]`, this.layersPanel);
        if (layer) layer.classList.add('selected');
      }
    }

    setCodeLang(lang) {
      this.currentLang = lang;
      Object.entries(this.codeEditors).forEach(([l, ed]) => {
        ed.wrapper?.classList.toggle('active', l === lang);
      });
    }

    handleCodeKeydown(e, lang) {
      const ta = this.codeEditors[lang]?.textarea;
      if (!ta) return;

      const mod = e.ctrlKey || e.metaKey;

      // Fold/unfold shortcuts: Ctrl+Shift+[ and Ctrl+Shift+]
      if (mod && e.shiftKey && (e.key === '[' || e.code === 'BracketLeft')) {
        e.preventDefault();
        // Fold: find region at current cursor line
        const cursorLine = ta.value.substring(0, ta.selectionStart).split('\n').length - 1;
        const realLine = (this._displayToRealMap[lang] || [])[cursorLine] ?? cursorLine;
        const region = this._foldRegions[lang].find(r => r.start === realLine);
        if (region && !this._foldState[lang].has(realLine)) {
          this._toggleFold(lang, realLine);
          ta.value = this._displayCode[lang];
        }
        return;
      }
      if (mod && e.shiftKey && (e.key === ']' || e.code === 'BracketRight')) {
        e.preventDefault();
        // Unfold: find folded region at current cursor line
        const cursorLine = ta.value.substring(0, ta.selectionStart).split('\n').length - 1;
        const realLine = (this._displayToRealMap[lang] || [])[cursorLine] ?? cursorLine;
        if (this._foldState[lang].has(realLine)) {
          this._toggleFold(lang, realLine);
          ta.value = this._displayCode[lang];
        }
        return;
      }

      if (mod && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) this.redo(); else this.undo();
        return;
      }
      if (mod && e.key === 'y') {
        e.preventDefault();
        this.redo();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const { start, end } = getCaretPos(ta);
        const spaces = '  ';
        ta.value = ta.value.substring(0, start) + spaces + ta.value.substring(end);
        setCaretPos(ta, start + 2);
        this.code[lang] = this._foldState[lang].size > 0 ? this._displayToRealCode(lang, ta.value) : ta.value;
        this.updateCodeEditor(lang);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const { start } = getCaretPos(ta);
        const before = ta.value.substring(0, start);
        const after = ta.value.substring(start);
        const lineStart = before.lastIndexOf('\n') + 1;
        const indent = before.substring(lineStart).match(/^[ ]*/)[0];
        const lastChar = before.trim().slice(-1);
        const extra = ['{', '(', '[', ':'].includes(lastChar) ? '  ' : '';
        ta.value = before + '\n' + indent + extra + after;
        setCaretPos(ta, start + 1 + indent.length + extra.length);
        this.code[lang] = this._foldState[lang].size > 0 ? this._displayToRealCode(lang, ta.value) : ta.value;
        this.updateCodeEditor(lang);
      }
    }

    updateCodeEditor(lang) {
      const ed = this.codeEditors[lang];
      if (!ed) return;
      // Detect fold regions and build display code
      this._foldRegions[lang] = this._detectFoldRegions(this.code[lang] || '', lang);
      // Clean stale folds
      for (const s of this._foldState[lang]) {
        if (!this._foldRegions[lang].some(r => r.start === s)) {
          this._foldState[lang].delete(s);
        }
      }
      const display = this._buildDisplayCode(lang);
      if (ed.highlight) ed.highlight.innerHTML = highlight(display, lang) || '<br>';
      this._renderFoldableLines(lang);
    }

    updateAllCodeEditors() {
      ['html', 'css', 'js'].forEach(lang => {
        if (this.codeEditors[lang]?.textarea) {
          this._foldRegions[lang] = this._detectFoldRegions(this.code[lang] || '', lang);
          for (const s of this._foldState[lang]) {
            if (!this._foldRegions[lang].some(r => r.start === s)) {
              this._foldState[lang].delete(s);
            }
          }
          const display = this._buildDisplayCode(lang);
          this.codeEditors[lang].textarea.value = display;
        }
        this.updateCodeEditor(lang);
      });
    }

    getCleanBodyHtml() {
      const body = this.frame?.contentDocument?.body;
      if (!body) return '';
      const clone = body.cloneNode(true);
      clone.querySelectorAll('.jse-element-toolbar,.jse-drop-indicator').forEach(el => el.remove());
      clone.querySelectorAll('[data-selected],[data-hover]').forEach(el => {
        el.removeAttribute('data-selected');
        el.removeAttribute('data-hover');
      });
      return this.formatHtml(clone.innerHTML);
    }

    formatHtml(html) {
      if (!html || !html.trim()) return '';
      const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);
      const inlineTags = new Set(['a','abbr','b','bdi','bdo','br','cite','code','em','i','img','input','kbd','label','mark','q','s','samp','small','span','strong','sub','sup','time','u','var']);
      const rawTags = new Set(['script','style','pre','code','textarea']);

      let result = '';
      let indent = 0;
      const pad = () => '  '.repeat(indent);

      // Tokenize into tags and text
      const tokens = html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || [];
      let inRaw = false;
      let rawTag = '';

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // Comment
        if (token.startsWith('<!--')) {
          result += pad() + token.trim() + '\n';
          continue;
        }

        // End of raw block
        if (inRaw) {
          if (token.match(new RegExp(`^<\\/${rawTag}`, 'i'))) {
            inRaw = false;
            indent = Math.max(0, indent - 1);
            result += pad() + token.trim() + '\n';
          } else {
            // Preserve raw content as-is
            result += token;
          }
          continue;
        }

        // Tag
        if (token.startsWith('<')) {
          const trimmed = token.trim();
          const tagMatch = trimmed.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
          if (!tagMatch) { result += trimmed; continue; }
          const tagName = tagMatch[1].toLowerCase();
          const isClose = trimmed.startsWith('</');
          const isSelfClose = trimmed.endsWith('/>') || voidTags.has(tagName);
          const isInline = inlineTags.has(tagName);

          // Check if entering raw tag
          if (!isClose && rawTags.has(tagName) && !isSelfClose) {
            result += pad() + trimmed + '\n';
            indent++;
            inRaw = true;
            rawTag = tagName;
            continue;
          }

          if (isClose) {
            indent = Math.max(0, indent - 1);
            if (isInline) {
              // Inline closing: append to current line
              result = result.replace(/\n$/, '');
              result += trimmed + '\n';
            } else {
              result += pad() + trimmed + '\n';
            }
          } else if (isSelfClose || isInline) {
            result += pad() + trimmed;
            // If next token is text or inline close, don't break line
            const next = tokens[i + 1];
            if (isInline && !isSelfClose && next && !next.startsWith('<')) {
              // inline open + text: keep on same line
              result += '';
            } else {
              result += '\n';
            }
          } else {
            result += pad() + trimmed + '\n';
            indent++;
          }
        } else {
          // Text node
          const text = token.trim();
          if (!text) continue;
          // If previous was an inline open tag, append without newline
          if (result.length > 0 && !result.endsWith('\n')) {
            result += text;
          } else {
            result += pad() + text + '\n';
          }
        }
      }
      return result.replace(/\n{3,}/g, '\n\n').trim();
    }

    pushHistory() {
      const snapshot = JSON.stringify(this.code);
      // Don't push if identical to current position
      if (this.historyIndex >= 0 && this.history[this.historyIndex] === snapshot) return;
      // Truncate any redo states
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(snapshot);
      if (this.history.length > this.maxHistory) this.history.shift();
      this.historyIndex = this.history.length - 1;
    }

    undo() {
      if (this.historyIndex <= 0) return;
      this.historyIndex--;
      this.restoreSnapshot(JSON.parse(this.history[this.historyIndex]));
    }

    redo() {
      if (this.historyIndex >= this.history.length - 1) return;
      this.historyIndex++;
      this.restoreSnapshot(JSON.parse(this.history[this.historyIndex]));
    }

    restoreSnapshot(snapshot) {
      this.code.html = snapshot.html;
      this.code.css = snapshot.css;
      this.code.js = snapshot.js;
      // Update code editors
      ['html', 'css', 'js'].forEach(lang => {
        if (this.codeEditors[lang]?.textarea) {
          this.codeEditors[lang].textarea.value = this.code[lang];
        }
        this.updateCodeEditor(lang);
      });
      // Update visual canvas
      const doc = this.frame?.contentDocument;
      if (doc?.body) {
        doc.body.innerHTML = this.code.html;
        let customStyle = doc.getElementById('jse-custom-css');
        if (!customStyle) {
          customStyle = doc.createElement('style');
          customStyle.id = 'jse-custom-css';
          doc.head.appendChild(customStyle);
        }
        customStyle.textContent = this.code.css || '';
      }
      this.selectElement(null);
      this.updateLayers();
      this.saveToStorage();
    }

    syncToCode() {
      const html = this.getCleanBodyHtml();
      this.code.html = html;
      if (this.codeEditors.html?.textarea) {
        this.codeEditors.html.textarea.value = html;
      }
      this.updateCodeEditor('html');
      this.pushHistory();
      this.saveToStorage();
    }

    syncFromCode() {
      const doc = this.frame?.contentDocument;
      if (!doc) return;

      // Update HTML
      if (doc.body) {
        doc.body.innerHTML = this.code.html;
        this.updateLayers();
      }

      // Update custom CSS in iframe
      let customStyle = doc.getElementById('jse-custom-css');
      if (!customStyle) {
        customStyle = doc.createElement('style');
        customStyle.id = 'jse-custom-css';
        doc.head.appendChild(customStyle);
      }
      customStyle.textContent = this.code.css || '';
    }

    toggleOutlines(show) {
      this._outlinesActive = show;
      const doc = this.frame?.contentDocument;
      if (!doc) return;
      doc.body.classList.toggle('jse-show-outlines', show);
      try { localStorage.setItem(this.config.storagePrefix + 'outlines', show ? '1' : ''); } catch (e) {}
    }

    // Storage
    saveToStorage() {
      const p = this.config.storagePrefix;
      try {
        localStorage.setItem(p + 'html', this.code.html);
        localStorage.setItem(p + 'css', this.code.css);
        localStorage.setItem(p + 'js', this.code.js);
        localStorage.setItem(p + 'theme', this.config.theme);
      } catch (e) {}
    }

    stripEditorElements(html) {
      if (!html) return html;
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      tmp.querySelectorAll('.jse-element-toolbar,.jse-drop-indicator').forEach(el => el.remove());
      tmp.querySelectorAll('[data-selected],[data-hover]').forEach(el => {
        el.removeAttribute('data-selected');
        el.removeAttribute('data-hover');
      });
      return tmp.innerHTML;
    }

    loadFromStorage() {
      const p = this.config.storagePrefix;
      try {
        this.code.html = this.stripEditorElements(localStorage.getItem(p + 'html') || '');
        this.code.css = localStorage.getItem(p + 'css') || '';
        this.code.js = localStorage.getItem(p + 'js') || '';
        const theme = localStorage.getItem(p + 'theme');
        if (theme && !this._themeFromConfig) this.setTheme(theme);
        const outlines = localStorage.getItem(p + 'outlines');
        if (outlines) {
          this._outlinesActive = true;
          const btn = this.root?.querySelector('.jse-toggle-btn[data-toggle="outlines"]');
          if (btn) btn.classList.add('active');
        }
      } catch (e) {}

      this.updateAllCodeEditors();

      // Load HTML into frame after it's ready
      setTimeout(() => {
        if (this.code.html && this.frame?.contentDocument?.body) {
          this.frame.contentDocument.body.innerHTML = this.code.html;
          this._retagBlocks();
          this.updateLayers();
        }
        this.pushHistory();
      }, 200);
    }

    // Actions
    newProject() {
      if (confirm(t('confirm.newProject'))) {
        this.code = { html: '', css: '', js: '' };
        this.updateAllCodeEditors();
        if (this.frame?.contentDocument?.body) {
          this.frame.contentDocument.body.innerHTML = '';
        }
        this.updateLayers();
        this.saveToStorage();
      }
    }

    save() {
      const data = this._buildSaveData();
      if (this.config.saveTarget === 'remote' && this.config.saveEndpoint) {
        this._saveRemote(data);
      } else {
        this._saveLocal(data);
      }
    }

    _buildSaveData() {
      const filename = this.config.saveFilename || 'proyecto';
      if (this.config.saveFormat === 'json') {
        const cleanHtml = this.code.html.replace(/\s*data-jse-block="[^"]*"/g, '');
        return {
          content: JSON.stringify({ html: cleanHtml, css: this.code.css, js: this.code.js }, null, 2),
          filename: filename + '.json',
          type: 'application/json'
        };
      }
      return {
        content: this.generateFullHtml(),
        filename: filename + '.html',
        type: 'text/html'
      };
    }

    _saveLocal(data) {
      this.download(data.content, data.filename, data.type);
    }

    _saveRemote(data) {
      const body = this.config.saveFormat === 'json'
        ? data.content
        : JSON.stringify({ html: data.content });

      fetch(this.config.saveEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json().catch(() => ({}));
      })
      .then(res => {
        if (this.config.onSaveSuccess) this.config.onSaveSuccess(res);
      })
      .catch(err => {
        if (this.config.onSaveError) this.config.onSaveError(err);
        else console.error('Save failed:', err);
      });
    }

    preview() {
      const html = this.generateFullHtml();
      const blob = new Blob([html], { type: 'text/html' });
      window.open(URL.createObjectURL(blob), '_blank');
    }

    exportHtml() {
      this.save();
    }

    generateFullHtml() {
      const cleanHtml = this.code.html.replace(/\s*data-jse-block="[^"]*"/g, '');
      return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Mi Proyecto</title>
  <link href="${this.config.bootstrapCss}" rel="stylesheet">
  <style>${this.code.css}</style>
</head>
<body>
${cleanHtml}
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"><\/script>
  <script>${this.code.js}<\/script>
</body>
</html>`;
    }

    importHtml(content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      let css = '';
      doc.querySelectorAll('style').forEach(s => css += s.textContent + '\n');
      let js = '';
      doc.querySelectorAll('script:not([src])').forEach(s => js += s.textContent + '\n');
      doc.body.querySelectorAll('script').forEach(s => s.remove());
      const html = doc.body.innerHTML.trim();

      this.code = { html, css: css.trim(), js: js.trim() };
      this.updateAllCodeEditors();
      if (this.frame?.contentDocument?.body) {
        this.frame.contentDocument.body.innerHTML = html;
      }
      this.updateLayers();
      this.saveToStorage();
    }

    download(content, filename, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }

    setTheme(theme) {
      this.config.theme = theme;
      this.root?.classList.remove('theme-dark', 'theme-light');
      this.root?.classList.add(`theme-${theme}`);
      this.saveToStorage();
    }

    toggleTheme() {
      this.setTheme(this.config.theme === 'dark' ? 'light' : 'dark');
    }

    setLang(lang) {
      if (!Lang[lang]) return;
      currentLang = lang;
      this.config.lang = lang;
      // Re-render UI with new language
      const savedCode = { ...this.code };
      this.render();
      this.cacheElements();
      this.bindEvents();
      this.code = savedCode;
      this.updateAllCodeEditors();
      this.initFrame();
      this.loadFromStorage();
    }

    getLang() { return currentLang; }

    setSaveFormat(format) {
      if (format === 'html' || format === 'json') this.config.saveFormat = format;
    }

    setSaveTarget(target, endpoint) {
      if (target === 'local' || target === 'remote') this.config.saveTarget = target;
      if (endpoint !== undefined) this.config.saveEndpoint = endpoint;
    }

    // Public API
    getHtml() { return this.code.html; }
    getCss() { return this.code.css; }
    getJs() { return this.code.js; }
    getCode() { return { ...this.code }; }

    setHtml(html) {
      this.code.html = html;
      this.updateAllCodeEditors();
      this.syncFromCode();
    }
    setCss(css) {
      this.code.css = css;
      this.updateAllCodeEditors();
    }
    setJs(js) {
      this.code.js = js;
      this.updateAllCodeEditors();
    }
    setCode(code) {
      if (code.html !== undefined) this.code.html = code.html;
      if (code.css !== undefined) this.code.css = code.css;
      if (code.js !== undefined) this.code.js = code.js;
      this.updateAllCodeEditors();
      this.syncFromCode();
    }

    bindToForm(formSelector, opts = {}) {
      const form = typeof formSelector === 'string'
        ? document.querySelector(formSelector) : formSelector;
      if (!form || form.tagName !== 'FORM') return;

      const single = opts.field || null;
      const htmlField = opts.htmlField || 'editor_html';
      const cssField = opts.cssField || 'editor_css';
      const jsField = opts.jsField || 'editor_js';

      const getOrCreate = (name) => {
        let input = form.querySelector(`input[name="${name}"]`);
        if (!input) {
          input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          form.appendChild(input);
        }
        return input;
      };

      if (this._formBinding) {
        this._formBinding.form.removeEventListener('submit', this._formBinding.handler);
      }

      const handler = () => {
        const cleanHtml = this.code.html.replace(/\s*data-jse-block="[^"]*"/g, '');
        if (single) {
          getOrCreate(single).value = JSON.stringify({ html: cleanHtml, css: this.code.css, js: this.code.js });
        } else {
          getOrCreate(htmlField).value = cleanHtml;
          getOrCreate(cssField).value = this.code.css;
          getOrCreate(jsField).value = this.code.js;
        }
      };

      form.addEventListener('submit', handler);
      this._formBinding = { form, handler };
    }

    unbindForm() {
      if (this._formBinding) {
        this._formBinding.form.removeEventListener('submit', this._formBinding.handler);
        this._formBinding = null;
      }
    }

    destroy() {
      this.unbindForm();
      if (this.container) this.container.innerHTML = '';
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================

  const ShouEditor = {
    version: '1.0.0',
    Editor,
    Blocks: DefaultBlocks,

    init(containerOrConfig, config) {
      return new Editor(containerOrConfig, config);
    },

    // Quick access for existing instance
    instance: null
  };

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShouEditor;
  } else {
    global.ShouEditor = ShouEditor;
  }

})(typeof window !== 'undefined' ? window : this);
