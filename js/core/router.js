export function initTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.origin !== location.origin) return;

        link.addEventListener('click', e => {
            e.preventDefault();
            document.body.classList.add('page-transitioning');
            setTimeout(() => location.href = link.href, 300);
        });
    });
}
