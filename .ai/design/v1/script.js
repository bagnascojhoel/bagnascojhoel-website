// Mobile navigation toggle
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');

navToggle.addEventListener('click', () => {
  navList.classList.toggle('is-active');
});

// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
});

// Language selection (placeholder - no actual translation implemented)
const languageSelect = document.querySelector('.language-select');
languageSelect.addEventListener('change', e => {
  console.log('Language changed to:', e.target.value);
  // In a real implementation, reload content or use i18n library
});
