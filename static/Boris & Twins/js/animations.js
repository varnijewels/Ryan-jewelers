/* =================================================================
   BORIS & TWINS — animations.js
   Premium, dependency-free motion layer. Kept separate from script.js
   (which handles functionality). All effects degrade gracefully and
   are fully disabled when the user prefers reduced motion.

   Contents:
     1. Page entrance
     2. Smart sticky header (hide on scroll down / show on scroll up)
     3. Scroll reveals (directional + stagger)
     4. Hero "Ken Burns" slow zoom + light parallax
     5. 3D tilt on cards (fine-pointer only)
     6. Count-up numbers + animated rating bars
     7. Ripple ink on buttons
     8. Magnetic primary CTAs
     9. Back-to-top scroll-progress ring
   ================================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = window.matchMedia && matchMedia('(pointer: fine)').matches;

  /* ---------- 1. Page entrance ---------- */
  document.body.classList.add('page-in');

  // From here on everything is motion; bail out for reduced-motion users.
  if (reduce) return;

  /* ---------- 2. Smart sticky header ---------- */
  (function () {
    var header = $('.site-header');
    if (!header) return;
    var last = window.pageYOffset, ticking = false;
    function update() {
      var y = window.pageYOffset;
      if (y > last && y > 200) header.classList.add('nav-hidden');   // scrolling down
      else header.classList.remove('nav-hidden');                    // scrolling up
      last = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  })();

  /* ---------- 3. Scroll reveals (directional + stagger) ---------- */
  (function () {
    if (!('IntersectionObserver' in window)) return;

    // Tag curated elements that aren't already handled by script.js (.reveal)
    function tag(selector, variant, stagger) {
      var els = $$(selector).filter(function (el) { return !el.classList.contains('reveal') && !el.classList.contains('a-reveal'); });
      els.forEach(function (el, i) {
        el.classList.add('a-reveal');
        if (variant) el.classList.add(variant);
        if (stagger) el.style.transitionDelay = (Math.min(i, 8) * 40) + 'ms';
      });
    }
    tag('.section-title:not(.hero-title)', '', false);
    tag('.section-head .text-link', 'a-right', false);
    tag('.breadcrumb', '', false);
    tag('.pdp-gallery', 'a-left', false);
    tag('.pdp-info', 'a-right', false);
    tag('.checkout-summary, .cart-total', 'a-right', false);
    tag('.pay-form .form-block, .checkout-main .addr-group, .checkout-main > .addr-add-wrap', 'a-left', true);
    tag('.rating-summary', 'a-left', false);
    tag('.review-item', '', true);
    tag('.benefit', '', true);
    tag('.catbar-item', '', true);
    tag('.footer-cols .f-col', '', true);
    tag('.pdp-banner, .review-figure, .sparkle-figure', 'a-zoom', false);

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.a-reveal').forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 4. Hero Ken Burns + light parallax ---------- */
  (function () {
    // Home banner: no animation (Ken Burns + parallax disabled on hero)
    var layers = $$('.pdp-banner img, .review-figure img');
    if (!layers.length) return;
    var ticking = false;
    function parallax() {
      var y = window.pageYOffset;
      layers.forEach(function (img) {
        var rect = img.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        var speed = 0.04;
        var offset = (rect.top - window.innerHeight / 2) * -speed;
        img.style.setProperty('--py', offset.toFixed(1) + 'px');
        // apply via translateY without clobbering ken-burns scale
        if (!img.classList.contains('kenburns')) img.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
  })();

  /* ---------- 5. 3D tilt on cards (fine pointer only) ---------- */
  if (fine) (function () {
    var cards = $$('.product-card, .cat-card, .insta-cell, .mini-card');
    cards.forEach(function (card) {
      card.classList.add('tilt');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(700px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 5).toFixed(2) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  })();

  /* ---------- 6. Count-up numbers + animated rating bars ---------- */
  (function () {
    if (!('IntersectionObserver' in window)) return;

    function animateNumber(el, to, decimals, prefix, suffix) {
      var start = null, dur = 850;
      function step(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (to * eased).toFixed(decimals);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // numbers like "4.5"
    $$('.score-num').forEach(function (el) { el.dataset.target = el.textContent.trim(); });
    // "(556 Review)" / "Review (8547)" — animate embedded integer
    $$('.score-count, .review-count').forEach(function (el) { el.dataset.tpl = el.textContent; });

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains('score-num')) {
          var t = parseFloat(el.dataset.target);
          el.classList.add('count-up');
          animateNumber(el, t, (el.dataset.target.indexOf('.') > -1 ? 1 : 0), '', '');
        } else if (el.classList.contains('bar')) {
          var fill = el.querySelector('i');
          if (fill) { var w = fill.style.width; fill.style.width = '0'; requestAnimationFrame(function () { fill.style.transition = 'width 1.1s cubic-bezier(.22,.61,.36,1)'; fill.style.width = w; }); }
        } else { // count-count text with embedded number
          var tpl = el.dataset.tpl || el.textContent;
          var m = tpl.match(/[\d,]+/);
          if (m) {
            var num = parseInt(m[0].replace(/,/g, ''), 10);
            var s = null, dur = 850, before = tpl.slice(0, m.index), after = tpl.slice(m.index + m[0].length);
            (function run(t) {
              if (s === null) s = t;
              var p = Math.min((t - s) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
              el.textContent = before + Math.round(num * eased).toLocaleString() + after;
              if (p < 1) requestAnimationFrame(run);
            })(performance.now());
          }
        }
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    $$('.score-num, .score-count, .review-count, .rating-bars .bar').forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 7. Ripple ink on buttons ---------- */
  (function () {
    var sel = '.btn-buy, .btn-checkout, .btn-apply, .add-btn, .btn-outline, .exp-btn, .hero-watch, .addr-add, .size-guide, .text-link';
    $$(sel).forEach(function (btn) { btn.classList.add('has-ripple'); });
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.has-ripple');
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var ink = document.createElement('span');
      ink.className = 'ripple-ink';
      ink.style.width = ink.style.height = size + 'px';
      ink.style.left = (e.clientX - r.left - size / 2) + 'px';
      ink.style.top  = (e.clientY - r.top  - size / 2) + 'px';
      btn.appendChild(ink);
      setTimeout(function () { ink.remove(); }, 650);
    });
  })();

  /* ---------- 8. Magnetic primary CTAs ---------- */
  if (fine) (function () {
    $$('.btn-buy, .btn-checkout, .hero-watch, .to-top').forEach(function (btn) {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (mx * 0.18).toFixed(1) + 'px,' + (my * 0.28).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  })();

  /* ---------- 9. Back-to-top scroll-progress ring ---------- */
  (function () {
    var btn = $('#toTop');
    if (!btn) return;
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'progress-ring');
    svg.setAttribute('viewBox', '0 0 52 52');
    var circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', '26'); circle.setAttribute('cy', '26'); circle.setAttribute('r', '24');
    var C = 2 * Math.PI * 24;
    circle.style.strokeDasharray = C;
    circle.style.strokeDashoffset = C;
    svg.appendChild(circle);
    btn.appendChild(svg);
    var ticking = false;
    function upd() {
      var st = document.documentElement.scrollTop || document.body.scrollTop;
      var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var p = h > 0 ? st / h : 0;
      circle.style.strokeDashoffset = (C * (1 - p)).toFixed(1);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(upd); ticking = true; }
    }, { passive: true });
    upd();
  })();

})();
