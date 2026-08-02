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

    const screenHeader = (kicker, title, tabs, activeTab) => `
      <div class="demo-main-top">
        <div><p class="demo-kicker">${kicker}</p><h3>${title}</h3></div>
        <div class="demo-tabs">${tabs.map((tab) => `<button type="button" data-demo-tab="${tab}" class="${tab === activeTab ? 'is-active' : ''}" aria-pressed="${tab === activeTab}">${tab}</button>`).join('')}</div>
      </div>`;

    const metrics = (items) => `<div class="demo-metrics">${items.map((item) => `<div class="demo-metric"><p>${item[0]}</p><strong>${item[1]}</strong><span>${item[2]}</span></div>`).join('')}</div>`;
    const action = (label, done) => `<button type="button" class="demo-action" data-demo-action data-done="${done || `${label}d`}">${label}</button>`;
    const dataTable = (title, headers, rows) => `<section class="demo-data-card"><div class="demo-card-head"><h4>${title}</h4><span>Live</span></div><div class="demo-data-table"><div class="demo-data-row is-head">${headers.map((cell) => `<span>${cell}</span>`).join('')}</div>${rows.map((row) => `<div class="demo-data-row">${row.map((cell) => `<span>${cell}</span>`).join('')}</div>`).join('')}</div></section>`;
    const board = (columns) => `<div class="demo-kanban">${columns.map((column) => `<section class="demo-kanban-column"><div class="demo-card-head"><h4>${column[0]}</h4><span>${column[1].length}</span></div>${column[1].map((card) => `<article class="demo-task-card"><strong>${card[0]}</strong><p>${card[1]}</p><div><span class="demo-badge">${card[2]}</span>${card[3] ? action(card[3], card[4]) : ''}</div></article>`).join('')}</section>`).join('')}</div>`;
    const people = (items) => `<div class="demo-team-grid">${items.map((person) => `<article class="demo-team-card"><div class="demo-avatar">${person[0]}</div><h4>${person[1]}</h4><p>${person[2]}</p><span>${person[3]}</span>${person[4] ? action(person[4], person[5]) : ''}</article>`).join('')}</div>`;
    const timeline = (items) => `<section class="demo-timeline">${items.map((item) => `<div class="demo-time-row"><time>${item[0]}</time><i class="${item[4] || ''}"></i><div><strong>${item[1]}</strong><p>${item[2]}</p></div><span>${item[3]}</span></div>`).join('')}</section>`;
    const chart = (title, bars, notes) => `<div class="demo-bottom"><section class="demo-chart"><div class="demo-chart-head">${title}<span>Updated now</span></div><div class="demo-bars">${bars.map((height, index) => `<i class="${index === bars.length - 2 ? 'is-highlight' : ''}" style="height:${height}%"></i>`).join('')}</div></section><section class="demo-list"><p class="demo-list-title">What changed</p>${notes.map((item) => `<div class="demo-list-row">${item[0]}<span>${item[1]}</span></div>`).join('')}</section></div>`;
    const checklist = (items) => `<section class="demo-check-panel"><div class="demo-card-head"><h4>Required steps</h4><span>${items.filter((item) => item[2]).length}/${items.length} complete</span></div>${items.map((item) => `<div class="demo-check-row ${item[2] ? 'is-done' : ''}"><button type="button" data-demo-check aria-label="Mark ${item[0]} complete">${item[2] ? '✓' : ''}</button><div><strong>${item[0]}</strong><p>${item[1]}</p></div><span>${item[2] ? 'Done' : item[3]}</span></div>`).join('')}</section>`;
    const messages = (list, customer, copy) => `<div class="demo-inbox"><section class="demo-conversations">${list.map((item, index) => `<button type="button" class="demo-conversation ${index === 0 ? 'is-selected' : ''}"><i></i><span><strong>${item[0]}</strong><small>${item[1]}</small></span><time>${item[2]}</time></button>`).join('')}</section><section class="demo-thread"><div class="demo-card-head"><h4>${customer}</h4><span>Open</span></div><div class="demo-message is-customer">${copy}</div><div class="demo-message is-team">Thanks—our team can help with that. I’m checking the schedule now.</div><div class="demo-composer"><span>Write a reply…</span>${action('Send reply', 'Reply sent')}</div></section></div>`;

    const productModels = {
      'Business Health Dashboard': { nav: ['Overview', 'Performance', 'Team', 'Reports'] },
      'Live Task Board': { nav: ['Board', 'In Progress', 'Team', 'Completed'] },
      'Customer Inbox': { nav: ['Inbox', 'Assigned', 'Follow-ups', 'Insights'] },
      'Field Service Scheduler': { nav: ['Schedule', 'Dispatch', 'Crew', 'Jobs'] },
      'Quote & Follow-Up Pipeline': { nav: ['Leads', 'Estimates', 'Follow-ups', 'Won'] },
      'Team Checklist App': { nav: ['Today', 'Checklists', 'Training', 'Team'] },
      'Client Portal': { nav: ['Overview', 'Project', 'Messages', 'Documents'] }
    };

    const viewMeta = {
      'Business Health Dashboard': {
        Overview: ['Daily pulse', 'Know what needs your attention.', ['Today', 'This week']], Performance: ['Performance', 'See where results are improving—or slipping.', ['Revenue', 'Efficiency']], Team: ['Team performance', 'Balance coverage and productivity.', ['Coverage', 'Productivity']], Reports: ['Reporting', 'Put recurring updates on autopilot.', ['Saved', 'Scheduled']]
      },
      'Live Task Board': {
        Board: ['Live operations', 'Move work forward without chasing updates.', ['My team', 'All work']], 'In Progress': ['Active work', 'See exactly what is happening right now.', ['By task', 'Timeline']], Team: ['Team workload', 'Give work to the right person.', ['Available', 'Assigned']], Completed: ['Completion log', 'Keep a reliable record of finished work.', ['Today', 'This week']]
      },
      'Customer Inbox': {
        Inbox: ['Customer inbox', 'Handle every request in one place.', ['Unread', 'All']], Assigned: ['Ownership', 'See who is handling each conversation.', ['By person', 'By priority']], 'Follow-ups': ['Follow-up queue', 'Reach back out at the right time.', ['Due today', 'Upcoming']], Insights: ['Inbox insights', 'Improve response time and customer care.', ['This week', 'This month']]
      },
      'Field Service Scheduler': {
        Schedule: ['Field schedule', 'See every appointment and time window.', ['Today', 'Tomorrow']], Dispatch: ['Dispatch', 'Match open work with available crews.', ['Unassigned', 'En route']], Crew: ['Crew availability', 'Know who is free, busy, or nearby.', ['Availability', 'Routes']], Jobs: ['Job management', 'Track every job from scheduled to paid.', ['Active', 'Needs review']]
      },
      'Quote & Follow-Up Pipeline': {
        Leads: ['Sales pipeline', 'Turn new inquiries into booked work.', ['Pipeline', 'New today']], Estimates: ['Estimates', 'Create, send, and track every quote.', ['Drafts', 'Sent']], 'Follow-ups': ['Sales follow-ups', 'Keep promising opportunities moving.', ['Due today', 'Upcoming']], Won: ['Booked work', 'See what sold and what happens next.', ['This month', 'This quarter']]
      },
      'Team Checklist App': {
        Today: ['Today’s work', 'Give every shift a clear standard.', ['Opening', 'Closing']], Checklists: ['Checklist library', 'Build repeatable processes once.', ['Active', 'Templates']], Training: ['Team training', 'Keep skills and certifications current.', ['In progress', 'Due soon']], Team: ['Team readiness', 'See completion by person and location.', ['Today', 'This week']]
      },
      'Client Portal': {
        Overview: ['Client home', 'Give clients one clear place for updates.', ['Project', 'Account']], Project: ['Project plan', 'Make progress and next steps easy to see.', ['Timeline', 'Milestones']], Messages: ['Messages', 'Keep decisions out of scattered email threads.', ['Conversation', 'Requests']], Documents: ['Documents', 'Share, review, and approve files securely.', ['Shared', 'Needs approval']]
      }
    };

    const renderProductBody = (product, view, tab) => {
      if (product === 'Business Health Dashboard') {
        if (view === 'Overview') return metrics(tab === 'Today' ? [['Revenue', '$8,420', '↑ 12% vs. Friday'], ['Labor', '27.8%', 'On target'], ['Open work', '6', '2 need attention'], ['Cash due', '$4,180', 'Next 7 days']] : [['Revenue', '$52.8k', '↑ 8% vs. last week'], ['Gross margin', '41.2%', '↑ 1.4 pts'], ['Jobs completed', '38', '4 ahead of plan'], ['Customer score', '4.8', 'From 126 reviews']]) + chart('Revenue by day', tab === 'Today' ? [30, 44, 38, 62, 55, 86, 72] : [48, 56, 64, 58, 76, 91, 84], [['Largest opportunity', '$7,600 quote'], ['At-risk item', '2 late jobs'], ['Next review', 'Monday 9:00']]);
        if (view === 'Performance') return chart(tab === 'Revenue' ? 'Revenue vs. target' : 'Jobs completed per labor hour', tab === 'Revenue' ? [45, 52, 61, 58, 74, 88, 81] : [32, 48, 54, 67, 64, 79, 91], tab === 'Revenue' ? [['Recurring work', '↑ 14%'], ['Average ticket', '$685'], ['Forecast', '$61.4k']] : [['Drive time', '↓ 9%'], ['Rework', '2.1%'], ['Capacity', '83%']]) + dataTable('Location comparison', ['Location', 'Result', 'Goal'], [['North', '$21.4k', '104%'], ['Central', '$18.7k', '98%'], ['West', '$12.7k', '91%']]);
        if (view === 'Team') return people(tab === 'Coverage' ? [['JR', 'Jordan Reed', 'Operations lead', 'On site until 5'], ['AM', 'Avery Moore', 'Service lead', 'Open 2–4 PM'], ['SK', 'Sam Kim', 'Field lead', 'Route at capacity']] : [['JR', 'Jordan Reed', '18 jobs this week', '96% on time'], ['AM', 'Avery Moore', '$12.4k managed', '4.9 customer score'], ['SK', 'Sam Kim', '21 jobs this week', '3.1% rework']]);
        return dataTable(tab === 'Saved' ? 'Saved reports' : 'Scheduled deliveries', ['Report', 'Owner', 'Status'], tab === 'Saved' ? [['Weekly owner summary', 'Christopher', action('Run report', 'Report ready')], ['Job profitability', 'Finance', 'Updated today'], ['Customer retention', 'Sales', 'Updated Friday']] : [['Monday performance brief', 'Owners', 'Mon · 8:00 AM'], ['Payroll review', 'Operations', 'Thu · 3:00 PM'], ['Monthly close', 'Finance', '1st · 9:00 AM']]);
      }
      if (product === 'Live Task Board') {
        if (view === 'Board') return board(tab === 'My team' ? [['Now', [['Call Miller account', 'Customer waiting · Jordan', 'Due now', 'Complete', 'Completed'], ['Inspect unit 24', 'West site · Avery', '10:30', 'Start', 'Started']]], ['Next', [['Approve supply order', 'Purchasing · Sam', '11:15'], ['Send close-out photos', 'Oak Street · Jordan', '12:00']]], ['Later', [['Weekly safety review', 'Whole team', '3:30'], ['Prep tomorrow’s routes', 'Dispatch', '4:15']]]] : [['Unassigned', [['Return warranty call', 'Priority customer', '9 min', 'Assign', 'Assigned'], ['Pick up filter order', 'North branch', '11:00']]], ['Field team', [['Replace control board', 'Avery · On site', 'In progress'], ['Annual inspection', 'Sam · En route', '12 min']]], ['Office', [['Review invoice #1048', 'Jordan', 'Today'], ['Confirm Friday install', 'Mia', '2:00']]]]);
        if (view === 'In Progress') return tab === 'Timeline' ? timeline([['9:18', 'Avery arrived', '218 Pine Street', 'On site', 'is-good'], ['9:32', 'Diagnosis added', 'Control board failure', 'Updated', 'is-good'], ['10:05', 'Part requested', 'Warehouse checking stock', 'Waiting'], ['11:00', 'Customer update', 'Text message scheduled', 'Next']]) : dataTable('Active tasks', ['Task', 'Owner', 'Status'], [['Replace control board', 'Avery', 'On site · 47m'], ['Annual inspection', 'Sam', 'En route · 12m'], ['Miller callback', 'Jordan', action('Complete', 'Completed')]]);
        if (view === 'Team') return people(tab === 'Available' ? [['JR', 'Jordan Reed', 'Office', 'Available now', 'Assign task', 'Assigned'], ['MH', 'Mia Hall', 'North zone', 'Available at 11:30'], ['SK', 'Sam Kim', 'West zone', 'Available at 1:00']] : [['AM', 'Avery Moore', '2 active tasks', 'Next opening 2:15'], ['SK', 'Sam Kim', '3 active tasks', 'Route 74% full'], ['JR', 'Jordan Reed', '1 active task', 'Route 38% full']]);
        return dataTable(tab === 'Today' ? 'Completed today' : 'Weekly completion log', ['Task', 'Completed by', 'Time'], tab === 'Today' ? [['Open warehouse', 'Jordan', '7:52 AM'], ['Miller estimate', 'Mia', '9:14 AM'], ['Unit 18 repair', 'Avery', '10:06 AM']] : [['Customer follow-ups', 'Team', '24/26'], ['Field jobs', 'Team', '38/41'], ['Safety checks', 'Team', '100%']]);
      }
      if (product === 'Customer Inbox') {
        if (view === 'Inbox') return messages(tab === 'Unread' ? [['Taylor Brooks', 'Can you move our appointment?', '4m'], ['Morgan Lee', 'Question about the estimate', '11m'], ['Jamie Ortiz', 'Photos attached', '18m']] : [['Taylor Brooks', 'Can you move our appointment?', '4m'], ['Casey Smith', 'Thank you!', 'Yesterday'], ['Morgan Lee', 'Question about the estimate', 'Tue']], 'Taylor Brooks', 'Can we move Thursday’s appointment to Friday morning?');
        if (view === 'Assigned') return dataTable(tab === 'By person' ? 'Conversation ownership' : 'Priority queue', ['Customer', 'Owner', 'Status'], tab === 'By person' ? [['Taylor Brooks', 'Jordan', 'Reply due · 6m'], ['Morgan Lee', 'Avery', 'Waiting on customer'], ['Jamie Ortiz', 'Mia', action('Resolve', 'Resolved')]] : [['Miller & Co.', 'Urgent', 'Service interruption'], ['Taylor Brooks', 'High', 'Appointment change'], ['Morgan Lee', 'Normal', 'Estimate question']]);
        if (view === 'Follow-ups') return dataTable(tab === 'Due today' ? 'Today’s follow-ups' : 'Upcoming follow-ups', ['Customer', 'Next step', 'Due'], tab === 'Due today' ? [['Miller & Co.', 'Call after repair', action('Log call', 'Call logged')], ['Morgan Lee', 'Check estimate decision', '2:00 PM'], ['Jamie Ortiz', 'Request a review', '4:30 PM']] : [['Taylor Brooks', 'Confirm Friday visit', 'Tomorrow'], ['Northside Dental', 'Renewal check-in', 'Monday'], ['Grant Office', 'Share maintenance plan', 'Aug 8']]);
        return metrics(tab === 'This week' ? [['New conversations', '86', '↑ 9%'], ['First response', '18m', '↓ 7m'], ['Resolved', '94%', '↑ 3 pts'], ['Leads captured', '17', '5 converted']] : [['New conversations', '344', '↑ 12%'], ['First response', '16m', '↓ 11m'], ['Resolved', '95%', '↑ 4 pts'], ['Customer rating', '4.8', '128 responses']]) + chart('Conversations resolved', [35, 47, 61, 55, 78, 85, 91], [['Busiest hour', '10–11 AM'], ['Top topic', 'Scheduling'], ['SLA met', '96%']]);
      }
      if (product === 'Field Service Scheduler') {
        if (view === 'Schedule') return timeline(tab === 'Today' ? [['8:30', 'Annual inspection', '218 Pine St · Crew 1', 'Complete', 'is-good'], ['10:00', 'HVAC repair', '44 West Ave · Crew 2', 'On site', 'is-good'], ['1:00', 'New install', '911 Lake Rd · Crew 1', 'Scheduled'], ['3:15', 'Service callback', '12 Grant St · Unassigned', action('Assign', 'Assigned')]] : [['8:00', 'Preventive maintenance', 'Westbrook Office · Crew 2', 'Confirmed'], ['10:30', 'Estimate visit', 'Martin Home · Crew 1', 'Confirmed'], ['1:30', 'Warranty repair', 'Pine Dental · Crew 3', 'Needs part'], ['4:00', 'Final walkthrough', 'Lakeview Retail · Crew 1', 'Pending']]);
        if (view === 'Dispatch') return board(tab === 'Unassigned' ? [['Open jobs', [['Service callback', '12 Grant St · 3.4 miles', 'High', 'Assign crew', 'Crew assigned'], ['Water leak', '805 Elm Ave · 6.1 miles', 'Urgent', 'Dispatch', 'Crew dispatched']]], ['Available crews', [['Crew 3', 'Available now · North zone', '2.2 miles'], ['Sam Kim', 'Available at 1:15', 'West zone']]], ['Job details', [['Customer window', '12:00–2:00 PM', 'Confirmed'], ['Required skill', 'Level II service', 'Matched']]]] : [['En route', [['Crew 1 → Lake Road', 'ETA 12:47 · 4.8 miles', 'On time'], ['Crew 3 → Elm Avenue', 'ETA 12:58 · 2.1 miles', 'Urgent']]], ['On site', [['Crew 2', '44 West Ave · 54 min', 'Repair'], ['Sam Kim', 'Pine Dental · 22 min', 'Inspection']]], ['Alerts', [['Traffic delay', 'Crew 1 · +8 min', 'Notify customer', 'Notify', 'Customer notified']]]]);
        if (view === 'Crew') return people(tab === 'Availability' ? [['C1', 'Crew 1', 'South zone', 'Available at 2:15'], ['C2', 'Crew 2', 'Central zone', 'On site until 12:30'], ['C3', 'Crew 3', 'North zone', 'Available now', 'Assign job', 'Assigned']] : [['C1', 'Crew 1', '4 stops · 28 miles', '92% on time'], ['C2', 'Crew 2', '3 stops · 19 miles', 'One open window'], ['C3', 'Crew 3', '2 stops · 14 miles', 'Next stop 1:30']]);
        return dataTable(tab === 'Active' ? 'Active jobs' : 'Jobs needing review', ['Job', 'Customer', 'Status'], tab === 'Active' ? [['#1054 · HVAC repair', 'Miller & Co.', 'On site'], ['#1055 · Installation', 'Lakeview Retail', 'Scheduled'], ['#1056 · Inspection', 'Pine Dental', 'En route']] : [['#1048 · Repair', 'Grant Office', 'Missing photos'], ['#1041 · Install', 'Northside Dental', action('Approve', 'Approved')], ['#1037 · Inspection', 'Taylor Brooks', 'Invoice draft']]);
      }
      if (product === 'Quote & Follow-Up Pipeline') {
        if (view === 'Leads') return board(tab === 'Pipeline' ? [['New', [['Kitchen remodel', 'Brooks Home · $18k potential', 'Today', 'Qualify', 'Qualified'], ['Office cleaning', 'Grant Office · $2.4k/yr', 'New']]], ['Qualified', [['HVAC replacement', 'Miller & Co. · $9.8k', 'Site visit set'], ['Retail maintenance', 'Lakeview · $6k/yr', 'Decision maker met']]], ['Proposal', [['Dental buildout', 'Northside · $14.2k', 'Review Friday'], ['Service plan', 'Pine Dental · $3.6k', 'Sent']]]] : [['New today', [['Jamie Ortiz', 'Website · Kitchen remodel', '9:14 AM', 'Contact', 'Contacted'], ['Lakeview Retail', 'Referral · Maintenance', '10:02 AM'], ['Brooks Home', 'Google · HVAC replacement', '11:38 AM']]], ['Response due', [['Jamie Ortiz', 'Call within 15 minutes', 'Now'], ['Brooks Home', 'Send booking link', 'Today']]], ['Source', [['Website', '2 leads', '67%'], ['Referral', '1 lead', '33%']]]]);
        if (view === 'Estimates') return dataTable(tab === 'Drafts' ? 'Draft estimates' : 'Sent estimates', ['Estimate', 'Value', 'Status'], tab === 'Drafts' ? [['#E-204 · Brooks kitchen', '$18,400', action('Send estimate', 'Estimate sent')], ['#E-205 · Grant cleaning', '$2,400/yr', 'Needs pricing'], ['#E-206 · Miller HVAC', '$9,850', 'Ready to review']] : [['#E-198 · Pine service plan', '$3,600', 'Viewed 2h ago'], ['#E-196 · Northside buildout', '$14,200', 'Follow-up due'], ['#E-191 · Lakeview maintenance', '$6,000/yr', 'Accepted']]);
        if (view === 'Follow-ups') return dataTable(tab === 'Due today' ? 'Due today' : 'Upcoming', ['Opportunity', 'Next action', 'Status'], tab === 'Due today' ? [['Northside buildout', 'Call decision maker', action('Log call', 'Call logged')], ['Miller HVAC', 'Send financing options', '11:30 AM'], ['Brooks kitchen', 'Confirm walkthrough', '3:00 PM']] : [['Pine service plan', 'Check proposal', 'Tomorrow'], ['Lakeview maintenance', 'Contract review', 'Monday'], ['Grant cleaning', 'Second touch', 'Wednesday']]);
        return metrics(tab === 'This month' ? [['Booked revenue', '$38.4k', '↑ 12%'], ['Deals won', '11', '3 this week'], ['Win rate', '38%', '↑ 4 pts'], ['Average sale', '$3,491', '↑ $280']] : [['Booked revenue', '$108k', '↑ 18%'], ['Deals won', '29', '7 recurring'], ['Win rate', '41%', '↑ 6 pts'], ['Sales cycle', '16 days', '↓ 3 days']]) + dataTable('Recently won', ['Customer', 'Work', 'Value'], [['Lakeview Retail', 'Maintenance plan', '$6,000/yr'], ['Taylor Brooks', 'Replacement', '$8,750'], ['Pine Dental', 'Service plan', '$3,600/yr']]);
      }
      if (product === 'Team Checklist App') {
        if (view === 'Today') return checklist(tab === 'Opening' ? [['Unlock and safety walk', 'Jordan · Due 7:45 AM', true], ['Test equipment', 'Avery · Photo required', true], ['Count starting inventory', 'Mia · 14 items', false, 'Due now'], ['Review today’s schedule', 'Jordan · 8 appointments', false, '8:15 AM']] : [['Restock vehicles', 'Crew leads · 3 vehicles', true], ['Upload close-out photos', 'Field team · 8 jobs', false, 'Due 4:30'], ['Secure equipment', 'Avery · Photo required', false, 'Due 5:00'], ['Manager sign-off', 'Jordan · After all tasks', false, 'Last step']]);
        if (view === 'Checklists') return dataTable(tab === 'Active' ? 'Active checklists' : 'Template library', ['Checklist', 'Used by', 'Status'], tab === 'Active' ? [['Daily opening', 'North location', '75% complete'], ['Vehicle close-out', '3 field crews', '62% complete'], ['New job intake', 'Office team', '100% complete']] : [['New employee onboarding', '12 steps', action('Use template', 'Template added')], ['Safety incident response', '8 steps', 'Ready'], ['Weekly inventory count', '16 steps', 'Ready']]);
        if (view === 'Training') return dataTable(tab === 'In progress' ? 'Training in progress' : 'Due soon', ['Team member', 'Module', 'Progress'], tab === 'In progress' ? [['Avery Moore', 'Customer handoff', '3 of 4 lessons'], ['Sam Kim', 'Equipment safety', '80%'], ['Mia Hall', 'Job close-out', 'Complete quiz']] : [['Jordan Reed', 'Annual safety', 'Due Aug 8'], ['Avery Moore', 'Data handling', action('Send reminder', 'Reminder sent')], ['Sam Kim', 'Driver policy', 'Due Aug 12']]);
        return people(tab === 'Today' ? [['JR', 'Jordan Reed', 'Opening lead', '4/4 complete'], ['AM', 'Avery Moore', 'Field team', '6/8 complete'], ['SK', 'Sam Kim', 'Field team', '5/8 complete']] : [['JR', 'Jordan Reed', '28 tasks assigned', '98% complete'], ['AM', 'Avery Moore', '34 tasks assigned', '91% complete'], ['SK', 'Sam Kim', '31 tasks assigned', '94% complete']]);
      }
      if (view === 'Overview') return metrics(tab === 'Project' ? [['Project health', 'On track', 'Updated today'], ['Next milestone', 'Aug 12', 'Installation'], ['Open requests', '2', 'Both assigned'], ['Files shared', '8', '2 need approval']] : [['Open projects', '2', 'Both on track'], ['Invoices', '$4,200', 'Next due Aug 15'], ['Support plan', 'Active', 'Priority response'], ['Account owner', 'Jordan', 'Reply time 22m']]) + timeline([['Done', 'Discovery and site review', 'Completed July 22', 'Approved', 'is-good'], ['Now', 'Equipment procurement', 'Three of four items received', 'In progress', 'is-good'], ['Next', 'On-site installation', 'Scheduled for August 12', 'Confirmed'], ['Later', 'Final walkthrough', 'Client sign-off required', 'Aug 14']]);
      if (view === 'Project') return tab === 'Timeline' ? timeline([['Jul 22', 'Discovery complete', 'Requirements and measurements approved', 'Done', 'is-good'], ['Aug 1', 'Materials ordered', 'Three of four items received', 'In progress', 'is-good'], ['Aug 12', 'Installation', 'Crew arrival 8:00–9:00 AM', 'Scheduled'], ['Aug 14', 'Final review', 'Walkthrough and handoff', 'Upcoming']]) : dataTable('Project milestones', ['Milestone', 'Owner', 'Status'], [['Planning approved', 'Client + Jordan', 'Complete'], ['Materials received', 'Project team', '75%'], ['Installation', 'Crew 1', 'Aug 12'], ['Final acceptance', 'Client', 'Pending']]);
      if (view === 'Messages') return tab === 'Conversation' ? messages([['Jordan Reed', 'Installation timing confirmed', '10m'], ['Avery Moore', 'Finish options attached', 'Yesterday'], ['Project team', 'Weekly update', 'Friday']], 'Jordan Reed · Project lead', 'Your installation is confirmed for August 12. Would an 8:00–9:00 AM arrival window work?') : dataTable('Client requests', ['Request', 'Owner', 'Status'], [['Confirm arrival window', 'Client', action('Confirm', 'Confirmed')], ['Choose finish option', 'Client', 'Due Friday'], ['Parking instructions', 'Project team', 'Received']]);
      return dataTable(tab === 'Shared' ? 'Shared documents' : 'Waiting for approval', ['File', 'Updated', 'Status'], tab === 'Shared' ? [['Project proposal.pdf', 'Jul 22', 'Approved'], ['Installation plan.pdf', 'Today', 'Current'], ['Finish options.pdf', 'Yesterday', 'New'], ['Site photos.zip', 'Jul 24', action('Download', 'Downloaded')]] : [['Change order #02.pdf', 'Today', action('Approve', 'Approved')], ['Finish selection.pdf', 'Yesterday', 'Signature needed']]);
    };

    const renderProductView = (product, view, requestedTab) => {
      const meta = viewMeta[product][view];
      const activeTab = meta[2].includes(requestedTab) ? requestedTab : meta[2][0];
      return `${screenHeader(meta[0], meta[1], meta[2], activeTab)}${renderProductBody(product, view, activeTab)}`;
    };

    const setActiveDemoScreen = (slide, requestedScreen) => {
      const main = slide.querySelector('.demo-main');
      const product = slide.dataset.product;
      const model = productModels[product];
      const navItems = Array.from(slide.querySelectorAll('.demo-nav-item'));
      const screen = requestedScreen.trim();

      navItems.forEach((item) => {
        const isCurrent = item.textContent.trim() === screen;
        item.classList.toggle('is-current', isCurrent);
        item.setAttribute('aria-pressed', String(isCurrent));
      });

      if (slide.screenTimer) window.clearTimeout(slide.screenTimer);
      main.classList.add('is-switching');
      slide.screenTimer = window.setTimeout(() => {
        slide.dataset.activeScreen = screen;
        slide.dataset.activeTab = viewMeta[product][screen][2][0];
        main.innerHTML = renderProductView(product, screen, slide.dataset.activeTab);
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
        slide.dataset.activeScreen = model.nav[0];
        slide.dataset.activeTab = viewMeta[product][model.nav[0]][2][0];
        main.innerHTML = renderProductView(product, model.nav[0], slide.dataset.activeTab);
      }
      const defaultItem = slide.querySelector('.demo-nav-item.is-current');
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
        const slide = tab.closest('.demo-slide');
        slide.dataset.activeTab = tab.dataset.demoTab;
        slide.querySelector('.demo-main').innerHTML = renderProductView(slide.dataset.product, slide.dataset.activeScreen, slide.dataset.activeTab);
        return;
      }

      const check = event.target.closest('[data-demo-check]');
      if (check) {
        const row = check.closest('.demo-check-row');
        const done = row.classList.toggle('is-done');
        check.textContent = done ? '✓' : '';
        row.querySelector(':scope > span').textContent = done ? 'Done' : 'Due now';
        const panel = row.closest('.demo-check-panel');
        const total = panel.querySelectorAll('.demo-check-row').length;
        const completed = panel.querySelectorAll('.demo-check-row.is-done').length;
        panel.querySelector('.demo-card-head > span').textContent = `${completed}/${total} complete`;
        return;
      }

      const actionButton = event.target.closest('[data-demo-action]');
      if (actionButton) {
        actionButton.textContent = actionButton.dataset.done;
        actionButton.classList.add('is-done');
        actionButton.disabled = true;
        const frame = actionButton.closest('.demo-frame');
        frame.querySelector('.demo-toast')?.remove();
        const toast = document.createElement('div');
        toast.className = 'demo-toast';
        toast.textContent = `✓ ${actionButton.dataset.done}`;
        frame.appendChild(toast);
        window.setTimeout(() => toast.remove(), 1800);
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
      status.textContent = 'Sending your request…';
      if (button) button.disabled = true;
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Form submission failed');
        form.reset();
        status.textContent = 'Thanks—your request is in. Christopher will respond directly.';
      } catch (error) {
        status.textContent = 'Something went wrong. Please email christopher@cederbi.com instead.';
      } finally {
        if (button) button.disabled = false;
      }
    });
  }
})();
