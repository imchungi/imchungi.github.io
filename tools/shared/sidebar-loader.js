/* Sidebar Loader — Neon Kinetic Tools */
(function () {
  async function loadSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    /* ── Fetch sidebar fragment ── */
    try {
      const res = await fetch('/tools/shared/sidebar.html');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      sidebar.innerHTML = await res.text();
    } catch (err) {
      console.warn('[Sidebar] Load failed:', err);
      return;
    }

    /* ── Active link highlighting ── */
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    sidebar.querySelectorAll('.sidebar-link').forEach(function (link) {
      const href = (link.getAttribute('href') || '').replace(/\/+$/, '') || '/';
      const exact = link.dataset.match === 'exact';
      const active = exact
        ? path === href
        : path === href || path.startsWith(href + '/');
      if (active) link.classList.add('active');
    });

    /* ── Mobile: inject toggle + overlay ── */
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    const toggle = document.createElement('button');
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-label', 'Toggle sidebar');
    toggle.innerHTML = '&#9776;';
    document.body.appendChild(toggle);

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }

    toggle.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    overlay.addEventListener('click', closeSidebar);

    sidebar.querySelectorAll('.sidebar-link').forEach(function (link) {
      link.addEventListener('click', closeSidebar);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
  } else {
    loadSidebar();
  }
})();
