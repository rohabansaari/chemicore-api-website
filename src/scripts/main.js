import Lenis from 'lenis';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(pointer: fine)').matches;
const root = document.documentElement;
const page = document.body.dataset.page;

/* CSS zoom (desktop renders at 80%) — pointer maths must divide by it */
let Z = 1;
const getZ = () => { Z = parseFloat(getComputedStyle(root).zoom) || 1; };
getZ();
addEventListener('resize', getZ);

/* ---------- smooth scroll ---------- */
let lenis = null;
if (!RM) {
  try {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  } catch { lenis = null; }
}

/* ---------- split headings into masked words ---------- */
function split(el) {
  let i = 0;
  const walk = (n) => [...n.childNodes].forEach((c) => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) { f.append(' '); return; }
        const w = document.createElement('span'); w.className = 'w';
        const s = document.createElement('span'); s.textContent = p; s.style.setProperty('--i', i++);
        w.append(s); f.append(w);
      });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.classList.contains('rot')) {
      const w = document.createElement('span'); w.className = 'w';
      const s = document.createElement('span'); s.style.setProperty('--i', i++);
      c.replaceWith(w); s.append(c); w.append(s);
    } else if (c.nodeType === 1) walk(c);
  });
  walk(el);
}
$$('.split').forEach(split);

/* ---------- page transitions between real pages ---------- */
const wipe = $('#wipe'), wipe2 = $('#wipe2'), wt = $('#wt');
const NAMES = { '/': 'Home', '/about/': 'About us', '/services/': 'Services', '/mission/': 'Mission', '/products/': 'Products', '/contact/': 'Contact' };
const norm = (p) => (p.endsWith('/') ? p : p + '/');

function start() {
  document.body.classList.add('play');
  armReveals();
  onScroll();
}

let leaving = false;
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname && url.search === location.search) {
    if (url.hash) return;
    e.preventDefault(); closeMenu();
    lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    return;
  }
  if (RM) return;
  e.preventDefault();
  if (leaving) return;
  leaving = true;
  const name = NAMES[norm(url.pathname)] || '';
  wt.textContent = name;
  try { sessionStorage.setItem('cc-wipe', name || ' '); } catch {}
  [wipe2, wipe].forEach((w) => { w.classList.remove('in', 'out'); void w.offsetWidth; w.classList.add('in'); });
  setTimeout(() => { location.href = url.href; }, 700);
});
// Restore state if the browser brings the page back from the back/forward cache.
addEventListener('pageshow', (e) => {
  if (e.persisted) { leaving = false; [wipe2, wipe].forEach((w) => w.classList.remove('in', 'out')); closeMenu(); }
});

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -6% 0px' });
function armReveals() {
  if (RM) return;
  $$('[data-r]').forEach((el) => { el.classList.add('pre'); io.observe(el); });
}

/* ---------- header, mobile menu ---------- */
const hdr = $('#hdr'), burger = $('#burger');
function closeMenu() {
  lenis && lenis.start();
  hdr.classList.remove('menu'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
}
burger.addEventListener('click', () => {
  const o = !hdr.classList.contains('menu');
  hdr.classList.toggle('menu', o); burger.setAttribute('aria-expanded', String(o));
  document.body.style.overflow = o ? 'hidden' : '';
  lenis && (o ? lenis.stop() : lenis.start());
});
addEventListener('keydown', (e) => { if (e.key === 'Escape' && hdr.classList.contains('menu')) closeMenu(); });

/* ---------- marquee ---------- */
const mq = $('#mq');
if (mq) mq.innerHTML += mq.innerHTML;

/* ---------- mission scrub ---------- */
const scrub = $('#scrub');
let sws = [];
if (scrub) {
  const t = scrub.textContent.trim(); scrub.textContent = ''; let hl = false;
  t.split(/(\s+)/).forEach((p) => {
    if (/^\s+$/.test(p)) { scrub.append(' '); return; }
    let w = p; if (w.startsWith('[')) { hl = true; w = w.slice(1); }
    const s = document.createElement('span'); s.className = 'sw' + (hl ? ' hl' : ''); s.textContent = w.replace(']', '');
    scrub.append(s); if (p.includes(']')) hl = false;
  });
  sws = $$('.sw', scrub);
}

/* ---------- scroll-linked effects ---------- */
const prog = $('#prog'), lat = $('.lat');
const steps = $('#steps'), lis = $$('#steps li'), sf = $('#sf'), tn = $('#tn'), tt = $('#tt'), td = $('#td'), tsh = $('#ts');
let lastStep = -1, ticking = false;
function onScroll() {
  ticking = false;
  const y = scrollY, H = root.scrollHeight - innerHeight;
  hdr.classList.toggle('scrolled', y > 30);
  prog.style.transform = `scaleX(${H > 0 ? Math.min(1, y / H) : 0})`;
  if (lat && !RM) lat.style.translate = `0 ${Math.min(y, 1200) * 0.3}px`;
  if (steps) {
    const r = steps.getBoundingClientRect(), c = innerHeight * 0.55;
    const p = Math.max(0, Math.min(1, (c - r.top - 30) / (r.height - 60)));
    sf.style.transform = `scaleY(${p})`;
    let n = 0;
    lis.forEach((li) => { const a = li.getBoundingClientRect().top + 30 < c; li.classList.toggle('act', a); if (a) n++; });
    n = Math.max(1, n);
    if (n !== lastStep) { lastStep = n; tn.textContent = `Stage ${n} of ${lis.length}`; tt.innerHTML = `<span>${lis[n - 1].dataset.t}</span>`; }
    const q = (n - 1) / (lis.length - 1);
    td.style.width = `calc(${q * 100}% - ${q * 30}px + 15px)`; tsh.style.left = `calc(${q * 100}% - ${q * 30}px)`;
  }
  if (sws.length) {
    const r = scrub.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.25)));
    const k = Math.round(p * sws.length); sws.forEach((s, i) => s.classList.toggle('lit', i < k));
  }
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);

/* ---------- pointer niceties ---------- */
if (FINE && !RM) {
  $$('.mag').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.28 / Z}px ${(e.clientY - r.top - r.height / 2) * 0.38 / Z}px`;
    });
    el.addEventListener('mouseleave', () => { el.style.translate = ''; });
  });
  const cu = document.createElement('div'); cu.className = 'cur'; cu.innerHTML = '<span></span>'; document.body.append(cu);
  let mx = -100, my = -100, qx = -100, qy = -100;
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY; cu.classList.add('on');
    const t = e.target.closest('[data-cur]'), h = !t && e.target.closest('a,button,input,textarea,select,label');
    cu.classList.toggle('lab', !!t); cu.classList.toggle('hov', !!h);
    if (t) cu.firstChild.textContent = t.dataset.cur;
  });
  root.addEventListener('mouseleave', () => cu.classList.remove('on'));
  (function loop() { qx += (mx - qx) * 0.2; qy += (my - qy) * 0.2; cu.style.transform = `translate(${qx / Z}px,${qy / Z}px)`; requestAnimationFrame(loop); })();
}
$$('.tile').forEach((t) => {
  const set = (e) => { const r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) / Z + 'px'); t.style.setProperty('--my', (e.clientY - r.top) / Z + 'px'); };
  t.addEventListener('mouseenter', set); t.addEventListener('mouseleave', set);
});

/* ---------- accordions ---------- */
$$('.acc-h').forEach((b) => b.addEventListener('click', () => {
  const it = b.parentElement, open = it.classList.contains('open');
  $$('.acc-i', it.parentElement).forEach((x) => { x.classList.remove('open'); $('.acc-h', x).setAttribute('aria-expanded', 'false'); });
  if (!open) { it.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
}));

/* ---------- rotating hero word ---------- */
const rot = $('.rot');
if (rot) {
  const RW = ['tablet', 'capsule', 'syrup', 'sterile']; let ri = 0;
  const meas = (w) => { const m = document.createElement('span'); m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap'; m.textContent = w; rot.append(m); const v = m.offsetWidth; m.remove(); return v; };
  const fit = () => { rot.style.width = meas(RW[ri]) + 'px'; };
  fit(); document.fonts && document.fonts.ready.then(fit);
  if (!RM) setInterval(() => {
    if (document.hidden) return;
    const sp = rot.firstElementChild; sp.className = 'out';
    setTimeout(() => { ri = (ri + 1) % RW.length; rot.style.width = meas(RW[ri]) + 'px'; sp.textContent = RW[ri]; sp.className = 'inn'; }, 430);
  }, 3000);
}

/* ---------- supply-route legend ---------- */
const rsvg = $('.rmap .zwrap>svg');
$$('#rleg button').forEach((b) => {
  const on = () => { rsvg.classList.add('focus'); $$('.rt,.mv', rsvg).forEach((x) => x.classList.toggle('on', (x.id || x.dataset.rt) === b.dataset.rt)); $$('#rleg button').forEach((x) => x.classList.toggle('on', x === b)); };
  const off = () => { rsvg.classList.remove('focus'); $$('#rleg button').forEach((x) => x.classList.remove('on')); };
  b.addEventListener('mouseenter', on); b.addEventListener('focus', on); b.addEventListener('mouseleave', off); b.addEventListener('blur', off);
  b.addEventListener('click', () => (b.classList.contains('on') ? off() : on()));
});

/* ---------- zoomable maps ---------- */
function zoomable(wrap) {
  const svg = wrap.querySelector(':scope>svg'), zl = $('.zl', wrap), bi = $('.zi', wrap), bo = $('.zo', wrap), br = $('.zr', wrap), MAX = 4;
  const [bx, by, bw, bh] = svg.getAttribute('viewBox').split(/[\s,]+/).map(Number);
  let s = 1, cx = bx + bw / 2, cy = by + bh / 2, ts = 1, tcx = cx, tcy = cy, anim = 0;
  const apply = () => { const w = bw / s, h = bh / s; svg.setAttribute('viewBox', `${cx - w / 2} ${cy - h / 2} ${w} ${h}`); };
  const clamp = () => { const w = bw / ts, h = bh / ts; tcx = Math.min(bx + bw - w / 2, Math.max(bx + w / 2, tcx)); tcy = Math.min(by + bh - h / 2, Math.max(by + h / 2, tcy)); };
  const tick = () => {
    s += (ts - s) * 0.2; cx += (tcx - cx) * 0.2; cy += (tcy - cy) * 0.2;
    if (Math.abs(ts - s) < 0.002 && Math.abs(tcx - cx) < 0.1 && Math.abs(tcy - cy) < 0.1) { s = ts; cx = tcx; cy = tcy; apply(); anim = 0; return; }
    apply(); anim = requestAnimationFrame(tick);
  };
  const go = () => {
    clamp(); zl.textContent = Math.round(ts * 10) / 10 + '×'; wrap.classList.toggle('zoomed', ts > 1.001);
    if (ts > 1.001) svg.dataset.cur = 'Drag'; else delete svg.dataset.cur;
    bi.disabled = ts >= MAX - 0.001; bo.disabled = br.disabled = ts <= 1.001;
    if (RM) { s = ts; cx = tcx; cy = tcy; apply(); } else if (!anim) anim = requestAnimationFrame(tick);
  };
  const zoomAt = (f, px, py) => { const ns = Math.min(MAX, Math.max(1, ts * f)); tcx = px + (tcx - px) * ts / ns; tcy = py + (tcy - py) * ts / ns; ts = ns; go(); };
  const pt = (x, y) => { const r = svg.getBoundingClientRect(), w = bw / s, h = bh / s; return [cx - w / 2 + (x - r.left) / r.width * w, cy - h / 2 + (y - r.top) / r.height * h]; };
  bi.addEventListener('click', () => zoomAt(1.6, tcx, tcy));
  bo.addEventListener('click', () => zoomAt(1 / 1.6, tcx, tcy));
  br.addEventListener('click', () => { ts = 1; tcx = bx + bw / 2; tcy = by + bh / 2; go(); });
  svg.addEventListener('dblclick', (e) => { e.preventDefault(); zoomAt(1.8, ...pt(e.clientX, e.clientY)); });
  svg.addEventListener('wheel', (e) => { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, ...pt(e.clientX, e.clientY)); }, { passive: false });
  const P = new Map(); let lastD = 0;
  svg.addEventListener('pointerdown', (e) => {
    P.set(e.pointerId, [e.clientX, e.clientY]);
    if (P.size === 2) { const [a, b] = [...P.values()]; lastD = Math.hypot(a[0] - b[0], a[1] - b[1]); }
    if (ts > 1.001 || P.size === 2) svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', (e) => {
    if (!P.has(e.pointerId)) return;
    const [ox, oy] = P.get(e.pointerId); P.set(e.pointerId, [e.clientX, e.clientY]);
    if (P.size === 2) { const [a, b] = [...P.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (lastD) zoomAt(d / lastD, ...pt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)); lastD = d; return; }
    if (ts <= 1.001) return;
    const r = svg.getBoundingClientRect();
    tcx -= (e.clientX - ox) * (bw / s) / r.width; tcy -= (e.clientY - oy) * (bh / s) / r.height; clamp(); cx = tcx; cy = tcy; apply();
  });
  const end = (e) => { P.delete(e.pointerId); if (P.size < 2) lastD = 0; };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  go();
}
$$('.zwrap').forEach(zoomable);

/* ---------- enquiry basket (per-browser, localStorage) ---------- */
const KEY = 'cc-enquiry';
const basket = new Set();
try { JSON.parse(localStorage.getItem(KEY) || '[]').forEach((n) => basket.add(n)); } catch {}
const saveB = () => { try { localStorage.setItem(KEY, JSON.stringify([...basket])); } catch {} };
const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tray = $('#tray'), picked = $('#picked'), pickl = $('#pickl');
function syncB(bump) {
  const n = basket.size;
  $$('.bk').forEach((b) => {
    b.classList.toggle('has', n > 0); $('b', b).textContent = n;
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  });
  tray.classList.toggle('show', n > 0 && page !== 'contact');
  $('#trayt').textContent = `${n} material${n === 1 ? '' : 's'} in your enquiry`;
  if (picked) {
    picked.hidden = !n;
    pickl.innerHTML = [...basket].map((m) => `<span class="pk">${esc(m)}<button type="button" data-rm="${esc(m)}" aria-label="Remove ${esc(m)}">×</button></span>`).join('');
  }
  $$('.add').forEach((a) => { const on = basket.has(a.dataset.n); a.setAttribute('aria-pressed', String(on)); a.closest('.prow').classList.toggle('sel', on); });
}
function fly(from) {
  if (RM) return syncB(true);
  const t = $('#hdr .bk'); if (!t || !t.offsetWidth) return syncB(true);
  const a = from.getBoundingClientRect(), b = t.getBoundingClientRect();
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, dx = (b.left + b.width - 16 - x0) / Z, dy = (b.top + b.height / 2 - y0) / Z;
  const d = document.createElement('div'); d.className = 'fly'; d.style.left = x0 / Z + 'px'; d.style.top = y0 / Z + 'px'; document.body.append(d);
  d.animate([
    { transform: 'translate(0,0) scale(1)' },
    { transform: `translate(${dx * 0.45}px,${dy * 0.45 - 90}px) scale(1.15)`, offset: 0.45 },
    { transform: `translate(${dx}px,${dy}px) scale(.35)`, opacity: 0.6 },
  ], { duration: 760, easing: 'cubic-bezier(.5,0,.25,1)' }).onfinish = () => { d.remove(); syncB(true); };
}
document.addEventListener('click', (e) => {
  const ad = e.target.closest('.add');
  if (ad) {
    const n = ad.dataset.n, on = !basket.has(n);
    on ? basket.add(n) : basket.delete(n); saveB();
    if (on) { syncB(false); fly(ad); } else syncB(true);
    return;
  }
  const rm = e.target.closest('[data-rm]');
  if (rm) { basket.delete(rm.dataset.rm); saveB(); syncB(true); }
});
syncB(false);

/* ---------- product filter ---------- */
const q = $('#q'), pills = $('#pills');
if (q && pills) {
  const rows = $$('#rows .prow'), empty = $('#empty'), ind = $('#ind');
  let cat = 'all';
  const fromUrl = new URLSearchParams(location.search).get('c');
  if (fromUrl && $(`[data-cat="${CSS.escape(fromUrl)}"]`, pills)) cat = fromUrl;
  const moveInd = () => { const b = $('button[aria-pressed="true"]', pills); if (!b || !b.offsetWidth) return; ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)`; };
  const render = (animate) => {
    const t = q.value.trim().toLowerCase(); let i = 0;
    rows.forEach((r) => {
      const show = (cat === 'all' || r.dataset.cat === cat) && (!t || r.dataset.search.includes(t));
      r.hidden = !show;
      r.classList.remove('en');
      if (show && animate && !RM) { void r.offsetWidth; r.style.setProperty('--i', i++); r.classList.add('en'); }
    });
    empty.hidden = rows.some((r) => !r.hidden);
  };
  $$('button', pills).forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.cat === cat));
    b.addEventListener('click', () => { cat = b.dataset.cat; $$('button', pills).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); moveInd(); render(true); });
  });
  q.addEventListener('input', () => render(true));
  addEventListener('resize', moveInd);
  document.fonts && document.fonts.ready.then(moveInd);
  moveInd(); render(false);
}

/* ---------- contact: copy + enquiry form ---------- */
$$('.copy').forEach((b) => b.addEventListener('click', () => {
  const done = () => { b.textContent = 'Copied ✓'; setTimeout(() => { b.textContent = 'Copy'; }, 1600); };
  if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, () => { b.textContent = b.dataset.copy; });
  else b.textContent = b.dataset.copy;
}));

const form = $('#f');
if (form) {
  const ok = $('#ok'), sb = $('#sb');
  const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      firstName: fd.get('fn'), lastName: fd.get('ln'), company: fd.get('co'), email: fd.get('em'),
      category: fd.get('cat'), quantity: fd.get('qty'), message: fd.get('msg'), materials: [...basket],
    };
    ok.className = 'ok'; ok.textContent = '';
    if (ENDPOINT) {
      sb.disabled = true;
      try {
        const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(String(res.status));
        ok.textContent = 'Thank you. Your enquiry has been sent and our team will reply shortly.';
        form.reset(); basket.clear(); saveB(); syncB(false);
      } catch {
        ok.className = 'err';
        ok.textContent = 'The enquiry could not be sent. Please try again, or message us on WhatsApp.';
      } finally { sb.disabled = false; }
      return;
    }
    // No form backend configured: hand the enquiry to WhatsApp, pre-filled.
    const lines = [
      `Enquiry from ${data.firstName} ${data.lastName}${data.company ? ` (${data.company})` : ''}`,
      `Email: ${data.email}`,
      `Category: ${data.category}`,
      data.quantity ? `Quantity: ${data.quantity}` : '',
      data.materials.length ? `Materials: ${data.materials.join(', ')}` : '',
      '', String(data.message || ''),
    ].filter((l, i) => l !== '' || i === 5);
    window.open(`https://wa.me/923260833256?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    ok.textContent = 'WhatsApp has opened with your enquiry. Press send there to reach our team.';
  });
}

/* ---------- boot (last, so every helper above is defined) ---------- */
if (root.classList.contains('wiping')) {
  wt.textContent = root.dataset.wipe || '';
  try { sessionStorage.removeItem('cc-wipe'); } catch {}
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.classList.remove('wiping');
    [wipe2, wipe].forEach((w) => w.classList.add('out'));
    setTimeout(() => [wipe2, wipe].forEach((w) => w.classList.remove('out')), 900);
    start();
  }));
} else start();
