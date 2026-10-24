// Language is local to this browser. Original text nodes preserve links and formatting.
const portfolioLanguage = (() => {
  let current = 'en';
  try { if (localStorage.getItem('portfolio-language') === 'fr') current = 'fr'; } catch { /* Storage can be unavailable in private browsing. */ }
  const languageSwitch = document.querySelector('.language-switch');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let requested = current;
  let transitioning = false;
  let activeAnimations = [];
  const normalized = text => text.replace(/\s+/g, ' ').trim();
  const textRecords = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest('script, style, svg, .language-switch')) continue;
    const key = normalized(node.data);
    if (frenchCopy[key]) textRecords.push({ node, en: node.data, fr: node.data.replace(key === node.data ? node.data : /\S[\s\S]*\S|\S/, frenchCopy[key]) });
  }
  const attributeRecords = [];
  document.querySelectorAll('[aria-label], [placeholder], [alt]').forEach(element => {
    for (const name of ['aria-label', 'placeholder', 'alt']) {
      const en = element.getAttribute(name);
      if (frenchCopy[en]) attributeRecords.push({ element, name, en, fr: frenchCopy[en] });
    }
  });
  function text(en) { return current === 'fr' ? frenchCopy[en] || en : en; }
  function update() {
    document.documentElement.lang = current;
    document.title = current === 'fr' ? 'Avneep Singh — Portfolio personnel' : 'Avneep Singh — Personal Portfolio';
    document.querySelector('meta[name="description"]').content = current === 'fr'
      ? 'Avneep Singh — étudiant à la maîtrise en informatique, développeur et chercheur à Montréal. Découvrez ses projets, son expérience et ses recherches.'
      : 'Avneep Singh — computer science graduate student, developer and researcher based in Montréal. Explore selected projects, experience and interests.';
    textRecords.forEach(record => { record.node.data = record[current]; });
    attributeRecords.forEach(record => record.element.setAttribute(record.name, record[current]));
    languageSwitch?.setAttribute('aria-checked', String(requested === 'fr'));
    const toggle = document.querySelector('.projects-toggle');
    if (toggle) toggle.querySelector('.projects-toggle-label').textContent = text(toggle.getAttribute('aria-expanded') === 'true' ? 'Fewer projects' : 'More projects');
    const portrait = document.querySelector('.portrait-halo');
    if (portrait) portrait.setAttribute('aria-label', text(`${portrait.classList.contains('is-expanded') ? 'Collapse' : 'Expand'} portrait of Avneep Singh`));
    document.querySelectorAll('[data-message-en]').forEach(message => { message.textContent = current === 'fr' ? message.dataset.messageFr : message.dataset.messageEn; });
    document.querySelectorAll('[data-section-link]').forEach(link => { link.textContent = sectionLink(link.dataset.sectionLink); });
    document.dispatchEvent(new CustomEvent('portfolio-language-change', { detail: current }));
  }
  function sectionLink(section) {
    const names = { about: 'À propos', projects: 'les projets', experience: 'le parcours', research: 'la recherche', publications: 'les manuscrits', contact: 'les coordonnées' };
    return current === 'fr' ? `Voir ${names[section] || section} ↗` : `Visit ${section} ↗`;
  }
  async function fade(targets, appearing) {
    if (reducedMotion.matches) return;
    activeAnimations = targets.filter(target => target.animate).map((target, index) => target.animate(
      [{ opacity: appearing ? 0 : 1 }, { opacity: appearing ? 1 : 0 }],
      { duration: appearing ? 260 : 160, delay: appearing ? Math.min(index * 12, 72) : 0, easing: 'ease-in-out', fill: 'both' }
    ));
    await Promise.all(activeAnimations.map(animation => animation.finished.catch(() => {})));
  }
  async function transitionLanguage() {
    if (transitioning) return;
    transitioning = true;
    try {
      while (requested !== current) {
        const targets = [...document.querySelectorAll('.hero-content, .portrait-caption, .section-index, .section-main, .contact-layout, .site-footer, #site-nav, .duck-chat, .duck-invite')]
          .filter(target => target.getClientRects().length);
        await fade(targets, false);
        const outgoing = activeAnimations;
        activeAnimations = [];
        current = requested;
        update();
        try { localStorage.setItem('portfolio-language', current); } catch { /* Preference still applies to this visit. */ }
        // Start the new copy at zero opacity before releasing the outgoing fade.
        const incoming = fade(targets, true);
        outgoing.forEach(animation => animation.cancel());
        await incoming;
        activeAnimations.forEach(animation => animation.cancel());
        activeAnimations = [];
      }
    } finally {
      activeAnimations.forEach(animation => animation.cancel());
      activeAnimations = [];
      transitioning = false;
    }
  }
  languageSwitch?.addEventListener('click', () => {
    requested = requested === 'en' ? 'fr' : 'en';
    languageSwitch.setAttribute('aria-checked', String(requested === 'fr'));
    transitionLanguage();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) activeAnimations.forEach(animation => animation.finish());
  });
  update();
  return { text, sectionLink, get current() { return current; } };
})();
