/* ==========================================================================
   ISCERL — Portal Social
   Interações: menu mobile, modais, carrossel, reveal, contadores, formulário
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------
     Header: sombra/encolhimento ao rolar + link ativo por seção
  ---------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
    backToTop.classList.toggle('show', window.scrollY > 420);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ----------------------------------------------------------------------
     Menu mobile
  ---------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.classList.remove('no-scroll');
  };

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navOverlay.classList.toggle('show', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  };

  hamburger.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);
  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  /* ----------------------------------------------------------------------
     Reveal ao rolar a página
  ---------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-group]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ----------------------------------------------------------------------
     Contadores animados (seção Transparência)
  ---------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ----------------------------------------------------------------------
     Carrossel do hero
  ---------------------------------------------------------------------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-media-dots .dot');
  let activeSlide = 0;
  let carouselTimer = null;

  const goToSlide = (index) => {
    slides[activeSlide]?.classList.remove('active');
    dots[activeSlide]?.classList.remove('active');
    activeSlide = (index + slides.length) % slides.length;
    slides[activeSlide]?.classList.add('active');
    dots[activeSlide]?.classList.add('active');
  };

  const startCarousel = () => {
    stopCarousel();
    carouselTimer = setInterval(() => goToSlide(activeSlide + 1), 4200);
  };
  const stopCarousel = () => carouselTimer && clearInterval(carouselTimer);

  if (slides.length) {
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startCarousel(); }));
    const heroMedia = document.querySelector('.hero-media');
    heroMedia?.addEventListener('mouseenter', stopCarousel);
    heroMedia?.addEventListener('mouseleave', startCarousel);
    startCarousel();
  }

  /* ----------------------------------------------------------------------
     Sistema genérico de modal (conteúdo vem de <template>)
  ---------------------------------------------------------------------- */
  const modal = document.getElementById('infoModal');
  const modalBody = document.getElementById('infoModalBody');
  const modalClose = document.getElementById('infoModalClose');
  let lastFocused = null;

  const openModal = (templateId) => {
    const tpl = document.getElementById(templateId);
    if (!tpl || !modal) return;
    modalBody.innerHTML = '';
    modalBody.appendChild(tpl.content.cloneNode(true));
    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modalClose.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('[data-modal-open]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.getAttribute('data-modal-open')));
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMenu();
    }
  });

  /* ----------------------------------------------------------------------
     Formulário de voluntário
  ---------------------------------------------------------------------- */
  const openVolunteerForm = document.getElementById('openVolunteerForm');
  const volForm = document.getElementById('volForm');

  openVolunteerForm?.addEventListener('click', () => {
    const willShow = !volForm.classList.contains('show');
    volForm.classList.toggle('show', willShow);
    openVolunteerForm.setAttribute('aria-expanded', String(willShow));
    if (willShow) {
      setTimeout(() => volForm.querySelector('input')?.focus(), 350);
    }
  });

  const formStatus = document.getElementById('formStatus');
  const showStatus = (message, type) => {
    formStatus.textContent = message;
    formStatus.className = `form-status show ${type}`;
  };

  volForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    let valid = true;
    volForm.querySelectorAll('input[required]').forEach((input) => {
      const field = input.closest('.field');
      const isValid = input.checkValidity() && input.value.trim() !== '';
      field.classList.toggle('invalid', !isValid);
      if (!isValid) valid = false;
    });

    if (!valid) {
      showStatus('Por favor, preencha todos os campos corretamente.', 'error');
      return;
    }

    const submitBtn = volForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch(volForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(volForm),
      });

      let ok = response.ok;
      try {
        const data = await response.clone().json();
        if (data.success !== undefined) ok = data.success;
        else if (data.ok !== undefined) ok = data.ok;
      } catch (_) { /* resposta sem JSON, usa apenas o status HTTP */ }

      if (ok) {
        showStatus('Cadastro enviado com sucesso! Em breve entraremos em contato.', 'success');
        volForm.reset();
      } else {
        showStatus('Não foi possível enviar o cadastro. Tente novamente.', 'error');
      }
    } catch (error) {
      showStatus('Falha de conexão. Verifique sua internet e tente novamente.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  /* ----------------------------------------------------------------------
     Voltar ao topo
  ---------------------------------------------------------------------- */
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
