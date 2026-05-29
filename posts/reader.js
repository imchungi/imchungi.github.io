(function () {
  'use strict';

  const postListEl  = document.getElementById('post-list');
  const catFilterEl = document.getElementById('cat-filter');
  const welcome     = document.getElementById('welcome');
  const postBody    = document.getElementById('post-body');

  let allPosts       = [];
  let activeCategory = null; // null = 전체
  let activePostId   = null;

  marked.use({ gfm: true, breaks: true });

  // ── Fetch posts.json ──────────────────────────────────────
  fetch('posts.json')
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(data => {
      allPosts = data.map(p => ({
        ...p,
        title:    (p.title    || '').trim(),
        category: (p.category || '').trim(),
      }));
      allPosts.sort((a, b) => b.created_at.localeCompare(a.created_at));
      renderCategoryFilter();
      renderPosts();
    })
    .catch(err => {
      postListEl.innerHTML = `<li class="p-4 font-mono text-xs text-muted">posts.json 로드 실패: ${err.message}</li>`;
    });

  // ── Category filter ───────────────────────────────────────
  function renderCategoryFilter() {
    const cats = [...new Set(allPosts.map(p => p.category).filter(Boolean))];

    if (cats.length === 0) {
      catFilterEl.classList.add('hidden');
      return;
    }
    catFilterEl.classList.remove('hidden');
    catFilterEl.innerHTML = '';

    [null, ...cats].forEach(cat => {
      const btn = document.createElement('button');
      btn.textContent = cat ?? '전체';
      const active = activeCategory === cat;
      btn.className = [
        'font-mono text-xs px-2 py-0.5 rounded border transition-colors',
        active
          ? 'border-neon text-neon'
          : 'border-line text-muted hover:border-neon hover:text-neon',
      ].join(' ');
      btn.onclick = () => {
        activeCategory = cat;
        renderCategoryFilter();
        renderPosts();
      };
      catFilterEl.appendChild(btn);
    });
  }

  // ── Post list ─────────────────────────────────────────────
  function renderPosts() {
    postListEl.innerHTML = '';
    const list = activeCategory
      ? allPosts.filter(p => p.category === activeCategory)
      : allPosts;

    if (list.length === 0) {
      postListEl.innerHTML = `
        <li class="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <span class="font-mono text-2xl text-line select-none">[ ]</span>
          <p class="font-mono text-xs text-muted">no posts yet</p>
        </li>`;
      return;
    }

    list.forEach(post => {
      const li = document.createElement('li');
      const isActive = post.id === activePostId;
      li.className = [
        'px-3 py-2 rounded cursor-pointer group transition-colors',
        isActive ? 'bg-card' : 'hover:bg-card',
      ].join(' ');
      li.innerHTML = `
        <p class="font-mono text-[10px] text-muted mb-0.5">
          ${post.created_at}${post.category ? ' · ' + post.category : ''}
        </p>
        <p class="text-sm leading-snug transition-colors ${isActive ? 'text-neon' : 'text-content group-hover:text-neon'}">
          ${post.title || post.id}
        </p>`;
      li.onclick = () => loadPost(post);
      postListEl.appendChild(li);
    });
  }

  // ── Load & render post ────────────────────────────────────
  async function loadPost(post) {
    activePostId = post.id;
    renderPosts();

    welcome.classList.add('hidden');
    postBody.classList.remove('hidden');
    postBody.innerHTML = '<p class="font-mono text-xs" style="color:#9ca3af">Loading…</p>';

    try {
      const res = await fetch(post.path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const md = await res.text();
      postBody.innerHTML = marked.parse(md);
    } catch (err) {
      postBody.innerHTML = `<p class="font-mono text-xs" style="color:#ef4444">파일을 불러오지 못했습니다: ${err.message}</p>`;
    }
  }
})();
