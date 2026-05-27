(function () {
  'use strict';

  // Prevent double-initialization
  if (window.__spendLensWidgetLoaded) return;
  window.__spendLensWidgetLoaded = true;

  // ── Config ──────────────────────────────────────────────────────────
  var APP_URL = 'https://spend-lens-xi.vercel.app';
  var COLORS = {
    accent: '#ff4d00',
    accentHover: '#e64500',
    primary: '#0f172a',
    overlay: 'rgba(15, 23, 42, 0.6)',
    white: '#ffffff',
  };
  var Z_INDEX = 2147483000; // near max to stay on top

  // ── Helpers ─────────────────────────────────────────────────────────
  function createElement(tag, styles, attrs) {
    var el = document.createElement(tag);
    if (styles) Object.assign(el.style, styles);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        el.setAttribute(k, attrs[k]);
      });
    }
    return el;
  }

  function animate(el, from, to, duration, cb) {
    el.style.transition = 'none';
    Object.assign(el.style, from);
    // Force reflow so the browser registers the "from" state
    void el.offsetHeight;
    el.style.transition = 'all ' + duration + 'ms cubic-bezier(0.4,0,0.2,1)';
    Object.assign(el.style, to);
    if (cb) {
      setTimeout(cb, duration);
    }
  }

  // ── Floating Button ─────────────────────────────────────────────────
  var btn = createElement('button', {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: String(Z_INDEX),
    padding: '14px 22px',
    border: 'none',
    borderRadius: '50px',
    background: COLORS.accent,
    color: COLORS.white,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.01em',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255,77,0,0.4), 0 2px 6px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    lineHeight: '1',
    opacity: '0',
    transform: 'translateY(20px) scale(0.95)',
    outline: 'none',
  }, {
    'aria-label': 'Audit Your AI Spend — Free',
    'data-spendlens': 'trigger',
  });

  // Spark SVG icon
  btn.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>' +
    '</svg>' +
    '<span>Audit Your AI Spend — Free</span>';

  // Hover effects
  btn.addEventListener('mouseenter', function () {
    btn.style.background = COLORS.accentHover;
    btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.style.boxShadow = '0 6px 20px rgba(255,77,0,0.5), 0 3px 10px rgba(0,0,0,0.2)';
  });
  btn.addEventListener('mouseleave', function () {
    btn.style.background = COLORS.accent;
    btn.style.transform = 'translateY(0) scale(1)';
    btn.style.boxShadow = '0 4px 14px rgba(255,77,0,0.4), 0 2px 6px rgba(0,0,0,0.15)';
  });

  // ── Modal Overlay ───────────────────────────────────────────────────
  var overlay = createElement('div', {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: String(Z_INDEX + 1),
    background: COLORS.overlay,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'none',
    opacity: '0',
    alignItems: 'center',
    justifyContent: 'center',
  }, {
    'data-spendlens': 'overlay',
  });

  // Modal container
  var modal = createElement('div', {
    position: 'relative',
    width: '94vw',
    maxWidth: '1100px',
    height: '88vh',
    maxHeight: '750px',
    borderRadius: '16px',
    overflow: 'hidden',
    background: COLORS.white,
    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
    transform: 'scale(0.92) translateY(30px)',
    opacity: '0',
  });

  // Header bar
  var header = createElement('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '48px',
    background: COLORS.primary,
    color: COLORS.white,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.02em',
    flexShrink: '0',
  });

  // Title in header
  var headerTitle = createElement('span', {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });
  headerTitle.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>' +
    '</svg>' +
    'SpendLens';

  // Close button
  var closeBtn = createElement('button', {
    background: 'transparent',
    border: 'none',
    color: COLORS.white,
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0.7',
    outline: 'none',
  }, {
    'aria-label': 'Close SpendLens',
  });
  closeBtn.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"></line>' +
    '<line x1="6" y1="6" x2="18" y2="18"></line>' +
    '</svg>';
  closeBtn.addEventListener('mouseenter', function () {
    closeBtn.style.opacity = '1';
    closeBtn.style.background = 'rgba(255,255,255,0.1)';
  });
  closeBtn.addEventListener('mouseleave', function () {
    closeBtn.style.opacity = '0.7';
    closeBtn.style.background = 'transparent';
  });

  header.appendChild(headerTitle);
  header.appendChild(closeBtn);

  // Iframe
  var iframe = createElement('iframe', {
    width: '100%',
    height: 'calc(100% - 48px)',
    border: 'none',
    display: 'block',
  }, {
    src: 'about:blank',
    title: 'SpendLens — AI Spend Audit',
    allow: 'clipboard-write',
    loading: 'lazy',
  });

  modal.appendChild(header);
  modal.appendChild(iframe);
  overlay.appendChild(modal);

  // ── Actions ─────────────────────────────────────────────────────────
  var isOpen = false;

  function openModal() {
    if (isOpen) return;
    isOpen = true;

    // Load the app only on first open
    if (iframe.getAttribute('src') === 'about:blank') {
      iframe.setAttribute('src', APP_URL);
    }

    overlay.style.display = 'flex';
    animate(overlay,
      { opacity: '0' },
      { opacity: '1' },
      300
    );
    animate(modal,
      { transform: 'scale(0.92) translateY(30px)', opacity: '0' },
      { transform: 'scale(1) translateY(0)', opacity: '1' },
      400
    );

    // Hide the trigger button
    animate(btn,
      { opacity: '1', transform: 'translateY(0) scale(1)' },
      { opacity: '0', transform: 'translateY(20px) scale(0.9)', pointerEvents: 'none' },
      250
    );

    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!isOpen) return;
    isOpen = false;

    animate(modal,
      { transform: 'scale(1) translateY(0)', opacity: '1' },
      { transform: 'scale(0.95) translateY(20px)', opacity: '0' },
      250
    );
    animate(overlay,
      { opacity: '1' },
      { opacity: '0' },
      300,
      function () {
        overlay.style.display = 'none';
      }
    );

    // Show the trigger button again
    animate(btn,
      { opacity: '0', transform: 'translateY(20px) scale(0.9)' },
      { opacity: '1', transform: 'translateY(0) scale(1)', pointerEvents: 'auto' },
      350
    );

    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  // Close on overlay click (outside modal)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeModal();
  });

  // ── Mount ───────────────────────────────────────────────────────────
  function mount() {
    document.body.appendChild(btn);
    document.body.appendChild(overlay);

    // Entrance animation for the button (delayed slightly)
    setTimeout(function () {
      animate(btn,
        { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
        { opacity: '1', transform: 'translateY(0) scale(1)' },
        500
      );
    }, 800);
  }

  // Mount when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
