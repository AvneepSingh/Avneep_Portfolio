const elements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);}
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  elements.forEach(el => observer.observe(el));
} else elements.forEach(el => el.classList.add('visible'));
document.querySelector('#year').textContent = new Date().getFullYear();
// Close the accessible Bootstrap navigation after selecting a section.
document.querySelectorAll('#site-nav .nav-link').forEach(link => link.addEventListener('click', () => {
  const el = document.getElementById('site-nav');
  if (el.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(el).hide();
}));


// Hover reveals the full portrait; touch and keyboard can pin it open.
const portrait = document.querySelector('.portrait-halo');
if (portrait) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pinned = false;
  let hovering = false;
  const updatePortrait = () => {
    const expanded = pinned || hovering;
    portrait.classList.toggle('is-expanded', expanded);
    portrait.setAttribute('aria-pressed', String(expanded));
    portrait.setAttribute('aria-label', portfolioLanguage.text(`${expanded ? 'Collapse' : 'Expand'} portrait of Avneep Singh`));
  };
  portrait.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovering = true;
    updatePortrait();
  });
  portrait.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    const bounds = portrait.parentElement.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    portrait.style.setProperty('--tilt-x', `${(0.5 - y) * 14}deg`);
    portrait.style.setProperty('--tilt-y', `${(x - 0.5) * 18}deg`);
    portrait.style.setProperty('--glow-x', `${x * 100}%`);
    portrait.style.setProperty('--glow-y', `${y * 100}%`);
  });
  portrait.addEventListener('pointerleave', () => {
    hovering = false;
    portrait.style.removeProperty('--tilt-x');
    portrait.style.removeProperty('--tilt-y');
    updatePortrait();
  });
  portrait.addEventListener('click', () => {
    pinned = !pinned;
    updatePortrait();
  });
  portrait.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      portrait.click();
    } else if (event.key === 'Escape') {
      pinned = hovering = false;
      updatePortrait();
    }
  });
  portrait.addEventListener('blur', () => {
    pinned = false;
    updatePortrait();
  });
}

// Match CV topics by specificity so a named institution or project beats a generic word.
function answerPortfolioQuestion(question) {
  const normalize = text => text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+# ]/g, ' ').replace(/\s+/g, ' ').trim();
  const q = normalize(question);
  const padded = ` ${q} `;
  const has = phrase => padded.includes(` ${normalize(phrase)} `);
  const find = id => portfolioKnowledge.find(topic => topic.id === id);
  // Explicit publication questions should include the current manuscript statuses and citation limits.
  if (['publication', 'publications', 'paper', 'papers', 'published', 'journal', 'doi', 'submission', 'manuscript', 'manuscripts', 'lightweight', 'guava', 'ensembling', 'soumission', 'manuscrit', 'manuscrits', 'goyavier', 'article', 'articles'].some(has)) return find('publications');
  if (['programming languages', 'technical skills', 'tech stack', 'technology stack', 'langages de programmation', 'competences techniques'].some(has)) return find('skills');
  if (['graduate', 'graduation', 'finish his degree', 'expected completion'].some(has)) return find('education');
  if (['all projects', 'list projects', 'list his projects', 'what is he building', 'what has he built', 'quels sont ses projets', 'tous les projets'].some(has)) return find('projects');
  if (['research experience', 'research background', 'research work', 'his research', 'your research', 'ses recherches', 'sa recherche'].some(has)
      && !['panjab', 'punjab', 'gan', 'gans', 'low light', 'fpga'].some(has)) return find('research');
  const ranked = portfolioKnowledge.map((topic, index) => {
    const matches = topic.words.filter(has);
    const score = matches.reduce((best, word) => Math.max(best, normalize(word).length), 0);
    const general = ['education', 'skills', 'projects', 'research', 'experience', 'about'].includes(topic.id);
    return { topic, score: general ? score / 100 : score, index };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.index - b.index);
  // “Avneep” and “about” identify the subject, rather than the requested topic.
  const specific = ranked.filter(item => item.topic.id !== 'about');
  if (specific.length) return specific[0].topic;
  if (/\b(hi|hello|hey|quack|honk|bonjour|salut)\b/.test(q)) return { text: 'Hello! I’m Dottie, your portfolio guide. Ask about Avneep’s research, publications, projects, education, experience, or skills.', textFr: 'Bonjour ! Je suis Dottie, votre guide du portfolio. Posez-moi vos questions sur la recherche, les publications, les projets, les études, le parcours ou les compétences d’Avneep.' };
  if (/\b(thanks|thank|bye|merci|aurevoir)\b/.test(q)) return { text: 'Happy to help. Enjoy exploring the portfolio!', textFr: 'Avec plaisir. Bonne découverte du portfolio !' };
  if (/\b(duck|goose|dottie|oie|canard|cane)\b/.test(q)) return { text: 'I’m Dottie the duck, your guide to Avneep’s CV and portfolio.', textFr: 'Je suis Dottie la cane, votre guide du CV et du portfolio d’Avneep.' };
  if (/^(who is avneep( singh)?|tell me about avneep( singh)?|about avneep( singh)?|introduce avneep|summary|who is he|qui est avneep( singh)?|presente avneep)$/.test(q)) return find('about');
  return { text: 'I don’t have that detail in Avneep’s CV or portfolio, so I wouldn’t want to guess! Try his research, publications, projects, education, skills, mentoring, certifications, test scores, languages, or community activities.', textFr: 'Ce détail ne figure pas dans le CV ni dans le portfolio d’Avneep. Je préfère ne pas deviner. Je peux vous renseigner sur ses recherches, manuscrits, projets, études, compétences, mentorat, certifications, résultats aux tests, langues ou activités communautaires.', section: 'contact' };
}

const duckCompanion = document.querySelector('.duck-companion');
if (duckCompanion) {
  const launcher = duckCompanion.querySelector('.duck-launcher');
  const panel = duckCompanion.querySelector('.duck-chat');
  const input = duckCompanion.querySelector('input');
  const messages = duckCompanion.querySelector('.duck-messages');
  const setChatOpen = open => {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    duckCompanion.classList.toggle('is-chatting', open);
    if (open) input.focus({ preventScroll: true });
    else launcher.focus({ preventScroll: true });
  };
  launcher.addEventListener('click', () => {
    setChatOpen(panel.hidden);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      launcher.querySelector('svg').animate([
        { transform: 'translateY(0) rotate(0)' },
        { transform: 'translateY(-9px) rotate(-5deg)', offset: .45 },
        { transform: 'translateY(0) rotate(0)' }
      ], { duration: 550, easing: 'ease-out' });
    }
  });
  duckCompanion.querySelector('.duck-close').addEventListener('click', () => setChatOpen(false));
  duckCompanion.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.stopPropagation(); setChatOpen(false); }
  });
  function addMessage(text, isUser = false, section, textFr) {
    const message = document.createElement('p');
    message.className = `duck-message${isUser ? ' is-user' : ''}`;
    const content = document.createElement('span');
    if (!isUser) {
      content.dataset.messageEn = text;
      content.dataset.messageFr = textFr || text;
    }
    content.textContent = !isUser && portfolioLanguage.current === 'fr' ? textFr || text : text;
    message.append(content);
    if (section) {
      const link = document.createElement('a');
      link.href = `#${section}`;
      link.dataset.sectionLink = section;
      link.textContent = portfolioLanguage.sectionLink(section);
      link.addEventListener('click', () => {
        setChatOpen(false);
        const destination = document.getElementById(section);
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
      });
      message.append(link);
    }
    messages.append(message);
    // Keep a long conversation from growing the page indefinitely.
    while (messages.children.length > 60) messages.firstElementChild.remove();
    messages.scrollTop = messages.scrollHeight;
  }
  function askDottie(question) {
    const text = question.trim().slice(0, 400);
    if (!text) return;
    addMessage(text, true);
    const answer = answerPortfolioQuestion(text);
    addMessage(answer.text, false, answer.section, answer.textFr);
    input.value = '';
  }
  duckCompanion.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    askDottie(input.value);
  });
  duckCompanion.querySelectorAll('.duck-prompts button').forEach(button => {
    button.addEventListener('click', () => askDottie(button.textContent));
  });
}

// A stable toggle keeps the full archive close by without a long wall of cards.
const projectsToggle = document.querySelector('.projects-toggle');
const moreProjects = document.querySelector('#more-projects');
if (projectsToggle && moreProjects) {
  let disclosureAnimation;
  projectsToggle.addEventListener('click', () => {
    const opening = projectsToggle.getAttribute('aria-expanded') !== 'true';
    const currentHeight = moreProjects.getBoundingClientRect().height;
    if (disclosureAnimation) disclosureAnimation.cancel();
    projectsToggle.setAttribute('aria-expanded', String(opening));
    projectsToggle.querySelector('.projects-toggle-label').textContent = portfolioLanguage.text(opening ? 'Fewer projects' : 'More projects');
    projectsToggle.querySelector('.projects-toggle-count').textContent = opening ? '−7' : '+7';
    moreProjects.hidden = false;
    moreProjects.inert = !opening;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !moreProjects.animate) {
      moreProjects.hidden = !opening;
      return;
    }
    disclosureAnimation = moreProjects.animate([
      { height: `${currentHeight}px`, opacity: opening ? 0 : 1, overflow: 'clip' },
      { height: opening ? `${moreProjects.scrollHeight}px` : '0px', opacity: opening ? 1 : 0, overflow: 'clip' }
    ], { duration: opening ? 460 : 280, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    if (opening) {
      moreProjects.querySelectorAll('.project-card').forEach((card, index) => {
        card.getAnimations().forEach(animation => animation.cancel());
        card.animate([
          { opacity: 0, transform: 'translateY(16px) scale(.97)' },
          { opacity: 1, transform: 'translateY(-2px) scale(1.005)', offset: .8 },
          { opacity: 1, transform: 'none' }
        ], { duration: 420, delay: index * 45, fill: 'backwards', easing: 'ease-out' });
      });
    }
    disclosureAnimation.onfinish = () => { moreProjects.hidden = !opening; };
  });
}
