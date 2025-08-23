document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll(".js-image-text-block");
    blocks.forEach((block) => {
        if (!(block instanceof HTMLElement)) return;
        animateImageTextBlock(block);
    });
});

function animateImageTextBlock(block) {
    const imageFigure = block.querySelector("figure");
    const image = imageFigure?.querySelector("img");
    const text = block.querySelector("article"); // keep your selector

    const lead = text?.querySelector("p.font-mono");
    const heading = text?.querySelector("h2");
    const prose = text?.querySelector(".prose");
    const button = text?.querySelector("a");

    const isImageLeft = imageFigure?.classList.contains("order-first");

    // Smaller offsets so it resolves quicker
    if (image) {
        gsap.set(image, {
            opacity: 0,
            scale: 1.04,
            x: isImageLeft ? -40 : 40,
        });
    }

    const textEls = [lead, heading, prose, button].filter(Boolean);
    if (textEls.length > 0) {
        gsap.set(textEls, { opacity: 0, y: 24 });
    }

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: block,
            start: "top 80%",
            toggleActions: "play none none none", // compatible everywhere
            // once: true, // uncomment only if your GSAP supports it and you want one-shot
        },
    });

    if (image) {
        tl.to(image, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.6, // was 1.4
            ease: "power2.out",
        });
    }

    // Overlap and shorten the text reveals
    addFadeUp(tl, lead, 0.3, image ? "-=0.30" : "0");
    addFadeUp(tl, heading, 0.26, "-=0.20");
    addFadeUp(tl, prose, 0.22, "-=0.18");
    addFadeUp(tl, button, 0.2, "-=0.16", "back.out(1.4)");

    // Subtle, quicker parallax (optional)
    if (image) {
        gsap.to(image, {
            y: -24, // was -40
            ease: "none",
            scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.2, // quicker response than true
            },
        });
    }
}

function addFadeUp(tl, el, duration, position, ease = "power2.out") {
    if (!(el instanceof HTMLElement)) return;
    tl.to(el, { opacity: 1, y: 0, duration, ease }, position);
}
