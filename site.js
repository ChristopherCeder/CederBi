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
    carousel.querySelectorAll('[data-retire-demo]').forEach((slide) => slide.remove());
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

    const renderBoard = (kicker, title, columns) => `${screenHeader(kicker, title, 'Today', 'This week')}
      <div class="demo-location-grid">${columns.map((column) => `<div class="demo-location"><h4>${column.title}</h4>${column.items.map((item) => `<p>${item[0]} <strong>${item[1]}</strong></p>`).join('')}<div class="demo-progress"><i style="width:${column.progress}%"></i></div></div>`).join('')}</div>`;

    const renderInbox = (kicker, title, inboxTitle, detailTitle) => `${screenHeader(kicker, title, 'Inbox', 'Follow-ups')}
      <div class="demo-queue"><div class="demo-queue-card"><h4>${inboxTitle}</h4><div class="demo-ticket"><i class="demo-ticket-dot"></i>New customer request <span>8m</span></div><div class="demo-ticket"><i class="demo-ticket-dot is-green"></i>Estimate question <span>14m</span></div><div class="demo-ticket"><i class="demo-ticket-dot"></i>Appointment update <span>21m</span></div></div><div class="demo-queue-card"><h4>${detailTitle}</h4><div class="demo-ticket"><i class="demo-ticket-dot is-green"></i>Reply drafted <span>Ready</span></div><div class="demo-ticket"><i class="demo-ticket-dot"></i>Preferred time <span>Thursday</span></div><div class="demo-ticket"><i class="demo-ticket-dot is-green"></i>Next step <span>Assigned</span></div></div></div>`;

    const renderChecklist = () => `${screenHeader('Team checklist', 'Give every shift a clear start and finish.', 'Today', 'This week')}
      <div class="demo-workspace-grid"><div class="demo-workspace-card"><h4>Today’s checklist</h4><div class="demo-status-row"><i class="is-good"></i>Open the workspace<span>Done</span></div><div class="demo-status-row"><i class="is-good"></i>Restock supplies<span>Done</span></div><div class="demo-status-row"><i></i>Confirm equipment<span>Next</span></div><div class="demo-status-row"><i></i>Close-out photos<span>Later</span></div></div><div class="demo-workspace-card"><h4>Completion</h4><p>12 of 16 tasks are complete. The team can see what remains without chasing a manager for the details.</p><div class="demo-progress"><i style="width:75%"></i></div><div class="demo-list-row">Today’s completion <span>75%</span></div><div class="demo-list-row">Training due <span>2</span></div></div></div>`;

    const renderPortal = (view = 'overview') => `${screenHeader('Client portal', view === 'Messages' ? 'Keep the conversation in one place.' : 'Give clients a clear view of what is happening.', 'Project', 'Messages')}
      <div class="demo-workspace-grid"><div class="demo-workspace-card"><h4>${view === 'Documents' ? 'Shared documents' : 'Your project'}</h4><div class="demo-status-row"><i class="is-good"></i>Discovery complete<span>Done</span></div><div class="demo-status-row"><i class="is-good"></i>Proposal approved<span>Done</span></div><div class="demo-status-row"><i></i>Work scheduled<span>Aug 12</span></div><div class="demo-status-row"><i></i>Final review<span>Upcoming</span></div></div><div class="demo-workspace-card"><h4>${view === 'Messages' ? 'Recent messages' : 'What’s next'}</h4><p>${view === 'Messages' ? 'Your project team has everything they need to respond without long email threads.' : 'Review the next milestone, share feedback, or upload what the team needs to keep moving.'}</p><div class="demo-list-row">Project update <span>Today</span></div><div class="demo-list-row">Files shared <span>4</span></div></div></div>`;

    const productModels = {
      'Business Health Dashboard': { nav: ['Overview', 'Performance', 'Team', 'Reports'] },
      'Live Task Board': { nav: ['Board', 'In Progress', 'Team', 'Completed'] },
      'Customer Inbox': { nav: ['Inbox', 'Assigned', 'Follow-ups', 'Insights'] },
      'Field Service Scheduler': { nav: ['Schedule', 'Dispatch', 'Crew', 'Jobs'] },
      'Quote & Follow-Up Pipeline': { nav: ['Leads', 'Estimates', 'Follow-ups', 'Won'] },
      'Team Checklist App': { nav: ['Today', 'Checklists', 'Training', 'Team'] },
      'Client Portal': { nav: ['Overview', 'Project', 'Messages', 'Documents'] }
    };

    const renderProductView = (product, view) => {
      if (product === 'Business Health Dashboard') {
        if (view === 'Team') return renderTeam({ kicker: 'Team performance', title: 'Give leaders the context to make better decisions.', tabs: ['Today', 'This week'], people: [{ initials: 'JR', name: 'Jordan Reed', role: 'Operations lead', status: 'On target' }, { initials: 'AM', name: 'Avery Moore', role: 'Service lead', status: 'Needs review' }, { initials: 'SK', name: 'Sam Kim', role: 'Team lead', status: 'On floor' }] });
        return renderReports({ kicker: 'Business health', title: view === 'Overview' ? 'See the numbers that matter most.' : 'Turn performance into a clear next move.', tabs: ['Week', 'Month'], chartTitle: 'Revenue compared with goal', bars: [38, 55, 48, 76, 64, 91, 73], highlight: 5, takeaways: [['Labor', 'On target'], ['Revenue', '↑ 11%'], ['Workload', 'Steady']], reportRows: [['Revenue', '$52.8k', '↑ 8%'], ['Labor', '28.1%', 'On target'], ['Customer score', '4.8', '↑ .2']] });
      }
      if (product === 'Live Task Board') {
        if (view === 'Team') return renderTeam({ kicker: 'Team coverage', title: 'Know who owns the work right now.', tabs: ['Today', 'Tomorrow'], people: [{ initials: 'JR', name: 'Jordan Reed', role: 'Shift lead', status: 'On site' }, { initials: 'AM', name: 'Avery Moore', role: 'Service lead', status: 'Assigned' }, { initials: 'SK', name: 'Sam Kim', role: 'Support', status: 'Available' }] });
        return renderBoard('Live task board', view === 'Completed' ? 'See what the team has already handled.' : 'Keep the next important task moving.', [{ title: 'Now', items: [['Customer callback', '8m'], ['Equipment check', 'Now'], ['Job update', '2:30']], progress: 72 }, { title: view === 'Completed' ? 'Completed' : 'In progress', items: [['Estimate review', 'Assigned'], ['Team handoff', 'Moving'], ['Site prep', 'Underway']], progress: 58 }, { title: 'Next', items: [['Close-out note', 'Later'], ['Supply order', '4:00'], ['Follow-up', 'Today']], progress: 34 }]);
      }
      if (product === 'Customer Inbox') {
        if (view === 'Insights') return renderReports({ kicker: 'Customer insights', title: 'See which requests need a faster response.', tabs: ['Week', 'Month'], chartTitle: 'Resolved conversations', bars: [35, 47, 61, 55, 78, 85, 91], highlight: 6, takeaways: [['Reply time', '↓ 7m'], ['Resolved', '94%'], ['New leads', '↑ 9%']], reportRows: [['New conversations', '86', '↑ 9%'], ['Average reply', '18m', '↓ 7m'], ['Resolved', '94%', '↑ 3%']] });
        return renderInbox('Customer inbox', view === 'Follow-ups' ? 'Follow up while the conversation still matters.' : 'Keep every customer conversation moving.', view === 'Assigned' ? 'Assigned to your team' : 'New conversations', view === 'Follow-ups' ? 'Next follow-up' : 'Customer details');
      }
      if (product === 'Field Service Scheduler') {
        if (view === 'Crew') return renderTeam({ kicker: 'Crew schedule', title: 'Give every crew a clear day in the field.', tabs: ['Today', 'Tomorrow'], people: [{ initials: 'JT', name: 'Jordan Team', role: 'Crew 1', status: '3 jobs scheduled' }, { initials: 'AR', name: 'Avery Route', role: 'Crew 2', status: '2 jobs scheduled' }, { initials: 'SK', name: 'Sam Kim', role: 'On call', status: 'Available at 2' }] });
        return renderBoard('Field service scheduler', view === 'Dispatch' ? 'Dispatch the right person to the next job.' : 'See every job, crew, and time window in one place.', [{ title: 'Morning', items: [['8:30 inspection', 'Crew 1'], ['10:00 repair', 'Crew 2'], ['11:30 estimate', 'Crew 1']], progress: 78 }, { title: 'Afternoon', items: [['1:00 install', 'Crew 2'], ['2:30 service', 'Crew 1'], ['3:15 callback', 'Open']], progress: 54 }, { title: 'Jobs', items: [['Scheduled', '8'], ['In progress', '3'], ['Ready to close', '2']], progress: 64 }]);
      }
      if (product === 'Quote & Follow-Up Pipeline') {
        if (view === 'Won') return renderReports({ kicker: 'Sales pipeline', title: 'See what is turning into booked work.', tabs: ['Month', 'Quarter'], chartTitle: 'Quote value by stage', bars: [42, 64, 55, 78, 71, 87, 94], highlight: 6, takeaways: [['Quotes sent', '24'], ['Win rate', '38%'], ['Booked work', '↑ 12%']], reportRows: [['New leads', '42', '↑ 7%'], ['Estimates sent', '24', '↑ 10%'], ['Booked work', '$38.4k', '↑ 12%']] });
        return renderBoard('Quote & follow-up pipeline', view === 'Estimates' ? 'Make it easy to send and track every estimate.' : 'Keep good leads from getting lost in the shuffle.', [{ title: 'New leads', items: [['Kitchen remodel', 'Today'], ['Office clean', 'Today'], ['Event request', 'Tomorrow']], progress: 82 }, { title: 'Estimates', items: [['Review proposal', '$4,200'], ['Send quote', '$1,850'], ['Awaiting answer', '$7,600']], progress: 61 }, { title: 'Follow-ups', items: [['Call scheduled', '2:00'], ['Email draft', 'Ready'], ['Booked work', '3']], progress: 49 }]);
      }
      if (product === 'Team Checklist App') {
        if (view === 'Team') return renderTeam({ kicker: 'Team readiness', title: 'Make the standard clear for every person.', tabs: ['Today', 'This week'], people: [{ initials: 'JR', name: 'Jordan Reed', role: 'Opening lead', status: 'Checklist complete' }, { initials: 'AM', name: 'Avery Moore', role: 'Team member', status: 'Training due' }, { initials: 'SK', name: 'Sam Kim', role: 'Closing lead', status: 'Starts at 4' }] });
        return renderChecklist();
      }
      return renderPortal(view);
    };

    const setActiveDemoScreen = (slide, requestedScreen) => {
      const main = slide.querySelector('.demo-main');
      const product = slide.dataset.product;
      const model = productModels[product];
      const navItems = Array.from(slide.querySelectorAll('.demo-nav-item'));
      const defaultScreen = model ? model.nav[0] : 'Overview';
      const screen = requestedScreen.trim();

      navItems.forEach((item) => {
        const isCurrent = item.textContent.trim() === screen;
        item.classList.toggle('is-current', isCurrent);
        item.setAttribute('aria-pressed', String(isCurrent));
      });

      if (slide.screenTimer) window.clearTimeout(slide.screenTimer);
      main.classList.add('is-switching');
      slide.screenTimer = window.setTimeout(() => {
        const content = screen === defaultScreen ? main.dataset.defaultMarkup : renderProductView(product, screen);
        if (content) {
          main.innerHTML = content;
        }
        main.classList.remove('is-switching');
      }, 150);
    };

    slides.forEach((slide) => {
      const main = slide.querySelector('.demo-main');
      const product = slide.dataset.product;
      const model = productModels[product];
      const sidebar = slide.querySelector('.demo-sidebar');
      const brand = sidebar.querySelector('.demo-brand');
      if (model) {
        sidebar.innerHTML = `${brand ? brand.outerHTML : ''}${model.nav.map((label, index) => `<div class="demo-nav-item${index === 0 ? ' is-current' : ''}">${label}</div>`).join('')}`;
        main.innerHTML = renderProductView(product, model.nav[0]);
      }
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
