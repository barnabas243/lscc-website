const PREFERS_REDUCED =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function initScrollRevealCards() {
    const cards = gsap.utils.toArray(".js-card");
    if (!cards.length) return;

    gsap.set(cards, {
        autoAlpha: 0,
        y: 24,
        scale: 0.98,
        willChange: "transform, opacity",
    });

    if (PREFERS_REDUCED) {
        gsap.set(cards, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            clearProps: "willChange",
        });
        return;
    }

    ScrollTrigger.batch(cards, {
        start: "top 85%",
        once: true,
        onEnter: (batch) => {
            gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                ease: "power2.out",
                stagger: 0.06,
                overwrite: true,
                onComplete: () => gsap.set(batch, { clearProps: "willChange" }),
            });
        },
    });

    // Ensure layout recalcs keep things accurate on resize/refresh
    ScrollTrigger.addEventListener("refreshInit", () =>
        gsap.set(cards, { willChange: "transform, opacity" }),
    );
    ScrollTrigger.addEventListener("refresh", () =>
        gsap.set(cards, { clearProps: "willChange" }),
    );
}

if (document.readyState !== "loading") initScrollRevealCards();
else document.addEventListener("DOMContentLoaded", initScrollRevealCards);
