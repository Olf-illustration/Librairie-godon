'use strict';

  /* --- Sticky header shadow --- */
  const hdr = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* --- Mobile nav toggle --- */
  const burger   = document.querySelector('.nav-burger');
  const navWrap  = document.getElementById('nav-links');

  burger.addEventListener('click', () => {
    const open = navWrap.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  navWrap.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navWrap.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

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

  /* --- Hero animation replay (hommage au GIF) --- */
  const replayBtn  = document.getElementById('replayBtn');
  const heroBody   = document.querySelector('.hero-body');
  const heroDecoDivs = document.querySelectorAll('.hdl, .ink-rule');

  replayBtn.addEventListener('click', () => {
    // Reset et rejoue toutes les animations CSS du héros
    const targets = heroBody.querySelectorAll(
      '.hero-pre, .hero-title, .hero-rule, .hero-sub, .hero-actions, .hdl'
    );
    [...targets, ...heroDecoDivs].forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth; // reflow
      el.style.animation = '';
    });
  });

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

  /* --- Newsletter popup --- */
  const nlOverlay  = document.getElementById('nlOverlay');
  const nlOpenBtn  = document.getElementById('nlOpenBtn');
  const nlCloseBtn = document.getElementById('nlCloseBtn');
  const nlForm     = document.getElementById('nlForm');
  const nlFormWrap = document.getElementById('nlFormWrap');
  const nlSuccess  = document.getElementById('nlSuccess');

  function openNl() {
    nlOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => nlForm.querySelector('input').focus(), 80);
  }
  function closeNl() {
    nlOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  nlOpenBtn.addEventListener('click', openNl);
  nlCloseBtn.addEventListener('click', closeNl);

  // Fermer en cliquant sur le fond
  nlOverlay.addEventListener('click', e => { if (e.target === nlOverlay) closeNl(); });

  // Fermer avec Échap
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNl(); });

  // Soumission popup newsletter
  nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = nlForm.querySelector('input[type="email"]').value.trim();
    if (!email) return;
    // Ouvre le client mail avec l'email pré-rempli
    const subject = encodeURIComponent('Inscription Newsletter — Librairie Godon');
    const body    = encodeURIComponent('Bonjour,\n\nJe souhaite m\'inscrire à la newsletter bimestrielle de la Librairie Godon.\n\nMon adresse e-mail : ' + email + '\n\nCordialement.');
    window.location.href = 'mailto:contact@librairiegodon.com?subject=' + subject + '&body=' + body;
    // Affiche le message de confirmation
    nlFormWrap.style.display = 'none';
    nlSuccess.style.display  = 'block';
    setTimeout(closeNl, 3200);
  });

  /* --- Catalogue subscribe form (section) --- */
  const catForm = document.getElementById('catSubscribeForm');
  if (catForm) {
    catForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = catForm.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      const subject = encodeURIComponent('Demande de catalogue — Librairie Godon');
      const body    = encodeURIComponent('Bonjour,\n\nJe souhaite recevoir vos catalogues (L\'Amusement d\'un Lillois / Le Non Livre).\n\nMon adresse e-mail : ' + email + '\n\nCordialement.');
      window.location.href = 'mailto:contact@librairiegodon.com?subject=' + subject + '&body=' + body;
      const btn = catForm.querySelector('button');
      btn.textContent = '✓ Demande envoyée !';
      btn.disabled = true;
      catForm.querySelector('input').disabled = true;
    });
  }