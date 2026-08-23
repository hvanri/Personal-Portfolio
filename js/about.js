// =====================================================
// About Page Animations
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    initJourneyRoad();
    initMilestones();
    initCurrentSection();
    initFocusDashboard();
    initParallax();

});

// =====================================================
// Draw SVG Road
// =====================================================

function initJourneyRoad() {

    const path = document.querySelector(".journey-road path");

    if (!path) return;

    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    const journey = document.querySelector(".journey");

    if (!journey) return;

    const draw = () => {

        path.style.transition = "stroke-dashoffset 2.5s ease";

        path.style.strokeDashoffset = 0;

    };

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            draw();

            observer.disconnect();

        });

    }, {

        // The journey is far taller than any viewport, so a ratio threshold
        // (e.g. .25) can never be satisfied and the road would never draw.
        // Fire on entry instead — height-independent.

        threshold: 0,

        rootMargin: "0px 0px -10% 0px"

    });

    observer.observe(journey);

    // Failsafe: never let a missed observer leave the road undrawn.

    setTimeout(() => {

        if (path.style.strokeDashoffset !== "0px" && path.style.strokeDashoffset !== "0") {

            const box = journey.getBoundingClientRect();

            if (box.top < window.innerHeight && box.bottom > 0) {

                draw();

                observer.disconnect();

            }

        }

    }, 3000);

}

// =====================================================
// Timeline Animation
// =====================================================

function initMilestones() {

    const milestones = Array.from(document.querySelectorAll(".milestone"));

    if (!milestones.length) return;

    const reveal = target => {

        target.classList.add("show");

        const dot = target.querySelector(".dot");

        if (dot) {

            dot.classList.add("active");

        }

    };

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            reveal(entry.target);

            observer.unobserve(entry.target);

        });

    }, {

        // Height-independent: a tall milestone (the 2026 card carries a large
        // image) can't reliably reach a ratio threshold on short viewports.

        threshold: 0,

        rootMargin: "0px 0px -18% 0px"

    });

    milestones.forEach(item => {

        if (item.getBoundingClientRect().top < window.innerHeight) {

            reveal(item);

            return;

        }

        observer.observe(item);

    });

    // Failsafe: a reveal must never be the reason content stays invisible.

    setTimeout(() => {

        milestones.forEach(reveal);

        observer.disconnect();

    }, 4000);

}

// =====================================================
// Active Current Card
// =====================================================

function initCurrentSection() {

    const cards = document.querySelectorAll(".card");

    window.addEventListener("scroll", () => {

        cards.forEach(card => {

            const rect = card.getBoundingClientRect();

            const middle = window.innerHeight * .55;

            if (rect.top < middle && rect.bottom > middle) {

                card.classList.add("focused");

            } else {

                card.classList.remove("focused");

            }

        });

    });

}

// =====================================================
// Parallax
// =====================================================

// function initParallax() {

//     const images = document.querySelectorAll(".milestone img");

//     window.addEventListener("scroll", () => {

//         const scroll = window.scrollY;

//         images.forEach(image => {

//             const speed = .08;

//             image.style.transform = `translateY(${scroll * speed}px)`;

//         });

//     });

// }
function initFocusDashboard() {

    const items = Array.from(document.querySelectorAll(".focus-item"));
    const panels = Array.from(document.querySelectorAll(".focus-panel"));

    if (!items.length || !panels.length) return;

    function activateFocus(name, moveFocus = false) {

        items.forEach(item => {
            const active = item.dataset.focus === name;

            item.classList.toggle("is-active", active);
            item.setAttribute("aria-selected", active ? "true" : "false");

            if (active && moveFocus) {
                item.focus();
            }
        });

        panels.forEach(panel => {
            const active = panel.dataset.panel === name;

            panel.classList.toggle("is-active", active);
            panel.hidden = !active;
        });
    }

    items.forEach((item, index) => {

        item.addEventListener("click", () => {
            activateFocus(item.dataset.focus);
        });

        item.addEventListener("keydown", event => {

            let nextIndex = index;

            if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                nextIndex = (index + 1) % items.length;
            }

            if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                nextIndex = (index - 1 + items.length) % items.length;
            }

            if (nextIndex === index) return;

            event.preventDefault();

            const next = items[nextIndex];

            activateFocus(next.dataset.focus, true);
        });
    });

    // Respect the current visual state after language/theme changes.
    const active = items.find(item => item.classList.contains("is-active"));

    if (active) {
        activateFocus(active.dataset.focus);
    }
}

function initParallax() {

    const images = document.querySelectorAll(".milestone img");

    function update() {

        images.forEach(image => {

            const rect = image.getBoundingClientRect();

            const center = window.innerHeight / 2;

            const distance = rect.top - center;

            image.style.transform =
                `translateY(${distance * 0.05}px)`;

        });

    }

    window.addEventListener("scroll", update);

    update();

}
