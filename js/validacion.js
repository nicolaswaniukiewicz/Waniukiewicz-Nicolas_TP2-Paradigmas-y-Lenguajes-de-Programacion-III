$(function () {
  const $form = $('form.formulario');
  if (!$form.length || !window.jQuery) return;

  $form.validate({
    ignore: [],

    onkeyup: false,
    onfocusout: false,
    onclick: false,

    errorClass: 'is-invalid',
    validClass: 'is-valid',

errorPlacement: function (error, element) {
  error.css({
    color: '#ff3333',     
    display: 'inline',    
    'margin-left': '12px' 
  });

  if (element.attr('type') === 'checkbox' && element.attr('name')?.startsWith('prod_')) {
    const $bloque = element.closest('.mediode_pago');
    if ($bloque.length) {
      let $holder = $bloque.find('.error-productos');
      if (!$holder.length) {
        $holder = $('<label class="error error-productos"></label>')
          .css({ color:'#ff3333', display:'inline', 'margin-left':'12px' })
          .appendTo($bloque);
      }
      $holder.text('Seleccioná al menos un producto.');
      return;
    }
  }

  error.insertAfter(element);
},

    success: function (label, element) {
      const $el = $(element);
      if ($el.attr('type') === 'checkbox' && $el.attr('name')?.startsWith('prod_')) {
        const $bloque = $el.closest('.mediode_pago');
        if ($bloque.length) $bloque.find('.error-productos').text('');
      }
    },

    rules: {
      nombre:    { required: true, minlength: 2 },
      direccion: { required: true, minlength: 5 },
      telefono:  { required: true, digits: true, minlength: 7 },
      email:     { required: true, email: true },
      pago:      { required: true }
    },

    messages: {
      nombre:    { required: 'Ingresá tu nombre', minlength: 'Mínimo 2 caracteres' },
      direccion: { required: 'Ingresá tu dirección', minlength: 'Muy corta' },
      telefono:  { required: 'Ingresá tu teléfono', digits: 'Solo números', minlength: 'Muy corto' },
      email:     { required: 'Ingresá tu email', email: 'Formato no válido' },
      pago:      { required: 'Seleccioná un medio de pago' }
    }
  });

  const $productos = $form.find('input[type="checkbox"][name^="prod_"]');
  $productos.each(function () {
    $(this).rules('add', {
      require_from_group: [1, 'input[type="checkbox"][name^=prod_]']
    });
  });
});
