const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const toggle = document.querySelector('.theme-toggle');
const labelToggle = () => {
  toggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
};
labelToggle();
toggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  labelToggle();
});

const route = document.querySelector('.route__list');
if (!reduceMotion && 'IntersectionObserver' in window) {
  route.classList.add('is-pending');
  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    route.classList.remove('is-pending');
    observer.disconnect();
  }, { threshold: 0.35 }).observe(route);
}

const track = document.querySelector('.reviews__track');
const [prev, next] = document.querySelectorAll('[data-dir]');
const syncArrows = () => {
  prev.disabled = track.scrollLeft < 4;
  next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
};
[prev, next].forEach((btn) => btn.addEventListener('click', () => {
  track.scrollBy({ left: btn.dataset.dir * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
}));
track.addEventListener('scroll', syncArrows, { passive: true });
addEventListener('resize', syncArrows);
syncArrows();

// ponytail: форма никуда не отправляет — подключить к CRM/Telegram, когда появится канал заявок
const form = document.querySelector('.form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.reset();
  form.querySelector('.form__status').textContent = 'Спасибо! Заявка принята — менеджер скоро свяжется с вами.';
});
