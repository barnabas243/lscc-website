document.addEventListener("DOMContentLoaded", () => {
    const heroImage = document.querySelector(".js-hero-image");
    const heroTitle = document.querySelector(".js-hero-title");
    const heroDescription = document.querySelector(".js-hero-description");
    const heroButtons = document.querySelector(".js-hero-buttons");

    if (!(heroTitle instanceof HTMLElement)) return;

    const prefersReduced =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
        false;

    animateHeroImage(heroImage, prefersReduced);
    animateHeroText(heroTitle, heroDescription, heroButtons, prefersReduced);
});

/**
 * Animate background hero image
 * @param {Element|null} image
 * @param {boolean} prefersReduced
 */
function animateHeroImage(image, prefersReduced) {
    if (!(image instanceof HTMLElement)) return;

    // Initial state: light scale + fade (faster than filter: blur)
    gsap.set(image, {
        autoAlpha: 0,
        scale: 1.03,
        willChange: "transform, opacity",
    });

    if (prefersReduced) {
        gsap.set(image, { autoAlpha: 1, scale: 1, clearProps: "willChange" });
        return;
    }

    // Quick reveal
    gsap.to(image, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => gsap.set(image, { clearProps: "willChange" }),
    });

    // Subtle float (paused when tab hidden)
    const floatTl = gsap.to(image, {
        y: 10, // was 0↔0; add tiny drift
        duration: 6, // was 10
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        paused: false,
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) floatTl.pause();
        else floatTl.resume();
    });
}

/**
 * Animate hero title, description, and buttons
 * @param {HTMLElement} titleEl
 * @param {Element|null} descriptionEl
 * @param {Element|null} buttonsWrapper
 * @param {boolean} prefersReduced
 */
function animateHeroText(
    titleEl,
    descriptionEl,
    buttonsWrapper,
    prefersReduced,
) {
    const highlightWords = ["god", "gospel", "arise"];
    const original = titleEl.textContent ?? "";
    const parts = original.trim().split(/\s+/);

    // Rebuild innerHTML with span wrappers; keep punctuation attached
    titleEl.innerHTML = parts
        .map((word) => {
            const core = word.replace(/[^\p{L}\p{N}]+/gu, ""); // letters/numbers; keeps CJK
            const isHighlight = highlightWords.includes(core.toLowerCase());
            const cls = `hero-word${isHighlight ? " highlighted-word" : ""}`;
            return `<span class="${cls}">${escapeHtml(word)}</span>`;
        })
        .join(" ");

    const heroWords = titleEl.querySelectorAll(".hero-word");
    if (!heroWords.length) return;

    if (prefersReduced) {
        gsap.set([heroWords, descriptionEl, buttonsWrapper].filter(Boolean), {
            autoAlpha: 1,
            y: 0,
            scale: 1,
        });
        return;
    }

    const tl = gsap.timeline({ delay: 0.1 });

    gsap.set(heroWords, {
        autoAlpha: 0,
        y: 28,
        willChange: "transform, opacity",
    });
    tl.to(heroWords, {
        autoAlpha: 1,
        y: 0,
        ease: "back.out(1.4)",
        duration: 0.6,
        stagger: 0.08, // quicker
        onComplete: () => gsap.set(heroWords, { clearProps: "willChange" }),
    });

    if (
        descriptionEl instanceof HTMLElement &&
        descriptionEl.textContent.trim()
    ) {
        gsap.set(descriptionEl, {
            autoAlpha: 0,
            y: 16,
            willChange: "transform, opacity",
        });
        tl.to(
            descriptionEl,
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () =>
                    gsap.set(descriptionEl, { clearProps: "willChange" }),
            },
            "-=0.35",
        );
    }

    if (buttonsWrapper instanceof HTMLElement) {
        gsap.set(buttonsWrapper, {
            autoAlpha: 0,
            y: 16,
            scale: 0.985,
            willChange: "transform, opacity",
        });
        tl.to(
            buttonsWrapper,
            {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                ease: "power2.out",
                onComplete: () =>
                    gsap.set(buttonsWrapper, { clearProps: "willChange" }),
            },
            "-=0.30",
        );

        // Hover effects only on devices with a fine pointer (avoid on touch)
        const finePointer =
            window.matchMedia?.("(pointer: fine)").matches ?? true;
        if (finePointer) {
            const buttons = buttonsWrapper.querySelectorAll("a, button");
            buttons.forEach((btn) => {
                btn.addEventListener("mouseenter", () =>
                    gsap.to(btn, {
                        scale: 1.04,
                        duration: 0.18,
                        ease: "power2.out",
                    }),
                );
                btn.addEventListener("mouseleave", () =>
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.18,
                        ease: "power2.out",
                    }),
                );
                btn.addEventListener("pointerdown", () =>
                    gsap.to(btn, {
                        scale: 0.97,
                        duration: 0.08,
                        ease: "power2.inOut",
                    }),
                );
                btn.addEventListener("pointerup", () =>
                    gsap.to(btn, {
                        scale: 1.02,
                        duration: 0.16,
                        ease: "power2.out",
                    }),
                );
                btn.addEventListener("blur", () =>
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.12,
                        ease: "power2.out",
                    }),
                );
            });
        }
    }
}

// Simple HTML escaper since we rebuild innerHTML from textContent
function escapeHtml(str) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
