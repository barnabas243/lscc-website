import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const heroImage = document.querySelector(".js-hero-image");
    const heroTitle = document.querySelector(".js-hero-title");
    const heroDescription = document.querySelector(".js-hero-description");
    const heroButtons = document.querySelector(".js-hero-buttons");

    if (!(heroTitle instanceof HTMLElement)) return;

    animateHeroImage(heroImage);
    animateHeroText(heroTitle, heroDescription, heroButtons);
});

/**
 * Animate background hero image
 * @param {Element | null} image
 */
function animateHeroImage(image) {
    if (!(image instanceof HTMLElement)) return;

    gsap.fromTo(
        image,
        {
            scale: 1.08,
            opacity: 0,
            filter: "blur(8px)",
        },
        {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 2,
            ease: "power2.out",
        },
    );

    gsap.to(image, {
        y: 0,
        repeat: -1,
        yoyo: true,
        duration: 10,
        ease: "sine.inOut",
    });
}

/**
 * Animate hero title, description, and buttons
 * @param {HTMLElement} titleEl
 * @param {Element | null} descriptionEl
 * @param {Element | null} buttonsWrapper
 */
function animateHeroText(titleEl, descriptionEl, buttonsWrapper) {
    const highlightWords = ["God", "Gospel", "Arise"];
    const rawWords = titleEl.textContent?.trim().split(/\s+/) || [];

    titleEl.innerHTML = rawWords
        .map((word) => {
            const plain = word.replace(/[^\w]/g, "");
            const isHighlight = highlightWords.includes(plain);
            return `<span class="hero-word${isHighlight ? " highlighted-word" : ""}">${word}</span>`;
        })
        .join(" ");

    const heroWords = titleEl.querySelectorAll(".hero-word");

    if (!heroWords.length) return;

    const tl = gsap.timeline({ delay: 0.2 });

    gsap.set(heroWords, { opacity: 0, y: 50 });
    tl.to(heroWords, {
        y: 0,
        opacity: 1,
        ease: "back.out(1.7)",
        stagger: 0.1,
    });

    if (
        descriptionEl instanceof HTMLElement &&
        descriptionEl.textContent.trim()
    ) {
        gsap.set(descriptionEl, { opacity: 0, y: 20 });
        tl.to(
            descriptionEl,
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
            },
            "-=1.0",
        );
    }

    if (buttonsWrapper instanceof HTMLElement) {
        tl.fromTo(
            buttonsWrapper,
            { opacity: 0, scale: 0.95, y: 20 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.5)",
            },
            "-=0.8",
        );

        const buttons = buttonsWrapper.querySelectorAll("a");
        buttons.forEach((btn) => {
            btn.addEventListener("mouseenter", () =>
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out",
                }),
            );
            btn.addEventListener("mouseleave", () =>
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                }),
            );
        });
    }
}
