import translations from '../translations.js';
import { availabilityConfig } from '../config/availability.js';

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

    renderAvailability(lang);
}

function renderAvailability(lang) {
    const container = document.querySelector('#hero-availability');
    if (!container) return;

    const t = translations[lang] || translations.en;
    const companyName = escapeHtml(availabilityConfig.companyName);
    const companyUrl = escapeAttribute(availabilityConfig.companyUrl);
    const company = companyUrl
        ? `<a href="${companyUrl}" target="_blank" rel="noopener noreferrer">${companyName}</a>`
        : companyName;
    const items = [
        {
            icon: '🟢',
            text: t['home.availability.fullTime'].replace('{company}', company)
        },
        {
            icon: '📍',
            text: t['home.availability.location']
        }
    ];

    if (availabilityConfig.showInterestingOpportunities) {
        items.push({
            icon: '💬',
            text: t['home.availability.opportunities']
        });
    }

    container.innerHTML = items
        .map((item) => `<p><span aria-hidden="true">${item.icon}</span>${item.text}</p>`)
        .join('');
}

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(value = '') {
    return escapeHtml(value).replace(/`/g, '&#96;');
}
