// Work chapters — a page-turn reveal for the "02 / WORK" section.
// Progressive enhancement: without JS (or without IntersectionObserver) the
// chapters render fully visible, because `.js-chapters` is never applied.

const BELT_SPEED = 34; // px per second — slow enough to read, fast enough to feel alive

// Grow the track to `2 × groupWidth` so a -50% translate loops seamlessly,
// where one group is wide enough to cover the visible belt.
function buildBelt(belt, baseHTML) {
    const track = belt.querySelector('.belt-track');
    if (!track) return;

    belt.classList.remove('is-running', 'is-static');
    track.style.removeProperty('animation');
    track.innerHTML = baseHTML;

    const beltWidth = belt.getBoundingClientRect().width;
    const setWidth = track.getBoundingClientRect().width;
    if (!beltWidth || !setWidth) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        belt.classList.add('is-static');
        return;
    }

    const base = Array.from(track.children);
    const copies = Math.max(1, Math.ceil(beltWidth / setWidth));

    for (let i = 1; i < copies; i += 1) {
        base.forEach((node) => track.appendChild(node.cloneNode(true)));
    }

    // Duplicate the whole group once — the second half is what the loop scrolls into.
    Array.from(track.children).forEach((node) => track.appendChild(node.cloneNode(true)));

    // Everything past the original set is decorative repetition.
    Array.from(track.children).slice(base.length).forEach((node) => {
        node.setAttribute('aria-hidden', 'true');
    });

    const groupWidth = setWidth * copies;
    belt.style.setProperty('--belt-duration', `${Math.round(groupWidth / BELT_SPEED)}s`);
    belt.classList.add('is-running');
}

function initBelts(section) {
    const belts = Array.from(section.querySelectorAll('[data-belt]'));
    if (!belts.length) return;

    const originals = new Map();
    belts.forEach((belt) => {
        const track = belt.querySelector('.belt-track');
        if (track) originals.set(belt, track.innerHTML);
    });

    const build = () => belts.forEach((belt) => buildBelt(belt, originals.get(belt)));

    // Images affect track width, so rebuild once they have decoded.
    const images = Array.from(section.querySelectorAll('.belt-item img'));
    const pending = images.filter((img) => !img.complete);
    let remaining = pending.length;

    build();

    pending.forEach((img) => {
        const done = () => {
            remaining -= 1;
            if (remaining <= 0) build();
        };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
    });

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(build, 200);
    });
}

export function initWorkChapters() {
    const section = document.querySelector('.work-chapters');
    if (!section) {
        return;
    }

    initBelts(section);

    const chapters = Array.from(section.querySelectorAll('.chapter'));
    if (!chapters.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
        return;
    }

    document.body.classList.add('js-chapters');

    const turn = (chapter) => chapter.classList.add('is-turned');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            turn(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.15
    });

    chapters.forEach((chapter) => {
        // Anything already on screen at init reveals immediately — no waiting
        // on a scroll that may never come.
        if (chapter.getBoundingClientRect().top < window.innerHeight) {
            turn(chapter);
            return;
        }
        observer.observe(chapter);
    });

    // Failsafe: a reveal must never be the reason content stays invisible.
    window.setTimeout(() => {
        chapters.forEach(turn);
        observer.disconnect();
    }, 3000);
}
