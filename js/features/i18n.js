import translations from '../translations.js';

const hasExplicitLang = localStorage.getItem('langSetByUser') === 'true';
const savedLang = localStorage.getItem('lang');
let currentLang = hasExplicitLang && (savedLang === 'vi' || savedLang === 'en') ? savedLang : 'en';

export function initI18n() {
    applyLang(currentLang);
}

export function toggleLanguage() {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('lang', currentLang);
    localStorage.setItem('langSetByUser', 'true');
    applyLang(currentLang);
}

function applyLang(lang) {
    const toggleBtn = document.querySelector('.lang-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = lang === 'vi' ? 'EN' : 'VI';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const translation = translations[lang]?.[key];
        if (translation != null) {
            el.innerHTML = translation;
        }
    });

    document.querySelectorAll('[data-vi][data-en]').forEach(el => {
        el.innerHTML = el.dataset[lang];
    });
}
