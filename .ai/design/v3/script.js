// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        
        // Save theme preference
        const theme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Language selection (placeholder)
const languageSelect = document.querySelector('.language-select');
if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
        console.log('Language changed to:', e.target.value);
        // In a real implementation, this would trigger content translation
    });
}

// Smooth scroll with offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Collapsible project cards
const projectCards = document.querySelectorAll('.project');

projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't toggle if clicking on the external link
        if (e.target.closest('.project__link') && this.classList.contains('is-expanded')) {
            return;
        }
        
        // Prevent link default behavior when clicking to toggle
        if (e.target.closest('.project__link')) {
            e.preventDefault();
        }
        
        // Toggle the expanded state
        this.classList.toggle('is-expanded');
    });
    
    // Prevent link navigation in collapsed state
    const projectLink = card.querySelector('.project__link');
    if (projectLink) {
        projectLink.addEventListener('click', function(e) {
            if (!card.classList.contains('is-expanded')) {
                e.preventDefault();
            }
        });
    }
});