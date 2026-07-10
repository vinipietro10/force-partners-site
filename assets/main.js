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


/* Contador de números das estatísticas (mobile) */
if (!reduce && window.matchMedia('(max-width: 700px)').matches) {
  const nums = document.querySelectorAll('.stat__n span:not(.pre):not(.suf)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      const target = parseInt(el.textContent, 10);
      if (isNaN(target)) return;
      const dur = 1400, t0 = performance.now();
      (function tick(t) {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  nums.forEach((n) => io.observe(n));
}

/* Carrossel de serviços: progresso e hint (mobile) */
const cardsEl = document.querySelector('.proc__cards');
if (cardsEl && window.matchMedia('(max-width: 700px)').matches) {
  const cards = Array.from(cardsEl.querySelectorAll('.pcard'));
  cards.forEach((c) => c.removeAttribute('data-reveal'));
  const prog = document.createElement('div');
  prog.className = 'proc__prog';
  const GAP = 14;
  cards.forEach((c, i) => {
    const b = document.createElement('span');
    b.className = 'seg' + (i === 0 ? ' on' : '');
    b.addEventListener('click', () => cardsEl.scrollTo({ left: i * (cards[0].offsetWidth + GAP), behavior: 'smooth' }));
    prog.appendChild(b);
  });
  const hint = document.createElement('span');
  hint.className = 'proc__hint';
  hint.textContent = 'deslize \u2192';
  prog.appendChild(hint);
  cardsEl.parentNode.insertBefore(prog, cardsEl.nextSibling);
  let hinted = false;
  cardsEl.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const w = cards[0].offsetWidth + GAP;
      const idx = Math.min(cards.length - 1, Math.max(0, Math.round(cardsEl.scrollLeft / w)));
      prog.querySelectorAll('.seg').forEach((s, i) => s.classList.toggle('on', i === idx));
      if (!hinted && cardsEl.scrollLeft > 40) { hinted = true; hint.style.opacity = '0'; }
    });
  }, { passive: true });
}

/* Parallax dos retratos (quem somos) */
const spxImgs = document.querySelectorAll('.socio-panel__media img');
if (spxImgs.length && !reduce) {
  const updSpx = () => {
    spxImgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -60 || r.top > window.innerHeight + 60) return;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / ((window.innerHeight + r.height) / 2)));
      img.style.transform = 'translateY(' + (-9 - p * 8).toFixed(2) + '%)';
    });
  };
  (function loopSpx() { updSpx(); requestAnimationFrame(loopSpx); })();
}
