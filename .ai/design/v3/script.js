/* ===========================================
   SCRIPT.JS - Interactive Functionality
   ===========================================
   
   Contents:
   1. Theme Toggle System - Dark/light mode with localStorage
   2. Language Selector - Placeholder for i18n
   3. Smooth Scrolling - Anchor links with offset
   4. Collapsible Work Cards - Expand/collapse functionality
   
   Dependencies:
   - Uses data-theme attribute on body element
   - Relies on .is-expanded class for card state
   - BEM class naming: .work-item, .work-item__link
   
   =========================================== */

/* ===== 1. Theme Toggle System ===== */
/* 
   How it works:
   - Toggles body[data-theme] between "light" and "dark"
   - Persists preference in localStorage
   - CSS automatically updates via [data-theme="dark"] selectors
   - Initializes on page load from saved preference or defaults to light
*/
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Load saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.dataset.theme = currentTheme;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    // Toggle between dark and light
    const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  });
}

/* ===== 2. Language Selection ===== */
/* 
   Placeholder for internationalization (i18n)
   Future implementation would:
   - Load translation JSON files
   - Update content dynamically
   - Persist language preference
*/
const languageSelect = document.querySelector('.language-select');
if (languageSelect) {
  languageSelect.addEventListener('change', e => {
    console.log('Language changed to:', e.target.value);
    // TODO: Implement content translation
    // Ideas: Fetch JSON translations, update DOM, save to localStorage
  });
}

/* ===== 3. Smooth Scrolling ===== */
/* 
   Handles anchor links (#section-id) with smooth scrolling
   - Prevents default jump behavior
   - Scrolls with offset (80px) for fixed headers
   - Uses native smooth scroll behavior
*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // Account for fixed header/nav
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  });
});

/* ===== 4. Collapsible Work Item Cards ===== */
/* 
   Interaction Pattern:
   - Click anywhere on card to expand/collapse
   - External links only work when card is expanded
   - Clicking link in collapsed state expands instead of navigating
   
   States:
   - Collapsed (default): Shows type, title, footer (icon+count, link button)
   - Expanded (.is-expanded): Shows type, title, description, tags
   
   CSS handles visual transitions:
   - .work-item__footer: opacity 0, hidden when expanded
   - .work-item__description: max-height/opacity transition when expanded
   - .work-item__tags: display flex when expanded
*/
const workItemCards = document.querySelectorAll('.work-item');

workItemCards.forEach(card => {
  card.addEventListener('click', function (e) {
    // If card is expanded and user clicks the link, allow navigation
    if (e.target.closest('.work-item__link') && this.classList.contains('is-expanded')) {
      return; // Let the link work normally
    }

    // If clicking link while collapsed, prevent navigation and expand instead
    if (e.target.closest('.work-item__link')) {
      e.preventDefault();
    }

    // Toggle the expanded state (.is-expanded class)
    this.classList.toggle('is-expanded');
  });

  // Additional handler: Prevent link navigation when card is collapsed
  const workItemLink = card.querySelector('.work-item__link');
  if (workItemLink) {
    workItemLink.addEventListener('click', function (e) {
      if (!card.classList.contains('is-expanded')) {
        e.preventDefault(); // Block navigation
      }
    });
  }
});
