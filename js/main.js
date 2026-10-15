'use strict';

  /* --- Sticky header shadow --- */
  const hdr = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* --- Mobile nav toggle --- */
  const burger   = document.querySelector('.nav-burger');
  const navWrap  = document.getElementById('nav-links');

  if (burger && navWrap) {
    burger.addEventListener('click', () => {
      const open = navWrap.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }
  if (navWrap) {
    navWrap.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navWrap.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Active nav highlight on scroll --- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const navIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('on'));
        const hit = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (hit) hit.classList.add('on');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => navIO.observe(s));

  /* --- Scroll reveal --- */
  const revIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        revIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.rev').forEach(el => revIO.observe(el));


  /* --- Slideshow vanilla --- */
  function initSlideshow(id, ms = 4000) {
    const wrap   = document.getElementById(id);
    if (!wrap) return;
    const slides = [...wrap.querySelectorAll('.slide')];
    if (slides.length < 2) return;

    let cur = 0;
    // Si les images réelles chargent, remplacer le placeholder
    slides.slice(1).forEach(s => {
      const img = s.querySelector('img');
      if (img) {
        img.addEventListener('load', () => {
          // Cacher le premier slide placeholder une fois les vraies images dispo
          if (slides[0].querySelector('.slide-ph')) {
            slides[0].classList.remove('on');
            slides[1].classList.add('on');
            cur = 1;
          }
        }, { once: true });
      }
    });

    setInterval(() => {
      slides[cur].classList.remove('on');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('on');
    }, ms);
  }

  initSlideshow('libShow', 4000);

  /* --- Newsletter Pop-in (Brevo) --- */
  const nlOverlay  = document.getElementById('nlOverlay');
  const nlCloseBtn = document.getElementById('nlCloseBtn');
  const nlTriggers = document.querySelectorAll('#nlOpenBtn, .nl-trigger-btn, a[href="#newsletter"]');

  function openNl(e) {
    if (e) e.preventDefault();
    if (!nlOverlay) return;
    nlOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const emailInput = document.getElementById('EMAIL');
    if (emailInput) setTimeout(() => emailInput.focus(), 200);
  }

  function closeNl() {
    if (!nlOverlay) return;
    nlOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  nlTriggers.forEach(btn => btn.addEventListener('click', openNl));
  if (nlCloseBtn) nlCloseBtn.addEventListener('click', closeNl);

  // Fermer en cliquant sur le fond sombre
  if (nlOverlay) {
    nlOverlay.addEventListener('click', e => {
      if (e.target === nlOverlay) closeNl();
    });
  }

  // Fermer avec Échap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nlOverlay && nlOverlay.classList.contains('open')) {
      closeNl();
    }
  });