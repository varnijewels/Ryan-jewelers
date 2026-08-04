/* =================================================================
   BORIS & TWINS — front-end commerce store
   Persistent cart + wishlist (localStorage), header count badges,
   cart/wishlist rendering, product-card add-to-cart & wishlist,
   and price / search filtering on the listing page.

   Loaded BEFORE script.js. Uses capture-phase click interception so
   the controls it fully owns don't also trigger script.js handlers
   (prevents double toasts / conflicting counts).
   ================================================================= */
(function () {
  'use strict';

  var CART_KEY = 'bt_cart_v1', WISH_KEY = 'bt_wish_v1', INIT_KEY = 'bt_init_v1';
  var SHIPPING = 56.25;

  /* ---------- storage helpers (safe on file://) ---------- */
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---------- defaults (match the original design on first load) ---------- */
  var DEFAULT_CART = [
    { id: 'wedding-diamond-rings', name: 'WEDDING DIAMOND RINGS', sub: 'Vintage 14k,18k & 24k Gold Band Checkered With Amethyst & Diamond', now: 286.75, old: 386.75, img: 'assets/images/Products-Details/Main.jpg', qty: 1 },
    { id: 'gold-diamond-rings', name: 'GOLD DIAMOND RINGS', sub: 'Vintage 14k,18k & 24k Gold Band Checkered With Amethyst & Diamond', now: 286.75, old: 386.75, img: 'assets/images/Products-Details/Rectangle 46218.jpg', qty: 1 }
  ];
  var DEFAULT_WISH = [
    { id: 'wedding-diamond-ring', name: 'Wedding Diamond Ring', meta: '14k, 18k, 24k Gold Ring', now: 286.75, old: 386.75, img: 'assets/images/Products-Details/Main.jpg' },
    { id: 'wedding-diamond-ring-2', name: 'Wedding Diamond Ring', meta: '14k, 18k, 24k Gold Ring', now: 286.75, old: 386.75, img: 'assets/images/Product-Images/Rectangle 26.jpg' },
    { id: 'wedding-diamond-ring-3', name: 'Wedding Diamond Ring', meta: '14k, 18k, 24k Gold Ring', now: 286.75, old: 386.75, img: 'assets/images/Product-Images/Rectangle 26-1.jpg' },
    { id: 'wedding-diamond-ring-4', name: 'Wedding Diamond Ring', meta: '14k, 18k, 24k Gold Ring', now: 286.75, old: 386.75, img: 'assets/images/Product-Images/Rectangle 26-2.jpg' }
  ];

  var cart, wish;
  if (!read(INIT_KEY)) {
    cart = DEFAULT_CART.slice(); wish = DEFAULT_WISH.slice();
    write(CART_KEY, cart); write(WISH_KEY, wish); write(INIT_KEY, 1);
  } else {
    cart = read(CART_KEY) || [];
    wish = read(WISH_KEY) || [];
  }

  /* ---------- small utils ---------- */
  function slug(s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function num(s) { var m = String(s).replace(/[^0-9.]/g, ''); return parseFloat(m) || 0; }
  function money(n) { return '$' + n.toFixed(2); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function save() { write(CART_KEY, cart); write(WISH_KEY, wish); }
  function toast(a, b, c) { if (window.showToast) window.showToast(a, b, c); }

  /* ---------- cart ops ---------- */
  function cartCount() { return cart.reduce(function (n, i) { return n + (i.qty || 1); }, 0); }
  function cartSubtotal() { return cart.reduce(function (n, i) { return n + i.now * (i.qty || 1); }, 0); }
  function cartFind(id) { for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i]; return null; }
  function addToCart(item, silent) {
    var ex = cartFind(item.id);
    if (ex) ex.qty += (item.qty || 1);
    else cart.push({ id: item.id, name: item.name, sub: item.sub || '', now: item.now, old: item.old || 0, img: item.img, qty: item.qty || 1 });
    save(); renderBadges();
    if (!silent) toast('Added to cart', item.name, 'cart.html');
  }
  function removeCart(id) { cart = cart.filter(function (i) { return i.id !== id; }); save(); renderBadges(); }
  function setQty(id, q) { var it = cartFind(id); if (it) { it.qty = Math.max(1, q); save(); renderBadges(); } }

  /* ---------- wishlist ops ---------- */
  function wishCount() { return wish.length; }
  function inWish(id) { return wish.some(function (i) { return i.id === id; }); }
  function addWish(item) { if (!inWish(item.id)) { wish.push(item); save(); renderBadges(); } }
  function removeWish(id) { wish = wish.filter(function (i) { return i.id !== id; }); save(); renderBadges(); }

  /* ---------- header count badges ---------- */
  function badgeOn(sel, count) {
    var btns = document.querySelectorAll(sel);
    Array.prototype.forEach.call(btns, function (b) {
      var span = b.querySelector('.hdr-badge');
      if (!span) {
        span = document.createElement('span');
        span.className = 'hdr-badge';
        b.style.position = b.style.position || 'relative';
        b.appendChild(span);
      }
      span.textContent = count;
      span.style.display = count > 0 ? 'grid' : 'none';
    });
  }
  function renderBadges() {
    badgeOn('[aria-label="Cart"]', cartCount());
    badgeOn('[aria-label="Wishlist"]', wishCount());
  }

  /* ---------- read a product card into a cart/wish item ---------- */
  function cardToItem(card) {
    var name = (card.querySelector('.product-name, .item-name, .pdp-title') || {}).textContent || 'Item';
    name = name.trim();
    var meta = (card.querySelector('.product-meta, .item-sub') || {}).textContent || '';
    var img = (card.querySelector('img') || {}).getAttribute ? card.querySelector('img').getAttribute('src') : '';
    var now = num((card.querySelector('.price-now, .now, .pdp-price .now, .pdp-now') || {}).textContent || '0');
    var old = num((card.querySelector('.price-old, .old') || {}).textContent || '0');
    if (!now) now = 286.75;
    return { id: slug(name) + (img ? '-' + slug(img.split('/').pop().split('.')[0]) : ''), name: name, sub: meta.trim(), meta: meta.trim(), now: now, old: old, img: img, qty: 1 };
  }

  /* ---------- render CART page ---------- */
  function cartItemHTML(it) {
    return '<li class="cart-item" data-id="' + esc(it.id) + '">' +
      '<label class="item-check"><input type="checkbox" checked><span class="cbx"><svg class="ic-check"><use href="#i-check"/></svg></span></label>' +
      '<a class="item-media" href="product.html"><img src="' + esc(it.img) + '" width="100" height="100" loading="lazy" alt="' + esc(it.name) + '"></a>' +
      '<div class="item-info"><h2 class="item-name">' + esc(it.name) + '</h2>' +
      '<p class="item-sub">' + esc(it.sub || '') + '</p>' +
      '<p class="item-price"><span class="now">' + money(it.now * (it.qty || 1)) + '</span>' +
      (it.old ? '<span class="old">' + money(it.old * (it.qty || 1)) + '</span>' : '') + '</p></div>' +
      '<div class="item-actions">' +
      '<button class="item-ic" type="button" aria-label="Move to wishlist"><svg class="ic-sm"><use href="#i-heart"/></svg></button>' +
      '<button class="item-ic danger" type="button" aria-label="Remove item"><svg class="ic-sm"><use href="#i-trash"/></svg></button></div>' +
      '<div class="qty" aria-label="Quantity">' +
      '<button class="qty-inc" type="button" aria-label="Increase quantity">+</button>' +
      '<span class="qty-val">' + (it.qty || 1) + '</span>' +
      '<button class="qty-dec" type="button" aria-label="Decrease quantity">−</button></div></li>';
  }
  function setRow(dt, value) {
    var rows = document.querySelectorAll('.ct-prices .ct-row');
    Array.prototype.forEach.call(rows, function (r) {
      var k = r.querySelector('dt'); var v = r.querySelector('dd');
      if (k && v && k.textContent.trim().toLowerCase() === dt) v.textContent = value;
    });
  }
  var discount = 0;
  function renderCartTotals() {
    var sub = cartSubtotal();
    var ship = cart.length ? SHIPPING : 0;
    var grand = Math.max(0, sub + ship - discount);
    setRow('subtotal', money(sub));
    setRow('shipping charge', money(ship));
    setRow('discount', money(discount));
    setRow('grand total', money(grand));
    var cc = document.getElementById('cartCount');
    if (cc) cc.textContent = cartCount();
  }
  function renderCart() {
    var list = document.getElementById('cartList');
    if (!list) return;
    if (!cart.length) {
      list.innerHTML = '<li class="cart-empty" style="padding:40px 0;color:var(--muted)">Your cart is empty. <a href="rings.html" style="color:var(--maroon)">Continue shopping →</a></li>';
    } else {
      list.innerHTML = cart.map(cartItemHTML).join('');
    }
    renderCartTotals();
  }

  /* ---------- render WISHLIST page ---------- */
  function wishCardHTML(it) {
    var on = true; // rendered items are in the wishlist
    return '<article class="product-card reveal in" data-id="' + esc(it.id) + '">' +
      '<a class="product-media" href="product.html"><img src="' + esc(it.img) + '" width="238" height="231" loading="lazy" alt="' + esc(it.name) + '"></a>' +
      '<div class="product-info"><h2 class="product-name">' + esc(it.name) + '</h2>' +
      '<p class="product-meta">' + esc(it.meta || '') + '</p>' +
      '<div class="product-bottom"><div class="price"><span class="price-now">' + money(it.now) + '</span>' +
      (it.old ? '<span class="price-old">' + money(it.old) + '</span>' : '') + '</div>' +
      '<div class="card-actions"><button class="wish-btn is-active" type="button" aria-label="Remove from wishlist" aria-pressed="true"><svg class="ic-sm"><use href="#i-heart-fill"/></svg></button>' +
      '<button class="add-btn" type="button"><svg class="ic-sm"><use href="#i-bag"/></svg>Add</button></div></div></article>';
  }
  function renderWishlist() {
    var grid = document.querySelector('.wishlist-grid');
    if (!grid) return;
    if (!wish.length) {
      grid.innerHTML = '<p class="wish-empty" style="padding:30px 0;color:var(--muted)">Your wishlist is empty. <a href="rings.html" style="color:var(--maroon)">Browse jewelry →</a></p>';
    } else {
      grid.innerHTML = wish.map(wishCardHTML).join('');
    }
  }

  /* ---------- reflect heart state on listing product cards ---------- */
  function reflectHearts() {
    var cards = document.querySelectorAll('.product-grid .product-card, .best-grid .product-card');
    Array.prototype.forEach.call(cards, function (card) {
      var btn = card.querySelector('.wish-btn');
      if (!btn || card.closest('.wishlist-grid')) return;
      var it = cardToItem(card);
      var on = inWish(it.id);
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
      var use = btn.querySelector('use');
      if (use) use.setAttribute('href', on ? '#i-heart-fill' : '#i-heart');
    });
  }

  /* ================= capture-phase click interception ================= */
  document.addEventListener('click', function (e) {
    var t = e.target;

    /* product-card / wishlist "Add" → add to cart */
    var addBtn = t.closest && t.closest('.add-btn');
    if (addBtn) {
      var card = addBtn.closest('.product-card, .best-card');
      if (card) {
        e.stopImmediatePropagation(); e.preventDefault();
        addToCart(cardToItem(card));
        addBtn.animate && addBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 200 });
        return;
      }
    }

    /* wishlist heart on a product card → toggle */
    var wishBtn = t.closest && t.closest('.wish-btn');
    if (wishBtn) {
      var wcard = wishBtn.closest('.product-card, .best-card');
      if (wcard) {
        e.stopImmediatePropagation(); e.preventDefault();
        var it = cardToItem(wcard);
        if (inWish(it.id)) {
          removeWish(it.id);
          wishBtn.classList.remove('is-active'); wishBtn.setAttribute('aria-pressed', 'false');
          var u1 = wishBtn.querySelector('use'); if (u1) u1.setAttribute('href', '#i-heart');
          if (wcard.closest('.wishlist-grid')) { wcard.style.transition = 'opacity .2s'; wcard.style.opacity = '0'; setTimeout(function () { wcard.remove(); if (!wish.length) renderWishlist(); }, 200); }
          toast('Removed from wishlist', it.name);
        } else {
          addWish({ id: it.id, name: it.name, meta: it.meta, now: it.now, old: it.old, img: it.img });
          wishBtn.classList.add('is-active'); wishBtn.setAttribute('aria-pressed', 'true');
          var u2 = wishBtn.querySelector('use'); if (u2) u2.setAttribute('href', '#i-heart-fill');
          toast('Added to wishlist', it.name);
        }
        return;
      }
    }

    /* CART page controls */
    var row = t.closest && t.closest('.cart-item');
    if (row && document.getElementById('cartList')) {
      var id = row.getAttribute('data-id');
      if (t.closest('.qty-inc')) { e.stopImmediatePropagation(); var a = cartFind(id); setQty(id, (a ? a.qty : 1) + 1); updateRow(row, id); return; }
      if (t.closest('.qty-dec')) { e.stopImmediatePropagation(); var b = cartFind(id); setQty(id, (b ? b.qty : 1) - 1); updateRow(row, id); return; }
      if (t.closest('.item-ic.danger')) {
        e.stopImmediatePropagation();
        removeCart(id); row.style.transition = 'opacity .25s'; row.style.opacity = '0';
        setTimeout(function () { row.remove(); if (!cart.length) renderCart(); }, 250);
        renderCartTotals(); toast('Removed from cart', '');
        return;
      }
      if (t.closest('.item-ic:not(.danger)')) { /* move to wishlist */
        e.stopImmediatePropagation();
        var ci = cartFind(id);
        if (ci) { addWish({ id: ci.id, name: ci.name, meta: ci.sub, now: ci.now, old: ci.old, img: ci.img }); removeCart(id); }
        row.style.transition = 'opacity .25s'; row.style.opacity = '0';
        setTimeout(function () { row.remove(); if (!cart.length) renderCart(); }, 250);
        renderCartTotals(); toast('Moved to wishlist', ci ? ci.name : '');
        return;
      }
    }
  }, true);

  function updateRow(row, id) {
    var it = cartFind(id); if (!it) return;
    var v = row.querySelector('.qty-val'); if (v) v.textContent = it.qty;
    var now = row.querySelector('.item-price .now'); if (now) now.textContent = money(it.now * it.qty);
    var old = row.querySelector('.item-price .old'); if (old && it.old) old.textContent = money(it.old * it.qty);
    renderCartTotals();
  }

  /* discount code on cart page */
  document.addEventListener('click', function (e) {
    var apply = e.target.closest && e.target.closest('.btn-apply');
    if (apply && document.getElementById('cartList')) {
      var inp = document.getElementById('discount');
      var code = inp ? inp.value.trim() : '';
      if (code) { discount = Math.min(cartSubtotal() * 0.1, 50); renderCartTotals(); }
    }
  });

  /* ---------- PDP add to cart (let script.js still navigate) ---------- */
  document.addEventListener('click', function (e) {
    var pdpAdd = e.target.closest && e.target.closest('.pdp-cta .btn-outline, .pdp-cta .btn-buy, #pdpAddCart');
    if (pdpAdd) {
      var pdp = document.querySelector('.pdp, .product-details, main');
      var it = cardToItem(pdp || document.body);
      addToCart(it, true); /* silent: script.js shows its own toast */
    }
  }, true);

  /* ================= listing: price filter + search ================= */
  function parseRange(label) {
    var l = label.toLowerCase();
    var nums = (l.match(/[0-9][0-9,]*/g) || []).map(function (s) { return parseFloat(s.replace(/,/g, '')); });
    if (/under|below|less/.test(l) && nums.length) return [0, nums[0]];
    if (/above|over|more|\+/.test(l) && nums.length) return [nums[0], Infinity];
    if (nums.length >= 2) return [nums[0], nums[1]];
    if (nums.length === 1) return [0, nums[0]];
    return null;
  }
  var origCount = null;
  function applyListingFilter() {
    var grid = document.querySelector('.listing-grid .product-grid');
    if (!grid) return;
    var countEl = document.querySelector('.product-count');
    if (countEl && origCount === null) origCount = countEl.textContent;
    var ranges = [];
    document.querySelectorAll('.filter-chip').forEach(function (chip) {
      var head = (chip.querySelector('.filter-chip-btn') || {}).textContent || '';
      if (!/price/i.test(head)) return;
      chip.querySelectorAll('.filter-opt input:checked').forEach(function (inp) {
        var lbl = inp.closest('.filter-opt');
        var r = parseRange(lbl ? lbl.textContent : '');
        if (r) ranges.push(r);
      });
    });
    var q = (window.__btSearch || '').trim().toLowerCase();
    var shown = 0;
    grid.querySelectorAll('.product-card').forEach(function (card) {
      var price = num((card.querySelector('.price-now') || {}).textContent || '0');
      var name = ((card.querySelector('.product-name') || {}).textContent || '').toLowerCase();
      var okPrice = !ranges.length || ranges.some(function (r) { return price >= r[0] && price <= r[1]; });
      var okQ = !q || name.indexOf(q) !== -1;
      var show = okPrice && okQ;
      card.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    var active = ranges.length || q;
    if (countEl) countEl.textContent = active ? (shown + ' PRODUCTS') : (origCount || countEl.textContent);
  }
  window.__btApplyFilter = applyListingFilter;

  /* ---------- sort dropdown + real sorting ---------- */
  var origOrder = null, currentSort = 'featured';
  function applySort() {
    var grid = document.querySelector('.listing-grid .product-grid');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.product-card'));
    if (!origOrder) origOrder = cards.slice();
    var arr;
    if (currentSort === 'featured') {
      arr = origOrder.slice();
    } else {
      arr = cards.slice().sort(function (a, b) {
        if (currentSort === 'price-asc' || currentSort === 'price-desc') {
          var pa = num((a.querySelector('.price-now') || {}).textContent || '0');
          var pb = num((b.querySelector('.price-now') || {}).textContent || '0');
          return currentSort === 'price-asc' ? pa - pb : pb - pa;
        }
        var na = ((a.querySelector('.product-name') || {}).textContent || '').trim().toLowerCase();
        var nb = ((b.querySelector('.product-name') || {}).textContent || '').trim().toLowerCase();
        return currentSort === 'name-asc' ? na.localeCompare(nb) : nb.localeCompare(na);
      });
    }
    arr.forEach(function (c) { grid.appendChild(c); });
  }
  function initSort() {
    var btn = document.getElementById('sortBtn');
    var menu = document.getElementById('sortMenu');
    var label = document.getElementById('sortLabel');
    if (!btn || !menu) return;
    function close() { menu.hidden = true; btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    function open() { menu.hidden = false; btn.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); menu.hidden ? open() : close(); });
    menu.querySelectorAll('.sort-opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        menu.querySelectorAll('.sort-opt').forEach(function (o) { o.classList.remove('is-active'); o.setAttribute('aria-selected', 'false'); });
        opt.classList.add('is-active'); opt.setAttribute('aria-selected', 'true');
        currentSort = opt.getAttribute('data-sort');
        if (label) label.textContent = opt.textContent.toUpperCase();
        close();
        applySort();
      });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.sort-wrap')) close(); });
  }

  document.addEventListener('change', function (e) {
    if (e.target.closest && e.target.closest('.filter-opt')) applyListingFilter();
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#filterClear')) { window.__btSearch = ''; setTimeout(applyListingFilter, 0); }
  });

  /* ---------- search popup → filter / redirect ---------- */
  function initSearch() {
    var input = document.getElementById('searchInput');
    var params = new URLSearchParams(location.search);
    var q = params.get('q');
    var onListing = !!document.querySelector('.listing-grid .product-grid');
    if (q) {
      window.__btSearch = q;
      if (input) { input.value = q; var f = input.closest('.search-pop__field'); if (f) f.classList.add('has-text'); }
      if (onListing) applyListingFilter();
    }
    if (!input) return;
    input.addEventListener('input', function () {
      if (onListing) { window.__btSearch = input.value; applyListingFilter(); }
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var term = input.value.trim();
        if (onListing) { window.__btSearch = term; applyListingFilter(); }
        else { window.location.href = 'rings.html' + (term ? '?q=' + encodeURIComponent(term) : ''); }
      }
    }, true);
  }

  /* ---------- boot ---------- */
  function boot() {
    renderCart();
    renderWishlist();
    renderBadges();
    reflectHearts();
    initSearch();
    initSort();
    if (document.querySelector('.listing-grid .product-grid')) applyListingFilter();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* public hook */
  window.BTStore = { addToCart: addToCart, addWish: addWish, cart: function () { return cart; }, wish: function () { return wish; } };
})();
