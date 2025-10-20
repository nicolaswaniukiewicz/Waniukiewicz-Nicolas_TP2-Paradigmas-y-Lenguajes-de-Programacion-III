(function () {
  const form  = document.querySelector('form');
  const toast = document.getElementById('toast');
  if (!form || !toast) return;

  function getNameOrEmail() {
    const u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!u) return '¡Hola!';
    return u.name?.trim() ? u.name.trim() : (u.email || '¡Hola!');
  }

  function getSelectedItems() {
    const checked = Array.from(form.querySelectorAll('input[type="checkbox"][name^="prod_"]:checked'));
    return checked.map(cb => {
      const name = cb.name.replace(/^prod_/, '');
      const qtyInput = form.querySelector(`[name="cant_${name}"]`);
      const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
      const labelText = cb.closest('label')?.innerText?.trim() || name;
      return { key: name, qty, label: labelText };
    });
  }

  function showToast(html, timeout = 3500) {
    toast.innerHTML = html;
    toast.classList.add('toast--show');
    setTimeout(() => toast.classList.remove('toast--show'), timeout);
  }

  toast.addEventListener('click', (e) => {
    if (e.target.closest('.toast__ok')) {
      form.reset();
      if (window.jQuery && $(form).data('validator')) {
        $(form).validate().resetForm();
        $(form).find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
      }
      toast.classList.remove('toast--show');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (window.jQuery && typeof $(form).valid === 'function' && !$(form).valid()) {
      return;
    }

    const items = getSelectedItems();

    const maxShow = 3;
    const listShort = items
      .slice(0, maxShow)
      .map(it => `${it.qty}× ${it.label.split('—')[0].trim()}`)
      .join(' • ');
    const extra = items.length > maxShow ? ` +${items.length - maxShow} ítems` : '';
    const who = getNameOrEmail();

    showToast(`
      <div class="toast__title">¡Compra realizada con éxito!</div>
      <div class="toast__desc">
        ${who}, confirmamos tu pedido:
        <br><strong>${listShort}${extra}</strong>
        <br>Te enviaremos el detalle a tu correo registrado.
      </div>
      <span class="toast__ok">✔ Listo</span>
    `, 4200);
  });
})();
