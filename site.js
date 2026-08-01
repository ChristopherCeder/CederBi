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

    slides.forEach((slide) => {
      const title = slide.querySelector('.demo-window-title');
      if (title && slide.dataset.demoName) title.textContent = slide.dataset.demoName;
    });

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

    const screenHeader = (kicker, title, leftTab, rightTab) => `
      <div class="demo-main-top">
        <div><p class="demo-kicker">${kicker}</p><h3>${title}</h3></div>
        <div class="demo-tabs"><button type="button" class="is-active" aria-pressed="true">${leftTab}</button><button type="button" aria-pressed="false">${rightTab}</button></div>
      </div>`;

    const renderWorkspace = (screen) => `${screenHeader(screen.kicker, screen.title, screen.tabs[0], screen.tabs[1])}
      <div class="demo-workspace-grid">
        <div class="demo-workspace-card"><h4>${screen.leftTitle}</h4>${screen.leftRows.map((row, index) => `<div class="demo-status-row"><i class="${index === 1 ? 'is-good' : ''}"></i>${row[0]}<span>${row[1]}</span></div>`).join('')}</div>
        <div class="demo-workspace-card"><h4>${screen.rightTitle}</h4>${screen.rightRows.map((row, index) => `<div class="demo-status-row"><i class="${index !== 1 ? 'is-good' : ''}"></i>${row[0]}<span>${row[1]}</span></div>`).join('')}</div>
      </div>`;

    const renderTeam = (screen) => `${screenHeader(screen.kicker, screen.title, screen.tabs[0], screen.tabs[1])}
      <div class="demo-team-grid">${screen.people.map((person) => `<div class="demo-team-card"><div class="demo-avatar">${person.initials}</div><h4>${person.name}</h4><p>${person.role}</p><span>${person.status}</span></div>`).join('')}</div>`;

    const renderReports = (screen) => `${screenHeader(screen.kicker, screen.title, screen.tabs[0], screen.tabs[1])}
      <div class="demo-bottom"><div class="demo-chart"><div class="demo-chart-head">${screen.chartTitle} <span>Updated today</span></div><div class="demo-bars">${screen.bars.map((height, index) => `<i class="${index === screen.highlight ? 'is-highlight' : ''}" style="height:${height}%"></i>`).join('')}</div></div><div class="demo-list"><p class="demo-list-title">Key takeaway</p>${screen.takeaways.map((item) => `<div class="demo-list-row">${item[0]} <span>${item[1]}</span></div>`).join('')}</div></div>
      <div class="demo-report-table"><div class="demo-report-row"><span>Measure</span><span>Current</span><span>Trend</span></div>${screen.reportRows.map((row) => `<div class="demo-report-row"><span>${row[0]}</span><span>${row[1]}</span><span>${row[2]}</span></div>`).join('')}</div>`;

    const screenContent = {
      'Daily Operations': {
        Service: { type: 'workspace', kicker: 'Live service', title: 'Keep the shift on track.', tabs: ['Now', 'Later'], leftTitle: 'Shift board', leftRows: [['Line check', '4:15'], ['Patio reset', 'In progress'], ['Happy hour setup', '5:00']], rightTitle: 'Needs attention', rightRows: [['Prep list', '2 items'], ['Labor check', 'Review'], ['86 update', 'Ready']] },
        Team: { type: 'team', kicker: 'Team coverage', title: 'Know who is leading each part of service.', tabs: ['Today', 'Tomorrow'], people: [{ initials: 'JR', name: 'Jordan Reed', role: 'Floor lead', status: 'On floor' }, { initials: 'AM', name: 'Avery Moore', role: 'Kitchen lead', status: 'Prep complete' }, { initials: 'SK', name: 'Sam Kim', role: 'Bar lead', status: 'Opening at 4' }] },
        Reports: { type: 'reports', kicker: 'Daily reports', title: 'Turn a busy day into a clear next move.', tabs: ['Week', 'Month'], chartTitle: 'Sales compared with goal', bars: [38, 55, 48, 76, 64, 91, 73], highlight: 5, takeaways: [['Lunch labor', 'On target'], ['Dinner pace', '↑ 11%'], ['Average check', '↑ $2.40']], reportRows: [['Sales', '$52.8k', '↑ 8%'], ['Labor', '28.1%', 'On target'], ['Tickets', '2,438', '↑ 6%']] }
      },
      'Location Scorecard': {
        Overview: { type: 'workspace', kicker: 'Group overview', title: 'See where leadership attention will help most.', tabs: ['This week', 'This month'], leftTitle: 'At a glance', leftRows: [['Locations on target', '2 of 3'], ['Sales pace', '↑ 8%'], ['Guest score', '4.7']], rightTitle: 'Priorities', rightRows: [['North Loop labor', 'Review'], ['Riverside hiring', 'Open'], ['Downtown score', 'Up']] },
        Team: { type: 'team', kicker: 'Leadership team', title: 'Give each manager a clear, shared rhythm.', tabs: ['This week', 'This month'], people: [{ initials: 'MR', name: 'Morgan Ray', role: 'Downtown GM', status: 'On target' }, { initials: 'CB', name: 'Casey Bell', role: 'North Loop GM', status: 'Labor review' }, { initials: 'DT', name: 'Drew Taylor', role: 'Riverside GM', status: 'Hiring update' }] },
        Reports: { type: 'reports', kicker: 'Group reports', title: 'Compare performance without chasing spreadsheets.', tabs: ['This week', 'This month'], chartTitle: 'Sales by location', bars: [51, 68, 56, 82, 75, 88, 79], highlight: 5, takeaways: [['Downtown', '↑ 12%'], ['North Loop labor', '29.1%'], ['Riverside score', '4.8']], reportRows: [['Downtown sales', '$46.2k', '↑ 12%'], ['North Loop labor', '29.1%', 'Review'], ['Riverside guest score', '4.8', '↑ .2']] }
      },
      'Guest Experience': {
        Overview: { type: 'workspace', kicker: 'Guest overview', title: 'Keep every guest conversation moving forward.', tabs: ['Today', 'This week'], leftTitle: 'Guest activity', leftRows: [['New requests', '12'], ['Average reply', '18m'], ['Resolved today', '94%']], rightTitle: 'Next up', rightRows: [['Catering follow-up', 'Due now'], ['VIP arrival', '5:45'], ['Private dining lead', 'Assigned']] },
        Service: { type: 'workspace', kicker: 'Service recovery', title: 'Turn an issue into a thoughtful follow-through.', tabs: ['Open', 'Resolved'], leftTitle: 'Open follow-ups', leftRows: [['Reservation update', '8m'], ['Dietary request', '14m'], ['Order concern', '21m']], rightTitle: 'Recovery plan', rightRows: [['Manager check-in', 'Assigned'], ['Guest note', 'Sent'], ['Return visit', 'Track']] },
        Reports: { type: 'reports', kicker: 'Guest reports', title: 'See which details are shaping the experience.', tabs: ['Week', 'Month'], chartTitle: 'Resolved requests', bars: [35, 47, 61, 55, 78, 85, 91], highlight: 6, takeaways: [['Reply time', '↓ 7m'], ['Resolved requests', '94%'], ['Private events', '↑ 4']], reportRows: [['Guest requests', '86', '↑ 9%'], ['Average reply', '18m', '↓ 7m'], ['Resolved', '94%', '↑ 3%']] }
      }
    };

    const setActiveDemoScreen = (slide, requestedScreen) => {
      const main = slide.querySelector('.demo-main');
      const product = slide.dataset.product;
      const navItems = Array.from(slide.querySelectorAll('.demo-nav-item'));
      const defaultItem = navItems.find((item) => item.dataset.defaultScreen === 'true');
      const defaultScreen = defaultItem ? defaultItem.textContent.trim() : 'Overview';
      const screen = requestedScreen.trim();

      navItems.forEach((item) => {
        const isCurrent = item.textContent.trim() === screen;
        item.classList.toggle('is-current', isCurrent);
        item.setAttribute('aria-pressed', String(isCurrent));
      });

      if (slide.screenTimer) window.clearTimeout(slide.screenTimer);
      main.classList.add('is-switching');
      slide.screenTimer = window.setTimeout(() => {
        const content = screen === defaultScreen ? main.dataset.defaultMarkup : screenContent[product]?.[screen];
        if (content) {
          main.innerHTML = typeof content === 'string' ? content : ({ workspace: renderWorkspace, team: renderTeam, reports: renderReports }[content.type](content));
        }
        main.classList.remove('is-switching');
      }, 150);
    };

    slides.forEach((slide) => {
      const main = slide.querySelector('.demo-main');
      const defaultItem = slide.querySelector('.demo-nav-item.is-current');
      main.dataset.defaultMarkup = main.innerHTML;
      slide.querySelectorAll('.demo-nav-item').forEach((item) => {
        const isDefault = item === defaultItem;
        item.dataset.defaultScreen = String(isDefault);
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-pressed', String(isDefault));
      });
    });

    carousel.addEventListener('keydown', (event) => {
      const navItem = event.target.closest('.demo-nav-item');
      if (navItem && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        setActiveDemoScreen(navItem.closest('.demo-slide'), navItem.textContent);
        return;
      }
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

    carousel.addEventListener('click', (event) => {
      const tab = event.target.closest('.demo-tabs button');
      if (tab) {
        const tabs = tab.closest('.demo-tabs');
        tabs.querySelectorAll('button').forEach((tab) => {
          const isActive = tab === event.target.closest('.demo-tabs button');
          tab.classList.toggle('is-active', isActive);
          tab.setAttribute('aria-pressed', String(isActive));
        });
        return;
      }

      const navItem = event.target.closest('.demo-nav-item');
      if (navItem) setActiveDemoScreen(navItem.closest('.demo-slide'), navItem.textContent);
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
