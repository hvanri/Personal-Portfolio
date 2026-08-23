// Signature — the flute silhouette in the hero's current-signal panel.
// Click discloses a short editorial note. Hover/focus is handled entirely in CSS.

export function initSignature() {
    const root = document.querySelector('[data-signature]');
    if (!root) {
        return;
    }

    const trigger = root.querySelector('.signature-trigger');
    const note = root.querySelector('.signature-note');

    if (!trigger || !note) {
        return;
    }

    trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        note.hidden = isOpen;
        root.classList.toggle('is-open', !isOpen);
    });
}
