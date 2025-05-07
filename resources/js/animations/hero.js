import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const heroImage = document.querySelector(".js-hero-image");
    const heroTitle = document.querySelector(".js-hero-title");
    const heroDescription = document.querySelector(".js-hero-description");
    const heroButtons = document.querySelector(".js-hero-buttons");

    if (!heroTitle) return;

    // Initial state
    gsap.set([heroTitle, heroDescription, heroButtons], {
        opacity: 0,
        y: 60,
    });

    // Hero image entrance
    if (heroImage) {
        gsap.fromTo(
            heroImage,
            {
                scale: 1.08,
                opacity: 0,
                transformOrigin: "center center",
            },
            {
                scale: 1,
                opacity: 1,
                duration: 2,
                ease: "power2.out",
            },
        );
    }

    // Title, description, button entrance
    const loadTimeline = gsap.timeline();

    loadTimeline
        .to(heroTitle, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
        })
        .to(
            heroDescription,
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
            },
            "-=0.6",
        )
        .to(
            heroButtons,
            {
                opacity: 1,
                y: 0,
                duration: 0.4, // 👈 shorter button animation
                ease: "power2.out",
            },
            "-=0.4",
        );

    // Scroll-triggered fade out/in
    gsap.timeline({
        scrollTrigger: {
            trigger: heroTitle,
            start: "top top",
            end: "bottom top",
            scrub: true,
        },
    })
        .to(heroTitle, { opacity: 0, y: -10, ease: "power2.out" }, 0)
        .to(heroDescription, { opacity: 0, y: -10, ease: "power2.out" }, 0)
        .to(heroButtons, { opacity: 0, y: -20, ease: "power2.out" }, 0);
});
