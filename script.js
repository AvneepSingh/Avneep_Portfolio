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

// Dottie's knowledge stays grounded in the public portfolio, without a server or API key.
function answerPortfolioQuestion(question) {
  const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+# ]/g, ' ');
  const topics = [
    { words: ['evidencelens', 'rag', 'retrieval', 'documents', 'document'], text: 'EvidenceLens is Avneep’s ongoing project exploring question answering across documents, using retrieval and source attribution to make answers verifiable. It uses Python, RAG, vector search, and Docker.', section: 'projects' },
    { words: ['3d', 'generative', 'multiview'], text: 'Avneep experiments with pretrained generative models, multiview synthesis, and workflows that turn text concepts into 3D assets. A little imagination, a lot of exploration! ✦', section: 'projects' },
    { words: ['vision', 'pytorch', 'transformers', 'convolutional'], text: 'His computer vision experiments explore deep learning architectures, visual representations, and combining convolutional processing with attention, using PyTorch and Transformers.', section: 'projects' },
    { words: ['task', 'management', 'stakeholder'], text: 'Avneep worked on a Task Management Platform built around stakeholder needs, including interface design, workflow improvements, testing, documentation, and product demonstrations.', section: 'projects' },
    { words: ['hobby', 'hobbies', 'fun', 'outside', 'photography', 'languages', 'free time'], text: 'Away from code, Avneep enjoys learning languages, photography, and turning interesting ideas into tangible things. I personally enjoy a good waddle. ♡', section: 'about' },
    { words: ['study', 'studies', 'education', 'degree', 'university', 'concordia', 'college', 'masters', 'master', 'btech', 'guwahati', 'qualifications'], text: 'Avneep is a Master of Applied Computer Science student at Concordia University in Montréal (2026–present). He previously completed his B.Tech in Computer Science & Engineering at IIIT Guwahati.', section: 'experience' },
    { words: ['experience', 'work history', 'worked', 'intern', 'internship', 'covalience', 'job', 'career', 'teaching', 'tutor', 'kigen'], text: 'He is a Teaching Assistant at Concordia University (2026–present) and an Academic Tutor at Kigen Academy (2025–present). He was a Software Development Intern at Covalience India from December 2023 to June 2024.', section: 'experience' },
    { words: ['project', 'projects', 'building', 'built', 'portfolio'], text: 'His selected work includes EvidenceLens (document question answering), a Task Management Platform, Text-to-3D Exploration, and Computer Vision Experiments. Ask me about any one of them! Quack ✦', section: 'projects' },
    { words: ['skill', 'skills', 'stack', 'technologies', 'technology', 'programming', 'python', 'docker', 'code', 'coding'], text: 'His portfolio features Python, PyTorch, Transformers, RAG, vector search, Docker, and web application work. His interests connect intelligent systems, dependable software, and thoughtful design.', section: 'projects' },
    { words: ['research', 'interest', 'interests', 'ai', 'machine learning'], text: 'Avneep is interested in trustworthy AI, learning systems, and human-centred software. He explores grounded answers, model representations and evaluation, and simple interfaces for complex systems.', section: 'research' },
    { words: ['where', 'location', 'based', 'live', 'lives', 'montreal', 'canada'], text: 'Avneep is based in Montréal, Québec, Canada, where he studies at Concordia University.', section: 'about' },
    { words: ['contact', 'email', 'linkedin', 'connect', 'hire', 'hiring', 'available', 'availability', 'resume', 'cv'], text: 'You can connect with Avneep through LinkedIn using the contact section. His portfolio doesn’t list an email, downloadable résumé, or current hiring availability, so it’s best to ask him directly.', section: 'contact' },
    { words: ['github', 'repository', 'repositories', 'source'], text: 'Individual repositories and write-ups will be linked on the portfolio as they become public. For now, you can explore the project summaries.', section: 'projects' },
    { words: ['who', 'about', 'introduce', 'summary', 'avneep'], text: 'Avneep Singh is a computer science graduate student, developer, and researcher based in Montréal. He enjoys building useful things and exploring intelligent systems, software, and thoughtful design.', section: 'about' }
  ];
  // Whole words keep short terms such as “AI” from matching “email”.
  const padded = ` ${q.replace(/\s+/g, ' ').trim()} `;
  const match = topics.find(topic => topic.words.some(word => padded.includes(` ${word} `)));
  if (match) return match;
  if (/\b(hi|hello|hey|quack)\b/.test(q)) return { text: 'Hello hello! ♡ I’m Dottie, Avneep’s little duck guide. What would you like to know about his studies, projects, or interests?' };
  if (/\b(thanks|thank|bye)\b/.test(q)) return { text: 'Happy to help! A little quack for your day. ♡' };
  if (/\b(duck|dottie|you|name)\b/.test(q)) return { text: 'I’m Dottie! I waddle around this corner and answer questions from Avneep’s portfolio. Ask me what he’s building! ♡' };
  return { text: 'I don’t have that detail in Avneep’s portfolio, and I wouldn’t want to guess! I can help with his projects, education, experience, skills, location, or hobbies.', section: 'contact' };
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
