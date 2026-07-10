/* FORCE PARTNERS — site-v7 (mashup) · Motion vanilla + Lenis */
const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches;

const yEl = document.getElementById('year');
if (yEl) yEl.textContent = new Date().getFullYear();

/* Menu mobile */
const burger = document.getElementById('burger');
const mm = document.getElementById('mm');
function closeMM() { if (!mm) return; mm.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
function openMM() { mm.hidden = false; burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
if (burger && mm) {
  burger.addEventListener('click', () => (mm.hidden ? openMM() : closeMM()));
  mm.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMM));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMM(); });
}

/* Nav scrolled */
const nav = document.getElementById('nav');
function onNav() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); }
onNav();
window.addEventListener('scroll', onNav, { passive: true });

/* Typewriter (independente da CDN) */
const tw = document.getElementById('typewriter');
const WORDS = ['recuperação judicial', 'reestruturação de passivos', 'turnaround', 'venda de UPI'];
if (tw && !reduce) {
  let wi = 0, ci = 0, del = false;
  (function tick() {
    const w = WORDS[wi];
    tw.textContent = w.slice(0, ci);
    if (!del) { ci++; if (ci > w.length) { del = true; setTimeout(tick, 1600); return; } }
    else { ci--; if (ci < 0) { del = false; wi = (wi + 1) % WORDS.length; ci = 0; } }
    setTimeout(tick, del ? 38 : 72);
  })();
} else if (tw) { tw.textContent = WORDS[0]; }

/* Voltar ao topo */
document.getElementById('cfootTop')?.addEventListener('click', () => { if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

/* Magnético (footer pills) */
if (fine) {
  document.querySelectorAll('.mag').forEach((el) => {
    el.style.transition = 'transform .4s cubic-bezier(0.16,1,0.3,1)';
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - (r.left + r.width / 2)) * 0.25) + 'px,' + ((e.clientY - (r.top + r.height / 2)) * 0.3) + 'px)'; });
    el.addEventListener('pointerleave', () => { el.style.transform = 'translate(0,0)'; });
  });
}

function showAll() { root.classList.remove('anim'); }

if (reduce) {
  showAll();
  window.__motionReady = true;
} else {
  (async () => {
    try {
      const { animate, inView, stagger } = await import('https://cdn.jsdelivr.net/npm/motion@latest/+esm');
      let Lenis = null;
      try { Lenis = (await import('https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm')).default; } catch (_) {}
      window.__motionReady = true;
      const EASE = [0.16, 1, 0.3, 1];

      if (Lenis) {
        const lenis = new Lenis({ duration: 1.1, wheelMultiplier: 0.9 });
        window.__lenis = lenis;
        (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
        root.classList.add('lenis');
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
          a.addEventListener('click', (ev) => { const id = a.getAttribute('href'); if (id.length > 1) { const t = document.querySelector(id); if (t) { ev.preventDefault(); lenis.scrollTo(t, { offset: -10 }); } } });
        });
      }

      /* Hero entrance */
      const hero = document.querySelectorAll('.hero [data-hero]');
      animate(hero, { opacity: [0, 1], y: [22, 0] }, { duration: 0.85, ease: EASE, delay: stagger(0.1, { start: 0.1 }) })
        .then(() => hero.forEach((e) => { e.style.transform = ''; }));

      /* Reveals */
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        inView(el, () => { animate(el, { opacity: [0, 1], y: [26, 0] }, { duration: 0.7, ease: EASE }).then(() => { el.style.transform = ''; }); }, { amount: 0.2 });
      });

      /* Footer (cinematic) reveals */
      ['#cfootEy', '#cfootH', '#cfootSubh', '#cfootLinks', '#cfootSub'].forEach((sel, i) => { const el = document.querySelector(sel); if (el) inView(el, () => animate(el, { opacity: [0, 1], y: [40, 0] }, { duration: 0.8, ease: EASE, delay: i * 0.08 }), { amount: 0.2 }); });
    } catch (err) {
      showAll();
      window.__motionReady = true;
    }
  })();
}


/* Lead reveal palavra a palavra no scroll (mobile) */
const lead = document.querySelector('.hero__lead');
if (lead && !reduce && window.matchMedia('(max-width: 700px)').matches) {
  const wrap = document.createElement('div');
  wrap.className = 'lead-reveal-wrap';
  lead.parentNode.insertBefore(wrap, lead);
  wrap.appendChild(lead);
  lead.innerHTML = lead.textContent.trim().split(/\s+/).map((w) => '<span class="rw">' + w + '</span>').join(' ');
  const ws = Array.from(lead.querySelectorAll('.rw'));
  const N = ws.length;
  function updReveal() {
    const r = wrap.getBoundingClientRect();
    const total = Math.max(r.height - window.innerHeight, 1);
    const p = Math.min(1, Math.max(0, -r.top / total));
    ws.forEach((s, i) => {
      const o = Math.min(1, Math.max(0, (p - i / N) * N));
      s.style.setProperty('--wop', (0.22 + 0.78 * o).toFixed(3));
    });
  }
  updReveal();
  window.addEventListener('scroll', () => requestAnimationFrame(updReveal), { passive: true });
  window.addEventListener('resize', updReveal, { passive: true });
}
