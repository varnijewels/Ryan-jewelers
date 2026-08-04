/* =================================================================
   BORIS & TWINS — interactions
   - Mobile navigation toggle
   - Sticky header elevation on scroll
   - Scroll-reveal (IntersectionObserver)
   - Best-seller category tabs
   - Wishlist toggle + add-to-cart badge
   - Auto-advancing review counter
   - Back-to-top button
   - Graceful image fallback (in-palette tile if a swap-in asset is missing)
   ================================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- 1. Mobile navigation ---------- */
  const toggle = $('#navToggle');
  const nav    = $('.header-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // close after selecting a link (mobile)
    $$('.nav-list a', nav).forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- 2. Sticky header elevation ---------- */
  const header = $('.site-header') || $('.bt-header');
  const onScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 8) header.style.boxShadow = '0 6px 20px -16px rgba(0,0,0,.4)';
    else header.style.boxShadow = 'none';
  };

  /* ---------- 3. Scroll reveal ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (Math.min(i % 5, 4) * 60) + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- 4. Best-seller tabs ---------- */
  $$('.tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tabs .tab').forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
    });
  });

  /* ---------- 5. Wishlist toggle ---------- */
  $$('.wish-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const active = btn.classList.toggle('is-active');
      btn.setAttribute('aria-pressed', String(active));
    });
  });

  /* ---------- 6. Add-to-cart badge ---------- */
  const badge = $('.icon-btn .badge');
  let count = 0;
  $$('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (badge) badge.textContent = String(++count);
      btn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }],
        { duration: 220, easing: 'ease-out' }
      );
    });
  });

  /* ---------- 7. Auto-advancing review counter ---------- */
  const idx = $('#reviewIndex');
  if (idx) {
    let n = 5;
    setInterval(() => {
      n = n >= 10 ? 1 : n + 1;
      idx.textContent = String(n).padStart(2, '0');
    }, 3500);
  }

  /* ---------- 8. Back-to-top ---------- */
  const toTop = $('#toTop');
  const onScrollTop = () => {
    if (window.scrollY > 600) toTop.classList.add('show');
    else toTop.classList.remove('show');
  };
  if (toTop) {
    toTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* combined scroll listener (rAF throttled) ---------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScrollHeader();
        if (toTop) onScrollTop();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---------- 9. Graceful image fallback ----------
     Until a real export is dropped into assets/images/, draw an elegant
     in-palette tile (gradient + faceted-diamond motif + label) so the
     layout always looks finished and never shows a broken-image icon. */
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  $$('img').forEach(img => {
    img.addEventListener('error', function handle() {
      img.removeEventListener('error', handle);
      const w = +(img.getAttribute('width')  || 400);
      const h = +(img.getAttribute('height') || 400);
      const dark   = !!img.closest('.cat-card,.review-figure,.insta-cell,.sparkle-figure,.hero-stage,.inline-img');
      const c1     = dark ? '#241c19' : '#f7f1ea';
      const c2     = dark ? '#5a3a30' : '#e7dccd';
      const stroke = dark ? '#d6bc8c' : '#c9a24b';
      const fg     = dark ? '#e9d6b3' : '#9E260E';
      const sub    = dark ? '#b6a489' : '#8a7d70';
      const cx = w / 2, cy = h * 0.42, s = Math.min(w, h) * 0.16;
      const fs = Math.max(11, Math.min(22, w / 16));
      const label = esc((img.alt || 'Boris & Twins').slice(0, 28));
      const diamond =
        `M${cx} ${cy - s} L${cx + s * 0.32} ${cy - s * 0.42} L${cx + s * 0.62} ${cy} ` +
        `L${cx} ${cy + s} L${cx - s * 0.62} ${cy} L${cx - s * 0.32} ${cy - s * 0.42} Z`;
      let body =
        `<rect width='100%' height='100%' fill='url(#g)'/>` +
        `<path d='${diamond}' fill='none' stroke='${stroke}' stroke-width='1.5'/>` +
        `<line x1='${cx - s * 0.62}' y1='${cy}' x2='${cx + s * 0.62}' y2='${cy}' stroke='${stroke}' stroke-width='1'/>` +
        `<text x='50%' y='${h * 0.62}' fill='${fg}' font-family='Georgia,serif' font-size='${fs}' ` +
        `letter-spacing='1' text-anchor='middle'>${label}</text>`;
      if (h > 120) {
        body += `<text x='50%' y='${h * 0.62 + fs + 8}' fill='${sub}' font-family='Georgia,serif' ` +
                `font-size='${Math.max(9, fs * 0.6)}' letter-spacing='2' text-anchor='middle'>BORIS &amp; TWINS</text>`;
      }
      const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
        `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
        `<stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs>` +
        body + `</svg>`;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  });

  /* ---------- 10. Product listing controls (rings.html) ---------- */
  // category bar active state
  $$('.catbar-item').forEach(item => {
    item.addEventListener('click', e => {
      if (item.getAttribute('href') === '#') e.preventDefault();
      $$('.catbar-item').forEach(x => { x.classList.remove('is-active'); x.removeAttribute('aria-current'); });
      item.classList.add('is-active');
      item.setAttribute('aria-current', 'page');
    });
  });

  // grid / list view toggle
  const listGrid = $('.listing-grid .product-grid');
  $$('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.view-btn').forEach(x => x.classList.remove('is-active'));
      btn.classList.add('is-active');
      if (listGrid) listGrid.classList.toggle('list', btn.dataset.view === 'list');
    });
  });

  // sort dropdown + sorting handled in store.js (initSort)

  // pagination active state
  $$('.pagination .page').forEach(p => {
    p.addEventListener('click', () => {
      $$('.pagination .page').forEach(x => { x.classList.remove('is-active'); x.removeAttribute('aria-current'); });
      p.classList.add('is-active');
      p.setAttribute('aria-current', 'page');
      const main = document.getElementById('main');
      window.scrollTo({ top: main ? main.offsetTop - 80 : 0, behavior: 'smooth' });
    });
  });

  /* ---------- 11. Product Details Page (product.html) ---------- */
  // gallery thumbnail → main image
  const pdpMain = $('#pdpMain');
  $$('.thumb').forEach(t => {
    t.addEventListener('click', () => {
      $$('.thumb').forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-active');
      t.setAttribute('aria-selected', 'true');
      const full = t.getAttribute('data-full');
      if (pdpMain && full) {
        pdpMain.style.opacity = '0';
        setTimeout(() => { pdpMain.src = full; pdpMain.style.opacity = '1'; }, 150);
      }
    });
  });

  // description / review tabs
  $$('.pdp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.pdp-tab').forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
    });
  });

  // option chips (single-select within each group)
  $$('.opt-chips').forEach(group => {
    group.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      group.querySelectorAll('.chip').forEach(c => { c.classList.remove('is-active'); c.removeAttribute('aria-pressed'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
    });
  });

  // offer countdown timer (HH:MM:SS)
  const cd = $('#countdown');
  if (cd) {
    const parts = cd.textContent.split(':').map(Number);
    let total = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    const pad = n => String(n).padStart(2, '0');
    setInterval(() => {
      if (total > 0) total--;
      const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
      cd.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }, 1000);
  }

  /* ---------- 12. Toast notification ---------- */
  let toastWrap = $('.toast-wrap');
  if (!toastWrap) {
    toastWrap = document.createElement('div');
    toastWrap.className = 'toast-wrap';
    toastWrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastWrap);
  }
  const CHECK_SVG = "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M5 12.5l4.5 4.5L19 7.5' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/></svg>";
  function showToast(title, msg, link) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.innerHTML =
      `<span class="toast-ic">${CHECK_SVG}</span>` +
      `<div class="toast-body"><div class="toast-title">${title}</div>` +
      (msg ? `<p>${msg}</p>` : '') +
      (link ? `<a class="toast-link" href="${link}">View cart →</a>` : '') +
      `</div>`;
    toastWrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 450);
    }, 3200);
    return t;
  }
  window.showToast = showToast;

  // header bag → cart page (all pages)
  // header icon navigation (works for old + new header markup; multiple buttons per breakpoint)
  $$('[aria-label="Cart"], [aria-label="Shopping bag"]').forEach(b => b.addEventListener('click', () => { window.location.href = 'cart.html'; }));
  $$('[aria-label="Account"]').forEach(b => b.addEventListener('click', () => { window.location.href = 'login.html'; }));
  $$('[aria-label="Wishlist"]').forEach(b => b.addEventListener('click', () => { window.location.href = 'wishlist.html'; }));

  // product card "Add" buttons → toast (badge handled in section 6)
  $$('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card ? (card.querySelector('.product-name')?.textContent || 'Item') : 'Item';
      showToast('Added to cart', name, 'cart.html');
    });
  });

  // PDP "ADD TO CART" → toast then go to cart
  const pdpAdd = document.querySelector('.pdp-cta .btn-outline');
  if (pdpAdd) {
    pdpAdd.addEventListener('click', () => {
      const name = document.querySelector('.pdp-title')?.textContent || 'Item';
      if (badge) badge.textContent = String(++count || 1);
      showToast('Added to cart', name, 'cart.html');
      setTimeout(() => { window.location.href = 'cart.html'; }, 200);
    });
  }

  /* ---------- 13. Cart page controls ---------- */
  const cartList = $('#cartList');
  if (cartList) {
    const cartCountEl = $('#cartCount');
    const updateCount = () => {
      const n = cartList.querySelectorAll('.cart-item').length;
      if (cartCountEl) cartCountEl.textContent = String(n);
      if (badge) badge.textContent = String(n);
    };
    // quantity steppers
    cartList.addEventListener('click', e => {
      const inc = e.target.closest('.qty-inc');
      const dec = e.target.closest('.qty-dec');
      const del = e.target.closest('.item-ic.danger');
      if (inc || dec) {
        const val = e.target.closest('.qty').querySelector('.qty-val');
        let n = parseInt(val.textContent, 10) || 1;
        n = inc ? n + 1 : Math.max(1, n - 1);
        val.textContent = n;
      }
      if (del) {
        const item = del.closest('.cart-item');
        item.style.opacity = '0';
        item.style.transition = 'opacity .25s';
        setTimeout(() => { item.remove(); updateCount(); }, 250);
        showToast('Removed from cart', '');
      }
    });
    // select all
    const selectAll = $('#selectAll');
    if (selectAll) {
      selectAll.addEventListener('change', () => {
        cartList.querySelectorAll('.item-check input').forEach(c => { c.checked = selectAll.checked; });
      });
    }
    // apply code + checkout feedback
    const applyBtn = $('.btn-apply');
    if (applyBtn) applyBtn.addEventListener('click', () => {
      const code = $('#discount')?.value.trim();
      showToast(code ? 'Discount applied' : 'Enter a code', code || 'Please enter a discount code');
    });
    const checkoutBtn = $('.btn-checkout');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
      showToast('Proceeding to checkout', 'Redirecting…');
      setTimeout(() => { window.location.href = 'checkout.html'; }, 120);
    });
  }

  /* ---------- 14. Checkout page controls ---------- */
  const checkoutEl = $('.checkout');
  if (checkoutEl) {
    // quantity steppers + remove (order summary)
    const sumItems = $('#summaryItems');
    if (sumItems) {
      sumItems.addEventListener('click', e => {
        const inc = e.target.closest('.qty-inc');
        const dec = e.target.closest('.qty-dec');
        const del = e.target.closest('.item-ic.danger');
        if (inc || dec) {
          const val = e.target.closest('.qty').querySelector('.qty-val');
          let n = parseInt(val.textContent, 10) || 1;
          val.textContent = inc ? n + 1 : Math.max(1, n - 1);
        }
        if (del) {
          const item = del.closest('.sum-item');
          item.style.transition = 'opacity .25s';
          item.style.opacity = '0';
          setTimeout(() => item.remove(), 250);
          showToast('Removed from cart', '');
        }
      });
    }

    // address radio → visual handled by CSS :has; toast on change
    $$('input[name="address"]').forEach(r => {
      r.addEventListener('change', () => {
        const name = r.closest('.addr-card').querySelector('.addr-name')?.textContent.trim();
        showToast('Address selected', name || '');
      });
    });

    // add-address collapsible form
    const addBtn = $('#addAddrBtn');
    const addForm = $('#addAddrForm');
    if (addBtn && addForm) {
      addBtn.addEventListener('click', () => {
        const open = addForm.hasAttribute('hidden');
        if (open) { addForm.removeAttribute('hidden'); addBtn.setAttribute('aria-expanded', 'true'); }
        else { addForm.setAttribute('hidden', ''); addBtn.setAttribute('aria-expanded', 'false'); }
      });
      $('#addAddrCancel')?.addEventListener('click', () => {
        addForm.setAttribute('hidden', ''); addBtn.setAttribute('aria-expanded', 'false');
      });
      $('#addAddrSave')?.addEventListener('click', () => {
        const name = addForm.querySelector('[name="fullname"]').value.trim() || 'New Address';
        const phone = addForm.querySelector('[name="phone"]').value.trim();
        const street = addForm.querySelector('[name="street"]').value.trim();
        const city = addForm.querySelector('[name="city"]').value.trim();
        const zip = addForm.querySelector('[name="zip"]').value.trim();
        if (!street) { showToast('Add a street address', 'Please fill the address'); return; }
        // build a new address card and select it
        const group = document.querySelectorAll('.addr-group')[1] || document.querySelector('.addr-group');
        const id = 'addr-' + Date.now();
        const label = document.createElement('label');
        label.className = 'addr-card';
        label.innerHTML =
          `<input type="radio" name="address" value="${id}" checked>` +
          `<span class="addr-body"><span class="addr-name">${name}</span>` +
          `<span class="addr-line">${[street, city, zip].filter(Boolean).join(', ')}</span>` +
          `<span class="addr-phone">${phone}</span></span>` +
          `<span class="addr-radio" aria-hidden="true"></span>`;
        group.appendChild(label);
        addForm.querySelectorAll('input').forEach(i => i.value = '');
        addForm.setAttribute('hidden', ''); addBtn.setAttribute('aria-expanded', 'false');
        showToast('Address added', name);
      });
    }

    // proceed to payment page
    const placeOrder = $('#placeOrder');
    if (placeOrder) {
      placeOrder.addEventListener('click', () => {
        const chosen = document.querySelector('input[name="address"]:checked');
        if (!chosen) { showToast('Select an address', 'Please choose a delivery address'); return; }
        showToast('Proceeding to payment', 'Redirecting…');
        setTimeout(() => { window.location.href = 'payment.html'; }, 120);
      });
    }
  }

  /* ---------- 15. Payment page controls (payment.html) ---------- */
  const payPage = $('.pay-page');
  if (payPage) {
    // summary qty steppers + remove
    const sumItems = $('#summaryItems');
    if (sumItems) {
      sumItems.addEventListener('click', e => {
        const inc = e.target.closest('.qty-inc');
        const dec = e.target.closest('.qty-dec');
        const del = e.target.closest('.item-ic.danger');
        if (inc || dec) {
          const val = e.target.closest('.qty').querySelector('.qty-val');
          let n = parseInt(val.textContent, 10) || 1;
          val.textContent = inc ? n + 1 : Math.max(1, n - 1);
        }
        if (del) {
          const item = del.closest('.sum-item');
          item.style.transition = 'opacity .25s';
          item.style.opacity = '0';
          setTimeout(() => item.remove(), 250);
          showToast('Removed from cart', '');
        }
      });
    }

    // payment method select feedback
    $$('input[name="paymethod"]').forEach(r => {
      r.addEventListener('change', () => {
        const name = r.closest('.pm-card').querySelector('.pm-name')?.textContent;
        showToast('Payment method', name || '');
      });
    });

    // express checkout buttons
    $$('.exp-btn').forEach(b => b.addEventListener('click', () => {
      showToast('Express checkout', b.classList.contains('shoppay') ? 'Shop Pay' : 'Google Pay');
    }));

    // another-address pills
    $$('.addr-pill').forEach(p => p.addEventListener('click', () => {
      p.classList.toggle('is-active');
      showToast('Address type', p.textContent.replace('+', '').trim());
    }));

    // discount
    const applyBtn = $('.btn-apply');
    if (applyBtn) applyBtn.addEventListener('click', () => {
      const code = $('#discount')?.value.trim();
      showToast(code ? 'Discount applied' : 'Enter a code', code || 'Please enter a discount code');
    });

    // card number formatting: groups of 4
    const card = $('#card');
    if (card) card.addEventListener('input', () => {
      let v = card.value.replace(/\D/g, '').slice(0, 16);
      card.value = v.replace(/(.{4})/g, '$1 - ').replace(/ - $/, '');
    });
    // expiry MM / YY
    const expiry = $('#expiry');
    if (expiry) expiry.addEventListener('input', () => {
      let v = expiry.value.replace(/\D/g, '').slice(0, 4);
      expiry.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v;
    });
    const cvv = $('#cvv');
    if (cvv) cvv.addEventListener('input', () => { cvv.value = cvv.value.replace(/\D/g, '').slice(0, 4); });

    // place order
    const payNow = $('#payNow');
    const payForm = $('#payForm');
    if (payNow) {
      payNow.addEventListener('click', () => {
        // basic validation of required fields
        if (payForm) {
          const required = payForm.querySelectorAll('[required]');
          for (const f of required) {
            if (!f.value.trim()) {
              f.focus();
              f.style.borderColor = '#c0392b';
              showToast('Missing information', 'Please complete all required fields');
              return;
            }
          }
        }
        showToast('Order placed successfully', 'Redirecting…');
        payNow.disabled = true;
        payNow.textContent = 'ORDER PLACED ✓';
        payNow.style.opacity = '.85';
        setTimeout(() => { window.location.href = 'order-success.html'; }, 350);
      });
    }
  }

  /* ---------- 20. Order success page (order-success.html) ---------- */
  const osCopy = $('#osCopy');
  if (osCopy) {
    osCopy.addEventListener('click', () => {
      const oid = $('.os-oid');
      const text = oid ? oid.textContent.replace(/order id/i, '').trim() : '';
      if (navigator.clipboard && text) navigator.clipboard.writeText(text).catch(() => {});
      showToast('Copied', 'Order ID copied to clipboard');
    });
  }

  /* close inner cart-block brace was here */

  /* ---------- 16. Track Order page ---------- */
  const trackBtn = $('#trackBtn');
  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      const id = $('#orderId'), em = $('#trackEmail');
      if (!id.value.trim() || !em.value.trim()) {
        (!id.value.trim() ? id : em).focus();
        showToast('Enter order details', 'Order ID and email are required');
        return;
      }
      const res = $('#trackResult');
      const label = $('#trOrderId');
      if (label) label.textContent = id.value.trim();
      if (res) {
        res.hidden = false;
        res.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      showToast('Order found', 'Tracking ' + id.value.trim());
    });
  }

  /* ---------- 17. Prevent page reloads ---------- */
  // Stop any <form> submit from reloading the page (newsletter, search, etc.)
  document.addEventListener('submit', function (e) { e.preventDefault(); });

  // Newsletter forms → friendly toast instead of reload
  $$('.newsletter').forEach(function (form) {
    form.addEventListener('submit', function () {
      const input = form.querySelector('input');
      const val = input ? input.value.trim() : '';
      showToast(val ? 'Subscribed' : 'Enter your email', val || 'Please enter an email address');
      if (input) input.value = '';
    });
  });

  // Neutralize placeholder anchors (href="#") so they never jump/reload
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  /* ---------- 18. My Address page (address.html) — centered modal ---------- */
  const adrPage = $('.addresses');
  if (adrPage) {
    const overlay = $('#adrModalOverlay');
    const modal = $('#adrModal');
    const titleEl = $('#adrModalTitle');
    const fld = n => modal ? modal.querySelector('[name="' + n + '"]') : null;
    let editingRow = null;
    let curType = 'home';

    function setType(t) {
      curType = t;
      $$('.adr-type-btn', modal).forEach(b => b.classList.toggle('is-active', b.dataset.type === t));
    }
    function clearForm() {
      ['fullname', 'street', 'country', 'state', 'city', 'zip'].forEach(n => { const el = fld(n); if (el) el.value = ''; });
    }
    function openModal() {
      if (!overlay || !modal) return;
      overlay.hidden = false; modal.hidden = false;
      requestAnimationFrame(() => { overlay.classList.add('is-open'); modal.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      const first = fld('fullname'); if (first) setTimeout(() => first.focus(), 120);
    }
    function closeModal() {
      if (!overlay || !modal) return;
      overlay.classList.remove('is-open'); modal.classList.remove('is-open');
      setTimeout(() => { overlay.hidden = true; modal.hidden = true; }, 300);
      document.body.style.overflow = ''; editingRow = null;
    }

    function buildRow(name, addr) {
      const a = document.createElement('article');
      a.className = 'adr-row';
      a.dataset.name = name; a.dataset.address = addr;
      a.innerHTML =
        '<div class="addr-body">' +
        '<span class="addr-name"><svg class="ic-sm"><use href="#i-pin"/></svg> <span class="adr-nm"></span></span>' +
        '<span class="addr-line adr-ad"></span></div>' +
        '<div class="adr-actions">' +
        '<button class="adr-icon" type="button" aria-label="Edit address"><svg class="ic-sm"><use href="#i-edit"/></svg></button>' +
        '<button class="adr-icon danger" type="button" aria-label="Delete address"><svg class="ic-sm"><use href="#i-trash"/></svg></button></div>';
      a.querySelector('.adr-nm').textContent = name;
      a.querySelector('.adr-ad').textContent = addr;
      return a;
    }

    // open modal for "add"
    const addBtn = $('#adrAddBtn');
    if (addBtn) addBtn.addEventListener('click', () => {
      editingRow = null; clearForm(); setType('home');
      if (titleEl) titleEl.textContent = '+Add New Address';
      openModal();
    });

    // home / office toggle
    $$('.adr-type-btn').forEach(b => b.addEventListener('click', () => setType(b.dataset.type)));

    // close triggers
    $('#adrModalClose') && $('#adrModalClose').addEventListener('click', closeModal);
    $('#adrModalCancel') && $('#adrModalCancel').addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal && !modal.hidden) closeModal(); });

    // edit + delete (delegated on the page)
    adrPage.addEventListener('click', e => {
      const del = e.target.closest('.adr-icon.danger');
      const ed = e.target.closest('.adr-icon:not(.danger)');
      if (del) {
        const row = del.closest('.adr-row');
        row.style.transition = 'opacity .2s'; row.style.opacity = '0';
        setTimeout(() => row.remove(), 200);
        showToast('Address removed', '');
      } else if (ed) {
        const row = ed.closest('.adr-row');
        editingRow = row;
        clearForm();
        if (fld('fullname')) fld('fullname').value = row.dataset.name || '';
        if (fld('street')) fld('street').value = row.dataset.address || '';
        const grp = (row.closest('.adr-list') && row.closest('.adr-list').dataset.group) || 'home';
        setType(grp);
        if (titleEl) titleEl.textContent = '+Edit Address';
        openModal();
      }
    });

    // save & update
    $('#adrModalSave') && $('#adrModalSave').addEventListener('click', () => {
      const name = (fld('fullname').value || '').trim();
      const parts = ['street', 'city', 'state', 'zip', 'country'].map(n => (fld(n).value || '').trim()).filter(Boolean);
      const addr = parts.join(', ');
      if (!name || !addr) { (!name ? fld('fullname') : fld('street')).focus(); showToast('Missing details', 'Full name and street address are required'); return; }
      if (editingRow) {
        editingRow.dataset.name = name; editingRow.dataset.address = addr;
        editingRow.querySelector('.adr-nm').textContent = name;
        editingRow.querySelector('.adr-ad').textContent = addr;
        const target = adrPage.querySelector('.adr-list[data-group="' + curType + '"]');
        if (target && editingRow.parentElement !== target) target.appendChild(editingRow);
        showToast('Address updated', name);
      } else {
        const target = adrPage.querySelector('.adr-list[data-group="' + curType + '"]') || adrPage.querySelector('.adr-list');
        if (target) target.appendChild(buildRow(name, addr));
        showToast('Address added', name);
      }
      closeModal();
    });
  }

  /* ---------- 19. Product-list filter bar (rings.html) ---------- */
  const filterBar = $('#filterBar');
  const filterToggle = $('.filter-btn');
  if (filterBar && filterToggle) {
    // FILTER button shows/hides the filter bar
    const toolbarEl = filterToggle.closest('.toolbar');
    filterToggle.addEventListener('click', () => {
      const open = filterBar.hasAttribute('hidden');
      if (open) {
        filterBar.removeAttribute('hidden'); filterToggle.classList.add('is-active');
        if (toolbarEl) toolbarEl.classList.add('filters-open');
      } else {
        filterBar.setAttribute('hidden', ''); filterToggle.classList.remove('is-active');
        if (toolbarEl) toolbarEl.classList.remove('filters-open');
        closeAllMenus();
      }
    });

    function closeAllMenus() {
      $$('.filter-chip', filterBar).forEach(c => {
        c.classList.remove('open');
        const m = c.querySelector('.filter-menu'); if (m) m.hidden = true;
        const b = c.querySelector('.filter-chip-btn'); if (b) b.setAttribute('aria-expanded', 'false');
      });
    }

    // open/close each dropdown
    $$('.filter-chip-btn', filterBar).forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const chip = btn.closest('.filter-chip');
        const wasOpen = chip.classList.contains('open');
        closeAllMenus();
        if (!wasOpen) {
          chip.classList.add('open');
          const m = chip.querySelector('.filter-menu'); if (m) m.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // selection state per chip
    filterBar.addEventListener('change', e => {
      if (!e.target.matches('.filter-opt input')) return;
      const chip = e.target.closest('.filter-chip');
      const n = chip.querySelectorAll('.filter-opt input:checked').length;
      chip.classList.toggle('has-sel', n > 0);
    });

    // clear all
    const clearBtn = $('#filterClear');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      $$('.filter-opt input', filterBar).forEach(i => { i.checked = false; });
      $$('.filter-chip', filterBar).forEach(c => c.classList.remove('has-sel'));
      closeAllMenus();
      showToast('Filters cleared', '');
    });

    // close menus on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('.filter-chip')) closeAllMenus();
    });
  }

  /* run once on load */
  onScrollHeader();
})();

/* =================================================================
   SHARED HEADER — mobile/tablet drawer (Main Header design)
   ================================================================= */
(function () {
  'use strict';
  var overlay  = document.getElementById('overlay');
  var drawer   = document.getElementById('drawer');
  var openBtns = document.querySelectorAll('.js-menu-open');
  var closeBtn = document.querySelector('.js-menu-close');
  if (!overlay || !drawer) return;

  function openDrawer() {
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  openBtns.forEach(function (btn) { btn.addEventListener('click', openDrawer); });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1024) closeDrawer(); });
})();

/* ===== My Profile — personal information (edit / delete / gender) ===== */
(function () {
  var form = document.getElementById('piForm');
  if (!form) return;
  var editBtn = document.getElementById('piEdit');
  var delBtn = document.getElementById('piDelete');
  var inputs = form.querySelectorAll('input');
  var cc = document.getElementById('piCC');
  var radios = form.querySelectorAll('.pi-radio');
  var editing = false;

  function setEditing(on) {
    editing = on;
    form.classList.toggle('is-editing', on);
    inputs.forEach(function (i) { i.readOnly = !on; });
    if (cc) cc.disabled = !on;
    editBtn.textContent = on ? 'SAVE PROFILE' : 'EDIT PROFILE';
    if (on) { var f = document.getElementById('piFirst'); if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); } }
  }

  editBtn.addEventListener('click', function () {
    if (editing) {
      setEditing(false);
      if (window.showToast) window.showToast('Profile saved', 'Your changes have been updated');
    } else {
      setEditing(true);
    }
  });

  delBtn.addEventListener('click', function () {
    if (window.confirm('Delete your account? This action cannot be undone.')) {
      if (window.showToast) window.showToast('Account deleted', 'Your account has been removed');
    }
  });

  radios.forEach(function (r) {
    r.addEventListener('click', function () {
      radios.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
      r.classList.add('is-on');
      r.setAttribute('aria-checked', 'true');
    });
  });
})();

/* ===== Contact — enquiry form ===== */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('cfName');
    if (name && !name.value.trim()) {
      name.focus();
      if (window.showToast) window.showToast('Name required', 'Please enter your full name');
      return;
    }
    if (window.showToast) window.showToast('Enquiry sent', 'Thanks — our team will get back to you soon');
    form.reset();
  });
})();

/* ===== Header search popup ===== */
(function () {
  var pop = document.getElementById('searchPop');
  if (!pop) return;
  var input = document.getElementById('searchInput');
  var field = pop.querySelector('.search-pop__field');
  var rot = document.getElementById('searchRot');
  var words = ['Diamond Jewelry', 'Gold Necklaces', 'Engagement Rings'];
  var wi = 0, timer = null;

  function startRot() {
    stopRot();
    timer = setInterval(function () {
      wi = (wi + 1) % words.length;
      if (!rot) return;
      rot.style.opacity = '0';
      setTimeout(function () { rot.textContent = words[wi]; rot.style.opacity = '1'; }, 220);
    }, 2200);
  }
  function stopRot() { if (timer) { clearInterval(timer); timer = null; } }

  function openPop() {
    pop.classList.add('open');
    pop.setAttribute('aria-hidden', 'false');
    startRot();
    setTimeout(function () { if (input) input.focus(); }, 130);
  }
  function closePop() {
    pop.classList.remove('open');
    pop.setAttribute('aria-hidden', 'true');
    stopRot();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[aria-label="Search"]'), function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      pop.classList.contains('open') ? closePop() : openPop();
    });
  });
  Array.prototype.forEach.call(pop.querySelectorAll('[data-search-close]'), function (el) {
    el.addEventListener('click', closePop);
  });
  if (input) {
    input.addEventListener('input', function () {
      field.classList.toggle('has-text', input.value.trim().length > 0);
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pop.classList.contains('open')) closePop();
  });
})();

/* ===== Auth page — tabs / show-hide password / validation ===== */
(function () {
  var card = document.querySelector('.auth');
  if (!card) return;
  var tabs = Array.prototype.slice.call(card.querySelectorAll('.auth-tab'));
  var panels = Array.prototype.slice.call(card.querySelectorAll('.auth-form'));
  var tabsBar = card.querySelector('.auth-tabs');
  var ind = card.querySelector('.auth-tab-ind');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function show(name) {
    panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    if (ind) ind.style.transform = name === 'register' ? 'translateX(100%)' : 'translateX(0)';
    if (tabsBar) tabsBar.style.display = name === 'forgot' ? 'none' : '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  card.querySelectorAll('[data-tab]').forEach(function (el) {
    el.addEventListener('click', function () { show(el.getAttribute('data-tab')); });
  });
  card.querySelectorAll('[data-goto]').forEach(function (el) {
    el.addEventListener('click', function () { show(el.getAttribute('data-goto')); });
  });

  card.querySelectorAll('.pass-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentElement.querySelector('input');
      var reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      btn.classList.toggle('is-on', reveal);
      btn.setAttribute('aria-pressed', String(reveal));
      btn.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
    });
  });

  function setErr(field, msg) {
    var f = field.closest('.auth-field'); if (!f) return;
    var e = f.querySelector('.auth-err');
    if (e) { e.textContent = msg || ''; e.style.display = msg ? 'block' : 'none'; }
    field.classList.toggle('has-err', !!msg);
  }
  card.querySelectorAll('input').forEach(function (i) {
    i.addEventListener('input', function () { setErr(i, ''); });
  });

  card.querySelectorAll('.soc-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var n = (b.getAttribute('aria-label') || '').replace('Continue with ', '');
      if (window.showToast) window.showToast('Continue with ' + n, 'Connecting…');
    });
  });

  var login = document.getElementById('loginForm');
  if (login) login.addEventListener('submit', function (e) {
    e.preventDefault(); var ok = true;
    var em = login.querySelector('[name=email]'), pw = login.querySelector('[name=password]');
    if (!emailRe.test(em.value.trim())) { setErr(em, 'Enter a valid email address'); ok = false; }
    if (pw.value.length < 6) { setErr(pw, 'Password must be at least 6 characters'); ok = false; }
    if (!ok) return;
    if (window.showToast) window.showToast('Welcome back', 'Signing you in…');
    setTimeout(function () { window.location.href = 'profile.html'; }, 250);
  });

  var reg = document.getElementById('registerForm');
  if (reg) reg.addEventListener('submit', function (e) {
    e.preventDefault(); var ok = true;
    var fn = reg.querySelector('[name=firstName]'), em = reg.querySelector('[name=email]'),
        pw = reg.querySelector('[name=password]'), cf = reg.querySelector('[name=confirm]'),
        terms = reg.querySelector('[name=terms]'), te = document.getElementById('rgTermsErr');
    if (!fn.value.trim()) { setErr(fn, 'Required'); ok = false; }
    if (!emailRe.test(em.value.trim())) { setErr(em, 'Enter a valid email address'); ok = false; }
    if (pw.value.length < 6) { setErr(pw, 'At least 6 characters'); ok = false; }
    if (!cf.value || cf.value !== pw.value) { setErr(cf, 'Passwords do not match'); ok = false; }
    if (terms && !terms.checked) { if (te) { te.textContent = 'Please accept the terms to continue'; te.style.display = 'block'; } ok = false; }
    else if (te) { te.textContent = ''; te.style.display = 'none'; }
    if (!ok) return;
    if (window.showToast) window.showToast('Account created', 'Welcome to Boris & Twins');
    setTimeout(function () { window.location.href = 'profile.html'; }, 250);
  });

  var fg = document.getElementById('forgotForm');
  if (fg) fg.addEventListener('submit', function (e) {
    e.preventDefault();
    var em = fg.querySelector('[name=email]');
    if (!emailRe.test(em.value.trim())) { setErr(em, 'Enter a valid email address'); return; }
    if (window.showToast) window.showToast('Reset link sent', 'Check your inbox for instructions');
    setTimeout(function () { window.location.href = 'login.html'; }, 300);
  });
})();
