import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll(".js-image-text-block");

    blocks.forEach((block) => {
        if (!(block instanceof HTMLElement)) return;

        animateImageTextBlock(block);
    });
});

/**
 * Animate an image-text content block with scroll-triggered animations.
 * @param {HTMLElement} block
 */
function animateImageTextBlock(block) {
    const imageFigure = block.querySelector("figure");
    const image = imageFigure?.querySelector("img");
    const text = block.querySelector("article");

    const lead = text?.querySelector("p.font-mono");
    const heading = text?.querySelector("h2");
    const prose = text?.querySelector(".prose");
    const button = text?.querySelector("a");

    const isImageLeft = imageFigure?.classList.contains("order-first");

    if (image) {
        gsap.set(image, {
            opacity: 0,
            scale: 1.1,
            x: isImageLeft ? -100 : 100,
        });
    }

    const textEls = [lead, heading, prose, button].filter(Boolean);
    if (textEls.length > 0) {
        gsap.set(textEls, { opacity: 0, y: 50 });
    }

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: block,
            start: "top 80%",
            toggleActions: "play none none none",
        },
    });

    if (image) {
        tl.to(image, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1.4,
            ease: "power3.out",
        });
    }

    addFadeUp(tl, lead, 0.5, "-=1");
    addFadeUp(tl, heading, 0.4, "-=0.4");
    addFadeUp(tl, prose, 0.3, "-=0.4");
    addFadeUp(tl, button, 0.2, "-=0.3", "back.out(1.7)");

    // 🌀 Parallax image scroll
    if (image) {
        gsap.to(image, {
            y: -40,
            ease: "none",
            scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    }
}

/**
 * Fade-up animation helper for timeline items
 * @param {gsap.core.Timeline} tl
 * @param {Element | null} el
 * @param {number} duration
 * @param {string} position
 * @param {string} [ease="power2.out"]
 */
function addFadeUp(tl, el, duration, position, ease = "power2.out") {
    if (!(el instanceof HTMLElement)) return;

    tl.to(
        el,
        {
            opacity: 1,
            y: 0,
            duration,
            ease,
        },
        position,
    );
}
