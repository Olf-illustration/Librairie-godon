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
    if (e.key === 'Escape') {
      if (nlOverlay && nlOverlay.classList.contains('open')) closeNl();
      if (contactOverlay && contactOverlay.classList.contains('open')) closeContact();
    }
  });

  /* --- Contact Pop-in --- */
  const contactOverlay  = document.getElementById('contactOverlay');
  const contactCloseBtn = document.getElementById('contactCloseBtn');
  const contactOpenBtns = document.querySelectorAll('#contactOpenBtn, .contact-trigger-btn');
  const contactForm     = document.getElementById('contactForm');
  const contactSuccess  = document.getElementById('contactSuccessMsg');
  const contactError    = document.getElementById('contactErrorMsg');

  function openContact(e) {
    if (e) e.preventDefault();
    if (!contactOverlay) return;
    contactOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('c_nom');
    if (firstInput) setTimeout(() => firstInput.focus(), 200);
  }

  function closeContact() {
    if (!contactOverlay) return;
    contactOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  contactOpenBtns.forEach(btn => btn.addEventListener('click', openContact));
  if (contactCloseBtn) contactCloseBtn.addEventListener('click', closeContact);

  if (contactOverlay) {
    contactOverlay.addEventListener('click', e => {
      if (e.target === contactOverlay) closeContact();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const nom = document.getElementById('c_nom').value.trim();
      const email = document.getElementById('c_email').value.trim();
      const tel = document.getElementById('c_tel').value.trim();
      const sujet = document.getElementById('c_sujet').value;
      const message = document.getElementById('c_message').value.trim();

      if (!nom || !email || !sujet || !message) {
        if (contactError) {
          contactError.style.display = 'block';
          contactError.textContent = 'Veuillez remplir tous les champs obligatoires (*).';
        }
        return;
      }
      if (contactError) contactError.style.display = 'none';

      const submitBtn = document.getElementById('contactSubmitBtn');
      const origText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      try {
        const response = await fetch("https://formsubmit.co/ajax/contact@librairiegodon.com", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            Nom: nom,
            Email: email,
            Telephone: tel || 'Non renseigné',
            Objet: sujet,
            Message: message,
            _subject: `[Librairie Godon] Message de ${nom} : ${sujet}`
          })
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          contactSuccess.style.display = 'block';
          setTimeout(() => {
            closeContact();
            setTimeout(() => {
              contactForm.reset();
              contactForm.style.display = 'block';
              contactSuccess.style.display = 'none';
              submitBtn.textContent = origText;
              submitBtn.disabled = false;
            }, 500);
          }, 3500);
        } else {
          throw new Error('Erreur transmission');
        }
      } catch (err) {
        // Fallback transparent : préparation dans la messagerie
        const subjectEnc = encodeURIComponent(`[Librairie Godon] ${sujet} — ${nom}`);
        const bodyEnc = encodeURIComponent(`Bonjour,\n\nNom : ${nom}\nEmail : ${email}\nTéléphone : ${tel || 'Non renseigné'}\nObjet : ${sujet}\n\nMessage :\n${message}\n\nCordialement.`);
        window.location.href = `mailto:contact@librairiegodon.com?subject=${subjectEnc}&body=${bodyEnc}`;
        contactForm.style.display = 'none';
        contactSuccess.style.display = 'block';
        contactSuccess.innerHTML = '<strong style="display: block; font-size: 1rem; margin-bottom: .3rem;">Message préparé !</strong><span>Si votre logiciel de messagerie s\'est ouvert, vous pouvez confirmer l\'envoi. Vous pouvez également nous écrire directement à contact@librairiegodon.com.</span>';
        setTimeout(() => {
          closeContact();
          setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            contactSuccess.style.display = 'none';
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
          }, 500);
        }, 4500);
      }
    });
  }