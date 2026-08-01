(() => {
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.08 })
    : null;

  document.querySelectorAll('.reveal').forEach((element) => {
    if (observer) observer.observe(element);
    else element.classList.add('in');
  });

  const nav = document.getElementById('nav');
  if (nav) {
    const updateNav = () => {
      nav.style.background = window.scrollY > 48 ? 'rgba(9,11,15,0.95)' : 'rgba(9,11,15,0.65)';
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('nav-links-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      links.classList.remove('nav-links-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    }));
  }

  const carousel = document.querySelector('[data-demo-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.demo-track');
    const slides = Array.from(carousel.querySelectorAll('.demo-slide'));
    const dots = document.querySelector('[data-demo-dots]');
    const status = document.querySelector('[data-demo-status]');
    const previous = document.querySelector('[data-demo-prev]');
    const next = document.querySelector('[data-demo-next]');
    let activeSlide = 0;
    let swipeStart = null;

    const updateCarousel = (index) => {
      activeSlide = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${activeSlide * 100}%)`;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeSlide;
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.inert = !isActive;
      });

      const dotButtons = dots ? Array.from(dots.querySelectorAll('button')) : [];
      dotButtons.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeSlide;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      if (status) {
        const title = slides[activeSlide].querySelector('.demo-window-title');
        status.textContent = `Example ${activeSlide + 1} of ${slides.length} · ${title ? title.textContent : ''}`;
      }
    };

    if (dots) {
      slides.forEach((slide, index) => {
        const title = slide.querySelector('.demo-window-title');
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'showcase-dot';
        dot.setAttribute('aria-label', `Show ${title ? title.textContent : `example ${index + 1}`}`);
        dot.addEventListener('click', () => updateCarousel(index));
        dots.appendChild(dot);
      });
    }

    previous?.addEventListener('click', () => updateCarousel(activeSlide - 1));
    next?.addEventListener('click', () => updateCarousel(activeSlide + 1));

    carousel.addEventListener('keydown', (event) => {
      if (event.target !== carousel) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        updateCarousel(activeSlide - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        updateCarousel(activeSlide + 1);
      }
    });

    carousel.addEventListener('pointerdown', (event) => {
      swipeStart = event.clientX;
    });
    carousel.addEventListener('pointerup', (event) => {
      if (swipeStart === null) return;
      const distance = event.clientX - swipeStart;
      swipeStart = null;
      if (Math.abs(distance) < 45) return;
      updateCarousel(activeSlide + (distance < 0 ? 1 : -1));
    });
    carousel.addEventListener('pointercancel', () => { swipeStart = null; });

    carousel.querySelectorAll('.demo-tabs button').forEach((button) => {
      button.addEventListener('click', () => {
        const tabs = button.closest('.demo-tabs');
        tabs.querySelectorAll('button').forEach((tab) => {
          const isActive = tab === button;
          tab.classList.toggle('is-active', isActive);
          tab.setAttribute('aria-pressed', String(isActive));
        });
      });
    });

    updateCarousel(0);
  }

  const form = document.querySelector('form[action*="formspree.io"]');
  const status = document.querySelector('.form-status');
  if (form && status) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      status.style.display = 'block';
      status.textContent = 'Sending your briefing…';
      if (button) button.disabled = true;
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Form submission failed');
        form.reset();
        status.textContent = 'Thanks—your briefing is in. Christopher will respond directly.';
      } catch (error) {
        status.textContent = 'Something went wrong. Please email christopher@cederbi.com instead.';
      } finally {
        if (button) button.disabled = false;
      }
    });
  }
})();
