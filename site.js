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
