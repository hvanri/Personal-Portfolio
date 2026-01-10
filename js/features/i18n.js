let currentLang = localStorage.getItem('lang') || 'vi';

export function initI18n() {
    applyLang(currentLang);
}

export function toggleLanguage() {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('lang', currentLang);
    applyLang(currentLang);
}

function applyLang(lang) {
    const toggleBtn = document.querySelector('.lang-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = lang === 'vi' ? 'EN' : 'VI';
    }
    document.querySelectorAll('[data-vi][data-en]').forEach(el => {
        el.innerHTML = el.dataset[lang];
    });
}
