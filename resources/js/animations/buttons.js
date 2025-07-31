import gsap from "gsap";

/**
 * Animate a single button with interactive GSAP effects
 * @param {HTMLElement} btn
 */
function setupAnimatedButton(btn) {
    const clearAnimations = () => gsap.killTweensOf(btn);

    const animate = (options) => {
        clearAnimations();
        gsap.to(btn, options);
    };

    const enter = () =>
        animate({
            scale: 1.06,
            y: -2,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            duration: 0.2,
            ease: "power3.out",
        });

    const leave = () =>
        animate({
            scale: 1,
            y: 0,
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.15,
            ease: "power2.out",
        });

    const press = () =>
        animate({
            scale: 0.95,
            y: 0,
            duration: 0.1,
            ease: "power2.inOut",
        });

    const release = () =>
        animate({
            scale: 1,
            y: -2,
            duration: 0.3,
            ease: "elastic.out(1, 0.5)",
        });

    const reset = () =>
        animate({
            scale: 1,
            y: 0,
            boxShadow: "none",
            duration: 0.15,
            ease: "power2.out",
        });

    btn.addEventListener("mouseenter", enter);
    btn.addEventListener("mouseleave", leave);
    btn.addEventListener("pointerdown", press);
    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointerleave", reset);
}

function initAnimatedButtons() {
    const buttons = document.querySelectorAll(".js-animated-button");

    if (!buttons.length) return;

    buttons.forEach((btn) => {
        if (btn instanceof HTMLElement) {
            setupAnimatedButton(btn);
        }
    });
}

document.addEventListener("DOMContentLoaded", initAnimatedButtons);
