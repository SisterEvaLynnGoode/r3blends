/* r3.blends — script.js */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

/* ── Footer year ────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Lenis smooth scroll ─────────────────────────
   Disabled for reduced-motion users; Lenis also
   passes scroll position to GSAP ScrollTrigger.   */
let lenis;
if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 0.7,
    easing: t => 1 - Math.pow(1 - t, 4),
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── Hero entrance animation ─────────────────────
   Staggers eyebrow → title → tagline → CTA        */
if (!prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
    .to('.hero__title',   { opacity: 1, y: 0, duration: 1.0 }, '-=0.5')
    .to('.hero__tagline', { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
    .to('.hero__cta',     { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
} else {
  /* Show everything immediately for reduced-motion */
  document.querySelectorAll('.hero__eyebrow, .hero__title, .hero__tagline, .hero__cta')
    .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

/* ── Scroll reveal ────────────────────────────────
   Adds .reveal to all section children, then
   IntersectionObserver toggles .is-visible         */
const revealTargets = [
  ...document.querySelectorAll('.hours__row'),
  ...document.querySelectorAll('.service-card'),
  ...document.querySelectorAll('.gallery__item'),
  ...document.querySelectorAll('.section__heading'),
];

if (!prefersReducedMotion) {
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach(el => observer.observe(el));
} else {
  revealTargets.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

/* ── Hero parallax via GSAP ScrollTrigger ─────────
   Video stays fixed; section z-index stacks over.
   This adds a subtle scale-up as you leave hero.   */
if (!prefersReducedMotion) {
  gsap.to('.hero__video', {
    scale: 1.08,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

}

/* ── Service card tilt ────────────────────────────
   Max 8° rotation tracking mouse position within
   each card. Disabled on touch + reduced-motion.   */
if (!isTouchDevice && !prefersReducedMotion) {
  document.querySelectorAll('.service-card[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const MAX = 8;
      card.style.transform = `perspective(600px) rotateX(${-dy * MAX}deg) rotateY(${dx * MAX}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}
