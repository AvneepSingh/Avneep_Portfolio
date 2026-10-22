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
