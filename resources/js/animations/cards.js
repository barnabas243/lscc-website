import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate a single card with GSAP + ScrollTrigger
 * @param {HTMLElement} card
 * @param {number} delay
 */
function animateCard(card, delay = 0) {
    gsap.set(card, {
        opacity: 0,
        y: 100,
        scale: 0.96,
    });

    gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        delay,
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none", // one-time animation
        },
    });
}

function initScrollRevealCards() {
    const cards = document.querySelectorAll(".js-card");

    if (!cards.length) return;

    cards.forEach((card, i) => {
        if (card instanceof HTMLElement) {
            animateCard(card, i * 0.05); // subtle stagger effect
        }
    });
}

if (document.readyState !== "loading") {
    initScrollRevealCards();
} else {
    document.addEventListener("DOMContentLoaded", initScrollRevealCards);
}
