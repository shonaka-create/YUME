const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initNav = () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
};

const initHeroSlideshow = () => {
  const stage = document.querySelector('.hero-slideshow');
  if (!stage) return;

  const total = Number(stage.dataset.slides || 0);
  const base = stage.dataset.slideBase || '';
  if (total < 2 || prefersReducedMotion()) return;

  // slide 1 ships in the markup; the rest are built as their turn approaches
  // so the page only ever downloads the photos it is about to show.
  const slides = [stage.querySelector('.hero-slide')];

  const slideAt = (i) => {
    if (slides[i]) return slides[i];

    const el = document.createElement('div');
    el.className = 'hero-slide';

    const img = document.createElement('img');
    img.src = `${base}slide-${String(i + 1).padStart(2, '0')}.jpg`;
    img.alt = '';
    img.loading = 'eager';
    el.appendChild(img);

    stage.appendChild(el);
    slides[i] = el;
    return el;
  };

  let index = 0;
  slideAt(1); // warm up the next photo before its first crossfade

  setInterval(() => {
    const next = (index + 1) % total;
    slideAt(index).classList.remove('is-active');
    slideAt(next).classList.add('is-active');
    index = next;
    slideAt((next + 1) % total);
  }, 3000);
};

const initScrollReveal = () => {
  const targets = document.querySelectorAll(
    '.section-head, .card, .price-card, .price-note, .detail-card, .gallery-grid .ph, .review-card, .about-photo, .about-body, .about-stats, .contact-form, .contact-media, .cta-banner .container'
  );
  if (!targets.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    // a fixed offset, not a percentage: on very tall viewports a percentage
    // can shrink the root past content that never scrolls any higher
    { rootMargin: '0px 0px -60px 0px', threshold: 0 }
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 0.08}s`;
    observer.observe(el);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroSlideshow();
  initScrollReveal();
});
