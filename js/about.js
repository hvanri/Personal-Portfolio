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

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            path.style.transition = "stroke-dashoffset 2.5s ease";

            path.style.strokeDashoffset = 0;

            observer.disconnect();

        });

    }, {

        threshold: .25

    });

    observer.observe(document.querySelector(".journey"));

}

// =====================================================
// Timeline Animation
// =====================================================

function initMilestones() {

    const milestones = document.querySelectorAll(".milestone");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");

            const dot = entry.target.querySelector(".dot");

            if (dot) {

                dot.classList.add("active");

            }

        });

    }, {

        threshold: .35

    });

    milestones.forEach(item => observer.observe(item));

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

    const cards = document.querySelectorAll('.focus-card');

    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);

        });

    }, {
        threshold: 0.2
    });

    cards.forEach(card => observer.observe(card));

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
