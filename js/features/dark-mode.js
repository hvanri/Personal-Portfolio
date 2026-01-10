export function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
}

export function toggleDarkMode() {
    const enabled = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', enabled);
}
