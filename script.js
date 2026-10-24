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
    portrait.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} portrait of Avneep Singh`);
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
  if (['publication', 'publications', 'paper', 'papers', 'published', 'journal', 'doi', 'submission', 'manuscript', 'manuscripts', 'lightweight', 'guava', 'ensembling'].some(has)) return find('publications');
  if (['programming languages', 'technical skills', 'tech stack', 'technology stack'].some(has)) return find('skills');
  if (['graduate', 'graduation', 'finish his degree', 'expected completion'].some(has)) return find('education');
  if (['all projects', 'list projects', 'list his projects', 'what is he building', 'what has he built'].some(has)) return find('projects');
  if (['research experience', 'research background', 'research work', 'his research', 'your research'].some(has)
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
  if (/\b(hi|hello|hey|quack)\b/.test(q)) return { text: 'Hello hello! ♡ I’m Dottie, Avneep’s little duck guide. Ask about his research, publications, projects, education, experience, skills, or achievements.' };
  if (/\b(thanks|thank|bye)\b/.test(q)) return { text: 'Happy to help! A little quack for your day. ♡' };
  if (/\b(duck|dottie)\b/.test(q)) return { text: 'I’m Dottie! I waddle around this corner and answer questions using Avneep’s CV and portfolio. ♡' };
  if (/^(who is avneep( singh)?|tell me about avneep( singh)?|about avneep( singh)?|introduce avneep|summary|who is he)$/.test(q)) return find('about');
  return { text: 'I don’t have that detail in Avneep’s CV or portfolio, so I wouldn’t want to guess! Try his research, publications, projects, education, skills, mentoring, certifications, test scores, languages, or community activities.', section: 'contact' };
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
  launcher.addEventListener('click', () => setChatOpen(panel.hidden));
  duckCompanion.querySelector('.duck-close').addEventListener('click', () => setChatOpen(false));
  duckCompanion.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.stopPropagation(); setChatOpen(false); }
  });
  function addMessage(text, isUser = false, section) {
    const message = document.createElement('p');
    message.className = `duck-message${isUser ? ' is-user' : ''}`;
    message.textContent = text;
    if (section) {
      const link = document.createElement('a');
      link.href = `#${section}`;
      link.textContent = `Visit ${section} ↗`;
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
    addMessage(answer.text, false, answer.section);
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
